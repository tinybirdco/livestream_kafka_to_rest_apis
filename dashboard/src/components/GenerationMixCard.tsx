import {
  Card,
  Title,
  AreaChart,
  ColGrid,
  Col,
  Color,
  DonutChart,
  Legend,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionList,
  BarList,
  Bold,
} from "@tremor/react";
import { useMemo } from "react";
import useGenerationMix from "../hooks/api/use-generation-mix";
import { useBreakpoint } from "../hooks/use-media-query";
import useTimeframe from "../hooks/use-timeframe";
import { GenerationMixData } from "../types";
import LoadingSpinner from "./LoadingSpinner";

const categoryColorMap: Partial<Record<keyof GenerationMixData, Color>> = {
  coal: "pink",
  gas: "amber",
  solar: "yellow",
  wind: "green",
  hydro: "cyan",
  nuclear: "sky",
  biomass: "blue",
  other_sources: "violet",
};

const generationGroups = [
  {
    name: "Fossil fuels",
    key: "fossils",
    color: "pink",
    values: ["coal", "gas"],
  },
  {
    name: "Renewables",
    key: "renewables",
    color: "green",
    values: ["solar", "wind", "hydro"],
  },
  {
    name: "Other sources",
    key: "other_sources",
    color: "blue",
    values: ["nuclear", "biomass", "other"],
  },
];

export default function GenerationMixCard() {
  const { timeframe } = useTimeframe();
  const isXS = useBreakpoint("xs");
  const generationMixTimeframeQuery = useGenerationMix({ timeframe });
  const generationMixLatestQuery = useGenerationMix({
    latest: "true",
  });

  const donutChartData = useMemo(
    () =>
      generationMixLatestQuery?.data?.data
        ? Object.keys(categoryColorMap).map((category) => ({
            name: category,
            value: generationMixLatestQuery?.data?.data[0][
              category as keyof GenerationMixData
            ] as number,
          }))
        : [],
    [generationMixLatestQuery.data]
  );

  return (
    <Card>
      <Title>Generation Mix</Title>
      <ColGrid numCols={1} numColsSm={2} gapY="gap-y-8">
        <Col numColSpan={2}>
          {generationMixTimeframeQuery.isLoading ? (
            <LoadingSpinner />
          ) : (
            <AreaChart
              marginTop="mt-6"
              data={generationMixTimeframeQuery?.data?.data ?? []}
              categories={Object.keys(categoryColorMap)}
              dataKey="time_from"
              colors={Object.values(categoryColorMap)}
            />
          )}
        </Col>
        <Col numColSpan={2} numColSpanSm={1}>
          <Legend
            marginTop="mt-7"
            categories={Object.keys(categoryColorMap)}
            colors={Object.values(categoryColorMap)}
          />
          {generationMixLatestQuery.isLoading ? (
            <LoadingSpinner />
          ) : (
            <DonutChart
              marginTop={isXS ? undefined : "mt-40"}
              data={donutChartData}
              category="value"
              dataKey="name"
              colors={Object.values(categoryColorMap)}
              variant="pie"
            />
          )}
        </Col>
        <Col numColSpan={2} numColSpanSm={1}>
          {generationMixLatestQuery.isLoading ? (
            <LoadingSpinner />
          ) : (
            <AccordionList>
              {generationGroups.map(({ name, key, color, values }) => {
                const groupPct =
                  generationMixLatestQuery?.data?.data[0][
                    key as keyof GenerationMixData
                  ];

                const groupData = values.map((v) => ({
                  name: v,
                  value:
                    (generationMixLatestQuery?.data?.data[0][
                      v as keyof GenerationMixData
                    ] as number) ?? 0,
                }));

                return (
                  <Accordion key={key} expanded>
                    <AccordionHeader>
                      <Bold>{`${name} - ${groupPct}%`}</Bold>
                    </AccordionHeader>
                    <AccordionBody>
                      <BarList
                        data={groupData}
                        color={color as Color}
                        valueFormatter={(v) => `${v}%`}
                      />
                    </AccordionBody>
                  </Accordion>
                );
              })}
            </AccordionList>
          )}
        </Col>
      </ColGrid>
    </Card>
  );
}
