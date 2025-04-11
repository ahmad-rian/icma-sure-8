import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Divider } from 'antd';
import { useTheme } from '@/components/ThemeProvider';

const { Title, Text, Paragraph } = Typography;

interface JournalInfo {
  name: string;
  impactFactor: string;
  image?: string;
}

const ConferenceInfoSection: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  // Define ICMA color palette
  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }
    }
  };

  // Section heading component with improved responsiveness
  const SectionHeading = ({ title }: { title: string }) => (
    <div className="text-center mb-6 sm:mb-8 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 dark:text-white text-gray-900">
        {title}
      </h2>
      <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
    </div>
  );

  // Journal list for publication
  const journals: JournalInfo[] = [
    { name: "Jurnal Ilmu Sosial dan Ilmu Politik", impactFactor: "0.2" },
    { name: "Molekul", impactFactor: "0.19" },
    { name: "Medical Journal of Indonesia", impactFactor: "0.17" },
    { name: "Jurnal Keperawatan Soedirman", impactFactor: "0.14" },
    { name: "Jurnal Keperawatan Padjadjaran", impactFactor: "0.14" },
    { name: "Journal of the Chinese Institute of Civil and Hydraulic Engineering", impactFactor: "0.1", image: "" }
  ];

  return (
    <div className="py-10 sm:py-16 md:py-24 dark:bg-gray-900 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Venue Section - Improved responsive layout */}
          <motion.section className="mb-12 sm:mb-16 md:mb-24" variants={itemVariants}>
            <SectionHeading title="VENUE" />
            
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                {/* Decorative elements with responsive sizing */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10 text-center">
                  <Title level={3} className="mb-4 sm:mb-6 font-bold text-xl sm:text-2xl md:text-3xl">
                    <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                      Conference Location
                    </span>
                  </Title>
                  
                  <div className="mb-6 sm:mb-8">
                    <Paragraph className="text-base sm:text-lg md:text-xl dark:text-gray-300 text-gray-700">
                      The 8th ICMA SURE will be held in a hybrid method.
                    </Paragraph>
                  </div>
                  
                  <div className="rounded-xl bg-gradient-to-r p-[1px] from-[#4CB050] via-[#F0A023] to-[#E52531]">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-tr from-[#2a3b8f] to-[#E52531] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-center sm:text-left mt-2 sm:mt-0">
                          <Text className="font-bold text-base sm:text-lg md:text-xl dark:text-white text-gray-900 block mb-1">
                            Java Heritage Hotel
                          </Text>
                          <Text className="text-sm sm:text-base md:text-lg dark:text-gray-300 text-gray-700">
                            Dr Angka Street No. 71, Purwokerto, Jawa Tengah, Indonesia
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
          
          {/* Conference Fee Section - Improved grid structure */}
          <motion.section className="mb-12 sm:mb-16 md:mb-24" variants={itemVariants}>
            <SectionHeading title="CONFERENCE FEE" />
            
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                {/* Decorative elements with responsive sizing */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10">
                  {/* Improved grid with better responsive spacing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="rounded-xl bg-gradient-to-r p-[1px] from-[#4CB050] to-[#F0A023]">
                      <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 flex flex-col justify-between">
                        <div>
                          <Text className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            For Local Participants
                          </Text>
                          <Title level={2} className="mt-2 mb-3 sm:mb-4 font-bold text-gray-900 dark:text-white text-xl sm:text-2xl md:text-3xl">
                            IDR 750,000
                            <span className="text-sm sm:text-base font-normal text-gray-600 dark:text-gray-400"> / paper</span>
                          </Title>
                          <Paragraph className="dark:text-gray-300 text-gray-700 text-sm sm:text-base">
                            For presenters from Indonesia
                          </Paragraph>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-xl bg-gradient-to-r p-[1px] from-[#F0A023] to-[#E52531]">
                      <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 flex flex-col justify-between">
                        <div>
                          <Text className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            For International Participants
                          </Text>
                          <Title level={2} className="mt-2 mb-3 sm:mb-4 font-bold text-gray-900 dark:text-white text-xl sm:text-2xl md:text-3xl">
                            USD 100
                            <span className="text-sm sm:text-base font-normal text-gray-600 dark:text-gray-400"> / paper (in person)</span>
                          </Title>
                          <Title level={3} className="mt-2 mb-3 sm:mb-4 font-bold bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text text-lg sm:text-xl md:text-2xl">
                            FREE
                            <span className="text-sm sm:text-base font-normal text-gray-600 dark:text-gray-400"> (online)</span>
                          </Title>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Benefits section with improved padding for small screens */}
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <Title level={4} className="mb-3 sm:mb-4 text-center dark:text-white text-gray-900 text-lg sm:text-xl">
                      Presenter Benefits
                    </Title>
                    <Paragraph className="dark:text-gray-300 text-gray-700 text-center text-sm sm:text-base">
                      Presenters will receive a seminar kit, three refreshment vouchers, and a presenter certificate listing the paper's title and all authors' names.
                    </Paragraph>
                    
                    <Divider className="my-3 sm:my-4" />
                    
                    <Paragraph className="dark:text-gray-300 text-gray-700 text-center text-sm sm:text-base">
                      Additional co-authors (other than 3 covered authors) should register through
                      <a 
                        href="https://s.id/coauthor" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 font-medium text-[#4CB050] hover:text-[#E52531] transition-colors"
                      >
                        https://s.id/coauthor
                      </a>
                    </Paragraph>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
          
          {/* Publication Section - Improved grid and spacing */}
          <motion.section className="mb-12 sm:mb-16 md:mb-24" variants={itemVariants}>
            <SectionHeading title="PUBLICATION OPPORTUNITIES" />
            
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                {/* Decorative elements with responsive sizing */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10">
                  <div className="mb-6 sm:mb-8">
                    <Paragraph className="text-base sm:text-lg dark:text-gray-300 text-gray-700">
                      Selected papers will be published in the following reputable official journals, depending on the scope of the paper. Additional publication fees will be charged, and the paper will be assessed according to each journal's policies.
                    </Paragraph>
                  </div>
                  
                  {/* Improved journal grid with even spacing and better responsiveness */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {journals.map((journal, index) => (
                      <div key={index} className="rounded-xl bg-gradient-to-r p-[1px] from-[#4CB050] via-[#F0A023] to-[#E52531] flex">
                        <div className="h-full w-full bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                          <div className="flex flex-col items-center">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#4CB050] to-[#F0A023] mb-3 sm:mb-4">
                              <span className="font-bold text-white text-base sm:text-lg">{index + 1}</span>
                            </div>
                            <Text className="font-medium text-center block mb-3 dark:text-white text-gray-900 text-sm sm:text-base line-clamp-2 min-h-[40px] flex items-center">
                              {journal.name}
                            </Text>
                          </div>
                          <div className="flex justify-center">
                            <Text className="text-xs sm:text-sm text-center block dark:text-gray-400 text-gray-600">
                              <span className="inline-block px-2 sm:px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                                Scopus Index, IF {journal.impactFactor}
                              </span>
                            </Text>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* E3S Web section with improved flex layout and alignment */}
                  <div className="rounded-xl bg-gradient-to-r p-[1px] from-[#2a3b8f] via-[#F0A023] to-[#E52531]">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
                        <div className="flex-shrink-0 flex items-center justify-center w-full sm:w-auto">
                          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-tr from-[#2a3b8f] to-[#E52531] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5m14 0v12a2 2 0 01-2 2h-3" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <Title level={4} className="dark:text-white text-gray-900 mb-3 text-center sm:text-left text-lg sm:text-xl">
                            E3S Web of Conference (SCOPUS)
                          </Title>
                          <Paragraph className="dark:text-gray-300 text-gray-700 text-sm sm:text-base text-center sm:text-left">
                            A total of 50 papers will have the opportunity to be published on the E3S Web of Conference (SCOPUS). Priority will be given to international authors (primary or co-author). Additional publication fees will be charged.
                          </Paragraph>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom banner with responsive sizing - made more prominent */}
                  <div className="mt-8 sm:mt-12 flex justify-center">
                    <div className="px-5 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] hover:shadow-[#4CB050]/20">
                      <Text className="font-medium text-white text-sm sm:text-base md:text-lg">
                        All accepted papers will be published on ICMA-SURE Proceeding without additional charge
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
          
          {/* Publisher Official Partners Section - Improved image responsiveness */}
          <motion.section variants={itemVariants}>
            <SectionHeading title="PUBLISHER OFFICIAL PARTNERS" />
            
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                {/* Decorative elements with responsive sizing */}
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col items-center justify-center">
                    {/* Single combined image of all journal logos with better responsive handling */}
                    <div className="w-full max-w-4xl mx-auto">
                      <div className="rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src="https://icma.lppm.unsoed.ac.id/wp-content/uploads/2024/08/Screenshot-2024-08-08-at-09.46.55-585x550.png" 
                          alt="Publisher Official Partners"
                          className="w-full h-auto object-contain" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'https://via.placeholder.com/800x500?text=Journal+Partners';
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Info box with responsive text sizing */}
                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 w-full max-w-4xl">
                      <Text className="dark:text-gray-300 text-gray-700 text-center block text-sm sm:text-base">
                        All journals are indexed in Scopus with various impact factors. Our publishing partners ensure high-quality peer-review processes and international visibility for your research.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default ConferenceInfoSection;