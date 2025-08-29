// AppSidebar.tsx
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, GraduationCap, FileText, Calendar, UserCog, Globe, UserCheck, ScrollText, CreditCard } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Organizing Committee',
        href: '/admin/organizing-committees',
        icon: Users,
    },
    {
        title: 'Scientific Committee',
        href: '/admin/scientific-committees',
        icon: GraduationCap,
    },
    {
        title: 'Articles',
        href: '/admin/articles',
        icon: FileText,
    },
    {
        title: 'Events',
        href: '/admin/events',
        icon: Calendar,
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: UserCog,
    },
    {
        title: 'Countries',
        href: '/admin/countries',
        icon: Globe,
    },
    {
        title: 'User Profiles',
        href: '/admin/user-profiles',
        icon: UserCheck,
    },
    {
        title: 'Abstract Submissions',
        href: '/admin/abstract-submissions',
        icon: ScrollText,
    },
    
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

