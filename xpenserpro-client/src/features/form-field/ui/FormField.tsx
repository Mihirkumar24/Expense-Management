import { format } from 'date-fns';
import {
    CalendarIcon,
    Check,
    ChevronsUpDown,
    Pencil
} from 'lucide-react';
import React, {
    useEffect,
    useState
} from 'react';
import { useFormContext } from 'react-hook-form';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/shared/ui/command';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/shared/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

import currencies from '@/entities/currency';
import { useLazyGetCurrencyExchangeRateQuery } from '@/features/currency-exchange-rate';

import { cn } from '@/shared/lib/utils';

import Loader from '@/widgets/loader';

export function AmountFormField() {
    const [editCurrencyExchangeRateOpen, setEditCurrencyExchangeRateOpen] = useState(false);

    const form = useFormContext();

    const [newCurrencyExchangeRate, setNewCurrencyExchangeRate] = useState(form.getValues('currencyExchangeRate'));

    const [
        currency,
        currencyExchangeRate
    ] = form.watch(['currency', 'currencyExchangeRate']);

    const [
        getCurrencyExchangeRate,
        {
            data: currencyExchangeRateData,
            isLoading: getCurrencyExchangeRateIsLoading
        }
    ] = useLazyGetCurrencyExchangeRateQuery();

    useEffect(() => {
        getCurrencyExchangeRate(currency);

        if (currencyExchangeRateData) {
            form.setValue('currencyExchangeRate', currencyExchangeRateData);
        }
    }, [
        currency,
        currencyExchangeRateData
    ]);

    return (
        <div
            className='space-y-3'
        >
            <div
                className='flex gap-3'
            >
                <SelectFormField
                    items={currencies}
                    label='Currency'
                    name='currency'
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
                                <Input {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {currency !== 'usd' && (
                getCurrencyExchangeRateIsLoading ? (
                    <span
                        className='text-sm text-muted-foreground'
                    >
                        Fetching exchange rates...
                    </span>
                ) : (
                    <div
                        className='flex gap-3 items-center'
                    >
                        <span
                            className='text-sm text-muted-foreground'
                        >
                            {`1 ${currency.toUpperCase()} = ${currencyExchangeRate} USD `}
                        </span>

                        <Popover
                            open={editCurrencyExchangeRateOpen}
                            onOpenChange={(open) => {
                                setNewCurrencyExchangeRate(form.getValues('currencyExchangeRate'));
                                setEditCurrencyExchangeRateOpen(open);
                            }}
                        >
                            <PopoverTrigger
                                asChild
                            >
                                <Pencil
                                    className='text-primary'
                                    size={14}
                                />
                            </PopoverTrigger>

                            <PopoverContent
                                align='start'
                            >
                                <div
                                    className='space-y-3'
                                >
                                    <FormItem>
                                        <FormLabel>
                                            Exchange Rate (in USD)
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                onChange={(event) => setNewCurrencyExchangeRate(event.currentTarget.value)}
                                                value={newCurrencyExchangeRate}
                                            />
                                        </FormControl>
                                    </FormItem>

                                    <div
                                        className='space-x-3'
                                    >
                                        <Button
                                            onClick={() => {
                                                if (isNaN(newCurrencyExchangeRate)) {
                                                    form.setValue('currencyExchangeRate', '1.00');

                                                    setNewCurrencyExchangeRate('1.00');
                                                } else {
                                                    form.setValue('currencyExchangeRate', newCurrencyExchangeRate);
                                                }

                                                setEditCurrencyExchangeRateOpen(false);
                                            }}
                                            size='sm'
                                        >
                                            Save
                                        </Button>

                                        <Button
                                            onClick={() => setEditCurrencyExchangeRateOpen(false)}
                                            size='sm'
                                            variant='outline'
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )
            )}
        </div>
    );
}

type Item = {
    icon?: React.ReactNode
    label: string,
    value: string
}

type ComboboxFormFieldProps<T, D> = {
    className?: string,
    defaultFieldValue?: string,
    data: D[],
    label: string,
    mapFunction: (data: any) => Item[]
    name: keyof T & string,
    triggerFunction: (triggerFunctionArguments: any, preferCacheValue: boolean) => any
    triggerFunctionArguments?: any
}

export function ComboboxFormField<T, D>({
    className,
    data,
    defaultFieldValue,
    label,
    mapFunction,
    name,
    triggerFunction,
    triggerFunctionArguments
}: ComboboxFormFieldProps<T, D>) {
    const form = useFormContext();

    let items: Item[] | undefined = undefined;

    if (data) {
        items = mapFunction(data);
    }

    console.log(form.getValues(name));

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>

                    <Popover
                        onOpenChange={(open) => {
                            if (open) {
                                triggerFunction(triggerFunctionArguments, true);
                            }
                        }}
                    >
                        <PopoverTrigger
                            asChild
                        >
                            <FormControl>
                                <Button
                                    variant='outline'
                                    className={cn(
                                        'justify-between',
                                        (!field.value && !defaultFieldValue) && 'text-muted-foreground'
                                    )}
                                >
                                    {
                                        items && field.value
                                            ? items.find(
                                                (item) => item.value === field.value
                                            ).label
                                            : defaultFieldValue || 'Select'
                                    }

                                    <ChevronsUpDown />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>

                        <PopoverContent
                            className='p-0 w-(--radix-popover-trigger-width)'
                        >
                            <Command>
                                <CommandList>
                                    {items ? (
                                        <>
                                            <CommandEmpty>
                                                No items found.
                                            </CommandEmpty>

                                            <CommandGroup>
                                                {items.map((item) => (
                                                    <CommandItem
                                                        value={item.value}
                                                        key={item.value}
                                                        onSelect={() => form.setValue(name, item.value)}
                                                    >
                                                        {item.label}

                                                        {item.value === field.value && (
                                                            <Check
                                                                className='ml-auto'
                                                            />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </>
                                    ) : (
                                        <Loader />
                                    )}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type DateFormFieldProps<T> = {
    className?: string
    label: string,
    name: keyof T & string
}

export function DateFormField<T>({
    className,
    label = 'Date',
    name = 'date'
}: DateFormFieldProps<T>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>

                    <Popover>
                        <PopoverTrigger
                            asChild
                        >
                            <FormControl>
                                <Button
                                    variant='outline'
                                >
                                    {format(field.value, 'PPP')}

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
                                captionLayout='dropdown'
                                disabled={(date) => date > new Date()}
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
    );
}

export function DateRangeFormField() {
    const form = useFormContext();

    return (
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
                                >
                                    {field.value.from ? (
                                        field.value.to ? (
                                            `${format(field.value.from, 'PPP')} - ${format(field.value.to, 'PPP')}`
                                        ) : (
                                            format(field.value.from, 'PPP')
                                        )
                                    ) : (
                                        'Select a date range.'
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
                                captionLayout='dropdown'
                                disabled={(date) => date > new Date()}
                                mode='range'
                                onSelect={field.onChange}
                                selected={field.value}
                            />
                        </PopoverContent>
                    </Popover>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type InputFormFieldProps<T> = {
    className?: string
    label: string,
    name: keyof T & string
}

export function InputFormField<T>({
    className,
    label,
    name,
    ...props
}: InputFormFieldProps<T>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>

                    <FormControl>
                        <Input
                            className={className}
                            {...field}
                            {...props}
                        />
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type SelectFormFieldProps<T> = {
    className?: string,
    label: string,
    items: Item[],
    name: keyof T & string
}

export function SelectFormField<T>({
    className,
    items,
    label,
    name,
    ...props
}: SelectFormFieldProps<T>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>

                    <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                    >
                        <FormControl>
                            <SelectTrigger
                                className={cn('w-full', className)}
                                {...props}
                            >
                                <SelectValue
                                    placeholder='Select'
                                />
                            </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                            {items ? (
                                items.map((item, index) => (
                                    <SelectItem
                                        key={`${name}-${index}`}
                                        value={item.value}
                                    >
                                        {item.icon ? (
                                            <div
                                                className='flex gap-3'
                                            >
                                                {item.icon} {item.label}
                                            </div>
                                        ) : (
                                            item.label
                                        )}
                                    </SelectItem>
                                ))
                            ) : (
                                <div
                                    className='p-0.5'
                                >
                                    <span
                                        className='text-sm text-muted-foreground'
                                    >
                                        NO ITEM FOUND
                                    </span>
                                </div>
                            )}
                        </SelectContent>
                    </Select>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type SelectFormFieldWithLazyQueryProps<T, D> = {
    className?: string,
    data: D[],
    label: string,
    mapFunction: (data: any) => Item[]
    name: keyof T & string,
    triggerFunction: (triggerFunctionArguments: any, preferCacheValue: boolean) => any
    triggerFunctionArguments?: any
}

export function SelectFormFieldWithLazyQuery<T, D>({
    className,
    data,
    label,
    mapFunction,
    name,
    triggerFunction,
    triggerFunctionArguments,
    ...props
}: SelectFormFieldWithLazyQueryProps<T, D>) {
    const form = useFormContext();

    let items: Item[] | undefined = undefined;

    if (data) {
        items = mapFunction(data);
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>

                    <Select
                        {...field}
                        onOpenChange={(open) => {
                            if (open) {
                                triggerFunction(triggerFunctionArguments, true);
                            }
                        }}
                        onValueChange={field.onChange}
                    >
                        <FormControl>
                            <SelectTrigger
                                className={cn('w-full', className)}
                                {...props}
                            >
                                <SelectValue
                                    placeholder='Select'
                                />
                            </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                            {items ? (
                                items.length === 0 ? (
                                    <div
                                        className='p-0.5'
                                    >
                                        <span
                                            className='text-sm text-muted-foreground'
                                        >
                                            NO ITEM FOUND
                                        </span>
                                    </div>
                                ) : (
                                    items.map((item, index) => (
                                        <SelectItem
                                            key={`${name}-${index}`}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))
                                )) : (
                                <Loader />
                            )}
                        </SelectContent>
                    </Select>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type TextareaFormFieldProps<T> = {
    className?: string
    label: string,
    name: keyof T & string
}

export function TextareaFormField<T>({
    className,
    label,
    name,
    ...props
}: TextareaFormFieldProps<T>) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>

                    <FormControl>
                        <Textarea
                            {...field}
                            className={className}
                            {...props}
                        />
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}