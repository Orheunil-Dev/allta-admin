import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  useCouponControllerGetIssuableCouponList,
  useCouponControllerIssueCouponToUsers,
} from "@/api/coupon/coupon";
import { IssuableCouponInfoListItem } from "@/api/models";
import {
  filterPhoneTextareaValue,
  formatDiscountValue,
  formatEllipsis,
} from "@/utils";
import { Callout } from "@/components/ui/Callout";
import {
  activeRadioButton,
  closeIcon,
  graySearchIcon,
  inactiveRadioButton,
  leftTriangleIcon,
} from "../../../public/images";

export default function Lms() {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [skip, setSkip] = useState<number>(0);
  const [serachTerm, setSearchTerm] = useState<string>("");
  const [couponName, setCounponName] = useState<string>("");
  const [couponId, setCouponId] = useState<string | null>(null);
  const [couponInfos, setCouponInfos] = useState<IssuableCouponInfoListItem[]>(
    []
  );
  const [draftedPhoneNumbers, setDraftedPhoneNumbers] = useState<string>("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

  // 쿠폰 발급 API
  const {
    mutate: issueCoupon,
    isPending: issueCouponLoading,
    isError: issueCouponError,
  } = useCouponControllerIssueCouponToUsers();

  // 발급 가능한 쿠폰 목록 조회 API
  const {
    data: couponInfoData,
    isLoading: couponInfoLoading,
    isError: couponInfoError,
  } = useCouponControllerGetIssuableCouponList({
    name: couponName,
    take: 20,
    skip,
  });

  // 쿠폰 선택
  const handleClickCoupon = (id: string) => () => {
    if (id === couponId) return setCouponId(null);

    return setCouponId(id);
  };

  // 전화번호 추가
  const handleSetPhoneNumbers = () => {
    const newNumbers = draftedPhoneNumbers
      .split(/\r?\n/) // 줄바꿈 기준 분리
      .map((n) => n.trim()) // 공백 제거
      .filter((n) => n !== ""); // 빈 줄 제거

    const merged = [...phoneNumbers, ...newNumbers];

    // 중복 제거
    const unique = merged.filter((n, i, arr) => arr.indexOf(n) === i);

    setPhoneNumbers(unique);
    setDraftedPhoneNumbers("");
  };

  // 전화번호 제거
  const handleDeletePhoneNumber = (phoneNumber: string) => () => {
    setPhoneNumbers((prev) => prev.filter((n) => n !== phoneNumber));
  };

  // 쿠폰 발급
  const handleSubmit = () => {
    if (issueCouponLoading || !couponId) return;

    const result = window.confirm(
      `${phoneNumbers.length}명을 대상으로 쿠폰을 발급하시겠습니까?`
    );

    if (result) {
      issueCoupon(
        { data: { id: couponId, phoneNumbers } },
        {
          onSuccess: (res) => {
            setCouponId(null);
            setDraftedPhoneNumbers("");
            setPhoneNumbers([]);

            return alert(
              `쿠폰이 발급되었습니다.\n성공: ${res.data.successCount}건\n실패: ${res.data.errorCount}건`
            );
          },
          onError: (error: any) => {
            return alert(error.message ?? "문자 전송 중 오류가 발생했습니다");
          },
        }
      );
    }
  };

  // 쿠폰 발급 가능 여부
  const isVerify = couponId && phoneNumbers.length > 0;

  // 쿠폰명 검색
  useEffect(() => {
    if (serachTerm === couponName) return;

    const timer = setTimeout(() => {
      setCounponName(serachTerm);
      setCouponInfos([]);
      setSkip(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [serachTerm]);

  // 무한 스크롤
  useEffect(() => {
    if (couponInfoData?.data) {
      setCouponInfos((prev) => [...prev, ...couponInfoData.data]);
    }
  }, [couponInfoData]);

  useEffect(() => {
    if (!observerRef.current) return;
    if (!couponInfoData?.meta?.hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !couponInfoLoading) {
          setSkip((prev) => prev + 20);
        }
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [couponInfoData?.meta?.hasNextPage, couponInfoLoading]);

  return (
    <div className="flex flex-col h-full p-[40px] overflow-y-auto">
      <Callout>
        <p className="text-[16px] font-semibold">쿠폰 발급</p>

        <div className="flex w-full mt-[16px] overflow-y-auto">
          <div className="flex flex-col flex-shrink-0 items-center w-[380px] h-[556px] mr-[40px]">
            {/* 쿠폰 검색창 */}
            <div className="relative flex items-center w-full">
              <input
                value={serachTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="쿠폰명 겸색"
                className="flex items-center w-full h-[36px] pl-[12px] pr-[32px] text-[14px] border border-gray2 rounded-[8px] resize-none"
              />
              <Image
                src={graySearchIcon}
                alt="검색"
                className="absolute right-[12px] w-[16px] h-[16px]"
              />
            </div>

            {/* 발급 가능한 쿠폰 목록 */}
            <div className="flex flex-col flex-1 w-full mt-[12px] px-[12px] py-[8px] border border-gray2 rounded-[8px] overflow-y-auto">
              {couponInfos.map((value, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={handleClickCoupon(value.id)}
                  className="relative flex items-center py-[12px] cursor-pointer"
                >
                  <Image
                    src={
                      value.id === couponId
                        ? activeRadioButton
                        : inactiveRadioButton
                    }
                    alt="쿠폰 선택"
                    className="w-[20px] h-[20px] mr-[12px]"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center ">
                      <p className="text-[14px] font-semibold">
                        {formatEllipsis(value.name, 20)}
                      </p>

                      <div className="absolute right-0 px-[5px] py-[2px] text-[13px] bg-bg rounded-[50px]">
                        <p className="text-gray5">
                          <strong className="text-main font-medium">
                            {value.issuedCouponCount}{" "}
                          </strong>
                          / {value.maxQuantity ?? "∞"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray7 text-[13px]">
                      <p>
                        {formatDiscountValue(
                          value.discountType,
                          value.discountValue
                        ) + `${value.discountType !== "FIXED" ? " 할인" : ""}`}
                      </p>
                      <div className="w-[1px] h-[11px] mx-[4px] bg-gray5" />
                      <p>사용기간: {value.validDays}일</p>
                    </div>
                  </div>
                </button>
              ))}

              {/* 무한스크롤 트리거 */}
              <div ref={observerRef} className="h-[1px]" />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isVerify}
              className={`justify-center items-center w-full mt-[12px] px-[28px] py-[10px] text-[16px] font-semibold rounded-[8px]
                  ${
                    isVerify
                      ? "text-white bg-main cursor-pointer"
                      : "text-gray5 bg-gray2 cursor-default"
                  }
                `}
            >
              발급하기
            </button>
          </div>

          <div className="flex flex-col flex-shrink-0 items-center w-[260px]">
            <div className="flex justify-center items-center w-full h-[36px] px-[12px] border border-gray2 rounded-[8px] resize-none">
              <p className="text-[14px]">
                전체 발급 수 :{" "}
                <strong className="text-main">{phoneNumbers.length}</strong> 명
              </p>
            </div>

            <div className="flex flex-col flex-1 w-full mt-[6px] px-[12px] py-[8px] border border-gray2 rounded-[8px] overflow-y-auto">
              {phoneNumbers.map((value, index) => (
                <div key={index} className="flex items-center">
                  <p className="text-[14px]">{value}</p>
                  <button
                    onClick={handleDeletePhoneNumber(value)}
                    className="ml-[8px] cursor-pointer"
                  >
                    <Image
                      src={closeIcon}
                      alt="삭제"
                      className="w-[16px] h-[16px]"
                    />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhoneNumbers([])}
              className="self-end mt-[12px] px-[10px] py-[6px] text-gray5 text-[14px] font-semibold border border-gray2 rounded-[6px] cursor-pointer"
            >
              전체삭제
            </button>
          </div>

          <button
            onClick={handleSetPhoneNumbers}
            className="flex flex-col flex-shrink-0 justify-center items-center self-center px-[10px] py-[4px] mx-[20px] bg-main rounded-[6px] cursor-pointer"
          >
            <Image
              src={leftTriangleIcon}
              alt="추가"
              className="w-[16px] h-[16px]"
            />
            <p className="text-white text-[14px] font-semibold">추가</p>
          </button>

          <div className="flex flex-col flex-shrink-0 items-center w-[260px]">
            <textarea
              value={draftedPhoneNumbers}
              onChange={(e) => {
                setDraftedPhoneNumbers(
                  filterPhoneTextareaValue(e.target.value)
                );
              }}
              placeholder={
                "휴대폰 번호를 입력해주세요.\n* 중복된 휴대폰 번호는 1건만 전송됩니다."
              }
              className="flex-1 w-full px-[12px] py-[8px] text-[14px] border border-gray2 rounded-[8px] whitespace-pre-line resize-none"
            />

            <button
              onClick={() => setDraftedPhoneNumbers("")}
              className="self-end mt-[12px] px-[10px] py-[6px] text-gray5 text-[14px] font-semibold border border-gray2 rounded-[6px] cursor-pointer"
            >
              전체삭제
            </button>
          </div>
        </div>
      </Callout>
    </div>
  );
}
