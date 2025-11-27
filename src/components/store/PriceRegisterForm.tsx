import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { RegisterStoreRequest } from "@/api/models";
import { CarType, PassPrice, PassType, ServiceType } from "@/types";
import { carTypes, passTypes, storeTags } from "@/constants";
import { checkedBox, uncheckedBox } from "../../../public/images";

interface Props {
  passPrice?: string | PassPrice | null;
  tags?: string | null;
  standardMaxUsage?: number | null;
  setStore: Dispatch<SetStateAction<RegisterStoreRequest>>;
}

export const PriceRegisterForm = ({
  tags,
  passPrice,
  standardMaxUsage,
  setStore,
}: Props) => {
  const handleChangeTags = (tag: string) => () => {
    setStore((prev) => {
      if (!prev) return prev;

      const tagList =
        prev.tags
          ?.split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0) || [];

      let newTags: string[];

      if (tagList.includes(tag)) {
        newTags = tagList.filter((t) => t !== tag);
      } else {
        newTags = [...tagList, tag];
      }

      return {
        ...prev,
        tags: newTags.join(", "),
      };
    });
  };

  const handleToggleServiceType = (serviceType: ServiceType) => () => {
    setStore((prev) => {
      if (!prev) return prev;

      const currentPassPrice = prev.passPrice as PassPrice | undefined;

      let newPassPrice: PassPrice = { ...currentPassPrice };

      if (currentPassPrice && currentPassPrice[serviceType]) {
        delete newPassPrice[serviceType];
      } else {
        newPassPrice[serviceType] = {};
      }

      return {
        ...prev,
        passPrice: newPassPrice,
      };
    });
  };

  const handleTogglePassType =
    (serviceType: ServiceType, passType: PassType) => () => {
      setStore((prev) => {
        if (!prev) return prev;

        const currentPassPrice = (prev.passPrice as PassPrice) || {};

        const servicePrices: Partial<
          Record<PassType, Record<CarType, number | undefined>>
        > = { ...(currentPassPrice[serviceType] || {}) };

        if (servicePrices[passType]) {
          // 이미 있으면 삭제
          delete servicePrices[passType];
        } else {
          servicePrices[passType] = {
            SEDAN: undefined,
            SUV: undefined,
            VAN: undefined,
          };
        }

        const newPassPrice: PassPrice = {
          ...currentPassPrice,
          [serviceType]: servicePrices,
        };

        return {
          ...prev,
          passPrice: newPassPrice,
        };
      });
    };

  const handleChangePrice = (
    serviceType: ServiceType,
    passType: PassType,
    carType: CarType,
    value: string
  ) => {
    setStore((prev) => {
      if (!prev) return prev;

      const currentPassPrice: PassPrice =
        typeof prev.passPrice === "object" && prev.passPrice !== null
          ? prev.passPrice
          : {};

      const servicePrices: Partial<
        Record<PassType, Record<CarType, number | undefined>>
      > = { ...(currentPassPrice[serviceType] || {}) };

      if (!servicePrices[passType]) {
        servicePrices[passType] = {
          SEDAN: undefined,
          SUV: undefined,
          VAN: undefined,
        };
      }

      servicePrices[passType]![carType] =
        value === "" ? undefined : Number(value);

      const newPassPrice: PassPrice = {
        ...currentPassPrice,
        [serviceType]: servicePrices,
      };

      return {
        ...prev,
        passPrice: newPassPrice,
      };
    });
  };

  return (
    <>
      <div className="grid grid-cols-[120px_1fr] items-center w-auto mt-[16px] px-[12px] text-[14px]">
        <p className="text-gray5 text-[14px] font-semibold">서비스 종류</p>

        <div className="flex items-center gap-x-[12px]">
          {storeTags.map((value, index) => {
            const isActive = tags
              ?.split(",")
              .map((t) => t.trim())
              .includes(value);

            return (
              <button
                onClick={handleChangeTags(value)}
                className={`px-[12px] py-[6px] text-[13px]  rounded-[6px] cursor-pointer ${
                  isActive
                    ? `text-main border border-main`
                    : `text-blac border border-gray2`
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-[120px_1fr] w-auto mt-[16px] px-[12px]">
        <p className="text-gray5 text-[14px] font-semibold">이용권 가격</p>

        <div className="flex flex-col gap-y-[16px] text-[14px]">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={handleToggleServiceType("AUTO")}
              className="flex items-center w-fit cursor-pointer"
            >
              <Image
                src={
                  passPrice && typeof passPrice === "object" && passPrice.AUTO
                    ? checkedBox
                    : uncheckedBox
                }
                alt="자동세차"
                className="w-[16px] h-[16px] mr-[6px]"
              />

              <p>자동세차</p>
            </button>

            {passPrice && typeof passPrice === "object" && passPrice.AUTO && (
              <>
                <div className="flex mt-[12px] gap-x-[12px]">
                  {passTypes.map((value, index) => {
                    const isActive =
                      typeof passPrice === "object" &&
                      passPrice !== null &&
                      passPrice.AUTO?.[value.key as PassType] !== undefined;

                    return (
                      <button
                        type="button"
                        onClick={handleTogglePassType(
                          "AUTO",
                          value.key as PassType
                        )}
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

                {passPrice.AUTO?.STANDARD !== undefined && (
                  <div className="flex items-center mt-[12px]">
                    <p>* 스탠다드 이용권 최대 사용횟수</p>
                    <input
                      value={standardMaxUsage ?? undefined}
                      onChange={(e) => {
                        setStore((prev) => {
                          return {
                            ...prev,
                            standardMaxUsage: Number(e.target.value) || null,
                          };
                        });
                      }}
                      type="number"
                      className="w-[86px] ml-[16px] px-[12px] py-[6px] border border-gray2 rounded-[6px]"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {passPrice && typeof passPrice === "object" && passPrice.AUTO && (
            <table className="max-w-[656px] w-full">
              <thead className="">
                <tr>
                  <th className="border border-line"></th>
                  {carTypes.map((item) => (
                    <th
                      key={item.value}
                      className="py-[16px] font-normal border border-line"
                    >
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {passTypes.map(({ key, label }) => {
                  const isActive =
                    typeof passPrice === "object" &&
                    passPrice !== null &&
                    passPrice.AUTO?.[key as PassType] !== undefined;

                  return (
                    <tr key={key}>
                      <td className="w-[164px] text-center border border-line">
                        {label}
                      </td>

                      {carTypes.map((item) => (
                        <td
                          key={item.value}
                          className="px-[24px] py-[10px] bg-white border border-line "
                        >
                          <input
                            type="number"
                            disabled={!isActive}
                            value={
                              passPrice?.AUTO?.[key as PassType]?.[
                                item.value as CarType
                              ] ?? ""
                            }
                            onChange={(e) =>
                              handleChangePrice(
                                "AUTO",
                                key as PassType,
                                item.value as CarType,
                                e.target.value
                              )
                            }
                            className={`w-full px-[12px] py-[6px] border border-gray2 rounded-[6px] ${
                              isActive ? "bg-white" : "bg-gray1"
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div className="flex flex-col">
            <button
              type="button"
              onClick={handleToggleServiceType("HANDS")}
              className="flex items-center w-fit cursor-pointer"
            >
              <Image
                src={
                  passPrice && typeof passPrice === "object" && passPrice.HANDS
                    ? checkedBox
                    : uncheckedBox
                }
                alt="핸즈클리닝"
                className="w-[16px] h-[16px] mr-[6px]"
              />

              <p>핸즈클리닝</p>
            </button>

            {passPrice && typeof passPrice === "object" && passPrice.HANDS && (
              <>
                <div className="flex mt-[12px] gap-x-[12px]">
                  {passTypes.map((value, index) => {
                    const isActive =
                      typeof passPrice === "object" &&
                      passPrice !== null &&
                      passPrice.HANDS?.[value.key as PassType] !== undefined;

                    return (
                      <button
                        type="button"
                        onClick={handleTogglePassType(
                          "HANDS",
                          value.key as PassType
                        )}
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

                {passPrice.HANDS?.STANDARD !== undefined && (
                  <div className="flex items-center mt-[12px]">
                    <p>* 스탠다드 이용권 최대 사용횟수</p>
                    <input
                      value={standardMaxUsage ?? undefined}
                      onChange={(e) => {
                        setStore((prev) => {
                          if (!prev) return prev;

                          return {
                            ...prev,
                            standardMaxUsage: Number(e.target.value) || null,
                          };
                        });
                      }}
                      type="number"
                      className="w-[86px] ml-[16px] px-[12px] py-[6px] border border-gray2 rounded-[6px]"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {passPrice && typeof passPrice === "object" && passPrice.HANDS && (
            <table className="max-w-[656px] w-full">
              <thead>
                <tr>
                  <th className="border border-line"></th>
                  {carTypes.map((item) => (
                    <th
                      key={item.value}
                      className="py-[16px] font-normal border border-line"
                    >
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {passTypes.map(({ key, label }) => {
                  const isActive =
                    typeof passPrice === "object" &&
                    passPrice !== null &&
                    passPrice.HANDS?.[key as PassType] !== undefined;

                  return (
                    <tr key={key}>
                      <td className="w-[164px] text-center border border-line">
                        {label}
                      </td>

                      {carTypes.map((item) => (
                        <td
                          key={item.value}
                          className="px-[24px] py-[10px] bg-white border border-line "
                        >
                          <input
                            type="number"
                            disabled={!isActive}
                            value={
                              passPrice?.HANDS?.[key as PassType]?.[
                                item.value as CarType
                              ] ?? ""
                            }
                            onChange={(e) =>
                              handleChangePrice(
                                "HANDS",
                                key as PassType,
                                item.value as CarType,
                                e.target.value
                              )
                            }
                            className={`w-full px-[12px] py-[6px] border border-gray2 rounded-[6px] ${
                              isActive ? "bg-white" : "bg-gray1"
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
