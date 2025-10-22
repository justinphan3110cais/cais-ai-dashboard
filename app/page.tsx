"use client";
import React from "react";
import { BIBTEX_CITATION } from "@/app/constants";
import { ModelResultsTable } from "@/components/ModelResultsTable";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import heroBackground from "@/assets/hero-background.webp";

export default function LandingPage() {
  const handleNavigate = (section: string) => {
    const element = document.getElementById(`${section}-section`);
    if (element) {
      const navHeight = 64; // Height of the navigation bar (h-16 = 64px)
      const elementPosition = element.offsetTop - navHeight - 16; // Extra 16px padding
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      // Update URL hash for shareable links
      window.history.pushState(null, '', `#${section}`);
    }
  };

  // Handle initial hash navigation on page load
  React.useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash && (hash === 'text' || hash === 'vision' || hash === 'safety')) {
        setTimeout(() => handleNavigate(hash), 100); // Small delay to ensure DOM is ready
      }
    };

    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <Navigation onNavigate={handleNavigate} />
      
      {/* Hero Section with Background - Full Width */}
      <div className="relative w-full mb-8 pt-16">
        <div className="relative h-64 flex items-center justify-center">
          {/* Background with gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              zIndex: -1,
              backgroundColor: 'var(--gray-100)',
              backgroundImage: `linear-gradient(111deg, #ffffff40 24%, #0000 54%), url(${heroBackground.src})`,
              backgroundPosition: '0 0, 50% 100%',
              backgroundSize: 'auto, cover'
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6 text-center w-full px-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <Image
                src={logo.src}
                alt="AI Capabilities Overview Logo"
                width={120}
                height={120}
                className="flex-shrink-0"
              />
              <h1 className="text-3xl font-bold tracking-tight lg:text-5xl text-gray-900">
                CAIS AI Leaderboard
              </h1>
            </div>
            <p className="text-lg text-gray-700 max-w-4xl">
              Evaluating frontier AI models on capabilities and safety benchmarks
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4">

      {/* Leaderboard Section */}
      <section className="mb-12 w-full">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center">
            <div className="w-full">
              <ModelResultsTable />
            </div>
          </div>
        </div>
      </section>

      {/* Citation Section */}
      <section className="mb-12 w-full">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold">Citation</h2>
          <div className="mx-auto mb-6 h-0.5 w-16 bg-gradient-to-r from-gray-300 to-gray-100"></div>

          <div className="relative">
            <div className="rounded-lg bg-gray-50 p-4">
              <pre className="max-h-[200px] overflow-y-scroll whitespace-pre-wrap text-xs scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {BIBTEX_CITATION}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(BIBTEX_CITATION);
                }}
                className="absolute right-2 top-2 rounded-md bg-gray-200 p-2 hover:bg-gray-300"
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
