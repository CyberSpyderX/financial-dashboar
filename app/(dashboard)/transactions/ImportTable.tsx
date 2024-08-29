import {
    Table,
    TableHeader,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@/components/ui/table';
import TableHeadSelect from './components/TableHeadSelect';

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeaderSelect: (columnIndex: number, value: string | null) => void
}
export default function ImportTable ({
    headers,
    body,
    selectedColumns,
    onTableHeaderSelect
}: Props) {
    return (
        <div className='rounded-md border overflow-hidden'>
            <Table>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        {headers.map((_item, index) => (
                            <TableHead key={index}>
                                <TableHeadSelect
                                    columnIndex={index}
                                    selectedColumns={selectedColumns}
                                    onChange={onTableHeaderSelect}
                                />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row, index) => (
                        <TableRow key={index}>
                            { row.map((element, index) => (
                                <TableCell key={index}>
                                    {element}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}