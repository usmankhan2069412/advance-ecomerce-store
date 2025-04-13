"use client";

import { useEffect, useState } from "react";
import { Badge } from "./badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { WifiOff, Wifi, WifiLow } from "lucide-react";

type ConnectionStatus = "online" | "offline" | "degraded" | "unknown";

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("unknown");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check connection status on mount and periodically
  useEffect(() => {
    // Initial check
    checkConnectionStatus();

    // Set up periodic checks
    const intervalId = setInterval(() => {
      checkConnectionStatus();
    }, 30000); // Check every 30 seconds

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setStatus("online");
      setLastChecked(new Date());
    };

    const handleOffline = () => {
      setStatus("offline");
      setLastChecked(new Date());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkConnectionStatus = async () => {
    try {
      // Check if browser reports as online
      if (!navigator.onLine) {
        setStatus("offline");
        setLastChecked(new Date());
        return;
      }

      // Try to ping Supabase
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://fighfyrrdtzjemggtbxw.supabase.co";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/health`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus("online");
          setRetryCount(0);
        } else {
          setStatus("degraded");
          setRetryCount((prev) => prev + 1);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        setStatus("degraded");
        setRetryCount((prev) => prev + 1);
        console.warn("Connection check failed:", error);
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
      setStatus("unknown");
    } finally {
      setLastChecked(new Date());
    }
  };

  // Determine the appropriate icon and color based on status
  const getStatusDetails = () => {
    switch (status) {
      case "online":
        return {
          icon: <Wifi className="h-4 w-4" />,
          color: "bg-green-500",
          label: "Connected",
          description: "Your connection to the database is working properly.",
        };
      case "offline":
        return {
          icon: <WifiOff className="h-4 w-4" />,
          color: "bg-red-500",
          label: "Offline",
          description:
            "You are currently offline. Data will be stored locally and synced when you reconnect.",
        };
      case "degraded":
        return {
          icon: <WifiLow className="h-4 w-4" />,
          color: "bg-yellow-500",
          label: "Limited Connection",
          description: `Connection to the database is unstable. Retry count: ${retryCount}. Using local storage as backup.`,
        };
      default:
        return {
          icon: <WifiLow className="h-4 w-4" />,
          color: "bg-gray-500",
          label: "Checking Connection",
          description: "Determining your connection status...",
        };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge
              variant="outline"
              className={`${statusDetails.color} text-white flex items-center gap-1 px-2 py-1`}
            >
              {statusDetails.icon}
              <span className="text-xs">{statusDetails.label}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="text-sm">
            <p>{statusDetails.description}</p>
            {lastChecked && (
              <p className="text-xs text-gray-500 mt-1">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
