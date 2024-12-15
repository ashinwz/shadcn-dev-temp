"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { DateRange } from "react-day-picker"
import { addDays, format, isWithinInterval, parseISO } from "date-fns"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "@/components/data-table/columns"
import chartData from '@/data/chart-data.json'

export default function Page() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -120),
    to: new Date(),
  })

  // Convert revenue and users to numbers and filter by date range
  const formattedMonthlyData = chartData.monthlyData
    .map(item => ({
      ...item,
      date: parseISO(item.date),
      revenue: Number(item.revenue),
      users: Number(item.users)
    }))
    .filter(item => {
      if (!date?.from || !date?.to) return true
      return isWithinInterval(item.date, { start: date.from, end: date.to })
    })
    .map(item => ({
      ...item,
      date: format(item.date, 'yyyy-MM-dd') // Format date in sortable format
    }))

  // Prepare data for the table
  const tableData = formattedMonthlyData.map((item, index) => {
    const categoryData = chartData.categoryData[index % chartData.categoryData.length]
    return {
      ...item,
      category: categoryData.category,
      sales: categoryData.sales,
      profit: categoryData.profit,
    }
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <DateRangePicker date={date} onDateChange={setDate} />
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>$45,231.89</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
              </CardHeader>
              <CardContent>+2350</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>+12,234</CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Revenue & Users Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formattedMonthlyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.categoryData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" />
                    <Bar dataKey="profit" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={tableData} />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
