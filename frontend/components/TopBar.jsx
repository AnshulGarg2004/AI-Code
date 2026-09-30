import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { Code, Code2, Eye } from 'lucide-react'

const TopBar = ({showPreview, setShowPreview}) => {
    const { currentProject } = useSelector((state) => state.project)
    
    return (
        <div className='relative flex h-12 items-center justify-between border-b border-white/10 bg-[#0b0c0e]/80 px-4 backdrop-blur-xl'>
            <div className='flex items-center gap-3'>
                <div className='text-lg text-transparent font-bold text-white'>AI+ Code</div>

                <div className='h-4 w-px bg-white/10' />

                <div className='flex items-center gap-2'>
                    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-[13px] text-zinc-200'>
                        📁
                    </div>
                    <div className='max-w-[220px] truncate text-sm font-medium text-zinc-300'>
                        {currentProject?.name || 'Project'}
                    </div>
                </div>
            </div>

      <div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPreview((v) => !v)}
          title={showPreview ? 'Show Editor' : 'Show Preview'}
          className={`relative flex items-center justify-center rounded-lg border transition-colors ${
            showPreview ? 'border-sky-400 bg-sky-400/20 text-sky-400' : 'border-zinc-700 bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          } h-9 w-9`}
        >
          <motion.div  className=' absolute inset-0 rounded-lg bg-white/[0.06]' transition={{type : "spring",  duration : 0.35, bounce
             : 0.15
          }}/>

          {showPreview ? <Eye size={16}  className=' relative'/> : <Code2 size={16} className=' relative' />}
        </motion.button>
      </div>
    </div>
  )
}

export default TopBar
