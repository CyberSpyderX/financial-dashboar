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

import { insertTransactionSchema } from '@/db/schema';

import { TransactionForm } from './new-transaction-form';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useGetTransaction } from '@/features/transactions/hooks/use-get-transaction';
import { useEditTransaction } from '@/features/transactions/hooks/use-edit-transaction';
import { useDeleteTransaction } from '@/features/transactions/hooks/use-delete-transaction';
import { useGetCategories } from '@/features/categories/hooks/use-get-categories';
import { useCreateCategory } from '@/features/categories/hooks/use-create-category';
import { useGetAccounts } from '@/features/accounts/hooks/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/hooks/use-create-account';
import { convertAmountToMiliUnits } from '@/lib/utils';

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional()
})
type FormValues = z.input<typeof formSchema>;

export default function EditTransactionSheet () {
    const { isOpen, onClose, id } = useOpenTransaction();
    const transactionQuery = useGetTransaction(id);
    const deleteQuery = useDeleteTransaction(id);
    const mutation = useEditTransaction(id);

    const categoriesQuery = useGetCategories();
    const createCategory = useCreateCategory();

    const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
        label: category.name,
        item: category.id
    }));
    const onCreateCategory = (name: string) => createCategory.mutate({ name });

    const accountsQuery = useGetAccounts();
    const createAccount = useCreateAccount();
    
    const accountOptions = (accountsQuery.data ?? []).map((account) => ({
        label: account.name,
        item: account.id
    }));
    const onCreateAccount = (name: string) => createAccount.mutate({ name });

    const onSubmit = (values: FormValues) => {
        const finalAmount = convertAmountToMiliUnits(parseFloat(values.amount));
        mutation.mutate({
            ...values,
            amount: finalAmount
        }, {
            onSuccess: () => {
                onClose()
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

    const isPending = 
        transactionQuery.isPending ||
        deleteQuery.isPending ||
        mutation.isPending ||
        createAccount.isPending ||
        createCategory.isPending;
    
    const isLoading = 
        accountsQuery.isLoading ||
        categoriesQuery.isLoading ||
        transactionQuery.isLoading;

    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
        date: transactionQuery.data.date
            ? new Date(transactionQuery.data.date)
            : new Date(),
    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        payee: "",
        notes: "",
        date: new Date()
    };
    
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>Edit Transaction</SheetTitle>
                    <SheetDescription>
                        Update the existing transaction.
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading ?
                    <Loader2 className='size-4 text-slate-300 animate-spin'/> : 
                    <TransactionForm
                        id={id}
                        disabled={isPending}
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                        onDelete={handleDelete}
                        categoryOptions={categoryOptions}
                        onCreateCategory={onCreateCategory}
                        accountOptions={accountOptions}
                        onCreateAccount={onCreateAccount}
                    />
                }
            </SheetContent>
        </Sheet>
    );
}