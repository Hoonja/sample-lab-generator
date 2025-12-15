import fs from 'fs';
import path from 'path';
import { SCENARIO_DEFINITIONS } from './generators/scenario-definitions';
import { LabGenerator } from './generators/lab-generator';
import { PdfGenerator } from './renderer/pdf-generator';

const OUTPUT_DIR = path.join(__dirname, '../output');
const JSON_DIR = path.join(OUTPUT_DIR, 'json');
const PDF_DIR = path.join(OUTPUT_DIR, 'pdf');

const CASES_PER_SCENARIO = 5; // 7 definitions * 5 = 35 cases

async function main() {
  // Ensure output directories exist
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
  if (!fs.existsSync(JSON_DIR)) fs.mkdirSync(JSON_DIR);
  if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR);

  const labGenerator = new LabGenerator();
  const pdfGenerator = new PdfGenerator();

  console.log('Starting Synthetic Lab Report Generation...');

  let totalCases = 0;

  for (const def of SCENARIO_DEFINITIONS) {
    console.log(`Generating cases for scenario: ${def.id} (${def.clinicalIntent})`);

    for (let i = 0; i < CASES_PER_SCENARIO; i++) {
      const scenario = labGenerator.generateScenario(def);

      // Filename convention: [Phase]_[ScenarioID]_[CaseID]
      const filename = `${def.phase}_${def.id}_${scenario.caseId}`;

      // Save JSON
      const jsonPath = path.join(JSON_DIR, `${filename}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(scenario, null, 2));

      // Generate PDF
      const pdfPath = path.join(PDF_DIR, `${filename}.pdf`);
      await pdfGenerator.generate(scenario, pdfPath);

      totalCases++;
    }
  }

  console.log(`\nGeneration Complete!`);
  console.log(`Total Cases Generated: ${totalCases}`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);
}

main().catch(console.error);
