import CurrencyInput from 'react-currency-input-field';
import { Tooltip, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { Info, MinusCircle, PlusCircle } from 'lucide-react';

type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    disabled?:boolean;
};

export const AmountInput = ({
    value,
    onChange,
    placeholder,
    disabled,
}: Props) => {
    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpense = parsedValue < 0;

    const onReverseValue = () => {
        if(!value) {
            return;
        }
        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    }

    return (
        <div className='relative'>
            <TooltipProvider>
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        <button
                            type='button'
                            onClick={onReverseValue}
                            className={cn(
                                'bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition',
                                isIncome && 'bg-emerald-500 hover:bg-emerald-600',
                                isExpense && 'bg-rose-500 hover:bg-rose-600',
                            )}
                        >
                            {!parsedValue && <Info className='size-3 text-white'></Info>}
                            {isIncome && <PlusCircle className='size-3 text-white'></PlusCircle>}
                            {isExpense && <MinusCircle className='size-3 text-white'></MinusCircle>}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className='bg-yellow-100 z-50 rounded-md p-1 mb-2'>
                            Use [+] for income and [-] for expense
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                prefix='$'
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                value={value}
                onValueChange={onChange}
                decimalScale={2}
                decimalsLimit={2}
                disabled={disabled}
                placeholder={placeholder}
            />
            <p className='text-xs mt-2 text-muted-foreground'>
                {isIncome && "This will count as income"}
                {isExpense && "This will count as expense"}
            </p>
        </div>
    );
}