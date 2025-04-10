"use client";

import { useState, useEffect, useRef } from "react";

// Correct the import path based on the actual location of the button component
import { Button } from "./Button"; // Adjusted to reflect the correct relative path

interface ARButtonProps {
  productId?: string;
  productName?: string;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "outline"
    | "link";
  size?: "sm" | "md" | "lg";
  modelUrl?: string;
  fallbackImageUrl?: string;
}

export function ARButton({
  productId = "",
  productName = "Product",
  className = "",
  variant = "primary",
  size = "md",
  modelUrl,
  fallbackImageUrl,
  ...props
}: ARButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isARSupported, setIsARSupported] = useState(false);

  // Use refs for values that shouldn't trigger re-renders
  const actualModelUrlRef = useRef(
    modelUrl || `https://example.com/models/${productId}.glb`,
  );
  const actualFallbackImageUrlRef = useRef(
    fallbackImageUrl || `https://example.com/images/${productId}.jpg`,
  );

  useEffect(() => {
    let isMounted = true;
    // Check if AR is supported
    const checkARSupport = () => {
      return !!(
        (navigator as any).xr?.isSessionSupported ||
        // @ts-ignore - webkit AR support
        window.webkit?.messageHandlers?.webxr ||
        // @ts-ignore - Scene Viewer support
        window.SceneViewer
      );
    };

    // Only set state if component is still mounted
    if (isMounted) {
      setIsARSupported(checkARSupport());
    }

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  const launchAR = () => {
    // iOS AR QuickLook
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      window.location.href = `${actualModelUrlRef.current}#allowsContentScaling=0&canonicalWebPageURL=${encodeURIComponent(
        window.location.href,
      )}`;
      return;
    }

    // Android Scene Viewer
    if (/Android/.test(navigator.userAgent)) {
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        actualModelUrlRef.current,
      )}&mode=ar_preferred&title=${encodeURIComponent(
        productName,
      )}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
        window.location.href,
      )};end;`;
      return;
    }

    // Fallback for unsupported devices
    window.open(actualFallbackImageUrlRef.current, "_blank");
  };

  if (!isARSupported) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={launchAR}
      className={className}
      aria-label={`View ${productName} in augmented reality`}
      {...props}
    >
      {/*<Cube3d className="mr-2 h-5 w-5" />*/}
      {size !== "sm" && "View in AR"}
    </Button>
  );
}
