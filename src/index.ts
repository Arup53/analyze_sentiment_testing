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
import RSI from "calc-rsi";

// Define the tools for the agent to use

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

async function analyzeSentiment(textArr: any) {
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
    .map((text: string, index: any) => `${index + 1}. "${text}"`)
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

const realTimeMarketDataTool = new DynamicStructuredTool({
  name: "real_time_market_data",
  description:
    "Fetch real-time cryptocurrency market data for specific coin(s). Accepts comma-separated CoinGecko IDs (e.g., 'bitcoin,ethereum,solana').",
  schema: z.object({
    coinIds: z
      .string()
      .describe("Comma-separated CoinGecko IDs (e.g., 'bitcoin,ethereum')"),
  }),
  func: async ({ coinIds }) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true`
      );
      return JSON.stringify(response.data);
    } catch (error) {
      return "Unable to fetch real-time market data. Please check the coin IDs and try again.";
    }
  },
});

function sixMonthMovingAverage(data: any, period: any) {
  let result = [];
  for (let i = 0; i <= data.length - period; i++) {
    let window = data.slice(i, i + period);
    let sum = window.reduce((acc: any, val: any) => acc + val, 0);
    result.push(sum / period);
  }
  return result;
}

const technicalIndicatorsTool = new DynamicStructuredTool({
  name: "technical_indicators",
  description:
    "Calculate technical indicators (RSI, MACD, Moving Averages) for a given cryptocurrency for specific coin(s). Accepts comma-separated CoinGecko IDs (e.g., 'bitcoin,ethereum,solana etc').",
  schema: z.object({
    coinIds: z
      .string()
      .describe("Comma-separated CoinGecko IDs (e.g., 'bitcoin,ethereum')"),
  }),
  func: async ({ coinIds }) => {
    const historicalData = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinIds}/market_chart?vs_currency=usd&days=30&interval=daily`
    );
    let finalOutput;
    // Extract closing prices
    const closingPrices = historicalData.data.prices.map(
      (price: any) => price[1]
    );

    const rsi = new RSI(closingPrices, 14);
    const result = rsi.calculate((err: any, result: any) => {
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
