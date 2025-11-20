"use client";
import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { X, Flame, Zap, MapPin, Clock } from "lucide-react";
import { Zine } from "@/data/mockZines";
import { useAccount } from "wagmi";

interface BuyZineModalProps {
    zine: Zine | null;
    isOpen: boolean;
    onClose: () => void;
}

export function BuyZineModal({ zine, isOpen, onClose }: BuyZineModalProps) {
    const { isConnected } = useAccount();
    const [paymentMethod, setPaymentMethod] = useState<"zine" | "eth">("zine");
    const [shippingAddress, setShippingAddress] = useState("");

    if (!zine) return null;

    const handlePurchase = () => {
        console.log("Purchasing", zine.title, "with", paymentMethod);
        console.log("Shipping to:", shippingAddress);
        onClose();
    };

    // Mock print node assignment
    const printNode = "São Paulo, Brazil";
    const estimatedDelivery = "5-7 business days";

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-flexoki-tx/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden bg-flexoki-bg border-4 border-flexoki-tx p-6 shadow-2xl transition-all">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <Dialog.Title className="font-serif text-3xl font-bold text-flexoki-tx">
                                        Purchase Zine
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-flexoki-tx/60 hover:text-flexoki-tx transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Left: Zine Preview */}
                                    <div className="space-y-4">
                                        <div className="relative aspect-[3/4] border-2 border-flexoki-tx">
                                            <Image
                                                src={zine.coverImage}
                                                alt={zine.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl font-bold text-flexoki-tx">
                                                {zine.title}
                                            </h3>
                                            <p className="font-mono text-sm text-flexoki-tx/60">
                                                Issue #{zine.issueNumber.toString().padStart(2, "0")}
                                            </p>
                                            <p className="text-sm text-flexoki-tx/80 mt-2">
                                                {zine.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Purchase Form */}
                                    <div className="space-y-4">
                                        {/* Payment Method */}
                                        <div className="space-y-2">
                                            <label className="font-mono text-xs uppercase text-flexoki-tx/60">
                                                Payment Method
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setPaymentMethod("zine")}
                                                    className={`p-3 border-2 font-mono text-sm transition-colors ${paymentMethod === "zine"
                                                        ? "bg-flexoki-green text-flexoki-bg border-flexoki-green"
                                                        : "bg-flexoki-bg-200 text-flexoki-tx border-flexoki-tx/20 hover:border-flexoki-green"
                                                        }`}
                                                >
                                                    Pay with $ZINE
                                                </button>
                                                <button
                                                    onClick={() => setPaymentMethod("eth")}
                                                    className={`p-3 border-2 font-mono text-sm transition-colors ${paymentMethod === "eth"
                                                        ? "bg-flexoki-cyan text-flexoki-bg border-flexoki-cyan"
                                                        : "bg-flexoki-bg-200 text-flexoki-tx border-flexoki-tx/20 hover:border-flexoki-cyan"
                                                        }`}
                                                >
                                                    Pay with ETH
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="p-4 bg-flexoki-bg-200 space-y-2">
                                            <div className="flex justify-between font-mono text-sm">
                                                <span className="text-flexoki-tx/60">Zine Price</span>
                                                <span className="text-flexoki-tx font-bold">
                                                    {paymentMethod === "zine"
                                                        ? `${zine.priceInZine} $ZINE`
                                                        : `${zine.priceInEth} ETH`}
                                                </span>
                                            </div>
                                            {paymentMethod === "zine" && (
                                                <div className="flex justify-between font-mono text-xs">
                                                    <span className="text-flexoki-tx/60">≈ ETH</span>
                                                    <span className="text-flexoki-tx/60">{zine.priceInEth} ETH</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-mono text-xs">
                                                <span className="text-flexoki-tx/60">Gas (est.)</span>
                                                <span className="text-flexoki-tx/60">~0.002 ETH</span>
                                            </div>
                                        </div>

                                        {/* Burn Notice */}
                                        {paymentMethod === "zine" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-flexoki-red/10 border border-flexoki-red p-3 rounded-sm"
                                            >
                                                <p className="font-mono text-xs text-flexoki-red flex items-center gap-2">
                                                    <Flame className="w-4 h-4 animate-pulse" />
                                                    <span>BURNING {zine.priceInZine} $ZINE</span>
                                                </p>
                                                <p className="text-xs text-flexoki-tx/60 mt-1">
                                                    Isso reduz a oferta e aumenta o backing ratio para todos.
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* Account Abstraction Notice */}
                                        {paymentMethod === "eth" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-flexoki-cyan/10 border border-flexoki-cyan p-3 rounded-sm"
                                            >
                                                <p className="font-mono text-xs text-flexoki-cyan flex items-center gap-2">
                                                    <Zap className="w-4 h-4" />
                                                    <span>MINT + PURCHASE IN ONE TX</span>
                                                </p>
                                                <p className="text-xs text-flexoki-tx/60 mt-1">
                                                    ETH → $ZINE → Burn (seamless UX)
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* Shipping Address */}
                                        <div className="space-y-2">
                                            <label className="font-mono text-xs uppercase text-flexoki-tx/60">
                                                Shipping Address
                                            </label>
                                            <textarea
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                placeholder="Street, City, State, ZIP, Country"
                                                rows={3}
                                                className="w-full bg-flexoki-bg-200 border-2 border-flexoki-tx/20 px-3 py-2 font-mono text-sm text-flexoki-tx placeholder:text-flexoki-tx/30 focus:border-flexoki-green focus:outline-none transition-colors resize-none"
                                            />
                                        </div>

                                        {/* Print Node Info */}
                                        <div className="p-3 bg-flexoki-green/10 border border-flexoki-green/30 space-y-2">
                                            <div className="flex items-center gap-2 font-mono text-xs text-flexoki-tx/80">
                                                <MapPin className="w-4 h-4 text-flexoki-green" />
                                                <span>Print Node: {printNode}</span>
                                            </div>
                                            <div className="flex items-center gap-2 font-mono text-xs text-flexoki-tx/60">
                                                <Clock className="w-4 h-4" />
                                                <span>Estimated: {estimatedDelivery}</span>
                                            </div>
                                        </div>

                                        {/* Purchase Button */}
                                        <button
                                            onClick={handlePurchase}
                                            disabled={!isConnected || !shippingAddress}
                                            className="w-full py-4 font-mono text-sm uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-flexoki-tx text-flexoki-bg border-2 border-flexoki-tx hover:bg-flexoki-green hover:border-flexoki-green hover:text-flexoki-bg"
                                        >
                                            {!isConnected
                                                ? "Connect Wallet"
                                                : !shippingAddress
                                                    ? "Enter Shipping Address"
                                                    : "Confirm Purchase"}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
