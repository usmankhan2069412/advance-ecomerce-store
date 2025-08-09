// Chunk loading error handling for Next.js
// This file handles chunk loading failures and provides fallback mechanisms

(function() {
  'use strict';

  // Track failed chunks to avoid infinite retry loops
  const failedChunks = new Set();
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  // Override the default chunk loading error handler
  if (typeof window !== 'undefined') {
    // Handle chunk loading errors
    window.addEventListener('error', function(event) {
      const { target, message } = event;
      
      // Check if this is a chunk loading error
      if (target && target.tagName === 'SCRIPT' && target.src) {
        const chunkUrl = target.src;
        
        // Check if this is a webpack chunk
        if (chunkUrl.includes('/_next/static/chunks/') || chunkUrl.includes('.js')) {
          console.warn('Chunk loading failed:', chunkUrl);
          handleChunkError(chunkUrl, target);
        }
      }
      
      // Handle other script loading errors
      if (message && (message.includes('Loading chunk') || message.includes('ChunkLoadError'))) {
        console.warn('Chunk loading error detected:', message);
        handleGenericChunkError();
      }
    });

    // Handle unhandled promise rejections that might be chunk-related
    window.addEventListener('unhandledrejection', function(event) {
      const { reason } = event;
      
      if (reason && typeof reason === 'object') {
        const errorMessage = reason.message || reason.toString();
        
        if (errorMessage.includes('Loading chunk') || 
            errorMessage.includes('ChunkLoadError') ||
            errorMessage.includes('Loading CSS chunk')) {
          console.warn('Chunk loading promise rejection:', errorMessage);
          handleGenericChunkError();
        }
      }
    });
  }

  function handleChunkError(chunkUrl, scriptElement) {
    const chunkId = extractChunkId(chunkUrl);
    
    if (failedChunks.has(chunkId)) {
      console.error('Chunk loading failed multiple times:', chunkId);
      showChunkErrorMessage();
      return;
    }
    
    failedChunks.add(chunkId);
    
    // Remove the failed script element
    if (scriptElement && scriptElement.parentNode) {
      scriptElement.parentNode.removeChild(scriptElement);
    }
    
    // Retry loading the chunk after a delay
    setTimeout(() => {
      retryChunkLoad(chunkUrl, chunkId);
    }, retryDelay);
  }

  function handleGenericChunkError() {
    // For generic chunk errors, try to reload the page as a last resort
    if (confirm('A loading error occurred. Would you like to refresh the page?')) {
      window.location.reload();
    }
  }

  function extractChunkId(url) {
    // Extract chunk ID from URL for tracking
    const match = url.match(/chunks\/(.+?)\.js/);
    return match ? match[1] : url;
  }

  function retryChunkLoad(chunkUrl, chunkId) {
    console.log('Retrying chunk load:', chunkId);
    
    // Create a new script element
    const script = document.createElement('script');
    script.src = chunkUrl;
    script.async = true;
    
    // Add cache busting parameter
    const separator = chunkUrl.includes('?') ? '&' : '?';
    script.src += `${separator}_retry=${Date.now()}`;
    
    script.onload = function() {
      console.log('Chunk loaded successfully on retry:', chunkId);
      failedChunks.delete(chunkId);
    };
    
    script.onerror = function() {
      console.error('Chunk retry failed:', chunkId);
      showChunkErrorMessage();
    };
    
    document.head.appendChild(script);
  }

  function showChunkErrorMessage() {
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    errorDiv.innerHTML = `
      <strong>Loading Error</strong><br>
      Some resources failed to load. Please refresh the page.
      <br><br>
      <button onclick="window.location.reload()" style="
        background: white;
        color: #ff4444;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        font-weight: bold;
      ">Refresh Page</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 10000);
  }

  // Export for potential use in other modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      handleChunkError,
      handleGenericChunkError
    };
  }
})();