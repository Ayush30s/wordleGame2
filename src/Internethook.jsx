import React, { useState, useEffect } from "react";

const useConnection = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setOnline(navigator.onLine);
    };

    // Add event listeners for online and offline events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [online]); // Empty dependency array to run once on mount

  return online;
};

export default useConnection;
