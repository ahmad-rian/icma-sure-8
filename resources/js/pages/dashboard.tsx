import React from "react"
import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  TrendingUp,
  User,
  Users,
  Calendar,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Legend,
} from "recharts"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
]

interface DashboardProps {
  stats?: {
    organizing_committees: number
    scientific_committees: number
    total_articles: number
    published_articles: number
    draft_articles: number
    total_events: number
    active_events: number
    users: number
  }
  monthly_articles?: {
    month: string
    published: number
    draft: number
  }[]
  monthly_events?: {
    month: string
    events: number
  }[]
  recent_activities?: {
    type: "event" | "article" | "committee" | "user"
    title: string
    time: string
  }[]
  trends?: {
    committees: {
      value: number
      isPositive: boolean
    }
    articles: {
      value: number
      isPositive: boolean
    }
    events: {
      value: number
      isPositive: boolean
    }
    users: {
      value: number
      isPositive: boolean
    }
  }
}

// Chart colors - consistent palette for better visual design
// const COLORS = {
//   primary: 'hsl(var(--primary))',
//   secondary: 'hsl(var(--secondary))',
//   success: 'hsl(var(--success))',
//   warning: 'hsl(var(--warning))',
//   info: 'hsl(var(--info))',
//   danger: 'hsl(var(--danger))',
//   published: 'hsl(var(--info))',
//   draft: 'hsl(var(--warning))',
//   organizing: 'hsl(var(--primary))',
//   scientific: 'hsl(var(--success))',
//   events: 'hsl(var(--info))',
//   positive: 'hsl(var(--success))',
//   negative: 'hsl(var(--danger))'
// };

// Replace with explicit colors that work in both light and dark modes
const COLORS = {
  primary: "#3b82f6",
  secondary: "#6b7280",
  success: "#10b981",
  warning: "#f59e0b",
  info: "#3b82f6",
  danger: "#ef4444",
  published: "#3b82f6",
  draft: "#f59e0b",
  organizing: "#8b5cf6",
  scientific: "#10b981",
  events: "#3b82f6",
  positive: "#10b981",
  negative: "#ef4444",
}

interface StatsCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
}

const StatsCard = ({ title, value, description, icon, trend, color = COLORS.primary }: StatsCardProps) => (
  <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 dark:bg-primary/20">
        {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-primary" })}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">{value.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
    </CardContent>
    {trend && (
      <CardFooter className="p-2 pt-0">
        <div className="flex items-center">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend.isPositive
                ? "bg-success/10 text-success dark:bg-success/20"
                : "bg-danger/10 text-danger dark:bg-danger/20"
            }`}
          >
            {trend.isPositive ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {trend.value}%
          </div>
          <span className="text-xs text-muted-foreground ml-2">from last month</span>
        </div>
      </CardFooter>
    )}
  </Card>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border shadow-lg rounded-md p-3">
        <p className="font-semibold text-sm">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm flex items-center gap-2 mt-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span>{`${entry.name}: ${entry.value}`}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

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
    users: 2,
  }

  const monthly_articles = props.monthly_articles || []
  const monthly_events = props.monthly_events || []
  const recent_activities = props.recent_activities || []
  const trends = props.trends || {
    committees: { value: 100, isPositive: true },
    articles: { value: 0, isPositive: true },
    events: { value: 100, isPositive: true },
    users: { value: 100, isPositive: true },
  }

  // Prepare committee data for pie chart
  const committeesData = [
    { name: "Organizing", count: stats.organizing_committees, color: COLORS.organizing },
    { name: "Scientific", count: stats.scientific_committees, color: COLORS.scientific },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-6 p-4 md:p-6 bg-background min-h-screen">
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
          />

          <StatsCard
            title="Articles"
            value={stats.total_articles}
            description={`${stats.published_articles} published, ${stats.draft_articles} draft`}
            icon={<FileText />}
            trend={trends.articles}
          />

          <StatsCard
            title="Active Events"
            value={stats.active_events}
            description={`Out of ${stats.total_events} total events`}
            icon={<Calendar />}
            trend={trends.events}
          />

          <StatsCard
            title="Users"
            value={stats.users}
            description="Registered system users"
            icon={<User />}
            trend={trends.users}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2 shadow-sm overflow-hidden">
            <CardHeader className="border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Articles Overview
                  </CardTitle>
                  <CardDescription>Publishing activity over the last 6 months</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  Monthly
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 bg-card">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly_articles} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} iconType="circle" iconSize={8} />
                    <Bar
                      dataKey="published"
                      name="Published"
                      stackId="a"
                      fill={COLORS.published}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar dataKey="draft" name="Draft" stackId="a" fill={COLORS.draft} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 shadow-sm overflow-hidden">
            <CardHeader className="border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                    Committee Distribution
                  </CardTitle>
                  <CardDescription>Organizing vs. Scientific</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center pt-6 bg-card">
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
                      label={({ name, percent }) => (
                        <text x={0} y={0} textAnchor="middle" fill="#fff" fontWeight="bold" fontSize={12}>
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      )}
                    >
                      {committeesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? COLORS.organizing : COLORS.scientific}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 20 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2 text-primary" />
                    Events Timeline
                  </CardTitle>
                  <CardDescription>Monthly event scheduling</CardDescription>
                </div>
                <Badge variant="outline" className="bg-success/5 text-success border-success/20">
                  Trending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 bg-card">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly_events}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
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

          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Manage your content efficiently</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 bg-card">
              <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-2">
                  <TabsTrigger value="events" className="text-sm">
                    Events
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="text-sm">
                    Articles
                  </TabsTrigger>
                  <TabsTrigger value="committees" className="text-sm">
                    Committees
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="space-y-3 mt-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="justify-between hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
                    >
                      <a href="/events/create">
                        Create New Event
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="justify-between hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
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
                      className="justify-between hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
                    >
                      <a href="/articles/create">
                        Write New Article
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="justify-between hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
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
                      className="justify-between hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
                    >
                      <a href="/organizing-committees/create">
                        Add Organizing Member
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="justify-between hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
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

        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates across the system</CardDescription>
              </div>
              <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
                Live Feed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 bg-card">
            <div className="space-y-4">
              {recent_activities && recent_activities.length > 0 ? (
                recent_activities.map((activity, index) => (
                  <div key={index} className="flex items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                      {activity.type === "event" && <Calendar className="h-5 w-5 text-primary" />}
                      {activity.type === "article" && <FileText className="h-5 w-5 text-primary" />}
                      {activity.type === "committee" && <Users className="h-5 w-5 text-primary" />}
                      {activity.type === "user" && <User className="h-5 w-5 text-primary" />}
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
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No recent activities found</p>
                  <p className="text-xs text-muted-foreground">New activities will appear here as they happen</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button variant="outline" className="w-full hover:bg-primary/5">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  )
}
