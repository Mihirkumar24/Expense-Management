import { zodResolver } from '@hookform/resolvers/zod';
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';

import { format } from 'date-fns';
import _ from 'lodash';
import {
    Calendar as CalendarIcon,
    Funnel,
    Plus
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    useEffect,
    useState
} from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

// shadcn/ui
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Checkbox } from '@/shared/ui/checkbox';
import {
    DialogContent,
    DialogTitle,
    DialogTrigger,
    Dialog,
    DialogHeader
} from '@/shared/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';

import {
    clearExpenses,
    useLazyGetAllExpensesQuery
} from '@/entities/expense';
import ExpenseCategories from '@/entities/expense-categories';
import { useLazyGetAllReportsQuery } from '@/entities/report';

import ExpensesList from '@/features/expenses-list';
import ReportsList from '@/features/reports-list';
import Sort from '@/features/sort';

import { reportsTableColumns } from '@/pages/reports';

import Loader from '@/widgets/loader';
import EnhancedPagination from '@/widgets/pagination';

import expensesTableColumns from '../model/expensesTableColumns';
import expensesFilterFormSchema from '../model/expensesFilterFormSchema';

function Toolbar({
    getAllExpenses,
    expensesTable
}) {
    const form = useForm<z.infer<typeof expensesFilterFormSchema>>({
        defaultValues: {
            category: '',
            date: {
                from: undefined,
                to: undefined
            },
            merchant: '',
            status: ['unreported']
        },
        resolver: zodResolver(expensesFilterFormSchema)
    });

    const dispatch = useDispatch();

    const { expenseIds } = useSelector((state) => state.expenses);

    const [
        getAllReports,
        {
            data: allReportsData
        }
    ] = useLazyGetAllReportsQuery();
    const reports = allReportsData?.reports;

    const reportsTable = useReactTable({
        columns: reportsTableColumns,
        data: reports,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnVisibility: {
                _id: false
            }
        }
    });

    const navigate = useNavigate();

    function handleApplyFilters(data: z.infer<typeof expensesFilterFormSchema>) {
        const body = data;

        getAllExpenses(body);
    }

    return (
        <div>
            {expenseIds.length ? (
                <div
                    className='bg-accent flex justify-between p-6'
                >
                    <p>
                        {expenseIds.length} selected
                    </p>

                    <Dialog
                        onOpenChange={(open) => {
                            if (open) {
                                getAllReports(
                                    {
                                        role: 'submitter',
                                        status: 'draft'
                                    },
                                    true
                                );
                            } else {
                                dispatch(clearExpenses());
                            }
                        }}
                    >
                        <DialogTrigger
                            asChild
                        >
                            <Button>
                                <Plus />

                                Add to Report
                            </Button>

                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Add to Report
                                </DialogTitle>
                            </DialogHeader>

                            <ReportsList
                                disableAddToReport={false}
                                reports={reports}
                                reportsTable={reportsTable}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            ) : (
                <div
                    className='flex flex-row-reverse gap-3'
                >
                    <Button
                        onClick={() => navigate('new')}
                    >
                        <Plus />

                        New Expense
                    </Button>

                    <Sort
                        table={expensesTable}
                    />

                    <Popover
                        onOpenChange={(open) => {
                            if (!open) {
                                form.reset();
                            }
                        }}
                    >
                        <PopoverTrigger
                            asChild
                        >
                            <Button
                                size='icon'
                                variant='outline'
                            >
                                <Funnel />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                            <div
                                className='space-y-6'
                            >
                                <p
                                    className='font-semibold'
                                >
                                    Filter
                                </p>

                                <Separator />

                                <Form
                                    {...form}
                                >
                                    <form
                                        className='space-y-6'
                                        onSubmit={form.handleSubmit(handleApplyFilters)}
                                    >
                                        <FormField
                                            control={form.control}
                                            name='date'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Date
                                                    </FormLabel>

                                                    <Popover>
                                                        <PopoverTrigger
                                                            asChild
                                                        >
                                                            <FormControl>
                                                                <Button
                                                                    type='button'
                                                                    variant='outline'
                                                                >
                                                                    {field.value?.from ? (
                                                                        field.value.to ? (
                                                                            `${format(field.value.from, 'MMMM d, y')} - ${format(field.value.to, 'MMMM d, y')}`
                                                                        ) : (
                                                                            format(field.value.from, 'MMMM d, y')
                                                                        )
                                                                    ) : (
                                                                        'Select a date range.'
                                                                    )}

                                                                    <CalendarIcon
                                                                        className='ml-auto'
                                                                    />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>

                                                        <PopoverContent
                                                            align='start'
                                                            className='p-0 w-auto'
                                                        >
                                                            <Calendar
                                                                mode='range'
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='category'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Expense Category
                                                    </FormLabel>

                                                    <Select
                                                        defaultValue={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger
                                                                className='w-full'
                                                            >
                                                                <SelectValue
                                                                    placeholder='Select a category'
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>

                                                        <SelectContent>
                                                            {Object.keys(ExpenseCategories).map((expenseCategory, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={expenseCategory}
                                                                >
                                                                    {expenseCategory}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='status'
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Status
                                                    </FormLabel>

                                                    {['unreported', 'reported', 'submitted', 'approved', 'rejected'].map((status, index) => (
                                                        <FormField
                                                            key={index}
                                                            control={form.control}
                                                            name='status'
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        className='flex gap-3'
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(status)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...field.value, status])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value) => value !== status
                                                                                            )
                                                                                        )
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel
                                                                            className='font-normal'
                                                                        >
                                                                            {_.capitalize(status)}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='merchant'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Merchant
                                                    </FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <Button>
                                            Apply
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div >

            )}
        </div >
    );
}

export default function Expenses() {
    const [page, setPage] = useState(1);

    const [
        getAllExpenses,
        {
            data: allExpensesData,
            isFetching: getAllExpensesIsFetching
        }
    ] = useLazyGetAllExpensesQuery();
    const count = allExpensesData?.count;
    const expenses = allExpensesData?.expenses;

    const expensesTable = useReactTable({
        columns: expensesTableColumns,
        data: expenses,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnVisibility: {
                _id: false,
                amount: false,
                currency: false,
                currencyExchangeRate: false,
                receipt: false
            }
        }
    });

    useEffect(() => {
        getAllExpenses({
            page
        });
    }, [page]);

    if (getAllExpensesIsFetching) {
        return (
            <Loader />
        );
    }

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                Expenses
            </h1>

            <Separator />

            <Toolbar
                expensesTable={expensesTable}
                getAllExpenses={getAllExpenses}
            />

            <ExpensesList
                displayCheckbox={true}
                displayDelete={true}
                displayDropdownMenu={true}
                displayRemove={false}
                displayStatus={true}
                expenses={expenses}
                expensesTable={expensesTable}
                reportId=''
            />

            {count > 0 && (
                <EnhancedPagination
                    count={Math.ceil(count / 10)}
                    onChange={setPage}
                    page={page}
                />
            )}
        </div>
    );
}