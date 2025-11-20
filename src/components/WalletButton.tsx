"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletButton() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                return (
                    <div
                        {...(!ready && {
                            "aria-hidden": true,
                            style: {
                                opacity: 0,
                                pointerEvents: "none",
                                userSelect: "none",
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="bg-flexoki-bg-200 text-flexoki-bg-900 px-4 py-2 font-mono text-sm uppercase tracking-wider hover:bg-flexoki-green hover:text-flexoki-bg transition-colors border border-flexoki-bg-800"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="bg-flexoki-red text-white px-4 py-2 font-mono text-sm uppercase tracking-wider border border-flexoki-red"
                                    >
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <div className="flex gap-3">
                                    <button
                                        onClick={openChainModal}
                                        style={{ display: "flex", alignItems: "center" }}
                                        type="button"
                                        className="bg-flexoki-bg-800 text-flexoki-tx-50 px-3 py-2 font-mono text-xs uppercase tracking-wider border border-flexoki-bg-200 hover:border-flexoki-green transition-colors"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: 999,
                                                    overflow: "hidden",
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? "Chain icon"}
                                                        src={chain.iconUrl}
                                                        style={{ width: 12, height: 12 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>

                                    <button
                                        onClick={openAccountModal}
                                        type="button"
                                        className="bg-flexoki-bg-800 text-flexoki-tx-50 px-3 py-2 font-mono text-xs uppercase tracking-wider border border-flexoki-bg-200 hover:border-flexoki-green transition-colors"
                                    >
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ""}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
