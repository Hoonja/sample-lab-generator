import { TreatmentPhase, ScenarioMetadata } from '../models/types';

export interface ScenarioDefinition {
  phase: TreatmentPhase;
  id: string;
  clinicalIntent: string;
  expectedAnswerPoints: string[];
  labModifiers: {
    [key: string]: 'LOW' | 'HIGH' | 'NORMAL' | 'CRITICAL_LOW' | 'CRITICAL_HIGH';
  };
}

export const SCENARIO_DEFINITIONS: ScenarioDefinition[] = [
  // --- DIAGNOSIS PHASE ---
  {
    phase: 'DIAGNOSIS',
    id: 'DIAG_001',
    clinicalIntent: 'Baseline_Normal',
    expectedAnswerPoints: ['초기 진단 시점의 기본 혈액 검사 결과입니다.', '특이 소견 없습니다.'],
    labModifiers: {},
  },
  {
    phase: 'DIAGNOSIS',
    id: 'DIAG_002',
    clinicalIntent: 'Elevated_Tumor_Marker',
    expectedAnswerPoints: ['종양표지자(CA 15-3)가 기준치보다 높습니다.', '추가 정밀 검사가 필요할 수 있습니다.'],
    labModifiers: {
      'TumorMarker.CA15_3': 'HIGH',
    },
  },

  // --- ON_TREATMENT PHASE ---
  {
    phase: 'ON_TREATMENT',
    id: 'TX_001',
    clinicalIntent: 'Neutropenia',
    expectedAnswerPoints: ['호중구 수치가 감소했습니다.', '감염 예방에 주의가 필요합니다.', '발열 시 즉시 내원하세요.'],
    labModifiers: {
      'CBC.ANC': 'LOW',
      'CBC.WBC': 'LOW',
    },
  },
  {
    phase: 'ON_TREATMENT',
    id: 'TX_002',
    clinicalIntent: 'Anemia',
    expectedAnswerPoints: ['헤모글로빈 수치가 낮아 빈혈이 의심됩니다.', '어지러움증에 주의하세요.'],
    labModifiers: {
      'CBC.Hb': 'LOW',
    },
  },
  {
    phase: 'ON_TREATMENT',
    id: 'TX_003',
    clinicalIntent: 'Liver_Toxicity',
    expectedAnswerPoints: ['간 수치가 상승했습니다.', '약물 부작용 가능성이 있으니 의료진 상담이 필요합니다.'],
    labModifiers: {
      'CMP.AST': 'HIGH',
      'CMP.ALT': 'HIGH',
    },
  },

  // --- SURVEILLANCE PHASE ---
  {
    phase: 'SURVEILLANCE',
    id: 'SURV_001',
    clinicalIntent: 'All_Clear',
    expectedAnswerPoints: ['모든 수치가 정상 범위입니다.', '정기 검진을 계속 유지하세요.'],
    labModifiers: {},
  },
  {
    phase: 'SURVEILLANCE',
    id: 'SURV_002',
    clinicalIntent: 'Recurrence_Suspicion',
    expectedAnswerPoints: ['종양표지자 수치가 다시 상승하고 있습니다.', '재발 확인을 위한 영상 검사가 필요할 수 있습니다.'],
    labModifiers: {
      'TumorMarker.CEA': 'HIGH',
      'TumorMarker.CA15_3': 'HIGH',
    },
  },
];
