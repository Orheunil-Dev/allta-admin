import { SalesChart, Summary, UserChart } from "@/components/dashboard";

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full p-[40px]">
      <Summary />

      <div className="flex flex-col md:grid md:grid-cols-2 w-full gap-y-[24px] md:gap-x-[24px] mt-[20px]">
        <UserChart />
        <SalesChart />
      </div>
    </div>
  );
}
