import { StylesConfig } from "react-select";
import { RangeKey, SelectOption } from "@/types";

const isMobile = typeof window !== "undefined" && window.innerWidth <= 767;

export const tableSelectStyles: StylesConfig<SelectOption> = {
  container: (provided) => ({
    ...provided,
    fontSize: "14px",
    zIndex: 3,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  control: (provided) => ({
    ...provided,
    width: "140px",
    minHeight: "34px",
    padding: "6px 10px",
    borderWidth: "1px",
    borderColor: "#DDDDDF",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
    fontSize: "14px",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
    fontSize: "14px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    width: "85px",
    padding: 0,
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    width: "148px",
    borderRadius: "8px",
    overflow: "hidden",
    fontSize: "14px",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "14px",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#262627",
    fontWeight: "600",
    fontSize: "14px",
    padding: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "14px",
  }),
};

export const mobileTableSelectStyles: StylesConfig<SelectOption> = {
  container: (provided) => ({
    ...provided,
    fontSize: "12px",
    zIndex: 3,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "12px",
  }),
  control: (provided) => ({
    ...provided,
    width: "140px",
    minHeight: "34px",
    padding: "6px 10px",
    borderWidth: "1px",
    borderColor: "#DDDDDF",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
    fontSize: "12px",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
    fontSize: "12px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    width: "85px",
    padding: 0,
    fontSize: "12px",
  }),
  menu: (provided) => ({
    ...provided,
    width: "148px",
    borderRadius: "8px",
    overflow: "hidden",
    fontSize: "12px",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "12px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "12px",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#262627",
    fontWeight: "600",
    fontSize: "12px",
    padding: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "12px",
  }),
};

export const sortingSelectStyles: StylesConfig<RangeKey, false> = {
  control: (provided, state) => ({
    ...provided,
    height: "34px",
    minHeight: "34px",
    fontSize: isMobile ? "12px" : "14px",
    border: "none",
    cursor: "pointer",
  }),
  input: (provided, state) => ({
    ...provided,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    width: "85px",
    padding: 0,
  }),
  menu: (provided, state) => ({
    ...provided,
    width: "148px",
    borderRadius: "8px",
    overflow: "hidden",
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "14px",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#262627",
    fontWeight: "600",
    fontSize: isMobile ? "12px" : "14px",
    padding: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
  }),
};

export const mobileSortingSelectStyles: StylesConfig<RangeKey, false> = {
  control: (provided, state) => ({
    ...provided,
    height: "34px",
    minHeight: "34px",
    fontSize: "12px",
    border: "none",
    cursor: "pointer",
  }),
  input: (provided, state) => ({
    ...provided,
    fontSize: "12px",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    width: "85px",
    padding: 0,
    fontSize: "12px",
  }),
  menu: (provided, state) => ({
    ...provided,
    width: "148px",
    borderRadius: "8px",
    overflow: "hidden",
    fontSize: "12px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: 0,
    fontSize: "12px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "12px",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#262627",
    fontWeight: "600",
    fontSize: "12px",
    padding: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "12px",
  }),
};

export const periodSelectStyles: StylesConfig<SelectOption> = {
  container: (provided) => ({
    ...provided,
    fontSize: "14px",
    zIndex: 3,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  control: (provided) => ({
    ...provided,
    width: "80px",
    minHeight: "34px",
    padding: "6px 10px",
    borderWidth: "1px",
    borderColor: "#DDDDDF",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
    fontSize: "14px",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
    fontSize: "14px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    width: "85px",
    padding: 0,
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    width: "148px",
    borderRadius: "8px",
    overflow: "hidden",
    fontSize: "14px",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "14px",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#262627",
    fontWeight: "600",
    fontSize: "14px",
    padding: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "14px",
  }),
};
