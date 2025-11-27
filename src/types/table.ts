export type SearchKey = {
  key: string;
  label: string;
  width?: string;
  maxLength?: number;
};

export type SelectKey = {
  key: string;
  label: string;
  options: SelectOption[];
};

export type RangeKey = {
  key: string;
  label: string;
};

export type SelectOption = {
  value: string | boolean | null | undefined;
  label: string;
};
