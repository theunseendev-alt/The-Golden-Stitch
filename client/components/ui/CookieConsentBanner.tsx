import React, { useState, useEffect } from 'react';
import { Button } from './button';

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  useEffect(() => {
    // Check if cookies are enabled
    setCookiesEnabled(navigator.cookieEnabled);

    // Check consent from cookie
    const consent = document.cookie.split('; ').find(row => row.startsWith('cookieConsent='));
    if (!consent || consent.split('=')[1] !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie that expires in 1 year
    document.cookie = 'cookieConsent=true; path=/; max-age=31536000';
    setIsVisible(false);
  };

  const handleRevoke = () => {
    // Remove cookie by setting expiry in past
    document.cookie = 'cookieConsent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setIsVisible(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Accept cookies when a note is dropped
    handleAccept();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 text-white p-4 flex items-center justify-between z-50 transition-all duration-200 ${
        isDragOver ? 'bg-green-900 border-2 border-dashed border-green-400' : 'bg-gray-900'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div>
        <p className="text-sm">
          {!cookiesEnabled
            ? 'Cookies are disabled in your browser. Please enable cookies to use this site fully.'
            : isDragOver
            ? '🎯 Drop a note here to accept cookies!'
            : 'We use cookies to enhance your experience on our site. Drag a note here or click Accept to agree to our use of cookies.'
          }
        </p>
      </div>
      {cookiesEnabled && (
        <Button onClick={handleAccept} variant="secondary" size="sm">
          Accept
        </Button>
      )}
    </div>
  );
};

export default CookieConsentBanner;