import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import * as dotenv from 'dotenv';
import { openAI } from 'src/utils/constant/openAI.constants';

dotenv.config();

@Injectable()
export class LangchainChatService {
  private model: ChatOpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not set in environment variables');
    }

    this.model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE, // Adjust as needed
      modelName: openAI.GPT_3_5_TURBO_1106, // Ensure this is the model you want to use
    });
  }

  async answerQuestion(context: string, question: string): Promise<string> {
    // Validate inputs
    if (!context || !question) {
      throw new HttpException(
        'Both context and question must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Define the prompt template
      const promptTemplateString = `
        Context: ${context}
        Question: ${question}
        Answer:
      `;

      // Create the prompt template
      const prompt = PromptTemplate.fromTemplate(promptTemplateString);

      // Initialize the output parser
      const outputParser = new HttpResponseOutputParser();

      // Create the processing chain
      const chain = prompt.pipe(this.model).pipe(outputParser);

      // Format the input according to the prompt template
      const formattedInput = {
        context,
        question,
      };

      // Generate the response
      const response = await chain.invoke(formattedInput);

      // Convert Uint8Array to string and process the response
      const responseString = new TextDecoder().decode(response as Uint8Array);
      const formattedResponse = responseString.trim(); // Example: trim whitespace

      return formattedResponse;
    } catch (error) {
      console.error('Error in LangChain processing:', error);

      // Provide detailed error information
      throw new HttpException(
        `An error occurred while processing the question: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
