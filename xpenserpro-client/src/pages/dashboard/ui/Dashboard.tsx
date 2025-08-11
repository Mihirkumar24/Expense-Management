import { format } from 'date-fns';
import {
    Building,
    Check,
    NotebookPen,
    ReceiptText
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis
} from 'recharts';

// shadcn/ui

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/shared/ui/chart';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/shared/ui/tabs';

import { useGetDashboardQuery } from '@/features/dashboard';

import { ReportsTable } from '@/pages/reports';

import Loader from '@/widgets/loader';

const chartConfig = {
    expense: {
        label: 'Expense'
    } as ChartConfig
}

export default function Dashboard() {
    const {
        user
    } = useSelector((state) => state.authentication);

    const { data: dashboardData } = useGetDashboardQuery();

    // return dashboardData ? (
    //     <div
    //         className='p-6 space-y-6'
    //     >
    //         <div
    //             className='gap-3 grid grid-cols-4'
    //         >
    //             <Card
    //                 className='bg-red-300'
    //             >
    //                 <CardHeader>
    //                     <CardDescription>
    //                         Unreported Expenses
    //                     </CardDescription>

    //                     <CardTitle
    //                         className='font-semibold text-2xl'
    //                     >
    //                         {dashboardData.unreportedExpensesCount}
    //                     </CardTitle>
    //                 </CardHeader>
    //             </Card>

    //             <Card
    //                 className='bg-gray-300'
    //             >
    //                 <CardHeader>
    //                     <CardDescription>
    //                         Draft Reports
    //                     </CardDescription>

    //                     <CardTitle
    //                         className='font-semibold text-2xl'
    //                     >
    //                         {dashboardData.draftReportsCount}
    //                     </CardTitle>
    //                 </CardHeader>
    //             </Card>

    //             <Card
    //                 className='bg-amber-300'
    //             >
    //                 <CardHeader>
    //                     <CardDescription>
    //                         Reports Awaiting Approval
    //                     </CardDescription>

    //                     <CardTitle
    //                         className='font-semibold text-2xl'
    //                     >
    //                         {dashboardData.submittedReportsCount}
    //                     </CardTitle>
    //                 </CardHeader>
    //             </Card>

    //             <Card
    //                 className='bg-violet-300'
    //             >
    //                 <CardHeader>
    //                     <CardDescription>
    //                         Pending Approvals
    //                     </CardDescription>

    //                     <CardTitle
    //                         className='font-semibold text-2xl'
    //                     >
    //                         {dashboardData.pendingApprovalsCount}
    //                     </CardTitle>
    //                 </CardHeader>
    //             </Card>
    //         </div>

    //         <div
    //             className='gap-3 grid grid-cols-[3fr_1fr]'
    //         >
    //             <Card>
    //                 <CardHeader>
    //                     <CardTitle>
    //                         Expenses
    //                     </CardTitle>

    //                     <CardDescription>
    //                         Showing expenses for the last year.
    //                     </CardDescription>
    //                 </CardHeader>

    //                 <CardContent>
    //                     <ChartContainer
    //                         config={chartConfig}
    //                     >
    //                         <AreaChart
    //                             data={dashboardData.monthlyExpenses}
    //                         >
    //                             <CartesianGrid
    //                                 vertical={false}
    //                             />

    //                             <ChartTooltip
    //                                 cursor={false}
    //                                 content={
    //                                     <ChartTooltipContent
    //                                         indicator='line'
    //                                     />
    //                                 }
    //                             />

    //                             <XAxis
    //                                 dataKey='month'
    //                                 tickLine={false}
    //                                 axisLine={false}
    //                                 tickFormatter={(value) => value.slice(0, 3)}
    //                             />

    //                             <Area
    //                                 dataKey='expense'
    //                             />
    //                         </AreaChart>
    //                     </ChartContainer>
    //                 </CardContent>
    //             </Card>

    //             <Card>
    //                 <CardHeader>
    //                     <CardTitle>
    //                         Summary
    //                     </CardTitle>
    //                 </CardHeader>

    //                 <CardContent>
    //                     <div>
    //                         <p
    //                             className='text-muted-foreground'
    //                         >
    //                             Total Expenses
    //                         </p>

    //                         <p
    //                             className='font-semibold'
    //                         >
    //                             {dashboardData.totalExpense} USD
    //                         </p>
    //                     </div>
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     </div>
    // ) : (
    //     <Loader />
    // )

    console.log(dashboardData);

    if (!dashboardData) {
        return (
            <Loader
                className='h-full'
            />
        );
    }

    return (
        <div
            className='p-6 space-y-6'
        >
            <div
                className='flex gap-3'
            >
                <div
                    className='border p-3 rounded-sm'
                >
                    <Building />
                </div>

                <div>
                    <div
                        className='font-medium text-xl'
                    >
                        Hello, {user.firstName} {user.lastName}
                    </div>

                    <div
                        className='text-muted-foreground'
                    >
                        {user.organization.name}
                    </div>
                </div>

                <div
                    className='font-medium text-xl ml-auto'
                >
                    {format(new Date(), 'PPPP')}
                </div>
            </div>

            <div
                className='gap-3 grid grid-cols-[1fr_2fr]'
            >
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Pending Tasks
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div
                            className='flex flex-col gap-3'
                        >
                            <Link
                                className='flex text-muted-foreground justify-between'
                                to='/approvals'
                            >
                                <div
                                    className='flex gap-1.5 text-sm hover:cursor-pointer'
                                >
                                    <Check size={18} color='orange' />

                                    Pending Approval
                                </div>

                                {dashboardData.pendingApprovalsCount}
                            </Link>

                            <Link
                                className='flex text-muted-foreground justify-between'
                                to='/expenses'
                            >
                                <div
                                    className='text-sm hover:cursor-pointer'
                                >
                                    Unreported Expenses
                                </div>

                                {dashboardData.unreportedExpensesCount}
                            </Link>

                            <Link
                                className='flex text-muted-foreground justify-between'
                                to='/advances'
                            >
                                <div
                                    className='text-sm hover:cursor-pointer'
                                >
                                    Unreported Advances
                                </div>

                                USD {dashboardData.unreportedAdvances}
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Quick Add
                        </CardTitle>
                    </CardHeader>

                    <CardContent
                        className='h-full'
                    >
                        <div
                            className='grid grid-cols-2 h-full'
                        >
                            <Link
                                className='flex flex-col gap-3 group items-center justify-center'
                                to='/expenses/new'
                            >
                                <div
                                    className='border rounded-full p-3 group-hover:border-0 group-hover:bg-primary'
                                >
                                    <ReceiptText
                                        className='text-primary group-hover:text-white'
                                    />
                                </div>

                                <div>
                                    Create Expense
                                </div>
                            </Link>

                            <Link
                                className='flex flex-col gap-3 group items-center justify-center'
                                to='/reports/new'
                            >
                                <div
                                    className='border rounded-full p-3 group-hover:border-0 group-hover:bg-amber-500'
                                >
                                    <NotebookPen className='text-amber-500 group-hover:text-white' />
                                </div>

                                <div>
                                    Create Report
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Reports Summary
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <Tabs
                        defaultValue='unsubmittedReports'
                    >
                        <TabsList>
                            <TabsTrigger
                                value='unsubmittedReports'
                            >
                                Unsubmitted Reports
                            </TabsTrigger>

                            <TabsTrigger
                                value='reportsAwaitingApproval'
                            >
                                Reports Awaiting Approval
                            </TabsTrigger>

                            <TabsTrigger
                                value='reportsAwaitingReimbursement'
                            >
                                Reports Awaiting Reimbursement
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value='unsubmittedReports'
                        >
                            <ReportsTable
                                reports={dashboardData.unsubmittedReports}
                            />
                        </TabsContent>

                        <TabsContent
                            value='reportsAwaitingApproval'
                        >
                            <ReportsTable
                                reports={dashboardData.reportsAwaitingApproval}
                            />
                        </TabsContent>

                        <TabsContent
                            value='reportsAwaitingReimbursement'
                        >
                            <ReportsTable
                                reports={dashboardData.reportsAwaitingReimbursement}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}