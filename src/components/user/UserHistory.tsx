import { useState } from "react";
import { UserSubscriptionList } from "./UserSubscriptionList";
import { UserTicketList } from "./UserTicketList";
import { UserPaymentList } from "./UserPaymentList";
import { UserServiceHistoryList } from "./UserServiceHistoryList";

type Tab = "SUBSCRIPTION" | "TICKET" | "PAYMENT" | "SERVICE";

const tabs: { key: Tab; label: string }[] = [
  { key: "SUBSCRIPTION", label: "구독권 내역" },
  { key: "TICKET", label: "일회권 내역" },
  { key: "PAYMENT", label: "결제 내역" },
  { key: "SERVICE", label: "이용 내역" },
];

interface Props {
  userId: string;
}

export const UserHistory = ({ userId }: Props) => {
  const [tab, setTab] = useState<Tab>("SUBSCRIPTION");

  const renderHistory = () => {
    switch (tab) {
      case "SUBSCRIPTION":
        return <UserSubscriptionList userId={userId} />;

      case "TICKET":
        return <UserTicketList userId={userId} />;

      case "PAYMENT":
        return <UserPaymentList userId={userId} />;

      case "SERVICE":
        return <UserServiceHistoryList userId={userId} />;
    }
  };

  return (
    <div
      style={{
        boxShadow:
          "0 4px 10px 2px hsla(240, 1.2987012987013031%, 15.098039215686276%, 0.04)",
      }}
      className="flex flex-col w-full mt-[32px] px-[32px] py-[20px] bg-white rounded-[20px] z-[2]"
    >
      <div className="flex gap-x-[12px]">
        {tabs.map((t) => {
          const isActive = tab === t.key;

          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-[12px] px-[12px]  text-[16px] font-semibold border-b-2 cursor-pointer ${
                isActive
                  ? "text-black border-b-black"
                  : "text-gray5 border-b-transparent"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {renderHistory()}
    </div>
  );
};
