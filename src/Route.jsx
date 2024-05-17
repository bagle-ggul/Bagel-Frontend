import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "start",
        element: <Start />,
      },
    ],
  },
]);

export default router;
