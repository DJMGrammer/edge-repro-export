import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import type {
    Order,
    OrderStatus,
} from '@/components/orders/order-table-columns';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type CampaignOption = {
    id: number;
    name: string;
    status: string;
};

export type UserOption = {
    id: number;
    name: string;
    email: string;
};

type StringFormKey = Exclude<
    keyof Order,
    | 'id'
    | 'order_number'
    | 'assigned_user'
    | 'status'
    | 'assigned_user_id'
    | 'campaign_id'
    | 'covered_ship_date'
    | 'covered_delivery_date'
>;

type OrderFormData = Record<StringFormKey, string> & {
    status: OrderStatus;
    assignee: string;
    campaign_id: number | null;
    covered_ship_date: string | null;
    covered_delivery_date: string | null;
};

type OrderField = {
    name: keyof OrderFormData;
    label: string;
    kind?: 'input' | 'textarea' | 'date' | 'status' | 'user' | 'campaign';
    span?: 'wide' | 'full';
};

type OrderSection = {
    title: string;
    description: string;
    fields: OrderField[];
};

const sections: OrderSection[] = [
    {
        title: 'Work',
        description: 'Status, assignee, and coverage details.',
        fields: [
            { name: 'status', label: 'Status', kind: 'status' },
            { name: 'assignee', label: 'Assignee', kind: 'user' },
            { name: 'covered_carrier', label: 'Covered carrier' },
            { name: 'covered_carrier_rate', label: 'Covered carrier rate' },
            {
                name: 'covered_ship_date',
                label: 'Covered ship date',
                kind: 'date',
            },
            {
                name: 'covered_delivery_date',
                label: 'Covered delivery date',
                kind: 'date',
            },
        ],
    },
    {
        title: 'Order details',
        description: 'Identifiers, product, quantity, and campaign assignment.',
        fields: [
            { name: 'no', label: 'Line number' },
            { name: 'business', label: 'Business' },
            { name: 'campaign_id', label: 'Campaign', kind: 'campaign' },
            {
                name: 'gmid_product',
                label: 'Product',
                span: 'wide',
            },
            { name: 'orig_delivery_qty', label: 'Original delivery quantity' },
            { name: 'shipment_type', label: 'Shipment type' },
        ],
    },
    {
        title: 'Locations and schedule',
        description: 'Origin, destination, and requested shipment timing.',
        fields: [
            { name: 'plant', label: 'Plant', span: 'wide' },
            { name: 'plant_city', label: 'Plant city' },
            { name: 'plant_st', label: 'Plant state' },
            {
                name: 'customer_ship_to_name_and_location',
                label: 'Customer ship-to name and location',
                kind: 'textarea',
                span: 'full',
            },
            { name: 'orig_ship_date', label: 'Original ship date' },
            { name: 'orig_del_date', label: 'Original delivery date' },
            { name: 'del_time', label: 'Delivery time' },
            {
                name: 'request_received_date_time',
                label: 'Request received date/time',
            },
        ],
    },
    {
        title: 'Equipment and delivery requirements',
        description:
            'Equipment, unloading, documentation, and site requirements.',
        fields: [
            { name: 'trailer_type', label: 'Trailer type' },
            { name: 'length_of_hose', label: 'Length of hose' },
            {
                name: 'fitting_type_size',
                label: 'Fitting type and size',
                span: 'wide',
            },
            { name: 'offload_method', label: 'Offload method' },
            { name: 'documents_needed', label: 'Documents needed' },
            {
                name: 'special_requirements',
                label: 'Special requirements',
                kind: 'textarea',
                span: 'full',
            },
        ],
    },
    {
        title: 'Request details',
        description: 'Carrier, shutdown, and intermodal information.',
        fields: [
            { name: 'incumbent_carrier', label: 'Incumbent carrier' },
            { name: 'incumbent_best_case', label: 'Incumbent best case' },
            {
                name: 'overflow_request_reason',
                label: 'Request reason',
                kind: 'textarea',
                span: 'full',
            },
            { name: 'is_this_a_shutdown', label: 'Is this a shutdown?' },
            {
                name: 'has_a_load_spot_been_confirmed_with_the_ship_site',
                label: 'Load spot confirmed with ship site?',
            },
            {
                name: 'is_this_an_intermodal_request',
                label: 'Is this an intermodal request?',
            },
            {
                name: 'can_this_be_intermodal',
                label: 'Can this be intermodal?',
            },
            {
                name: 'intermodal_im_focal_approved',
                label: 'Review notes',
                kind: 'textarea',
                span: 'full',
            },
        ],
    },
    {
        title: 'Additional information',
        description: 'Requestor notes and supporting comments.',
        fields: [
            {
                name: 'requestor',
                label: 'Requestor',
                span: 'wide',
            },
            {
                name: 'notes',
                label: 'Notes',
                kind: 'textarea',
                span: 'full',
            },
            {
                name: 'comments',
                label: 'Comments',
                kind: 'textarea',
                span: 'full',
            },
        ],
    },
];

