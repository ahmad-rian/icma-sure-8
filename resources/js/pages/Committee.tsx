import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head } from '@inertiajs/react';
import { Typography, Input, Button, Card } from 'antd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider'; 

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

interface CommitteeMember {
  id: number;
  name: string;
  position: string;
  title: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

interface CommitteeProps {
  committees: CommitteeMember[];
}

const Committee: React.FC<CommitteeProps> = ({ committees }) => {
  const { isDarkMode } = useTheme(); // Use the theme from context
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommittees, setFilteredCommittees] = useState<CommitteeMember[]>(committees);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Colors consistent with the rest of the site
  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
  };

  // Extract unique positions for filtering
  const positions = Array.from(new Set(committees.map(committee => committee.position)));

  // Add custom styles for the search input in dark mode
  useEffect(() => {
    // Add custom styles to handle the search input in dark mode
    const style = document.createElement('style');
    style.textContent = `
      .dark .committee-search .ant-input {
        background-color: #374151 !important;
        border-color: #4B5563 !important;
        color: white !important;
      }
      .dark .committee-search .ant-input-search-button {
        background-color: #4B5563 !important;
        border-color: #4B5563 !important;
        color: white !important;
      }
      .dark .committee-search .ant-input-suffix {
        color: #E5E7EB !important;
      }
      .dark .committee-search .ant-input::placeholder {
        color: #9CA3AF !important;
      }
      .dark .committee-search .anticon {
        color: #E5E7EB !important;
      }
      .dark .ant-btn-icon-only.ant-btn-sm {
        background-color: #4B5563 !important;
        border-color: #4B5563 !important;
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let results = committees;

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        committee =>
          committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          committee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (committee.title && committee.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by position
    if (selectedPosition) {
      results = results.filter(committee => committee.position === selectedPosition);
    }

    setFilteredCommittees(results);
  }, [searchTerm, selectedPosition, committees]);

  // Simulate loading for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }
    }
  };
      
  return (
    <>
      <Head title="Organising Committee" />
      <div className="min-h-screen dark:bg-gray-900 dark:text-white bg-white text-gray-900">
        <Navbar />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background with subtle patterns */}
          <div className="absolute inset-0 dark:bg-gray-900 bg-white">
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#4CB050]/20 to-transparent dark:from-[#4CB050]/10"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-gradient-to-bl from-[#E52531]/20 to-transparent dark:from-[#E52531]/10"></div>
            
            {/* Abstract geometric shapes */}
            <svg className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,0 L1000,0 L1000,1000 L0,1000 Z" fill="none" stroke={colors.blue} strokeWidth="2" />
              <circle cx="500" cy="500" r="300" fill="none" stroke={colors.green} strokeWidth="2" />
              <polygon points="500,200 800,500 500,800 200,500" fill="none" stroke={colors.red} strokeWidth="2" />
            </svg>
          </div>
          
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              className="flex flex-col items-center mb-16 text-center" 
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Title level={1} className="text-4xl sm:text-5xl font-bold dark:text-white text-gray-900">
                  <span>Organising </span>
                  <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">Committee</span>
                </Title>
              </motion.div>
              
              <div className="h-1.5 w-40 mt-6 mb-6 rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] shadow-sm"></div>
              
              <Paragraph className="max-w-3xl text-lg sm:text-xl dark:text-gray-200 text-gray-700 font-medium">
                Meet the dedicated team of professionals behind the 8th ICMA SURE Conference working tirelessly to make this event a success
              </Paragraph>
              
              {/* Modern Search Bar - Moved here in hero section */}
              <motion.div 
                variants={itemVariants}
                className="w-full max-w-xl mt-8"
              >
                <div className="relative">
                  <Search
                    placeholder="Search committee members..."
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-full committee-search shadow-lg"
                    style={{ 
                      borderRadius: '9999px', 
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                      backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                      borderColor: isDarkMode ? '#4B5563' : '#e5e7eb',
                    }}
                  />
                  
                  {/* Background blur effect for search bar */}
                  <div className="absolute inset-0 -z-10 backdrop-blur-sm rounded-full pointer-events-none"></div>
                </div>
              </motion.div>
            </motion.div>

            {/* Filter Section - Now separate from search */}
            <motion.div 
              variants={itemVariants}
              className="mb-12"
            >
              <Card 
                className="shadow-lg rounded-2xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/95 dark:border-gray-700 bg-white/95 border-gray-100 border-0"
                bordered={false}
              >
                <div className="flex flex-wrap gap-2 justify-center p-4">
                  <Button 
                    onClick={() => setSelectedPosition(null)} 
                    type={selectedPosition === null ? 'primary' : 'default'}
                    className={selectedPosition === null ? 'bg-gradient-to-r from-[#4CB050] to-[#E52531] text-white border-0' : 'dark:text-white dark:bg-gray-700 dark:border-gray-600'}
                    shape="round"
                  >
                    All
                  </Button>
                  {positions.map((position, index) => (
                    <Button 
                      key={index} 
                      onClick={() => setSelectedPosition(position)}
                      type={selectedPosition === position ? 'primary' : 'default'}
                      className={selectedPosition === position ? 'bg-gradient-to-r from-[#4CB050] to-[#E52531] text-white border-0' : 'dark:text-white dark:bg-gray-700 dark:border-gray-600'}
                      shape="round"
                    >
                      {position}
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Committee Members Grid */}
            <motion.div 
              variants={containerVariants}
              className="mb-16"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : filteredCommittees.length === 0 ? (
                <motion.div 
                  className="text-center py-16"
                  variants={itemVariants}
                >
                  <svg className="w-16 h-16 dark:text-gray-600 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12a4 4 0 100-8 4 4 0 000 8z"></path>
                  </svg>
                  <Title level={3} className="dark:text-gray-400 text-gray-500">No committee members found</Title>
                  <Text className="dark:text-gray-500 text-gray-400">Try adjusting your search or filter criteria</Text>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredCommittees.map((member, index) => (
                    <motion.div 
                      key={member.id}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card 
                        className="h-full shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl dark:bg-gray-800/90 dark:border-gray-700 bg-white border-gray-100 border-0"
                        bodyStyle={{ padding: 0 }}
                      >
                        <div className="aspect-square w-full overflow-hidden relative">
                          {member.image ? (
                            <img 
                              src={`/storage/${member.image}`} 
                              alt={member.name}
                              className="object-cover w-full h-full transition-all hover:scale-105" 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                              <svg className="w-24 h-24 dark:text-gray-500 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                        </div>
                        
                        <div className="p-5 relative">
                          {/* Decorative accent */}
                          <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-[#4CB050] to-[#E52531]"></div>
                          
                          <div className="pl-3">
                            <Title level={4} className="mb-1 dark:text-white text-gray-900 font-bold">{member.name}</Title>
                            <Text className="text-lg font-medium bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text block mb-2">
                              {member.position}
                            </Text>
                            {member.title && (
                              <Text className="dark:text-gray-300 text-gray-600">{member.title}</Text>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <Card 
                className="max-w-3xl mx-auto shadow-xl rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700 bg-white/90 border-gray-100 border-0"
                bordered={false}
              >
                <div className="relative px-6 py-8">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#4CB050]/20 via-[#E52531]/10 to-transparent rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#E52531]/20 via-[#F0A023]/10 to-transparent rounded-tr-full"></div>
                  
                  <div className="relative z-10">
                    <Title level={3} className="mb-4 font-bold">
                      <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                        Join Us at ICMA SURE 2025
                      </span>
                    </Title>
                    <Paragraph className="dark:text-gray-300 text-gray-700 mb-8 text-lg">
                      The 8th International Conference on Multidiscipline Approaches for Sustainable Rural Development
                    </Paragraph>
                    <div className="inline-flex items-center px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] hover:shadow-[#4CB050]/20">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <Text className="font-medium text-white">
                          07 October 2025
                        </Text>
                      </div>
                      <div className="w-px h-6 mx-4 bg-white/30"></div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <Text className="font-medium text-white">
                          Universitas Jenderal Soedirman
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Committee;