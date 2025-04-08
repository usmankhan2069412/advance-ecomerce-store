from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional, Dict, Any
import logging
import time
from models import ProductCreate, ProductResponse, ProductSustainability, SustainabilityMetric, Category, Attribute
from utils import verify_token, get_supabase_client, security

__all__ = ['router']

# Configure logging
logger = logging.getLogger(__name__)

# Initialize routers
router = APIRouter(prefix="/api/products", tags=["products"])
category_router = APIRouter(prefix="/api/categories", tags=["categories"])
attribute_router = APIRouter(prefix="/api/attributes", tags=["attributes"])

# Category endpoints
@category_router.get("/", response_model=List[Category])
async def get_categories(token_payload: Dict = Depends(verify_token)):
    """
    Get all product categories
    
    @param token_payload: Authenticated user information
    @return: List of categories
    """
    supabase = get_supabase_client()
    try:
        response = supabase.table("categories").select("*").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching categories: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@category_router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)
async def create_category(category: Category, token_payload: Dict = Depends(verify_token)):
    """
    Create a new category (admin only)
    
    @param category: Category data
    @param token_payload: Authenticated user information
    @return: Created category
    """
    if token_payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create categories")
    
    supabase = get_supabase_client()
    try:
        response = supabase.table("categories").insert(category.dict()).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating category: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error creating category: {str(e)}")


@router.get("/", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    token_payload: Dict = Depends(verify_token)
):
    """
    Get all products with optional filtering
    
    @param category: Filter by category
    @param tag: Filter by tag
    @param min_price: Minimum price filter
    @param max_price: Maximum price filter
    @param sort_by: Field to sort by
    @param sort_order: Sort order (asc or desc)
    @param limit: Number of products to return
    @param offset: Number of products to skip
    @param token_payload: Authenticated user information
    @return: List of products
    """
    logger.info(f"Products request received with filters: category={category}, tag={tag}")
    supabase = get_supabase_client()
    
    try:
        # Start building the query
        query = supabase.table("products").select("*")
        
        # Apply filters
        if category:
            query = query.eq("category", category)
        
        if min_price is not None:
            query = query.gte("price", min_price)
            
        if max_price is not None:
            query = query.lte("price", max_price)
        
        # Apply sorting
        query = query.order(sort_by, ascending=(sort_order.lower() == "asc"))
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1)
        
        # Execute query
        response = query.execute()
        
        if not response.data:
            return []
        
        # Get user's favorites if user is authenticated
        user_id = token_payload.get("sub")
        favorites = []
        
        if user_id:
            favorites_response = supabase.table("user_favorites")\
                .select("product_id")\
                .eq("user_id", user_id)\
                .execute()
            
            if favorites_response.data:
                favorites = [item["product_id"] for item in favorites_response.data]
        
        # Mark favorites in the response
        products = []
        for product in response.data:
            product_response = dict(product)
            product_response["isFavorite"] = product["id"] in favorites
            products.append(product_response)
        
        logger.info(f"Retrieved {len(products)} products successfully")
        return products
    
    except Exception as e:
        logger.error(f"Error fetching products: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, token_payload: Dict = Depends(verify_token)):
    """
    Get a product by ID
    
    @param product_id: ID of the product to retrieve
    @param token_payload: Authenticated user information
    @return: Product details
    """
    logger.info(f"Product request received for ID {product_id}")
    supabase = get_supabase_client()
    
    try:
        # Get product
        response = supabase.table("products")\
            .select("*")\
            .eq("id", product_id)\
            .execute()
        
        if not response.data:
            logger.warning(f"Product not found: {product_id}")
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = dict(response.data[0])
        
        # Check if product is in user's favorites
        user_id = token_payload.get("sub")
        product["isFavorite"] = False
        
        if user_id:
            favorites_response = supabase.table("user_favorites")\
                .select("*")\
                .eq("user_id", user_id)\
                .eq("product_id", product_id)\
                .execute()
            
            product["isFavorite"] = len(favorites_response.data) > 0
        
        logger.info(f"Product {product_id} retrieved successfully")
        return product
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate, token_payload: Dict = Depends(verify_token)):
    """
    Create a new product
    
    @param product: Product data
    @param token_payload: Authenticated user information
    @return: Created product
    """
    logger.info(f"Create product request received for {product.name}")
    supabase = get_supabase_client()
    
    # Check if user has admin role
    user_id = token_payload.get("sub")
    user_role = token_payload.get("role", "user")
    
    if user_role != "admin":
        logger.warning(f"Unauthorized product creation attempt by user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create products"
        )
    
    try:
        # Prepare product data
        product_data = product.dict()
        product_data["created_at"] = "now()"
        product_data["updated_at"] = "now()"
        
        # Insert product
        response = supabase.table("products")\
            .insert(product_data)\
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create product")
        
        created_product = dict(response.data[0])
        created_product["isFavorite"] = False
        
        logger.info(f"Product created successfully with ID {created_product['id']}")
        return created_product
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductCreate, token_payload: Dict = Depends(verify_token)):
    """
    Update a product
    
    @param product_id: ID of the product to update
    @param product: Updated product data
    @param token_payload: Authenticated user information
    @return: Updated product
    """
    logger.info(f"Update product request received for ID {product_id}")
    supabase = get_supabase_client()
    
    # Check if user has admin role
    user_id = token_payload.get("sub")
    user_role = token_payload.get("role", "user")
    
    if user_role != "admin":
        logger.warning(f"Unauthorized product update attempt by user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update products"
        )
    
    try:
        # Check if product exists
        check_response = supabase.table("products")\
            .select("id")\
            .eq("id", product_id)\
            .execute()
        
        if not check_response.data:
            logger.warning(f"Product not found for update: {product_id}")
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Prepare update data
        update_data = product.dict()
        update_data["updated_at"] = "now()"
        
        # Update product
        response = supabase.table("products")\
            .update(update_data)\
            .eq("id", product_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update product")
        
        updated_product = dict(response.data[0])
        updated_product["isFavorite"] = False
        
        # Check if product is in user's favorites
        if user_id:
            favorites_response = supabase.table("user_favorites")\
                .select("*")\
                .eq("user_id", user_id)\
                .eq("product_id", product_id)\
                .execute()
            
            updated_product["isFavorite"] = len(favorites_response.data) > 0
        
        logger.info(f"Product {product_id} updated successfully")
        return updated_product
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: str, token_payload: Dict = Depends(verify_token)):
    """
    Delete a product
    
    @param product_id: ID of the product to delete
    @param token_payload: Authenticated user information
    """
    logger.info(f"Delete product request received for ID {product_id}")
    supabase = get_supabase_client()
    
    # Check if user has admin role
    user_id = token_payload.get("sub")
    user_role = token_payload.get("role", "user")
    
    if user_role != "admin":
        logger.warning(f"Unauthorized product deletion attempt by user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete products"
        )
    
    try:
        # Check if product exists
        check_response = supabase.table("products")\
            .select("id")\
            .eq("id", product_id)\
            .execute()
        
        if not check_response.data:
            logger.warning(f"Product not found for deletion: {product_id}")
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Delete product
        supabase.table("products")\
            .delete()\
            .eq("id", product_id)\
            .execute()
        
        logger.info(f"Product {product_id} deleted successfully")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")


