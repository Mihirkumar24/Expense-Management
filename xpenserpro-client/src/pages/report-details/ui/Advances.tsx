import { AdvancesTable } from '@/pages/advances';

export default function Advances({
    advances
}) {
    console.log(advances);

    return (
        <AdvancesTable
            advances={advances}
            getAllAdvancesIsFetching={false}
        />
    );
}