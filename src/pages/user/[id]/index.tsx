import { useRouter } from "next/router";
import { useUserControllerGetUserDetail } from "@/api/user/user";
import { UserCouponList, UserHistory, UserProfile } from "@/components/user";

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;

  // 회원 상세 조회 API
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useUserControllerGetUserDetail(id as string, {
    query: {
      enabled: !!id,
    },
  });

  if (userError) {
    return (
      <div>
        <p>유저 조회에 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-[40px]">
      {userData && (
        <div>
          <UserProfile data={userData.data} />
          <UserHistory userId={id as string} />
          <UserCouponList userId={id as string} />
        </div>
      )}
    </div>
  );
}
