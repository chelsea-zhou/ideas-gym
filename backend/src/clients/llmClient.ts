import OpenAI from 'openai';
import { TextContentBlock } from 'openai/resources/beta/threads/messages';

interface Summary {
  topics: string[],
  title: string
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export class OpenAIClient {
  private openai: OpenAI;
  private assistantId: string;
  private threadId: string;

  public constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.assistantId = "asst_sA3SlyUjJbAF4dwyPBJa4CjT";
    this.threadId = "";
  }

  getThreadId() {
    return this.threadId;
  }

   async createThread() {
    const thread = await this.openai.beta.threads.create();
    this.threadId = thread.id;
  }

  async sendMessage(threadId: string, content: string) {
    const message = await this.openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content
    });

    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId
    });

    // Wait for completion
    let runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 500));
      runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Get messages
    const messages = await this.openai.beta.threads.messages.list(threadId, {
        run_id: run.id
    });
    return messages.data[0].content[0] as TextContentBlock;
  }

  async getTopics(messages: Message[]): Promise<string[] | null> {
    const prompt = `Summarize our conversation with:
      1. A descriptive title (3-5 words)
      2. Three key topics discussed (single words or short phrases)
      Format as JSON with keys 'title' and 'topics' (array)`;

    const summaryResponse = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "user", 
          content: prompt
        },
        ...messages
      ],
      response_format: { type: "json_object" },
      max_tokens: 150 // Adjust the token limit as needed
    });
    if (summaryResponse.choices[0].message.content) {
      const result =  JSON.parse(summaryResponse.choices[0].message.content);
      console.log(`result:`, result);
      return result;
    }
    return null;
  }

  async summarizeThread(threadId: string): Promise<Summary | null> {
    const messages = await this.openai.beta.threads.messages.list(threadId);
    const messagesArray = messages.data.map(msg => ({
      role: msg.role,
      content: (msg.content[0] as TextContentBlock).text.value
    }));
    console.log(`messagesArray:`, JSON.stringify(messagesArray, null, 2));

    const prompt = `Summarize our conversation with:
      1. A descriptive title (3-5 words)
      2. Three key topics discussed (single words or short phrases)
      Format as JSON with keys 'title' and 'topics' (array)`;

    const summaryResponse = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "user", 
          content: prompt
        },
        ...messagesArray
      ],
      response_format: { type: "json_object" },
      max_tokens: 150 // Adjust the token limit as needed
    });
    if (summaryResponse.choices[0].message.content) {
      const result =  JSON.parse(summaryResponse.choices[0].message.content);
      console.log(`result:`, result);
      return result;
    }
    return null;
  }
}

export const openAIClient = new OpenAIClient();
