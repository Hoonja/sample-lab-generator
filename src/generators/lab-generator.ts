import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { REFERENCE_RANGES } from '../data/constants';
import {
  Patient, LabResults, Scenario, LabTestResult,
  CBC, CMP, TumorMarker, TreatmentPhase
} from '../models/types';
import { ScenarioDefinition } from './scenario-definitions';

export class LabGenerator {

  private generateValue(
    min: number,
    max: number,
    modifier: 'LOW' | 'HIGH' | 'NORMAL' | 'CRITICAL_LOW' | 'CRITICAL_HIGH' = 'NORMAL'
  ): number {
    const range = max - min;
    let value: number;

    switch (modifier) {
      case 'LOW':
        // 10-30% below min
        value = min - (min * faker.number.float({ min: 0.1, max: 0.3 }));
        break;
      case 'CRITICAL_LOW':
        // 30-60% below min
        value = min - (min * faker.number.float({ min: 0.3, max: 0.6 }));
        break;
      case 'HIGH':
        // 10-50% above max
        value = max + (max * faker.number.float({ min: 0.1, max: 0.5 }));
        break;
      case 'CRITICAL_HIGH':
        // 50-200% above max
        value = max + (max * faker.number.float({ min: 0.5, max: 2.0 }));
        break;
      case 'NORMAL':
      default:
        value = faker.number.float({ min, max });
        break;
    }
    return parseFloat(value.toFixed(2));
  }

  private getFlag(value: number, min: number, max: number): 'H' | 'L' | undefined {
    if (value < min) return 'L';
    if (value > max) return 'H';
    return undefined;
  }

  private createTestResult(
    name: string,
    ref: { min: number, max: number, unit: string, str: string },
    modifier: 'LOW' | 'HIGH' | 'NORMAL' | 'CRITICAL_LOW' | 'CRITICAL_HIGH' = 'NORMAL'
  ): LabTestResult {
    const value = this.generateValue(ref.min, ref.max, modifier);
    return {
      name,
      value,
      unit: ref.unit,
      refRange: ref.str,
      flag: this.getFlag(value, ref.min, ref.max)
    };
  }

  public generateScenario(def: ScenarioDefinition): Scenario {
    // Generate Patient
    const patient: Patient = {
      id: uuidv4().substring(0, 8).toUpperCase(),
      name: faker.person.fullName({ sex: 'female' }),
      age: faker.number.int({ min: 30, max: 80 }),
      sex: 'F',
      examDate: new Date().toISOString().split('T')[0]
    };

    // Helper to get modifier for a specific test
    const getMod = (key: string) => def.labModifiers[key] || 'NORMAL';

    // Generate CBC
    const cbc: CBC = {
      wbc: this.createTestResult('WBC', REFERENCE_RANGES.CBC.WBC, getMod('CBC.WBC')),
      anc: this.createTestResult('ANC', REFERENCE_RANGES.CBC.ANC, getMod('CBC.ANC')),
      hb: this.createTestResult('Hb', REFERENCE_RANGES.CBC.Hb, getMod('CBC.Hb')),
      platelet: this.createTestResult('Platelet', REFERENCE_RANGES.CBC.Platelet, getMod('CBC.Platelet'))
    };

    // Clinical Correlation: If ANC is low, WBC should likely be low or normal-low
    // This is a simple override logic
    if (def.labModifiers['CBC.ANC'] === 'LOW' && getMod('CBC.WBC') === 'NORMAL') {
      // Force WBC to be on the lower end or slightly low
      // For simplicity, let's just leave it random within normal or let the modifier handle it.
      // But strictly speaking, ANC is part of WBC. 
      // If ANC < 1.5, WBC is likely < 4.0 or close to it.
      // Let's not overcomplicate for v1 unless requested.
    }

    // Generate CMP
    const cmp: CMP = {
      ast: this.createTestResult('AST', REFERENCE_RANGES.CMP.AST, getMod('CMP.AST')),
      alt: this.createTestResult('ALT', REFERENCE_RANGES.CMP.ALT, getMod('CMP.ALT')),
      alp: this.createTestResult('ALP', REFERENCE_RANGES.CMP.ALP, getMod('CMP.ALP')),
      totalBilirubin: this.createTestResult('Total Bilirubin', REFERENCE_RANGES.CMP.TotalBilirubin, getMod('CMP.TotalBilirubin')),
      creatinine: this.createTestResult('Creatinine', REFERENCE_RANGES.CMP.Creatinine, getMod('CMP.Creatinine'))
    };

    // Generate Tumor Markers
    const tumorMarker: TumorMarker = {
      ca15_3: this.createTestResult('CA 15-3', REFERENCE_RANGES.TumorMarker.CA15_3, getMod('TumorMarker.CA15_3')),
      cea: this.createTestResult('CEA', REFERENCE_RANGES.TumorMarker.CEA, getMod('TumorMarker.CEA'))
    };

    return {
      caseId: uuidv4(),
      cancerType: 'BREAST_CANCER',
      treatmentPhase: def.phase,
      patient,
      labResults: { cbc, cmp, tumorMarker },
      scenario: {
        clinicalIntent: def.clinicalIntent,
        expectedAnswerPoints: def.expectedAnswerPoints
      }
    };
  }
}
