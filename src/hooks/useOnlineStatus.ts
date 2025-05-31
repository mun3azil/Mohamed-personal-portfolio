'use client';

import { useState, useEffect } from 'react';


/**
 * Custom hook for tracking online/offline status
 * @returns Object with online status and connection info
 */
function useOnlineStatusBase() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // If user was offline, show they're back online
      if (wasOffline) {
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return {
    isOnline,
    wasOffline,
    connectionStatus: isOnline ? 'online' : 'offline'
  };
}

/**
 * Hook for network connection quality estimation
 * @returns Object with connection info
 */
function useConnectionQualityBase() {
  const [connectionInfo, setConnectionInfo] = useState<{
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  }>({});

  useEffect(() => {
    // Check if NetworkInformation API is available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateConnectionInfo = () => {
        setConnectionInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      };

      // Initial update
      updateConnectionInfo();

      // Listen for changes
      connection.addEventListener('change', updateConnectionInfo);

      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
      };
    }
  }, []);

  const getConnectionQuality = () => {
    if (!connectionInfo.effectiveType) return 'unknown';
    
    switch (connectionInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'poor';
      case '3g':
        return 'good';
      case '4g':
        return 'excellent';
      default:
        return 'unknown';
    }
  };

  return {
    ...connectionInfo,
    quality: getConnectionQuality()
  };
}

export { useOnlineStatusBase as useOnlineStatus, useConnectionQualityBase as useConnectionQuality };
