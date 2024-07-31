import React from "react";

export default function List({ songs, onDelete }) {
    const listItems = songs.map((song) => {
        const title = React.createElement(
            "div",
            { className: "item-title" },
            song.title
        );

        const moveButtonsContainer = React.createElement(
            "div",
            {
                className:
                    "item-position-buttons item-position-buttons-enabled",
            },

            // Up button
            React.createElement(
                "button",
                { className: "item-position-button" },
                "\u2191"
            ),

            // Down button
            React.createElement(
                "button",
                { className: "item-position-button" },
                "\u2193"
            )
        );

        const actionButtonsContainer = React.createElement(
            "div",
            { className: "item-actions" },

            // Delete button
            onDelete &&
                React.createElement(
                    "button",
                    {
                        className: "button item-action-button",
                        onClick: () => onDelete(song),
                    },
                    "\u24E7"
                ),

            // Edit button
            React.createElement(
                "button",
                { className: "button item-action-button" },
                "\u270E"
            )
        );

        return React.createElement(
            "li",
            { className: "item item-normal" },
            moveButtonsContainer,
            title,
            actionButtonsContainer
        );
    });

    return React.createElement(
        "ul",
        { className: "content item-list focus" },
        ...listItems
    );
}
