"use client";

import { useState, Fragment } from "react";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { Coins, X } from "lucide-react";
import { VendingMachine } from "./VendingMachine";

export function VendingMachineFAB() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed bottom-6 right-6 z-40 bg-flexoki-green text-flexoki-bg p-4 border-2 border-flexoki-tx shadow-lg"
            >
                <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 animate-pulse" />
                    <div className="font-mono text-xs font-bold">
                        MINT $ZINE
                    </div>
                </div>
            </motion.button>

            {/* Bottom Drawer */}
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 md:hidden" onClose={() => setIsOpen(false)}>
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

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-x-0 bottom-0 flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-300"
                                    enterFrom="translate-y-full"
                                    enterTo="translate-y-0"
                                    leave="transform transition ease-in-out duration-300"
                                    leaveFrom="translate-y-0"
                                    leaveTo="translate-y-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-full">
                                        <div className="flex h-full flex-col bg-zine-dark border-t-4 border-flexoki-green shadow-xl">
                                            {/* Header */}
                                            <div className="flex items-center justify-between p-4 border-b border-flexoki-tx/20">
                                                <Dialog.Title className="font-mono text-sm uppercase tracking-wider text-flexoki-bg">
                                                    Mint $ZINE
                                                </Dialog.Title>
                                                <button
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-flexoki-bg/60 hover:text-flexoki-bg transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 overflow-y-auto p-4">
                                                <VendingMachine />
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
