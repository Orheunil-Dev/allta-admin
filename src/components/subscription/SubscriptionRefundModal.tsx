import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { usePurchaseControllerGetPurchaseDetailByProductId } from "@/api/purchase/purchase";
import { useSubscriptionControllerRefundSubscription } from "@/api/subscription/subscription";
import { SubscriptionSnapshotListItem } from "@/api/models";
import { formatPassType, formatServiceType } from "@/utils";
import { CustomModal } from "../ui/Modal";
import { closeIcon } from "../../../public/images";

interface Props {
  visible: boolean;
  subscriptionSnapshot: SubscriptionSnapshotListItem | null;
  onClose: () => void;
  refetch: () => void;
}

export const SubscriptionRefundModal = ({
  visible,
  subscriptionSnapshot,
  onClose,
  refetch,
}: Props) => {
  if (!subscriptionSnapshot) return;

  const [refundAmount, setRefundAmount] = useState<string>("");

  // 결제정보 조회 API
  const {
    data: purchaseData,
    isLoading: purchaseLoading,
    isError: purchaseError,
  } = usePurchaseControllerGetPurchaseDetailByProductId(
    {
      productType: subscriptionSnapshot.type,
      productId: subscriptionSnapshot.id,
    },
    {
      query: {
        enabled: !!subscriptionSnapshot,
      },
    }
  );

  // 구독권 환불 API
  const {
    mutate: refundSubscription,
    isPending: refundSubscriptionLoading,
    isError: refundSubscriptionError,
  } = useSubscriptionControllerRefundSubscription();

  const handleChangeRefundAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberic = Number(e.target.value.replace(/[^0-9]/g, ""));
    const amount = numberic.toLocaleString();

    if (amount === "" || numberic === 0) {
      return setRefundAmount("");
    }

    return setRefundAmount(amount);
  };

  const handleRefund = () => {
    const numericAmount = Number(refundAmount.replace(/,/g, ""));

    if (!subscriptionSnapshot) {
      return alert("구독권 정보가 조회되지 않습니다.");
    } else if (subscriptionSnapshot.status === "REFUNDED") {
      return alert("이미 환불 처리가 완료된 구독권입니다.");
    } else if (subscriptionSnapshot.status === "USED") {
      return alert("이미 사용된 이용권입니다.");
    } else if (numericAmount <= 0) {
      return alert("환불 금액은 0원보다 크게 입력해주세요.");
    }

    refundSubscription(
      {
        data: {
          id: subscriptionSnapshot.id,
          refundAmount: numericAmount,
        },
      },
      {
        onSuccess: () => {
          refetch();

          alert("환불 처리가 완료되었습니다.");

          return onClose();
        },
        onError: (error: any) => {
          return alert(error.message ?? "환불 처리 중 오류가 발생했습니다.");
        },
      }
    );
  };

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <div className="flex flex-col w-[400px]">
        <div className="flex justify-between items-center">
          <p className="text-[24px] font-semibold">환불</p>

          <button onClick={onClose} className="cursor-pointer">
            <Image src={closeIcon} alt="닫기" className="w-[24px] h-[24px]" />
          </button>
        </div>

        <p className="mt-[32px]">환불금액</p>

        <div className="relative items-center mt-[4px] px-[18px] py-[12px] rounded-[8px] border-[1px] border-gray2">
          <input
            value={refundAmount}
            onChange={handleChangeRefundAmount}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            placeholder="입력"
            className="w-full text-[16px] outline-0"
          />

          <p className="absolute top-[12px] right-[18px] text-[16px] font-semibold">
            원
          </p>
        </div>

        <div className="my-[20px] w-full h-[1px] bg-line" />

        <div className="flex justify-between items-center">
          <p className="text-[14px]">구매자</p>
          <p className="text-[14px] font-semibold">
            {subscriptionSnapshot.subscription.user.name}
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-[14px]">상품명</p>
          <p className="text-[14px] font-semibold">
            {formatServiceType(subscriptionSnapshot.serviceType)}{" "}
            {formatPassType(subscriptionSnapshot.type)} 구독권
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-[14px]">매장명</p>
          <p className="text-[14px] font-semibold">
            {subscriptionSnapshot.subscription.store.name}
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-[14px]">차량번호</p>
          <p className="text-[14px] font-semibold">
            {subscriptionSnapshot.carNumber}
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-[14px]">결제일시</p>
          <p className="text-[14px] font-semibold">
            {dayjs(subscriptionSnapshot.createdAt).format("YYYY.MM.DD HH:mm")}
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-main text-[14px] font-semibold">결제액</p>
          <p className="text-main text-[14px] font-semibold">
            {(purchaseData?.data.amount ?? 0).toLocaleString()}원
          </p>
        </div>

        <button
          onClick={handleRefund}
          disabled={
            Number(refundAmount.replace(/,/g, "")) <= 0 ||
            refundSubscriptionLoading
          }
          className="justify-center items-center self-center w-fit mt-[32px] px-[28px] py-[10px] text-white text-[16px] font-semibold bg-main rounded-[8px]"
        >
          완료
        </button>
      </div>
    </CustomModal>
  );
};
