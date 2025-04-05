from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

"""
Product database models for the e-commerce store
These models are designed to support the ProductCard component
and provide all necessary fields for the frontend display
"""

class ProductBase(BaseModel):
    """Base product model with common fields"""
    name: str = Field(..., description="Product name")
    description: str = Field(..., description="Product description")
    price: float = Field(..., description="Product price")
    image: str = Field(..., description="Main product image URL")
    sustainabilityScore: int = Field(3, description="Sustainability score from 1-5")
    isNew: bool = Field(False, description="Whether the product is new")
    

class ProductCreate(ProductBase):
    """Model for creating a new product"""
    category: str = Field(..., description="Product category")
    tags: List[str] = Field(default=[], description="Product tags")
    images: List[str] = Field(default=[], description="Additional product images")
    inventory: int = Field(0, description="Available inventory")
    sku: str = Field(..., description="Stock keeping unit")
    compareAtPrice: Optional[float] = Field(None, description="Original price for comparison")
    aiMatchScore: Optional[int] = Field(None, description="AI match score")
    aiRecommendationReason: Optional[str] = Field(None, description="AI recommendation reason")


class ProductInDB(ProductCreate):
    """Model for product as stored in database"""
    id: str = Field(..., description="Unique product ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")
    

class ProductResponse(ProductInDB):
    """Model for product response with additional fields"""
    isFavorite: bool = Field(False, description="Whether the product is in user's favorites")


class SustainabilityMetric(BaseModel):
    """Model for sustainability metrics"""
    name: str = Field(..., description="Metric name")
    value: str = Field(..., description="Metric value")
    description: str = Field(..., description="Metric description")


class ProductSustainability(BaseModel):
    """Model for product sustainability information"""
    product_id: str = Field(..., description="Product ID")
    level: str = Field(..., description="Sustainability level: high, medium, or low")
    score: int = Field(..., description="Numeric score from 1-5")
    metrics: List[SustainabilityMetric] = Field(..., description="Detailed sustainability metrics")