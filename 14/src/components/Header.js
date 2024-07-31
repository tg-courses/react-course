export default function Header({ children }) {
    return React.createElement(
        "div",
        { className: "header" },
        React.createElement("div", { className: "header-title" }, "Playlist"),
        children
    );
}
