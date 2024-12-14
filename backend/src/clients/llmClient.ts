// export class OpenAIClient {
//     private api: OpenAI;
  
//     constructor() {
//       this.api = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY
//       });
//     }
  
//     async generateResponse(prompt: string) {
//       const response = await this.api.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }]
//       });
//       return response.choices[0].message.content;
//     }
//   }