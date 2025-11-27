export type BusinessHours = {
  [K in "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"]?: {
    open: string;
    close: string;
  };
};

export type ServiceType = "AUTO" | "HANDS";
export type PassType = "TICKET" | "STANDARD" | "PREMIUM";
export type CarType = "SEDAN" | "VAN" | "SUV";

export type PassPrice = Partial<
  Record<
    ServiceType,
    Partial<Record<PassType, Record<CarType, number | undefined>>>
  >
>;
