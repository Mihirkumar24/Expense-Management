import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/shared/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
    SidebarTrigger
} from '@/shared/ui/sidebar';

import { LogOut, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { useSignOutMutation } from '../../../features/authentication/api/authenticationApi';

export default function Header() {
    const {
        isAuthenticated,
        user
    } = useSelector((state) => state.authentication);

    const [signOut] = useSignOutMutation();

    const navigate = useNavigate();

    function handleSignOut() {
        signOut();

        navigate(0);
    }

    return (
        <header
            className='bg-blue-950 shadow-xs px-4'
        >
            <div
                className='flex h-16 items-center justify-between'
            >
                <SidebarTrigger />

                {isAuthenticated && (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                        >
                            <Avatar>
                                <AvatarImage src='' alt='' />
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                <div
                                    className='text-left'
                                >
                                    <p
                                        className='font-semibold'
                                    >
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p
                                        className='text-xs'
                                    >
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    className='text-destructive focus:text-destructive'
                                    onClick={handleSignOut}
                                >
                                    Sign out

                                    <DropdownMenuShortcut>
                                        <LogOut
                                            className='text-destructive'
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}