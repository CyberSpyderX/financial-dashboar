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

import { insertCategorySchema } from '@/db/schema';

import { CategoryForm } from './new-category-form';
import { useOpenCategory } from '../hooks/use-open-category';
import { useGetCategory } from '../hooks/use-get-category';
import { useEditCategory } from '../hooks/use-edit-category';
import { useDeleteCategory } from '../hooks/use-delete-category';

const formSchema = insertCategorySchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

export default function EditCategorySheet () {
    const { isOpen, onClose, id } = useOpenCategory();
    const categoriesQuery = useGetCategory(id);
    const deleteQuery = useDeleteCategory(id);
    const mutation = useEditCategory(id);

    const handleSubmit = (values: FormValues) => {
        console.log(values);
        
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

    const defaultValues = categoriesQuery.data || {
        name: ""
    };
    
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='space-y-4'>
                <SheetHeader>
                    <SheetTitle>Edit Category</SheetTitle>
                    <SheetDescription>
                        Update the existing category.
                    </SheetDescription>
                </SheetHeader>
                {
                    categoriesQuery.isLoading ?
                    <Loader2 className='size-4 text-slate-300 animate-spin'/> : 
                    <CategoryForm 
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