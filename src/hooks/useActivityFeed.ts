"use client";

import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { Transaction } from '@/data/mockTransactions';

const ACTIVITY_QUERY = gql`
  query ProjectActivity($projectId: ID!, $first: Int!) {
    payEvents(
      where: { project: $projectId }
      orderBy: timestamp
      orderDirection: desc
      first: $first
    ) {
      id
      amount
      beneficiary
      caller
      memo
      timestamp
      txHash
    }
  }
`;

export function useActivityFeed(maxItems: number = 15) {
    return useQuery({
        queryKey: ['activityFeed', maxItems],
        queryFn: async (): Promise<Transaction[]> => {
            const projectId = process.env.NEXT_PUBLIC_JB_PROJECT_ID;
            const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

            if (!projectId || !subgraphUrl) {
                console.warn('Missing environment variables for activity feed');
                return [];
            }

            try {
                // Try multiple ID formats
                const idFormats = [
                    `2-${projectId}`,  // V3 format
                    `5-${projectId}`,  // V5 format  
                    projectId,         // Plain ID
                ];

                let payEvents = [];

                // Try each format until we get data
                for (const graphId of idFormats) {
                    try {
                        const data: any = await request(subgraphUrl, ACTIVITY_QUERY, {
                            projectId: graphId,
                            first: maxItems
                        });

                        if (data?.payEvents && data.payEvents.length > 0) {
                            payEvents = data.payEvents;
                            console.log(`Found activity with ID format: ${graphId}`);
                            break;
                        }
                    } catch (err) {
                        console.log(`Failed to fetch activity with ID: ${graphId}`);
                    }
                }

                if (payEvents.length === 0) {
                    console.warn('No payment events found in subgraph');
                    return [];
                }

                // Transform to Transaction format
                return payEvents.map((event: any, index: number) => {
                    const amountEth = parseFloat(event.amount) / 1e18;
                    // Estimate tokens received (assuming 1000 tokens per ETH)
                    const tokensReceived = Math.floor(amountEth * 1000);

                    // Try to extract ENS or use truncated address
                    const userAddress = event.beneficiary || event.caller;
                    const truncatedAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

                    return {
                        id: event.id || `tx-${index}`,
                        type: 'mint' as const,
                        user: truncatedAddress,
                        userAddress: userAddress,
                        amount: tokensReceived,
                        token: 'ZINE' as const,
                        timestamp: parseInt(event.timestamp) * 1000, // Convert to milliseconds
                        txHash: event.txHash,
                        note: event.memo || undefined,
                    };
                });
            } catch (error) {
                console.error('Error fetching activity feed:', error);
                return [];
            }
        },
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000,
        retry: 3,
    });
}
