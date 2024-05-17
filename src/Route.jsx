import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
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
        path: "/help",
        element: <Help />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
