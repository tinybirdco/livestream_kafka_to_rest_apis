import {
  Card,
  Title,
  AreaChart,
  ColGrid,
  Col,
  Color,
  Metric,
  Text,
  Tracking,
  TrackingBlock,
} from "@tremor/react";
import useCarbonIntensity from "../hooks/api/use-carbon-intensity";
import { useBreakpoint } from "../hooks/use-media-query";
import useTimeframe from "../hooks/use-timeframe";
import { CarbonIntensityData } from "../types";
import LoadingSpinner from "./LoadingSpinner";

const categoryColorMap: Partial<Record<keyof CarbonIntensityData, Color>> = {
  intensity_actual: "blue",
  intensity_forecast: "cyan",
};

export default function CarbonIntensityCard() {
  const { timeframe } = useTimeframe();
  const isXS = useBreakpoint("xs");
  const carbonIntensityTimeframeQuery = useCarbonIntensity({ timeframe });
  const carbonIntensityLatestQuery = useCarbonIntensity({
    latest: "true",
  });

  return (
    <Card>
      <Title>Carbon Intensity</Title>
      <ColGrid numCols={1} numColsSm={2} gapX="gap-x-8">
        <Col>
          {carbonIntensityTimeframeQuery.isLoading ? (
            <LoadingSpinner />
          ) : (
            <AreaChart
              marginTop="mt-6"
              data={carbonIntensityTimeframeQuery?.data?.data ?? []}
              categories={Object.keys(categoryColorMap)}
              dataKey="time_from"
              colors={Object.values(categoryColorMap)}
            />
          )}
        </Col>

        <Col>
          {carbonIntensityLatestQuery.isLoading ? (
            <LoadingSpinner />
          ) : (
            <ColGrid
              numCols={1}
              numColsSm={2}
              gapX="gap-x-6"
              gapY="gap-y-6"
              marginTop="mt-7"
            >
              <Col>
                <Card>
                  <Text>Intensity Actual</Text>
                  <Metric>
                    {carbonIntensityLatestQuery.data?.data[0].intensity_actual}
                  </Metric>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Text>Intensity Forecast</Text>
                  <Metric>
                    {
                      carbonIntensityLatestQuery.data?.data[0]
                        .intensity_forecast
                    }
                  </Metric>
                </Card>
              </Col>
            </ColGrid>
          )}
          {carbonIntensityTimeframeQuery.isLoading ? (
            <LoadingSpinner />
          ) : (
            <Card marginTop={isXS ? "mt-6" : "mt-16"}>
              <Text>Forecast +/-</Text>
              <Tracking>
                {(
                  carbonIntensityTimeframeQuery?.data?.data?.slice(
                    isXS ? -120 : -150
                  ) ?? []
                ).map(({ time_from, intensity_actual, intensity_forecast }) => (
                  <TrackingBlock
                    key={`${time_from}-${intensity_actual}-${intensity_forecast}`}
                    color={
                      intensity_actual > intensity_forecast ? "red" : "green"
                    }
                    tooltip={`${time_from}: ${(
                      intensity_actual - intensity_forecast
                    ).toFixed(2)}`}
                  />
                ))}
              </Tracking>
            </Card>
          )}
        </Col>
      </ColGrid>
    </Card>
  );
}
