import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import Main1 from "./pages/Main1";
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
        path: "/help",
        element: <Help />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "main1",
        element: <Main1 />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
