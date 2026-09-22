import { XIcon } from 'lucide-react';
import { useState } from 'react';

import {
    confirmDiscardOrderEdits,
    OrderEditForm,
} from '@/components/orders/order-edit-form';
import type {
    CampaignOption,
    UserOption,
} from '@/components/orders/order-edit-form';
import type { Order } from '@/components/orders/order-table-columns';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

export type { CampaignOption, UserOption };

export function OrderEditDrawer({
    order,
    campaigns,
    users,
    onOpenChange,
    submitUrl,
}: {
    order: Order;
    campaigns: CampaignOption[];
    users: UserOption[];
    onOpenChange: (open: boolean) => void;
    submitUrl?: string;
}) {
    const [formIsDirty, setFormIsDirty] = useState(false);

    function requestOpenChange(open: boolean) {
        if (!open && !confirmDiscardOrderEdits(formIsDirty)) {
            return;
        }

        onOpenChange(open);
    }

    return (
        <Drawer
            open
            showSwipeHandle
            swipeDirection="left"
            onOpenChange={requestOpenChange}
        >
            <DrawerContent>
                <DrawerHeader className="border-b p-0">
                    <div className="relative w-full px-5 py-4 pr-14">
                        <DrawerTitle>
                            Edit order {order.order_number}
                        </DrawerTitle>
                        <DrawerClose
                            render={
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="absolute top-4 right-5"
                                />
                            }
                        >
                            <XIcon />
                            <span className="sr-only">Close</span>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <OrderEditForm
                    order={order}
                    campaigns={campaigns}
                    users={users}
                    onCancel={() => onOpenChange(false)}
                    onSuccess={() => onOpenChange(false)}
                    onDirtyChange={setFormIsDirty}
                    submitUrl={submitUrl}
                />
            </DrawerContent>
        </Drawer>
    );
}
