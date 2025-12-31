import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  useStoreControllerDeleteStore,
  useStoreControllerGetStoreDetail,
  useStoreControllerUpdateStore,
} from "@/api/store/store";
import { UpdateStoreRequest } from "@/api/models";
import { BusinessHours, PassPrice } from "@/types";
import {
  BusinessHoursInfo,
  KioskInfo,
  OtherInfo,
  PriceInfo,
  StoreInfo,
  StoreStat,
} from "@/components/store";

type Tab = "APP" | "KIOSK";

export default function StoreDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [store, setStore] = useState<UpdateStoreRequest>();
  const [tab, setTab] = useState<Tab>("APP");

  // 매장 상세 조회 API
  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
    refetch: storeRefetch,
  } = useStoreControllerGetStoreDetail(id as string, {
    query: {
      enabled: !!id,
    },
  });

  // 매장 정보 업데이트 API
  const {
    mutate: updateStore,
    isPending: updateStoreLoading,
    isError: updateStoreError,
  } = useStoreControllerUpdateStore();

  // 매장 삭제 API
  const {
    mutate: deleteStore,
    isPending: deleteStoreLoading,
    isError: deleteStoreError,
  } = useStoreControllerDeleteStore();

  // 매장 정보 업데이트
  const handleUpdateStore = () => {
    if (!store) return;

    updateStore(
      { data: store },
      {
        onSuccess: () => {
          alert("매장 정보가 수정되었습니다.");
          return storeRefetch();
        },
        onError: (error: any) => {
          return alert(
            error.message ?? "매장 정보 업데이트 중 오류가 발생했습니다."
          );
        },
      }
    );
  };

  // 매장 삭제
  const handleDeleteStore = () => {
    if (!store) return;

    deleteStore(
      { data: store },
      {
        onSuccess: () => {
          alert("매장이 삭제되었습니다.");
          return router.push("/subscription");
        },
        onError: (error: any) => {
          return alert(error.message ?? "매장 삭제 중 오류가 발생했습니다.");
        },
      }
    );
  };

  // 탭 변경
  const handleClickTab = (value: Tab) => () => {
    if (value === tab) return;

    setStore(storeData?.data);
    return setTab(value);
  };

  useEffect(() => {
    if (storeData) {
      setStore(storeData.data);
    }
  }, [storeData]);

  if (storeError) {
    return (
      <div>
        <p>매장 조회에 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-[40px]">
      {storeData && store && (
        <div className="flex flex-col">
          <div className="flex gap-x-[12px]">
            <button
              onClick={handleClickTab("APP")}
              disabled={tab === "APP"}
              className={`px-[10px] py-[6px] text-[18px] font-semibold cursor-pointer ${
                tab === "APP"
                  ? "text-black border-b-2 border-b-black"
                  : "text-gray5"
              }`}
            >
              앱 설정
            </button>
            <button
              onClick={handleClickTab("KIOSK")}
              disabled={tab === "KIOSK"}
              className={`px-[10px] py-[6px] text-[18px] font-semibold cursor-pointer ${
                tab === "KIOSK"
                  ? "text-black border-b-2 border-b-black"
                  : "text-gray5"
              }`}
            >
              키오스크 설정
            </button>
          </div>

          {tab === "APP" && (
            <div className="flex flex-col mt-[20px]">
              <div className="flex gap-x-[24px]">
                <StoreInfo
                  store={store}
                  setStore={setStore}
                  storeData={storeData.data}
                />
                <StoreStat />
              </div>

              <div
                className="w-full mt-[32px] p-[20px] bg-white rounded-[20px]"
                style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
              >
                <p className="px-[12px] text-[16px] font-semibold">매장 운영</p>

                <BusinessHoursInfo
                  businessHours={
                    store.businessHours as string | BusinessHours | null
                  }
                  breakTime={store.breakTime}
                  holidays={store.holidays}
                  setStore={setStore}
                />

                <PriceInfo
                  tags={store.tags}
                  passPrice={store.passPrice as string | PassPrice | null}
                  standardMaxUsage={store.standardMaxUsage}
                  setStore={setStore}
                />

                <OtherInfo store={store} setStore={setStore} />
              </div>
            </div>
          )}

          {tab === "KIOSK" && <KioskInfo store={store} setStore={setStore} />}

          <div className="flex justify-center items-center mt-[32px] gap-x-[20px]">
            <button
              onClick={handleDeleteStore}
              className="w-[84px] h-[44px] text-gray5 text-[16px] font-semibold bg-white border border-gray2 rounded-[8px] cursor-pointer"
            >
              삭제
            </button>
            <button
              onClick={handleUpdateStore}
              type="button"
              className="w-[84px] h-[44px] text-white text-[16px] font-semibold bg-main rounded-[8px] cursor-pointer"
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
