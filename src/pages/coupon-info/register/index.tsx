import { useState } from "react";
import { useRouter } from "next/router";
import { useCouponControllerRegisterCouponInfo } from "@/api/coupon/coupon";
import { RegisterCouponInfoRequest } from "@/api/models";
import Select from "react-select";
import {
  couponTypeOptions,
  dicountTypes,
  passTypes,
  serviceTypes,
} from "@/constants";
import { tableSelectStyles } from "@/styles";
import { SelectOption } from "@/types";
import { formatDate } from "@/utils";
import Image from "next/image";
import {
  activeRadioButton,
  inactiveRadioButton,
} from "../../../../public/images";

export default function CouponRegister() {
  const router = useRouter();

  const [couponInfo, setCouponInfo] = useState<RegisterCouponInfoRequest>({
    name: "",
    type: "PROMOTION",
    passType: null,
    serviceType: null,
    code: null,
    discountType: "PRICE",
    discountValue: 0,
    startDate: null,
    endDate: null,
    validDays: 30,
    maxQuantity: null,
  });

  // 쿠폰 등록 API
  const {
    mutate: registerCouponInfo,
    isPending: registerCouponInfoLoading,
    isError: registerCouponInfoError,
  } = useCouponControllerRegisterCouponInfo();

  // 쿠폰 등록
  const handleRegisterCouponInfo = () => {
    registerCouponInfo(
      {
        data: {
          ...couponInfo,
          startDate: couponInfo.startDate
            ? new Date(couponInfo.startDate).toISOString()
            : null,
          endDate: couponInfo.endDate
            ? new Date(couponInfo.endDate).toISOString()
            : null,
        },
      },
      {
        onSuccess: (res) => {
          alert("쿠폰이 등록되었습니다.");

          if (!res.couponInfoId) {
            return router.push("/coupon-info");
          }

          return router.push(`/coupon-info/${res.couponInfoId}`);
        },
        onError: (error: any) => {
          return alert(error.message ?? "쿠폰 등록 중 오류가 발생했습니다.");
        },
      }
    );
  };

  // 적용 이용권 설정
  const handleTogglePassType = (key: string) => () => {
    setCouponInfo((prev) => {
      const current = prev.passType
        ? prev.passType.split(",").map((v) => v.trim())
        : [];

      let next: string[];

      if (current.includes(key)) {
        next = current.filter((v) => v !== key);
      } else {
        next = [...current, key];
      }

      return {
        ...prev,
        passType: next.join(", "),
      };
    });
  };

  // 적용 서비스 설정
  const handleToggleServiceType = (key: string) => () => {
    setCouponInfo((prev) => {
      const current = prev.serviceType
        ? prev.serviceType.split(",").map((v) => v.trim())
        : [];

      let next: string[];

      if (current.includes(key)) {
        next = current.filter((v) => v !== key);
      } else {
        next = [...current, key];
      }

      return {
        ...prev,
        serviceType: next.join(", "),
      };
    });
  };

  return (
    <div className="p-[40px]">
      <div className="flex flex-col">
        <div
          className="w-full  p-[20px] bg-white rounded-[20px]"
          style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
        >
          <p>쿠폰 정보</p>

          <div className="grid grid-cols-[120px_1fr] items-center w-auto mt-[16px] px-[12px] gap-y-[16px] text-[14px]">
            <p className="text-gray5 text-[14px] font-semibold">쿠폰 종류</p>

            <Select<SelectOption>
              options={couponTypeOptions.filter((opt) => opt.value !== null)}
              value={
                couponTypeOptions.find(
                  (option) => option.value === couponInfo.type
                ) ?? {
                  value: "",
                  label: "쿠폰 종류",
                }
              }
              onChange={(option) => {
                setCouponInfo((prev) => ({
                  ...prev,
                  type: (option?.value ?? "") as string,
                }));
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
              isSearchable={false}
              styles={tableSelectStyles}
            />

            <p className="text-gray5 text-[14px] font-semibold">쿠폰 이름</p>

            <input
              value={couponInfo.name}
              onChange={(e) =>
                setCouponInfo((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-[252px] px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
            />

            <p className="text-gray5 text-[14px] font-semibold">쿠폰 코드</p>

            <input
              value={couponInfo.code ?? ""}
              onChange={(e) =>
                setCouponInfo((prev) => ({
                  ...prev,
                  code: e.target.value.trim() ? e.target.value : null,
                }))
              }
              className="w-[252px] px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
            />

            <p className="text-gray5 text-[14px] font-semibold">적용 이용권</p>

            <div className="flex gap-x-[12px]">
              {passTypes.map((value, index) => {
                const isActive = couponInfo.passType?.includes(value.key);

                return (
                  <button
                    key={`pass_type_${index}`}
                    type="button"
                    onClick={handleTogglePassType(value.key)}
                    className={`px-[12px] py-[6px] text-[13px] border rounded-[6px] cursor-pointer ${
                      isActive
                        ? "text-main border-main"
                        : "text-black border-gray2"
                    }`}
                  >
                    {value.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center w-auto mt-[16px] px-[12px] gap-y-[16px] text-[14px]">
            <p className="text-gray5 text-[14px] font-semibold">적용 서비스</p>

            <div className="flex flex-col">
              <div className="flex gap-x-[12px]">
                {serviceTypes.map((value, index) => {
                  const isActive = couponInfo.serviceType?.includes(value.key);

                  return (
                    <button
                      key={`service_type_${index}`}
                      type="button"
                      onClick={handleToggleServiceType(value.key)}
                      className={`px-[12px] py-[6px] text-[13px] border rounded-[6px] cursor-pointer ${
                        isActive
                          ? "text-main border-main"
                          : "text-black border-gray2"
                      }`}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-start w-auto mt-[16px] px-[12px] gap-y-[16px] text-[14px]">
            <p className="text-gray5 text-[14px] font-semibold">할인액</p>

            <div className="flex flex-col">
              <div className="flex gap-x-[12px]">
                {dicountTypes.map((value, index) => {
                  const isActive = couponInfo.discountType === value.key;

                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setCouponInfo((prev) => ({
                          ...prev,
                          discountType: value.key,
                          discountValue: 0,
                        }));
                      }}
                      className="flex items-center cursor-pointer"
                    >
                      <Image
                        src={isActive ? activeRadioButton : inactiveRadioButton}
                        alt={value.label}
                        className="w-[20px] h-[20px] mr-[6px]"
                      />
                      <p>{value.label}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center mt-[12px]">
                <input
                  value={
                    couponInfo.discountValue ? couponInfo.discountValue : ""
                  }
                  onChange={(e) => {
                    setCouponInfo((prev) => {
                      return {
                        ...prev,
                        discountValue: Number(e.target.value),
                      };
                    });
                  }}
                  type="number"
                  className="w-[86px] px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
                />
                <p className="ml-[6px] text-[14px]">
                  {couponInfo.discountType === "RATE" ? "%" : "원"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center w-auto mt-[16px] px-[12px] gap-y-[16px] text-[14px]">
            <p className="text-gray5 text-[14px] font-semibold">발급 기간</p>

            <div className="flex items-center">
              <input
                value={couponInfo.startDate ?? undefined}
                onChange={(e) =>
                  setCouponInfo((prev) => ({
                    ...prev,
                    startDate: formatDate(e.target.value),
                  }))
                }
                maxLength={10}
                placeholder="YYYY-MM-DD"
                className="w-[120px] px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
              />

              <p className="mx-[16px] text-[14px]">~</p>

              <input
                value={couponInfo.endDate ?? undefined}
                onChange={(e) =>
                  setCouponInfo((prev) => ({
                    ...prev,
                    endDate: formatDate(e.target.value),
                  }))
                }
                maxLength={10}
                placeholder="YYYY-MM-DD"
                className="w-[120px] px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
              />
            </div>

            <p className="text-gray5 text-[14px] font-semibold">사용 기간</p>

            <div className="flex items-center">
              <input
                value={couponInfo.validDays === 0 ? "" : couponInfo.validDays}
                onChange={(e) =>
                  setCouponInfo((prev) => ({
                    ...prev,
                    validDays: Number(e.target.value),
                  }))
                }
                type="number"
                className="w-[60px] px-[12px] py-[6px] text-center text-[14px] border border-gray2 rounded-[6px]"
              />
              <p className="ml-[6px] text-[14px]">일</p>
            </div>

            <p className="text-gray5 text-[14px] font-semibold">발매 수량</p>

            <div className="flex items-center">
              <input
                value={
                  couponInfo.maxQuantity === 0 || couponInfo.maxQuantity == null
                    ? ""
                    : couponInfo.maxQuantity
                }
                onChange={(e) =>
                  setCouponInfo((prev) => ({
                    ...prev,
                    maxQuantity:
                      e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                type="number"
                className="w-[84px] px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
              />
              <p className="ml-[6px]">매</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-[32px] gap-x-[20px]">
          <button
            onClick={handleRegisterCouponInfo}
            type="button"
            className="w-[84px] h-[44px] text-white text-[16px] font-semibold bg-main rounded-[8px] cursor-pointer"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
