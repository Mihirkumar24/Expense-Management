import { createBrowserRouter } from 'react-router';

import App from './App.tsx';

import Administrator from './Administrator.tsx';

import {
    AdministratorSettings,
    AdvanceSettings,
    ReportSettings
} from '@/pages/settings';

import Analytics from '@/pages/analytics-administrator';

import NewAccount from '@/pages/account-new';
import Accounts from '@/pages/accounts';

import NewBudget from '@/pages/budget-new';
import Budgets from '@/pages/budgets';

import CustomApprovalFlows from '@/pages/custom-approval-flows';
import NewCustomApprovalFLow from '@/pages/custom-approval-flow-new';

import NewDepartment from '@/pages/department-new';
import Departments from '@/pages/departments';

import NewProject from '@/pages/project-new';
import Projects from '@/pages/projects';

import NewTeam from '@/pages/team-new';
import Teams from '@/pages/teams';

import Users from '@/pages/users';
import NewUser from '@/pages/user-new';

import InvoiceRecording from '@/pages/invoice-recording';
import NewInvoiceRecordingForm from '@/pages/invoice-recording-new';

import RequestAdvance from '@/pages/advance-request';
import Advances from '@/pages/advances';
import Advance from '@/pages/advance-details';

import Approvals from '@/pages/approvals';

import Dashboard from '@/pages/dashboard';

import Expenses from '@/pages/expenses';
import NewExpense from '@/pages/expense-new';

import Reports from '@/pages/reports';
import Report from '@/pages/report-details';
import NewReport from '@/pages/report-new';

import AcceptInvitation from '@/pages/invitation-accept';
import SignIn from '@/pages/sign-in';
import SignUp from '@/pages/sign-up';

import Policies from '@/pages/policies';
import NewPolicy from '@/pages/policy-new';

export default createBrowserRouter([
    {
        path: '',
        Component: App,
        children: [
            {
                path: 'dashboard',
                Component: Dashboard
            },
            {
                path: 'administrator',
                Component: Administrator,
                children: [
                    {
                        path: 'settings',
                        children: [
                            {
                                index: true,
                                Component: AdministratorSettings
                            },
                            {
                                path: 'accounts',
                                children: [
                                    {
                                        index: true,
                                        Component: Accounts
                                    },
                                    {
                                        path: 'new',
                                        Component: NewAccount
                                    }
                                ]
                            },
                            {
                                path: 'advances',
                                children: [
                                    {
                                        index: true,
                                        Component: AdvanceSettings
                                    }
                                ]
                            },
                            {
                                path: 'analytics',
                                children: [
                                    {
                                        index: true,
                                        Component: Analytics
                                    }
                                ]
                            },
                            {
                                path: 'budgets',
                                children: [
                                    {
                                        index: true,
                                        Component: Budgets
                                    },
                                    {
                                        path: 'new',
                                        Component: NewBudget
                                    }
                                ]
                            },
                            {
                                path: 'departments',
                                children: [
                                    {
                                        index: true,
                                        Component: Departments
                                    },
                                    {
                                        path: 'new',
                                        Component: NewDepartment
                                    }
                                ]
                            },
                            {
                                path: 'policies',
                                children: [
                                    {
                                        index: true,
                                        Component: Policies
                                    },
                                    {
                                        path: 'new',
                                        Component: NewPolicy
                                    },
                                    {
                                        path: ':policyId',
                                        Component: NewPolicy
                                    }
                                ]
                            },
                            {
                                path: 'projects',
                                children: [
                                    {
                                        index: true,
                                        Component: Projects
                                    },
                                    {
                                        path: 'new',
                                        Component: NewProject
                                    }
                                ]
                            },
                            {
                                path: 'reports',
                                children: [
                                    {
                                        index: true,
                                        Component: ReportSettings
                                    }
                                ]
                            },
                            {
                                path: 'teams',
                                children: [
                                    {
                                        index: true,
                                        Component: Teams
                                    },
                                    {
                                        path: 'new',
                                        Component: NewTeam
                                    }
                                ]
                            },
                            {
                                path: 'users',
                                children: [
                                    {
                                        index: true,
                                        Component: Users
                                    },
                                    {
                                        path: 'new',
                                        Component: NewUser
                                    },
                                    {
                                        path: ':userId',
                                        Component: NewUser
                                    }
                                ]
                            },
                            {
                                path: ':module/custom-approval-flows',
                                children: [
                                    {
                                        index: true,
                                        Component: CustomApprovalFlows
                                    },
                                    {
                                        path: 'new',
                                        Component: NewCustomApprovalFLow
                                    },
                                    {
                                        path: ':customApprovalFlowId',
                                        Component: NewCustomApprovalFLow
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                path: 'invoice-recording',
                children: [
                    {
                        index: true,
                        Component: InvoiceRecording
                    },
                    {
                        path: 'new',
                        Component: NewInvoiceRecordingForm
                    },
                    // {
                    //     path: ':advanceId',
                    //     Component: Advance
                    // }
                ]
            },
            {
                path: 'advances',
                children: [
                    {
                        index: true,
                        Component: Advances
                    },
                    {
                        path: 'new',
                        Component: RequestAdvance
                    },
                    {
                        path: ':advanceId',
                        Component: Advance
                    }
                ]
            },
            {
                path: 'approvals',
                Component: Approvals
            },
            {
                path: 'expenses',
                children: [
                    {
                        index: true,
                        Component: Expenses
                    },
                    {
                        path: 'new',
                        Component: NewExpense
                    }
                ]
            },
            {
                path: 'reports',
                children: [
                    {
                        index: true,
                        Component: Reports,
                    },
                    {
                        path: 'new',
                        Component: NewReport
                    },
                    {
                        path: ':reportId',
                        Component: Report
                    },
                ]
            }
        ]
    },
    {
        path: 'invitation/:invitationToken',
        Component: AcceptInvitation
    },
    {
        path: 'sign-in',
        Component: SignIn
    },
    {
        path: 'sign-up',
        Component: SignUp
    }
]);