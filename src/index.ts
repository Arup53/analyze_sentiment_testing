import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";
import {
  AgentExecutor,
  createToolCallingAgent,
  createOpenAIToolsAgent,
} from "langchain/agents";
import {
  tool,
  DynamicStructuredTool,
  DynamicTool,
} from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts"; // Added
import axios from "axios";
import { z } from "zod";

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

const newsTool = new DynamicTool({
  name: "crypto_news",
  description: "Fetches Crypto News",
  func: async () => {
    try {
      const url = `https://newsapi.org/v2/everything?q=crypto market sentiment&from=2025-1-31&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`;
      const response = await axios.get(url);
      return JSON.stringify(response.data.articles.splice(0, 5));
    } catch (error) {
      return "Error fetching news articles";
    }
  },
});

async function analyzeSentiment(textArr: any) {
  const chat = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile", // Replace with your desired model
    temperature: 0,
  });
  // Create a prompt that instructs the model to analyze the sentiment of each text
  const prompt = `Analyze the sentiment of the following texts :

  ${textArr
    .map((text: any, index: any) => `${index + 1}. "${text}"`)
    .join("\n")}

    give a final verdict about which tone is greater either saying one word POSITIVE or Negative,and a confidence score and no other text and finally make a object which will be like this { "sentiment": "POSITIVE", "confidence": confidence score }`;

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
      const newsResponse = await axios.get(
        `https://newsapi.org/v2/everything?q=crypto market sentiment&from=2025-1-30&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`
      );

      // Process articles and filter empty descriptions
      const textArr = newsResponse.data.articles
        .slice(0, 50)
        .map((article: any) => article.description)
        .filter((description: any) => description);

      console.log(textArr);
      // Perform sentiment analysis
      const sentiments = await analyzeSentiment(textArr);

      // Output the sentiments
      return sentiments;
    } catch (error) {
      console.error("Error:", error);
    }
  },
});

// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     "system",
//     "You are a crypto news fetching assitant, use tools to fetch news",
//   ],
//   ["human", "{input}"],
//   ["placeholder", "{agent_scratchpad}"],
// ]);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a crypto market advisor, use tools to fetch sentiment; tools will provide an object like Sentiments:POSITVIE OR NEGATIVE and a confidence score: print that in your verdict",
  ],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const tools = [sentimentTool];
const agent = await createOpenAIToolsAgent({
  llm: llm,
  tools,
  prompt,
});

const executor = new AgentExecutor({
  agent,
  tools,
});

const userInput = "What is the crypto market today";

// Execute the agent with the input
const result = await executor.invoke({ input: userInput });

// Output the result
console.log(result);
