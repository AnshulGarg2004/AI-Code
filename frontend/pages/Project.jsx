import React, { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import { AnimatePresence, motion } from 'motion/react'
import ActivityBar from '../components/ActivityBar'
import Explorer from '../components/Explorer'
import { useParams } from "react-router-dom"
import { getProjectById } from '../src/features/project'
import { useDispatch } from 'react-redux'
import { setCurrentProject } from '../src/redux/projectSlice'
import { createRootFolder, getBuildTree } from '../src/features/file'

const Project = () => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const [showPreview, setShowPreview] = useState(false)
    const [showExplorer, setShowExplorer] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [tree, setTree] = useState(null)


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

            <div className=' flex flex-1 overflow-hidden'>
                <ActivityBar setShowAIChat={setShowAIChat} setShowExplorer={setShowExplorer} setShowTerminal={setShowTerminal} showAIChat={showAIChat} showExplorer={showExplorer} showTerminal={showTerminal} />


                <AnimatePresence initial={false}>

                    {showExplorer && (
                        <Explorer projectId={id} tree={tree} reloadTree={loadtree} />
                    )}
                </AnimatePresence>





            </div>
        </div>
    )
}

export default Project
