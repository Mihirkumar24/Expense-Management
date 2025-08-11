import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/shared/ui/card';

import { MoveRight } from 'lucide-react';
import { Link } from 'react-router';

type Item = {
    label: string,
    url: string
}

type SettingsProps = {
    items: Item[]
}

export default function Settings({
    items
}: SettingsProps) {
    return (
        <div
            className='gap-6 grid grid-cols-4 p-6'
        >
            {items.map((item, index) => (
                <Link
                    className='group duration-300 transition-scale hover:scale-[1.1]'
                    to={item.url}
                    key={index}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {item.label}
                            </CardTitle>
                        </CardHeader>

                        <CardFooter>
                            <MoveRight
                                className='duration-300 ml-auto opacity-0 text-primary transition-translate -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0'
                            />
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    );
}