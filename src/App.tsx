import { useState } from 'react';

import { OrderEditDrawer } from '@/components/order-edit-drawer';
import type { Order } from '@/components/orders/order-table-columns';
import { OrdersTable } from '@/components/orders/orders-table';
import { campaigns, orders, users } from '@/example-orders';

function readStep(): 1 | 2 {
    const saved = document.cookie
        .split('; ')
        .some((part) => part === 'repro_step=2');

    return saved ? 2 : 1;
}

function startOver() {
    document.cookie = 'repro_step=; Path=/; Max-Age=0';
    window.location.assign(import.meta.env.BASE_URL);
}

export default function App() {
    const step = readStep();
    const initialOrder = orders[step - 1] ?? orders[0] ?? null;
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(
        initialOrder,
    );

    return (
        <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
                {step === 1
                    ? 'Order EX-1001 is open. Type a city and a ship-to, then Save order. The browser keeps those values for the next form.'
                    : 'Order EX-1002 is open. Focus Plant city. Hover the suggestion saved from EX-1001. Do not click it and do not save.'}{' '}
                <button
                    type="button"
                    className="underline underline-offset-2"
                    onClick={startOver}
                >
                    Start over
                </button>
            </p>
            <OrdersTable
                data={orders}
                onRowClick={setSelectedOrder}
                emptyMessage="No example orders."
            />
            {selectedOrder && (
                <OrderEditDrawer
                    key={selectedOrder.id}
                    order={selectedOrder}
                    campaigns={campaigns}
                    users={users}
                    submitUrl={import.meta.env.BASE_URL}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedOrder(null);
                        }
                    }}
                />
            )}
        </main>
    );
}
