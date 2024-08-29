"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions } from '@/db/schema';

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT" 
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {}
};

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/hooks/use-get-transactions";
import { useBulkDelete } from "@/features/transactions/hooks/use-bulk-delete-transactions";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { columns } from "./columns";

import ImportCard from "./ImportCard";
import UploadButton from "./UploadButton";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useBulkCreate } from "@/features/transactions/hooks/use-bulk-create-transactions";

export default function Transactions() {
    const [variant, setVariant] = useState(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const { onOpen } = useNewTransaction();
    const [ConfirmationDialog, confirm] = useSelectAccount();
    const accountsQuery = useGetTransactions();
    const bulkCreateQuery = useBulkCreate();
    const deleteQuery = useBulkDelete();
    const data = accountsQuery.data || [];
    
    const disabled = accountsQuery.isLoading || deleteQuery.isPending;

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setVariant(VARIANTS.IMPORT);
        setImportResults(results);
    }

    const onCancelUpload = () => {
        setVariant(VARIANTS.LIST);
        setImportResults(INITIAL_IMPORT_RESULTS);
    }

    const onSubmitImport = async ( values: typeof transactions.$inferInsert[]) => {
        const accountId = await confirm();

        if(!accountId) {
            return toast.error("Please select an account");
        }

        const data = values.map(item => ({
            ...item,
            accountId: accountId as string
        }));

        bulkCreateQuery.mutate(data, {
            onSuccess: () => {
                toast.success("Transactions imported successfully");
                onCancelUpload();
            }
        });
    }


    if(accountsQuery.isLoading) {
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

    if(variant === VARIANTS.IMPORT) {
        return (
            <>
                <ConfirmationDialog />
                <ImportCard 
                    data={importResults.data}
                    onCancel={onCancelUpload}
                    onSubmit={onSubmitImport}
                />
            </>
        )
    }
    return (
        <div className="max-w-screen-2xl mx-auto">
            <Card className="border-none drop-shadow-sm -mt-24">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                    <div className="space-y-2">
                        <Button size={'sm'} onClick={onOpen} className="w-full lg:w-auto mr-2">
                            <Plus className="size-4 mr-2" />
                            Add Transaction
                        </Button>
                        <UploadButton 
                            onUpload={onUpload}
                        />                        
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns}
                        data={data}
                        filterKey="payee"
                        onDelete={(rows) => {
                            const ids = rows.map((row) => row.original.id);
                            deleteQuery.mutate({ ids });
                        }}
                        disabled={disabled}
                        confirmationTitle="Are you sure?"
                        confirmationMessage="You are about to delete multiple transactions"
                    />
                </CardContent>
            </Card>
        </div>
    )
}