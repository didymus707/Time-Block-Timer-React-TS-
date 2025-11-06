import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import { CardDetails } from "./pages/blockCardDetail.tsx";
import { BlockProvider } from "./context/blockContextPRovider.tsx";


const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <BlockProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/block/:id" element={<CardDetails />} />
          </Route>
        </Routes>
      </BlockProvider>
    </BrowserRouter>
  </StrictMode>
);