'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    if (showButton && buttonRef.current) {
      gsap.fromTo(buttonRef.current, 
        { x: '100%', opacity: 0 }, 
        { x: '0%', opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [showButton]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt.');
    } else {
      console.log('User dismissed the PWA install prompt.');
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleInstallClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px', // Position on the rightmost corner
        padding: '15px 30px',
        background: `linear-gradient(to right, #8A2BE2, transparent), radial-gradient(circle at top left, rgba(255,255,255,0.2) 1%, transparent 2%), radial-gradient(circle at bottom right, rgba(255,255,255,0.1) 1%, transparent 2%), radial-gradient(circle at center, rgba(255,255,255,0.15) 1%, transparent 2%)`,
        backgroundColor: 'rgba(138, 43, 226, 0.7)', // Fallback for transparency
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(5px)', // Glass effect
        WebkitBackdropFilter: 'blur(5px)',
        zIndex: 1000,
        overflow: 'hidden', // Ensure spackle doesn't bleed outside
      }}
    >
      Install App
    </button>
  );
};

export default PWAInstallPrompt; 