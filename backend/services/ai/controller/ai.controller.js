import { AIMessage, HumanMessage } from "@langchain/core/messages";
import mongoose from "mongoose";
import { graph } from "../graph/graph.js";

const buildHistory = (history) => {
    if (!Array.isArray(history)) {
        return [];
    }

    const recents = history.slice(-6);

    return recents
        .filter((recent) => recent?.content && (recent.role === "user" || recent.role === "assistant"))
        .map((mess) => {
            if (mess.role == "user") {
                return new HumanMessage(mess.content)
            }

            return new AIMessage(mess.content)
        })
}

export const chat = async (req, res) => {

    const sendEvent = (res, event, data) => {
        if (res.writableEnded || res.destroyed) {
            return false;
        }


        try {
            res.write(`event:${event}\n`);
            res.write(`data:${JSON.stringify(data || {})}\n\n`);
            return true;
        } catch (error) {
            console.log("SSE error in sendEvent function:", error);
            return false;
        }
    }
    let disconected = false;
    try {
        const { message, projectId, history = [] } = req.body;
        const userId = req.headers['x-user-id'];


        if (!projectId) {
            return res.status(400).json({ message: "Project Id is required" });
        }
        if (!message) {
            return res.status(400).json({ message: "Message  is required" });
        }
        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(401).json({ message: "Valid user id required" });
        }

        res.setHeader(
            "Content-Type",
            "text/event-stream; charset=utf-8"
        );

        res.setHeader(
            "Cache-Control",
            "no-cache, no-transform"
        );

        res.setHeader(
            "Connection",
            "keep-alive"
        );

        res.setHeader(
            "X-Accel-Buffering",
            "no"
        );


        res.flushHeaders?.();

        res.once("close", () => {
            if (!res.writableEnded) {
                disconected = true;
                console.log("AI client disconnected before the stream completed");
            }

        });

        sendEvent(res,"start", {
            success: true,
            message: "Ai started"
        });

        const graphData = graph({ projectId, userId });
        const messages = buildHistory(history)

        messages.push(new HumanMessage(message.trim()));


        const stream = await graphData.stream({
            messages
        }, {
            streamMode: "updates",
            recursionLimit: 40
        });

        let finalMessage = "";

        for await (const chunk of stream) {
            if (res.writableEnded || disconected) {
                break;
            }

            if (chunk.agent) {
                const agentMessages = chunk.agent?.messages || [];
                const lastMess = agentMessages[agentMessages.length - 1];

                if (!lastMess) {
                    continue;
                }

                if (Array.isArray(lastMess.tool_calls) && lastMess.tool_calls?.length) {
                    for (const call of lastMess.tool_calls) {
                        sendEvent(res, "tool_start", {
                            tool: call.name,
                            args: call.args || {}
                        })
                    }
                    continue
                }

                let content = "";

                if (typeof lastMess.content == "string") {
                    content = lastMess.content;
                }
                else if (Array.isArray(lastMess.content)) {
                    content = lastMess.content.filter((item) => item.type == "text").map((item) => item.text).join("");
                }


                if (content) {
                    finalMessage = content;
                    sendEvent(res, "message", { content })
                }
            }
            if (chunk.tools) {
                const toolMessages = chunk.tools.messages || [];

                for (const toolMess of toolMessages) {
                    let result = toolMess.content;
                    try {
                        result = typeof result == "string" ? JSON.parse(result) : result
                    } catch (error) {
                        continue
                        
                    }


                    if (result?.operation) {
                        sendEvent(res, "operation", result);
                    }
}
            }
        }

        if (!disconected && !res.writableEnded) {
            sendEvent(res, "done", {
                success: true,
                message: finalMessage || "done"
            })
            res.end();
        }
    } catch (error) {
        console.log("AI stream error: ", error);
        if (disconected) {
            return;
        }

        if (res.headersSent) {
            sendEvent(res, "error", {
                success: false,
                message: error?.message || "AI request failed"
            })
            if (!res.writableEnded) {
                res.end();
            }

            return;
        }

        return res.status(500).json({
            success: false,
            message: error?.message || "AI request failed"
        })



    }
}