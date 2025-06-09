import React from "react";

import ArrowsUpDownIcon from "./icons/ArrowsUpDownIcon";

export default function SearchCount({ filteredCount, totalCount }) {
    return (
        <div className="header-summary">
            <div>{`${filteredCount} of ${totalCount} songs`}</div>
            <button className="button">
                <ArrowsUpDownIcon />
            </button>
        </div>
    );
}
