import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LangchainChatService } from './langchain-chat.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfService } from 'src/pdf/pdf.service';
import { promises as fs } from 'fs';
import { join } from 'path';
import { orignalFileName } from 'src/utils/constant';

@Controller('langchain-chat')
export class LangchainChatController {
  constructor(
    private readonly langchainChatService: LangchainChatService,
    private readonly pdfService: PdfService,
  ) {}

  @Post('file_upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const uploadDir = join(__dirname, '..', 'uploads', 'files');
    // Ensure the directory exists
    fs.mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, file.originalname);

    try {
      // Write the file to the specified path
      fs.writeFile(filePath, file.buffer);

      return { message: `successfully ${file.originalname} upload file ` };
    } catch (error) {
      console.error('Error writing file:', error);
      throw new Error(`File write failed: ${error.message}`);
    }
  }

  @Post('search_text')
  async FileSearchText(@Body('question') question: string) {
    const uploadDir = join(__dirname, '..', 'uploads', 'files');

    const filePath = join(uploadDir, orignalFileName);

    try {
      const text = await this.pdfService.extractText(filePath);

      const answer = await this.langchainChatService.answerQuestion(
        text,
        question,
      );

      return { message: answer };
    } catch (error) {
      console.error('Error writing file:', error);
      throw new Error(`File write failed: ${error.message}`);
    }
  }
}
