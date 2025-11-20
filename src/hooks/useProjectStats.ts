"use client";

import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { usePublicClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';

const STATS_QUERY = gql`
  query ProjectStats($projectId: ID!) {
    project(id: $projectId) {
      currentBalance
      totalPaid
      paymentCount
      volume
      contributorsCount
      createdAt
    }
  }
`;

export interface ProjectStats {
    balance: number;
    volume: number;
    payments: number;
    contributors: number;
    backingRatio: number;
}

export function useProjectStats() {
    const publicClient = usePublicClient({ chainId: sepolia.id });

    return useQuery({
        queryKey: ['projectStats'],
        queryFn: async (): Promise<ProjectStats> => {
            const projectId = process.env.NEXT_PUBLIC_JB_PROJECT_ID;
            const subgraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

            // Return mock data if subgraph is not available
            if (!projectId || !subgraphUrl) {
                console.warn('Missing env vars, returning default stats');
                return {
                    balance: 0,
                    volume: 0,
                    payments: 0,
                    contributors: 0,
                    backingRatio: 0
                };
            }

            try {
                // Try multiple ID formats
                const idFormats = [
                    `2-${projectId}`,  // V3 format
                    `5-${projectId}`,  // V5 format
                    projectId,         // Plain ID
                ];

                let project = null;

                // Try each format until we find data
                for (const graphId of idFormats) {
                    try {
                        const data: any = await request(subgraphUrl, STATS_QUERY, { projectId: graphId });
                        if (data?.project) {
                            project = data.project;
                            console.log(`Found project with ID format: ${graphId}`);
                            break;
                        }
                    } catch (err) {
                        console.log(`Failed to fetch with ID: ${graphId}`);
                    }
                }

                if (!project) {
                    console.warn(`Project not found in subgraph with any ID format. Returning defaults.`);
                    // Return default values instead of throwing
                    return {
                        balance: 0,
                        volume: 0,
                        payments: 0,
                        contributors: 0,
                        backingRatio: 0
                    };
                }

                const balanceEth = parseFloat(project.currentBalance || '0') / 1e18;
                const volumeEth = parseFloat(project.volume || project.totalPaid || '0') / 1e18;

                // Estimate supply based on volume with 1000 tokens per ETH mint rate
                const estimatedSupply = volumeEth * 1000;

                return {
                    balance: balanceEth,
                    volume: volumeEth,
                    payments: parseInt(project.paymentCount || '0'),
                    contributors: parseInt(project.contributorsCount || '0'),
                    backingRatio: estimatedSupply > 0 ? balanceEth / estimatedSupply : 0,
                };
            } catch (error) {
                console.error('Error fetching project stats:', error);
                // Return defaults instead of throwing
                return {
                    balance: 0,
                    volume: 0,
                    payments: 0,
                    contributors: 0,
                    backingRatio: 0
                };
            }
        },
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000,
        retry: 3, // Retry failed requests
    });
}
