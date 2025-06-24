import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, Globe } from 'lucide-react';

// Contact person interface
interface ContactPerson {
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  role?: string;
}

const ContactSection: React.FC = () => {
  // Color palette
  const colors = {
    red: '#E52531',
    green: '#4CB050',
    blue: '#2a3b8f',
    orange: '#F0A023',
    whatsapp: '#25D366'
  };

  // Contact data
  const contactPeople: ContactPerson[] = [
    {
      name: "Enny Dwi Cahyani, S.H., M.H",
      phone: "+62 813-2838-8346",
      whatsapp: "+62 813-2838-8346",
      email: "icmasure.lppm@unsoed.ac.id",
     
    },
    {
      name: "Yemima Sahmura Vividia",
      phone: "+62 812-2679-8679",
      whatsapp: "+62 812-2679-8679",
      email: "icmasure.lppm@unsoed.ac.id",
     
    },
    {
      name: "Khaidar Ali",
      phone: "+62 858-9623-9634",
      whatsapp: "+62 858-9623-9634",
      email: "icmasure.lppm@unsoed.ac.id",
     
    }
  ];

  const organizationInfo = {
    name: "Institute of Research and Community Service",
    university: "Universitas Jenderal Soedirman",
    address: "Jl. Dr. Soeparno Karangwangkal, Purwokerto 53122, Central Java, Indonesia",
    website: "https://icma8.lppm.unsoed.ac.id/",
    email: "icmasure.lppm@unsoed.ac.id"
  };

  // Section heading component
  const SectionHeading = ({ title }: { title: string }) => (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-green-500 via-orange-400 to-red-500"></div>
    </div>
  );

  // Contact card component
  const ContactCard = ({ contact, index }: { contact: ContactPerson; index: number }) => {
    const gradients = [
      'from-green-500 to-orange-400',
      'from-orange-400 to-red-500',
      'from-red-500 to-blue-600'
    ];
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative p-6">
          {/* Accent line */}
          <div className={`absolute top-0 left-0 w-1 h-16 bg-gradient-to-b ${gradients[index]}`}></div>
          
          <div className="pl-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Contact Person
            </h4>
            
            <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {contact.name}
            </h5>

           
            
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-gray-900 dark:text-white hover:text-red-500 transition-colors font-medium"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              {contact.whatsapp && (
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                    <a 
                      href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 dark:text-white hover:text-green-600 transition-colors font-medium"
                    >
                      {contact.whatsapp}
                    </a>
                  </div>
                </div>
              )}
              
              {/* Email */}
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-gray-900 dark:text-white hover:text-red-500 transition-colors font-medium break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading title="Contact Information" />
        
        {/* Organization Info */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="relative p-8">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-100 dark:from-green-900 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-100 dark:from-red-900 to-transparent rounded-tr-full"></div>
              
              <div className="relative text-center">
                <h3 className="text-2xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-green-500 via-orange-400 to-red-500 text-transparent bg-clip-text">
                    Organized by
                  </span>
                </h3>
                
                <div className="space-y-2 mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {organizationInfo.name}
                  </h4>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {organizationInfo.university}
                  </p>
                  
                  <div className="flex items-center justify-center mt-4">
                    <MapPin className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-700 dark:text-gray-300 text-center">
                      {organizationInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href={organizationInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-orange-400 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Conference Website
                  </a>
                  
                  <a 
                    href={`mailto:${organizationInfo.email}`}
                    className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Persons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {contactPeople.map((contact, index) => (
            <ContactCard key={index} contact={contact} index={index} />
          ))}
        </div>
        
        {/* Map Section */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              <div className="h-96 w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d441.3708232552276!2d109.24869974166614!3d-7.408249529389021!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655eebfbcedd67%3A0x9c3e15da7ebb08ef!2sLembaga%20Penelitian%20dan%20Pengabdian%20Masyarakat%20UNSOED!5e0!3m2!1sid!2sid!4v1744341778227!5m2!1sid!2sid" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ICMA SURE Conference Location"
                  className="rounded-lg"
                />
              </div>
              
              {/* Map overlay info */}
              <div className="absolute bottom-8 left-8 max-w-sm">
                <div className="bg-white dark:bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-red-500 mr-2" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      Conference Coordination Center
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    LPPM Building<br />
                    Universitas Jenderal Soedirman<br />
                    Purwokerto, Central Java, Indonesia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Contact CTA */}
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Need assistance with your submission or participation?
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Our organizing committee is ready to help you with any questions about abstract submission, registration, technical requirements, or conference participation.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={`https://wa.me/${contactPeople[0].whatsapp?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Contact
            </a>
            
            <a 
              href={`mailto:${contactPeople[0].email}`}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-orange-400 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;