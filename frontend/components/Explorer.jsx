import React from 'react'
import { motion } from 'motion/react'
import { FolderTree, RefreshCw } from 'lucide-react'
import Folder from './Folder'
const Explorer = ({ projectId, tree, reloadTree }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -16, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 288 }}
            exit={{ opacity: 0, x: -16, width: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='flex flex-col overflow-hidden rounded-r border border-white/[0.06] bg-[#111113]/90 backdrop-blur-xl'
        >

            <div className=' flex h-10 w-72 shrink-0 items-center justify-between border-b px-3 bg-white/[0.06]' >
                <span className=' text-[11px] uppercase font-semibold tracking-wider text-zinc-500'>
                    Explorer
                </span>

                <motion.button
                    whileHover={{ rotate: 60 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={reloadTree}
                    className='rounded-md p-1 text-zinc-400 transition-colors hover:bg-white/[0.07] hover:text-white'
                    title='Refresh'
                >
                    <RefreshCw size={14} />
                </motion.button>
            </div>

            <div
                className='w-72 flex-1 overflow-y-auto px-1 py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/[0.08] hover:[&::-webkit-scrollbar-thumb]:bg-white/[0.15] [&::-webkit-scrollbar-thumb]:transition-colors'
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
            >

                {tree.length == 0 ? (
                    <div className='
                     flex flex-col items-center gap-2 px-3 py-10 text-center'>
                         <FolderTree size={22} className=' text-zinc-700'/>
                         <span className=' text-zinc-600 text-[12px]'>
                            Empty Workspace
                         </span>
                     </div>
                ) : (
                    tree.map((node) => (
                        <Folder projectId={projectId} node={node} reloadTree={reloadTree} tree={node} />

                    ))
                    
                )}
            </div>

        </motion.div>
    )
}

export default Explorer
