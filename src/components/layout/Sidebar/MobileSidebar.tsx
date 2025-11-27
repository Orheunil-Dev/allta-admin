import { useRouter } from "next/router";
import Image from "next/image";
import { MenuItem, menuItems } from "@/constants";
import { useState } from "react";
import { hamburgerIcon } from "../../../../public/images";

export const MobileSidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isCurrentPathname = (item: MenuItem) => {
    if (item.route) {
      return currentPath.startsWith(item.route);
    }

    return false;
  };

  const isCurrentRoute = (route: string) => {
    const p1 = currentPath.split("/")[1];
    const p2 = route.split("/")[1];

    return p1 === p2;
  };

  const handleRouteDashboard = () => {
    router.push("/dashboard");
  };

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed flex flex-col w-full bg-main duration-300 overflow-y-hidden z-[4] 
        ${isOpen ? "h-screen" : "h-[60px]"}
        `}
    >
      <div className="flex flex-shrink-0 justify-between items-center h-[60px] px-[10px]">
        <div
          onClick={handleRouteDashboard}
          className="ml-[10px] text-white text-[28px] font-bold cursor-pointer"
        >
          ATKN
        </div>

        <button onClick={handleToggleMenu} className="cursor-pointer">
          <Image src={hamburgerIcon} alt="메뉴" className="w-[40px] h-[40px]" />
        </button>
      </div>

      <div className="flex flex-col px-[10px] pt-[20px] pb-[40px] gap-y-[8px] text-white text-[16px] font-semibold overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => {
                item.route && router.push(item.route);
                setIsOpen(false);
              }}
              className={`flex items-center w-full h-[40px] px-[12px] rounded-[12px] ${
                isCurrentPathname(item) ? `bg-white/20` : `bg-transparent `
              } 
            ${!item.route || (!isCurrentPathname(item) && " hover:bg-white/10")}
            ${item.route ? `cursor-pointer` : `cursor-default`}`}
            >
              <Image
                src={item.icon!}
                alt={item.category}
                className="w-[20px] h-[20px] mr-[8px]"
              />
              <p className="text-[16px]">{item.category}</p>
            </div>

            <div
              className={`flex flex-col ${
                item.menus && `pt-[8px]`
              }  gap-y-[8px]`}
            >
              {item.menus?.map((menu) => (
                <div
                  key={menu.name}
                  className={`flex items-center w-full h-[40px] pl-[44px] gap-x-[10px] rounded-[12px] cursor-pointer ${
                    isCurrentRoute(menu.route)
                      ? `bg-white/20`
                      : `bg-transparent hover:bg-white/10`
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(menu.route);
                  }}
                >
                  <p className="text-[16px]">{menu.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
