import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartConfig = {
  score: {
    label: "Score",
    color: "primary",
  },
} satisfies ChartConfig

interface ScoreChartProps {
  score: number;
}

function ScoreChart({ score }: ScoreChartProps) {
  const currentData = [{ score }];

  return (
    <ChartContainer
      config={chartConfig}
      className="w-[105px] h-[105px] mx-auto"
    >
      <RadialBarChart
        data={currentData}
        startAngle={0}
        endAngle={score * 3.6}
        innerRadius={47.06}
        outerRadius={64.71}
        width={147.06}
        height={147.06}
        barSize={17.65}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[50.59, 43.53]}
        />
        <RadialBar 
          dataKey="score" 
          background 
          cornerRadius={10}
          fill="var(--color-primary)"
        />
        <PolarRadiusAxis 
          tick={false} 
          tickLine={false} 
          axisLine={false}
          domain={[0, 100]}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {`${currentData[0].score}%`}
                    </tspan>
                  </text>
                )
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}

export default ScoreChart;
