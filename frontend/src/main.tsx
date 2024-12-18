import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router";
import Questions from "./pages/questions.tsx";
import Question from "./pages/question";
import User from "./pages/user.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Questions />,
      },
      {
        path: "questions/:id",
        element: <Question />,
      },
      {
        path: "users/:id",
        element: <User />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
