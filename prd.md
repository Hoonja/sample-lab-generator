# **PRD v1**

  

## **Synthetic Lab Report Generator for Onco-Navi Validation**

---

## **1. 목적 (Purpose)**

  

본 시스템의 목적은 다음 하나이다.

  

> **가상의 암 환자 시나리오를 기반으로, 실제 병원에서 발급된 것처럼 보이는 검사지(PDF)를 반복적으로 생성하여, 온코나비 서비스의 답변 품질을 검증한다.**

  

이를 위해:

- 실제 임상적으로 **있음직한 검사 수치**
    
- 환자가 **업로드할 법한 문서 형태(PDF)**
    
- 온코나비 답변을 평가하기 위한 **기대 포인트 메타데이터**
    

  

를 **한 세트로 생성**한다.

---

## **2. 시스템 범위 (In Scope / Out of Scope)**

  

### **In Scope**

- 가상 환자 시나리오 정의
    
- 시나리오에 부합하는 검사 데이터 생성
    
- 검사 데이터를 구조화한 JSON 생성
    
- JSON을 기반으로 한 **병원 스타일 검사지 PDF 생성**
    

  

### **Out of Scope**

- 실제 환자 데이터 사용
    
- 진단 정확도 평가
    
- 치료 결정 자동화
    
- 실존 병원 서식의 복제
    

---

## **3. 기본 가정 (Assumptions)**

- **암종은 Phase 1에서 1개로 고정**한다.
    
    (예: 유방암)
    
- **치료 단계는 3단계로 고정**한다.
    
- 모든 데이터는 **합법적·비식별·가상 데이터**이다.
    
- 생성된 PDF는 온코나비의 실제 입력과 동일한 역할을 한다.
    

---

## **4. 시나리오 정의 (Scenario Model)**

  

### **4.1 암종**

- Breast Cancer (Phase 1 고정)
    

  

### **4.2 치료 단계 (Treatment Phase)**

|**단계**|**설명**|
|---|---|
|DIAGNOSIS|진단 직후, 치료 전 또는 초기|
|ON_TREATMENT|항암 치료 진행 중|
|SURVEILLANCE|치료 종료 후 추적 관찰|

### **4.3 시나리오 수량 규칙**

- 각 치료 단계별 **10~15개의 가상 케이스**
    
- 총 케이스 수: **30~45개 / 1회 생성**
    
- 각 케이스는 서로 다른 검사 패턴을 가진다.
    

---

## **5. 검사지에 포함되어야 할 기본 데이터**

  

### **5.1 환자 기본 정보 (PDF & JSON 공통)**

|**항목**|**비고**|
|---|---|
|환자 ID|가상 ID|
|성별|Female|
|나이|30~80|
|검사일|ISO Date|
|검사기관명|가상 병원명|

---

### **5.2 검사 항목 (Phase 1 필수)**

  

#### **① CBC**

|**항목**|
|---|
|WBC|
|ANC|
|Hb|
|Platelet|

#### **② CMP**

|**항목**|
|---|
|AST|
|ALT|
|ALP|
|Total Bilirubin|
|Creatinine|

#### **③ Tumor Marker**

|**항목**|
|---|
|CA 15-3|
|CEA|

---

### **5.3 값 생성 규칙 (핵심)**

- 모든 값은 **reference range를 가진다**
    
- 일부 값은:
    
    - 정상 범주
        
    - 경계값
        
    - 경미한 이상
        
    
- 값들은 **임상적으로 연관성을 가진다**
    
    - 예: ANC ↓ → WBC ↓ 가능성 높음
        
    
- ON_TREATMENT 단계에서는:
    
    - 골수억제, 간수치 상승 케이스 포함
        
    

---

## **6. 산출물 정의 (Outputs)**

  

### **6.1 Output 1: Structured Data (JSON)**

  

**각 케이스마다 1개의 JSON을 생성한다.**

  

#### **JSON 구성 요소**

```
{
  "caseId": "UUID",
  "cancerType": "BREAST_CANCER",
  "treatmentPhase": "ON_TREATMENT",
  "patient": {
    "age": 52,
    "sex": "F"
  },
  "labResults": {
    "cbc": { },
    "cmp": { },
    "tumorMarker": { }
  },
  "scenario": {
    "clinicalIntent": "chemotherapy_induced_neutropenia",
    "expectedAnswerPoints": [
      "호중구 감소에 대한 설명",
      "감염 위험 및 주의사항",
      "즉시 병원 방문이 필요한 증상"
    ]
  }
}
```

👉 이 JSON은 **정답 데이터가 아니라 평가 기준 데이터**다.

---

### **6.2 Output 2: Hospital-style Lab Report PDF**

  

**JSON 1개당 PDF 1개 생성**

  

#### **PDF 특성**

- 실제 병원 검사지와 유사한 구성
    
- 포함 요소:
    
    - 병원명(가상)
        
    - 환자 정보
        
    - 검사 테이블
        
    - 단위 / reference range
        
    - 이상치 표시 (H / L)
        
    
- 의료 문서 톤의 footer 문구 포함
    
- 환자가 업로드해도 어색하지 않은 수준의 리얼리티
    

---

## **7. 파이프라인 개요**

```
[Scenario Definition]
        ↓
[Lab Value Generator]
        ↓
[Structured JSON 생성]
        ↓
[Lab Report PDF Renderer]
        ↓
[JSON + PDF 세트 출력]
        ↓
[Onco-Navi 테스트 입력]
```

---

## **8. 성공 기준 (Success Criteria)**

- 임상의 또는 의료 종사자가 보았을 때
    
    **“이 정도면 실제 검사지 같다”**는 평가
    
- 온코나비 답변이:
    
    - 과도한 불안 유발 ❌
        
    - 중요한 주의 사항 누락 ❌
        
    
- 동일 시나리오 유형에서 **답변 일관성 유지**
    

---

## **9. 이 PRD의 성격 (중요)**

- 이 문서는 **기능 추가를 위한 설계서가 아니다**
    
- **테스트를 위한 ‘현실적인 입력물 생성기’ 정의서**다
    
- 모든 설계는 이 질문 하나에 복무한다:
    

  

> “이 PDF를 환자가 올렸을 때, 온코나비는 사람답게 반응하는가?”

---

### **정리 한 줄**

  

> **가상 데이터를 만들기 위한 PRD가 아니라,**

> **‘환자가 업로드할 법한 현실’을 만들기 위한 PRD다.**

---

다음 단계로는 **개념 정의가 아니라 구현 정의**로 넘어갈 수 있어:

- ① PDF 레이아웃 초안 (표 구조)
    
- ② CBC/CMP reference range 실제 수치 정의
    
- ③ 시나리오 30개 목록 초안
    

  

어느 것부터 갈지, 네가 골라줘.