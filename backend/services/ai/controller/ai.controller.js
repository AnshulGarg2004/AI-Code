import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { graph } from "../graph/graph.js";
import { object, success } from "zod";
import { disconnect } from "mongoose";

const buildHistory = async (history) => {
    if (!Array.isArray(history)) {
        return [];
    }

    const recents = history.slice(-6);

    recents.filter((recent) => recent?.content && (recent.role == "user" || recent.role == "assistant"))
        .map((mess) => {
            if (mess.role == "user") {
                return new HumanMessage(mess.content)
            }

            return new AIMessage(mess.content)
        })
}

export const chat = async (req, res) => {

    const sendEvent = async (req, event, data) => {
        if (res.writeableEnded || res.destroyed) {
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
    const disconected = false;
    try {
        const { message, projectId, history = [] } = req.body;
        const userId = req.headers['x-user-id'];


        if (!projectId) {
            return res.status(400).json({ message: "Project Id is required" });
        }
        if (!message) {
            return res.status(400).json({ message: "Message  is required" });
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
            disconected = true;
            console.log("AI client disconected. no events can be sent");

        });

        sendEvent(res, "start", {
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

        for await (const chunk of object) {
            if (res.writeableEnded || disconected) {
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
                    sendEvent(res, "messasge", { content })
                }
            }
            if (chunk.tools) {
                const toolMessages = chunk.tools.messages || [];

                for (const toolMess of toolMessages) {
                    let result = null;
                    try {
                        result = typeof toolMess == "string" ? JSON.parse(toolMess.content) : toolMess.content
                    } catch (error) {
                        result = null;
                    }


                    if (result.operation) {
                        sendEvent(res, operation, result);
                        continue
                    }

                    sendEvent(res, "tool_result", typeof toolMess == "string" ? toolMess.content : JSON.stringify(toolMess.content))
                }
            }

            if (!disconected && !res.writeableEnded) {
                sendEvent(res, "done", {
                    success: true,
                    message: finalMessage || "done"
                })
            }

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
            if (!res.writeableEnded) {
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