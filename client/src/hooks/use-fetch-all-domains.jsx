import { useAuth } from "@clerk/clerk-react";
import useSWR from "swr";

export function useFetchAllDomains() {
  const { getToken } = useAuth();

  const fetcher = async (url) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }).then((res) => res.json());

  return useSWR("/api/domains", fetcher, {
    revalidateOnFocus: false,
  });
}
