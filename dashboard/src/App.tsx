import { Col, ColGrid, Datepicker, Flex, Metric } from "@tremor/react";
import CarbonIntensityForecastCard from "./components/CarbonIntensityForecastCard";
import CarbonIntensityCard from "./components/CarbonIntensityCard";
import GenerationMixCard from "./components/GenerationMixCard";
import { useBreakpoint } from "./hooks/use-media-query";
import useTimeframe from "./hooks/use-timeframe";

function App() {
  const isXS = useBreakpoint("xs");
  const { timeframe, onTimeframeChange } = useTimeframe();

  return (
    <ColGrid numCols={2} gapY="gap-y-10">
      <Col numColSpan={2} numColSpanSm={1}>
        <Flex
          alignItems="items-center"
          justifyContent="justify-start"
          spaceX="space-x-4"
        >
          <img src="/favicon.ico" width="32" height="32" />
          <Metric>Tinybird Livestream: From Kafka to APIs</Metric>
        </Flex>
      </Col>
      <Col numColSpan={2} numColSpanSm={1}>
        <Flex justifyContent={isXS ? undefined : "justify-end"}>
          <Datepicker
            maxWidth={isXS ? undefined : "max-w-fit"}
            defaultStartDate={timeframe.from}
            defaultEndDate={timeframe.to}
            handleSelect={onTimeframeChange}
          />
        </Flex>
      </Col>
      <Col numColSpan={2}>
        <GenerationMixCard />
      </Col>
      <Col numColSpan={2}>
        <CarbonIntensityCard />
      </Col>
      <Col numColSpan={2}>
        <CarbonIntensityForecastCard />
      </Col>
    </ColGrid>
  );
}

export default App;
