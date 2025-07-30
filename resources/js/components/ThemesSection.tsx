import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from 'antd';

const ThemesSection: React.FC = () => {
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }
    }
  };

  const subThemes = [
    {
      number: "01",
      title: "Life and Applied Sciences",
      description: "Scientific approaches to sustainable development and innovation in biological systems, environmental sciences, and applied research methodologies.",
      gradient: "from-[#4CB050] to-[#F0A023]",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      number: "02", 
      title: "Health and Well-being",
      description: "Comprehensive health approaches focusing on community wellness, preventive care, and sustainable healthcare systems for rural development.",
      gradient: "from-[#F0A023] to-[#E52531]",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    },
    {
      number: "03",
      title: "Resilience and Sustainable Infrastructure",
      description: "Building robust systems and infrastructure that can withstand challenges while promoting long-term sustainability and adaptability.",
      gradient: "from-[#E52531] to-[#2a3b8f]",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800"
    },
    {
      number: "04",
      title: "Social, Economy and Justice",
      description: "Addressing equitable development, social transformation, economic empowerment, and justice in sustainable rural communities.",
      gradient: "from-[#2a3b8f] to-[#4CB050]",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      number: "05",
      title: "Sustainable Communities",
      description: "Building resilient, self-sufficient community systems that balance environmental protection with social and economic development.",
      gradient: "from-[#4CB050] to-[#E52531]",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-tr from-[#4CB050]/5 to-transparent"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-gradient-to-bl from-[#E52531]/5 to-transparent"></div>
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.02]" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="500" r="400" fill="none" stroke={colors.blue} strokeWidth="2" />
          <circle cx="500" cy="500" r="300" fill="none" stroke={colors.green} strokeWidth="2" />
          <circle cx="500" cy="500" r="200" fill="none" stroke={colors.orange} strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Typography.Text className="text-sm sm:text-base uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-4 block">
              Conference Focus
            </Typography.Text>
            <Typography.Title level={1} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                Conference Theme
              </span>
            </Typography.Title>
          </motion.div>

          {/* Main Theme Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="max-w-5xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/20">
              <Typography.Title level={2} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">
                  Sustainable Digital Transformation
                </span>
              </Typography.Title>
              <Typography.Title level={3} className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
                Integrating Local Values in Downstream Development
              </Typography.Title>
              <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] mb-6"></div>
              <Typography.Paragraph className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                This theme addresses the critical intersection of technological advancement and sustainability, emphasizing how downstream implementation processes can be enhanced by incorporating local knowledge systems. It promotes a purposeful approach to digital transformation that extends beyond efficiency to embrace environmental stewardship.
              </Typography.Paragraph>
            </div>
          </motion.div>

          {/* Sub-themes Section */}
          <motion.div variants={itemVariants}>
            <Typography.Text className="text-sm sm:text-base uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-4 block">
              Research Focus Areas
            </Typography.Text>
            <Typography.Title level={2} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-12">
              Conference <span className="bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531] text-transparent bg-clip-text">Sub-Themes</span>
            </Typography.Title>
          </motion.div>
        </motion.div>

        {/* Sub-themes Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {subThemes.map((theme, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group p-6 sm:p-8 rounded-3xl ${theme.bgColor} border ${theme.borderColor} hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden`}
              whileHover={{ 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-2xl">{theme.number}</span>
                  </div>
                </div>
                
                <Typography.Title level={3} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                  {theme.title}
                </Typography.Title>
                
                <Typography.Paragraph className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {theme.description}
                </Typography.Paragraph>

                {/* Animated bottom accent */}
                <div className={`h-1 w-0 group-hover:w-full mt-6 rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-700 ease-out`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#4CB050]/10 via-[#F0A023]/10 to-[#E52531]/10 border-2 border-[#4CB050]/20 backdrop-blur-sm">
            <svg className="w-6 h-6 mr-3 text-[#4CB050]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <Typography.Text className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Join us in exploring innovative solutions for sustainable rural development
            </Typography.Text>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ThemesSection;