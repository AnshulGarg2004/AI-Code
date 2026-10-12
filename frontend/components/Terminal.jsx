import React, { useEffect, useRef, useState } from 'react'
import { FitAddon } from "@xterm/addon-fit"
import { Terminal as Xterminal } from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css";
import { io } from "socket.io-client"
import { Eraser } from 'lucide-react';

const Terminal = ({ projectId, userId }) => {
    const containerRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const terminalRef = useRef();
    useEffect(() => {

        if (!projectId || !userId) {
            console.warn("Terminal waiting for project and user IDs", { projectId, userId });
            return;
        }
        const terminal = new Xterminal({
            cursorBlink: true,
            cursorStyle: "block",
            fontSize: 13,
            fontFamily:
                "Menlo, Monaco, Consolas, monospace",
            scrollback: 5000,

            theme: {
                background: "#0d0d0f",
                foreground: "#d4d4d4",
                cursor: "#ffffff",
                selectionBackground: "#264f78",
            },
        })

        const fitAddOn = new FitAddon()
        terminal.loadAddon(fitAddOn);

        terminal.open(containerRef.current);

        terminalRef.current = terminal

        const fitTerminal = () => {
            try {
                fitAddOn.fit();
            } catch (error) {
                console.log("error in fit terminal: ", error);

            }

        }

        fitTerminal();

        const terminal_url = import.meta.env.VITE_TERMINAL_SERVICE;


        if (!terminal_url) {
            terminal.write("\r\n\x1b[31mVITE_TERMINAL_SERVICE missing\x1b[0m\r\n");
            return () => terminal.dispose();
        }

        const socket = io(terminal_url, {
            transports: ["websocket"],
            withCredentials: true
        });

        socket.on("connect", () => {
            setConnected(true)
            console.log("socket connected", socket.id);
            fitTerminal();
            socket.emit("terminal:init", {
                projectId,
                userId,
                cols: terminal.cols,
                rows: terminal.rows
            });
        });


        socket.on("terminal:data", (data) => {
            terminal.write(String(data || ""));
        });

        socket.on("terminal:ready", () => {
            fitTerminal();
            socket.emit("terminal:resize", { rows: terminal.rows, cols: terminal.cols })
            terminal.focus();
        });

        const input = terminal.onData((data) => {
            if (!socket.connected) {
                return;
            }

            socket.emit("terminal:write", data);
        })

        const resizeTerminal = () => {
            fitTerminal();
            if (!socket.connected) {
                return;
            }

            socket.emit("terminal:resize", { rows: terminal.rows, cols: terminal.cols })
        }

        window.addEventListener("resize", resizeTerminal());

        const resizeObserver = new ResizeObserver(resizeTerminal);
        resizeObserver.observe(containerRef.current);


        const focusTerminal = () => {
            terminal.focus();
        }

        containerRef.current.addEventListener("click", focusTerminal)

        socket.on("connect_error", (error) => {
            setConnected(false)
            console.error("socket connection error:", error.message);
            terminal.write(`\r\n\x1b[31mSocket connection failed: ${error.message}\x1b[0m\r\n`);
        });


        socket.on("disconnet", () => setConnected(false));


        return () => {
            window?.removeEventListener("resize", resizeTerminal);
            resizeObserver.disconnect();
            containerRef?.current?.removeEventListener("click", focusTerminal);
            input.dispose();
            socket.disconnect();
            terminal.dispose();
        };
    }, [projectId, userId]);


    const clearTerminal = () => {
        const terminal = terminalRef?.current;
        if (!terminal) {
            return;
        }

        terminal.clear();
        terminal.write("\x1b[2J\x1b[H");
        terminal.focus();
    }
    return (
        <div className="flex h-full flex-col bg-[#0d0d0f]">
            <div className="flex h-7 shrink-0 items-center justify-between border-b border-white/[0.05] px-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-zinc-600"
                            }`}
                    />
                    <span className="text-[11px] text-zinc-500">
                        {connected ? "terminal — connected" : "terminal — disconnected"}
                    </span>
                </div>
                <button
                    onClick={clearTerminal}
                    title="Clear terminal"
                    className="rounded p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <Eraser size={12} />
                </button>
            </div>
            <div ref={containerRef} className=' min-h-0 flex-1 cursor-text overflow-hidden'/>
        </div>
    )
}

export default Terminal
