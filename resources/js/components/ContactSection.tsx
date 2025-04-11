import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Divider } from 'antd';
import { useTheme } from '@/components/ThemeProvider';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ContactPerson {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const ContactSection: React.FC = () => {
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
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }
    }
  };

  // Contact people data
  const contactPeople: ContactPerson[] = [
    {
      name: "Yemima Sahmura Vividia",
      phone: "+62 812-2679-8679",
      email: "icmasure.lppm@unsoed.ac.id",
      address: "Jl. Dr. Soeparno Karangwangkal – Purwokerto 53122"
    },
    {
      name: "Khaidar Ali",
      phone: "+62 858-9623-9634",
      email: "icmasure.lppm@unsoed.ac.id",
      address: "Jl. Dr. Soeparno Karangwangkal – Purwokerto 53122"
    }
  ];

  // Section heading component
  const SectionHeading = ({ title }: { title: string }) => (
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white text-gray-900">
        {title}
      </h2>
      <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
    </div>
  );

  // Contact card component
  const ContactCard = ({ contact }: { contact: ContactPerson }) => (
    <motion.div variants={itemVariants}>
      <Card
        className="h-full shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
        bordered={false}
      >
        <div className="relative px-6 py-8">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-[#4CB050] to-[#E52531]"></div>
          
          <div className="pl-3">
            <Title level={4} className="mb-4 dark:text-white text-gray-900">
              Contact Information
            </Title>
            
            <Paragraph className="text-lg font-medium dark:text-white text-gray-900 mb-6">
              {contact.name}
            </Paragraph>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <PhoneOutlined className="text-lg mt-1 text-[#4CB050]" />
                <div className="ml-4">
                  <Text className="text-sm text-gray-500 dark:text-gray-400 block">Phone</Text>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-gray-900 dark:text-white hover:text-[#E52531] dark:hover:text-[#E52531] transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <MailOutlined className="text-lg mt-1 text-[#F0A023]" />
                <div className="ml-4">
                  <Text className="text-sm text-gray-500 dark:text-gray-400 block">Email</Text>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-gray-900 dark:text-white hover:text-[#E52531] dark:hover:text-[#E52531] transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <EnvironmentOutlined className="text-lg mt-1 text-[#E52531]" />
                <div className="ml-4">
                  <Text className="text-sm text-gray-500 dark:text-gray-400 block">Address</Text>
                  <Text className="text-gray-900 dark:text-white">
                    {contact.address}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="py-16 md:py-24 dark:bg-gray-900 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <SectionHeading title="Contact Us" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactPeople.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </div>
          
          {/* Map Section */}
          <motion.div variants={itemVariants} className="mt-16">
            <Card 
              className="shadow-lg rounded-xl overflow-hidden backdrop-blur-sm dark:bg-gray-800/90 bg-white/95 border-0"
              bordered={false}
            >
              <div className="relative">
                {/* Map container */}
                <div className="h-80 md:h-96 w-full overflow-hidden rounded-lg">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d441.3708232552276!2d109.24869974166614!3d-7.408249529389021!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655eebfbcedd67%3A0x9c3e15da7ebb08ef!2sLembaga%20Penelitian%20dan%20Pengabdian%20Masyarakat%20UNSOED!5e0!3m2!1sid!2sid!4v1744341778227!5m2!1sid!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ICMA SURE Conference Location"
                  ></iframe>
                </div>
                
                {/* Overlay card with address */}
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 max-w-sm">
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4">
                      <div className="flex items-center mb-2">
                        <EnvironmentOutlined className="text-[#E52531] mr-2" />
                        <Text className="font-bold dark:text-white">
                          Conference Venue
                        </Text>
                      </div>
                      <Text className="dark:text-gray-300">
                      Lembaga Penelitian dan Pengabdian Masyarakat 
                      <br />Universitas Jenderal Soedirman<br />
                        
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Quick Contact Section */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Title level={4} className="dark:text-white text-gray-900 mb-4">
              Need more information?
            </Title>
            <Paragraph className="dark:text-gray-300 text-gray-700 mb-6">
              Feel free to reach out to us with any questions about the conference.
            </Paragraph>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:icmasure.lppm@unsoed.ac.id" 
                className="inline-flex items-center px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-md bg-gradient-to-r from-[#4CB050] to-[#F0A023] text-white hover:shadow-lg"
              >
                <MailOutlined className="mr-2" />
                Send Email
              </a>
              
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactSection;


