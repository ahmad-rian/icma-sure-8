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
  },
  { 
    name: 'Previous Events', 
    id: 'previous-events',
    dropdown: [
      { name: '7th ICMA SURE 2024', href: 'https://icma.lppm.unsoed.ac.id/', isExternal: true },
      { name: '6th ICMA SURE 2023', href: 'https://conference.unsoed.ac.id/index.php/ICMASRD/ICMASURE2023', isExternal: true },
      { name: '5th ICMA SURE 2022', href: 'https://conference.unsoed.ac.id/index.php/ICMASRD/ICMASURE2022', isExternal: true },
      { name: '4th ICMA SURE 2021', href: 'https://conference.unsoed.ac.id/index.php/ICMASRD/ICMASURE2021', isExternal: true },
      { name: '3rd ICMA SURE 2020', href: 'https://conference.unsoed.ac.id/index.php/icma/index/schedConfs/archive', isExternal: true },
      { name: '2nd ICMA SURE 2019', href: 'https://conference.unsoed.ac.id/index.php/icma/ICMA2019', isExternal: true }
    ] 
  }
];

const Navbar = () => {
  const { auth } = usePage().props;
  const [theme, setTheme] = useState(THEMES.SYSTEM);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState('lg');
  
  // Screen size detection with better breakpoints
  const getScreenSize = () => {
    const width = window.innerWidth;
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    return '2xl';
  };

  // Apply theme function
  const applyTheme = (newTheme) => {
    let isDark = false;
    
    if (newTheme === THEMES.SYSTEM) {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = newTheme === THEMES.DARK;
    }
    
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
  
  const cycleTheme = () => {
    const themeValues = Object.values(THEMES);
    const currentIndex = themeValues.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeValues.length;
    const nextTheme = themeValues[nextIndex];
    
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };
  
  // Enhanced useEffect for better responsiveness
  useEffect(() => {
    setMounted(true);
    
    // Screen size detection with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setScreenSize(getScreenSize());
        // Close dropdowns on resize
        setActiveDropdown(null);
        setProfileDropdownOpen(false);
      }, 150);
    };

    // Initial screen size
    setScreenSize(getScreenSize());
    window.addEventListener('resize', handleResize);
    
    // Theme setup
    try {
      const savedTheme = localStorage.getItem('theme') || THEMES.SYSTEM;
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } catch (error) {
      console.error('Failed to get theme preference:', error);
      setTheme(THEMES.SYSTEM);
      applyTheme(THEMES.SYSTEM);
    }
    
    // System theme listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (theme === THEMES.SYSTEM) {
        setIsDarkMode(e.matches);
        applyTheme(THEMES.SYSTEM);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      clearTimeout(resizeTimeout);
    };
  }, [theme]);

  // Enhanced scroll handler
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Improved dropdown handlers
  const toggleDropdown = (id) => {
    setActiveDropdown(prev => prev === id ? null : id);
    setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(prev => !prev);
    setActiveDropdown(null);
  };

  // Enhanced click away handler
  useEffect(() => {
    const handleClickAway = (event) => {
      if (!event.target.closest('.nav-dropdown') && 
          !event.target.closest('.profile-dropdown') &&
          !event.target.closest('[data-headlessui-state]')) {
        setActiveDropdown(null);
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickAway);
    return () => document.removeEventListener('click', handleClickAway);
  }, []);

  // Responsive helper functions
  const isSmallScreen = () => screenSize === 'sm';
  const isMediumScreen = () => screenSize === 'md';
  const isLargeScreen = () => ['lg', 'xl', '2xl'].includes(screenSize);
  const showMobileMenu = () => ['sm', 'md'].includes(screenSize);
  const showDesktopMenu = () => ['lg', 'xl', '2xl'].includes(screenSize);

  // Dynamic classes based on screen size
  const getContainerClasses = () => {
    return `mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8`;
  };

  const getNavbarHeight = () => {
    if (isSmallScreen()) return 'h-14';
    if (isMediumScreen()) return 'h-16';
    return 'h-18 lg:h-20';
  };

  const getLogoSize = () => {
    if (isSmallScreen()) return 'h-7 w-auto';
    if (isMediumScreen()) return 'h-8 w-auto';
    return 'h-9 lg:h-10 w-auto';
  };

  const getLogoTextSize = () => {
    if (isSmallScreen()) return 'text-xs';
    if (isMediumScreen()) return 'text-sm';
    return 'text-sm lg:text-base';
  };

  const getTextClass = () => isDarkMode ? 'text-white' : 'text-gray-900';

  const getNavBackground = () => {
    if (!scrolled) return 'bg-transparent';
    return isDarkMode 
      ? 'bg-gray-900/90 backdrop-blur-md' 
      : 'bg-white/90 backdrop-blur-md';
  };

  const getDropdownItemStyle = (index) => {
    const colorKeys = Object.keys(COLORS);
    const borderColor = COLORS[colorKeys[index % colorKeys.length]];
    return { borderLeftColor: borderColor, backgroundColor: borderColor };
  };
  
  const getThemeIcon = () => {
    if (!mounted) return null;
    
    const iconSize = isSmallScreen() ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5';
    
    switch (theme) {
      case THEMES.LIGHT:
        return <SunIcon className={`${iconSize} text-amber-400`} />;
      case THEMES.DARK:
        return <MoonIcon className={`${iconSize} text-blue-300`} />;
      case THEMES.SYSTEM:
        return <ComputerDesktopIcon className={`${iconSize} text-gray-400 dark:text-gray-300`} />;
      default:
        return <SunIcon className={`${iconSize} text-amber-400`} />;
    }
  };
  
  const getThemeButtonClasses = () => {
    const baseClasses = `relative rounded-full p-2 focus:outline-none transition-all duration-300 
      hover:scale-105 active:scale-95 transform-gpu flex items-center justify-center group`;
    
    const sizeClasses = isSmallScreen() 
      ? 'w-8 h-8' 
      : 'w-9 h-9 sm:w-10 sm:h-10';
    
    const backgroundClasses = isDarkMode
      ? 'bg-gray-800/90 hover:bg-gray-700 shadow-lg hover:shadow-xl'
      : 'bg-gray-200/90 hover:bg-gray-300 shadow-lg hover:shadow-xl';
    
    const themeClasses = {
      [THEMES.LIGHT]: 'ring-2 ring-amber-300/50 hover:ring-amber-400/70',
      [THEMES.DARK]: 'ring-2 ring-blue-300/50 hover:ring-blue-400/70',
      [THEMES.SYSTEM]: 'ring-2 ring-gray-300/50 hover:ring-gray-400/70 dark:ring-gray-500/50 dark:hover:ring-gray-400/70'
    };

    return `${baseClasses} ${sizeClasses} ${backgroundClasses} ${themeClasses[theme] || ''}`;
  };

  const getUserAvatar = () => {
    if (auth?.user?.avatar) {
      return (
        <img
          src={auth.user.avatar}
          alt={auth.user.name}
          className={isSmallScreen() ? "h-6 w-6 rounded-full object-cover" : "h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"}
        />
      );
    }
    
    return (
      <div className={`${isSmallScreen() ? 'h-6 w-6' : 'h-7 w-7 sm:h-8 sm:w-8'} rounded-full bg-gradient-to-r from-[#4CB050] to-[#E52531] flex items-center justify-center`}>
        <span className={`text-white font-medium ${isSmallScreen() ? 'text-xs' : 'text-sm'}`}>
          {auth?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </span>
      </div>
    );
  };

  const getDesktopNavClasses = () => {
    return `flex space-x-1 lg:space-x-2 ${
      isDarkMode ? 'bg-gray-800/90' : 'bg-gray-100/90'
    } rounded-full px-2 py-1 shadow-md backdrop-blur-sm`;
  };

  const getDesktopNavItemClasses = (isActive = false) => {
    const baseClasses = `flex items-center px-2 sm:px-3 lg:px-4 py-2 rounded-full font-medium transition-all duration-300`;
    const textSize = isLargeScreen() ? 'text-xs sm:text-sm' : 'text-sm';
    
    if (isActive) {
      return `${baseClasses} ${textSize} bg-gradient-to-r from-[#4CB050] to-[#E52531] text-white shadow-md`;
    }
    
    return `${baseClasses} ${textSize} ${
      isDarkMode
        ? 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow'
        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:shadow'
    }`;
  };

  return (
    <Disclosure as="nav" className={`fixed w-full z-50 transition-all duration-300 ${getNavBackground()}`}>
      {({ open }) => (
        <>
          <div className={getContainerClasses()}>
            <div className={`flex ${getNavbarHeight()} items-center justify-between`}>
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center group">
                  <img
                    className={`${getLogoSize()} transition-transform duration-300 group-hover:scale-105`}
                    src="/images/assets/logo.png"
                    alt="ICMA SURE"
                  />
                  
                  <div className="ml-2 sm:ml-3">
                    <h1 className={`font-bold ${getLogoTextSize()} font-lilita flex items-center`}>
                      <span className={getTextClass()}>The 8</span>
                      <sup className={`${getTextClass()} ${isSmallScreen() ? 'text-xxxs' : 'text-xxxs sm:text-xxs'} mt-0.5`}>th</sup>
                      <span className="ml-1 bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                        ICMA SURE
                      </span>
                    </h1>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              {showDesktopMenu() && (
                <div className="hidden lg:flex lg:justify-center lg:flex-1">
                  <div className={getDesktopNavClasses()}>
                    {NAVIGATION.map((item) => (
                      <div 
                        key={item.id || item.href} 
                        className="relative nav-dropdown" 
                        onClick={(e) => {
                          if (item.dropdown) {
                            e.stopPropagation();
                            toggleDropdown(item.id);
                          }
                        }}
                      >
                        {item.dropdown ? (
                          <button className={getDesktopNavItemClasses(activeDropdown === item.id)}>
                            {item.name}
                            <ChevronDownIcon className={`ml-1 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${
                              activeDropdown === item.id ? 'rotate-180' : ''
                            }`} />
                          </button>
                        ) : (
                          <Link href={item.href} className={getDesktopNavItemClasses()}>
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
                            className="absolute left-0 mt-2 w-56 sm:w-60 lg:w-64 origin-top-left rounded-xl shadow-lg ring-1 z-50 overflow-hidden"
                            style={{
                              backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : 'white',
                              borderColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgba(0, 0, 0, 0.05)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div>
                              {item.dropdown.map((subItem, subIndex) => {
                                const baseClasses = `block px-4 py-3 text-xs sm:text-sm border-l-0 relative group overflow-hidden transition-all duration-300 ${
                                  isDarkMode
                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`;
                                
                                const colorStyle = getDropdownItemStyle(subIndex);
                                
                                const linkContent = (
                                  <>
                                    <span 
                                      className="absolute left-0 top-0 h-full w-1 transform transition-all duration-300 group-hover:w-3"
                                      style={{ backgroundColor: colorStyle.backgroundColor }}
                                    />
                                    <span 
                                      className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                      style={{ backgroundColor: colorStyle.backgroundColor }}
                                    />
                                    <span className="relative">{subItem.name}</span>
                                  </>
                                );
                                
                                if (subItem.isExternal || subItem.isDownload) {
                                  return (
                                    <a
                                      key={subItem.href}
                                      href={subItem.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={baseClasses}
                                    >
                                      {linkContent}
                                    </a>
                                  );
                                } else {
                                  return (
                                    <Link key={subItem.href} href={subItem.href} className={baseClasses}>
                                      {linkContent}
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
              )}

              {/* Right side buttons */}
              <div className={`flex items-center ${isSmallScreen() ? 'space-x-1' : 'space-x-2 sm:space-x-3'}`}>
                {/* Theme Toggle Button */}
                {mounted && (
                  <button
                    onClick={cycleTheme}
                    className={getThemeButtonClasses()}
                    style={{
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)'
                    }}
                    aria-label="Toggle theme"
                    title={`Current theme: ${theme} (click to change)`}
                  >
                    <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                      {getThemeIcon()}
                    </div>
                    
                    {!isSmallScreen() && (
                      <span className="hidden xl:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded-md">
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </span>
                    )}
                  </button>
                )}

                {/* Desktop Sign In Button or Profile */}
                {showDesktopMenu() && (
                  <div className="hidden lg:block">
                    {auth?.user ? (
                      <div className="relative profile-dropdown">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProfileDropdown();
                          }}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 ${
                            isSmallScreen() ? 'text-xs' : 'text-xs sm:text-sm'
                          }`}
                        >
                          {getUserAvatar()}
                          <span className="hidden sm:block max-w-24 lg:max-w-32 truncate">
                            {auth.user.name}
                          </span>
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
                          className="absolute right-0 mt-2 w-48 sm:w-52 origin-top-right rounded-xl shadow-lg ring-1 z-50 overflow-hidden"
                          style={{
                            backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : 'white',
                            borderColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgba(0, 0, 0, 0.05)'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                              <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {auth.user.name}
                              </p>
                              <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                        className={`inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 relative overflow-hidden group ${
                          isSmallScreen() ? 'text-xs' : 'text-xs sm:text-sm'
                        }`}
                      >
                        <span className="relative z-10">Sign In</span>
                        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      </Link>
                    )}
                  </div>
                )}

                {/* Mobile menu button */}
                {showMobileMenu() && (
                  <Disclosure.Button className={`inline-flex items-center justify-center rounded-full p-2 focus:outline-none transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-gray-200/90 hover:bg-gray-300'
                  } hover:scale-105 shadow-lg hover:shadow-xl ${
                    isSmallScreen() ? 'w-8 h-8' : 'w-9 h-9 sm:w-10 sm:h-10'
                  }`}>
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className={`${isSmallScreen() ? 'h-4 w-4' : 'h-5 w-5'} ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                    ) : (
                      <Bars3Icon className={`${isSmallScreen() ? 'h-4 w-4' : 'h-5 w-5'} ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                    )}
                  </Disclosure.Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu() && (
            <Transition
              show={open}
              enter="transition duration-200 ease-out"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition duration-150 ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-2"
            >
              <Disclosure.Panel className="md:hidden lg:hidden">
                <div className={`space-y-1 px-3 sm:px-4 py-3 mx-2 sm:mx-3 my-2 rounded-xl shadow-lg ${
                  isDarkMode ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'
                } max-h-[calc(100vh-5rem)] overflow-y-auto`}>
                  {NAVIGATION.map((item) => (
                    <div key={item.id || item.href} className="py-0.5">
                      {item.dropdown ? (
                        <Disclosure as="div">
                          {({ open: subMenuOpen }) => (
                            <>
                              <Disclosure.Button
                                className={`w-full flex justify-between items-center px-3 py-2 text-left font-medium rounded-lg transition-all duration-300 ${
                                  isDarkMode
                                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                } ${isSmallScreen() ? 'text-sm' : 'text-sm'}`}
                              >
                                <span>{item.name}</span>
                                <ChevronDownIcon
                                  className={`${
                                    subMenuOpen ? 'rotate-180' : ''
                                  } w-4 h-4 text-gray-500 transition-transform duration-300`}
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
                                <Disclosure.Panel className="pt-2 pb-1 pl-3">
                                  <div className="space-y-1 border-l-2 border-gray-300 dark:border-gray-700">
                                    {item.dropdown?.map((subItem, i) => {
                                      const mobileBaseClasses = `flex items-center py-2 pl-3 pr-3 rounded-md my-1 group relative overflow-hidden transition-all duration-300 ${
                                        isDarkMode
                                          ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                      } ${isSmallScreen() ? 'text-xs' : 'text-sm'}`;
                                      
                                      const colorStyle = getDropdownItemStyle(i);
                                      const borderStyle = {
                                        borderLeftWidth: '2px',
                                        borderLeftStyle: 'solid',
                                        borderLeftColor: colorStyle.backgroundColor
                                      };
                                      
                                      const linkContent = (
                                        <>
                                          <span 
                                            className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                            style={{ backgroundColor: colorStyle.backgroundColor }}
                                          />
                                          <span className="relative">{subItem.name}</span>
                                        </>
                                      );
                                      
                                      if (subItem.isExternal || subItem.isDownload) {
                                        return (
                                          <a
                                            key={subItem.href}
                                            href={subItem.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={mobileBaseClasses}
                                            style={borderStyle}
                                          >
                                            {linkContent}
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
                                            {linkContent}
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
                          className={`flex items-center w-full px-3 py-2 font-medium rounded-lg transition-all duration-300 ${
                            isDarkMode
                              ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          } transform hover:translate-x-1 ${isSmallScreen() ? 'text-sm' : 'text-sm'}`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                  
                  {/* Mobile Profile Section or Sign In */}
                  <div className="pt-3 pb-1 border-t border-gray-200 dark:border-gray-700 mt-3">
                    {auth?.user ? (
                      <div className="space-y-2">
                        {/* User Info */}
                        <div className={`px-3 py-2.5 rounded-lg ${
                          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                          <div className="flex items-center space-x-3">
                            {getUserAvatar()}
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium truncate ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              } ${isSmallScreen() ? 'text-sm' : 'text-sm'}`}>
                                {auth.user.name}
                              </p>
                              <p className={`truncate ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              } ${isSmallScreen() ? 'text-xs' : 'text-xs'}`}>
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
                            className={`flex items-center w-full px-3 py-2 font-medium rounded-lg transition-all duration-300 ${
                              isDarkMode
                                ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                            } ${isSmallScreen() ? 'text-sm' : 'text-sm'}`}
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Sign Out
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className={`block w-full px-3 py-2.5 font-medium text-center text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 relative overflow-hidden group ${
                          isSmallScreen() ? 'text-sm' : 'text-sm'
                        }`}
                      >
                        <span className="relative z-10">Sign In</span>
                        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      </Link>
                    )}
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          )}
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;