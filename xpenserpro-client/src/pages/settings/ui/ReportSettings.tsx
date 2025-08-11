import Settings from './Settings';

const items = [
    {
        label: 'Custom Approval Flows',
        url: 'custom-approval-flows'
    }
];

export default function AdvanceSettings() {
    return (
        <Settings
            items={items}
        />
    )
}