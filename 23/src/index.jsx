import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";

import "./index.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
