'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [closed, setClosed] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);

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
    if (showButton && promptRef.current) {
      gsap.fromTo(promptRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [showButton]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowButton(false);
  };

  const handleClose = () => {
    setClosed(true);
  };

  if (!showButton || closed) return null;

  return (
    <div
      ref={promptRef}
      className="fixed z-50 flex flex-col items-center
        right-6 bottom-6 left-auto transform-none
        sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:bottom-[5.5rem] sm:max-w-[90vw]"
      style={{ pointerEvents: 'auto', transition: 'box-shadow 0.2s' }}
    >
      <div className="relative w-full flex justify-center">
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 bg-white/80 hover:bg-gray-100 border border-gray-200 rounded-full p-1 shadow-sm focus:outline-none"
          aria-label="Close install prompt"
          tabIndex={0}
          style={{ zIndex: 10 }}
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg border border-gray-200"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <Download className="w-4 h-4" />
          Install App
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt; 