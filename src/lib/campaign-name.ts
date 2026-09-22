export function formatCampaignName(id: number): string {
    return `Campaign ${id}`;
}

export function formatOrderCampaign(campaignId: number | null): string {
    if (campaignId === null) {
        return 'Unassigned';
    }

    return formatCampaignName(campaignId);
}
