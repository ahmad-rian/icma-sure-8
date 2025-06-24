import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const COLORS = {
  red: '#E52531',
  green: '#4CB050',
  blue: '#2a3b8f',
  orange: '#F0A023'
};

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

const NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'About 8th ICMA SURE', href: '/about-the-8th'},
  { 
    name: 'Committee', 
    id: 'committees',
    dropdown: [
      { name: 'Organising Committee', href: '/committee' },
      { name: 'Scientific Committee', href: '/reviewer' },
    ] 
  },  
  { 
    name: 'Download', 
    id: 'download',
    dropdown: [
      { name: 'Abstract Template', href: '/download/abstract-template', isDownload: true },
      { name: 'Template For ICMA SURE Proceeding', href: '/download/icma-sure-proceeding', isDownload: true },
      { name: 'Registration Guide', href: 'https://www.youtube.com/watch?v=3QzvCgC0b2c', isExternal: true },
      { name: 'Program And Abstract Book', href: 'https://drive.google.com/drive/folders/19-c9h0Cx89bRUhAqFcCu2toGnMuSB1om', isExternal: true }
    ] 
  }
];

const Navbar = () => {
  const { auth } = usePage().props; // Get auth data from Inertia
  const [theme, setTheme] = useState(THEMES.SYSTEM);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Apply theme function
  const applyTheme = (newTheme) => {
    let isDark = false;
    
    if (newTheme === THEMES.SYSTEM) {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = newTheme === THEMES.DARK;
    }
    
    // Apply dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setIsDarkMode(isDark);
    
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  // Cycle through themes
  const cycleTheme = () => {
    const themeValues = Object.values(THEMES);
    const currentIndex = themeValues.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeValues.length;
    const nextTheme = themeValues[nextIndex];
    
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };
  
  // Handle initial setup after mount
  useEffect(() => {
    setMounted(true);
    
    // Check screen size
    const checkTablet = () => setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1024);
    checkTablet();
    window.addEventListener('resize', checkTablet);
    
    // Check theme preference
    try {
      const savedTheme = localStorage.getItem('theme') || THEMES.SYSTEM;
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } catch (error) {
      console.error('Failed to get theme preference:', error);
      // Fallback to system preference
      setTheme(THEMES.SYSTEM);
      applyTheme(THEMES.SYSTEM);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial check for system theme
    if (theme === THEMES.SYSTEM) {
      setIsDarkMode(mediaQuery.matches);
    }
    
    // Add listener for system theme changes
    const handleSystemThemeChange = (e) => {
      if (theme === THEMES.SYSTEM) {
        setIsDarkMode(e.matches);
        applyTheme(THEMES.SYSTEM);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      window.removeEventListener('resize', checkTablet);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Handle scroll effect with debounce
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setScrolled(window.scrollY > 20), 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setActiveDropdown(prev => prev === id ? null : id);
    // Close profile dropdown when opening other dropdowns
    if (id !== 'profile') {
      setProfileDropdownOpen(false);
    }
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(prev => !prev);
    // Close other dropdowns when opening profile
    setActiveDropdown(null);
  };

  // Close dropdown when clicking away
  useEffect(() => {
    const handleClickAway = (event) => {
      if (!event.target.closest('.nav-dropdown') && !event.target.closest('.profile-dropdown')) {
        setActiveDropdown(null);
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickAway);
    return () => document.removeEventListener('click', handleClickAway);
  }, []);

  // Text color based on theme
  const getTextClass = () => isDarkMode ? 'text-white' : 'text-gray-900';

  // Background based on theme and scroll
  const getNavBackground = () => {
    if (!scrolled) return 'bg-transparent';
    return isDarkMode ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm';
  };

  // Build dropdown item style
  const getDropdownItemStyle = (index) => {
    const colorKeys = Object.keys(COLORS);
    const borderColor = COLORS[colorKeys[index % colorKeys.length]];
    return { borderLeftColor: borderColor, backgroundColor: borderColor };
  };
  
  // Get theme icon based on current theme - optimal size
  const getThemeIcon = () => {
    if (!mounted) return null;
    
    switch (theme) {
      case THEMES.LIGHT:
        return <SunIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />;
      case THEMES.DARK:
        return <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />;
      case THEMES.SYSTEM:
        return <ComputerDesktopIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-300" />;
      default:
        return <SunIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />;
    }
  };
  
  // Get theme button background
  const getThemeButtonBg = () => {
    if (isDarkMode) {
      return 'bg-gray-800/90 hover:bg-gray-700 shadow-lg hover:shadow-xl';
    }
    return 'bg-gray-200/90 hover:bg-gray-300 shadow-lg hover:shadow-xl';
  };

  // Get theme button styles for different themes
  const getThemeButtonStyles = () => {
    switch (theme) {
      case THEMES.LIGHT:
        return 'ring-2 ring-amber-300/50 hover:ring-amber-400/70';
      case THEMES.DARK:
        return 'ring-2 ring-blue-300/50 hover:ring-blue-400/70';
      case THEMES.SYSTEM:
        return 'ring-2 ring-gray-300/50 hover:ring-gray-400/70 dark:ring-gray-500/50 dark:hover:ring-gray-400/70';
      default:
        return '';
    }
  };

  // Get user avatar or initials
  const getUserAvatar = () => {
    if (auth?.user?.avatar) {
      return (
        <img
          src={auth.user.avatar}
          alt={auth.user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    }
    
    return (
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#4CB050] to-[#E52531] flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {auth?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </span>
      </div>
    );
  };

  return (
    <Disclosure as="nav" className={`fixed w-full z-50 transition-all duration-300 ${getNavBackground()}`}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
            <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center group">
                  <img
                    className="h-8 sm:h-9 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                    src="/images/assets/logo.png"
                    alt="ICMA SURE"
                  />
                  
                  {/* Logo text */}
                  <div className="ml-2">
                    <h1 className="font-bold text-xs sm:text-sm md:text-base font-lilita flex items-center">
                      <span className={getTextClass()}>The 8</span>
                      <sup className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xxxs sm:text-xxs md:text-xs mt-0.5`}>th</sup>
                      <span className="ml-1 bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">ICMA SURE</span>
                    </h1>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className={`hidden ${isTablet ? 'lg:flex' : 'md:flex'} md:justify-center md:flex-1`}>
                <div className={`flex space-x-1 lg:space-x-2 ${
                  isDarkMode ? 'bg-gray-800/90' : 'bg-gray-100/90'
                } rounded-full px-2 py-1 shadow-md`}>
                  {NAVIGATION.map((item) => (
                    <div key={item.id || item.href} className="relative nav-dropdown" onClick={(e) => {
                      if (item.dropdown) {
                        e.stopPropagation();
                        toggleDropdown(item.id);
                      }
                    }}>
                      {item.dropdown ? (
                        <button
                          className={`flex items-center px-2 sm:px-3 lg:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                            activeDropdown === item.id
                              ? 'bg-gradient-to-r from-[#4CB050] to-[#E52531] text-white shadow-md'
                              : isDarkMode
                                ? 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow'
                                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:shadow'
                          }`}
                        >
                          {item.name}
                          <ChevronDownIcon className={`ml-1 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${
                            activeDropdown === item.id ? 'rotate-180' : ''
                          }`} />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block px-2 sm:px-3 lg:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                            isDarkMode
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow hover:scale-105'
                              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:shadow hover:scale-105'
                          }`}
                        >
                          {item.name}
                        </Link>
                      )}
                      
                      {/* Dropdown Menu */}
                      {item.dropdown && (
                        <Transition
                          show={activeDropdown === item.id}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                          className="absolute left-0 mt-2 w-56 sm:w-60 origin-top-left rounded-xl shadow-lg ring-1 z-50 overflow-hidden"
                          style={{
                            backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : 'white',
                            borderColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgba(0, 0, 0, 0.05)'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            {item.dropdown.map((subItem, subIndex) => {
                              // Generate common classes for all link types
                              const baseClasses = `block px-4 py-3 text-xs sm:text-sm border-l-0 relative group overflow-hidden transition-all duration-300 ${
                                isDarkMode
                                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`;
                              
                              // Generate style object for color
                              const colorStyle = getDropdownItemStyle(subIndex);
                              
                              // Render appropriate link type
                              if (subItem.isExternal) {
                                return (
                                  <a
                                    key={subItem.href}
                                    href={subItem.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={baseClasses}
                                  >
                                    <span className="absolute left-0 top-0 h-full w-1 transform transition-all duration-300 group-hover:w-3"
                                          style={{ backgroundColor: colorStyle.backgroundColor }}></span>
                                    <span className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                          style={{ backgroundColor: colorStyle.backgroundColor }}></span>
                                    <span className="relative">{subItem.name}</span>
                                  </a>
                                );
                              } else if (subItem.isDownload) {
                                return (
                                  <a
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={baseClasses}
                                  >
                                    <span className="absolute left-0 top-0 h-full w-1 transform transition-all duration-300 group-hover:w-3"
                                          style={{ backgroundColor: colorStyle.backgroundColor }}></span>
                                    <span className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                          style={{ backgroundColor: colorStyle.backgroundColor }}></span>
                                    <span className="relative">{subItem.name}</span>
                                  </a>
                                );
                              } else {
                                return (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={baseClasses}
                                  >
                                    <span className="absolute left-0 top-0 h-full w-1 transform transition-all duration-300 group-hover:w-3"
                                          style={{ backgroundColor: colorStyle.backgroundColor }}></span>
                                    <span className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                          style={{ backgroundColor: colorStyle.backgroundColor }}></span>
                                    <span className="relative">{subItem.name}</span>
                                  </Link>
                                );
                              }
                            })}
                          </div>
                        </Transition>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side buttons */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Theme Toggle Button - Optimal Size */}
                {mounted && (
                  <button
                    onClick={cycleTheme}
                    className={`
                      relative rounded-full p-2 sm:p-2.5 focus:outline-none transition-all duration-300 
                      ${getThemeButtonBg()} ${getThemeButtonStyles()}
                      hover:scale-105 active:scale-95 transform-gpu
                      w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11
                      flex items-center justify-center
                      group
                    `}
                    style={{
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)'
                    }}
                    aria-label="Toggle theme"
                    title={`Current theme: ${theme} (click to change)`}
                  >
                    {/* Theme icon with optimal size */}
                    <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                      {getThemeIcon()}
                    </div>
                    
                    {/* Theme indicator tooltip */}
                    <span className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded-md">
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </span>
                    
                    <span className="sr-only">Toggle theme ({theme})</span>
                  </button>
                )}

                {/* Sign In Button or Profile Dropdown */}
                <div className={`hidden ${isTablet ? 'lg:block' : 'md:block'}`}>
                  {auth?.user ? (
                    <div className="relative profile-dropdown">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProfileDropdown();
                        }}
                        className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 group"
                      >
                        {getUserAvatar()}
                        <span className="hidden sm:block">{auth.user.name}</span>
                        <ChevronDownIcon className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${
                          profileDropdownOpen ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Profile Dropdown */}
                      <Transition
                        show={profileDropdownOpen}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                        className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl shadow-lg ring-1 z-50 overflow-hidden"
                        style={{
                          backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : 'white',
                          borderColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {auth.user.name}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {auth.user.email}
                            </p>
                          </div>
                          
                         
                          
                         
                          
                          <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className={`flex items-center w-full px-4 py-2 text-sm transition-all duration-300 ${
                              isDarkMode
                                ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                            }`}
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Sign Out
                          </Link>
                        </div>
                      </Transition>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Sign In</span>
                      <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    </Link>
                  )}
                </div>

                {/* Mobile and Tablet menu button - optimal size */}
                <div className={`${isTablet ? 'flex lg:hidden' : 'flex md:hidden'} items-center`}>
                  <Disclosure.Button className={`inline-flex items-center justify-center rounded-full p-2 sm:p-2.5 focus:outline-none transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-gray-200/90 hover:bg-gray-300'
                  } hover:scale-105 w-9 h-9 sm:w-10 sm:h-10 shadow-lg hover:shadow-xl`}>
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} aria-hidden="true" />
                    ) : (
                      <Bars3Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile and Tablet Menu */}
          <Transition
            show={open}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <Disclosure.Panel className={`${isTablet ? 'lg:hidden' : 'md:hidden'}`}>
              <div className={`space-y-1 px-3 sm:px-4 py-2 sm:py-3 mx-2 sm:mx-4 my-1 sm:my-2 rounded-xl shadow-lg ${
                isDarkMode 
                  ? 'bg-gray-900/95 backdrop-blur-sm' 
                  : 'bg-white/95 backdrop-blur-sm'
              }`}>
                {NAVIGATION.map((item) => (
                  <div key={item.id || item.href} className="py-1">
                    {item.dropdown ? (
                      <Disclosure as="div">
                        {({ open: subMenuOpen }) => (
                          <>
                            <Disclosure.Button
                              className={`w-full flex justify-between items-center px-3 sm:px-4 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
                                isDarkMode
                                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none'
                              }`}
                            >
                              <span>{item.name}</span>
                              <ChevronDownIcon
                                className={`${
                                  subMenuOpen ? 'rotate-180' : ''
                                } w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300`}
                              />
                            </Disclosure.Button>
                            <Transition
                              show={subMenuOpen}
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Disclosure.Panel className="pt-1 sm:pt-2 pb-1 pl-3 sm:pl-4">
                                <div className="space-y-1 border-l-2 border-gray-300 dark:border-gray-700">
                                  {item.dropdown?.map((subItem, i) => {
                                    // Generate common classes for mobile links
                                    const mobileBaseClasses = `flex items-center py-1.5 sm:py-2 pl-2 sm:pl-3 pr-3 sm:pr-4 text-xs sm:text-sm rounded-md my-1 group relative overflow-hidden transition-all duration-300 ${
                                      isDarkMode
                                        ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`;
                                    
                                    // Generate border style for mobile links
                                    const colorStyle = getDropdownItemStyle(i);
                                    const borderStyle = {
                                      borderLeftWidth: '2px',
                                      borderLeftStyle: 'solid',
                                      borderLeftColor: colorStyle.backgroundColor
                                    };
                                    
                                    // Render mobile links
                                    if (subItem.isExternal) {
                                      return (
                                        <a
                                          key={subItem.href}
                                          href={subItem.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={mobileBaseClasses}
                                          style={borderStyle}
                                        >
                                          <span className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                                style={{ backgroundColor: colorStyle.backgroundColor }}></span>
                                          <span className="relative">{subItem.name}</span>
                                        </a>
                                      );
                                    } else {
                                      return (
                                        <Link
                                          key={subItem.href}
                                          href={subItem.href}
                                          className={mobileBaseClasses}
                                          style={borderStyle}
                                        >
                                          <span className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                                style={{ backgroundColor: colorStyle.backgroundColor }}></span>
                                          <span className="relative">{subItem.name}</span>
                                        </Link>
                                      );
                                    }
                                  })}
                                </div>
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        )}
                      </Disclosure>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        } transform hover:translate-x-1`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                

                
                {/* Mobile Profile Section or Sign In */}
                <div className="pt-2 sm:pt-3 pb-1">
                  {auth?.user ? (
                    <div className="space-y-2">
                      {/* User Info */}
                      <div className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center space-x-3">
                          {getUserAvatar()}
                          <div>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {auth.user.name}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {auth.user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Profile Actions */}
                      <div className="space-y-1">
                       
                        
                        <Link
                          href="/logout"
                          method="post"
                          as="button"
                          className={`flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
                            isDarkMode
                              ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                              : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                          }`}
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                          Sign Out
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-center text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Sign In</span>
                      <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    </Link>
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;