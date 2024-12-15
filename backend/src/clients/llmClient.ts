import OpenAI from 'openai';
import { TextContentBlock } from 'openai/resources/beta/threads/messages';

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

//   static async initialize(): Promise<OpenAIClient> {
//     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//     //const assistant = await this.createAssistant(openai);
//     const thread = await this.createThread(openai);
//     return new OpenAIClient('asst_sA3SlyUjJbAF4dwyPBJa4CjT', thread.id);
//   }


   async createThread() {
    const thread = await this.openai.beta.threads.create();
    this.threadId = thread.id;
  }

//   static async createAssistant(openai: OpenAI) {
//     const assistant = await openai.beta.assistants.create({
//       name: "Chat Assistant",
//       instructions: "You are a helpful assistant.",
//       model: "gpt-4-turbo-preview"
//     });
//     return assistant;
//   }

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
    console.log(`list messages:`, messages.data);
    return messages.data[0].content[0] as TextContentBlock;
  }
}

// Usage:
export const openAIClient = new OpenAIClient();