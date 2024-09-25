// src/pdf/pdf.service.ts
import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import { promises as fs } from 'fs';

@Injectable()
export class PdfService {
  async extractText(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }
}
