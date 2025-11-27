export const days = [
  { value: "MON", label: "월" },
  { value: "TUE", label: "화" },
  { value: "WED", label: "수" },
  { value: "THU", label: "목" },
  { value: "FRI", label: "금" },
  { value: "SAT", label: "토" },
  { value: "SUN", label: "일" },
] as const;

export const hours = [
  { value: "00", label: "00" },
  { value: "01", label: "01" },
  { value: "02", label: "02" },
  { value: "03", label: "03" },
  { value: "04", label: "04" },
  { value: "05", label: "05" },
  { value: "06", label: "06" },
  { value: "07", label: "07" },
  { value: "08", label: "08" },
  { value: "09", label: "09" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
  { value: "14", label: "14" },
  { value: "15", label: "15" },
  { value: "16", label: "16" },
  { value: "17", label: "17" },
  { value: "18", label: "18" },
  { value: "19", label: "19" },
  { value: "20", label: "20" },
  { value: "21", label: "21" },
  { value: "22", label: "22" },
  { value: "23", label: "23" },
];

export const minutes = [
  { value: "00", label: "00" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
  { value: "40", label: "40" },
  { value: "50", label: "50" },
];

export const userDeletedOptions = [
  { value: null, label: "전체" },
  { value: false, label: "활동 회원" },
  { value: true, label: "탈퇴 회원" },
];

export const userMarketingOptions = [
  { value: null, label: "전체" },
  { value: true, label: "수신 동의" },
  { value: false, label: "수신 거부" },
];

export const userBannedOptions = [
  { value: null, label: "전체" },
  { value: false, label: "활동 회원" },
  { value: true, label: "정지 회원" },
];

export const subscriptionTypeOptions = [
  { value: null, label: "전체" },
  { value: "PREMIUM", label: "프리미엄" },
  { value: "STANDARD", label: "스탠다드" },
];

export const subscriptionStatusOptions = [
  { value: null, label: "전체" },
  { value: "ACTIVE", label: "구독 중" },
  { value: "DISCONTINUED", label: "구독 중단" },
  { value: "STOPPED", label: "구독 만료" },
  { value: "REFUNDED", label: "환불" },
  { value: "ERROR", label: "결제 오류" },
  { value: "DELETED", label: "삭제" },
];

export const ticketStatusOptions = [
  { value: null, label: "전체" },
  { value: "ACTIVE", label: "사용 가능" },
  { value: "USED", label: "사용 완료" },
  { value: "REFUNDED", label: "환불" },
  { value: "DELETED", label: "삭제" },
];

export const couponTypeOptions = [
  { value: null, label: "전체" },
  { value: "WELCOME", label: "신규가입 쿠폰" },
  { value: "REFERRAL", label: "친구추천 쿠폰" },
  { value: "PROMOTION", label: "프로모션 쿠폰" },
  { value: "RECEIPT", label: "주유영수증 쿠폰" },
  { value: "ONE_TIME", label: "일회성 쿠폰" },
];

export const passTypeOptions = [
  { value: undefined, label: "선택" },
  { value: null, label: "전체" },
  { value: "TICKET", label: "일회권" },
  { value: "STANDARD", label: "스탠다드" },
  { value: "PREMIUM", label: "프리미엄" },
];

export const serviceTypeOptions = [
  { value: undefined, label: "선택" },
  { value: null, label: "전체" },
  { value: "AUTO", label: "자동세차" },
  { value: "HANDS", label: "핸즈클리닝" },
];

export const faqCategoryOptions = [
  { value: null, label: "전체" },
  { value: "결제", label: "결제" },
  { value: "로그인", label: "로그인" },
  { value: "서비스이용", label: "서비스이용" },
  { value: "회원정보", label: "회원정보" },
];

export const periodOptions = [
  { value: "DAY", label: "일" },
  { value: "WEEK", label: "주" },
  { value: "MONTH", label: "월" },
];
