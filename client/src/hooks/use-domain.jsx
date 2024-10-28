import { useAuth } from "@clerk/clerk-react";
import useSWR from "swr";

export function useDomain(shouldFetch, domainName) {
  const { getToken } = useAuth();

  const fetcher = async (url) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }).then((res) => res.json());

  return useSWR(shouldFetch ? `/api/domains/${domainName}` : null, fetcher, {
    revalidateOnFocus: false,
  });
}
