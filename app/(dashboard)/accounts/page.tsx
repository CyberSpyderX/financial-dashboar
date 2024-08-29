"use client";

import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./columns";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useGetAccounts } from "@/features/accounts/hooks/use-get-accounts";
import { useBulkDelete } from "@/features/accounts/hooks/use-bulk-delete";
import { useConfirm } from "@/hooks/use-confirm";
import { Skeleton } from "@/components/ui/skeleton";

export default function Accounts() {
    const { onOpen } = useNewAccount();
    const accountsQuery = useGetAccounts();
    const deleteQuery = useBulkDelete();
    const data = accountsQuery.data || [];
    
    const disabled = accountsQuery.isLoading || deleteQuery.isPending;

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
    return (
        <div className="max-w-screen-2xl mx-auto">
            <Card className="border-none drop-shadow-sm -mt-24">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Accounts page
                    </CardTitle>
                    <Button size={'sm'} onClick={onOpen}>
                        <Plus className="size-4 mr-2" />
                        Add Account
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
                        confirmationMessage="You are about to delete multiple accounts"
                    />
                </CardContent>
            </Card>
        </div>
    )
}