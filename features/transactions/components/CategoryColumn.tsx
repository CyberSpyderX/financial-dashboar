import { TriangleAlert } from "lucide-react";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
    id: string;
    category: string | null;
    categoryId: string | null;
}

export default function CategoryColumn ({
    id,
    category,
    categoryId
}: Props) {
    const { onOpen: onOpenCategory } = useOpenCategory();
    const { onOpen: onOpenTransaction } = useOpenTransaction();
    
    const onClick = () => {
        if(categoryId) {
            onOpenCategory(categoryId);
        } else {
            onOpenTransaction(id);
        }
    }
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center cursor-pointer hover:underline",
                !category && "text-red-500" 
            )}
        >
            { !category && <TriangleAlert className="shrink-0 size-4 mr-2" />}
            <button className="cursor-pointer">
                <p>
                    { category || "Uncategorized" }
                </p>
            </button>
        </div>
    )
}