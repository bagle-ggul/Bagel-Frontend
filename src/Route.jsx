import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import Profile from "./pages/Profile";
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
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
