export type CarModel = {
  car_vendor: string;
  car_model: string | null;
  car_type: string | null;
  etc: string | null;
  use_yn: string;
};

export type CarModelFormValues = {
  car_vendor: string;
  car_type: string | null;
  car_model: string | null;
  etc: string | null;
  use_yn: string;
};
