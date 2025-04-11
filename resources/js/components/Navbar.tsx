import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Determine if we're on a tablet-sized screen (iPad or similar)
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkTablet = () => {
      // Target iPad and similar sized tablets (typically 768px to 1024px width)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1024);
    };
    
    checkTablet(); // Check on initial load
    window.addEventListener('resize', checkTablet);
    
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  // Set mounted state after initial render (client-side only)
  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme or system preference
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else if (prefersDark && savedTheme !== 'light') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.error('Failed to get theme preference:', error);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      
      // Update DOM and localStorage
      try {
        if (newMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      } catch (error) {
        console.error('Failed to update theme:', error);
      }
      
      return newMode;
    });
  };

  // Handle scroll effect with debounce
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 20);
      }, 100);
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
  };

  // Close dropdown when clicking away
  useEffect(() => {
    const handleClickAway = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('click', handleClickAway);
    return () => document.removeEventListener('click', handleClickAway);
  }, []);

  // Navigation items with dropdowns
  const navigation = [
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
          { 
            name: 'Abstract Template', 
            href: '/download/abstract-template', 
            isDownload: true
          },
          { 
            name: 'Template For ICMA SURE Proceeding', 
            href: '/download/icma-sure-proceeding', 
            isDownload: true
          },
          { 
            name: 'Registration Guide', 
            href: 'https://www.youtube.com/watch?v=3QzvCgC0b2c', 
            isExternal: true
          },
          { 
            name: 'Program And Abstract Book', 
            href: 'https://drive.google.com/drive/folders/19-c9h0Cx89bRUhAqFcCu2toGnMuSB1om', 
            isExternal: true
          }
        ] 
      }
  ];

  // ICMA colors based on the logo
  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
  };

  // Determines text color based on dark mode
  const getTextColor = () => {
    if (!mounted) {
      return 'text-gray-900'; // Default to dark text before hydration
    }
    
    return isDarkMode ? 'text-white' : 'text-gray-900';
  };

  return (
    <Disclosure
      as="nav"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? (mounted && isDarkMode ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm') : 'bg-transparent'
      }`}
    >
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
                  
                  {/* Logo text - responsive for all screen sizes */}
                  <div className="ml-2">
                    <h1 className="font-bold text-xs sm:text-sm md:text-base font-lilita flex items-center">
                      <span className={getTextColor()}>The 8</span>
                      <sup className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xxxs sm:text-xxs md:text-xs mt-0.5`}>th</sup>
                      <span className="ml-1 bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">ICMA SURE</span>
                    </h1>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className={`hidden ${isTablet ? 'lg:flex' : 'md:flex'} md:justify-center md:flex-1`}>
                <div className={`flex space-x-1 lg:space-x-2 ${
                  mounted && isDarkMode
                    ? 'bg-gray-800/90'
                    : 'bg-gray-100/90'
                  } rounded-full px-2 py-1 shadow-md`}>
                  {navigation.map((item) => (
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
                              : mounted && isDarkMode
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
                            mounted && isDarkMode
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
                            backgroundColor: mounted && isDarkMode ? 'rgb(31, 41, 55)' : 'white',
                            borderColor: mounted && isDarkMode ? 'rgb(55, 65, 81)' : 'rgba(0, 0, 0, 0.05)'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            {item.dropdown.map((subItem, subIndex) => (
                              <div key={subItem.href} className="w-full">
                                {subItem.isExternal ? (
                                  <a
                                    href={subItem.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block px-4 py-3 text-xs sm:text-sm border-l-0 relative group overflow-hidden transition-all duration-300 ${
                                      mounted && isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                    style={{
                                      borderLeftWidth: '3px',
                                      borderLeftStyle: 'solid',
                                      borderLeftColor: 'transparent'
                                    }}
                                  >
                                    {/* Animated left border on hover */}
                                    <span 
                                      className="absolute left-0 top-0 h-full w-1 transform transition-all duration-300 group-hover:w-3"
                                      style={{ 
                                        backgroundColor: subIndex === 0 ? colors.green : 
                                          subIndex === 1 ? colors.orange : 
                                          subIndex === 2 ? colors.red : colors.blue
                                      }}
                                    ></span>
                                    
                                    {/* Hover background effect */}
                                    <span 
                                      className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                      style={{ 
                                        backgroundColor: subIndex === 0 ? colors.green : 
                                          subIndex === 1 ? colors.orange : 
                                          subIndex === 2 ? colors.red : colors.blue
                                      }}
                                    ></span>
                                    
                                    {/* Text with relative positioning to stay above the effects */}
                                    <span className="relative">{subItem.name}</span>
                                  </a>
                                ) : subItem.isDownload ? (
                                  <a
                                    href={subItem.href}
                                    className={`block px-4 py-3 text-xs sm:text-sm border-l-0 relative group overflow-hidden transition-all duration-300 ${
                                      mounted && isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                    style={{
                                      borderLeftWidth: '3px',
                                      borderLeftStyle: 'solid',
                                      borderLeftColor: 'transparent'
                                    }}
                                  >
                                    {/* Animated left border on hover */}
                                    <span 
                                      className="absolute left-0 top-0 h-full w-1 transform transition-all duration-300 group-hover:w-3"
                                      style={{ 
                                        backgroundColor: subIndex === 0 ? colors.green : 
                                          subIndex === 1 ? colors.orange : 
                                          subIndex === 2 ? colors.red : colors.blue
                                      }}
                                    ></span>
                                    
                                    {/* Hover background effect */}
                                    <span 
                                      className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                      style={{ 
                                        backgroundColor: subIndex === 0 ? colors.green : 
                                          subIndex === 1 ? colors.orange : 
                                          subIndex === 2 ? colors.red : colors.blue
                                      }}
                                    ></span>
                                    
                                    {/* Text with relative positioning to stay above the effects */}
                                    <span className="relative">{subItem.name}</span>
                                  </a>
                                ) : (
                                  <Link
                                    href={subItem.href}
                                    className={`block px-4 py-3 text-xs sm:text-sm border-l-0 relative group overflow-hidden transition-all duration-300 ${
                                      mounted && isDarkMode
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                    style={{
                                      borderLeftWidth: '3px',
                                      borderLeftStyle: 'solid',
                                      borderLeftColor: 'transparent'
                                    }}
                                  >
                                    {/* Animated left border on hover */}
                                    <span 
                                      className="absolute left-0 top-0 h-full w-1 transform transition-all duration-300 group-hover:w-3"
                                      style={{ 
                                        backgroundColor: subIndex === 0 ? colors.green : 
                                          subIndex === 1 ? colors.orange : colors.red 
                                      }}
                                    ></span>
                                    
                                    {/* Hover background effect */}
                                    <span 
                                      className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                      style={{ 
                                        backgroundColor: subIndex === 0 ? colors.green : 
                                          subIndex === 1 ? colors.orange : colors.red 
                                      }}
                                    ></span>
                                    
                                    {/* Text with relative positioning to stay above the effects */}
                                    <span className="relative">{subItem.name}</span>
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        </Transition>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side buttons */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Theme Toggle Button */}
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className={`rounded-full p-1.5 sm:p-2 focus:outline-none transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/90 hover:bg-gray-700 shadow-inner hover:shadow' 
                        : 'bg-gray-200/90 hover:bg-gray-300 shadow hover:shadow-md'
                    } hover:scale-110`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '1.75rem',
                      minHeight: '1.75rem',
                      '@media (min-width: 640px)': {
                        minWidth: '2rem',
                        minHeight: '2rem'
                      }
                    }}
                    aria-label="Toggle dark mode"
                    type="button"
                  >
                    <Transition
                      show={isDarkMode}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0 rotate-180"
                      enterTo="opacity-100 rotate-0"
                      leave="transition-opacity duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0 rotate-180"
                      className="absolute"
                    >
                      <SunIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
                    </Transition>
                    
                    <Transition
                      show={!isDarkMode}
                      enter="transition-opacity duration-300"
                      enterFrom="opacity-0 rotate-180"
                      enterTo="opacity-100 rotate-0"
                      leave="transition-opacity duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0 rotate-180"
                      className="absolute"
                    >
                      <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </Transition>
                    <span className="sr-only">Toggle theme</span>
                  </button>
                )}

                {/* Sign In Button */}
                <div className={`hidden ${isTablet ? 'lg:block' : 'md:block'}`}>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Sign In</span>
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  </Link>
                </div>

                {/* Mobile and Tablet menu button - show on tablets too */}
                <div className={`${isTablet ? 'flex lg:hidden' : 'flex md:hidden'} items-center`}>
                  <Disclosure.Button className={`inline-flex items-center justify-center rounded-full p-1.5 sm:p-2 focus:outline-none transition-all duration-300 ${
                    mounted && isDarkMode ? 'bg-gray-800/90 hover:bg-gray-700' : 'bg-gray-200/90 hover:bg-gray-300'
                  } hover:scale-110`}>
                    <span className="sr-only">Open main menu</span>
                    {!open ? (
                      <Bars3Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} aria-hidden="true" />
                    ) : (
                      <XMarkIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} aria-hidden="true" />
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
                mounted && isDarkMode 
                  ? 'bg-gray-900/95 backdrop-blur-sm' 
                  : 'bg-white/95 backdrop-blur-sm'
              }`}>
                {navigation.map((item) => (
                  <div key={item.id || item.href} className="py-1">
                    {item.dropdown ? (
                      <Disclosure as="div">
                        {({ open: subMenuOpen }) => (
                          <>
                            <Disclosure.Button
                              className={`w-full flex justify-between items-center px-3 sm:px-4 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 ${
                                mounted && isDarkMode
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
                                  {item.dropdown?.map((subItem, i) => (
                                    <div key={subItem.href} className="pl-3 sm:pl-4">
                                      {subItem.isExternal ? (
                                        <a
                                          href={subItem.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`flex items-center py-1.5 sm:py-2 pl-2 sm:pl-3 pr-3 sm:pr-4 text-xs sm:text-sm rounded-md my-1 group relative overflow-hidden transition-all duration-300 ${
                                            mounted && isDarkMode
                                              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                          }`}
                                          style={{
                                            borderLeftWidth: '2px',
                                            borderLeftStyle: 'solid',
                                            borderLeftColor: i === 0 ? colors.green :
                                              i === 1 ? colors.orange : 
                                              i === 2 ? colors.red : colors.blue
                                          }}
                                        >
                                          {/* Subtle background animation on hover */}
                                          <span 
                                            className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                            style={{ 
                                              backgroundColor: i === 0 ? colors.green : 
                                                i === 1 ? colors.orange : 
                                                i === 2 ? colors.red : colors.blue 
                                            }}
                                          ></span>
                                          
                                          {/* Text stays above the background effect */}
                                          <span className="relative">{subItem.name}</span>
                                        </a>
                                      ) : subItem.isDownload ? (
                                        <a
                                          href={subItem.href}
                                          className={`flex items-center py-1.5 sm:py-2 pl-2 sm:pl-3 pr-3 sm:pr-4 text-xs sm:text-sm rounded-md my-1 group relative overflow-hidden transition-all duration-300 ${
                                            mounted && isDarkMode
                                              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                          }`}
                                          style={{
                                            borderLeftWidth: '2px',
                                            borderLeftStyle: 'solid',
                                            borderLeftColor: i === 0 ? colors.green :
                                              i === 1 ? colors.orange : 
                                              i === 2 ? colors.red : colors.blue
                                          }}
                                        >
                                          {/* Subtle background animation on hover */}
                                          <span 
                                            className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                            style={{ 
                                              backgroundColor: i === 0 ? colors.green : 
                                                i === 1 ? colors.orange : 
                                                i === 2 ? colors.red : colors.blue 
                                            }}
                                          ></span>
                                          
                                          {/* Text stays above the background effect */}
                                          <span className="relative">{subItem.name}</span>
                                        </a>
                                      ) : (
                                        <Link
                                          href={subItem.href}
                                          className={`flex items-center py-1.5 sm:py-2 pl-2 sm:pl-3 pr-3 sm:pr-4 text-xs sm:text-sm rounded-md my-1 group relative overflow-hidden transition-all duration-300 ${
                                            mounted && isDarkMode
                                              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                          }`}
                                          style={{
                                            borderLeftWidth: '2px',
                                            borderLeftStyle: 'solid',
                                            borderLeftColor: i === 0 ? colors.green :
                                              i === 1 ? colors.orange : colors.red
                                          }}
                                        >
                                          {/* Subtle background animation on hover */}
                                          <span 
                                            className="absolute left-0 top-0 h-full w-0 group-hover:w-full opacity-10 transition-all duration-300" 
                                            style={{ 
                                              backgroundColor: i === 0 ? colors.green : 
                                                i === 1 ? colors.orange : colors.red 
                                            }}
                                          ></span>
                                          
                                          {/* Text stays above the background effect */}
                                          <span className="relative">{subItem.name}</span>
                                        </Link>
                                      )}
                                    </div>
                                  ))}
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
                          mounted && isDarkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        } transform hover:translate-x-1`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-2 sm:pt-3 pb-1">
                  <Link
                    href="/login"
                    className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-center text-white bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Sign In</span>
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  </Link>
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