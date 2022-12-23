import { useQuery } from "@tanstack/react-query";
import config from "../../config";
import {
  TinybirdAPIRequest,
  TinybirdResponse,
  CarbonIntensityData,
} from "../../types";

const carbonIntensityAPIName = "intensity_api";

export default function useCarbonIntensity({
  timeframe,
  latest,
  options,
}: TinybirdAPIRequest) {
  return useQuery<TinybirdResponse<CarbonIntensityData>>({
    queryKey: [carbonIntensityAPIName, timeframe?.from, timeframe?.to, latest],
    queryFn: async () => {
      const carbonIntensityAPIParams = new URLSearchParams({
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
      const carbonIntensityAPIURL = new URL(
        `${config.BASE_URL}/${carbonIntensityAPIName}.json?${carbonIntensityAPIParams}`
      );

      const carbonIntensityResponse = await fetch(carbonIntensityAPIURL);

      if (!carbonIntensityResponse.ok) {
        throw new Error("Network response was not ok");
      }

      return carbonIntensityResponse.json();
    },
    ...options,
  });
}
