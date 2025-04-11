import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDays, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  User, 
  Users, 
  Calendar, 
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend 
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

interface DashboardProps {
  stats?: {
    organizing_committees: number;
    scientific_committees: number;
    total_articles: number;
    published_articles: number;
    draft_articles: number;
    total_events: number;
    active_events: number;
    users: number;
  };
  monthly_articles?: {
    month: string;
    published: number;
    draft: number;
  }[];
  monthly_events?: {
    month: string;
    events: number;
  }[];
  recent_activities?: {
    type: 'event' | 'article' | 'committee' | 'user';
    title: string;
    time: string;
  }[];
  trends?: {
    committees: {
      value: number;
      isPositive: boolean;
    };
    articles: {
      value: number;
      isPositive: boolean;
    };
    events: {
      value: number;
      isPositive: boolean;
    };
    users: {
      value: number;
      isPositive: boolean;
    };
  };
}

// Chart colors - consistent palette for better visual design
const COLORS = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  success: '#4CC9F0',
  warning: '#f72585',
  info: '#4895ef',
  danger: '#e63946',
  light: '#f8f9fa',
  dark: '#212529',
  published: '#4cc9f0',
  draft: '#f72585',
  organizing: '#4361ee',
  scientific: '#10b981',
  events: '#4895ef',
  positive: '#10b981',
  negative: '#ef4444'
};

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatsCard = ({ title, value, description, icon, trend, color = COLORS.primary }: StatsCardProps) => (
  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }}></div>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5", style: { color } })}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold" style={{ color }}>{value.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
    </CardContent>
    {trend && (
      <CardFooter className="p-2 pt-0">
        <div className="flex items-center">
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" 
            style={{ 
              backgroundColor: trend.isPositive ? `${COLORS.positive}15` : `${COLORS.negative}15`,
              color: trend.isPositive ? COLORS.positive : COLORS.negative
            }}
          >
            {trend.isPositive ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            {trend.value}%
          </div>
          <span className="text-xs text-muted-foreground ml-2">from last month</span>
        </div>
      </CardFooter>
    )}
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border shadow-lg rounded-md">
        <p className="font-semibold text-sm">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm flex items-center gap-2 mt-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span>{`${entry.name}: ${entry.value}`}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard(props: DashboardProps) {
  // Default values for props
  const stats = props.stats || {
    organizing_committees: 2,
    scientific_committees: 0,
    total_articles: 0,
    published_articles: 0,
    draft_articles: 0,
    total_events: 1,
    active_events: 1,
    users: 2
  };
  
  const monthly_articles = props.monthly_articles || [];
  const monthly_events = props.monthly_events || [];
  const recent_activities = props.recent_activities || [];
  const trends = props.trends || {
    committees: { value: 100, isPositive: true },
    articles: { value: 0, isPositive: true },
    events: { value: 100, isPositive: true },
    users: { value: 100, isPositive: true }
  };

  // Prepare committee data for pie chart
  const committeesData = [
    { name: 'Organizing', count: stats.organizing_committees, color: COLORS.organizing },
    { name: 'Scientific', count: stats.scientific_committees, color: COLORS.scientific },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-6 p-4 md:p-6 bg-gray-50 min-h-screen">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your ICMA SURE control panel</p>
          </div>
         
        </div>
      
        {/* Stats Cards */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Committee Members" 
            value={stats.organizing_committees + stats.scientific_committees}
            description={`${stats.organizing_committees} organizing, ${stats.scientific_committees} scientific`}
            icon={<Users />}
            trend={trends.committees}
            color={COLORS.primary}
          />
          
          <StatsCard 
            title="Articles" 
            value={stats.total_articles}
            description={`${stats.published_articles} published, ${stats.draft_articles} draft`}
            icon={<FileText />}
            trend={trends.articles}
            color={COLORS.info}
          />
          
          <StatsCard 
            title="Active Events" 
            value={stats.active_events}
            description={`Out of ${stats.total_events} total events`}
            icon={<Calendar />}
            trend={trends.events}
            color={COLORS.success}
          />
          
          <StatsCard 
            title="Users" 
            value={stats.users}
            description="Registered system users"
            icon={<User />}
            trend={trends.users}
            color={COLORS.warning}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2 border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                    Articles Overview
                  </CardTitle>
                  <CardDescription>Publishing activity over the last 6 months</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  Monthly
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthly_articles}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: 10 }}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Bar 
                      dataKey="published" 
                      name="Published" 
                      stackId="a" 
                      fill={COLORS.published} 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="draft" 
                      name="Draft" 
                      stackId="a" 
                      fill={COLORS.draft}
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Committee Distribution
                  </CardTitle>
                  <CardDescription>Organizing vs. Scientific</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center pt-6">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={committeesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {committeesData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? COLORS.organizing : COLORS.scientific} 
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingTop: 20 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Events Timeline
                  </CardTitle>
                  <CardDescription>Monthly event scheduling</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  Trending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly_events}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="events" 
                      name="Events"
                      stroke={COLORS.events} 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Manage your content efficiently</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-2">
                  <TabsTrigger value="events" className="text-sm">Events</TabsTrigger>
                  <TabsTrigger value="articles" className="text-sm">Articles</TabsTrigger>
                  <TabsTrigger value="committees" className="text-sm">Committees</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="space-y-3 mt-2">
                  <div className="flex flex-col gap-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      className="justify-between hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <a href="/events/create">
                        Create New Event
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="justify-between hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <a href="/events">
                        View All Events
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="articles" className="space-y-3 mt-2">
                  <div className="flex flex-col gap-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      className="justify-between hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <a href="/articles/create">
                        Write New Article
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="justify-between hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <a href="/articles">
                        Manage Articles
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="committees" className="space-y-3 mt-2">
                  <div className="flex flex-col gap-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      className="justify-between hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <a href="/organizing-committees/create">
                        Add Organizing Member
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="justify-between hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <a href="/scientific-committees/create">
                        Add Scientific Member
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="bg-gray-50 border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates across the system</CardDescription>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                Live Feed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {recent_activities && recent_activities.length > 0 ? (
                recent_activities.map((activity, index) => (
                  <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full" 
                      style={{ 
                        backgroundColor: activity.type === 'event' ? `${COLORS.events}15` : 
                                        activity.type === 'article' ? `${COLORS.info}15` :
                                        activity.type === 'committee' ? `${COLORS.primary}15` : `${COLORS.warning}15`
                      }}
                    >
                      {activity.type === 'event' && <Calendar className="h-5 w-5" style={{ color: COLORS.events }} />}
                      {activity.type === 'article' && <FileText className="h-5 w-5" style={{ color: COLORS.info }} />}
                      {activity.type === 'committee' && <Users className="h-5 w-5" style={{ color: COLORS.primary }} />}
                      {activity.type === 'user' && <User className="h-5 w-5" style={{ color: COLORS.warning }} />}
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-muted-foreground">No recent activities found</p>
                  <p className="text-xs text-muted-foreground">New activities will appear here as they happen</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 bg-gray-50">
            <Button variant="outline" className="w-full hover:bg-white">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}