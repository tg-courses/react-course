export default function Search({ onSearch }) {
    return React.createElement("input", {
        type: "text",
        placeholder: "Search...",
        className: "form-input focus",
        onChange: (event) => {
            onSearch && onSearch(event.target.value);
        },
    });
}
