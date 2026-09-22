import {
    constructFilterFn,
    createColumnHelper,
    filterFn_includesString,
} from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import type { DataTableFeatures } from '@/components/ui/data-table/data-table-features';
import { formatOrderCampaign } from '@/lib/campaign-name';

const includesStringNullable = constructFilterFn({
    ...filterFn_includesString,
    resolveDataValue: (value) => String(value ?? '').toLowerCase(),
});

export type OrderStatus = 'open' | 'assigned' | 'covered' | 'void';

export type AssignedUser = {
    id: number;
    name: string;
    email: string;
};

export type Order = {
    id: number;
    order_number: string;
    no: string | null;
    plant: string | null;
    plant_city: string | null;
    plant_st: string | null;
    campaign_id: number | null;
    gmid_product: string | null;
    orig_delivery_qty: string | null;
    shipment_type: string | null;
    orig_ship_date: string | null;
    orig_del_date: string | null;
    del_time: string | null;
    customer_ship_to_name_and_location: string | null;
    business: string | null;
    notes: string | null;
    trailer_type: string | null;
    length_of_hose: string | null;
    fitting_type_size: string | null;
    offload_method: string | null;
    documents_needed: string | null;
    special_requirements: string | null;
    incumbent_carrier: string | null;
    incumbent_best_case: string | null;
    overflow_request_reason: string | null;
    is_this_a_shutdown: string | null;
    has_a_load_spot_been_confirmed_with_the_ship_site: string | null;
    is_this_an_intermodal_request: string | null;
    can_this_be_intermodal: string | null;
    intermodal_im_focal_approved: string | null;
    comments: string | null;
    requestor: string | null;
    request_received_date_time: string | null;
    status: OrderStatus;
    assigned_user_id: number | null;
    assigned_user: AssignedUser | null;
    covered_carrier: string | null;
    covered_carrier_rate: string | null;
    covered_ship_date: string | null;
    covered_delivery_date: string | null;
};

const orderStatusPresentation = {
    open: { variant: 'work', label: 'Open' },
    assigned: { variant: 'progress', label: 'Assigned' },
    covered: { variant: 'done', label: 'Covered' },
    void: { variant: 'quiet', label: 'Void' },
} as const;

export const orderStatusFilterOptions = [
    { value: 'work', label: 'Open & assigned' },
    { value: 'open', label: orderStatusPresentation.open.label },
    { value: 'assigned', label: orderStatusPresentation.assigned.label },
    { value: 'covered', label: orderStatusPresentation.covered.label },
    { value: 'void', label: orderStatusPresentation.void.label },
] as const;

function orderStatusPresentationFor(status: string): {
    variant: 'work' | 'progress' | 'done' | 'quiet';
    label: string;
} {
    if (
        status === 'open' ||
        status === 'assigned' ||
        status === 'covered' ||
        status === 'void'
    ) {
        return orderStatusPresentation[status];
    }

    return { variant: 'quiet', label: status };
}

const orderStatusFilterFn = (
    row: { original: Order },
    _columnId: string,
    filterValue: unknown,
): boolean => {
    const status = row.original.status;

    if (filterValue === 'work') {
        return status === 'open' || status === 'assigned';
    }

    if (typeof filterValue !== 'string' || filterValue === '') {
        return true;
    }

    return status === filterValue;
};

const columnHelper = createColumnHelper<DataTableFeatures, Order>();

