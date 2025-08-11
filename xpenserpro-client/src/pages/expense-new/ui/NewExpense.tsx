import { zodResolver } from '@hookform/resolvers/zod';
import {
    Worker,
    Viewer
} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

import { format } from 'date-fns';
import _ from 'lodash';
import {
    Calendar as CalendarIcon,
    FileUp,
    LoaderCircle,
    Pencil
} from 'lucide-react';
import {
    useEffect,
    useState
} from 'react';
import {
    useForm,
    useWatch
} from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
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
import { Skeleton } from '@/shared/ui/skeleton';

import { useCreateExpenseMutation } from '@/entities/expense';
import ExpenseCategories from '@/entities/expense-categories';
import PaymentMethods from '@/entities/payment-methods';

import { useAnalyzeMutation } from '@/features/azure-document-intelligence';
import {
    useGetAllCurrencyQuery,
    useLazyGetCurrencyExchangeRateQuery
} from '@/features/currency-exchange-rate';

import { cn } from '@/shared/lib/utils';

import Loader from '@/widgets/loader';

import newExpenseFormSchema from '../model/newExpenseFormSchema';

import './NewExpense.css';
import { SelectFormField } from '@/features/form-field';

export default function NewExpense() {
    const [receipt, setReceipt] = useState({
        base64String: '',
        type: ''
    });

    const form = useForm<z.infer<typeof newExpenseFormSchema>>({
        defaultValues: {
            amount: 0,
            businessPurpose: '',
            category: '',
            currency: 'usd',
            currencyExchangeRate: 1,
            date: new Date(),
            description: '',
            merchant: '',
            paymentMethod: ''
        },
        resolver: zodResolver(newExpenseFormSchema)
    });

    const currency = useWatch({
        control: form.control,
        name: 'currency'
    });

    const currencyExchangeRate = useWatch({
        control: form.control,
        name: 'currencyExchangeRate'
    });

    const {
        data: allCurrencyData
    } = useGetAllCurrencyQuery();
    const currencies = allCurrencyData;

    const [
        getCurrencyExchangeRate,
        {
            data: currencyExchangeRateData
        }
    ] = useLazyGetCurrencyExchangeRateQuery();

    const [
        analyze,
        {
            data: analyzeData,
            isLoading: analyzeIsLoading
        }
    ] = useAnalyzeMutation();
    const fields = analyzeData?.fields;

    const [
        createExpense,
        {
            isLoading: createExpenseIsLoading,
            isSuccess: createExpenseIsSuccess
        }
    ] = useCreateExpenseMutation();

    const navigate = useNavigate();

    const zoomPluginInstance = zoomPlugin();
    const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

    function handleCreateExpense(data: z.infer<typeof newExpenseFormSchema>) {
        const body = {
            ...data,
            receiptBase64String: receipt.base64String
        };

        createExpense(body);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    async function handleDrop(event) {
        event.preventDefault();

        const { files } = event.dataTransfer;

        if (files.length === 0) {
            return;
        }

        const file = files[0];

        const reader = new FileReader();

        reader.onload = () => {
            const base64String = reader.result;

            setReceipt({
                base64String,
                type: file.type,
            });

            const body = {
                base64Source: base64String.split(',')[1]
            }

            analyze(body);
        };

        reader.readAsDataURL(file);
    }

    function handleMouseMove(event) {
        const imageZoom = event.currentTarget;

        imageZoom.style.setProperty('--display', 'block');

        const x = (event.nativeEvent.offsetX / imageZoom.offsetWidth) * 100;
        const y = (event.nativeEvent.offsetY / imageZoom.offsetHeight) * 100;

        imageZoom.style.setProperty('--x', `${x}%`);
        imageZoom.style.setProperty('--y', `${y}%`);
    }

    function handleReceiptInput(event) {
        const { files } = event.target;

        if (files.length === 0) {
            return;
        }

        const file = files[0];

        const reader = new FileReader();

        reader.onload = () => {
            const base64String = reader.result;

            setReceipt({
                base64String,
                type: file.type,
            });

            const body = {
                base64Source: base64String.split(',')[1]
            }

            analyze(body);
        }

        reader.readAsDataURL(file);
    }

    useEffect(() => {
        getCurrencyExchangeRate(currency);
    }, [currency]);

    useEffect(() => {
        if (fields) {
            const {
                amount,
                currency,
                date,
                merchant
            } = fields;

            form.reset({
                amount: amount ?? form.getValues('amount'),
                currency: currency ? currency.toLowerCase() : form.getValues('currency'),
                date: date ? new Date(date) : form.getValues('date'),
                merchant: merchant ?? form.getValues('merchant')
            });
        }
    }, [fields]);

    useEffect(() => {
        if (createExpenseIsSuccess) {
            toast.success('Expense is created.');

            navigate('/expenses');
        }

        if (currencyExchangeRateData) {
            form.setValue('currencyExchangeRate', currencyExchangeRateData);
        }
    }, [
        createExpenseIsSuccess,
        currencyExchangeRateData
    ]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Expense
            </h1>

            <Separator />

            <div
                className='grid grid-cols-2 gap-6'
            >
                {analyzeIsLoading ? (
                    <Skeleton />
                ) : (
                    <Form
                        {...form}
                    >
                        <form
                            className='space-y-6'
                            onSubmit={form.handleSubmit(handleCreateExpense)}
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
                                                        variant='outline'
                                                        className={`${!field.value && 'text-muted-foreground'}`}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, 'PPP')
                                                        ) : (
                                                            'Pick a date.'
                                                        )}
                                                        <CalendarIcon
                                                            className='ml-auto text-muted-foreground'
                                                        />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                align='start'
                                                className='p-0 w-auto'
                                            >
                                                <Calendar
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date('2000-01-01')
                                                    }
                                                    initialFocus
                                                    mode='single'
                                                    onSelect={field.onChange}
                                                    selected={field.value}
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='businessPurpose'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Business Purpose
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SelectFormField
                                label='Category'
                                name='category'
                                items={ExpenseCategories}
                            />

                            <SelectFormField
                                label='Payment Method'
                                name='paymentMethod'
                                items={PaymentMethods}
                            />

                            <div
                                className='space-y-3'
                            >
                                <div
                                    className='flex gap-3'
                                >
                                    <FormField
                                        control={form.control}
                                        name='currency'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Currency
                                                </FormLabel>

                                                <Select
                                                    defaultValue={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>

                                                    <SelectContent>
                                                        {currencies ? (
                                                            Object.entries(currencies).map((currency, index) => (
                                                                <SelectItem
                                                                    key={index}
                                                                    value={currency[0]}
                                                                >
                                                                    {currency[1]}
                                                                </SelectItem>

                                                            ))
                                                        ) : (
                                                            <Loader />
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='amount'
                                        render={({ field }) => (
                                            <FormItem
                                                className='w-full'
                                            >
                                                <FormLabel>
                                                    Amount
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        onChange={(value) => field.onChange(value.target.valueAsNumber)}
                                                        type='number'
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {currency !== 'usd' && (
                                    <div
                                        className='flex gap-3 items-center'
                                    >
                                        <p
                                            className={cn(
                                                'text-sm',
                                                form.formState.errors.currencyExchangeRate && 'text-destructive'
                                            )}
                                        >
                                            {`1 ${form.getValues('currency').toUpperCase()} = ${currencyExchangeRate} USD`}

                                        </p>

                                        <Popover>
                                            <PopoverTrigger
                                                asChild
                                            >
                                                <Pencil
                                                    size={14}
                                                />
                                            </PopoverTrigger>

                                            <PopoverContent
                                                align='start'
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name='currencyExchangeRate'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Exchange Rate (in USD)
                                                            </FormLabel>

                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    onChange={(value) => field.onChange(value.target.valueAsNumber)}
                                                                    type='number'
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}
                            </div>

                            <FormField
                                control={form.control}
                                name='merchant'
                                render={({ field }) => (
                                    <FormItem
                                        className='w-full'
                                    >
                                        <FormLabel>
                                            Merchant
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem
                                        className='w-full'
                                    >
                                        <FormLabel>
                                            Description
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                disabled={createExpenseIsLoading}
                            >
                                {createExpenseIsLoading && (
                                    <LoaderCircle
                                        className='animate-spin'
                                    />
                                )}

                                Save
                            </Button>
                        </form>
                    </Form>
                )}


                <div
                    className='border border-dashed flex flex-col items-center justify-center gap-3'
                >
                    <div
                        className='space-y-6'
                    >
                        <div
                            className={cn(
                                'bg-muted border h-96 w-72',
                                receipt.base64String === '' && 'flex items-center justify-center'
                            )}
                            id={receipt.type !== 'application/pdf' ? 'imageZoom' : undefined}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onMouseMove={receipt.type.startsWith('image/') ? handleMouseMove : undefined}
                            onMouseOut={(event) => event.currentTarget.style.setProperty('--display', 'none')}
                            style={{
                                '--display': 'none',
                                '--url': `url(${receipt.base64String})`,
                                '--x': '0%',
                                '--y': '0%',
                                position: 'relative'
                            }}
                        >
                            {receipt.base64String === '' ? (
                                <Button
                                    onClick={() => document.getElementById('receipt-input').click()}
                                    variant='outline'
                                >
                                    <FileUp />

                                    Add Receipt
                                </Button>

                            ) : (
                                receipt.type === 'application/pdf' ? (
                                    <Worker
                                        workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"
                                    >
                                        <Viewer
                                            fileUrl={receipt.base64String}
                                            plugins={[zoomPluginInstance]}
                                        />
                                    </Worker>
                                ) : (
                                    <img
                                        className='size-full pointer-events-none'
                                        src={receipt.base64String}
                                    />
                                )
                            )}
                        </div>

                        {receipt.type === 'application/pdf' && receipt.base64String !== '' && (
                            <div
                                className='flex justify-center'
                            >
                                <ZoomOutButton />
                                <ZoomPopover />
                                <ZoomInButton />
                            </div>
                        )}

                        <input
                            accept='application/pdf, image/*'
                            id='receipt-input'
                            hidden
                            onInput={handleReceiptInput}
                            type='file'
                        />

                        {receipt.base64String && (
                            <div>
                                <Button
                                    onClick={() => setReceipt({
                                        base64String: '',
                                        type: ''
                                    })}
                                    variant='outline'
                                >
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}