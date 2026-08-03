export type RequestFailure = {
  url: string;
  resourceType: string;
  errorText: string;
  navigation: boolean;
};

export function isExpectedCanceledRscPrefetch(failure: RequestFailure) {
  const url = new URL(failure.url);
  return !failure.navigation
    && failure.resourceType === "fetch"
    && url.searchParams.has("_rsc")
    && failure.errorText === "net::ERR_ABORTED";
}
