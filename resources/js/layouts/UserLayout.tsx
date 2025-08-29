import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from './AppLayout';

interface UserLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const UserLayout: React.FC<UserLayoutProps> = ({ 
  children, 
  title = 'User Dashboard',
  description = 'ICMA SURE User Dashboard'
}) => {
  return (
    <AppLayout>
      <Head>
        <title>{title} - ICMA SURE</title>
        <meta name="description" content={description} />
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default UserLayout;