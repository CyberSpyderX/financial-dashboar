import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTransaction } from "@/features/transactions/hooks/use-delete-transaction";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

type Props = {
    id?: string;
}
export default function Actions({ id }: Props) {
    const { onOpen, onClose } = useOpenTransaction();
    const deleteQuery = useDeleteTransaction(id);
    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete an transaction"
    );
    return (
        <DropdownMenu>
            <ConfirmationDialog />
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-4 p-0">
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    disabled={false}
                    onClick={() => {
                        onOpen(id);
                    }}
                    className="focus:outline-none focus:bg-accent py-1"
                >
                    <div className="flex items-center px-2">
                        <Edit className="size-4 mr-2"/>
                        Edit
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={false}
                    onClick={async () => {
                        const ok = await confirm();

                        if(ok) {
                            deleteQuery.mutate();
                            onClose();
                        }
                    }}
                    className="focus:outline-none focus:bg-accent py-1"
                >
                    <div className="flex items-center px-2">
                        <Trash className="size-4 mr-2 text-red-500"/>
                        <p className="text-red-500">Delete</p>                        
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}