const header = React.createElement(
    "div",
    { className: "header" },
    React.createElement("div", { className: "header-title" }, "Playlist")
);

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(header);
