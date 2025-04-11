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
          image: 'https://akcdn.detik.net.id/visual/2024/10/21/momen-pelantikan-wamen-kabinet-merah-putih-prabowo-gibran-6_11.jpeg?w=720&q=90',
          name: 'Prof. Stella Christie, A.B., Ph.D.',
          title: 'Deputy Minister of Higher Education, Science and Technology of the Republic of Indonesia',
          country: 'Indonesia',
          status: '',
          description: 'An academic and cognitive scientist from Medan, North Sumatra, Indonesia, who currently serves as Deputy Minister of Higher Education, Science and Technology. She earned her Bachelor\'s degree from Harvard University and her Ph.D. from Northwestern University in cognitive psychology.'
        }
      ];      
  
  const invitedSpeakers = [
    {
      image: '/storage/speakers/invited-speaker-1.jpg', // Replace with your actual image path
      name: 'Assoc. Prof. Dr. Ngo Thi Phuong Lan',
      title: 'University of Social Sciences and Humanities',
      country: 'Vietnam',
      status: ''
    },
    {
      image: '/storage/speakers/invited-speaker-2.jpg', // Replace with your actual image path
      name: 'Prof. Dr. Zexun Wei',
      title: 'Guangdong Ocean University',
      country: 'China',
      status: ''
    },
    {
      image: '/storage/speakers/invited-speaker-3.jpg', // Replace with your actual image path
      name: 'Prof. Ir. Totok Agung Dwi Haryanto, M.P., Ph.D.',
      title: 'Faculty of Agriculture',
      country: 'Indonesia',
      status: ''
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