export type Coupon = {
  id: string;
  coupon_type: string;
  purchase_type: string;
  target_service: string;
  target_store?: {
    id: string;
    store_name: string;
  };
  discount_price?: number;
  discount_rate?: number;
  start_date: string;
  end_date: string;
};

export type CouponRegisterFormValues = {
  coupon_type: string | null;
  target_service: string | null;
  purchase_type: string | null;
  discount_rate: number | null;
  discount_price: number | null;
  target_store: string | null;
  isssue_number: number | null;
  start_date: string;
  end_date: string;
  secret_code: string | null;
  use_yn: string;
};

export type UseYn = {
  label: string;
  value: string;
};
