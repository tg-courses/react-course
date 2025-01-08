import React from "react";

export default function Header({ children }) {
    return (
        <div className="header">
            <div className="header-title">Playlist</div>
            {children}
        </div>
    );
}
