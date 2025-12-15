import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Scenario, LabTestResult } from '../models/types';

export class PdfGenerator {
  public generate(scenario: Scenario, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);

      doc.pipe(stream);

      // --- Header ---
      doc.fontSize(20).text('General Medical Center', { align: 'center' });
      doc.fontSize(10).text('123 Healthcare Blvd, Medical City, CA 90210', { align: 'center' });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // --- Patient Info ---
      const { patient } = scenario;
      doc.fontSize(12).font('Helvetica-Bold').text('Patient Information');
      doc.font('Helvetica').fontSize(10);
      doc.text(`Name: ${patient.name}`, 50, doc.y + 5);
      doc.text(`Patient ID: ${patient.id}`, 300, doc.y - 10); // Same line
      doc.text(`Age/Sex: ${patient.age} / ${patient.sex}`, 50, doc.y + 5);
      doc.text(`Date: ${patient.examDate}`, 300, doc.y - 10);
      doc.moveDown(2);

      // --- Lab Results Table ---
      this.drawTable(doc, scenario);

      // --- Footer ---
      const bottom = 700;
      doc.fontSize(10).text('Verified by: Dr. A. Smith, M.D.', 50, bottom);
      doc.fontSize(8).text('This report is electronically generated and is valid without a signature.', 50, bottom + 20, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  private drawTable(doc: PDFKit.PDFDocument, scenario: Scenario) {
    const startX = 50;
    let currentY = doc.y;
    const colWidths = [150, 80, 80, 100, 50]; // Name, Result, Unit, RefRange, Flag

    // Headers
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text('Test Name', startX, currentY);
    doc.text('Result', startX + colWidths[0], currentY);
    doc.text('Unit', startX + colWidths[0] + colWidths[1], currentY);
    doc.text('Ref. Range', startX + colWidths[0] + colWidths[1] + colWidths[2], currentY);
    doc.text('Flag', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY);

    currentY += 20;
    doc.moveTo(startX, currentY - 5).lineTo(550, currentY - 5).stroke();

    // Rows
    doc.font('Helvetica').fontSize(10);

    const drawRow = (test: LabTestResult) => {
      doc.text(test.name, startX, currentY);
      doc.text(test.value.toString(), startX + colWidths[0], currentY);
      doc.text(test.unit, startX + colWidths[0] + colWidths[1], currentY);
      doc.text(test.refRange, startX + colWidths[0] + colWidths[1] + colWidths[2], currentY);

      if (test.flag) {
        doc.font('Helvetica-Bold');
        if (test.flag === 'H' || test.flag === 'L') {
          doc.fillColor('red');
        }
        doc.text(test.flag, startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY);
        doc.fillColor('black').font('Helvetica');
      }

      currentY += 20;
    };

    // CBC Section
    doc.font('Helvetica-Bold').text('CBC (Complete Blood Count)', startX, currentY);
    currentY += 20;
    doc.font('Helvetica');
    Object.values(scenario.labResults.cbc).forEach(drawRow);

    currentY += 10;

    // CMP Section
    doc.font('Helvetica-Bold').text('CMP (Comprehensive Metabolic Panel)', startX, currentY);
    currentY += 20;
    doc.font('Helvetica');
    Object.values(scenario.labResults.cmp).forEach(drawRow);

    currentY += 10;

    // Tumor Marker Section
    doc.font('Helvetica-Bold').text('Tumor Markers', startX, currentY);
    currentY += 20;
    doc.font('Helvetica');
    Object.values(scenario.labResults.tumorMarker).forEach(drawRow);
  }
}
