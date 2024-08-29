import { z } from 'zod';
import { CircleX, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { insertTransactionSchema } from '@/db/schema';
import { useState } from 'react';

import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { AmountInput } from '@/components/ui/amount-input';
import { Select } from '@/components/select';

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional()
})
type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    disabled?: boolean;
    onSubmit?: (values: FormValues) => void;
    onDelete?: () => void;
    defaultValues?: FormValues;
    categoryOptions?: { label: string, item: string }[];
    onCreateCategory: (name: string) => void;
    accountOptions?: { label: string, item: string }[];
    onCreateAccount: (name: string) => void;  
}

export const TransactionForm = ({
    id,
    onSubmit,
    onDelete,
    disabled,
    defaultValues,
    categoryOptions,
    onCreateCategory,
    accountOptions,
    onCreateAccount  
}: Props) => {
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });
    
    const handleSubmit = (values: FormValues) => {
        onSubmit?.(values);
    }
    const handleDelete = () => {
        onDelete?.();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                <FormField
                    name='date'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <DatePicker 
                                    disabled={disabled}
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='accountId'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account</FormLabel>
                            <FormControl>
                                <Select
                                    onChange={field.onChange}
                                    onCreate={onCreateAccount}
                                    disabled={disabled}
                                    options={accountOptions}
                                    placeholder="Select an account"
                                    value={field.value}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='categoryId'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select
                                    onChange={field.onChange}
                                    onCreate={onCreateCategory}
                                    disabled={disabled}
                                    options={categoryOptions}
                                    placeholder="Select a category"
                                    value={field.value}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='payee'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payee</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder="Add a Payee"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='amount'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <AmountInput
                                    onChange={field.onChange}
                                    value={field.value}
                                    disabled={disabled}
                                    placeholder="0.00"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name='notes'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    disabled={disabled}
                                    value={field.value ?? ""}
                                    placeholder='Optional notes'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className='w-full mt-2'>
                    {id ? 'Save Transaction' : 'Create Transaction'}
                </Button>
                {!!id && <Button
                    type='button'
                    variant='outline'
                    className='w-full gap-x-2'
                    onClick={handleDelete}
                >
                    <Trash className='size-4 '/>
                    Delete Transaction
                </Button>}
            </form>
        </Form>
    )
}
