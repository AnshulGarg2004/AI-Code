import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectdb.js";
import http from "http"
import os from "os"
import { Server } from "socket.io"
import path from "path";
import fs from "fs/promises"
import pty from "node-pty"

dotenv.config();

const port = process.env.PORT || 8002;

const fileServiceUrl = process.env.FILE_SERVICE;
const WORKSPACE_ROOT = path.join(os.tmpdir(), "ai-code");
const SHELL = process.platform === "win32" ? "powershell.exe" : "bash"

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
})


const session = new Map();

const send = (socket, data) => {
    if (!socket.connected) {
        return;
    }

    socket.emit("terminal:data", String(data || ""));
}

const safeName = (name) => {
    if (!name || name === '.' || name === '..' || name.includes('/') || name.includes('//')) {
        throw new Error(`invalid file/folder name ${name}`);
    }

    return name;
}

const workspace = (projectId) => {
    return path.join(WORKSPACE_ROOT, String(projectId))
}

const normaliseColumn = (cols) => {
    const value = Number(cols);
    if (!Number.isFinite(value)) {
        return 80;
    }

    return Math.max(20, Math.min(Math.floor(value), 500));


}

const normaliseRows = (rows) => {
    const value = Number(rows);
    if (!Number.isFinite(value)) {
        return 80;
    }

    return Math.max(5, Math.min(Math.floor(value), 200));


}


const getTree = async (projectId, userId) => {
    const url = `${fileServiceUrl}/tree/${projectId}`;

    const resp = await fetch(url, {
        headers: {
            'x-user-id': userId
        }
    })

    const text = await resp.text();

    let data = {};
    try {
        data = text ? JSON.parse(text) : {};
    } catch (error) {
        data: { message: text };
    }

    if (!resp.ok) {
        throw new Error(data?.message || `file service returned ${resp.status}`);
    }

    return Array.isArray(data) ? data : [];
}


const writeNodes = async (dir, nodes) => {
    if (!Array.isArray(nodes)) {
        return;
    }

    for (const node of nodes) {
        const name = safeName(node.name);
        const target = path.join(dir, name);

        if (node.type == "folder") {
            await fs.mkdir(target, { recursive: true });

            await writeNodes(node.children || [], target);
            continue
        }

        if (node.type == "file") {
            await fs.mkdir(path.dirname(target), { recursive: true });

            await fs.writeFile(node.content || "", 'utf-8');
        }
    }
}

const syncProject = async (projectId, userId) => {
    const tree = await getTree(projectId, userId);
    const root = workspace(projectId)

    await fs.mkdir(root, { recursive: true })

    if (tree.length == 1 && tree[0]?.type == "folder") {
        await writeNodes(tree[0].children || [], root);
    }
    else {
        await writeNodes(tree, root);
    }


    return { tree, root }
}


io.on("connection", (socket) => {
    console.log("terminal connected: ", socket?.id);
    socket.on("terminal:init", async ({ projectId, userId, cols = 80, rows = 30 }) => {

        console.log("terminal initialised");
        
        try {
            projectId = String(projectId);
            userId = String(userId);

            if (!projectId || !userId) {
                throw new Error(`project id and user id are required`);
            }

            const existingSession = session.get(socket.id);

            if (existingSession) {
                try {
                    existingSession.ptyProcess.kill()
                } catch (error) {

                }

                session.delete(socket.id);
            }

            cols = normaliseColumn(cols);
            rows = normaliseRows(rows);

            const { root } = await syncProject(projectId, userId);

            const ptyProcess = pty.spawn(SHELL, [], {
                name: 'xtern-256color',
                rows, cols,
                cwd: root,
                env: {
                    ...process.env,
                    FORCE_COLOR: 1
                }


            })

            ptyProcess.onData((data) => {
                send(socket, data)
            })

            ptyProcess.onExit(({ exitCode }) => {
                send(socket, `\r\n\x1b[90m[shell exited: ${exitCode}]\x1b[0m\r\n`);
                const sess = session.get(socket.id);

                if (sess?.ptyProcess == ptyProcess) {
                    session.delete(socket.id);
                }
            });

            session.set(socket.id, { projectId, userId, cwd: root, ptyProcess });

            socket.emit("terminal:ready", { rows, cols });
        } catch (error) {
            console.log("terminal init error: ", error);
            send(
                socket,
                `\r\n\x1b[31m${error.message}\x1b[0m\r\n`
            );
        }
    })


    socket.on("terminal:write", (data) => {
        console.log("terminal wrote");
        
        const sess = session.get(socket.id);
        if(!sess) {
            return;
        }

        sess.ptyProcess.write(String(data));
    }) 

    socket.on("terminal:resize", ({ rows, cols }) => {
        console.log("terminal resized");
        
        const sess = session.get(socket.id);
        if(!sess) {
            return;
        }

        cols = Number(cols);
        rows = Number(rows);

          if(!Number.isFinite(rows) || !Number.isFinite(cols ) ) {
            return;
          }

          cols = normaliseColumn(cols);
          rows = normaliseRows(rows);

          sess.ptyProcess.resize(cols, rows);
    })

    socket.on("disconnect", () => {
        console.log("session disconnected");
        const sess = session.get(socket.id);
        if (sess) {
            try {
                sess.ptyProcess.kill();
            } catch (error) {
                
            }
            session.delete(socket.id);
        }

    })
})


app.get('/health', (req, res) => {
    return res.status(200).json({
        success : true, 
        message : "terminal working fine"
    })
})

app.get('/', (req, res) => {

    res.status(200).json({ message: "hello from terminal service" });
})


server.listen(port, async () => {
    console.log("Terminal Server is successfully runing on port: ", port);
    await connectDB();
})