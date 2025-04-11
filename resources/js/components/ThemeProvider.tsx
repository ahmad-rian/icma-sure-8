import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
  ThemeToggle: React.FC<{className?: string}>;
}

// Create context with default values to avoid undefined errors
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDarkMode: false,
  ThemeToggle: () => null
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  // Initialize with a function to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  
  // Force isDarkMode calculation from theme state to ensure it's always in sync
  const isDarkMode = theme === 'dark';

  // Load saved theme or detect system preference after component mount
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      } else if (prefersDark) {
        setTheme('dark');
      }
    } catch (error) {
      console.error('Failed to get theme preference:', error);
    }
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const root = window.document.documentElement;
      
      // First, remove dark class (this is critical for Tailwind's dark mode)
      root.classList.remove('dark');
      
      // Then apply dark class if needed
      if (theme === 'dark') {
        root.classList.add('dark');
      }
      
      // Store preference
      localStorage.setItem('theme', theme);
      
      // Debug log to monitor changes
      console.log('Theme applied:', theme, 'isDarkMode:', isDarkMode);
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  }, [theme, mounted, isDarkMode]);

  // Function to toggle theme with explicit console logging
  const toggleTheme = () => {
    console.log('Before toggle - Current theme:', theme);
    
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('Toggle executed - New theme will be:', newTheme);
      return newTheme;
    });
  };

  // CRITICAL FIX: Removed the mounted check inside the ThemeToggle component
  // The mounted state should be checked by the parent component, not by ThemeToggle itself
  const ThemeToggle: React.FC<{className?: string}> = ({ className = '' }) => {
    return (
      <button
        onClick={(e) => {
          e.preventDefault(); // Prevent any form submission
          console.log('Theme toggle clicked, current isDarkMode:', isDarkMode);
          toggleTheme();
        }}
        className={`rounded-full p-2 focus:outline-none transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800/90 hover:bg-gray-700 shadow-inner' 
            : 'bg-gray-200/90 hover:bg-gray-300 shadow'
        } ${className}`}
        style={{
          // Adding important styling to ensure visibility
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '2rem',
          minHeight: '2rem'
        }}
        aria-label="Toggle dark mode"
        type="button" // Explicitly mark as button to avoid form submission issues
      >
        {isDarkMode ? (
          <SunIcon className="h-5 w-5 text-amber-300" />
        ) : (
          <MoonIcon className="h-5 w-5 text-gray-600" />
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  };

  // Provide complete context value
  const contextValue = {
    theme,
    toggleTheme,
    isDarkMode,
    ThemeToggle
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};