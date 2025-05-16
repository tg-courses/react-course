import React from "react";

import Spinner from "./Spinner";
import { useFetchInProgress } from "../hooks/multi-fetch";

export default function FetchSpinner() {
    const isInProgress = useFetchInProgress();

    return isInProgress ? <Spinner /> : <></>;
}
