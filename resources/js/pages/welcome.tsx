import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import HeroSection from '@/components/HeroSection';
import CounterStatsSection from '@/components/CounterStatsSection';
import ThemesSection from '@/components/ThemesSection';
import SpeakersSection from '@/components/SpeakersSection';
import ConferenceInfoSection from '@/components/ConferenceInfoSection';
import ContactSection from '@/components/ContactSection';
import { Head } from '@inertiajs/react';

const Welcome: React.FC = () => {
  const keynoteSpeakers = [
    {
      image: '/images/assets/prof-stella.webp',
      name: 'Prof. Stella Christie, A.B., Ph.D.',
      title: 'Vice Minister of Higher Education, Science and Technology of the Republic of Indonesia',
      country: 'Indonesia',
      status: 'Keynote Speaker',
      description: 'An academic and cognitive scientist from Medan, North Sumatra, Indonesia, who currently serves as Vice Minister of Higher Education, Science and Technology. She earned her Bachelor\'s degree from Harvard University and her Ph.D. from Northwestern University in cognitive psychology.'
    }
  ];      

  const invitedSpeakers = [
    {
      image: '/images/assets/janos.jpeg',
      name: 'Dr. János Kovács',
      title: 'University of Pecs',
      country: 'Hungary',
      status: 'University of Pecs',
    },
    {
      image: '/images/assets/linma.webp',
      name: 'Dr. Lin Ma',
      title: 'The University of Manchester',
      country: 'United Kingdom',
      status: 'The University of Manchester',
    },
    {
      image: '/images/assets/tuomo.jpeg', 
      name: 'Dr. Tuomo Rautakivi',
      title: 'Centria University of Applied Science, Finland',
      country: 'Finland',
      status: 'Ministry of Labour and Vocational Training ',
    },
    {
      image: '/images/assets/ritthikorn2.jpeg', 
      name: 'Dr. Ritthikorn Siriprasertchok',
      title: 'Burapha University',
      country: 'Thailand',
      status: 'Bhurapa University'
    },
  ];

  // Updated stats based on TOR document
  const conferenceStats = [
    {
      icon: (
        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9V7h9v14z"/>
        </svg>
      ),
      value: 5,
      label: 'Sub-Themes',
      duration: 1.5
    },
    {
      icon: (
        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      ),
      value: 80,
      label: 'Presentations',
      duration: 2.5
    },
    {
      icon: (
        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
        </svg>
      ),
      value: 100,
      label: 'Online Participants',
      duration: 3
    },
    {
      icon: (
        <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
        </svg>
      ),
      value: 12,
      label: 'Countries',
      duration: 1.8
    }
  ];

  return (
    <AppLayout>
      <Head>
        <title>The 8th ICMA SURE - International Conference on Multidisciplinary Approaches for Sustainable Rural Development</title>
        <meta name="description" content="The 8th ICMA SURE 2025: Sustainable Digital Transformation - Integrating Local Values in Downstream Development. October 7, 2025, 100% Online Conference by Universitas Jenderal Soedirman." />
        <meta name="keywords" content="ICMA SURE, sustainable development, digital transformation, rural development, international conference, research" />
        <meta property="og:title" content="The 8th ICMA SURE 2025" />
        <meta property="og:description" content="International Conference on Multidisciplinary Approaches for Sustainable Rural Development - October 7, 2025" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <HeroSection 
        title="SUSTAINABLE DIGITAL TRANSFORMATION"
        subtitle="INTEGRATING LOCAL VALUES IN DOWNSTREAM DEVELOPMENT"
        tagline="THE 8TH ICMA SURE 2025"
        eventDate="7 October 2025"
        eventLocation="100% Online Conference"
      />
      
      <CounterStatsSection 
        stats={conferenceStats}
      />
      
      <ThemesSection />
      
      <SpeakersSection 
        keynoteSpeakers={keynoteSpeakers}
        invitedSpeakers={invitedSpeakers}
      />
      
      <ConferenceInfoSection />
      
      <ContactSection />
    </AppLayout>
  );
};

export default Welcome;