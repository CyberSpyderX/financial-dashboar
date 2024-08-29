"use client";

import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./columns";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useGetCategories } from "@/features/categories/hooks/use-get-categories";
import { useBulkDelete } from "@/features/categories/hooks/use-bulk-delete-categories";
import { Skeleton } from "@/components/ui/skeleton";

export default function Categories() {
    const { onOpen } = useNewCategory();
    const categoriesQuery = useGetCategories();
    const deleteQuery = useBulkDelete();
    const data = categoriesQuery.data || [];
    
    const disabled = categoriesQuery.isLoading || deleteQuery.isPending;

    if(categoriesQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto -mt-24 w-full">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-slate-300 size-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return (
        <div className="max-w-screen-2xl mx-auto">
            <Card className="border-none drop-shadow-sm -mt-24">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Categories page
                    </CardTitle>
                    <Button size={'sm'} onClick={onOpen}>
                        <Plus className="size-4 mr-2" />
                        Add Category
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns}
                        data={data}
                        filterKey="name"
                        onDelete={(rows) => {
                            const ids = rows.map((row) => row.original.id);
                            deleteQuery.mutate({ ids });
                        }}
                        disabled={disabled}
                        confirmationTitle="Are you sure?"
                        confirmationMessage="You are about to delete multiple categories"
                    />
                </CardContent>
            </Card>
        </div>
    )
}