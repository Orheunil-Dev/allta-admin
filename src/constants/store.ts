export const storeTypes = [
  { value: "1", label: "노브러쉬" },
  { value: "2", label: "브러쉬" },
  { value: "3", label: "노브러쉬 + 브러쉬" },
];

export const storeClasses = [
  { value: "", label: "미선택" },
  { value: "입점", label: "입점" },
  { value: "제휴", label: "제휴" },
];

export const usable = [
  { value: "Y", label: "등록" },
  { value: "N", label: "미등록" },
];

export const displayable = [
  { value: "Y", label: "표시" },
  { value: "N", label: "미표시" },
];

export const storeTags = [
  "브러시",
  "노브러시",
  "하부세차",
  "프리워시",
  "버블",
  "물기제거",
];

export const carTypes = [
  { value: "SEDAN", label: "승용" },
  { value: "SUV", label: "SUV" },
  { value: "VAN", label: "승합" },
] as const;

export const passTypes = [
  { key: "TICKET", label: "일회권" },
  { key: "STANDARD", label: "스탠다드" },
  { key: "PREMIUM", label: "프리미엄" },
];

export const serviceTypes = [
  { key: "AUTO", label: "자동세차" },
  { key: "HANDS", label: "핸즈클리닝" },
];

export const dicountTypes = [
  { key: "PRICE", label: "할인액" },
  { key: "RATE", label: "할인율" },
  { key: "FIXED", label: "특가" },
];

export const defaultDescription =
  "<p>올타 주유소는 바쁜 일상 속에서도 차량 관리를 놓치지 않도록 도심 한복판에서 빠르고 간편한 자동세차 서비스를 제공합니다.<p><br/><p>✅ 최신 자동세차기 도입</p><p>✅ SUV도 가능한 넓은 세차 공간</p><p>✅ 일회권 / 스탠다드 / 프리미엄 모두 사용 가능</p><p>✅ 주차 대기 없이 QR만 찍으면 바로 입장!</p>";

export const defaultPolicy =
  "<p>[이용 불가 차량]<p><br/><p>• 전고2.1m, 전폭2m 중 조건이상 기준을 초과한 차량</p><p>• 컨버터블</p><p>• 뉴카이엔(2018년 이전모델)</p>";
