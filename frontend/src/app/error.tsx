"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-600 max-w-md text-center mb-8">
        We apologize for the inconvenience. Our team has been notified of this
        issue.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors mr-4"
      >
        Try again
      </button>
      <button
        onClick={() => (window.location.href = "/")}
        className="px-6 py-3 bg-white text-black border border-black font-medium rounded-md hover:bg-gray-100 transition-colors"
      >
        Return to Homepage
      </button>
    </div>
  );
}
