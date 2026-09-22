import { createAtom } from '@tanstack/react-store';
import type {
    ColumnFiltersState,
    ColumnVisibilityState,
} from '@tanstack/react-table';

export const orderColumnFiltersAtom = createAtom<ColumnFiltersState>([
    { id: 'status', value: 'work' },
]);

export const queueOrderColumnFiltersAtom = createAtom<ColumnFiltersState>([]);

export const orderColumnVisibilityAtom = createAtom<ColumnVisibilityState>({
    no: false,
    plant_st: false,
    gmid_product: false,
    orig_delivery_qty: false,
    del_time: false,
    customer_ship_to_name_and_location: false,
    business: false,
    trailer_type: false,
    length_of_hose: false,
    fitting_type_size: false,
    offload_method: false,
    documents_needed: false,
    special_requirements: false,
    incumbent_carrier: false,
    incumbent_best_case: false,
    overflow_request_reason: false,
    is_this_a_shutdown: false,
    has_a_load_spot_been_confirmed_with_the_ship_site: false,
    is_this_an_intermodal_request: false,
    can_this_be_intermodal: false,
    intermodal_im_focal_approved: false,
    requestor: false,
    request_received_date_time: false,
    covered_carrier: false,
    covered_carrier_rate: false,
    covered_ship_date: false,
    covered_delivery_date: false,
});
