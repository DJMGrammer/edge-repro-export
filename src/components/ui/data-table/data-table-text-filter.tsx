import type { RowData, Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

import type { DataTableFeatures } from './data-table-features';

export function DataTableTextFilter<TData extends RowData>({
    table,
    columnId,
    placeholder,
}: {
    table: Table<DataTableFeatures, TData>;
    columnId: string;
    placeholder: string;
}) {
    const column = table.getColumn(columnId);

    if (column === undefined || !column.getCanFilter()) {
        return null;
    }

    const filterValue = column.getFilterValue();

    return (
        <Input
            value={typeof filterValue === 'string' ? filterValue : ''}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-7 w-40"
            onChange={(event) =>
                column.setFilterValue(event.target.value || undefined)
            }
        />
    );
}
