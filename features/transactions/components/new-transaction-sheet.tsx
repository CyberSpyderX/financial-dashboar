"use client";

import {
    Sheet,
    SheetTitle,
    SheetDescription,
    SheetContent,
    SheetHeader
} from '@/components/ui/sheet';
import { z } from 'zod';

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { TransactionForm } from '@/features/transactions/components/new-transaction-form';
import { useCreateTransaction } from '@/features/transactions/hooks/use-create-transaction';
import { insertTransactionSchema } from '@/db/schema';
import { useCreateCategory } from '@/features/categories/hooks/use-create-category';
import { useGetCategories } from '@/features/categories/hooks/use-get-categories';
import { useCreateAccount } from '@/features/accounts/hooks/use-create-account';
import { useGetAccounts } from '@/features/accounts/hooks/use-get-accounts';
import { Loader2 } from 'lucide-react';
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

export default function NewTransactionSheet () {
    const { isOpen, onClose } = useNewTransaction();
    const createMutation = useCreateTransaction();
    
    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name,
    });
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        item: category.id
    }));

    const accountMutation = useCreateAccount();
    const accountQuery = useGetAccounts();
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name,
    });
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        item: account.id
    }));
    
    const onSubmit = (values: FormValues) => {
        const finalAmount = convertAmountToMiliUnits(parseFloat(values.amount));
        createMutation.mutate({
            ...values,
            amount: finalAmount
        }, {
            onSuccess: () => {
                onClose()
            }
        });
    }

    const isPending = 
        createMutation.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending;

    const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>New Transaction</SheetTitle>
                    <SheetDescription>
                        
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading ?
                    <div className='w-full h-[100px]'>
                        <Loader2 className='size-4 animate-spin text-muted-foreground'/>
                    </div> : 
                    <TransactionForm 
                        disabled={isPending} 
                        onSubmit={onSubmit}
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