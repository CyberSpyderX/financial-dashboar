
import { useState } from "react";
import { AreaChart, BarChart, FileSearch, LineChart, Loader2, PieChart, Radar, Target } from "lucide-react";

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle
} from "@/components/ui/card";

import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import { 
    Select, 
    SelectItem, 
    SelectContent, 
    SelectTrigger, 
    SelectValue 
} from "./ui/select";
import { PieVariant } from "./pie-variant";
import { RadarVariant } from "./radar-variant";
import { RadialVariant } from "./radial-variant";
import { Skeleton } from "./ui/skeleton";

type Props = {
    data?: {
        name: string;
        value: number;
    }[]
}

export const SpendingPieLoading = () => {
    return (
        <div className="max-w-screen-2xl mx-auto -mt-24 w-full">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 lg:w-[120px] w-full" />
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full flex items-center justify-center">
                        <Loader2 className="size-6 animate-spin text-slate-300" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export const CategoryChart = ({ data }: Props) => {
    const [chartType, setChartType] = useState("pie");

    const onTypeChange = (type: string) => {
        setChartType(type);
    }
    return (
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
            <CardTitle>
                Categories
            </CardTitle>
            <Select
                defaultValue={chartType}
                onValueChange={onTypeChange}
            >
                <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                    <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pie">
                        <div className="flex items-center">
                            <PieChart className="size-4 mr-2 shrink-0" />
                            <p className="line-clamp-1">
                                Pie Chart
                            </p>
                        </div>
                    </SelectItem>
                    <SelectItem value="radar">
                        <div className="flex items-center">
                            <Radar className="size-4 mr-2 shrink-0" />
                            <p className="line-clamp-1">
                                Radar Chart
                            </p>
                        </div>
                    </SelectItem>
                    <SelectItem value="radial">
                        <div className="flex items-center">
                            <Target className="size-4 mr-2 shrink-0" />
                            <p className="line-clamp-1">
                                Radial Chart
                            </p>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </CardHeader>
        <CardContent>
            {!data ? 
                <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                    <FileSearch className="size-6 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                        No data for this period
                    </p>
                </div>
            : (
                <>
                    {
                        chartType === 'pie' ? <PieVariant data={data} /> :
                        chartType === 'radar' ? <RadarVariant data={data} /> :
                        chartType === 'radial' ? <RadialVariant data={data} /> : null
                    }
                </>
            )}
        </CardContent>
      </Card>  
    );
}