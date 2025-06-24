import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import HeroSection from '@/components/HeroSection';
import CounterStatsSection from '@/components/CounterStatsSection';
import SpeakersSection from '@/components/SpeakersSection';
import ConferenceInfoSection from '@/components/ConferenceInfoSection';
import ContactSection from '@/components/ContactSection';
import { Head } from '@inertiajs/react';

const Welcome: React.FC = () => {
  const keynoteSpeakers = [
    {
      image: '/images/assets/prof-stella.webp',
      name: 'Prof. Stella Christie, A.B., Ph.D.',
      title: 'Deputy Minister of Higher Education, Science and Technology of the Republic of Indonesia',
      country: 'Indonesia',
      status: 'Keynote Speaker',
      description: 'An academic and cognitive scientist from Medan, North Sumatra, Indonesia, who currently serves as Deputy Minister of Higher Education, Science and Technology. She earned her Bachelor\'s degree from Harvard University and her Ph.D. from Northwestern University in cognitive psychology.'
    }
  ];      

  const invitedSpeakers = [
    {
      image: '/images/assets/viet.jpg',
      name: 'Assoc. Prof. Dr. Ngo Thi Phuong Lan',
      title: 'Rural Development in Adaptation to Climate Change',
      country: 'Vietnam',
      status: 'University of Sciences and Humanities Ho Chi Minh City'
    },
    {
      image: '/images/assets/zexun.jpg', 
      name: 'Prof. Dr. Zexun Wei',
      title: 'China-Indonesia Joint Observation in Indonesian Seas during the Past Decades and New Scientific Understandings',
      country: 'China',
      status: 'Deputy Director, Ministry of Natural Resources, P.R. China'
    },
    {
      image: '/images/assets/totok.jpeg', 
      name: 'Prof. Ir. Totok Agung Dwi Haryanto, M.P., Ph.D.',
      title: 'Digital Innovation in Agricultural Systems',
      country: 'Indonesia',
      status: 'Universitas Jenderal Soedirman'
    },
    {
      image: '/images/assets/maiko.webp',
      name: 'Dr. Maiko Nishi',
      title: 'Climate Resilience in Globally Important Agricultural Heritage System (GIAHS)',
      country: 'Japan',
      status: 'United Nations University Tokyo'
    },
    {
      image: '/images/assets/sebastion.jpg', 
      name: 'Dr. Sebastian C. A Ferse',
      title: 'Sustainability of Island Livelihood in the Face of Social-Ecological and Climatic Change',
      country: 'Germany',
      status: 'Leibniz Centre for Tropical Marine Research'
    },
    {
      image: '/images/assets/chyan.webp', 
      name: 'Prof. Chyan-Deng Jan',
      title: 'Methods used for Debris-flow Disaster Mitigation in Taiwan',
      country: 'Taiwan',
      status: 'Dean of the College of Engineering (NCKU) Tainan'
    }
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