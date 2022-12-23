import { useQuery } from "@tanstack/react-query";
import config from "../../config";
import {
  TinybirdAPIRequest,
  TinybirdResponse,
  GenerationMixData,
} from "../../types";

const generationMixAPIName = "generation_mix_api";

export default function useGenerationMix({
  timeframe,
  latest,
  options,
}: TinybirdAPIRequest) {
  return useQuery<TinybirdResponse<GenerationMixData>>({
    queryKey: [generationMixAPIName, timeframe?.from, timeframe?.to, latest],
    queryFn: async () => {
      const generationMixAPIParams = new URLSearchParams({
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
      const generationMixAPIURL = new URL(
        `${config.BASE_URL}/${generationMixAPIName}.json?${generationMixAPIParams}`
      );

      const generationMixResponse = await fetch(generationMixAPIURL);

      if (!generationMixResponse.ok) {
        throw new Error("Network response was not ok");
      }

      return generationMixResponse.json();
    },
    ...options,
  });
}
