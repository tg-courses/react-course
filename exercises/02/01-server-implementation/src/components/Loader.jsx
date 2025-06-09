import React from "react";

import Spinner from "./Spinner";

export default function Loader({ children }) {
    return (
        <div className="loader">
            <Spinner />
            {children}
        </div>
    );
}
