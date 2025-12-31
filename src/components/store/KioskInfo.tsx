import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { UpdateStoreRequest } from "@/api/models";
import { CarType, MemberType, OfflinePrice } from "@/types";
import { carTypes } from "@/constants";
import { deleteButton, plusIcon } from "../../../public/images";

interface Props {
  store: UpdateStoreRequest;
  setStore: Dispatch<SetStateAction<UpdateStoreRequest | undefined>>;
}

export const KioskInfo = ({ store, setStore }: Props) => {
  const [isForMembers, setIsForMembers] = useState<boolean>(true);

  const memberType: MemberType = isForMembers ? "MEMBER" : "NON_MEMBER";
  const offlinePrice: OfflinePrice = store.offlinePrice ?? {};
  const currentOfflinePrice = offlinePrice[memberType] ?? [];

  const serviceOptions = store.serviceOptions ?? [];
  const currentOptions = serviceOptions
    .filter((o) => o.isForMembers === isForMembers)
    .sort((a, b) => a.index - b.index);

  // 현장권 추가
  const handleAddOfflinePrice = () => {
    setStore((prev) => {
      if (!prev) return prev;

      const prevOffline: OfflinePrice = prev.offlinePrice ?? {};
      const prevList = prevOffline[memberType] ?? [];

      const newItem = {
        index: prevList.length + 1,
        label: "",
        price: {
          SEDAN: 0,
          SUV: 0,
          VAN: 0,
        },
      };

      return {
        ...prev,
        offlinePrice: {
          ...prevOffline,
          [memberType]: [...prevList, newItem],
        },
      };
    });
  };

  // 현장권 삭제
  const handleDeleteOfflinePrice = (index: number) => () => {
    setStore((prev) => {
      if (!prev) return prev;

      const prevOffline: OfflinePrice = prev.offlinePrice ?? {};
      const prevList = prevOffline[memberType] ?? [];

      const nextList = prevList
        .filter((item) => item.index !== index)
        .map((item, idx) => ({
          ...item,
          index: idx + 1,
        }));

      return {
        ...prev,
        offlinePrice: {
          ...prevOffline,
          [memberType]: nextList,
        },
      };
    });
  };

  // 현장권 이름 수정
  const handleChangeOfflinePriceLabel = (index: number, label: string) => {
    setStore((prev) => {
      if (!prev) return prev;

      const prevOffline: OfflinePrice = prev.offlinePrice ?? {};
      const prevList = prevOffline[memberType] ?? [];

      const nextList = prevList.map((item) =>
        item.index === index
          ? {
              ...item,
              label,
            }
          : item
      );

      return {
        ...prev,
        offlinePrice: {
          ...prevOffline,
          [memberType]: nextList,
        },
      };
    });
  };

  // 현장권 금액 수정
  const handleChangeOfflinePrice = (
    index: number,
    carType: CarType,
    value: string
  ) => {
    setStore((prev) => {
      if (!prev) return prev;

      const prevOffline: OfflinePrice = prev.offlinePrice ?? {};
      const prevList = prevOffline[memberType] ?? [];

      const nextList = prevList.map((item) =>
        item.index === index
          ? {
              ...item,
              price: {
                ...item.price,
                [carType]: value === "" ? "" : Number(value),
              },
            }
          : item
      );

      return {
        ...prev,
        offlinePrice: {
          ...prevOffline,
          [memberType]: nextList,
        },
      };
    });
  };

  // 옵션 추가
  const handleAddServiceOption = () => {
    setStore((prev) => {
      if (!prev) return prev;

      const list = prev.serviceOptions ?? [];
      const filtered = list.filter((o) => o.isForMembers === isForMembers);

      return {
        ...prev,
        serviceOptions: [
          ...list,
          {
            optionName: "",
            amount: 0,
            index: filtered.length + 1,
            isForMembers,
            storeId: prev.id,
          },
        ],
      };
    });
  };

  // 옵션 삭제
  const handleDeleteServiceOption = (index: number) => () => {
    setStore((prev) => {
      if (!prev) return prev;

      const remaining = (prev.serviceOptions ?? []).filter(
        (option) =>
          !(option.index === index && option.isForMembers === isForMembers)
      );

      const reordered = remaining.map((option) => {
        if (option.isForMembers !== isForMembers) return option;

        const sameGroup = remaining
          .filter((o) => o.isForMembers === isForMembers)
          .sort((a, b) => a.index - b.index);

        return {
          ...option,
          index: sameGroup.findIndex((o) => o === option) + 1,
        };
      });

      return {
        ...prev,
        serviceOptions: reordered,
      };
    });
  };

  // 옵션 이름 수정
  const handleChangeServiceOptionName = (index: number, value: string) => {
    setStore((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        serviceOptions: prev.serviceOptions?.map((item) =>
          item.index === index && item.isForMembers === isForMembers
            ? { ...item, optionName: value }
            : item
        ),
      };
    });
  };

  // 옵션 금액 수정
  const handleChangeServiceOptionAmount = (index: number, value: number) => {
    setStore((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        serviceOptions: prev.serviceOptions?.map((item) =>
          item.index === index && item.isForMembers === isForMembers
            ? { ...item, amount: value }
            : item
        ),
      };
    });
  };

  return (
    <div
      className="flex flex-col w-full mt-[20px] px-[32px] py-[20px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      <p className="text-[16px] font-semibold">서비스 선택</p>

      <div className="flex mt-[24px] gap-x-[8px]">
        <button
          onClick={() => setIsForMembers(true)}
          disabled={isForMembers}
          className={`px-[18px] py-[4px] border rounded-[20px] text-[16px] font-semibold cursor-pointer ${
            isForMembers
              ? "text-white bg-main border-main"
              : "bg-white border-line"
          }`}
        >
          회원
        </button>
        <button
          onClick={() => setIsForMembers(false)}
          disabled={!isForMembers}
          className={`px-[18px] py-[4px] border rounded-[20px] text-[16px] font-semibold cursor-pointer ${
            !isForMembers
              ? "text-white bg-main border-main"
              : "bg-white border-line"
          }`}
        >
          비회원
        </button>
      </div>

      <div className="grid grid-cols-[120px_1fr] w-auto mt-[16px]">
        <p className="text-gray5 text-[14px] font-semibold">현장권</p>

        <div className="flex flex-col w-full items-start">
          <button
            onClick={handleAddOfflinePrice}
            className="flex items-center gap-x-[6px] cursor-pointer"
          >
            <Image
              src={plusIcon}
              alt="현장권 추가"
              className="w-[20px] h-[20px]"
            />
            <p>현장권 추가</p>
          </button>

          <table className="table-fixed max-w-[698px] w-full mt-[12px] text-[14px]">
            <colgroup>
              {/* 주유 조건 */}
              <col style={{ width: "164px" }} />

              {/* 차량 타입들 */}
              {carTypes.map(() => (
                <col key={Math.random()} style={{ width: "164px" }} />
              ))}

              {/* 삭제 버튼 */}
              <col style={{ width: "42px" }} />
            </colgroup>

            <thead>
              <tr>
                <th className="py-[16px] font-normal border border-line">
                  주유 조건
                </th>
                {carTypes.map((item) => (
                  <th
                    key={item.value}
                    className="py-[16px] font-normal border border-line"
                  >
                    {item.label}
                  </th>
                ))}
                <th className="border border-line" />
              </tr>
            </thead>

            <tbody>
              {currentOfflinePrice.map((value, index) => {
                return (
                  <tr key={index}>
                    <td className="px-[24px] py-[10px] text-center border border-line">
                      <input
                        value={value.label}
                        onChange={(e) =>
                          handleChangeOfflinePriceLabel(
                            value.index,
                            e.target.value
                          )
                        }
                        className="w-full px-[12px] py-[6px] border border-gray2 rounded-[6px]"
                      />
                    </td>

                    {carTypes.map((item) => (
                      <td
                        key={item.value}
                        className="px-[24px] py-[10px] bg-white border border-line "
                      >
                        <input
                          type="number"
                          value={value.price?.[item.value] ?? ""}
                          onChange={(e) =>
                            handleChangeOfflinePrice(
                              value.index,
                              item.value,
                              e.target.value
                            )
                          }
                          className="w-full px-[12px] py-[6px] border border-gray2 rounded-[6px]"
                        />
                      </td>
                    ))}

                    {/* 삭제 버튼 */}
                    <td className="border border-line text-center">
                      <button
                        onClick={handleDeleteOfflinePrice(value.index)}
                        className="self-center cursor-pointer"
                      >
                        <Image
                          src={deleteButton}
                          alt="삭제"
                          className="w-[20px] h-[20px]"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-[120px_1fr] w-auto mt-[32px]">
        <p className="text-gray5 text-[14px] font-semibold">서비스 옵션</p>

        <div className="flex flex-col w-full items-start">
          <button
            onClick={handleAddServiceOption}
            className="flex items-center gap-x-[6px] cursor-pointer"
          >
            <Image
              src={plusIcon}
              alt="현장권 추가"
              className="w-[20px] h-[20px]"
            />
            <p>옵션 추가</p>
          </button>

          <table className="table-fixed max-w-[370px] w-full mt-[12px] text-[14px]">
            <colgroup>
              <col style={{ width: "164px" }} />
              <col style={{ width: "164px" }} />

              {/* 삭제 버튼 */}
              <col style={{ width: "42px" }} />
            </colgroup>

            <thead>
              <tr>
                <th className="py-[16px] font-normal border border-line">
                  옵션 이름
                </th>
                <th className="py-[16px] font-normal border border-line">
                  옵션 금액
                </th>
                <th className="border border-line" />
              </tr>
            </thead>

            <tbody>
              {(store.serviceOptions ?? [])
                .filter((option) => option.isForMembers === isForMembers)
                .map((value, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-[24px] py-[10px] text-center border border-line">
                        <input
                          value={value.optionName}
                          onChange={(e) =>
                            handleChangeServiceOptionName(
                              value.index,
                              e.target.value
                            )
                          }
                          className="w-full px-[12px] py-[6px] border border-gray2 rounded-[6px]"
                        />
                      </td>

                      <td className="px-[24px] py-[10px] bg-white border border-line ">
                        <input
                          type="number"
                          value={value.amount ?? ""}
                          onChange={(e) =>
                            handleChangeServiceOptionAmount(
                              value.index,
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-[12px] py-[6px] border border-gray2 rounded-[6px]"
                        />
                      </td>

                      {/* 삭제 버튼 */}
                      <td className="border border-line text-center">
                        <button
                          onClick={handleDeleteServiceOption(value.index)}
                          className="self-center cursor-pointer"
                        >
                          <Image
                            src={deleteButton}
                            alt="삭제"
                            className="w-[20px] h-[20px]"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
