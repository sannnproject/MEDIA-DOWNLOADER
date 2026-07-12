"use client";

import { useState, useEffect } from "react";
import { Download, Link as LinkIcon, AlertCircle, CheckCircle2, X, Loader2, Sparkles, Server, ShieldCheck, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function isUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function gatherLinks(obj: any): { label: string, url: string }[] {
  const links: { label: string, url: string }[] = [];
  
  if (typeof obj === 'string' && isUrl(obj)) {
    links.push({ label: 'Media Source', url: obj });
    return links;
  }
  
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === 'string' && isUrl(item)) {
        links.push({ label: `Media Link ${index + 1}`, url: item });
      } else if (typeof item === 'object') {
        links.push(...gatherLinks(item));
      }
    });
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string' && isUrl(value)) {
        // Clean up keys for better display
        const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        links.push({ label: cleanKey, url: value });
      } else if (typeof value === 'object') {
        const nested = gatherLinks(value);
        nested.forEach(n => links.push({ label: `${key} - ${n.label}`, url: n.url }));
      }
    });
  }
  return links;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Show popup immediately upon first visit
    setShowPopup(true);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    // Show install prompt if community popup is closed and prompt is available
    if (!showPopup && deferredPrompt) {
      const showTimer = setTimeout(() => {
        setShowInstallPopup(true);
      }, 500); // Small delay after closing modal
      
      const hideTimer = setTimeout(() => {
        setShowInstallPopup(false);
      }, 8500); // Hide after 8s automatically

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showPopup, deferredPrompt]);

  const handleInstallClick = async () => {
    setShowInstallPopup(false);
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`, {
        method: "GET",
      });
      const data = await res.json();
      if (!data.Status) {
        setError(data.Error || "Failed to process the URL.");
      } else {
        setResult(data.Result);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const links = result ? gatherLinks(result) : [];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#E2E8F0]">
      {/* Sticky Navigation Menu Bar */}
      <header className="h-[60px] sticky top-0 z-40 bg-[#E2E8F0]/90 backdrop-blur-md border-b flex items-center px-4 md:px-[24px] border-[#D0D5D2]">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="w-[32px] h-[32px] bg-[#020817] rounded-[6px] flex items-center justify-center">
              <Download className="w-[18px] h-[18px] text-[#FF9E33]" strokeWidth={2.5} />
            </div>
            <span className="text-[#020817] font-medium text-[16px] tracking-tight">
              MEDIA Downloader
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-[24px]">
            <a href="#" className="text-[#1863DC] text-[14px] font-medium leading-[22px] py-[8px] px-[12px] border-b-2 border-[#FF9E33]">
              Home
            </a>
            <a href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L" target="_blank" rel="noopener noreferrer" className="text-[#020817] text-[14px] font-medium leading-[22px] py-[8px] px-[12px] border-b-2 border-transparent hover:text-[#1863DC] hover:border-[#FF9E33] transition-colors">
              Community
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-[24px] md:px-[40px] py-[40px] md:py-[80px] flex flex-col gap-[24px] md:gap-[32px]">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center mb-[16px] md:mb-[32px] text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-[8px] bg-[#FFDBC4] text-[#38102A] px-[16px] py-[8px] rounded-[50px] mb-[24px] font-medium text-[12px] md:text-[14px]"
          >
            <Sparkles className="w-[16px] h-[16px] text-[#FF9E33]" />
            <span>Fast, Secure, and Universal API Integration</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-[32px] md:text-[48px] font-medium leading-[1.2] text-[#020817] mb-[16px] max-w-4xl"
          >
            Universal Media Downloader
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-[16px] md:text-[18px] font-normal leading-[1.5] text-[#212121] mb-[40px] max-w-2xl px-4"
          >
            Retrieve videos and media from your favorite social platforms instantly. Built with a professional-grade architecture ensuring high availability and zero downtime.
          </motion.p>
          
          {/* Main Input Card (Card Light) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-3xl bg-[#FFFFFF] p-[24px] rounded-[9px] border border-[#E2E8F0] shadow-[0px_4px_12px_rgba(0,0,0,0.1)] relative z-10"
          >
            <form onSubmit={handleDownload} className="flex flex-col md:flex-row gap-[16px]">
              <div className="flex-1 relative">
                <input 
                  type="url" 
                  placeholder="Paste URL here (e.g. https://vt.tiktok.com/...)" 
                  className="w-full h-[44px] bg-[#FFFFFF] text-[#212121] text-[16px] font-normal px-[16px] rounded-[4px] border border-[#D0D5D2] placeholder:text-[#CCCCCC] focus:border-2 focus:border-[#1863DC] focus:ring-[4px] focus:ring-[rgba(24,99,220,0.1)] focus:outline-none transition-all"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <motion.button 
                whileHover={{ scale: (url && !loading) ? 1.02 : 1 }}
                whileTap={{ scale: (url && !loading) ? 0.98 : 1 }}
                type="submit" 
                disabled={loading || !url}
                className="h-[44px] shrink-0 bg-[#FF9E33] text-[#FFFFFF] text-[14px] font-medium px-[24px] rounded-[2px] border-[2px] border-[#FF9E33] hover:bg-[#FFB700] hover:border-[#FFB700] active:bg-[#E8A025] active:border-[#E8A025] disabled:bg-[#CCCCCC] disabled:border-[#CCCCCC] disabled:text-[#FFFFFF] disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-[8px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-[18px] h-[18px] animate-spin" /> Processing
                  </>
                ) : (
                  <>
                    <Download className="w-[18px] h-[18px]" /> Extract Media
                  </>
                )}
              </motion.button>
            </form>
            
            {/* Error Badge */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="inline-flex items-center gap-[8px] bg-[#BE2B2D] text-[#FFFFFF] text-[12px] font-medium px-[12px] py-[6px] rounded-[16px]">
                    <AlertCircle className="w-[14px] h-[14px]" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.section 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full"
            >
              <div className="w-full max-w-3xl bg-[#FFFFFF] p-[24px] md:p-[32px] rounded-[9px] border border-[#E2E8F0] shadow-[0px_4px_12px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-[24px] border-b border-[#EBEBEB] pb-[16px] gap-[12px]">
                  <div>
                    <h3 className="text-[24px] md:text-[28px] font-medium leading-[1.2] text-[#000000]">Extraction Complete</h3>
                    <p className="text-[#212121] text-[14px] mt-[4px]">Preview and download your requested media.</p>
                  </div>
                  <div className="bg-[#008000] text-[#FFFFFF] text-[12px] font-medium px-[12px] py-[6px] rounded-[16px] flex items-center gap-[6px] shrink-0">
                     <CheckCircle2 className="w-[14px] h-[14px]" /> Success
                  </div>
                </div>

                {links.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[24px]">
                    {links.map((link, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        key={idx} 
                        className="flex flex-col justify-between p-[20px] border border-[#D0D5D2] rounded-[6px] bg-[#F4F4F4] hover:border-[#1863DC] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all group"
                      >
                        <div className="flex items-start gap-[12px] mb-[16px]">
                          <div className="w-[40px] h-[40px] bg-[#FFFFFF] rounded-[4px] border border-[#EBEBEB] flex items-center justify-center shrink-0 shadow-sm">
                            <LinkIcon className="w-[20px] h-[20px] text-[#1863DC]" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-[14px] font-medium text-[#020817] truncate" title={link.label}>
                              {link.label}
                            </h4>
                            <p className="text-[12px] text-[#212121] opacity-70 truncate mt-[2px]">Ready to access</p>
                          </div>
                        </div>
                        <a 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-[40px] flex items-center justify-center gap-[8px] bg-transparent text-[#1863DC] border-[2px] border-[#1863DC] rounded-[2px] text-[14px] font-medium transition-colors hover:bg-[rgba(24,99,220,0.05)] active:bg-[rgba(24,99,220,0.1)]"
                        >
                          <Download className="w-[16px] h-[16px]" /> Access Media
                        </a>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-[32px] text-center border border-[#EBEBEB] rounded-[6px] bg-[#F4F4F4] mb-[24px]">
                    <p className="text-[16px] font-normal leading-[25px] text-[#212121]">
                      No extractable URLs were found in the response.
                    </p>
                  </div>
                )}

                <details className="group border border-[#EBEBEB] rounded-[6px] overflow-hidden">
                  <summary className="bg-[#F4F4F4] text-[#020817] text-[14px] font-medium leading-[24px] p-[16px] hover:bg-[#E2E8F0] cursor-pointer transition-colors user-select-none outline-none flex items-center justify-between">
                    <span>View Technical Payload</span>
                    <span className="text-[12px] opacity-60 group-open:hidden">Expand</span>
                    <span className="text-[12px] opacity-60 hidden group-open:block">Collapse</span>
                  </summary>
                  <div className="p-[16px] bg-[#FFFFFF] text-[12px] font-mono text-[#212121] whitespace-pre-wrap overflow-x-auto max-h-[400px] overflow-y-auto border-t border-[#EBEBEB]">
                    {JSON.stringify(result, null, 2)}
                  </div>
                </details>

              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Info Grid (Features & Supported Platforms) */}
        <section className="w-full max-w-4xl mx-auto mt-[16px] md:mt-[32px] grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {/* Card Default (Warm) */}
          <div className="md:col-span-1 flex flex-col gap-[24px]">
            <div className="bg-[#FFDBC4] p-[24px] rounded-[9px] text-[#38102A] h-full shadow-[0px_4px_12px_rgba(0,0,0,0.1)] flex flex-col items-start">
              <div className="w-[48px] h-[48px] bg-[#FFFFFF] rounded-[6px] flex items-center justify-center mb-[16px] shadow-sm">
                <Globe className="w-[24px] h-[24px] text-[#FF9E33]" />
              </div>
              <h3 className="text-[18px] font-medium leading-[24px] mb-[8px]">Global Reach</h3>
              <p className="text-[14px] font-normal leading-[21px] flex-1">
                Servers optimized globally to fetch your content with ultra-low latency and unparalleled reliability.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-[#FFFFFF] p-[24px] md:p-[32px] rounded-[9px] border border-[#E2E8F0] shadow-[0px_4px_12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-[12px] mb-[16px] pb-[16px] border-b border-[#EBEBEB]">
              <Server className="w-[24px] h-[24px] text-[#1863DC]" />
              <h3 className="text-[18px] font-medium leading-[24px] text-[#020817]">Supported Networks</h3>
            </div>
            <p className="text-[14px] font-normal leading-[24px] text-[#212121]">
               Our infrastructure seamlessly routes requests to support an expansive array of content networks including:<br/>
               <span className="font-medium mt-[8px] block opacity-80">
                 Tiktok, Douyin, Capcut, Threads, Instagram, Facebook, Espn, Pinterest, imdb, imgur, ifunny, Izlesene, Reddit, Youtube, Twitter, Vimeo, Snapchat, Bilibili, Dailymotion, Sharechat, Likee, Linkedin, Tumblr, Telegram, Spotify, Soundcloud, and dozens more.
               </span>
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#D0D5D2] py-[40px] bg-[#FFFFFF] px-4 mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-[24px]">
          
          <div className="flex flex-col items-center md:items-start gap-[8px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[24px] h-[24px] bg-[#020817] rounded-[4px] flex items-center justify-center">
                <Download className="w-[14px] h-[14px] text-[#FF9E33]" strokeWidth={2.5} />
              </div>
              <p className="text-[16px] font-medium leading-[24px] text-[#020817] tracking-tight">
                MEDIA Downloader
              </p>
            </div>
            <p className="text-[14px] font-normal leading-[24px] text-[#212121] max-w-sm text-center md:text-left">
              Enterprise-grade media extraction tooling. Reliable, fast, and universally accessible.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end md:text-right gap-[4px]">
            <p className="text-[14px] font-normal leading-[24px] text-[#212121]">
              Developed & Maintained by <span className="font-medium text-[#020817]">SANN404 FORUM!!</span>
            </p>
            <p className="text-[12px] font-medium leading-[20px] text-[#1863DC] uppercase tracking-wider mb-[4px]">
              SANN FORUM GROUP © {new Date().getFullYear()}
            </p>
            <a href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L" target="_blank" rel="noopener noreferrer" className="text-[#1863DC] text-[14px] font-medium leading-[24px] hover:underline hover:underline-offset-4 flex items-center gap-[6px]">
              Join the Community Channel
            </a>
          </div>
          
        </div>
      </footer>

      {/* Modern Modal / Popup Layer */}
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020817]/40 backdrop-blur-sm"
          >
            {/* Card Dark (Modal) */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#38102A] text-[#FFFFFF] w-full max-w-[420px] p-[32px] rounded-[6px] shadow-[0px_32px_68px_rgba(0,0,0,0.3)] relative"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-[20px] right-[20px] text-[#FFFFFF]/50 hover:text-[#FFFFFF] transition-colors p-[4px] rounded-[2px]"
                aria-label="Close"
              >
                <X className="w-[24px] h-[24px]" />
              </button>
              
              <div className="w-[48px] h-[48px] bg-[#FFFFFF]/10 rounded-[6px] flex items-center justify-center mb-[24px]">
                <ShieldCheck className="w-[24px] h-[24px] text-[#FF9E33]" />
              </div>

              <h3 className="text-[32px] font-medium leading-[1.2] mb-[12px] tracking-tight">Stay Connected</h3>
              <p className="text-[16px] font-normal leading-[25px] mb-[32px] text-[#FFFFFF]/80">
                Join the SANN404 FORUM!! channel on WhatsApp to receive the latest updates, enterprise tools, and developer news.
              </p>
              
              <div className="flex flex-col gap-[16px]">
                <a 
                  href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setShowPopup(false)}
                  className="h-[44px] w-full bg-[#FF9E33] text-[#FFFFFF] text-[14px] font-medium px-[24px] rounded-[2px] border-[2px] border-[#FF9E33] hover:bg-[#FFB700] hover:border-[#FFB700] active:bg-[#E8A025] active:border-[#E8A025] transition-colors flex items-center justify-center"
                >
                  Join Official Channel
                </a>
                <button 
                  onClick={() => setShowPopup(false)}
                  className="h-[44px] w-full bg-transparent text-[#FF9E33] text-[14px] font-medium px-[24px] rounded-[2px] border-[2px] border-[#FF9E33] hover:bg-[rgba(255,158,51,0.1)] hover:text-[#FFB700] hover:border-[#FFB700] active:bg-[rgba(255,158,51,0.2)] active:text-[#E8A025] active:border-[#E8A025] transition-colors flex items-center justify-center"
                >
                  Continue to Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install App Popup (Top Notification) */}
      <AnimatePresence>
        {showInstallPopup && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4"
          >
            <div className="bg-[#FFFFFF] text-[#020817] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] rounded-[6px] border border-[#D0D5D2] p-[16px] max-w-sm w-full flex items-start gap-[12px]">
              <div className="w-[40px] h-[40px] bg-[#020817] rounded-[4px] flex items-center justify-center shrink-0">
                <Download className="w-[20px] h-[20px] text-[#FF9E33]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-medium leading-[20px]">Install MEDIA Downloader</h4>
                <p className="text-[12px] text-[#212121] mt-[2px]">Add to Home Screen for faster access.</p>
                <div className="flex items-center gap-[8px] mt-[12px]">
                  <button 
                    onClick={handleInstallClick}
                    className="bg-[#FF9E33] text-[#FFFFFF] text-[12px] font-medium px-[16px] py-[6px] rounded-[2px] border-2 border-[#FF9E33] hover:bg-[#FFB700] hover:border-[#FFB700] transition-colors"
                  >
                    Install App
                  </button>
                  <button 
                    onClick={() => setShowInstallPopup(false)}
                    className="bg-transparent text-[#212121] text-[12px] font-medium px-[16px] py-[6px] rounded-[2px] border border-[#D0D5D2] hover:bg-[#F4F4F4] transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

