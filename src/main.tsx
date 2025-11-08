import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { Home } from "./pages/home.tsx";
import { createRoot } from "react-dom/client";
import { CardDetails } from "./pages/blockCardDetail.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { BlockProvider } from "./context/blockContextPRovider.tsx";


const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <BlockProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="block/:id" element={<CardDetails />} />
          </Route>
        </Routes>
      </BlockProvider>
    </BrowserRouter>
  </StrictMode>
);