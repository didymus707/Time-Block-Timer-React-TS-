import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import { CardDetails } from "./pages/blockCardDetail.tsx";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/block/:id" element={<CardDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
