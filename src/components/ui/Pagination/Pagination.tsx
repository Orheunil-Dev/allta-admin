import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { nextButton, prevButton } from "../../../../public/images";

interface Props {
  totalCount: number;
  take: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export const Pagination = ({ totalCount, take, page, setPage }: Props) => {
  const totalPages = Math.ceil(totalCount / take);
  const pageGroup = Math.floor(page / 10);
  const startPage = pageGroup * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  // 페이지 이동
  const handleChangePage = (page: number) => {
    setPage(page);
  };

  // 이전 버튼 클릭
  const handleClickPrev = () => {
    if (startPage === 1) return;

    handleChangePage(startPage - 2);
  };

  // 다음 버튼 클릭
  const handleClickNext = () => {
    if (endPage >= totalPages) return;

    handleChangePage(endPage);
  };

  return (
    <div className="flex justify-center items-center mt-[18px] text-[14px] md:text-[16px]">
      <button onClick={handleClickPrev} disabled={page < 9}>
        <Image
          src={prevButton}
          alt="이전"
          className={`w-[24px] md:w-[28px] h-[24px] md:h-[28px] mr-[8px] ${
            page < 10 ? "cursor-default opacity-50" : "cursor-pointer"
          }`}
        />
      </button>

      <div className="flex gap-x-[2px] md:gap-x-[4px]">
        {pages.map((value) => (
          <button
            key={value}
            onClick={() => handleChangePage(value - 1)}
            disabled={value - 1 === page}
            className={`w-[24px] md:w-[28px] h-[24px] md:h-[28px] ${
              value - 1 === page
                ? "bg-white text-main font-semibold border border-main rounded-[4px] cursor-default"
                : "text-gray7 border border-transparent cursor-pointer"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <button
        onClick={handleClickNext}
        disabled={Math.floor(page / 10) === Math.floor((totalPages - 1) / 10)}
      >
        <Image
          src={nextButton}
          alt="다음"
          className={`w-[24px] md:w-[28px] h-[24px] md:h-[28px] ml-[8px] ${
            Math.floor(page / 10) === Math.floor((totalPages - 1) / 10)
              ? "cursor-default opacity-50"
              : "cursor-pointer"
          }`}
        />
      </button>
    </div>
  );
};
