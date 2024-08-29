
import { FaPiggyBank } from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import { useSearchParams } from "next/navigation";

import { formatDateRange } from "@/lib/utils";
import { useGetSummary } from "@/features/summary/hooks/use-get-summary"

import DataCard, { DataCardLoading } from "@/features/summary/components/DataCard";

export const DataGrid = () => {
    const { data, isLoading } = useGetSummary();
    
    const params = useSearchParams();
    const from = params.get("from") || undefined;
    const to = params.get("to") || undefined;

    if(isLoading) {
        return(
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <DataCardLoading />
                <DataCardLoading />
                <DataCardLoading />
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard
                title="Remaining"
                dateRange={formatDateRange({ from, to })}
                Icon={FaPiggyBank}
                variant='default'
                value={data?.remainingAmount!}
                percentageChange={data?.remainingChange!}
            />
            <DataCard
                title="Income"
                dateRange={formatDateRange({ from, to })}
                Icon={FaArrowTrendUp}
                variant='success'
                value={data?.incomeAmount!}
                percentageChange={data?.incomeChange!}
            />
            <DataCard
                title="Expenses"
                dateRange={formatDateRange({ from, to })}
                Icon={FaArrowTrendDown}
                variant='danger'
                value={data?.expensesAmount!}
                percentageChange={data?.expensesChange!}
            />
        </div>
    )
}