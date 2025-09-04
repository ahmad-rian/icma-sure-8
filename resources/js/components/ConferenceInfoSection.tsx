import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Divider } from 'antd';
import { useTheme } from '@/components/ThemeProvider';

const { Title, Text, Paragraph } = Typography;

interface JournalInfo {
  name: string;
  type: string;
  indexed?: string;
}

interface ConferenceInfoSectionProps {
  submitUrl?: string;
}

const ConferenceInfoSection: React.FC<ConferenceInfoSectionProps> = ({
  submitUrl = "https://jos.unsoed.ac.id/index.php/eprocicma/index"
}) => {
  const { isDarkMode } = useTheme();
  
  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023'
  };

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
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  const SectionHeading = ({ title }: { title: string }) => (
    <div className="text-center mb-6 sm:mb-8 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 dark:text-white text-gray-900">
        {title}
      </h2>
      <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
    </div>
  );

  // Updated publication venues based on TOR
  const journals: JournalInfo[] = [
    { name: "Jurnal Molekul", type: "Journal", indexed: "Scopus Q4" },
    { name: "Jurnal Keperawatan Soedirman", type: "Journal", indexed: "Scopus Q4" }
  ];

  const handleSubmit = () => {
    // Check if user is authenticated by trying to access a protected route
    // If not authenticated, Laravel will redirect to login page automatically
    window.location.href = '/user/submissions/create';
  };

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
          {/* Conference Format Section */}
          <motion.section className="mb-12 sm:mb-16 md:mb-24" variants={itemVariants}>
            <SectionHeading title="CONFERENCE FORMAT" />
            
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10 text-center">
                  <Title level={3} className="mb-4 sm:mb-6 font-bold text-xl sm:text-2xl md:text-3xl">
                    <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                      100% Online Conference
                    </span>
                  </Title>
                  
                  <div className="mb-6 sm:mb-8">
                    <Paragraph className="text-base sm:text-lg md:text-xl dark:text-gray-300 text-gray-700">
                      The conference will be conducted entirely online, with the organizing committee coordinating from LPPM Building, Universitas Jenderal Soedirman, Purwokerto, Central Java, Indonesia.
                    </Paragraph>
                  </div>
                  
                  <div className="rounded-xl bg-gradient-to-r p-[1px] from-[#4CB050] via-[#F0A023] to-[#E52531]">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-tr from-[#4CB050] to-[#F0A023] flex items-center justify-center mx-auto mb-3">
                            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                          </div>
                          <Text className="font-semibold text-gray-900 dark:text-white block">Global Accessibility</Text>
                          <Text className="text-sm text-gray-600 dark:text-gray-400">No geographical barriers</Text>
                        </div>
                        
                        <div className="text-center">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-tr from-[#F0A023] to-[#E52531] flex items-center justify-center mx-auto mb-3">
                            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <Text className="font-semibold text-gray-900 dark:text-white block">Cost Effective</Text>
                          <Text className="text-sm text-gray-600 dark:text-gray-400">Reduced travel costs</Text>
                        </div>
                        
                        <div className="text-center">
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-tr from-[#E52531] to-[#2a3b8f] flex items-center justify-center mx-auto mb-3">
                            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <Text className="font-semibold text-gray-900 dark:text-white block">Environmental Impact</Text>
                          <Text className="text-sm text-gray-600 dark:text-gray-400">Minimized carbon footprint</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Registration Fees Section */}
          <motion.section className="mb-12 sm:mb-16 md:mb-24" variants={itemVariants}>
            <SectionHeading title="REGISTRATION INFORMATION" />
            
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <Paragraph className="text-lg dark:text-gray-300 text-gray-700">
                      Registration details and fees will be announced soon. Stay tuned for updates on our official website and registration platform.
                    </Paragraph>
                  </div>
                  
                  <div className="flex justify-center mb-8">
                    <div className="rounded-xl bg-gradient-to-r p-[1px] from-[#4CB050] to-[#F0A023] max-w-md w-full">
                      <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#4CB050] to-[#F0A023] flex items-center justify-center mx-auto mb-4">
                          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <Title level={4} className="text-gray-900 dark:text-white mb-2">Abstract Submission</Title>
                        <Text className="text-gray-600 dark:text-gray-400">Opens: 15 August 2025</Text>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <motion.button
                      onClick={handleSubmit}
                      className="group inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#E52531] via-[#F0A023] to-[#4CB050] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <svg className="w-6 h-6 mr-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="relative z-10">Submit Your Paper</span>
                      <svg className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>
          
          {/* Publication Opportunities */}
          <motion.section className="mb-12 sm:mb-16 md:mb-24" variants={itemVariants}>
            <SectionHeading title="PUBLICATION OPPORTUNITIES" />
            
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10">
                  <div className="mb-8">
                    <Paragraph className="text-base sm:text-lg dark:text-gray-300 text-gray-700 text-center">
                      Selected papers will be published in reputable journals, subject to peer review and additional publication fees according to each journal's policies.
                    </Paragraph>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                    {journals.map((journal, index) => (
                      <div key={index} className="rounded-xl bg-gradient-to-r p-[1px] from-[#4CB050] via-[#F0A023] to-[#E52531]">
                        <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#4CB050] to-[#E52531] flex items-center justify-center mx-auto mb-4">
                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <Title level={5} className="text-gray-900 dark:text-white mb-2 text-sm font-semibold">
                            {journal.name}
                          </Title>
                          <Text className="text-xs text-gray-600 dark:text-gray-400 block mb-2">
                            {journal.type}
                          </Text>
                          {journal.indexed && (
                            <div className="inline-block px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                              <Text className="text-xs text-gray-600 dark:text-gray-400">
                                {journal.indexed}
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] shadow-lg">
                      <Text className="font-medium text-white">
                        All accepted papers will be published in ICMA-SURE Proceedings without additional charge
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Important Dates Section */}
          <motion.section variants={itemVariants}>
            <SectionHeading title="IMPORTANT DATES" />
            
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-bl from-[#4CB050]/10 via-[#E52531]/5 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tr from-[#E52531]/10 via-[#F0A023]/5 to-transparent rounded-tr-full"></div>
                
                <div className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { date: '15 August 2025', event: 'Abstract Submission Opens', icon: 'document' },
                      { date: '15 September 2025', event: 'Abstract Submission Deadline', icon: 'deadline' },
                      { date: '17 September 2025', event: 'Announcement', icon: 'announcement' },
                      { date: '19 September 2025', event: 'Payment Due', icon: 'payment' },
                      { date: '7 October 2025', event: 'Conference Event', icon: 'event', highlight: true }
                    ].map((item, index) => (
                      <div key={index} className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                        item.highlight 
                          ? 'border-gradient-to-r from-[#4CB050] to-[#E52531] bg-gradient-to-r from-[#4CB050]/5 to-[#E52531]/5' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-[#4CB050]'
                      } ${index === 4 ? 'md:col-span-2' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            item.highlight 
                              ? 'bg-gradient-to-br from-[#4CB050] to-[#E52531]' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <svg className={`h-6 w-6 ${item.highlight ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <Text className={`font-semibold block ${item.highlight ? 'text-[#E52531]' : 'text-gray-900 dark:text-white'}`}>
                              {item.event}
                            </Text>
                            <Text className={`text-sm ${item.highlight ? 'text-[#4CB050] font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                              {item.date}
                            </Text>
                          </div>
                        </div>
                      </div>
                    ))}
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