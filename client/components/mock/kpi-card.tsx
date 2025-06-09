"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, className }: KPICardProps) {
  const formatValue = (val: string | number, isRevenue: boolean = false) => {
    if (typeof val === "number") {
      if (isRevenue && val >= 1000) {
        return `$${(val / 1000).toFixed(1)}k`;
      } else if (isRevenue) {
        return `$${val.toLocaleString()}`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={`border-l-4 border-l-teal-600 ${className}`} data-testid="kpi-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-teal-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value, title.toLowerCase().includes("revenue"))}
        </div>
        {trend && (
          <p className={`text-xs ${trend.positive !== false ? "text-green-600" : "text-red-600"}`}>
            {trend.positive !== false ? "+" : ""}{trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 