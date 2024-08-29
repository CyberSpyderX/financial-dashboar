"use client";
import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/features/summary/components/DataGrid";

export default function DashboardPage() {
  
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid>
      </DataGrid>
      <DataCharts />
    </div>
  )
}