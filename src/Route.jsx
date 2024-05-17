import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import Main1 from "./pages/Main1";
import Main2 from "./pages/Main2";
import Profile from "./pages/Profile";
import Intro from "./pages/Intro";
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
        path: "main2",
        element: <Main2 />,
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
      {
        path: "intro",
        element: <Intro />,
      },
    ],
  },
]);

export default router;
