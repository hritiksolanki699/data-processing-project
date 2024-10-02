"use client";

import AggregatedTripChart from "@/components/AggregatedTripChart";
import AverageFareChart from "@/components/AverageFareChart";
import FareBreakdownChart from "@/components/FareBreakdownChart";
import HourlyTripChart from "@/components/HourlyTripChart";
import PassengerCountChart from "@/components/PassengerCountChart";
import PaymentTypeBreakdownChart from "@/components/PaymentTypeBreakdownChart";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl text-gray-800 font-bold">
        Dashboard Overview
      </h1>

      {/* First Page: Pie Charts in a Single Row */}
      <div className="min-h-screen flex flex-col items-center justify-center mt-4">
        <div className="flex justify-between w-full max-w-4xl mb-10">
          <div className="w-1/2 p-2">
            <div className="shadow-lg bg-gray-50 rounded-lg overflow-hidden h-[80vh]">
              <PaymentTypeBreakdownChart className="h-full w-full" />
            </div>
          </div>
          <div className="w-1/2 p-2">
            <div className="shadow-lg bg-gray-50 rounded-lg overflow-hidden h-[80vh]">
              <PassengerCountChart className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Second Page: Bar and Line Charts */}
      <div className="min-h-screen flex flex-col items-center justify-center mt-10">
        <div className="w-full max-w-2xl mb-10">
          <div className="shadow-lg bg-gray-50 rounded-lg overflow-hidden ">
            <HourlyTripChart className="h-full w-full" />
          </div>
        </div>
        <div className="w-full max-w-2xl mb-10">
          <div className="shadow-lg bg-gray-50 rounded-lg overflow-hidden">
            <AggregatedTripChart className="h-full w-full" />
          </div>
        </div>
        <div className="w-full max-w-2xl mb-10">
          <div className="shadow-lg bg-gray-50 rounded-lg overflow-hidden">
            <AverageFareChart className="h-full w-full" />
          </div>
        </div>
        <div className="w-full max-w-2xl mb-10">
          <div className="shadow-lg bg-gray-50 rounded-lg overflow-hidden">
            <FareBreakdownChart className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
