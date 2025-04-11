import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head } from '@inertiajs/react';
import { Typography, Input, Button, Card, Tooltip } from 'antd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider'; 

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;

interface ScientificCommitteeMember {
  id: number;
  name: string;
  position: string;
  scopus_link: string | null;
  email: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

interface ReviewerProps {
  committees: ScientificCommitteeMember[];
}

const Reviewer: React.FC<ReviewerProps> = ({ committees }) => {
  const { isDarkMode } = useTheme(); // Use the theme from context
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommittees, setFilteredCommittees] = useState<ScientificCommitteeMember[]>(committees);
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
      .dark .committee-search .ant-input::placeholder {
        color: #9CA3AF !important;
      }
      .dark .committee-search .anticon {
        color: #E5E7EB !important;
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
          (committee.email && committee.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <Head title="Scientific Committee" />
      
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
                  <span>Scientific </span>
                  <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">Committee</span>
                </Title>
              </motion.div>
              
              <div className="h-1.5 w-40 mt-6 mb-6 rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] shadow-sm"></div>
              
              <Paragraph className="max-w-3xl text-lg sm:text-xl dark:text-gray-200 text-gray-700 font-medium">
                Meet our distinguished panel of peer reviewers and scientific committee members who ensure the academic integrity and quality of the conference
              </Paragraph>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div 
              variants={itemVariants}
              className="mb-12"
            >
              <Card 
                className="shadow-lg rounded-2xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/95 dark:border-gray-700 bg-white/95 border-gray-100 border-0"
                bordered={false}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center p-1 md:p-4">
                  <div className="flex-1 w-full">
                    <Search
                      placeholder="Search reviewers..."
                      size="large"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg committee-search dark:committee-search-dark"
                      style={{ borderRadius: '0.75rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
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
                </div>
              </Card>
            </motion.div>

            {/* Scientific Committee Members Grid */}
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
                            
                            <div className="flex items-center gap-3 mt-4">
                              {member.email && (
                                <Tooltip title={`Email: ${member.email}`}>
                                  <a 
                                    href={`mailto:${member.email}`}
                                    className="text-gray-500 hover:text-[#4CB050] transition-colors dark:text-gray-400 dark:hover:text-[#4CB050]"
                                    aria-label="Email"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                  </a>
                                </Tooltip>
                              )}
                              
                              {member.scopus_link && (
                                <Tooltip title="Scopus Profile">
                                  <a 
                                    href={member.scopus_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-[#E52531] transition-colors dark:text-gray-400 dark:hover:text-[#E52531]"
                                    aria-label="Scopus Profile"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info Section */}
            <motion.div 
              variants={itemVariants}
              className="text-center max-w-4xl mx-auto"
            >
              <Card 
                className="shadow-xl rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 dark:border-gray-700 bg-white/90 border-gray-100 border-0"
                bordered={false}
              >
                <div className="relative px-6 py-8">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#4CB050]/20 via-[#E52531]/10 to-transparent rounded-bl-full"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#E52531]/20 via-[#F0A023]/10 to-transparent rounded-tr-full"></div>
                  
                  <div className="relative z-10">
                    <Title level={3} className="mb-4 font-bold">
                      <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                        Peer Review Process
                      </span>
                    </Title>
                    <Paragraph className="dark:text-gray-300 text-gray-700 mb-8 text-lg">
                      All submissions to ICMA SURE 2025 undergo a rigorous double-blind peer review process to ensure the highest quality of academic content. Our distinguished committee of reviewers evaluate each submission based on originality, methodology, significance, and relevance to the conference theme.
                    </Paragraph>
                    
                    <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow-sm hover:shadow-md transition-all">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#4CB050] to-[#F0A023] flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <Text className="font-bold text-lg block mb-2 dark:text-white text-gray-900">Quality Assurance</Text>
                        <Text className="dark:text-gray-300 text-gray-600">Papers are evaluated for academic rigor and contribution to the field</Text>
                      </div>
                      
                      <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow-sm hover:shadow-md transition-all">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#F0A023] to-[#E52531] flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <Text className="font-bold text-lg block mb-2 dark:text-white text-gray-900">Double-Blind Process</Text>
                        <Text className="dark:text-gray-300 text-gray-600">Author and reviewer identities are concealed throughout the review process</Text>
                      </div>
                      
                      <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow-sm hover:shadow-md transition-all">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#E52531] to-[#4CB050] flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <Text className="font-bold text-lg block mb-2 dark:text-white text-gray-900">Constructive Feedback</Text>
                        <Text className="dark:text-gray-300 text-gray-600">Authors receive detailed comments to improve their work</Text>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <a 
                        href="/download/abstract-template"
                        className="inline-flex items-center px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] hover:shadow-[#4CB050]/20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <Text className="font-medium text-white">
                          Download Abstract Template
                        </Text>
                      </a>
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

export default Reviewer;