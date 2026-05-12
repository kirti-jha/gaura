console.log("%c[GauryaTech] Frontend loaded", "color: #00aa88; font-weight: bold; font-size: 16px;");
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
