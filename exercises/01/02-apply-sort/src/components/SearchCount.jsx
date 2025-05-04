import React from "react";

import ArrowsUpDownIcon from "./icons/ArrowsUpDownIcon";

export default function SearchCount({ filteredCount, totalCount, onSort }) {
    return (
        <div className="header-summary">
            <div>{`${filteredCount} of ${totalCount} songs`}</div>
            {onSort && (
                <button className="button" onClick={onSort}>
                    <ArrowsUpDownIcon />
                </button>
            )}
        </div>
    );
}
