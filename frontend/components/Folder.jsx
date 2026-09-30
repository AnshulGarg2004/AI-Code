import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, FilePlus, FilePlus2, FolderClosed, FolderOpen, FolderPlus, Pencil, Trash } from 'lucide-react';
import { getFileColor, getFolderColor } from '../src/utils/customiseIcon';
import { createFile, createFolder, deleteFile, updateFile } from '../src/features/file';
import { createPortal } from "react-dom"

const Folder = ({ projectId, tree, reloadTree, node }) => {
    const [open, setOpen] = useState(false);
    const folderColor = getFolderColor(node.name);
    const [folderName, setFolderName] = useState();
    const [fileName, setFilerName] = useState();
    const [creatingFolderIn, setCreatingFolderIn] = useState(null);
    const [creatingFileIn, setCreatingFileIn] = useState(null);
    const [menu, setMenu] = useState(null);
    const [renaming, setRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState("");


    const handleCreateFolder = async () => {
        await createFolder({ projectId, name: folderName, parentId: node?._id })
    }
    const handleCreateFile = async () => {
        await createFile({ projectId, name: fileName, parentId: node._id })
    }
    const handleRenameFile = async () => {
        await updateFile({ id: node._id, name: renameValue, content: node?.content });
        await reloadTree();
    }

    const handleDeletefile = async () => {
        await deleteFile(node?._id);
        await reloadTree();
    }

    const handleNewFolder = (folder) => {
        setCreatingFolderIn(folder._id);
        setCreatingFileIn(null);
    }
    const handleNewFile = (folder) => {
        setCreatingFileIn(folder._id);
        setCreatingFolderIn(null);
    }

    const { Icon, color } = getFileColor(node.name)

    if (node.type == "file") {
        return (
            <div className=' relative'>

                <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className='group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.05] transition-colors'
                    onContextMenu={(e) => {
                        e.preventDefault()
                        setMenu({ x: e.clientX, y: e.clientY })
                    }}
                >

                    <div className=' flex min-w-0 flex-1 cursor-pointer items-center gap-1.5'>

                        <Icon className={`${color}`} size={13} />

                        <span className=' truncate text-[13px] text-zinc-300 transition-colors group-hover:text-white '>{node.name}</span>
                    </div>




                </motion.div>


                <AnimatePresence>
                    {menu && (
                        createPortal(
                            <>
                                <motion.div
                                    className='fixed inset-0 z-40'
                                    onClick={() => setMenu(null)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96, y: -6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                                    transition={{ duration: 0.14, ease: 'easeOut' }}
                                    className='fixed z-50 w-52 rounded-xl border border-white/[0.08] bg-[#17171a]/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl'
                                    style={{ left: menu.x, top: menu.y }}
                                >



                                    <button

                                        className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white'
                                        onClick={() => { setMenu(null); setRenaming(true) }}>
                                        <Pencil size={13} /> Rename
                                    </button>

                                    {node.parentId != null && (
                                        <button

                                            className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white'
                                            onClick={() =>{ setMenu(null)
                                                handleDeletefile();
                                            }}>

                                            <Trash size={13} /> Deleet
                                        </button>
                                    )}
                                </motion.div>
                            </>, document.body
                        ))}

                    {renaming && (
                        <div className='py-1  pl-1'>
                            <motion.input
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                autoFocus
                                value={renameValue}
                                placeholder={node?.name}
                                className='w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15'
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleRenameFile();
                                        setRenameValue("");
                                        setRenaming(false)
                                    }
                                    if (e.key === 'Escape') {
                                        setRenameValue("");
                                        setRenaming(false)
                                    }
                                }}
                            />
                        </div>
                    )}
                </AnimatePresence>


            </div>
        )
    }
    return (
        <div className=' relative'>

            <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className='group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.05] transition-colors'
                onContextMenu={(e) => {
                    e.preventDefault()
                    setMenu({ x: e.clientX, y: e.clientY })
                }}
            >

                <div className=' flex min-w-0 flex-1 cursor-pointer items-center gap-1.5' onClick={() => setOpen(v => !v)}>
                    <motion.div
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className='shrink-0'
                    >
                        <ChevronRight size={14} className=' text-zinc-500  ' />
                    </motion.div>

                    {
                        open ? <FolderOpen size={16} className={` shrink-0 ${folderColor}`} /> : <FolderClosed className={` shrink-0 ${folderColor}`} size={16} />
                    }

                    <span className=' truncate text-[13px] text-zinc-300 transition-colors group-hover:text-white '>{node.name}</span>
                </div>



                <div className=' hidden items-center gap-0.5 group-hover:flex'>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        className=' p-1 rounded-md text-zinc-500 hover:bg-white/10 hover:text-white'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCreateFile(node)
                            setOpen(true)
                        }}
                    >
                        <FilePlus size={13} />
                    </motion.button>
                    <motion.button

                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        className=' p-1 rounded-md text-zinc-500 hover:bg-white/10 hover:text-white'

                        onClick={(e) => {
                            handleCreateFolder(node)
                            e.stopPropagation();
                            setOpen(true)
                        }}
                    >
                        <FolderPlus size={13} />
                    </motion.button>
                </div>
            </motion.div>


            <AnimatePresence>
                {menu && (
                    createPortal(
                        <>
                            <motion.div
                                className='fixed inset-0 z-40'
                                onClick={() => setMenu(null)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                                transition={{ duration: 0.14, ease: 'easeOut' }}
                                className='fixed z-50 w-52 rounded-xl border border-white/[0.08] bg-[#17171a]/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl'
                                style={{ left: menu.x, top: menu.y }}
                            >
                                <button
                                    className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white'
                                    onClick={() => {
                                        setMenu(null);
                                        handleNewFile(node);
                                    }}
                                >
                                    <FilePlus2 size={13} />
                                    New File
                                </button>
                                <button
                                    className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white'
                                    onClick={() => {
                                        setMenu(null);
                                        handleNewFolder(node);
                                    }}
                                >
                                    <FolderPlus size={13} />
                                    New Folder
                                </button>

                                <div className='my-1 h-px bg-white/[0.08]' />

                                <button

                                    className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white'
                                    onClick={() => {
                                        setMenu(null);
                                        setRenaming(true);
                                    }}>
                                    <Pencil size={13} /> Rename
                                </button>

                                <button

                                    className='mx-1 flex w-[calc(100%-8px)] items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white'
                                    onClick={() => {setMenu(null); handleDeletefile()}}>

                                    <Trash size={13} /> Deleet
                                </button>
                            </motion.div>
                        </>, document.body
                    ))}
            </AnimatePresence>

            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className='ml-5 overflow-hidden border-l border-white/[0.05] pl-1'
                >
                    {node.children.map((child) => (
                        <Folder projectId={projectId} tree={tree} reloadTree={reloadTree} node={child} />
                    ))}
                </motion.div>
            )}


            {(creatingFolderIn === node._id) && (
                <div className='py-1  pl-1'>
                    <motion.input
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        autoFocus
                        value={folderName}
                        placeholder='Folder Name'
                        className='w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15'
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCreateFolder();
                                setFolderName("");
                                setCreatingFolderIn(null)
                            }
                            if (e.key === 'Escape') {
                                setFolderName('');
                                setCreatingFolderIn(null);
                            }
                        }}
                    />
                </div>
            )}
            {(creatingFileIn === node._id) && (
                <div className='py-1  pl-1'>
                    <motion.input
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        autoFocus
                        value={folderName}
                        placeholder='File Name'
                        className='w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15'
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCreateFile();
                                setFilerName("");
                                setCreatingFileIn(null)
                            }
                            if (e.key === 'Escape') {
                                setFilerName("");
                                setCreatingFileIn(null)
                            }
                        }}
                    />
                </div>
            )}


            {renaming && (
                <div className='py-1  pl-1'>
                    <motion.input
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        autoFocus
                        value={renameValue}
                        placeholder={node?.name}
                        className='w-full rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white placeholder-zinc-500 outline-none transition-all focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/15'
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleRenameFile();
                                setRenameValue("");
                                setRenaming(false)
                            }
                            if (e.key === 'Escape') {
                                setRenameValue("");
                                setRenaming(false)
                            }
                        }}
                    />
                </div>
            )}


        </div>
    )
}

export default Folder
