export const REFERENCE_RANGES = {
  CBC: {
    WBC: { min: 4.0, max: 10.0, unit: 'x10^3/uL', str: '4.0 - 10.0' },
    ANC: { min: 1.5, max: 8.0, unit: 'x10^3/uL', str: '1.5 - 8.0' }, // Absolute Neutrophil Count
    Hb: { min: 12.0, max: 16.0, unit: 'g/dL', str: '12.0 - 16.0' },
    Platelet: { min: 150, max: 450, unit: 'x10^3/uL', str: '150 - 450' },
  },
  CMP: {
    AST: { min: 0, max: 40, unit: 'IU/L', str: '0 - 40' },
    ALT: { min: 0, max: 40, unit: 'IU/L', str: '0 - 40' },
    ALP: { min: 40, max: 120, unit: 'IU/L', str: '40 - 120' },
    TotalBilirubin: { min: 0.1, max: 1.2, unit: 'mg/dL', str: '0.1 - 1.2' },
    Creatinine: { min: 0.5, max: 1.1, unit: 'mg/dL', str: '0.5 - 1.1' },
  },
  TumorMarker: {
    CA15_3: { min: 0, max: 30, unit: 'U/mL', str: '< 30' },
    CEA: { min: 0, max: 5.0, unit: 'ng/mL', str: '< 5.0' },
  },
};
