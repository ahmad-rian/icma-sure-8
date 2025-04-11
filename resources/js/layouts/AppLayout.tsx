"use client"

import React, { ReactNode, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

interface AppLayoutProps {
  title?: string;
  children: ReactNode;
}

// Internal layout component that uses the theme context
const AppLayout: React.FC<AppLayoutProps> = ({ title, children }) => {
  // Apply initial theme class before hydration to prevent flicker
  useEffect(() => {
    // This runs only once on client-side after mount
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error applying initial theme:', error);
    }
  }, []);

  return (
    <ThemeProvider>
      <Head title={title ? `${title} - The 8th ICMA SURE` : "The 8th ICMA SURE - International Conference on Multidiscipline Approaches for Sustainable Rural Development"}>
        {/* Add fonts for consistent styling */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Poppins:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet"
        />
        {/* Meta tag for color scheme */}
        <meta name="color-scheme" content="light dark" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-200">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;