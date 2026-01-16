// 전화번호 입력 필터링
export const filterPhoneTextareaValue = (value: string) => {
  return value.replace(/[^0-9-\n]/g, "");
};
