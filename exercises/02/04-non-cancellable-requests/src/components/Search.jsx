import React from "react";

export default function Search({ onSearch }) {
    return (
        <input
            type="text"
            placeholder="Search..."
            className="form-input focus"
            onChange={(event) => {
                onSearch && onSearch(event.target.value);
            }}
        />
    );
}
