import { Card, Title, AreaChart } from "@tremor/react";
import useIntensityForecastAccuracy from "../hooks/api/use-intensity-forecast-accuracy";
import useTimeframe from "../hooks/use-timeframe";
import LoadingSpinner from "./LoadingSpinner";

export default function CarbonIntensityForecastCard() {
  const { timeframe } = useTimeframe();
  const carbonIntensityForecastTimeframeQuery = useIntensityForecastAccuracy({
    timeframe,
  });

  return (
    <Card>
      <Title>Carbon Intensity forecast accuracy</Title>

      {carbonIntensityForecastTimeframeQuery.isLoading ? (
        <LoadingSpinner />
      ) : (
        <AreaChart
          marginTop="mt-6"
          data={carbonIntensityForecastTimeframeQuery?.data?.data ?? []}
          categories={["diff"]}
          dataKey="day"
          colors={["blue"]}
        />
      )}
    </Card>
  );
}
