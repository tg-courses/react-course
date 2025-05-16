import useMultiFetch from "./multi-fetch";

export default function useFetch(url, requestParams) {
    const {
        requestStatus: multiRequestStatus,
        makeRequest: makeMultiRequest,
        cancelRequest: cancelMultiRequest,
    } = useMultiFetch();

    return {
        requestStatus: multiRequestStatus["default"] ?? { type: "IDLE" },
        makeRequest: () => {
            makeMultiRequest("default", url, requestParams);
        },
        cancelRequest: () => {
            cancelMultiRequest("default");
        },
    };
}
