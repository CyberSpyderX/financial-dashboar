import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Popover, PopoverTrigger } from "./popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { PopoverContent } from "@radix-ui/react-popover"
import { Calendar } from "./calendar"
import { SelectSingleEventHandler } from "react-day-picker"

export const DatePicker = ({
    value,
    onChange,
    disabled
}: {
    value?: Date,
    onChange?: SelectSingleEventHandler,
    disabled?: boolean
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                <CalendarIcon className="size-4 mr-2" />
                { value ? format(value, "PPP") : <span>Pick a date</span>}   
                </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white z-50">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}