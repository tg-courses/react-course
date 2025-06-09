import React from "react";

export default function useMultiFetch() {
    const [requestStatus, setRequestStatus] = React.useState({});

    const abortControllerRefs = React.useRef({});
    const optionsByName = React.useRef({});

    function makeRequest(name, url, requestParams, options) {
        if (abortControllerRefs.current[name]) {
            return;
        }

        const abortController = new AbortController();
        abortControllerRefs.current[name] = abortController;

        optionsByName[name] = options;

        const init = {
            signal: abortController.signal,
            ...requestParams,
        };

        setRequestStatus((status) => ({
            ...status,
            [name]: { type: "PENDING" },
        }));

        fetch(url, init)
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
                if (error.name !== "AbortError") {
                    setRequestStatus((status) => ({
                        ...status,
                        [name]: {
                            type: "ERROR",
                            errorMessage: error.message,
                        },
                    }));
                }
            })
            .finally(() => {
                abortControllerRefs.current[name] = null;
            });
    }

    function cancelRequest(name) {
        const cancellable = optionsByName[name]?.cancellable ?? true;
        if (!cancellable) {
            return;
        }

        if (abortControllerRefs.current && abortControllerRefs.current[name]) {
            abortControllerRefs.current[name].abort();
            abortControllerRefs.current[name] = null;
            setRequestStatus((status) => ({
                ...status,
                [name]: {
                    type: "ERROR",
                    errorMessage: "Fetch aborted",
                },
            }));
        }
    }

    function clearRequestStatus(name) {
        setRequestStatus((requestStatus) => {
            const newRequestStatus = { ...requestStatus };
            delete newRequestStatus[name];
            return newRequestStatus;
        });
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

    return { requestStatus, makeRequest, cancelRequest, clearRequestStatus };
}
