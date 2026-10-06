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
import { Code2, Eye } from 'lucide-react'

const Project = () => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const [showPreview, setShowPreview] = useState(false)
    const [showExplorer, setShowExplorer] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [tree, setTree] = useState(null)
    const [activeTab, setActiveTab] = useState(null);
    const [openTabs, setOpenTabs] = useState([]);

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
                <ActivityBar setShowAIChat={setShowAIChat} setShowExplorer={setShowExplorer} setShowTerminal={setShowTerminal} showAIChat={showAIChat} showExplorer={showExplorer} showTerminal={showTerminal} />


                <AnimatePresence initial={false}>

                    {showExplorer && (
                        <Explorer projectId={id} tree={tree ?? []} reloadTree={loadtree} openFile={openFile} />
                    )}
                </AnimatePresence>

                <main className='relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden'>
                    <div className='flex h-10 shrink-0 items-center justify-end border-b border-white/[0.06] bg-[#111113]/90 px-3'>
                        <div className='flex items-center gap-0.5 rounded-lg border border-white/10 bg-[#111113]/95 p-1'>
                            <button
                                type='button'
                                onClick={() => setShowPreview(false)}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    !showPreview ? 'bg-[#0a0a0c] text-white' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                <Code2 size={13} />
                                Editor
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowPreview(true)}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    showPreview ? 'bg-[#0a0a0c] text-white' : 'text-zinc-500 hover:text-zinc-300'
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
                </main>

            </div>
        </div>
    )
}

export default Project
