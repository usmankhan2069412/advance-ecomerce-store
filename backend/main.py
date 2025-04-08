from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import redis
import time
import logging
from logging.handlers import RotatingFileHandler
import jwt
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from supabase import create_client, Client
# Import product API router
from product_api import router as product_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler("app.log", maxBytes=10000000, backupCount=5),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Environment variables validation
required_env_vars = ["SUPABASE_KEY", "REDIS_HOST", "REDIS_PORT", "JWT_SECRET"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]

# Development mode detection
is_development = os.getenv("ENVIRONMENT", "development") == "development"

if missing_vars:
    if is_development:
        logger.warning(f"Running in development mode with default values for: {', '.join(missing_vars)}")
        # Set default values for development
        if not os.getenv("SUPABASE_KEY"):
            os.environ["SUPABASE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibWF0cnZjeWllZnh1a250d3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEwNDI0MDAsImV4cCI6MjAyNjYxODQwMH0.dev_key"
        if not os.getenv("REDIS_HOST"):
            os.environ["REDIS_HOST"] = "localhost"
        if not os.getenv("REDIS_PORT"):
            os.environ["REDIS_PORT"] = "6379"
        if not os.getenv("JWT_SECRET"):
            os.environ["JWT_SECRET"] = "sfvpFoW2XSafKr2r3Mg7UDTg7snSJCBf_IUrZhmPaDk"  # Updated default secret
    else:
        logger.critical(f"Missing required environment variables: {', '.join(missing_vars)}")
        raise SystemExit(1)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI app
app = FastAPI(title="E-Commerce AI Backend")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Supabase connection
def get_supabase_client() -> Client:
    """
    Get Supabase client connection
    
    @return: Supabase client instance
    """
    try:
        supabase_url = "https://lbmatrvcyiefxukntwsu.supabase.co"  # Your project URL
        supabase_key = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibWF0cnZjeWllZnh1a250d3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NjQxNjIsImV4cCI6MjA1NzU0MDE2Mn0.HEkVgFvxORyNhsrgkMpfepfYrdFcI_fp-bIg8wwLdPE")
        
        return create_client(supabase_url, supabase_key)
    except Exception as e:
        logger.error(f"Supabase connection error: {e}")
        raise HTTPException(status_code=500, detail=f"Supabase connection error: {str(e)}")

# Redis connection
try:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "localhost"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        db=0,
        decode_responses=True
    )
    # Test connection
    redis_client.ping()
    logger.info("Redis connection established successfully")
except Exception as e:
    if is_development:
        logger.warning(f"Redis connection failed, using mock Redis for development: {e}")
        # Create a simple mock Redis for development
        class MockRedis:
            def __init__(self):
                self.cache = {}
            
            def get(self, key):
                return self.cache.get(key)
                
            def set(self, key, value, ex=None):
                self.cache[key] = value
                
            def ping(self):
                return True
        
        redis_client = MockRedis()
    else:
        logger.error(f"Redis connection error: {e}")
        raise SystemExit(f"Failed to connect to Redis: {e}")

# Models
class ProductTryOn(BaseModel):
    product_id: int
    image_url: str
    user_image_url: Optional[str] = None

class TryOnResult(BaseModel):
    result_image_url: str
    processing_time_ms: float

class HealthCheck(BaseModel):
    status: str
    services: Dict[str, Dict[str, Any]]

# Authentication middleware
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify JWT token from Authorization header
    
    @param credentials: HTTP Authorization credentials
    @return: Decoded token payload
    """
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token, 
            os.getenv("JWT_SECRET"), 
            algorithms=["HS256"]
        )
        return payload
    except jwt.PyJWTError as e:
        logger.warning(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Include product router
app.include_router(product_router)

# Routes
@app.get("/")
def read_root():
    return {"message": "E-Commerce AI Backend API"}

@app.get("/api/health", response_model=HealthCheck)
async def health_check():
    """
    Comprehensive health check endpoint that verifies all service connections
    
    @return: Health status of all services
    """
    health_info = {
        "status": "healthy",
        "services": {
            "api": {"status": "healthy"},
            "redis": {"status": "unknown"},
            "database": {"status": "unknown"}
        }
    }
    
    # Check Redis
    try:
        redis_client.ping()
        health_info["services"]["redis"] = {
            "status": "healthy",
            "latency_ms": round(time.time() * 1000)
        }
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        health_info["services"]["redis"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_info["status"] = "degraded"
    
    # Check Supabase
    try:
        supabase = get_supabase_client()
        start_time = time.time()
        supabase.table("health_check").select("count", count="exact").execute()
        db_latency = (time.time() - start_time) * 1000
        
        health_info["services"]["database"] = {
            "status": "healthy",
            "latency_ms": round(db_latency)
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        health_info["services"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_info["status"] = "degraded"
    
    status_code = status.HTTP_200_OK if health_info["status"] == "healthy" else status.HTTP_503_SERVICE_UNAVAILABLE
    return health_info

@app.post("/api/try-on", response_model=TryOnResult)
@limiter.limit("10/minute")
async def virtual_try_on(request: Request, try_on_data: ProductTryOn, token_payload: Dict = Depends(verify_token)):
    """
    Virtual try-on endpoint that processes product images
    and returns a composite image with the product applied
    
    @param request: FastAPI request object
    @param try_on_data: Product and user image information
    @param token_payload: Authenticated user information
    @return: Result image URL and processing time
    """
    user_id = token_payload.get("sub")
    logger.info(f"Try-on request received for product {try_on_data.product_id} from user {user_id}")
    
    # Check cache first
    cache_key = f"try_on:{try_on_data.product_id}:{try_on_data.user_image_url}"
    cached_result = redis_client.get(cache_key)
    
    if cached_result:
        # Return cached result
        logger.info(f"Cache hit for {cache_key}")
        return TryOnResult(
            result_image_url=cached_result,
            processing_time_ms=0.0  # Cached result
        )
    
    # Get product details from Supabase
    supabase = get_supabase_client()
    
    # Fetch product from Supabase
    start_time = time.time()
    
    try:
        response = supabase.table("products").select("*").eq("id", try_on_data.product_id).execute()
        
        if not response.data:
            logger.warning(f"Product not found: {try_on_data.product_id}")
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = response.data[0]
        
        # Simulate AI processing (would connect to SageMaker in production)
        time.sleep(1)  # Simulate processing time
        
        # Generate result URL (would be from Cloudinary in production)
        result_url = f"https://example.com/try-on-results/{try_on_data.product_id}.jpg"
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        
        # Cache the result
        redis_client.set(cache_key, result_url, ex=3600)  # Cache for 1 hour
        
        # Log try-on event in Supabase
        supabase.table("try_on_logs").insert({
            "product_id": try_on_data.product_id,
            "user_id": user_id,
            "result_url": result_url,
            "processing_time_ms": processing_time,
            "created_at": "now()"
        }).execute()
        
        logger.info(f"Try-on completed for product {try_on_data.product_id} in {processing_time:.2f}ms")
        
        return TryOnResult(
            result_image_url=result_url,
            processing_time_ms=processing_time
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during try-on process: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Try-on processing error: {str(e)}")

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting E-Commerce AI Backend")
    uvicorn.run(app, host="0.0.0.0", port=8000)