import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImportTable from "./ImportTable";
import { useState } from "react";
import { convertAmountToMiliUnits } from "@/lib/utils";
import { format, parse } from "date-fns";

const NeoInputDateFormat = 'MMM dd';
const ScotiaInputDateFormat = 'M/d/yyyy';
const outputDateFormat = 'MMM dd, yyyy';

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

const requiredOptions = [
    "payee",
    "amount",
    "date"
]

interface SelectedColumns {
    [key: string]: string | null;
}

export default function ImportCard ({ 
    data,
    onCancel,
    onSubmit,
}: Props) {
    const headers = data[0];
    const body = data.slice(1);
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>({});
    
    function onTableHeaderSelect(columnIndex: number, value: string | null) {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...selectedColumns };

            for(const key in newSelectedColumns) {
                if(newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null;
                }
            }

            if(value === 'skip') {
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;
            return newSelectedColumns;
        });
    }

    function handleContinue () {
        const mappedData = {
            headers: headers.map((_item, index) => {
                return selectedColumns[`column_${index}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    return selectedColumns[`column_${index}`] ? cell : null
                });

                return transformedRow.every(item => item === null)
                    ? []
                    : transformedRow;
            }).filter((row) => row.length > 0)
        }
        
        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, value, index) => {
                const header = mappedData.headers[index];
                
                if(header !== null) {
                    acc[header] = value;
                }
                return acc;
            }, {})
        });

        
        
        const formattedData = arrayOfData.map((item) => {
            console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
            
            console.log(item.date, format(parse(item.date, NeoInputDateFormat, new Date()), outputDateFormat));
            
            return {
                ...item,
                amount: convertAmountToMiliUnits(item.amount) ,
                date: format(parse(item.date, NeoInputDateFormat, new Date()), outputDateFormat)
            }
        });
        
        onSubmit(formattedData);
    }

    const progress = Object.values(selectedColumns).filter(Boolean).length;

    return (
        <div className="max-w-screen-2xl mx-auto">
            <Card className="border-none drop-shadow-sm -mt-24">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transactions
                    </CardTitle>
                    <div className="space-y-2">
                        <Button size={'sm'} onClick={onCancel} className="mr-2 w-full lg:w-auto">
                            Cancel
                        </Button> 
                        <Button
                            size={"sm"}
                            className="w-full lg:w-auto"
                            onClick={handleContinue}
                            disabled={progress < requiredOptions.length}
                        >
                            Continue ({Math.min(progress, requiredOptions.length)} / {requiredOptions.length})
                        </Button>                    
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeaderSelect={onTableHeaderSelect}
                    />
                </CardContent>
            </Card>
        </div>
    )
}