import { Configuration, OpenAIApi } from "openai";
import { writeFileSync } from "fs";

const config = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(config);
var prompt = "a big loan who eat a lot of food";
const result = await openai.createImage({
  prompt,
  n: 1,
  size: "512x512",
});

const url = result.data.data[0].url;
console.log(url);