from typing import Dict
import os
import jwt
import logging
from supabase import create_client, Client
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Configure logging
logger = logging.getLogger(__name__)

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