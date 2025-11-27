import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Select, { SingleValue } from "react-select";
import { formatDate, formatPhoneNumber } from "@/utils";
import { RangeKey, SearchKey, SelectKey, SelectOption } from "@/types";
import { resetIcon, searchIcon } from "../../../../public/images";
import {
  mobileTableSelectStyles,
  sortingSelectStyles,
  tableSelectStyles,
} from "@/styles";
import { useResizeHandler } from "@/hooks";

interface Props {
  searchKeys?: SearchKey[];
  searchTerms?: Record<string, string | boolean | null | undefined>;
  setSearchTerms?: Dispatch<
    SetStateAction<Record<string, string | boolean | null | undefined>>
  >;
  selectKeys?: SelectKey[];
  rangeKeys?: RangeKey[];
  rangeFilter?: { key?: string; gte?: string; lte?: string };
  setRangeFilter?: Dispatch<
    SetStateAction<{ key?: string; gte?: string; lte?: string }>
  >;
  onSearch?: () => void;
  onReset?: () => void;
}

export const Filter = ({
  searchKeys,
  searchTerms,
  setSearchTerms,
  selectKeys,
  rangeKeys,
  rangeFilter,
  setRangeFilter,
  onSearch,
  onReset,
}: Props) => {
  const { isMobile } = useResizeHandler();

  const handleChangeSearch = (key: string, value: string) => {
    setSearchTerms?.((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeSelect = (
    key: string,
    value: string | boolean | null | undefined
  ) => {
    if (!setSearchTerms) return;

    setSearchTerms((prev) => {
      const updated = { ...prev };

      if (value === undefined) {
        delete updated[key];
      } else {
        updated[key] = value;
      }

      return updated;
    });
  };
  const handleChangeRange = (field: "key" | "gte" | "lte", value: string) => {
    setRangeFilter?.((prev) => ({ ...prev, [field]: value }));
  };

  const renderButton = () => (
    <div className="flex">
      <button
        type="button"
        onClick={onSearch}
        className="flex justify-center items-center w-[88px] h-[36px] bg-main rounded-[8px] cursor-pointer"
      >
        <Image
          src={searchIcon}
          alt="검색"
          className="w-[16px] h-[16px] mr-[6px]"
        />
        <p className="text-white text-[14px] font-semibold">검색</p>
      </button>

      <button
        type="button"
        onClick={onReset}
        className="flex justify-center items-center w-[88px] h-[36px] ml-[10px] bg-white border border-gray2 rounded-[8px] cursor-pointer"
      >
        <Image
          src={resetIcon}
          alt="초기화"
          className="w-[16px] h-[16px] mr-[6px]"
        />
        <p className="text-gray5 text-[14px] font-semibold">초기화</p>
      </button>
    </div>
  );

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSearch?.();
        }
      }}
      style={{ boxShadow: "0 4px 10px 2px rgba(38,38,39,0.04)" }}
      className="flex w-full px-[32px] py-[20px] bg-white rounded-[20px] z-[2]"
    >
      <div className="flex flex-col w-full overflow-x-auto overflow-y-hidden">
        {/* 검색 필터 */}
        {searchKeys && (
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-x-[32px]">
              {searchKeys.map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <p className="mr-[10px] text-[12px] md:text-[14px] font-semibold whitespace-nowrap">
                    {item.label}
                  </p>

                  <input
                    value={String(searchTerms?.[item.key] ?? "")}
                    onChange={(e) =>
                      handleChangeSearch(
                        item.key,
                        item.key === "phoneNumber"
                          ? formatPhoneNumber(e.target.value)
                          : e.target.value
                      )
                    }
                    maxLength={item.maxLength ?? 30}
                    style={item.width ? { width: `${item.width}` } : {}}
                    className="px-[8px] py-[4px] text-[12px] md:text-[14px] border border-gray2  rounded-[8px]"
                  />
                </div>
              ))}
            </div>

            {!selectKeys && !rangeKeys && renderButton()}
          </div>
        )}

        {/* 셀렉트 필터 */}
        <div
          className={`flex justify-between items-center w-full ${
            selectKeys && `mt-[12px] md:mt-[20px]`
          }`}
        >
          <div className="flex items-center gap-x-[12px]">
            {selectKeys && selectKeys.length > 0 && (
              <div className="flex items-center gap-x-[32px]">
                {selectKeys.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <p className="mr-[10px] text-[12px] md:text-[14px] font-semibold whitespace-nowrap">
                      {item.label}
                    </p>

                    <Select<SelectOption>
                      options={item.options}
                      value={
                        item.options.find(
                          (option) => option.value === searchTerms?.[item.key]
                        ) ?? { value: null, label: "전체" }
                      }
                      onChange={(opt) => {
                        if (opt?.value === null) {
                          handleChangeSelect(item.key, null);
                        } else if (opt?.value === undefined) {
                          handleChangeSelect(item.key, undefined);
                        } else {
                          handleChangeSelect(item.key, opt.value);
                        }
                      }}
                      components={{ IndicatorSeparator: () => null }}
                      isSearchable={false}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      styles={
                        isMobile ? mobileTableSelectStyles : tableSelectStyles
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectKeys && !rangeKeys && renderButton()}
        </div>

        {/* 기간 필터 */}
        <div
          className={`flex justify-between items-center w-full ${
            rangeKeys && rangeFilter && `mt-[12px] md:mt-[20px]`
          }`}
        >
          {rangeKeys && rangeFilter && (
            <div className="flex items-center gap-x-[12px]">
              <Select
                options={rangeKeys}
                value={
                  rangeKeys.find((opt) => opt.key === rangeFilter.key) ??
                  rangeKeys[0]
                }
                onChange={(opt: SingleValue<RangeKey>) =>
                  handleChangeRange("key", opt?.key ?? "")
                }
                components={{ IndicatorSeparator: () => null }}
                isSearchable={false}
                styles={sortingSelectStyles}
              />
              <input
                value={rangeFilter.gte ?? ""}
                onChange={(e) =>
                  handleChangeRange("gte", formatDate(e.target.value))
                }
                maxLength={10}
                placeholder="YYYY-MM-DD"
                className="w-[130px] px-[12px] py-[6px] ml-[20px] text-[12px] md:text-[14px] border border-gray2 rounded-[8px]"
              />
              <p className="mx-[8px] text-[12px] md:text-[14px]">~</p>
              <input
                value={rangeFilter.lte ?? ""}
                onChange={(e) =>
                  handleChangeRange("lte", formatDate(e.target.value))
                }
                maxLength={10}
                placeholder="YYYY-MM-DD"
                className="w-[130px] px-[12px] py-[6px] mr-[60px] text-[12px] md:text-[14px] border border-gray2 rounded-[8px]"
              />
            </div>
          )}

          {rangeKeys && renderButton()}
        </div>
      </div>
    </div>
  );
};
