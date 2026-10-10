import React, { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import { AnimatePresence, motion } from 'motion/react'
import ActivityBar from '../components/ActivityBar'
import Explorer from '../components/Explorer'
import Editor from '../components/Editor'
import Preview from '../components/Preview'
import { useParams } from "react-router-dom"
import { getProjectById } from '../src/features/project'
import { useDispatch } from 'react-redux'
import { setCurrentProject } from '../src/redux/projectSlice'
import { createRootFolder, getBuildTree } from '../src/features/file'
import { Bot, Code2, Eye, Files, Minimize2, TerminalSquare } from 'lucide-react'
import BottomPannel from '../components/BottomPannel'
import AIChat from '../components/AIChat'

const Project = () => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const [showPreview, setShowPreview] = useState(false)
    const [showExplorer, setShowExplorer] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [tree, setTree] = useState(null)
    const [activeTab, setActiveTab] = useState(null);
    const [showBottomPannel, setShowBottomPannel] = useState(false)
    const [openTabs, setOpenTabs] = useState([]);
    const [mobilePane, setMobilePane] = useState("explorer")
    const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);

    const openFile = (file) => {
        setOpenTabs((tabs) => tabs.some((tab) => tab._id === file._id) ? tabs : [...tabs, file]);
        setActiveTab(file);
    }


    useEffect(() => {
        const handleGetProject = async () => {
            const data = await getProjectById(id);
            dispatch(setCurrentProject(data));
        }
        handleGetProject()
    }, [id]);

    const loadtree = async () => {
        const data = await getBuildTree(id);
        setTree(data);
        console.log("data of tree: ", data);

    }

    useEffect(() => {


        loadtree()
    }, [id])
    return (
        <div className='relative flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0c]'>

            <div className='pointer-events-none absolute -top-40 left-1/3 hidden h-[700px] w-[700px] rounded-full bg-[#0aa0c] blur-[140px]' />
            <div className='pointer-events-none absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-[140px]' />
            <TopBar setShowPreview={setShowPreview} showPreview={showPreview} />

            <div className='flex min-h-0 flex-1 overflow-hidden'>
                <ActivityBar setShowAIChat={setShowAIChat} setShowExplorer={setShowExplorer} setShowTerminal={setShowBottomPannel} showAIChat={showAIChat} showExplorer={showExplorer} showTerminal={showBottomPannel} />


                <AnimatePresence initial={false}>

                    {showExplorer && (
                        <Explorer projectId={id} tree={tree ?? []} reloadTree={loadtree} openFile={openFile} />
                    )}
                </AnimatePresence>

                <div className='relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden'>
                    <div className='flex h-10 shrink-0 items-center justify-end border-b border-white/[0.06] bg-[#111113]/90 px-3'>
                        <div className='flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#111113]/95 p-1'>
                            <button
                                type='button'
                                onClick={() => setShowPreview(false)}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${!showPreview ? 'bg-[#0a0a0c] text-white' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                <Code2 size={13} />
                                Editor
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowPreview(true)}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${showPreview ? 'bg-[#0a0a0c] text-white' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                <Eye size={13} />
                                Preview
                            </button>
                        </div>
                    </div>

                    <div className='flex min-h-0 flex-1 overflow-hidden'>
                        {showPreview ? (
                            <Preview activeTab={activeTab} tree={tree ?? []} />
                        ) : (
                            <Editor
                                activeTab={activeTab}
                                openTabs={openTabs}
                                setActiveTab={setActiveTab}
                                setOpenTabs={setOpenTabs}
                            />
                        )}
                    </div>

                    <AnimatePresence>
                        {showPreview && !isPreviewFullScreen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                className="fixed inset-0 z-[100] bg-white"
                            >
                                <Preview tree={tree} />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    type="button"
                                    onClick={() => setIsPreviewFullScreen(false)}
                                    title={isPreviewFullScreen ? "Exit fullscreen" : "Fullscreen preview"}
                                    className="absolute right-2 top-2 z-[110] flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#111113]/95 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 shadow-lg shadow-black/40 backdrop-blur hover:text-white sm:right-4 sm:top-3 sm:px-3 sm:text-xs"
                                >
                                    <Minimize2 size={13} />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>


                    <AnimatePresence>
                        {showBottomPannel && (
                            <div className=' max-h-[45vh] md:max-h-none'>
                                <BottomPannel projectId={id} onClose={() => setShowBottomPannel(false)} />
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className={`${mobilePane === "chat" ? "flex" : "hidden"} w-full md:flex md:w-auto`}>
                    {showAIChat && (
                        <AIChat projectId={projectId} />
                    )}
                </div>



            </div>
            <div className='flex items-center justify-around border-t border-white/[0.06] bg-[#0f0f12] py-2 md:hidden'>
                <button
                    onClick={() =>{ setMobilePane("explorer");
                        setShowExplorer(true)
                    }}
                    className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${mobilePane === "explorer" ? "text-white" : "text-zinc-500"
                        }`}
                >
                    <Files size={18} />
                    Files
                </button>
                <button
                    onClick={() =>{ setMobilePane("editor");
                        
                    }}
                    className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${mobilePane === "editor" ? "text-white" : "text-zinc-500"
                        }`}
                >
                    <Code2 size={18} />
                    Editor
                </button>
                <button
                    onClick={() =>{ setMobilePane("chat");
                        
                    }}
                    className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${mobilePane === "chat" ? "text-white" : "text-zinc-500"
                        }`}
                >
                    <Bot size={18} />
                    AI Chat
                </button>
                <button
                    onClick={() =>{ setMobilePane("terminal");
                        setShowBottomPannel(true)
                    }}
                    className={`flex flex-col items-center gap-1 px-4 py-1 text-[11px] font-medium transition-colors ${mobilePane === "terminal" ? "text-white" : "text-zinc-500"
                        }`}
                >
                    <TerminalSquare size={18} />
                   Terminal
                </button>
            </div>

        </div>
    )
}

export default Project
