import React from "react";

export default function SearchCount({ filteredCount, totalCount }) {
    return (
        <div className="header-summary">{`${filteredCount} of ${totalCount} songs`}</div>
    );
}
