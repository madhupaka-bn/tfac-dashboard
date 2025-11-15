"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from "recharts"
import { Calendar, ShoppingBag, IndianRupee, TrendingUp, Shirt, Repeat2, Star, Truck, MapPin, Users, UserRound, Unplug } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {FaFemale, FaMale, FaTransgender} from "react-icons/fa";

// ---------------- Mock Data ----------------
const monthlyData = [
  { month: "Jan", orders: 112, revenue: 195000 },
  { month: "Feb", orders: 148, revenue: 262000 },
  { month: "Mar", orders: 172, revenue: 321500 },
  { month: "Apr", orders: 214, revenue: 385200 },
  { month: "May", orders: 198, revenue: 349000 },
  { month: "Jun", orders: 251, revenue: 410700 },
  { month: "Jul", orders: 196, revenue: 371200 },
  { month: "Aug", orders: 289, revenue: 492400 },
  { month: "Sep", orders: 271, revenue: 450100 },
  { month: "Oct", orders: 317, revenue: 526700 },
  { month: "Nov", orders: 298, revenue: 502300 },
  { month: "Dec", orders: 333, revenue: 579400 },
]

const stateSales = [
  { state: "Maharashtra", orders: 418, revenue: 325000, topProduct: "Climate Action Tee" },
  { state: "Karnataka", orders: 362, revenue: 280400, topProduct: "Youth Empowerment Tee" },
  { state: "Delhi", orders: 290, revenue: 212300, topProduct: "Education for All" },
  { state: "Tamil Nadu", orders: 248, revenue: 198200, topProduct: "Climate Action Tee" },
  { state: "Gujarat", orders: 164, revenue: 125700, topProduct: "Youth Empowerment Tee" },
]

const topProducts = [
  { rank: 1, name: "Climate Action Tee", designer: "Rohan", orders: 562, revenue: 429800, avg: 764 },
  { rank: 2, name: "Youth Empowerment Tee", designer: "Ananya", orders: 481, revenue: 345600, avg: 719 },
  { rank: 3, name: "Education for All", designer: "Priya", orders: 382, revenue: 271800, avg: 711 },
]

const sizeDistribution = [
  { size: "XS", count: 212 },
  { size: "S", count: 415 },
  { size: "M", count: 602 },
  { size: "L", count: 504 },
  { size: "XL", count: 329 },
]

const COLORS = ["#059669", "#FFC107", "#FF5722", "#3F51B5", "#9C27B0"]

const deviceData = [
  { name: "Mobile", value: 130 },
  { name: "Desktop", value: 56 },
]

const CHART_COLORS = ["#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"]

const cityData = [
    { city: "Mumbai", count: 68 },
    { city: "Delhi", count: 44 },
    { city: "Bangalore", count: 32 },
    { city: "Chennai", count: 22 },
    { city: "Hyderabad", count: 20 },
  ]

const genderStats = [
  { gender: "Male", icon: FaMale, orders: 810, revenue: 1520000, topProduct: "Climate Action Tee" },
  { gender: "Female", icon:  FaFemale, orders: 620, revenue: 1280000, topProduct: "Youth Empowerment Tee" },
  { gender: "Unisex", icon: FaTransgender, orders: 52, revenue: 104000, topProduct: "Education for All" },
]

// ---------------- Component ----------------
export default function DashboardHome() {
  const [filter, setFilter] = useState("this-month")
  const [customRange, setCustomRange] = useState({ from: "", to: "" })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Sales Overview</h1>
          <p className="text-muted-foreground">Track T-shirt sales performance and growth metrics</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 items-center">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {filter === "custom" && (
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={customRange.from}
                onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={customRange.to}
                onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
              />
              <Button size="sm" variant="secondary">Apply</Button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard icon={ShoppingBag} label="Total Orders" value="1,482" />
        <MetricCard icon={Shirt} label="Products Sold" value="3,612" />
        <MetricCard icon={IndianRupee} label="Total Revenue" value="₹28,46,320" />
        <MetricCard icon={TrendingUp} label="Avg. Order Value" value="₹1,920" />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard icon={Repeat2} label="Repeat Customers" value="22%" />
        <MetricCard icon={Star} label="Top Designer" value="Rohan" />
        <MetricCard icon={Truck} label="Pending Deliveries" value="127" />
        <MetricCard icon={MapPin} label="Most Active City" value="Mumbai" />
      </div>

            {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Designer</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p) => (
                  <TableRow key={p.rank}>
                    <TableCell>#{p.rank}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.designer}</TableCell>
                    <TableCell className="text-right">{p.orders}</TableCell>
                    <TableCell className="text-right">₹{p.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 mt-8">Gender-wise Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {genderStats.map((g) => (
            <Card key={g.gender} className="p-6 border border-muted">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <g.icon className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{g.gender}</h3>
                  <p className="text-sm text-muted-foreground">Orders: {g.orders.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Revenue: ₹{g.revenue.toLocaleString()}</p>
                  <p className="text-sm text-foreground mt-1">
                    Top Product: <span className="font-medium">{g.topProduct}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      
      <ChartCard title="Orders by Day (Sample Week)">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={[
              { day: "Mon", orders: 42 },
              { day: "Tue", orders: 65 },
              { day: "Wed", orders: 59 },
              { day: "Thu", orders: 72 },
              { day: "Fri", orders: 68 },
              { day: "Sat", orders: 91 },
              { day: "Sun", orders: 55 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="orders" stroke="#10b981" fill="#10b98122" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Orders by City</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="city" tick={{ fill: "#6B7280" }} />
                <YAxis tick={{ fill: "#6B7280" }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {cityData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
                {/* Sales by States */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by States</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Top Product</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stateSales.map((s) => (
                  <TableRow key={s.state}>
                    <TableCell>{s.state}</TableCell>
                    <TableCell className="text-right">{s.orders}</TableCell>
                    <TableCell className="text-right">₹{s.revenue.toLocaleString()}</TableCell>
                    <TableCell>{s.topProduct}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
       </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Sales by Size">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sizeDistribution} dataKey="count" nameKey="size" outerRadius={100}>
                {sizeDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card className="p-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Device Split</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={deviceData} dataKey="value" outerRadius={90} label>
                  <Cell fill="#6366F1" />
                  <Cell fill="#A78BFA" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center mt-8">
        Data updated 2 mins ago. Mock analytics for demonstration.
      </p>
    </div>
  )
}

// Reusable Metric Card
function MetricCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="p-4 flex items-center gap-4 border-muted">
      <div className="p-3 rounded-lg bg-muted">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold text-foreground">{value}</p>
      </div>
    </Card>
  )
}


function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}