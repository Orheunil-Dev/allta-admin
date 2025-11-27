export type Category = {
  main_category: string | null;
  sub_category: string | null;
  minor_category: string | null;
  sub_minor_category: string | null;
  category_value: string | null;
  value_type: string | null;
  description: string | null;
};

export type CategoryFormValues = {
  main_category: string;
  sub_category: string | null;
  minor_category: string | null;
  sub_minor_category: string | null;
  category_value: string | null;
  value_type: string | null;
  description: string | null;
};
