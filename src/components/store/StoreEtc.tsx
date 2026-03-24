import { useRef, useState } from "react";
import axios from "axios";
import Select, { StylesConfig } from "react-select";
import { useWeatherControllerUpdatePastWeatherHistories } from "@/api/weather/weather";
import { UpdatePastWeatherHistoriesRequest } from "@/api/models";
import { formatDate, regexDate } from "@/utils";
import { SelectOption } from "@/types";
import { Callout } from "../ui/Callout";
import { STN_LIST } from "@/constants/weather";

interface Props {
  storeId: string;
}

const stnOptions = STN_LIST.map((o, i) => ({
  label: o.city,
  value: `${o.stn}-${o.city}`,
}));

export const StoreEtc = ({ storeId }: Props) => {
  if (!storeId.trim()) return;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [salesLoading, setSalesLoading] = useState(false);
  const [weatherForm, setWeatherForm] =
    useState<UpdatePastWeatherHistoriesRequest>({
      storeId,
      startDate: "",
      endDate: "",
      stn: "",
    });

  // 과거 날씨 내역 불러오기 API
  const {
    mutate: updateWeather,
    isPending: updateWeatherLoading,
    isError: updateWeatherError,
  } = useWeatherControllerUpdatePastWeatherHistories();

  // 파일 선택
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
  };

  // 과거 매출 업로드
  const handleUpdateSales = async () => {
    if (!file) {
      return alert("파일을 선택해주세요.");
    }

    const allowedExtensions = [".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();

    if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
      return alert(".xlsx 또는 .xls 확장자만 업로드 할 수 있습니다.");
    }

    try {
      setSalesLoading(true);

      const formData = new FormData();
      formData.append("storeId", storeId);
      formData.append("file", file);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("과거 매출 업로드 완료");
      return setFile(null);
    } catch (error: any) {
      console.error(error);

      return alert(
        error?.response?.data?.message ?? "파일 업로드 중 오류가 발생했습니다.",
      );
    } finally {
      setSalesLoading(false);
    }
  };

  const handleChangeWeatherForm = (
    key: keyof UpdatePastWeatherHistoriesRequest,
    value: any,
  ) => {
    setWeatherForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // 과거 날씨 내역 불러오기
  const handleUpdateWeather = () => {
    const stn = weatherForm.stn.split("-")[0];

    const isValidStn = STN_LIST.some((o) => String(o.stn) === stn);

    if (!isValidStn) {
      return alert("올바른 지역을 선택해주세요.");
    }

    if (
      !weatherForm.startDate.trim() ||
      !regexDate.test(weatherForm.startDate)
    ) {
      return alert("시작 날짜 형식이 올바르지 않습니다.");
    }

    if (!weatherForm.endDate.trim() || !regexDate.test(weatherForm.endDate)) {
      return alert("종료 날짜 형식이 올바르지 않습니다.");
    }

    return updateWeather(
      {
        data: {
          ...weatherForm,
          stn,
        },
      },
      {
        onSuccess: () => {
          alert("날씨 내역 불러오기에 성공했습니다.");

          // return setWeatherForm((prev) => ({
          //   ...prev,
          //   startDate: "",
          //   endDate: "",
          // }));
        },
        onError: (error: any) => {
          console.log(error);

          return alert(
            error.message ?? "날씨 내역을 불러오는 중 오류가 발생했습니다.",
          );
        },
      },
    );
  };

  return (
    <div className="flex flex-col">
      <Callout margin="20px 0 0 0" padding="20px 32px">
        <p className="text-[16px] font-semibold">매출 내역 불러오기</p>

        <div className="flex mt-[24px]">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-[76px] h-[34px] mr-[16px] text-[14px] font-medium bg-gray1 rounded-[8px] cursor-pointer"
          >
            파일 선택
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleChangeFile}
            className="hidden"
          />

          <div className="flex items-center w-[236px] h-[34px] px-[12px] text-[14px] border border-gray2 rounded-[6px] overflow-hidden">
            {file ? file.name : "선택된 파일이 없습니다."}
          </div>
        </div>

        <button
          onClick={handleUpdateSales}
          disabled={salesLoading || file === null}
          className="mt-[24px] w-[100px] h-[36px] text-white text-[14px] font-semibold bg-main rounded-[20px] cursor-pointer"
        >
          불러오기
        </button>
      </Callout>

      <Callout margin="20px 0 0 0" padding="20px 32px">
        <p className="text-[16px] font-semibold">날씨 내역 불러오기</p>

        <div className="flex items-center mt-[24px] text-[16px]">
          <p className="w-[100px] text-gray5">날짜</p>

          <input
            value={weatherForm.startDate}
            onChange={(e) =>
              handleChangeWeatherForm("startDate", formatDate(e.target.value))
            }
            maxLength={10}
            placeholder="YYYY-MM-DD"
            className="w-[130px] h-[34px] px-[12] text-[14px] border border-gray2 rounded-[6px]"
          />
          <p className="mx-[8px]">~</p>
          <input
            value={weatherForm.endDate}
            onChange={(e) =>
              handleChangeWeatherForm("endDate", formatDate(e.target.value))
            }
            maxLength={10}
            placeholder="YYYY-MM-DD"
            className="w-[130px] h-[34px] px-[12] text-[14px] border border-gray2 rounded-[6px]"
          />
        </div>

        <div className="flex items-center mt-[20px] text-[16px]">
          <p className="w-[100px] text-gray5">지역</p>

          <Select<SelectOption>
            options={stnOptions}
            value={stnOptions.find(
              (option) => option.value === weatherForm.stn,
            )}
            onChange={(option) => {
              if (option) {
                handleChangeWeatherForm("stn", option.value);
              }
            }}
            components={{
              IndicatorSeparator: () => null,
            }}
            isSearchable={true}
            placeholder="선택"
            styles={selectStyles}
          />
        </div>

        <button
          onClick={handleUpdateWeather}
          disabled={updateWeatherLoading}
          className="mt-[24px] w-[100px] h-[36px] text-white text-[14px] font-semibold bg-main rounded-[20px] cursor-pointer"
        >
          불러오기
        </button>
      </Callout>
    </div>
  );
};

const selectStyles: StylesConfig<SelectOption> = {
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
    width: "160px",
    height: "34px",
    padding: "0 10px",
    borderWidth: "1px",
    borderColor: "#DDDDDF",
    borderRadius: "6px",
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
