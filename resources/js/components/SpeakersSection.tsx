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
  
  // Section heading component with improved underline
  const SectionHeading = ({ title }: { title: string }) => (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white text-gray-900">
        {title}
      </h2>
      <div className="relative">
        <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-[#4CB050] via-[#F0A023] to-[#E52531]"></div>
      </div>
    </div>
  );

  // Keynote speaker card component - enhanced for better display
  const KeynoteSpeakerCard = ({ speaker }: { speaker: SpeakerProps }) => (
    <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image container */}
        <div className="md:w-2/5">
          <div className="aspect-[3/4] md:h-full overflow-hidden">
            <img 
              src={speaker.image} 
              alt={speaker.name}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x600?text=No+Image';
              }}
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="md:w-3/5 p-6 flex flex-col justify-center dark:bg-gray-800 bg-white">
          <div className="border-l-3 border-gradient-to-r from-[#4CB050] to-[#4CB050] pl-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white text-gray-900">
              {speaker.name}
            </h3>
            <p className="text-lg font-medium mb-1 dark:text-gray-300 text-gray-700">
              {speaker.title}
            </p>
            <p className="text-lg font-semibold mb-3 text-[#4CB050]">
              ({speaker.country})
            </p>
          </div>
          
          {speaker.description && (
            <p className="dark:text-gray-300 text-gray-600 leading-relaxed mt-3 pl-4 text-base">
              {speaker.description}
            </p>
          )}
          
          {speaker.status && (
            <div className="mt-4 inline-block px-4 py-1 text-sm rounded-full dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600 ml-4">
              {speaker.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Invited speaker card component - completely redesigned for better appearance
  const InvitedSpeakerCard = ({ speaker }: { speaker: SpeakerProps }) => (
    <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full dark:bg-gray-800 bg-white">
      <div className="relative h-full flex flex-col">
        {/* Image container with gradient overlay */}
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img 
              src={speaker.image} 
              alt={speaker.name}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
          </div>
        </div>
        
        {/* Information section */}
        <div className="p-5 flex-grow">
          <div className="mb-3">
            <h3 className="text-xl font-bold mb-1 dark:text-white text-gray-900 line-clamp-2">
              {speaker.name}
            </h3>
            <p className="text-sm font-medium text-[#4CB050] mb-2">
              ({speaker.country})
            </p>
          </div>
          
          <p className="text-sm dark:text-gray-300 text-gray-700 line-clamp-3 mb-3">
            {speaker.title}
          </p>
          
          {/* Status badge at the top of the card */}
          {speaker.status && (
            <div className="absolute top-3 right-3 px-3 py-1 text-xs rounded-full bg-white shadow-md text-gray-800 font-medium max-w-[70%] truncate">
              {speaker.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-16 md:py-20 dark:bg-gray-900 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Keynote Speakers */}
        {keynoteSpeakers.length > 0 && (
          <section className="mb-20">
            <SectionHeading title="Keynote Speakers" />
            
            <div className="space-y-8">
              {keynoteSpeakers.map((speaker, index) => (
                <KeynoteSpeakerCard key={index} speaker={speaker} />
              ))}
            </div>
          </section>
        )}
        
        {/* Invited Speakers - Updated layout for 2x2 grid */}
        {invitedSpeakers.length > 0 && (
          <section>
            <SectionHeading title="Invited Speakers" />
            
            {/* Container dengan max-width untuk mengatur lebar grid */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {invitedSpeakers.map((speaker, index) => (
                  <InvitedSpeakerCard key={index} speaker={speaker} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SpeakersSection;