import { Module } from '@nestjs/common';
import { LangchainChatService } from './langchain-chat.service';
import { LangchainChatController } from './langchain-chat.controller';
import { PdfService } from 'src/pdf/pdf.service';

@Module({
  controllers: [LangchainChatController],
  providers: [LangchainChatService, PdfService],
})
export class LangchainChatModule {}
