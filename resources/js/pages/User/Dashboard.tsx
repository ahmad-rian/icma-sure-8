import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, User, CheckCircle } from 'lucide-react';

interface DashboardProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  submissions?: any[];
  profile?: any;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const { auth, submissions = [], profile } = usePage<DashboardProps>().props;

  const hasProfile = profile && profile.first_name;
  const hasSubmissions = submissions.length > 0;

  return (
    <UserLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {auth.user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your abstract submissions for the 8th ICMA SURE conference.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className={`${hasProfile ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'}`}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <User className={`h-6 w-6 ${hasProfile ? 'text-green-600' : 'text-yellow-600'}`} />
              <div className="ml-3">
                <CardTitle className="text-sm font-medium">
                  Profile
                </CardTitle>
                <CardDescription>
                  {hasProfile ? 'Profile completed' : 'Complete your profile'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {hasProfile ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-yellow-600 mr-2" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {hasProfile ? 'Ready' : 'Required'}
                  </span>
                </div>
                <Link href="/user/profile">
                  <Button variant="outline" size="sm">
                    {hasProfile ? 'Edit' : 'Complete'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Submit Abstract Card */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <CardTitle className="text-sm font-medium">
                  Submit Abstract
                </CardTitle>
                <CardDescription>
                  Submit your research abstract
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {hasSubmissions ? `${submissions.length} submitted` : 'No submissions yet'}
                </span>
                <Link href="/user/submissions">
                  <Button size="sm" disabled={!hasProfile}>
                    {hasProfile ? 'Submit' : 'Complete Profile First'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upload Payment Card */}
          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Upload className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <CardTitle className="text-sm font-medium">
                  Payment
                </CardTitle>
                <CardDescription>
                  Upload payment proof
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {hasSubmissions ? 'Available' : 'Submit abstract first'}
                </span>
                <Button variant="outline" size="sm" disabled={!hasSubmissions}>
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        {hasSubmissions && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Submissions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {submissions.slice(0, 3).map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Abstract #{index + 1}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Submitted on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Under Review
                      </span>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {submissions.length > 3 && (
                <div className="mt-4 text-center">
                  <Link href="/user/submissions">
                    <Button variant="outline">
                      View All Submissions
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Getting Started Guide */}
        {!hasProfile && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Getting Started
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-medium">
                    1
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Complete your profile</strong> - Fill in your personal and academic information
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 text-gray-600 text-sm font-medium">
                    2
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Submit your abstract</strong> - Upload your research abstract for review
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 text-gray-600 text-sm font-medium">
                    3
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Upload payment proof</strong> - Complete your registration with payment
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/user/profile">
                <Button>
                  Start with Profile
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Dashboard;