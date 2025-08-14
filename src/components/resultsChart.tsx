import {
  Bar, BarChart, XAxis, YAxis, Rectangle,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
} from '@/components/ui/chart';

interface ResultsChartProps {
  data: {
    resultado: number;
    label: string;
  }[];
  chartConfig: ChartConfig;
  onClickBar?: (id: string) => void;
  onClickLabel?: (label: string) => void;
}

function ResultsChart({
  data, chartConfig, onClickBar, onClickLabel,
}: ResultsChartProps) {
  const barHeight = 40;
  const barSpacing = 20;
  const chartHeight = data.length * (barHeight + barSpacing);

  return (
    <ChartContainer
      className="w-full"
      style={{ height: chartHeight }}
      config={chartConfig}
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 0,
        }}
      >
        <YAxis
          onClick={(label) => onClickLabel?.(label.value)}
          dataKey="label"
          type="category"
          tickLine={false}
          tickMargin={5}
          axisLine={false}
          width={150}
          tickFormatter={(value) => String(chartConfig[value as keyof typeof chartConfig]?.label || value)}
          cursor={onClickLabel ? 'pointer' : undefined}
        />
        <XAxis dataKey="resultado" type="number" domain={[0, 100]} hide />
        <Bar
          dataKey="resultado"
          layout="vertical"
          fill="var(--color-resultado)"
          radius={4}
          barSize={barHeight}
          background={<Rectangle radius={4} fill="#e5e7eb" />}
          onClick={(bar) => onClickBar?.(bar.id)}
          cursor={onClickBar ? 'pointer' : undefined}
        />
      </BarChart>
    </ChartContainer>
  );
}

export { ResultsChart };
