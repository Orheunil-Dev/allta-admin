import { UserDetailItem } from "@/api/models";
import dayjs from "dayjs";

interface Props {
  data: UserDetailItem;
}

export const UserProfile = ({ data }: Props) => {
  return (
    <div
      style={{ boxShadow: "0 4px 10px 2px rgba(38,38,39,0.04)" }}
      className="flex flex-col w-full px-[32px] py-[20px] bg-white rounded-[20px] z-[2]"
    >
      <p className="text-[18px] font-semibold">{data.name}</p>

      <div className="grid grid-cols-2 mt-[12px] text-[14px] gap-y-[12px]">
        <div className="grid grid-cols-[120px_1fr]">
          <p className="text-gray5 font-semibold">전화번호</p>
          <p>{data.phoneNumber}</p>
        </div>

        <div className="grid grid-cols-[120px_1fr]">
          <p className="text-gray5 font-semibold">가입일</p>
          <p>{dayjs(data.createdAt).format("YYYY.MM.DD")}</p>
        </div>

        <div className="grid grid-cols-[120px_1fr]">
          <p className="text-gray5 font-semibold">이메일</p>
          <p>{data.email ?? "-"}</p>
        </div>

        <div className="grid grid-cols-[120px_1fr]">
          <p className="text-gray5 font-semibold">주소</p>
          <p>{data.address ?? "-"}</p>
        </div>

        <div className="grid grid-cols-[120px_1fr]">
          <p className="text-gray5 font-semibold">차량번호</p>
          <p>
            {data.cars.length > 0
              ? data.cars.map((value) => value.number).join(", ")
              : "-"}
          </p>
        </div>

        <div className="grid grid-cols-[120px_1fr]">
          <p className="text-gray5 font-semibold">추천코드</p>
          <p>{data.referralCode}</p>
        </div>
      </div>
    </div>
  );
};
