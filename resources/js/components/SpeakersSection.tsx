import React from 'react';
import { useTheme } from '@/components/ThemeProvider';

interface SpeakerProps {
  image: string;
  name: string;
  title: string;
  country: string;
  status?: string;
  description?: string;
}

interface SpeakersSectionProps {
  keynoteSpeakers: SpeakerProps[];
  invitedSpeakers: SpeakerProps[];
}

const SpeakersSection: React.FC<SpeakersSectionProps> = ({ 
  keynoteSpeakers = [], 
  invitedSpeakers = [] 
}) => {
  const { isDarkMode } = useTheme();
  
  // Section heading component
  const SectionHeading = ({ title }: { title: string }) => (
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white text-gray-900">
        {title}
      </h2>
      <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
    </div>
  );

  // Keynote speaker card component - simplified for better performance
  const KeynoteSpeakerCard = ({ speaker }: { speaker: SpeakerProps }) => (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image container */}
        <div className="md:w-2/5">
          <div className="aspect-[3/4] md:h-full overflow-hidden">
            <img 
              src={speaker.image} 
              alt={speaker.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x600?text=No+Image';
              }}
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="md:w-3/5 p-5 flex flex-col justify-center dark:bg-gray-800 bg-white">
          <div className="border-l-2 border-gradient pl-3">
            <h3 className="text-xl md:text-2xl font-bold mb-1 dark:text-white text-gray-900">
              {speaker.name}
            </h3>
            <p className="text-base font-medium mb-1 dark:text-gray-300 text-gray-700">
              {speaker.title}
            </p>
            <p className="text-base font-semibold mb-3 text-[#4CB050]">
              ({speaker.country})
            </p>
          </div>
          
          {speaker.description && (
            <p className="dark:text-gray-300 text-gray-600 leading-relaxed mt-2 pl-3">
              {speaker.description}
            </p>
          )}
          
          {speaker.status && (
            <div className="mt-3 inline-block px-3 py-1 text-sm rounded-full dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600 ml-3">
              {speaker.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Invited speaker card component - simplified for better performance
  const InvitedSpeakerCard = ({ speaker }: { speaker: SpeakerProps }) => (
    <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full dark:bg-gray-800 bg-white">
      <div className="relative h-full flex flex-col">
        {/* Image container */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img 
              src={speaker.image} 
              alt={speaker.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          
          {/* Name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-lg font-bold mb-0.5 text-white">
              {speaker.name}
            </h3>
            <p className="text-white/90 text-sm">
              {speaker.title}
            </p>
            <p className="text-sm font-medium text-[#4CB050]">
              ({speaker.country})
            </p>
          </div>
        </div>
        
        {/* Status badge (if any) */}
        {speaker.status && (
          <div className="absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full bg-white/90 text-gray-800 font-medium">
            {speaker.status}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-12 md:py-16 dark:bg-gray-900 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Keynote Speakers */}
        {keynoteSpeakers.length > 0 && (
          <section className="mb-16">
            <SectionHeading title="Keynote Speaker" />
            
            <div className="space-y-6">
              {keynoteSpeakers.map((speaker, index) => (
                <KeynoteSpeakerCard key={index} speaker={speaker} />
              ))}
            </div>
          </section>
        )}
        
        {/* Invited Speakers */}
        {invitedSpeakers.length > 0 && (
          <section>
            <SectionHeading title="Invited Speakers" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {invitedSpeakers.map((speaker, index) => (
                <InvitedSpeakerCard key={index} speaker={speaker} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SpeakersSection;