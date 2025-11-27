import { useState } from "react";
import { useRouter } from "next/router";
import { useStoreControllerRegisterStore } from "@/api/store/store";
import { RegisterStoreRequest } from "@/api/models";
import { BusinessHours, PassPrice } from "@/types";
import {
  BusinessHoursRegisterForm,
  OtherRegisterForm,
  PriceRegisterForm,
  StoreRegisterForm,
} from "@/components/store";
import { defaultDescription, defaultPolicy } from "@/constants";

export default function StoreRegister() {
  const router = useRouter();

  const [store, setStore] = useState<RegisterStoreRequest>({
    name: "",
    phoneNumber: "",
    address: "",
    lat: 37.5759785,
    lng: 127.1935115,
    storeType: "WASH",
    mainImage: null,
    tags: null,
    description: defaultDescription,
    policy: defaultPolicy,
    breakTime: null,
    ceoName: "",
    ceoPhoneNumber: "",
    passPrice: null,
    businessHours: null,
    isHidden: false,
  });

  // 매장 등록 API
  const {
    mutate: registerStore,
    isPending: registerStoreLoading,
    isError: registerStoreError,
  } = useStoreControllerRegisterStore();

  // 매장 등록
  const handleRegisterStore = () => {
    registerStore(
      { data: store },
      {
        onSuccess: (res) => {
          alert("매장이 등록되었습니다.");
          return router.push(`/store/${res.storeId}`);
        },
        onError: (error: any) => {
          return alert(error.message ?? "매장 등록 중 오류가 발생했습니다.");
        },
      }
    );
  };

  return (
    <div className="p-[40px]">
      <div className="flex flex-col">
        <div className="flex gap-x-[24px]">
          <StoreRegisterForm store={store} setStore={setStore} />
        </div>

        <div
          className="w-full mt-[32px] p-[20px] bg-white rounded-[20px]"
          style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
        >
          <p className="text-[16px] font-semibold">매장 운영</p>

          <BusinessHoursRegisterForm
            businessHours={
              store?.businessHours as string | BusinessHours | null
            }
            breakTime={store?.breakTime}
            setStore={setStore}
          />

          <PriceRegisterForm
            tags={store?.tags}
            passPrice={store?.passPrice as string | PassPrice | null}
            standardMaxUsage={store?.standardMaxUsage}
            setStore={setStore}
          />

          <OtherRegisterForm store={store} setStore={setStore} />
        </div>

        <div className="flex justify-center items-center mt-[32px] gap-x-[20px]">
          <button
            onClick={handleRegisterStore}
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
