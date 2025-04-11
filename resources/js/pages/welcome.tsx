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
          status: '',
          description: 'An academic and cognitive scientist from Medan, North Sumatra, Indonesia, who currently serves as Deputy Minister of Higher Education, Science and Technology. She earned her Bachelor\'s degree from Harvard University and her Ph.D. from Northwestern University in cognitive psychology.'
        }
      ];      
  
  const invitedSpeakers = [
    {
      image: '/images/assets/image1-viet.jpg',
      name: 'Assoc. Prof. Dr. Ngo Thi Phuong Lan ',
      title: 'TOPIC : Rural Development in Adaptation to Climate Change',
      country: 'Vietnam',
      status: 'Sciences and Humanities Ho Chi Minh City Vietnam'
    },
    
    {
      image: '/images/assets/zexun.jpg', 
      name: 'Prof. Dr. Zexun Wei ',
      title: 'TOPIC : China-Indonesia Joint Observation in Indonesian Seas during the Past Decades and New Scientific Understandings',
      country: 'China',
      status: 'Deputy Director, Ministry of Natural Resources, P.R. China'
    },
    {
      image: '/images/assets/totok.jpeg', 
      name: 'Prof. Ir. Totok Agung Dwi Haryanto, M.P., Ph.D.',
      title: 'Faculty of Agriculture',
      country: 'Indonesia',
      status: 'Universitas Jenderal Soedirman'
    },
    {
        image: '/images/assets/maiko.webp',
        name: 'Dr. Maiko Nishi',
        title: 'TOPIC : Climate Resilience in Globally Important Agricultural Heritage System (GIAHS)',
        country: 'Japan',
        status: 'United Nations University Tokyo, Japan'
      },
      
      {
        image: '/images/assets/sebastion.jpg', 
        name: 'Dr. Sebastian C. A Ferse',
        title: 'TOPIC : Sustainability of Island Livelihood in the Face of Social-Ecological and Climatic Change',
        country: 'Germany',
        status: 'Leibniz Centre for Tropical Marine Research, Germany'
      },
      {
        image: '/images/assets/chyan.webp', 
        name: 'Prof. Chyan-Deng Jan',
        title: 'Methods used for Debris-flow Disaster Mitigation in Taiwan',
        country: 'Taiwan',
        status: 'Dean of the College of Engineering (NCKU) Tainan, Taiwan'
      }
  ];

  return (
    <AppLayout>
      <Head>
        <meta name="description" content="The 8th ICMA SURE - International Conference on Multidiscipline Approaches for Sustainable Rural Development" />
      </Head>
      
      <HeroSection />
      
      <CounterStatsSection />
      
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