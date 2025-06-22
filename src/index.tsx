import React from "react";
import "./styles/color.css";
import "./styles/font.css";
import { createRoot } from 'react-dom/client';
import App from "./App";
import "./styles/index.css";
import "./styles/tailwind.css";

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

