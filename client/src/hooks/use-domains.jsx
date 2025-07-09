import { useAuth } from "@clerk/clerk-react";
import useSWR from "swr";

export function useDomains(domainName) {
  const { getToken } = useAuth();

  const fetcher = async (url) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }).then((res) => res.json());

  const url = domainName ? `/api/domains/${domainName}` : "/api/domains";

  return useSWR(url, fetcher, {
    revalidateOnFocus: false,
  });
}
