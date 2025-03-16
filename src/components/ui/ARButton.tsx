"use client";

import { useState, useEffect } from "react";
import { Cube } from "lucide-react";
import { Button } from "./Button";

interface ARButtonProps {
  modelUrl: string;
  fallbackImageUrl: string;
  productName: string;
  className?: string;
}

export function ARButton({
  modelUrl,
  fallbackImageUrl,
  productName,
  className,
}: ARButtonProps) {
  const [isARSupported, setIsARSupported] = useState(false);

  useEffect(() => {
    // Check if AR is supported
    const checkARSupport = () => {
      return !!(
        navigator.xr?.isSessionSupported ||
        // @ts-ignore - webkit AR support
        window.webkit?.messageHandlers?.webxr ||
        // @ts-ignore - Scene Viewer support
        window.SceneViewer
      );
    };

    setIsARSupported(checkARSupport());
  }, []);

  const launchAR = () => {
    // iOS AR QuickLook
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      window.location.href = `${modelUrl}#allowsContentScaling=0&canonicalWebPageURL=${encodeURIComponent(
        window.location.href,
      )}`;
      return;
    }

    // Android Scene Viewer
    if (/Android/.test(navigator.userAgent)) {
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        modelUrl,
      )}&mode=ar_preferred&title=${encodeURIComponent(
        productName,
      )}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
        window.location.href,
      )};end;`;
      return;
    }

    // Fallback for unsupported devices
    window.open(fallbackImageUrl, "_blank");
  };

  if (!isARSupported) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      onClick={launchAR}
      className={className}
      aria-label={`View ${productName} in augmented reality`}
    >
      <Cube className="mr-2 h-5 w-5" />
      View in AR
    </Button>
  );
}