@router.get("/{product_id}/sustainability", response_model=ProductSustainability)
async def get_product_sustainability(product_id: str, token_payload: Dict = Depends(verify_token)):
    """
    Get sustainability information for a product
    
    @param product_id: ID of the product
    @param token_payload: Authenticated user information
    @return: Sustainability information
    """
    logger.info(f"Sustainability info request for product ID {product_id}")
    supabase = get_supabase_client()
    
    try:
        # Check if product exists
        product_response = supabase.table("products")\
            .select("id,sustainabilityScore")\
            .eq("id", product_id)\
            .execute()
        
        if not product_response.data:
            logger.warning(f"Product not found: {product_id}")
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = product_response.data[0]
        score = product.get("sustainabilityScore", 3)
        
        # Determine sustainability level
        level = "high" if score >= 4 else "medium" if score >= 3 else "low"
        
        # Generate metrics based on score
        metrics = [
            SustainabilityMetric(
                name="Carbon Footprint",
                value=f"{20 - score * 2}kg CO₂",
                description=f"{score * 10}% less than industry average"
            ),
            SustainabilityMetric(
                name="Water Usage",
                value=f"{1000 - score * 100}L",
                description="Recycled water processes used"
            ),
            SustainabilityMetric(
                name="Ethical Labor",
                value="100%",
                description="Fair wage certified factories"
            )
        ]
        
        sustainability_info = ProductSustainability(
            product_id=product_id,
            level=level,
            score=score,
            metrics=metrics
        )
        
        logger.info(f"Sustainability info retrieved for product {product_id}")
        return sustainability_info
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching sustainability info: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching sustainability info: {str(e)}")


@router.post("/{product_id}/favorite", status_code=status.HTTP_200_OK)
async def toggle_favorite(product_id: str, token_payload: Dict = Depends(verify_token)):
    """
    Toggle a product as favorite for the current user
    
    @param product_id: ID of the product
    @param token_payload: Authenticated user information
    @return: Updated favorite status
    """
    user_id = token_payload.get("sub")
    logger.info(f"Toggle favorite request for product {product_id} by user {user_id}")
    supabase = get_supabase_client()
    
    try:
        # Check if product exists
        product_response = supabase.table("products")\
            .select("id")\
            .eq("id", product_id)\
            .execute()
        
        if not product_response.data:
            logger.warning(f"Product not found: {product_id}")
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if already favorited
        favorite_response = supabase.table("user_favorites")\
            .select("*")\
            .eq("user_id", user_id)\
            .eq("product_id", product_id)\
            .execute()
        
        is_favorite = len(favorite_response.data) > 0
        
        if is_favorite:
            # Remove from favorites
            supabase.table("user_favorites")\
                .delete()\
                .eq("user_id", user_id)\
                .eq("product_id", product_id)\
                .execute()
            
            logger.info(f"Product {product_id} removed from favorites for user {user_id}")
            return {"isFavorite": False}
        else:
            # Add to favorites
            supabase.table("user_favorites")\
                .insert({
                    "user_id": user_id,
                    "product_id": product_id,
                    "created_at": "now()"
                })\
                .execute()
            
            logger.info(f"Product {product_id} added to favorites for user {user_id}")
            return {"isFavorite": True}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error toggling favorite: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error toggling favorite: {str(e)}")