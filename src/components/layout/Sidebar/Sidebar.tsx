import { useRouter } from "next/router";
import Image from "next/image";
import { MenuItem, menuItems } from "@/constants";

export const Sidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

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

  return (
    <div className="flex flex-col flex-shrink-0 w-[220px] max-h-screen bg-main border-r-[1px] border-[#DCDEDF]">
      <div className="flex items-center h-[64px] px-[20px]">
        <div
          onClick={handleRouteDashboard}
          className="text-white text-[28px] font-bold  cursor-pointer"
        >
          ATKN
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-[40px] px-[20px] pb-[40px] gap-y-[8px] text-white text-[14px] font-semibold overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => {
                item.route && router.push(item.route);
              }}
              className={`flex items-center w-full px-[8px] py-[12px] rounded-[12px] ${
                isCurrentPathname(item) ? `bg-white/20` : `bg-transparent `
              } 
            ${!item.route || (!isCurrentPathname(item) && " hover:bg-white/10")}
            ${item.route ? `cursor-pointer` : `cursor-default`}`}
            >
              <Image
                src={item.icon!}
                alt={item.category}
                className="w-[24px] h-[24px] mr-[8px]"
              />
              <p>{item.category}</p>
            </div>

            <div
              className={`flex flex-col ${
                item.menus && `pt-[8px]`
              }  gap-y-[8px]`}
            >
              {item.menus?.map((menu) => (
                <div
                  key={menu.name}
                  className={`flex items-center w-full h-[48px] pl-[44px] gap-x-[10px] rounded-[12px] cursor-pointer ${
                    isCurrentRoute(menu.route)
                      ? `bg-white/20`
                      : `bg-transparent hover:bg-white/10`
                  }`}
                  onClick={() => router.push(menu.route)}
                >
                  <p>{menu.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
