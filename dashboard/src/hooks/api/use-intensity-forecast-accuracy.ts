import { useQuery } from "@tanstack/react-query";
import config from "../../config";
import {
  TinybirdResponse,
  CarbonIntensityForecastData,
  TinybirdAPIRequest,
} from "../../types";

const carbonIntensityForecastAPIName = "intensity_forecast_accuracy_api";

export default function useIntensityForecastAccuracy({
  timeframe,
  latest,
  options,
}: TinybirdAPIRequest) {
  return useQuery<TinybirdResponse<CarbonIntensityForecastData>>({
    queryKey: [
      carbonIntensityForecastAPIName,
      timeframe?.from,
      timeframe?.to,
      latest,
    ],
    queryFn: async () => {
      const carbonIntensityForecastAPIParams = new URLSearchParams({
        token: config.TOKEN,
        // removes undefined
        ...JSON.parse(
          JSON.stringify({
            latest,
            param_from: timeframe?.from.toISOString().slice(0, 10),
            param_to: timeframe?.to.toISOString().slice(0, 10),
          })
        ),
      });
      const carbonIntensityForecastAPIURL = new URL(
        `${config.BASE_URL}/${carbonIntensityForecastAPIName}.json?${carbonIntensityForecastAPIParams}`
      );

      const carbonIntensityForecastResponse = await fetch(
        carbonIntensityForecastAPIURL
      );

      if (!carbonIntensityForecastResponse.ok) {
        throw new Error("Network response was not ok");
      }

      return carbonIntensityForecastResponse.json();
    },
    ...options,
  });
}