const statusLabels: Record<OrderStatus, string> = {
    open: 'Open',
    assigned: 'Assigned',
    covered: 'Covered',
    void: 'Void',
};

function allowedStatusOptions(status: OrderStatus): OrderStatus[] {
    switch (status) {
        case 'open':
            return ['open', 'assigned', 'void'];
        case 'assigned':
            return ['assigned', 'open', 'covered', 'void'];
        case 'covered':
            return ['covered'];
        case 'void':
            return ['void'];
    }
}

const toInputValue = (value: string | number | boolean | null) =>
    value === null ? '' : String(value);

function toDateInputValue(value: string | null): string | null {
    if (value === null || value === '') {
        return null;
    }

    return value.slice(0, 10);
}

function toFormData(order: Order): OrderFormData {
    return {
        status: order.status,
        assignee: order.assigned_user?.name ?? '',
        campaign_id: order.campaign_id,
        covered_carrier: toInputValue(order.covered_carrier),
        covered_carrier_rate: toInputValue(order.covered_carrier_rate),
        covered_ship_date: toDateInputValue(order.covered_ship_date),
        covered_delivery_date: toDateInputValue(order.covered_delivery_date),
        no: toInputValue(order.no),
        plant: toInputValue(order.plant),
        plant_city: toInputValue(order.plant_city),
        plant_st: toInputValue(order.plant_st),
        gmid_product: toInputValue(order.gmid_product),
        orig_delivery_qty: toInputValue(order.orig_delivery_qty),
        shipment_type: toInputValue(order.shipment_type),
        orig_ship_date: toInputValue(order.orig_ship_date),
        orig_del_date: toInputValue(order.orig_del_date),
        del_time: toInputValue(order.del_time),
        customer_ship_to_name_and_location: toInputValue(
            order.customer_ship_to_name_and_location,
        ),
        business: toInputValue(order.business),
        notes: toInputValue(order.notes),
        trailer_type: toInputValue(order.trailer_type),
        length_of_hose: toInputValue(order.length_of_hose),
        fitting_type_size: toInputValue(order.fitting_type_size),
        offload_method: toInputValue(order.offload_method),
        documents_needed: toInputValue(order.documents_needed),
        special_requirements: toInputValue(order.special_requirements),
        incumbent_carrier: toInputValue(order.incumbent_carrier),
        incumbent_best_case: toInputValue(order.incumbent_best_case),
        overflow_request_reason: toInputValue(order.overflow_request_reason),
        is_this_a_shutdown: toInputValue(order.is_this_a_shutdown),
        has_a_load_spot_been_confirmed_with_the_ship_site: toInputValue(
            order.has_a_load_spot_been_confirmed_with_the_ship_site,
        ),
        is_this_an_intermodal_request: toInputValue(
            order.is_this_an_intermodal_request,
        ),
        can_this_be_intermodal: toInputValue(order.can_this_be_intermodal),
        intermodal_im_focal_approved: toInputValue(
            order.intermodal_im_focal_approved,
        ),
        comments: toInputValue(order.comments),
        requestor: toInputValue(order.requestor),
        request_received_date_time: toInputValue(
            order.request_received_date_time,
        ),
    };
}

function serializeOrderForm(data: OrderFormData): OrderFormData {
    return {
        ...data,
        covered_ship_date:
            data.covered_ship_date === '' ? null : data.covered_ship_date,
        covered_delivery_date:
            data.covered_delivery_date === ''
                ? null
                : data.covered_delivery_date,
    };
}

const orderSelectClassName =
    'h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive';

function selectValue(value: number | null): string {
    return value === null ? '' : String(value);
}

