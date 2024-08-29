"use client";

import {
    Sheet,
    SheetTitle,
    SheetDescription,
    SheetContent,
    SheetHeader
} from '@/components/ui/sheet';
import { z } from 'zod';

import { insertCategorySchema } from '@/db/schema';
import { useCreateCategory } from '../hooks/use-create-category';
import { useNewCategory } from '../hooks/use-new-category';
import { CategoryForm } from './new-category-form';

const formSchema = insertCategorySchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

export default function NewCategorySheet () {
    const { isOpen, onClose } = useNewCategory();
    const mutation = useCreateCategory();

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
                    <SheetTitle>New Category</SheetTitle>
                    <SheetDescription>
                        Create a new category to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm 
                    disabled={mutation.isPending} 
                    onSubmit={handleSubmit} 
                    defaultValues={{
                        name: ""
                    }} />
            </SheetContent>
        </Sheet>
    );
}