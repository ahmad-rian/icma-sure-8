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
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthProps {
  user?: AuthUser;
}

interface PageProps {
  auth?: AuthProps;
}

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

const getNavigation = (auth?: AuthProps) => {
  const baseNavigation = [
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
        { name: 'Registration Guide', href: 'youtube.com/watch?si=N5GrRh3AwPOP81HA&v=6kS_7XpLTfg&feature=youtu.be', isExternal: true },
        { name: 'Program And Abstract Book', href: 'https://drive.google.com/drive/folders/19-c9h0Cx89bRUhAqFcCu2toGnMuSB1om', isExternal: true }
      ] 
    },
    { 
      name: 'Previous Events', 
      id: 'previous-events',
      dropdown: [
        { name: '7th ICMA SURE 2024', href: 'https://icma.lppm.unsoed.ac.id/', isExternal: true },
        { name: '6th ICMA SURE 2023', href: 'https://old.unsoed.ac.id/id/6th-international-conference-multidisciplinary-approaches-sustainable-rural-development-icma-sure', isExternal: true },
        { name: '5th ICMA SURE 2022', href: 'https://old.unsoed.ac.id/id/5th-icma-sure-2022', isExternal: true },
        { name: '4th ICMA SURE 2021', href: 'https://old.unsoed.ac.id/id/lppm-unsoed-gelar-icma-sure-2021', isExternal: true },
        { name: '3rd ICMA SURE 2020', href: 'https://old.unsoed.ac.id/id/3-rd-international-conference-multidisciplinary-approaches-sustainable-rural-development-icma-sure', isExternal: true },
        { name: '2nd ICMA SURE 2019', href: 'https://conference.unsoed.ac.id/index.php/icma/ICMA2019', isExternal: true }
      ] 
    }
  ];

  if (auth?.user) {
    baseNavigation.splice(2, 0, {
      name: 'Submit Abstract',
      href: '/user/submissions'
    });
  }

  return baseNavigation;
};

