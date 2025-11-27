import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
// import { uploadImage } from "@/api";

interface Props {
  field: string;
  bucket: string;
  imageUrl?: string | null;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export const ImageUploader = ({
  field,
  bucket,
  imageUrl,
  setFieldValue,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 업로드
  // const { mutate: uploadImageMutation, isPending: uploadImageLoading } =
  //   useMutation({
  //     mutationFn: (file: File) => uploadImage({ bucket, file }),
  //     onSuccess: (res) => {
  //       return setFieldValue(
  //         field,
  //         `https://storage.googleapis.com/${bucket}/${res[0].file.originalname}`
  //       );
  //     },
  //     onError: (err) => {
  //       console.error("Upload failed:", err);
  //     },
  //   });

  // 이미지 드래그&드롭
  const handleDropImage = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    // if (file && file.type.startsWith("image/")) uploadImageMutation(file);
  };

  // 이미지 선택
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // if (file && file.type.startsWith("image/")) uploadImageMutation(file);
  };

  const handleDeleteImage = () => {
    return setFieldValue("store_image", null);
  };

  return (
    <div>
      {/* 이미지 업로드 */}
      {imageUrl ? (
        <div
          onDrop={handleDropImage}
          onDragOver={(e) => e.preventDefault()}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="relative w-[318px] h-[180px] border cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUploadImage}
            className="hidden"
          />

          <div className="absolute flex bottom-[10px] right-[10px] gap-x-[10px]">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white cursor-pointer"
            >
              변경
            </div>

            <div
              onClick={handleDeleteImage}
              className="bg-white cursor-pointer"
            >
              삭제
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDropImage}
          onDragOver={(e) => e.preventDefault()}
          className="relative w-[318px] h-[180px] border cursor-pointer"
        >
          <div>
            <p>드래그해서 이미지 업로드</p>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUploadImage}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
