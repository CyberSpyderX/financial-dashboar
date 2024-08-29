import { useRef, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
    DialogFooter,
} from '@/components/ui/dialog';

import { Button } from "@/components/ui/button";
import { useGetAccounts } from "./use-get-accounts";
import { useCreateAccount } from "./use-create-account";
import { Select } from "@/components/select";

export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);
    const selectValue = useRef<string>();
    const accountsQuery = useGetAccounts();
    const createAccountMutation = useCreateAccount();
    const accountOptions = (accountsQuery.data || []).map(account => ({
        label: account.name,
        item: account.id
    }));
    const onCreateAccount = (name: string) => createAccountMutation.mutate({ name });

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };
    
    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    }

    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };

    const ConfirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select an account</DialogTitle>
                    <DialogDescription>Select an account for these transactions.</DialogDescription>
                </DialogHeader>
                <Select
                    placeholder={"Select an account"}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountsQuery.isLoading || createAccountMutation.isPending}
                    onCreate={onCreateAccount}
                    options={accountOptions}
                />
                <DialogFooter className="pt-2">
                    <Button
                        variant={'outline'}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
}