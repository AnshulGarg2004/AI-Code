import { ChatOpenRouter } from "@langchain/openrouter";

const llm = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 1024,
  maxRetries: 0,
});


export default llm