function Section({
    section,
    data,
    errors,
    campaigns,
    persistedStatus,
    currentCampaignIsArchived,
    onChange,
}: {
    section: OrderSection;
    data: OrderFormData;
    errors: Partial<Record<keyof OrderFormData | 'assigned_user_id', string>>;
    campaigns: CampaignOption[];
    persistedStatus: OrderStatus;
    currentCampaignIsArchived: boolean;
    onChange: <K extends keyof OrderFormData>(
        name: K,
        value: OrderFormData[K],
    ) => void;
}) {
    const statusNeedsUser =
        data.status === 'assigned' || data.status === 'covered';
    const coverageRequired = data.status === 'covered';

    return (
        <section className="grid gap-4 border-b pb-6 last:border-b-0 @lg:grid-cols-[14rem_minmax(0,1fr)]">
            <div>
                <h2 className="font-heading text-base font-semibold">
                    {section.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {section.description}
                </p>
            </div>
            <div className="grid gap-3 @md:grid-cols-2 @xl:grid-cols-3">
                {section.fields.map((field) => {
                    const id = `order-${field.name}`;
                    const error =
                        errors[field.name] ??
                        (field.name === 'assignee'
                            ? errors.assigned_user_id
                            : undefined);
                    const kind = field.kind ?? 'input';

                    return (
                        <Field
                            key={field.name}
                            data-invalid={Boolean(error)}
                            className={cn(
                                field.span === 'wide' &&
                                    '@md:col-span-2 @xl:col-span-2',
                                field.span === 'full' &&
                                    '@md:col-span-2 @xl:col-span-3',
                            )}
                        >
                            <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
                            {kind === 'campaign' ? (
                                <>
                                    <select
                                        id={id}
                                        value={selectValue(data.campaign_id)}
                                        disabled={currentCampaignIsArchived}
                                        aria-invalid={Boolean(error)}
                                        onChange={(event) =>
                                            onChange(
                                                'campaign_id',
                                                event.target.value === ''
                                                    ? null
                                                    : Number(
                                                          event.target.value,
                                                      ),
                                            )
                                        }
                                        className={orderSelectClassName}
                                    >
                                        <option value="">No campaign</option>
                                        {campaigns.map((campaign) => (
                                            <option
                                                key={campaign.id}
                                                value={campaign.id}
                                                disabled={
                                                    campaign.status ===
                                                        'archived' &&
                                                    campaign.id !==
                                                        data.campaign_id
                                                }
                                            >
                                                {campaign.name}
                                                {campaign.status === 'archived'
                                                    ? ' (archived)'
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {currentCampaignIsArchived && (
                                        <FieldDescription>
                                            Archived campaign assignments are
                                            read-only.
                                        </FieldDescription>
                                    )}
                                </>
                            ) : kind === 'status' ? (
                                <select
                                    id={id}
                                    value={data.status}
                                    disabled={currentCampaignIsArchived}
                                    aria-invalid={Boolean(error)}
                                    onChange={(event) =>
                                        onChange(
                                            'status',
                                            event.target.value as OrderStatus,
                                        )
                                    }
                                    className={orderSelectClassName}
                                >
                                    {allowedStatusOptions(persistedStatus).map(
                                        (status) => (
                                            <option key={status} value={status}>
                                                {statusLabels[status]}
                                            </option>
                                        ),
                                    )}
                                </select>
                            ) : kind === 'user' ? (
                                <>
                                    <Input
                                        id={id}
                                        value={data.assignee}
                                        disabled={
                                            currentCampaignIsArchived ||
                                            !statusNeedsUser
                                        }
                                        placeholder="Type a name..."
                                        aria-invalid={Boolean(error)}
                                        onChange={(event) =>
                                            onChange(
                                                'assignee',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {statusNeedsUser && (
                                        <FieldDescription>
                                            Assigned and covered orders need an
                                            assignee.
                                        </FieldDescription>
                                    )}
                                </>
                            ) : kind === 'date' ? (
                                <>
                                    <Input
                                        id={id}
                                        type="date"
                                        value={data[field.name] ?? ''}
                                        disabled={currentCampaignIsArchived}
                                        aria-invalid={Boolean(error)}
                                        onChange={(event) =>
                                            onChange(
                                                field.name,
                                                event.target.value === ''
                                                    ? null
                                                    : event.target.value,
                                            )
                                        }
                                    />
                                    {coverageRequired && (
                                        <FieldDescription>
                                            Required to cover this order.
                                        </FieldDescription>
                                    )}
                                </>
                            ) : kind === 'textarea' ? (
                                <Textarea
                                    id={id}
                                    value={String(data[field.name] ?? '')}
                                    disabled={currentCampaignIsArchived}
                                    aria-invalid={Boolean(error)}
                                    onChange={(event) =>
                                        onChange(field.name, event.target.value)
                                    }
                                />
                            ) : (
                                <>
                                    <Input
                                        id={id}
                                        value={String(data[field.name] ?? '')}
                                        disabled={currentCampaignIsArchived}
                                        aria-invalid={Boolean(error)}
                                        onChange={(event) =>
                                            onChange(
                                                field.name,
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {coverageRequired &&
                                        (field.name === 'covered_carrier' ||
                                            field.name ===
                                                'covered_carrier_rate') && (
                                            <FieldDescription>
                                                Required to cover this order.
                                            </FieldDescription>
                                        )}
                                </>
                            )}
                            <FieldError>{error}</FieldError>
                        </Field>
                    );
                })}
            </div>
        </section>
    );
}

function useLocalOrderForm(initial: OrderFormData) {
    const [data, setData] = useState(initial);
    const [processing, setProcessing] = useState(false);
    const transformRef = useRef<(value: OrderFormData) => OrderFormData>(
        (value) => value,
    );
    const isDirty = JSON.stringify(data) !== JSON.stringify(initial);

    return {
        data,
        setData,
        isDirty,
        processing,
        errors: {} as Partial<Record<keyof OrderFormData, string>>,
        transform(fn: (value: OrderFormData) => OrderFormData) {
            transformRef.current = fn;
        },
        async patch(url: string) {
            setProcessing(true);

            try {
                await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        Accept: 'text/html',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify(transformRef.current(data)),
                    credentials: 'same-origin',
                });
            } catch {
                setProcessing(false);

                return;
            }

            window.location.assign(import.meta.env.BASE_URL);
        },
    };
}

export function confirmDiscardOrderEdits(isDirty: boolean): boolean {
    if (!isDirty) {
        return true;
    }

    return window.confirm('Discard your unsaved changes to this order?');
}

export function OrderEditForm({
    order,
    campaigns,
    onCancel,
    onDirtyChange,
    submitUrl,
}: {
    order: Order;
    campaigns: CampaignOption[];
    users?: UserOption[];
    onCancel: () => void;
    onSuccess: () => void;
    onDirtyChange?: (isDirty: boolean) => void;
    preserveState?: boolean;
    submitUrl?: string;
}) {
    const form = useLocalOrderForm(toFormData(order));
    const currentCampaign = campaigns.find(
        (campaign) => campaign.id === order.campaign_id,
    );
    const currentCampaignIsArchived = currentCampaign?.status === 'archived';

    useEffect(() => {
        onDirtyChange?.(form.isDirty);
    }, [form.isDirty, onDirtyChange]);

    function requestCancel() {
        if (!confirmDiscardOrderEdits(form.isDirty)) {
            return;
        }

        onCancel();
    }

    function setField<K extends keyof OrderFormData>(
        name: K,
        value: OrderFormData[K],
    ) {
        if (name === 'status' && (value === 'open' || value === 'void')) {
            form.setData({
                ...form.data,
                status: value,
                assignee: '',
            });

            return;
        }

        form.setData({
            ...form.data,
            [name]: value,
        });
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform((data) => serializeOrderForm(data));
        void form.patch(submitUrl ?? import.meta.env.BASE_URL);
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
                <form
                    id="order-edit-form"
                    onSubmit={submit}
                    className="w-full space-y-6 px-5 py-4"
                >
                    {currentCampaignIsArchived && (
                        <div
                            role="status"
                            className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm"
                        >
                            This campaign is archived. The order is read-only.
                        </div>
                    )}

                    {Object.keys(form.errors).length > 0 && (
                        <div
                            role="alert"
                            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        >
                            Review the highlighted fields before saving.
                        </div>
                    )}

                    {sections.map((section) => (
                        <Section
                            key={section.title}
                            section={section}
                            data={form.data}
                            errors={form.errors}
                            campaigns={campaigns}
                            persistedStatus={order.status}
                            currentCampaignIsArchived={
                                currentCampaignIsArchived
                            }
                            onChange={setField}
                        />
                    ))}
                </form>
            </div>

            <div className="border-t bg-background">
                <div className="flex w-full flex-col-reverse gap-2 px-5 py-3 @sm:flex-row @sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={form.processing}
                        onClick={requestCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="order-edit-form"
                        disabled={
                            form.processing ||
                            !form.isDirty ||
                            currentCampaignIsArchived
                        }
                    >
                        {form.processing && <Spinner />}
                        Save order
                    </Button>
                </div>
            </div>
        </div>
    );
}
