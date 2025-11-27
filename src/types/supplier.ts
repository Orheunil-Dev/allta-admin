export type Supplier = {
  username: string;
  mobile: string;
  email: string;
  grant: string;
  stores: string[];
  created_at: string;
};

export type SupplierFormValues = {
  username: string;
  email: string;
  mobile: string;
  reg_codes: string[];
  job_title: string | null;
  emp_class: string | null;
  income_class: string | null;
  default_pay: number | null;
  address: string | null;
  bank_account: string | null;
};
