import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home";
import ParameterPage from "./routes/ParameterPage";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createHashRouter, Link } from "react-router-dom";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/parameter/:id",
    element: <ParameterPage />,
  },
  {
    path: "*", // 404
    element: <>
      <div className="errorContainer">
        <h1>404</h1>
        <h2>Page not found</h2>
        <Link to="/">Go back to start</Link>
      </div>
    </>,

  }
]);


root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
