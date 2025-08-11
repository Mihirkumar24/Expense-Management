import { User } from 'lucide-react';

// shadcn/ui

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/shared/ui/avatar';

export default function UserAvatar({
    firstName,
    lastName
}) {
    return (
        <div
            className='border inline-flex gap-3 items-center pr-1.5 rounded-full'
        >
            <Avatar>
                <AvatarImage />

                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>

            <div
                className='text-sm'
            >
                {firstName} {lastName}
            </div>
        </div>
    );
}