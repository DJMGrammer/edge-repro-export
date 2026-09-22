import type { RowData, Table } from '@tanstack/react-table';
import { Columns3 } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import type { DataTableFeatures } from './data-table-features';

function formatColumnLabel(columnId: string): string {
    return columnId
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function DataTableViewOptions<TData extends RowData>({
    table,
}: {
    table: Table<DataTableFeatures, TData>;
}) {
    const columns = table
        .getAllColumns()
        .filter((column) => column.getCanHide());

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="outline" size="sm">
                        <Columns3 />
                        Columns
                    </Button>
                }
            />
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    {columns.map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(checked) =>
                                column.toggleVisibility(checked)
                            }
                        >
                            {formatColumnLabel(column.id)}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
