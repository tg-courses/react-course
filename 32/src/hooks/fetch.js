import React from "react";

export default function useFetch(url, requestParams) {
    const [requestStatus, setRequestStatus] = React.useState({ type: "IDLE" });

    const abortControllerRef = React.useRef(null);

    if (abortControllerRef.current === null) {
        abortControllerRef.current = new AbortController();
    }

    const options = {
        signal: abortControllerRef.current.signal,
        ...requestParams,
    };

    function makeRequest() {
        setRequestStatus({ type: "PENDING" });
        fetch(url, options)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Server returned ${response.status}`);
            })
            .then((data) => {
                setRequestStatus({ type: "SUCCESS", data });
            })
            .catch((error) => {
                setRequestStatus({
                    type: "ERROR",
                    errorMessage: error.message,
                });
            });
    }

    function cancelRequest() {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
    }

    React.useEffect(() => {
        return cancelRequest;
    }, []);

    return { requestStatus, makeRequest, cancelRequest };
}
