import { useNavigate } from 'react-router';

// shadcn/ui

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table';

import Loader from '@/widgets/loader';

export default function PoliciesTable({
    getAllPoliciesIsFetching,
    policies
}) {
    const navigate = useNavigate();

    if (!policies || getAllPoliciesIsFetching) {
        return (
            <Loader />
        );
    }

    if (!policies.length) {
        return (
            <div
                className='text-center text-muted-foreground'
            >
                You have no policies.
            </div>
        );
    }

    return (
        <div
            className='border rounded-xs'
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Name
                        </TableHead>

                        <TableHead>
                            Description
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {policies.map((policy) => (
                        <TableRow
                            key={policy._id}
                            onClick={() => navigate(`${policy._id}`)}
                        >
                            <TableCell
                                className='text-primary'
                            >
                                {policy.name}
                            </TableCell>

                            <TableCell>
                                {policy.description}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}