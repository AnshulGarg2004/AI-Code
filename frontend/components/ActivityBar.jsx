import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react';
import { Bot, Files, SquareTerminal } from 'lucide-react';

function ActivityIcon({ icon: Icon, label, active, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div className=' relative'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={onClick}
                className='relative flex h-9 w-9 items-center justify-center rounded-lg'
            >
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={active ? 'active' : 'idle'}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className='absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-white/10'
                    />
                </AnimatePresence>

                <Icon size={19}
                    className={`relative z-10 transition-colors ${active ? 'text-sky-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                />

                {active && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                        className='absolute left-1/2 top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-sky-400 to-violet-400'
                    />
                )}

                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.12 }}
                            className='pointer-events-none absolute left-11 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-[#17171a] px-2 py-1 text-[11px] font-medium text-zinc-300 shadow-lg shadow-black/40'
                        >
                            {label}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

        </div>
    )
}


const ActivityBar = ({showAIChat, showExplorer, showTerminal, setShowAIChat, setShowTerminal, setShowExplorer}) => {


    return (
        <div className=' flex w-14 shrink-0 flex-col items-center gap-2 border-r border-white/[0.06] bg-[#111113]/90 py-3'>
            <ActivityIcon icon={Files} label={"Explorer"} active={showExplorer} onClick={() => setShowExplorer(v => !v)} />
            <ActivityIcon icon={Bot} label={"AI Chat"} active={showAIChat} onClick={() => setShowAIChat(v => !v)} />

            <div className='mt-auto flex flex-col items-center gap-2'>
                <div className=' mb-1 h-px w-6 bg-white/[0.06]'>

                    <ActivityIcon icon={SquareTerminal} label={"Terminal"} active={showTerminal} onClick={() => setShowTerminal(v => !v)} />
                </div>
            </div>
        </div>
    )
}

export default ActivityBar
