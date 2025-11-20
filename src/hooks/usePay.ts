"use client";

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { JB_ETH_PAYMENT_TERMINAL_ABI, JB_TOKEN_ETH, getTerminalAddress, getProjectId } from '@/contracts/juicebox';

export function usePay() {
    const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash
    });

    const pay = async (amountEth: string, beneficiary: string, memo: string = "") => {
        if (!amountEth || !beneficiary) {
            console.error("Missing required parameters for pay");
            return;
        }

        try {
            const projectId = getProjectId();
            const terminalAddress = getTerminalAddress();

            writeContract({
                address: terminalAddress,
                abi: JB_ETH_PAYMENT_TERMINAL_ABI,
                functionName: 'pay',
                args: [
                    projectId, // Project ID
                    parseEther(amountEth), // Amount in Wei
                    JB_TOKEN_ETH, // Token (ETH)
                    beneficiary as `0x${string}`, // Beneficiary
                    BigInt(0), // Min returned tokens (0 allows slippage)
                    false, // Prefer claimed tokens
                    memo, // Memo
                    '0x', // Metadata
                ],
                value: parseEther(amountEth), // Value sent
                gas: BigInt(500000), // Manual gas limit to avoid estimation issues
            });
        } catch (err) {
            console.error("Payment failed", err);
        }
    };

    return {
        pay,
        isPending: isPending || isConfirming,
        isSuccess,
        hash,
        error: writeError
    };
}
