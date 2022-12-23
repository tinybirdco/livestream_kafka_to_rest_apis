import { useCallback, useMemo } from "react";
import useLocation from "./use-location";

export default function useTimeframe() {
  const { href, search } = useLocation();

  const timeframe = useMemo(() => {
    const searchParams = new URLSearchParams(search);

    const startDateParam = searchParams.get("start_date");
    const endDateParam = searchParams.get("end_date");

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    return {
      from: startDateParam ? new Date(startDateParam) : new Date(),
      to: endDateParam ? new Date(endDateParam) : tomorrowDate,
    };
  }, [search]);

  const onTimeframeChange = useCallback(
    (selectedStartDay: Date, selectedEndDay: Date) => {
      const incrementedEndDate = new Date(selectedEndDay);
      incrementedEndDate.setDate(incrementedEndDate.getDate() + 1);

      const url = new URL(href!);
      url.searchParams.set(
        "start_date",
        selectedStartDay.toISOString().slice(0, 10)
      );
      url.searchParams.set(
        "end_date",
        incrementedEndDate.toISOString().slice(0, 10)
      );

      window.history.pushState({}, "", url);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { timeframe, onTimeframeChange };
}
