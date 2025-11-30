import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./App.jsx";
import { TokenProvider } from "./context/TokenContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TokenProvider>
      <AppWrapper />
    </TokenProvider>
  </React.StrictMode>
);
