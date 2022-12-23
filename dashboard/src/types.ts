import { UseQueryOptions } from "@tanstack/react-query";

export interface TinybirdResponse<T> {
  meta: Meta[];
  data: T[];
  rows: number;
  rows_before_limit_at_least: number;
  statistics: Statistics;
}

export interface Meta {
  name: string;
  type: string;
}

export interface Statistics {
  elapsed: number;
  rows_read: number;
  bytes_read: number;
}

export interface CarbonIntensityData {
  intensity_index: string;
  intensity_actual: number;
  intensity_forecast: number;
  time_from: string;
  time_to: string;
}

export interface CarbonIntensityForecastData {
  day: string;
  diff: number;
}

export interface GenerationMixData {
  time_from: string;
  time_to: string;
  coal: number;
  gas: number;
  fossils: number;
  hydro: number;
  solar: number;
  wind: number;
  renewables: number;
  other: number;
  imports: number;
  nuclear: number;
  biomass: number;
  other_sources: number;
}

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

export type Timeframe = {
  from: Date;
  to: Date;
};

export interface TinybirdAPIRequest {
  timeframe?: Timeframe;
  latest?: "true" | "false";
  options?: Omit<UseQueryOptions<any, unknown>, "queryKey" | "queryFn">;
}
