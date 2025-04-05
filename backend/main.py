from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import redis
import time
import logging
from logging.handlers import RotatingFileHandler
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import routers and utilities
from product_api import router as product_router
from utils import get_supabase_client, verify_token

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

# Include product router
app.include_router(product_router)

# Redis connection
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

# Virtual try-on endpoint removed as it's not being used

# The /api/products/{product_id} endpoint is now handled by the product_api router

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting E-Commerce AI Backend")
    port = int(os.getenv("PORT", 8001))  # Use environment variable or default to 8001
    uvicorn.run(app, host="0.0.0.0", port=port)