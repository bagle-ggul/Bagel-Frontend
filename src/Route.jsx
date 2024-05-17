import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import Main1 from "./pages/Main1";
import Main2 from "./pages/Main2";
import Main3 from "./pages/Main3";
import Profile from "./pages/Profile";
import Intro from "./pages/Intro";
import Board from "./pages/Board";
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
        path: "main3",
        element: <Main3 />,
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
        path: "login",
        element: <Login />,
      },
      {
        path: "intro",
        element: <Intro />,
      },
      {
        path: "board",
        element: <Board />,
      },
    ],
  },
]);

export default router;
