import dotenv from "dotenv";
dotenv.config();
import { ChatGroq } from "@langchain/groq";
import { AgentExecutor, createOpenAIToolsAgent, } from "langchain/agents";
import { DynamicStructuredTool, DynamicTool, } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts"; // Added
import axios from "axios";
import { z } from "zod";
import RSI from "calc-rsi";
// Define the tools for the agent to use
// const agentTools = [new TavilySearchResults({ maxResults: 3 })];
const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
});
// const sentimentTool = tool(
//   async function analyze(input) {
//     const newsResponse = await axios.get(
//       `https://newsapi.org/v2/everything?q=crypto market sentiment&from=2025-1-27&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`
//     );
//     // 2. Process articles and filter empty descriptions
//     const textArr = newsResponse.data.articles
//       .slice(0, 20)
//       .map((article: any) => article.description);
//     // 3. Get sentiment predictions
//     const hfResponse = await fetch(
//       "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
//       {
//         headers: {
//           Authorization: `Bearer hf_${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         method: "POST",
//         body: JSON.stringify(textArr),
//       }
//     );
//     const results = await hfResponse.json();
//     const sentimentSummary = results.reduce(
//       (acc: any, item: any) => {
//         if (Array.isArray(item) && item[0]?.label && item[0]?.score) {
//           const { label, score } = item[0];
//           acc[label.toLowerCase()] += score;
//           acc.count++;
//         }
//         return acc;
//       },
//       { positive: 0, negative: 0, count: 0 }
//     );
//     if (sentimentSummary.count === 0) {
//       throw new Error("No valid sentiment scores found");
//     }
//     const positiveAvg = sentimentSummary.positive / sentimentSummary.count;
//     const negativeAvg = sentimentSummary.negative / sentimentSummary.count;
//     let result;
//     if (positiveAvg > negativeAvg) {
//       result = "POSITIVE";
//     }
//     return `${result}`;
//     // return JSON.stringify({
//     //   dominant: positiveAvg > negativeAvg ? "POSITIVE" : "NEGATIVE",
//     //   confidence: Math.max(positiveAvg, negativeAvg) * 100,
//     // });
//   },
//   {
//     name: "analyze_sentiment",
//     description: "Analyzes sentiment of text ",
//     schema: z.object({
//       input: z.void(),
//     }),
//   }
// );
// const createAgent = async () => {
//   const model = new ChatGroq({
//     apiKey: process.env.GROQ_API_KEY,
//     model: "llama-3.3-70b-versatile",
//     temperature: 0,
//   });
//   const message = ChatPromptTemplate.fromTemplate(`
//     You are a financial analyst AI. Follow these steps:
//     1. Use analyze_sentiment tool to get market sentiment data
//     2. PARSE the JSON result containing "dominant" and "confidence" fields and print them
//     If you can't get the data, say "Error retrieving sentiment data"
//   `);
//   const prompt = ChatPromptTemplate.fromMessages([
//     message,
//     ["human", "{input}"],
//     ["placeholder", "{agent_scratchpad}"],
//   ]);
//   const agent = createToolCallingAgent({
//     llm: model,
//     tools: [sentimentTool],
//     prompt,
//   });
//   return new AgentExecutor({
//     agent,
//     tools: [sentimentTool],
//   });
// };
// // 3. Execute Analysis
// const analyzeSentiment = async () => {
//   const executor = await createAgent();
//   const result = await executor.invoke({
//     input: "Analyze today cryptocurrency market sentiment",
//   });
//   return result.output;
// };
// // Run the analysis
// const out = await analyzeSentiment();
// console.log(out);
// async function analyze() {
//   const newsResponse = await axios.get(
//     `https://newsapi.org/v2/everything?q=crypto market sentiment&from=2025-1-27&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`
//   );
//   // 2. Process articles and filter empty descriptions
//   const textArr = newsResponse.data.articles
//     .slice(0, 50)
//     .map((article: any) => article.description);
//   // 3. Get sentiment predictions
//   const hfResponse = await fetch(
//     "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
//     {
//       headers: {
//         Authorization: `Bearer hf_${process.env.HF_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify(textArr),
//     }
//   );
//   const results = await hfResponse.json();
//   const sentimentSummary = results.reduce(
//     (acc: any, item: any) => {
//       if (Array.isArray(item) && item[0]?.label && item[0]?.score) {
//         const { label, score } = item[0];
//         acc[label.toLowerCase()] += score;
//         acc.count++;
//       }
//       return acc;
//     },
//     { positive: 0, negative: 0, count: 0 }
//   );
//   if (sentimentSummary.count === 0) {
//     throw new Error("No valid sentiment scores found");
//   }
//   const positiveAvg = sentimentSummary.positive / sentimentSummary.count;
//   const negativeAvg = sentimentSummary.negative / sentimentSummary.count;
//   return {
//     dominant: positiveAvg > negativeAvg ? "POSITIVE" : "NEGATIVE",
//     confidence: Math.max(positiveAvg, negativeAvg).toFixed(3),
//   };
// }
// const anylyzeTool = {
//   type: "function",
//   function: {
//     name: "analyze",
//     description: "Provide crypto market sentiment.",
//     parameters: {
//       type: "object",
//       properties: {}, // No parameters required
//     },
//   },
// };
// const chat = new ChatGroq({
//   apiKey: process.env.GROQ_API_KEY,
//   model: "llama-3.3-70b-versatile",
//   temperature: 0,
// }).bind({
//   tools: [anylyzeTool],
//   tool_choice: "auto", // Ensure this is set appropriately
// });
// const response = await chat.invoke([
//   ["human", "Fetch the crypto market sentiment."],
// ]);
// if (response.tool_calls && response.tool_calls.length > 0) {
//   for (const toolCall of response.tool_calls) {
//     if (toolCall.name === "analyze") {
//       const result = await analyze();
//       console.log("Result", result);
//     }
//   }
// } else {
//   console.log("Model Response:", response.content);
// }
// const newsTool = new DynamicTool({
//   name: "crypto_news",
//   description: "Fetches Crypto News",
//   func: async () => {
//     try {
//       const url = `https://newsapi.org/v2/everything?q=crypto market sentiment&from=2025-1-31&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`;
//       const response = await axios.get(url);
//       return JSON.stringify(response.data.articles.splice(0, 5));
//     } catch (error) {
//       return "Error fetching news articles";
//     }
//   },
// });
async function analyzeSentiment(textArr) {
    const chat = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.3-70b-versatile", // Replace with your desired model
        temperature: 0,
    }).bind({
        response_format: { type: "json_object" },
    });
    // Create a prompt that instructs the model to analyze the sentiment of each text
    const prompt = `Analyze the sentiment of the following texts,find  which tone is greater and Return the larger tone as a JSON object with keys 'sentiment with value POSTIVIE OR NEGATIVE and key 'confidence' with value 0-100:

  ${textArr
        .map((text, index) => `${index + 1}. "${text}"`)
        .join("\n")}

  `;
    const response = await chat.invoke([
        { role: "system", content: "You are a sentiment analysis assistant." },
        { role: "user", content: prompt },
    ]);
    // Process the response to extract sentiment information
    // This will depend on the structure of the response from the Groq model
    // For example:
    const sentiment = response.content; // Adjust based on actual response structure
    console.log(sentiment);
    return sentiment;
}
const sentimentTool = new DynamicTool({
    name: "crypto_market_sentiment",
    description: "Provide crypto market sentiment live",
    func: async () => {
        try {
            // Fetch news articles
            const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=crypto market sentiment&from=2025-1-30&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`);
            // Process articles and filter empty descriptions
            const textArr = newsResponse.data.articles
                .slice(0, 50)
                .map((article) => article.description)
                .filter((description) => description);
            console.log(textArr);
            // Perform sentiment analysis
            const sentiments = await analyzeSentiment(textArr);
            // Output the sentiments
            return sentiments;
        }
        catch (error) {
            console.error("Error:", error);
        }
    },
});
const realTimeMarketDataTool = new DynamicStructuredTool({
    name: "real_time_market_data",
    description: "Fetch real-time cryptocurrency market data for specific coin(s). Accepts comma-separated CoinGecko IDs (e.g., 'bitcoin,ethereum,solana').",
    schema: z.object({
        coinIds: z
            .string()
            .describe("Comma-separated CoinGecko IDs (e.g., 'bitcoin,ethereum')"),
    }),
    func: async ({ coinIds }) => {
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true`);
            return JSON.stringify(response.data);
        }
        catch (error) {
            return "Unable to fetch real-time market data. Please check the coin IDs and try again.";
        }
    },
});
function sixMonthMovingAverage(data, period) {
    let result = [];
    for (let i = 0; i <= data.length - period; i++) {
        let window = data.slice(i, i + period);
        let sum = window.reduce((acc, val) => acc + val, 0);
        result.push(sum / period);
    }
    return result;
}
const technicalIndicatorsTool = new DynamicStructuredTool({
    name: "technical_indicators",
    description: "Calculate technical indicators (RSI, MACD, Moving Averages) for a given cryptocurrency for specific coin(s). Accepts comma-separated CoinGecko IDs (e.g., 'bitcoin,ethereum,solana etc').",
    schema: z.object({
        coinIds: z
            .string()
            .describe("Comma-separated CoinGecko IDs (e.g., 'bitcoin,ethereum')"),
    }),
    func: async ({ coinIds }) => {
        const historicalData = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinIds}/market_chart?vs_currency=usd&days=30&interval=daily`);
        let finalOutput;
        // Extract closing prices
        const closingPrices = historicalData.data.prices.map((price) => price[1]);
        const rsi = new RSI(closingPrices, 14);
        const result = rsi.calculate((err, result) => {
            if (err) {
                return err;
            }
            const latestRSI = JSON.stringify(result[result.length - 1].rsi);
            const sma = JSON.stringify(sixMonthMovingAverage(closingPrices, 20));
            finalOutput = `Latest_RSI: ${latestRSI} and Six_Month_Moving_Average: ${sma}`;
        });
        console.log(finalOutput);
        return finalOutput;
    },
});
const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are a crypto market advisor. Follow these steps:
    1. Identify which cryptocurrency(ies) the user is asking about
    2. Use appropriate tools to gather data for those specific coins
    3. Always mention the tools you used and their results (sentimenttool will provide overall market sentiment not specific coin sentiment note that)
    4. Provide clear advice based on the collected data
    
    Example coin IDs: bitcoin, ethereum, solana, dogecoin`,
    ],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
]);
const tools = [realTimeMarketDataTool, technicalIndicatorsTool, sentimentTool];
const agent = await createOpenAIToolsAgent({
    llm: llm,
    tools,
    prompt,
});
const executor = new AgentExecutor({
    agent,
    tools,
});
const userInput = "Should i buy dogecoin";
// Execute the agent with the input
const result = await executor.invoke({ input: userInput });
// Output the result
console.log(result);
