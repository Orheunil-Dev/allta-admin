import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAuthControllerLogout } from "@/api/auth/auth";
import { useResizeHandler } from "@/hooks";
import { menuItems } from "@/constants";
import { dropdownArrowIcon } from "../../../../public/images";

export const BreadCrumb = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const [adminInfo, setAdminInfo] = useState<{
    name: string;
    phoneNumber: string;
    email: string;
  } | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[] | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const { isMobile } = useResizeHandler();

  // 로그아웃 API
  const {
    mutate: logout,
    isPending: logoutLoading,
    isError: logoutError,
  } = useAuthControllerLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  useEffect(() => {
    const admin = Cookies.get("admin");

    if (admin) {
      try {
        const parsed = JSON.parse(admin);
        setAdminInfo(parsed);
      } catch (e) {
        console.error("Invalid admin cookie");
      }
    }
  }, []);

  useEffect(() => {
    const findBreadcrumb = () => {
      for (const item of menuItems) {
        if (item.route && currentPath.startsWith(item.route)) {
          const restPath = currentPath.replace(item.route, "");

          if (!restPath || restPath === "/") {
            return [item.category];
          } else if (restPath.includes("/register")) {
            return [item.category, "등록"];
          } else {
            return [item.category, "상세"];
          }
        }

        if (item.menus) {
          for (const menu of item.menus) {
            if (currentPath.startsWith(menu.route)) {
              const restPath = currentPath.replace(menu.route, "");

              if (!restPath || restPath === "/") {
                return [item.category, menu.name];
              } else if (restPath.includes("/register")) {
                return [item.category, menu.name, "등록"];
              } else {
                return [item.category, menu.name, "상세"];
              }
            }
          }
        }
      }

      return [""];
    };

    const breadcrumbData = findBreadcrumb();

    setBreadcrumb(breadcrumbData);
  }, [router.pathname]);

  return (
    <div className="fixed flex items-center w-full md:w-[calc(100vw-300px)] h-[50px] md:h-[64px] top-[60px] md:top-0 px-[20px] md:px-[44px] bg-white border-b border-gray2 z-[3]">
      <div className="flex justify-between items-center w-full h-full">
        <div className="flex">
          {breadcrumb?.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <div className="mx-[10px]">/</div>}

              <span className="text-[16px] md:text-[20px] font-semibold text-gray-800">
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="relative flex h-full">
          <div
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            className="flex items-center cursor-pointer h-full"
          >
            <p className="text-[16px] font-semibold text-gray7">
              {adminInfo?.name}
            </p>

            <Image
              src={dropdownArrowIcon}
              alt="프로필 메뉴"
              className="w-[24px] h-[24px] ml-[4px]"
            />
          </div>

          {showInfo && (
            <div
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
              className="absolute flex flex-col w-[180px] md:w-[264px] top-[50px] right-0 bg-white rounded-[20px]"
            >
              <div className="flex flex-col px-[16px] md:px-[20px] py-[12px] md:py-[16px] border-b border-gray1">
                <p className="text-[14px] md:text-[16px] font-semibold">
                  {adminInfo?.name}
                </p>
                <p className="text-[12px] md:text-[14px] text-gray5">
                  {adminInfo?.email}
                </p>
              </div>

              <div className="flex flex-col px-[20px] py-[16px]">
                <div
                  onClick={handleLogout}
                  className="w-fit text-[14px] md:text-[16px] cursor-pointer"
                >
                  로그아웃
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
