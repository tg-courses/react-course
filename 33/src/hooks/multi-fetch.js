import React from "react";

export default function useMultiFetch() {
    const [requestStatus, setRequestStatus] = React.useState({});

    const abortControllerRefs = React.useRef({});

    function makeRequest(name, url, requestParams) {
        const abortController = new AbortController();
        abortControllerRefs.current[name] = abortController;

        const options = {
            signal: abortController.signal,
            ...requestParams,
        };

        setRequestStatus((status) => ({
            ...status,
            [name]: { type: "PENDING" },
        }));

        fetch(url, options)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Server returned ${response.status}`);
            })
            .then((data) => {
                setRequestStatus((status) => ({
                    ...status,
                    [name]: { type: "SUCCESS", data },
                }));
            })
            .catch((error) => {
                setRequestStatus((status) => ({
                    ...status,
                    [name]: {
                        type: "ERROR",
                        errorMessage: error.message,
                    },
                }));
            });
    }

    function cancelRequest(name) {
        if (abortControllerRefs.current && abortControllerRefs.current[name]) {
            abortControllerRefs.current[name].abort();
            abortControllerRefs.current[name] = null;
        }
    }

    React.useEffect(() => {
        return () => {
            if (abortControllerRefs.current) {
                for (const name of Object.keys(abortControllerRefs.current)) {
                    cancelRequest(name);
                }
            }
        };
    }, []);

    return { requestStatus, makeRequest, cancelRequest };
}
