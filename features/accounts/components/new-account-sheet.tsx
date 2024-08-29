"use client";

import {
    Sheet,
    SheetTitle,
    SheetDescription,
    SheetContent,
    SheetHeader
} from '@/components/ui/sheet';
import { z } from 'zod';

import { useNewAccount } from '../hooks/use-new-account';
import { AccountForm } from './new-account-form';
import { insertAccountSchema } from '@/db/schema';
import { useCreateAccount } from '../hooks/use-create-account';

const formSchema = insertAccountSchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

export default function NewAccountSheet () {
    const { isOpen, onClose } = useNewAccount();
    const mutation = useCreateAccount();

    const handleSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        });
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>New Account</SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm 
                    disabled={mutation.isPending} 
                    onSubmit={handleSubmit} 
                    defaultValues={{
                        name: ""
                    }} />
            </SheetContent>
        </Sheet>
    );
}