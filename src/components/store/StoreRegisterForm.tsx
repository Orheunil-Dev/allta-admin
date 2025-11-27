import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import dayjs from "dayjs";
import { RegisterStoreRequest } from "@/api/models";
import { KakaoMap } from "../layout/KakaoMap";
import { mapIcon, pencilIcon } from "../../../public/images";

interface Props {
  store: RegisterStoreRequest;
  setStore: Dispatch<SetStateAction<RegisterStoreRequest>>;
}

export const StoreRegisterForm = ({ store, setStore }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showMap, setShowMap] = useState<boolean>(false);

  const handleChange = (key: keyof RegisterStoreRequest, value: any) => {
    setStore((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // 이미지 드래그&드롭
  const handleDropImage = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      try {
        const imageFormData = new FormData();

        imageFormData.append("bucket", "allta_store");
        imageFormData.append(
          "file",
          file,
          `store_${dayjs().format("YYYYMMDDHHmmss")}.jpg`
        );

        const uploadRes = await axios.post<{
          ok: boolean;
          url: string;
        }>(`${process.env.NEXT_PUBLIC_API_URL}/file/image`, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = uploadRes.data.url;

        return setStore((prev) => {
          if (!prev) return prev;

          return { ...prev, mainImage: imageUrl };
        });
      } catch (error: any) {
        console.log(error);
        alert(error.message ?? "이미지 업로드 중 오류가 발생했습니다.");
      }
    }
  };

  // 이미지 선택
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      try {
        const imageFormData = new FormData();

        imageFormData.append("bucket", "allta_store");
        imageFormData.append(
          "file",
          file,
          `store_${dayjs().format("YYYYMMDDHHmmss")}.jpg`
        );

        const uploadRes = await axios.post<{
          ok: boolean;
          url: string;
        }>(`${process.env.NEXT_PUBLIC_API_URL}/file/image`, imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = uploadRes.data.url;

        return setStore((prev) => {
          if (!prev) return prev;

          return { ...prev, mainImage: imageUrl };
        });
      } catch (error: any) {
        console.log(error);
        alert(error.message ?? "이미지 업로드 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteImage = () => {
    return setStore((prev) => {
      if (!prev) return prev;

      return { ...prev, mainImage: null };
    });
  };

  useEffect(() => {
    if (!store.address.trim()) return;

    const debounce = setTimeout(() => {
      const fetchCoordinate = async () => {
        const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${store.address}`;

        const headers = {
          Authorization:
            "KakaoAK " + process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
        };

        try {
          const res = await fetch(url, { headers });
          const data = await res.json();

          if (data.documents.length > 0) {
            const { x, y } = data.documents[0];

            setStore((prev) => {
              if (!prev) return prev;

              return {
                ...prev,
                lat: y ?? 37.5759785,
                lng: x ?? 127.1935115,
              };
            });
          }
        } catch (error) {
          console.error("주소 좌표 변환 실패:", error);
        }
      };

      fetchCoordinate();
    }, 500);

    return () => clearTimeout(debounce);
  }, [store.address]);

  return (
    <div
      className="w-full p-[20px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      <div className="flex flex-col w-[326px]">
        <p className="text-[16px] font-semibold">매장 정보</p>

        <div
          onDrop={handleDropImage}
          onDragOver={(e) => e.preventDefault()}
          className="relative flex justify-center items-center w-full h-[175px] mt-[16px] text-[14px] bg-gray2 rounded-[12px]"
          style={{
            backgroundImage: `url(${store.mainImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          {!store.mainImage && (
            <p className="text-gray5 text-[16px]">매장 이미지를 등록하세요</p>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUploadImage}
            className="hidden"
          />
        </div>

        <div className="flex justify-center items-center mt-[12px] gap-x-[12px]">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex justify-center items-center w-[48px] h-[33px] text-[14px] bg-gray1 rounded-[4px] cursor-pointer"
          >
            변경
          </button>

          <button
            onClick={handleDeleteImage}
            className="flex justify-center items-center w-[48px] h-[33px] text-[14px] bg-gray1 rounded-[4px] cursor-pointer"
          >
            삭제
          </button>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center w-auto mt-[16px] px-[12px] gap-y-[16px]">
          <p className="text-gray5 text-[14px] font-semibold">매장명</p>
          <input
            value={store.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
          />

          <div className="flex items-center">
            <p className="text-gray5 text-[14px] font-semibold">주소</p>

            <div
              onMouseEnter={() => setShowMap(true)}
              onMouseLeave={() => setShowMap(false)}
              className="relative ml-[4px] cursor-pointer"
            >
              <Image src={mapIcon} alt="지도" className="w-[20px] h-[20px]" />

              {showMap && (
                <div className="absolute flex justify-center items-center top-0 left-0 w-[326px] h-[186px] rounded-[20px] overflow-hidden">
                  <KakaoMap
                    lat={store.lat ?? 37.5759785}
                    lng={store.lng ?? 127.1935115}
                    address={
                      store.address ?? "경기도 하남시 미사강변한강로 155"
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <input
            value={store.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
          />

          <p className="text-gray5 text-[14px] font-semibold">전화번호</p>
          <input
            value={store.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
          />

          <p className="text-gray5 text-[14px] font-semibold">대표자명</p>
          <input
            value={store.ceoName}
            onChange={(e) => handleChange("ceoName", e.target.value)}
            className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
          />

          <p className="text-gray5 text-[14px] font-semibold">
            대표자 전화번호
          </p>
          <input
            value={store.ceoPhoneNumber}
            onChange={(e) => handleChange("ceoPhoneNumber", e.target.value)}
            className="px-[12px] py-[6px] text-[14px] border border-gray2 rounded-[6px]"
          />
        </div>
      </div>
    </div>
  );
};
