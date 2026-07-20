'use client';

import type { GrowthRecord } from '@/types';
import { formatDateShort } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

interface WeightChartProps {
  records: GrowthRecord[];
}

export function WeightChart({ records }: WeightChartProps) {
  const data = [...records]
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    .map((r) => ({
      date: formatDateShort(r.recordedAt),
      peso: Number(r.weightKg),
    }));

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>Registra el peso para ver la gráfica de crecimiento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Evolución de peso (kg)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit=" kg" />
              <Tooltip
                formatter={(value: number) => [`${value} kg`, 'Peso']}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e7e5e4',
                }}
              />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#ea580c"
                strokeWidth={2}
                dot={{ fill: '#ea580c', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
