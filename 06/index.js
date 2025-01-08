function Header() {
    return React.createElement(
        "div",
        { className: "header" },
        React.createElement("div", { className: "header-title" }, "Playlist")
    );
}

function List() {
    const songs = [
        { id: 1, title: "Biosphere - Poa Alpina" },
        { id: 2, title: "Biosphere - Hyperborea" },
        { id: 3, title: "Brian Eno - Under Stars" },
        { id: 4, title: "Brian Eno - An Ending (Ascent)" },
        { id: 5, title: "Global Communication - 14:31" },
        { id: 6, title: "Robert Rich - Distant Traveler" },
        { id: 7, title: "Steve Roden - Forms of Paper" },
        { id: 8, title: "Workbench - Serpents" },
        { id: 9, title: "Brian Eno - Music for Airports" },
    ];

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
            React.createElement(
                "button",
                { className: "button item-action-button" },
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

function App() {
    return [React.createElement(Header), React.createElement(List)];
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));
