import Settings from './Settings';

const items = [
    {
        label: 'Accounts',
        url: 'accounts'
    },
    {
        label: 'Advances',
        url: 'advances'
    },
    {
        label: 'Analytics',
        url: 'analytics'
    },
    {
        label: 'Budgets',
        url: 'budgets'
    },
    {
        label: 'Departments',
        url: 'departments'
    },
    {
        label: 'Policies',
        url: 'policies'
    },
    {
        label: 'Projects',
        url: 'projects'
    },
    {
        label: 'Reports',
        url: 'reports'
    },
    {
        label: 'Teams',
        url: 'teams'
    }
];

export default function AdministratorSettings() {
    return (
        <Settings
            items={items}
        />
    );
}