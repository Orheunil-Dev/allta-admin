export type Purchase = {
  username: string;
  mobile: string;
  car_number: string;
  store_name: string;
  purchase_type: string;
  service_type: string;
  total_amount: number;
  stats: string;
  approved_at: string;
};

export type PurchasesStat = {
  date: string;
  total_purchases: number;
  new_purchases: number;
};
