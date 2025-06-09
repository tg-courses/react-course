import React from "react";

function createAtom(initialValue) {
    let value = initialValue;

    const listeners = new Set();

    return {
        getValue() {
            return value;
        },

        setValue(newValue) {
            value = newValue;
            for (const listener of listeners) {
                listener();
            }
        },

        subscribe(listener) {
            listeners.add(listener);
        },

        unsubscribe(listener) {
            listeners.delete(listener);
        }
    };
}

const fetchInProgressAtom = createAtom(false);

export function useFetchInProgress() {
    const [isInProgress, setIsInProgress] = React.useState(false);

    React.useEffect(() => {
        function onUpdate() {
            setIsInProgress(fetchInProgressAtom.getValue());
        }

        fetchInProgressAtom.subscribe(onUpdate);
        return () => fetchInProgressAtom.unsubscribe(onUpdate);
    }, []);

    return isInProgress;
}

let requestCount = 0;

export default function useMultiFetch() {
    const [requestStatus, setRequestStatus] = React.useState({});

    const abortControllerRefs = React.useRef({});

    function makeRequest(name, url, requestParams) {
        if (abortControllerRefs.current[name]) {
            return;
        }

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

        requestCount++;
        fetchInProgressAtom.setValue(true);

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

                requestCount--;
                if (requestCount === 0) {
                    fetchInProgressAtom.setValue(false);
                }
            });
    }

    function cancelRequest(name) {
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
