export type TreatmentPhase = 'DIAGNOSIS' | 'ON_TREATMENT' | 'SURVEILLANCE';

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'F'; // Fixed to Female for Breast Cancer scenarios
  examDate: string; // ISO Date
}

export interface LabTestResult {
  name: string;
  value: number;
  unit: string;
  refRange: string;
  flag?: 'H' | 'L';
}

export interface CBC {
  wbc: LabTestResult;
  anc: LabTestResult;
  hb: LabTestResult;
  platelet: LabTestResult;
}

export interface CMP {
  ast: LabTestResult;
  alt: LabTestResult;
  alp: LabTestResult;
  totalBilirubin: LabTestResult;
  creatinine: LabTestResult;
}

export interface TumorMarker {
  ca15_3: LabTestResult;
  cea: LabTestResult;
}

export interface LabResults {
  cbc: CBC;
  cmp: CMP;
  tumorMarker: TumorMarker;
}

export interface ScenarioMetadata {
  clinicalIntent: string;
  expectedAnswerPoints: string[];
}

export interface Scenario {
  caseId: string;
  cancerType: 'BREAST_CANCER';
  treatmentPhase: TreatmentPhase;
  patient: Patient;
  labResults: LabResults;
  scenario: ScenarioMetadata;
}
