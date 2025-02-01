//   name: "get_bitcoin_price",
//   description: "Fetches current Bitcoin price in USD",
//   func: async () => {
//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
//     );
//     return `Current Bitcoin price: $${response.data.bitcoin.usd} USD`;
//   },
// });
export {};
// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     "system",
//     "You are a cryptocurrency assistant. Always use tools for price data.",
//   ],
//   ["human", "{input}"],
//   ["placeholder", "{agent_scratchpad}"],
// ]);
// // 4. Create agent
// const tools = [bitcoinPriceTool];
// const agent = await createOpenAIToolsAgent({
//   llm: model,
//   tools,
//   prompt,
// });
// // 5. Create executor
// const executor = new AgentExecutor({
//   agent,
//   tools,
// });
// // 6. Run the agent
// async function main() {
//   const result = await executor.invoke({
//     input: "Today's price of 1 bitcoin",
//   });
//   console.log("Response:", result.output);
// }
// main().catch(console.error);
// const bitcoinPrice = tool(
//   async () => {
//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
//     );
//     return `Current Bitcoin price: $${response.data.bitcoin.usd} USD`;
//   },
//   {
//     name: "bitcoin",
//     description: "price of bitcoin",
//     schema: z.void(),
//   }
// );
// const tools = [bitcoinPrice];
// const query = "price of bitcoin today";
// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "You are a helpful crypto assistant"],
//   ["placeholder", "{chat_history}"],
//   ["human", "{input}"],
//   ["placeholder", "{agent_scratchpad}"],
// ]);
// const agent = createToolCallingAgent({
//   llm,
//   tools,
//   prompt,
// });
// const agentExecutor = new AgentExecutor({
//   agent,
//   tools,
// });
// const result = await agentExecutor.invoke({ input: query });
// console.log(result.output);
// 1. Define Tools
// const newsTool = tool(
//   async (input: any) => {
//     try {
//       const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
//         input
//       )}&apiKey=${process.env.NEWS_API_KEY}`;
//       const response = await axios.get(url);
//       return JSON.stringify(response.data.articles.slice(0, 10));
//     } catch (error) {
//       return "Error fetching news articles";
//     }
//   },
//   {
//     name: "fetch_crypto_news",
//     description: "Fetches latest news articles about cryptocurrency market",
//     schema: z.object({
//       input: z.string(),
//     }),
//   }
// );
// const sentimentTool = tool(
//   async (input: any) => {
//     try {
//       const texts = JSON.parse(input);
//       const scores = await Promise.all(
//         texts.map(async (text: string) => {
//           const response = await axios.post(
//             "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
//             { inputs: text },
//             { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
//           );
//           return response.data[0].find((s: any) => s.label === "POSITIVE")
//             .score;
//         })
//       );
//       return JSON.stringify(scores);
//     } catch (error) {
//       return JSON.stringify(new Array(5).fill(0.5));
//     }
//   },
//   {
//     name: "analyze_sentiment",
//     description: "Analyzes sentiment of text and returns a score between 0-1",
//     schema: z.object({
//       input: z.string(),
//     }),
//   }
// );
