import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
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

        path: "/help",
        element: <Help />,
      },
      {
        path: "/signup",
        element: <Signup />,
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
