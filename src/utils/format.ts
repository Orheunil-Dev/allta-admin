export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");

  switch (true) {
    case digits.length <= 3:
      return digits;

    case digits.length <= 7:
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}`;

    default:
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
};

export const formatDate = (value: string) => {
  const digits = value.replace(/\D/g, "");

  switch (true) {
    case digits.length <= 4:
      return digits;

    case digits.length <= 6:
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;

    default:
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  }
};

export const formatTotalCount = (contentRange: string | null): number => {
  if (!contentRange) return 0;

  const parts = contentRange.split("/");

  if (parts.length === 2) {
    const total = parseInt(parts[1], 10);

    return isNaN(total) ? 0 : total;
  }

  return 0;
};

export const formatPurchaseType = (value: string) => {
  switch (value) {
    case "SUBS":
      return "구독권";

    case "TICKET":
      return "일회권";

    case "PERP":
      return "일회권";

    case null:
      return "-";

    default:
      return value;
  }
};

export const formatServiceType = (value: string) => {
  switch (value) {
    case "AUTO":
      return "자동세차";

    case "HANDS":
      return "핸즈클리닝";

    case "ALLINONE":
      return "올인원";

    case "VISIT":
      return "방문세차";

    default:
      return value;
  }
};

export const formatPassType = (value: string) => {
  switch (value) {
    case "TICKET":
      return "일회권";

    case "STANDARD":
      return "스탠다드";

    case "PREMIUM":
      return "프리미엄";

    case "OFFLINE_TICKET":
      return "현장권";

    default:
      return value;
  }
};

export const formatSubscriptionStatus = (value: string) => {
  switch (value) {
    case "ACTIVE":
      return "구독 중";

    case "DISCONTINUED":
      return "구독 중단";

    case "STOPPED":
      return "구독 만료";

    case "REFUNDED":
      return "환불";

    case "ERROR":
      return "결제 오류";

    case "DELETED":
      return "삭제";

    default:
      return value;
  }
};

export const formatTicketStatus = (value: string) => {
  switch (value) {
    case "ACTIVE":
      return "사용 가능";

    case "USED":
      return "사용 완료";

    case "REFUNDED":
      return "환불";

    case "DELETED":
      return "삭제";

    default:
      return value;
  }
};

export const formatProductType = (value: string) => {
  switch (value) {
    case "TICKET":
      return "일회권";

    case "STANDARD":
      return "스탠다드";

    case "PREMIUM":
      return "프리미엄";

    case "OFFLINE_TICKET":
      return "현장권";

    default:
      return value;
  }
};

export const formatPaymentStatus = (value: string) => {
  switch (value) {
    case "APPROVED":
      return "결제완료";

    case "PARTIAL_REFUNDED":
      return "부분환불";

    case "REFUNDED":
      return "전체환불";

    default:
      return value;
  }
};

export const formatCouponType = (value: string) => {
  switch (value) {
    case "WELCOME":
      return "신규가입 쿠폰";

    case "REFERRAL":
      return "친구추천 쿠폰";

    case "PROMOTION":
      return "프로모션 쿠폰";

    case "RECEIPT":
      return "주유영수증 쿠폰";

    case "ONE_TIME":
      return "일회성 쿠폰";

    default:
      return value;
  }
};

export const formatDiscountValue = (type: string, value: number) => {
  switch (type) {
    case "RATE":
      return `- ${value}%`;

    case "PRICE":
      return `- ${value}원`;

    case "FIXED":
      return `${value}원 특가`;

    default:
      return value;
  }
};

// 결제수단 포매팅
export const formatPaymentMethod = (value: string) => {
  switch (value) {
    case "KIOSK_CARD":
      return "카드";

    case "KIOSK_CASH":
      return `현금`;

    case "KIOSK_VOUCHER":
      return "현금보관증";

    default:
      return value;
  }
};
