import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LangchainChatModule } from './langchain-chat/langchain-chat.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [LangchainChatModule, PdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
