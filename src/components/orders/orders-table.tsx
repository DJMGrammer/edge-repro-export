import type { TableOptions } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter';
import type { DataTableFeatures } from '@/components/ui/data-table/data-table-features';
import { DataTableTextFilter } from '@/components/ui/data-table/data-table-text-filter';

import type { Order } from './order-table-columns';
import { orderColumns, orderStatusFilterOptions } from './order-table-columns';
import {
    orderColumnFiltersAtom,
    orderColumnVisibilityAtom,
} from './order-table-state';

export function OrdersTable({
    data,
    onRowClick,
    rowAriaLabel,
    emptyMessage,
    className,
    views,
    atoms = {
        columnVisibility: orderColumnVisibilityAtom,
        columnFilters: orderColumnFiltersAtom,
    },
}: {
    data: Order[];
    onRowClick?: (order: Order) => void;
    rowAriaLabel?: (order: Order) => string;
    emptyMessage?: string;
    className?: string;
    views?: ReactNode;
    atoms?: TableOptions<DataTableFeatures, Order>['atoms'];
}) {
    return (
        <DataTable
            columns={orderColumns}
            data={data}
            atoms={atoms}
            views={views}
            toolbar={(table) => (
                <>
                    <DataTableTextFilter
                        table={table}
                        columnId="order_number"
                        placeholder="Filter order number..."
                    />
                    <DataTableTextFilter
                        table={table}
                        columnId="assignee_name"
                        placeholder="Filter assignee..."
                    />
                    <DataTableFacetedFilter
                        table={table}
                        columnId="status"
                        title="Status"
                        options={orderStatusFilterOptions}
                    />
                </>
            )}
            onRowClick={onRowClick}
            rowAriaLabel={rowAriaLabel}
            emptyMessage={emptyMessage}
            className={className}
        />
    );
}
