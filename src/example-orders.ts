import type {
    CampaignOption,
    UserOption,
} from '@/components/order-edit-drawer';
import type { Order } from '@/components/orders/order-table-columns';

export const campaigns: CampaignOption[] = [
    { id: 1, name: 'Example campaign', status: 'active' },
];

export const users: UserOption[] = [
    { id: 1, name: 'Example Assignee', email: 'assignee@example.test' },
];

function order(id: number, orderNumber: string): Order {
    return {
        id,
        order_number: orderNumber,
        no: '001',
        plant: 'P100',
        plant_city: '',
        plant_st: '',
        campaign_id: 1,
        gmid_product: '000000001234567890 / Example product',
        orig_delivery_qty: '45000 lbs',
        shipment_type: 'Truck',
        orig_ship_date: '2026-09-02',
        orig_del_date: '2026-09-03',
        del_time: '08:00',
        customer_ship_to_name_and_location: '',
        business: 'Example Business',
        notes: '',
        trailer_type: 'Rear unload',
        length_of_hose: '40ft',
        fitting_type_size: 'Male 3 inch camlock',
        offload_method: 'Truck air',
        documents_needed: 'COA, BOL, wash ticket',
        special_requirements: 'Keep product above 60F.',
        incumbent_carrier: 'Example Transport',
        incumbent_best_case: '2450',
        overflow_request_reason: 'Incumbent declined due to capacity.',
        is_this_a_shutdown: 'No',
        has_a_load_spot_been_confirmed_with_the_ship_site: 'Yes',
        is_this_an_intermodal_request: 'No',
        can_this_be_intermodal: 'Yes',
        intermodal_im_focal_approved: 'Yes',
        comments: 'Need coverage confirmed by end of day.',
        requestor: '',
        request_received_date_time: '2026-08-26',
        status: 'assigned',
        assigned_user_id: null,
        assigned_user: null,
        covered_carrier: null,
        covered_carrier_rate: null,
        covered_ship_date: null,
        covered_delivery_date: null,
    };
}

export const orders: Order[] = [order(1, 'EX-1001'), order(2, 'EX-1002')];