export const orderColumns = columnHelper.columns([
    columnHelper.accessor('order_number', {
        header: 'Order Number',
        enableHiding: false,
        enableColumnFilter: true,
        filterFn: 'includesString',
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        enableHiding: false,
        enableColumnFilter: true,
        filterFn: orderStatusFilterFn,
        cell: ({ getValue }) => {
            const presentation = orderStatusPresentationFor(getValue());

            return (
                <Badge variant={presentation.variant}>
                    {presentation.label}
                </Badge>
            );
        },
    }),
    columnHelper.accessor((row) => row.assigned_user?.name ?? '', {
        id: 'assignee_name',
        header: 'Assignee',
        enableColumnFilter: true,
        filterFn: includesStringNullable,
        cell: ({ getValue }) => {
            const name = getValue();

            return name === '' ? (
                <span className="text-muted-foreground">Unassigned</span>
            ) : (
                name
            );
        },
    }),
    columnHelper.accessor('no', { header: 'No.' }),
    columnHelper.accessor('plant', {
        header: 'Plant',
        enableColumnFilter: true,
        filterFn: includesStringNullable,
    }),
    columnHelper.accessor('plant_city', { header: 'Plant City' }),
    columnHelper.accessor('plant_st', { header: 'Plant State' }),
    columnHelper.accessor('campaign_id', {
        header: 'Campaign',
        cell: ({ getValue }) => {
            const campaignId = getValue();
            const label = formatOrderCampaign(campaignId);

            return (
                <span
                    className={
                        campaignId === null
                            ? 'text-muted-foreground'
                            : undefined
                    }
                >
                    {label}
                </span>
            );
        },
    }),
    columnHelper.accessor('gmid_product', { header: 'Product' }),
    columnHelper.accessor('orig_delivery_qty', {
        header: 'Original Delivery Quantity',
    }),
    columnHelper.accessor('shipment_type', { header: 'Shipment Type' }),
    columnHelper.accessor('orig_ship_date', { header: 'Original Ship Date' }),
    columnHelper.accessor('orig_del_date', {
        header: 'Original Delivery Date',
    }),
    columnHelper.accessor('del_time', { header: 'Delivery Time' }),
    columnHelper.accessor('customer_ship_to_name_and_location', {
        header: 'Customer Ship-To Name and Location',
    }),
    columnHelper.accessor('business', { header: 'Business' }),
    columnHelper.accessor('notes', { header: 'Notes' }),
    columnHelper.accessor('trailer_type', { header: 'Trailer Type' }),
    columnHelper.accessor('length_of_hose', { header: 'Length of Hose' }),
    columnHelper.accessor('fitting_type_size', {
        header: 'Fitting Type and Size',
    }),
    columnHelper.accessor('offload_method', { header: 'Offload Method' }),
    columnHelper.accessor('documents_needed', { header: 'Documents Needed' }),
    columnHelper.accessor('special_requirements', {
        header: 'Special Requirements',
    }),
    columnHelper.accessor('incumbent_carrier', { header: 'Incumbent Carrier' }),
    columnHelper.accessor('incumbent_best_case', {
        header: 'Incumbent Best Case',
    }),
    columnHelper.accessor('overflow_request_reason', {
        header: 'Request Reason',
    }),
    columnHelper.accessor('is_this_a_shutdown', {
        header: 'Is This a Shutdown?',
    }),
    columnHelper.accessor('has_a_load_spot_been_confirmed_with_the_ship_site', {
        header: 'Load Spot Confirmed with Ship Site?',
    }),
    columnHelper.accessor('is_this_an_intermodal_request', {
        header: 'Is This an Intermodal Request?',
    }),
    columnHelper.accessor('can_this_be_intermodal', {
        header: 'Can This Be Intermodal?',
    }),
    columnHelper.accessor('intermodal_im_focal_approved', {
        header: 'Review Notes',
    }),
    columnHelper.accessor('comments', { header: 'Comments' }),
    columnHelper.accessor('requestor', { header: 'Requestor' }),
    columnHelper.accessor('covered_carrier', { header: 'Covered Carrier' }),
    columnHelper.accessor('covered_carrier_rate', {
        header: 'Covered Carrier Rate',
    }),
    columnHelper.accessor('covered_ship_date', { header: 'Covered Ship Date' }),
    columnHelper.accessor('covered_delivery_date', {
        header: 'Covered Delivery Date',
    }),
    columnHelper.accessor('request_received_date_time', {
        header: 'Request Received Date/Time',
    }),
]);
