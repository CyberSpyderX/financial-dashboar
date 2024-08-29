"use client";

import {
    Sheet,
    SheetTitle,
    SheetDescription,
    SheetContent,
    SheetHeader
} from '@/components/ui/sheet';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { insertAccountSchema } from '@/db/schema';

import { AccountForm } from './new-account-form';
import { useOpenAccount } from '../hooks/use-open-account';
import { useGetAccount } from '../hooks/use-get-account';
import { useEditAccount } from '../hooks/use-edit-account';
import { useDeleteAccount } from '../hooks/use-delete-account';

const formSchema = insertAccountSchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

export default function EditAccountSheet () {
    const { isOpen, onClose, id } = useOpenAccount();
    const accountsQuery = useGetAccount(id);
    const deleteQuery = useDeleteAccount(id);
    const mutation = useEditAccount(id);

    const handleSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }
    const handleDelete = () => {
        deleteQuery.mutate(undefined, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const defaultValues = accountsQuery.data || {
        name: ""
    };
    
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>Edit Account</SheetTitle>
                    <SheetDescription>
                        Update the existing account.
                    </SheetDescription>
                </SheetHeader>
                {
                    accountsQuery.isLoading ?
                    <Loader2 className='size-4 text-slate-300 animate-spin'/> : 
                    <AccountForm 
                        id={id}
                        disabled={mutation.isPending} 
                        onSubmit={handleSubmit} 
                        onDelete={handleDelete}
                        defaultValues={defaultValues}
                    />
                }
            </SheetContent>
        </Sheet>
    );
}