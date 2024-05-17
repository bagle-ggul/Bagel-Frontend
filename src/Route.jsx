import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import Main1 from "./pages/Main1";
import Main2 from "./pages/Main2";
import Main3 from "./pages/Main3";
import Main4 from "./pages/Main4";
import Main5 from "./pages/Main5";
import Happy from "./pages/Happy";
import Middle from "./pages/Middle";
import Result from "./pages/Result";
import Sad from "./pages/Sad";
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
        path: "main4",
        element: <Main4 />,
      },
      {
        path: "main5",
        element: <Main5 />,
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
        path: "happy",
        element: <Happy />,
      },
      {
        path: "middle",
        element: <Middle />,
      },
      {
        path: "sad",
        element: <Sad />,
      },
      {
        path: "result",
        element: <Result />,
      },
      {
        path: "board",
        element: <Board />,
      },
    ],
  },
]);

export default router;
