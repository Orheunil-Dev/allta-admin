import Image from "next/image";
import dayjs from "dayjs";
import { useServiceHistoryControllerCancelService } from "@/api/service-history/service-history";
import { ServiceHistoryListItem } from "@/api/models";
import { formatPassType, formatServiceType } from "@/utils";
import { CustomModal } from "../ui/Modal";
import { closeIcon } from "../../../public/images";

interface Props {
  visible: boolean;
  serviceHistory: ServiceHistoryListItem | null;
  onClose: () => void;
  refetch: () => void;
}

export const ServiceCancelModal = ({
  visible,
  serviceHistory,
  onClose,
  refetch,
}: Props) => {
  if (!serviceHistory) return;

  // 이용취소 API
  const {
    mutate: cancelService,
    isPending: cancelServiceLoading,
    isError: cancelServiceError,
  } = useServiceHistoryControllerCancelService();

  const handleCancel = () => {
    if (!serviceHistory) {
      return alert("이용내역이 조회되지 않습니다.");
    }

    cancelService(
      {
        data: {
          id: serviceHistory.id,
        },
      },
      {
        onSuccess: () => {
          refetch();

          alert("취소 처리가 완료되었습니다.");

          return onClose();
        },
        onError: (error: any) => {
          return alert(error.message ?? "취소 처리 중 오류가 발생했습니다.");
        },
      }
    );
  };

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <div className="flex flex-col w-[400px]">
        <div className="flex justify-between items-center">
          <p className="text-[24px] font-semibold">이용 취소</p>

          <button onClick={onClose} className="cursor-pointer">
            <Image src={closeIcon} alt="닫기" className="w-[24px] h-[24px]" />
          </button>
        </div>

        <div className="my-[20px] w-full h-[1px] bg-line" />

        <div className="flex justify-between items-center">
          <p className="text-[14px]">회원</p>
          <p className="text-[14px] font-semibold">
            {serviceHistory.user.name}
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-[14px]">이용권</p>
          <p className="text-[14px] font-semibold">
            {formatServiceType(serviceHistory.serviceType)}{" "}
            {formatPassType(serviceHistory.passType)}
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-[14px]">매장명</p>
          <p className="text-[14px] font-semibold">
            {serviceHistory.store.name}
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-[14px]">차량번호</p>
          <p className="text-[14px] font-semibold">
            {serviceHistory.carNumber}
          </p>
        </div>

        <div className="flex justify-between items-center mt-[12px]">
          <p className="text-[14px]">이용일시</p>
          <p className="text-[14px] font-semibold">
            {dayjs(serviceHistory.createdAt).format("YYYY.MM.DD HH:mm")}
          </p>
        </div>

        <button
          onClick={handleCancel}
          disabled={cancelServiceLoading}
          className="justify-center items-center self-center w-fit mt-[32px] px-[28px] py-[10px] text-white text-[16px] font-semibold bg-main rounded-[8px]"
        >
          완료
        </button>
      </div>
    </CustomModal>
  );
};
