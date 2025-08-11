import {
    Blocks,
    BookOpenText,
    ChartColumn,
    Check,
    ChevronDown,
    ChevronRight,
    House,
    NotebookPen,
    Settings,
    UserCog,
    Wallet,
    WalletMinimal
} from 'lucide-react';
import { useSelector } from 'react-redux';
import {
    Link,
    useLocation
} from 'react-router';

// shadcn/ui

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from '@/shared/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/shared/ui/collapsible';
import { Separator } from '@/shared/ui/separator';
import { useState } from 'react';

const administratorNavigationItems = [
    {
        icon: <ChartColumn />,
        label: 'Analytics',
        url: ''
    },
    {
        icon: <BookOpenText />,
        label: 'Budget',
        url: '/administrator/settings/budgets'
    },
    {
        icon: <Settings />,
        label: 'Settings',
        url: '/administrator/settings'
    },
    {
        icon: <UserCog />,
        label: 'Users',
        url: '/administrator/settings/users'
    },
    {
        icon: <Blocks />,
        label: 'Integrations',
        url: ''
    }
];

const userNavigationItems = [
    {
        icon: <House />,
        label: 'Home',
        url: '/dashboard'
    },
    {
        icon: <WalletMinimal />,
        label: 'Advances',
        url: '/advances'
    },
    {
        icon: <Check />,
        label: 'Approvals',
        url: '/approvals'
    },
    {
        icon: <Wallet />,
        label: 'Expenses',
        url: '/expenses'
    },
    {
        icon: <NotebookPen />,
        label: 'Reports',
        url: '/reports'
    },
    {
        icon: <WalletMinimal />,
        label: 'Accounts Payable',
        url: '/invoice-recording'
    }
];

export default function AppSidebar() {
    const [view, setView] = useState('user');

    const {
        user: {
            role
        }
    } = useSelector((state) => state.authentication);

    const location = useLocation();

    return (
        <Sidebar
            collapsible='icon'
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size='lg'
                        >
                            <Link
                                className='justify-center'
                                to='/'
                            >
                                <p
                                    className='font-bold text-3xl'
                                >
                                    <span
                                        className='text-blue-700'
                                    >
                                        XPENSER
                                    </span>

                                    <span
                                        className='ml-0.5'
                                    >
                                        PRO
                                    </span>
                                </p>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <Collapsible
                    className='group/collapsible'
                    onOpenChange={(open) => {
                        if (open) {
                            setView('user');
                        } else {
                            setView('administrator');
                        }
                    }}
                    open={view === 'user'}
                >
                    <SidebarGroup>
                        <SidebarGroupLabel
                            asChild
                            className='font-bold text-base group-data-[state=open]/collapsible:text-primary'
                        >
                            <CollapsibleTrigger>
                                User

                                <ChevronRight
                                    className='font-bold ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90'
                                />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>

                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {userNavigationItems.map((item, index) => (
                                        <SidebarMenuItem
                                            key={index}
                                        >
                                            <SidebarMenuButton
                                                asChild
                                                isActive={item.url === location.pathname}
                                                className='data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:font-semibold hover:text-primary'
                                            >
                                                <Link
                                                    to={item.url}
                                                >
                                                    {item.icon}

                                                    <span>
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>

                    <Separator />
                </Collapsible>

                {role === 'administrator' && (
                    <Collapsible
                        className='group/collapsible'
                        onOpenChange={(open) => {
                            if (open) {
                                setView('administrator');
                            } else {
                                setView('user');
                            }
                        }}
                        open={view === 'administrator'}
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel
                                asChild
                                className='font-bold text-base group-data-[state=open]/collapsible:text-primary'
                            >
                                <CollapsibleTrigger>
                                    Administrator

                                    <ChevronRight
                                        className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90'
                                    />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>

                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {administratorNavigationItems.map((item, index) => (
                                            <SidebarMenuItem
                                                key={index}
                                            >
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={item.url === location.pathname}
                                                    className='data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:font-semibold hover:text-primary'
                                                >
                                                    <Link
                                                        to={item.url}
                                                    >
                                                        {item.icon}

                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>

                        <Separator />
                    </Collapsible>
                )}
            </SidebarContent>

            <SidebarFooter>

            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}