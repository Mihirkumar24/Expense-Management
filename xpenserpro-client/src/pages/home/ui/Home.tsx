import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

// shadcn/ui
import {
    SidebarInset,
    SidebarProvider
} from '@/shared/ui/sidebar';

import AppSidebar from '@/widgets/sidebar/ui/Sidebar';
import Header from '@/widgets/header';

export default function Home() {
    return (
        <SidebarProvider>
            < AppSidebar />

            <SidebarInset>
                <Header />

                <Outlet />

                <Toaster
                    position='top-center'
                    richColors
                />
            </SidebarInset>
        </SidebarProvider >
    );
}