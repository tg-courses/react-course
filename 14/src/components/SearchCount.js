export default function SearchCount({ filteredCount, totalCount }) {
    return React.createElement(
        "div",
        { className: "header-summary" },
        `${filteredCount} of ${totalCount} songs`
    );
}
