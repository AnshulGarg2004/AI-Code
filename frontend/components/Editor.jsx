import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react'
import { getFileColor } from '../src/utils/customiseIcon';
import { Check, Circle, Loader2, Save, X } from 'lucide-react';
import { updateFile } from '../src/features/file';
import MonacoEditor from "@monaco-editor/react"

const languageByExtension = {
    js: "javascript",
    jsx: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    css: "css",
    scss: "scss",
    html: "html",
    xml: "xml",
    md: "markdown",
    py: "python",
};

const getEditorLanguage = (file) => {
    const extension = file?.name?.split(".").pop()?.toLowerCase();
    const storedLanguage = file?.language?.toLowerCase();

    return storedLanguage && storedLanguage !== "plaintext"
        ? storedLanguage
        : languageByExtension[extension] || "plaintext";
};

const Editor = ({ setOpenTabs, setActiveTab, openTabs, activeTab }) => {

    const [saving, setSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [code, setCode] = useState("")
    const tabs = Array.isArray(openTabs) ? openTabs : [];

    const ActiveIcon = getFileColor(activeTab?.name).icon;
    const activeColor = getFileColor(activeTab?.name).color 
    const editorLanguage = getEditorLanguage(activeTab);

    useEffect(() => {
        setCode(activeTab?.content || "")
    }, [activeTab])

    const handleCloseTab = ( e,id) => {
        e.stopPropagation();
        const res = tabs.filter(tab => (tab?.id ?? tab?._id) !== id);
        setOpenTabs(res);
        if(activeTab._id == id) {
              setActiveTab(res.length? res[res.length-1]: null)
        }
    }
    if(!activeTab) {
        return (
            <div className=' flex flex-1 flex-col items-center justify-center gap-3 bg-[#0a0a0c] text-zinc-600'>
                <div className=' flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]'>
                    <Circle size={22} className=' text-zinc-700' />
                </div>

                <div className=' flex flex-col items-center gap-1'>
                    <span className=' text-sm font-medium text-zinc-400'>
                        No File Open
                    </span>

                    <span className=' text-xs text-zinc-600'>
                        Select a file from Explorer to start Editing
                    </span>
                </div>
            </div>
        )
    }


    const save = async () => {
        if (!activeTab) {
            return;
        }


        try {
            setSaving(true);
            await updateFile({ name: activeTab?.name, content: code, id: activeTab?._id })
            setActiveTab({ ...activeTab, content: code })
            setOpenTabs((tabs) => tabs.map((tab) => tab._id == activeTab._id ? { ...tab, content: code } : tab));
            setSaving(false)
            setJustSaved(true)

            setTimeout(() => {
                setJustSaved(false)
            }, 1500)
        } catch (error) {
            setSaving(false)
            console.log("error in save function in editor: ", error);

        }
    }

    return (
        <div className='flex min-h-0 flex-1 flex-col overflow-hidden bg-[#0a0a0c]'>
            <div className='flex h-10 shrink-0 items-center overflow-x-auto border-b border-white/[0.06] bg-[#111113]/90'>
                <AnimatePresence initial={false}>
                    {tabs.map((tab) => {
                        const tabKey = tab?.id ?? tab?._id;
                        const active = (activeTab?.id ?? activeTab?._id) === tabKey;
                        const { icon: Icon, color } = getFileColor(tab.name);

                        return (
                            <motion.div
                                key={tabKey}
                                layout
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                onClick={() => setActiveTab(tab)}
                                className={`group relative flex h-full items-center gap-2 whitespace-nowrap border-r border-white/[0.05] px-3.5 text-[11px] font-medium transition-colors ${active
                                    ? 'bg-[#0a0a0c] text-white'
                                    : 'text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300'
                                    }`}
                            >
                                <Icon size={14} className={color} />
                                <span className='text-[13px]'>{tab.name}</span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCloseTab(tabKey);
                                    }}
                                    className='rounded p-0.5 text-zinc-500 opacity-0 transition-colors group-hover:opacity-100 hover:bg-white/10 hover:text-white'
                                >
                                    <X size={13} />
                                </button>

                                {active && (
                                    <motion.div
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className='absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-sky-400 to-violet-400'
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className=' flex h-10 shrink-0 items-center justify-between border-b border-white/[0.06] px-4'>
                <div className=' flex items-center gap-2 text-zinc-400'>
                    <ActiveIcon size={14} className={`${activeColor}`} />
                    <span className='text-[13px]'>{activeTab?.name}</span>
                </div>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-b from-sky-500 to-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-colors hover:from-sky-400 hover:to-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <AnimatePresence initial={false} mode='wait'>
                        {(saving ? (
                            <motion.span
                                key="saving"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                               <Loader2 size={13} className=' animate-spin'/> Saving...
                            </motion.span>
                        ) : justSaved ? (
                            <motion.span
                                key="saved"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                               <Check size={13  } /> Saved
                            </motion.span>
                        ) : (
                            <motion.span
                                key="save"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Save  size={13}/>Save
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

                <div className='flex min-h-0 flex-1 overflow-hidden'>
                    <MonacoEditor
                    height="100%"
                    width="100%"
                    theme='vs-dark'
                    language={editorLanguage}
                    value={code}
                    onChange={(val) => setCode(val || "")} 
                    options={{
                        fontSize : 14, 
                        automaticLayout : true,
                        minimap : {enabled : true},
                        wordWrap : "on",
                        scrollBeyondLastLine : false,
                        padding : {top : 12},
                        quickSuggestions : true,
                        suggestOnTriggerCharacters : true,
                        wordBasedSuggestions : "currentDocument",
                        acceptSuggestionOnEnter : "on",
                        suggestSelection : "first"

                    }}
                    />
                </div>
        </div>
    );
};

export default Editor