const Navbar = () => {
  const { auth } = usePage<PageProps>().props;
  const [theme, setTheme] = useState(THEMES.SYSTEM);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const navigation = getNavigation(auth);
  
  const applyTheme = (newTheme: string) => {
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
  
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedTheme = localStorage.getItem('theme') || THEMES.SYSTEM;
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } catch (error) {
      console.error('Failed to get theme preference:', error);
      setTheme(THEMES.SYSTEM);
      applyTheme(THEMES.SYSTEM);
    }
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === THEMES.SYSTEM) {
        setIsDarkMode(e.matches);
        applyTheme(THEMES.SYSTEM);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

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

  const toggleDropdown = (id: string) => {
    setActiveDropdown(prev => prev === id ? null : id);
    setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(prev => !prev);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.nav-dropdown') && 
          !target.closest('.profile-dropdown') &&
          !target.closest('[data-headlessui-state]')) {
        setActiveDropdown(null);
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickAway);
    return () => document.removeEventListener('click', handleClickAway);
  }, []);

  const getDropdownItemStyle = (index: number) => {
    const colorKeys = Object.keys(COLORS) as (keyof typeof COLORS)[];
    const borderColor = COLORS[colorKeys[index % colorKeys.length]];
    return { borderLeftColor: borderColor, backgroundColor: borderColor };
  };
  
  const getThemeIcon = () => {
    if (!mounted) return null;
    
    switch (theme) {
      case THEMES.LIGHT:
        return <SunIcon className="h-4 w-4 text-amber-400" />;
      case THEMES.DARK:
        return <MoonIcon className="h-4 w-4 text-blue-300" />;
      case THEMES.SYSTEM:
        return <ComputerDesktopIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />;
      default:
        return <SunIcon className="h-4 w-4 text-amber-400" />;
    }
  };

  const getUserAvatar = () => {
    if (auth?.user?.avatar) {
      return (
        <img
          src={auth.user.avatar}
          alt={auth.user.name}
          className="h-6 w-6 rounded-full object-cover"
        />
      );
    }
    
    return (
      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#4CB050] to-[#E52531] flex items-center justify-center">
        <span className="text-white font-medium text-xs">
          {auth?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </span>
      </div>
    );
  };

  return (
    <Disclosure as="nav" className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? isDarkMode 
          ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' 
          : 'bg-white/90 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
    }`}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 sm:h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center group">
                  <img
                    className="h-7 sm:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                    src="/images/assets/logo.png"
                    alt="ICMA SURE"
                  />
                  
                  <div className="ml-2">
                    <h1 className={`font-bold text-xs sm:text-sm font-lilita flex items-center ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <span>The 8</span>
                      <sup className="text-[8px] sm:text-[9px] mt-0.5">th</sup>
                      <span className="ml-1 bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                        ICMA SURE
                      </span>
                    </h1>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex lg:justify-center lg:flex-1">
                <div className={`flex items-center space-x-1 ${
                  isDarkMode ? 'bg-gray-800/90' : 'bg-gray-100/90'
                } rounded-full px-2 py-1 shadow-md backdrop-blur-sm`}>
                  {navigation.map((item) => (
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
                        <button className={`flex items-center px-2 sm:px-3 py-1.5 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
                          activeDropdown === item.id
                            ? 'bg-gradient-to-r from-[#4CB050] to-[#E52531] text-white shadow-md'
                            : isDarkMode
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow'
                              : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:shadow'
                        }`}>
                          {item.name}
                          <ChevronDownIcon className={`ml-1 w-3 h-3 transition-transform duration-300 ${
                            activeDropdown === item.id ? 'rotate-180' : ''
                          }`} />
                        </button>
                      ) : (
                        <Link href={item.href} className={`flex items-center px-2 sm:px-3 py-1.5 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow'
                            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 hover:shadow'
                        }`}>
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
                          as="div"
                          className="absolute left-0 mt-2 w-56 origin-top-left rounded-xl shadow-lg ring-1 z-50 overflow-hidden"
                          style={{
                            backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : 'white',
                            borderColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgba(0, 0, 0, 0.05)'
                          }}
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                          <div>
                            {item.dropdown.map((subItem, subIndex) => {
                              const baseClasses = `block px-4 py-2.5 text-sm border-l-0 relative group overflow-hidden transition-all duration-300 ${
                                isDarkMode
                                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`;
                              
                              const colorStyle = getDropdownItemStyle(subIndex);
                              
                              const linkContent = (
                                <>
                                  <span 
                                    className="absolute left-0 top-0 h-full w-1 transform transition-all duration-300 group-hover:w-2"
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

              {/* Right side buttons */}
              <div className="flex items-center space-x-2">
                {/* Theme Toggle Button */}
                {mounted && (
                  <button
                    onClick={cycleTheme}
                    className={`relative rounded-full p-2 focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95 transform-gpu flex items-center justify-center group w-8 h-8 ${
                      isDarkMode
                        ? 'bg-gray-800/90 hover:bg-gray-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-200/90 hover:bg-gray-300 shadow-md hover:shadow-lg'
                    } ${
                      theme === THEMES.LIGHT ? 'ring-2 ring-amber-300/50 hover:ring-amber-400/70' :
                      theme === THEMES.DARK ? 'ring-2 ring-blue-300/50 hover:ring-blue-400/70' :
                      'ring-2 ring-gray-300/50 hover:ring-gray-400/70 dark:ring-gray-500/50 dark:hover:ring-gray-400/70'
                    }`}
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
                  </button>
                )}

                {/* Desktop Profile/Sign In */}
                <div className="hidden lg:block">
                  {auth?.user ? (
                    <div className="relative profile-dropdown">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProfileDropdown();
                        }}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 text-sm"
                      >
                        {getUserAvatar()}
                        <span className="max-w-20 truncate">
                          {auth.user.name}
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${
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
                        as="div"
                        className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl shadow-lg ring-1 z-50 overflow-hidden"
                        style={{
                          backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : 'white',
                          borderColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
                      className="inline-flex items-center justify-center px-3 py-1.5 font-medium text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 relative overflow-hidden group text-sm"
                    >
                      <span className="relative z-10">Sign In</span>
                      <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    </Link>
                  )}
                </div>

                {/* Mobile menu button */}
                <Disclosure.Button className={`lg:hidden inline-flex items-center justify-center rounded-full p-2 focus:outline-none transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg w-8 h-8 ${
                  isDarkMode ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-gray-200/90 hover:bg-gray-300'
                }`}>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                  ) : (
                    <Bars3Icon className={`h-4 w-4 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Transition
            show={open}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <Disclosure.Panel className="lg:hidden">
              <div className={`space-y-1 px-3 py-3 mx-3 my-2 rounded-xl shadow-lg ${
                isDarkMode ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'
              } max-h-[calc(100vh-5rem)] overflow-y-auto`}>
                {navigation.map((item) => (
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
                              } text-sm`}
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
                                    } text-sm`;
                                    
                                    const colorStyle = getDropdownItemStyle(i);
                                    const borderStyle: React.CSSProperties = {
                                      borderLeftWidth: '2px',
                                      borderLeftStyle: 'solid' as const,
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
                        } transform hover:translate-x-1 text-sm`}
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
                            } text-sm`}>
                              {auth.user.name}
                            </p>
                            <p className={`truncate ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            } text-xs`}>
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
                          } text-sm`}
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                          Sign Out
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="block w-full px-3 py-2.5 font-medium text-center text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 relative overflow-hidden group text-sm"
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