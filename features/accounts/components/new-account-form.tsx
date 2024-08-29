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
import { insertAccountSchema } from '@/db/schema';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const formSchema = insertAccountSchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit?: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
}: Props) => {
    const [error, setError] = useState('');
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const handleSubmit = (values: FormValues) => {
        if(!values.name) {
            setError("Please enter a valid account name");
            return;
        }
        onSubmit?.(values);
    }
    const handleDelete = () => {
        onDelete?.();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                <FormField
                    name='name'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    className={cn()}
                                    disabled={disabled}
                                    placeholder='e.g. Cash, Bank, Credit Card'
                                    {...field}
                                >
                                </Input>
                            </FormControl>
                            {
                                error && 
                                <div className='flex gap-x-2 text-red-500 items-center'>
                                    <CircleX className='size-4'/>
                                    <p className='text-sm'>{error}</p>
                                </div>
                            }
                        </FormItem>
                    )}
                />
                <Button className='w-full mt-2'>
                    {id ? 'Save Changes' : 'Create Account'}
                </Button>
                {!!id && <Button
                    type='button'
                    variant='outline'
                    className='w-full gap-x-2'
                    onClick={handleDelete}
                >
                    <Trash className='size-4 '/>
                    Delete Account
                </Button>}
            </form>
        </Form>
    )
}
