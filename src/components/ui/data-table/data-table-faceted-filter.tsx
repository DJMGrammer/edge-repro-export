import type { RowData, Table } from '@tanstack/react-table';
import { ListFilter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { DataTableFeatures } from './data-table-features';

const allStatusesValue = '__all__';

export function DataTableFacetedFilter<TData extends RowData>({
    table,
    columnId,
    title,
    options,
}: {
    table: Table<DataTableFeatures, TData>;
    columnId: string;
    title: string;
    options: readonly { value: string; label: string }[];
}) {
    const column = table.getColumn(columnId);

    if (column === undefined || !column.getCanFilter()) {
        return null;
    }

    const filterValue = column.getFilterValue();
    const selectedValue =
        typeof filterValue === 'string' ? filterValue : allStatusesValue;
    const selectedLabel = options.find(
        (option) => option.value === selectedValue,
    )?.label;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="outline" size="sm">
                        <ListFilter />
                        {selectedLabel ? `${title}: ${selectedLabel}` : title}
                    </Button>
                }
            />
            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>{title}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={selectedValue}
                        onValueChange={(value) =>
                            column.setFilterValue(
                                value === allStatusesValue ? undefined : value,
                            )
                        }
                    >
                        <DropdownMenuRadioItem value={allStatusesValue}>
                            All
                        </DropdownMenuRadioItem>
                        {options.map((option) => (
                            <DropdownMenuRadioItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
