import { createBrowserRouter, Navigate } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import Board from "./pages/Board";
import GameOver from "./pages/GameOver";
import Happy from "./pages/Happy";
import Help from "./pages/Help";
import Hidden from "./pages/Hidden";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import Main1 from "./pages/Main1";
import Main2 from "./pages/Main2";
import Main3 from "./pages/Main3";
import Main4 from "./pages/Main4";
import Main5 from "./pages/Main5";
import Middle from "./pages/Middle";
import Profile from "./pages/Profile";
import Result from "./pages/Result";
import Sad from "./pages/Sad";
// import MyGameResult from "./pages/MyGameResult"; // 현재 사용하지 않음

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "main1",
        element: (
          <RequireAuth>
            <Main1 />
          </RequireAuth>
        ),
      },
      {
        path: "main2",
        element: (
          <RequireAuth>
            <Main2 />
          </RequireAuth>
        ),
      },
      {
        path: "main3",
        element: (
          <RequireAuth>
            <Main3 />
          </RequireAuth>
        ),
      },
      {
        path: "main4",
        element: (
          <RequireAuth>
            <Main4 />
          </RequireAuth>
        ),
      },
      {
        path: "main5",
        element: (
          <RequireAuth>
            <Main5 />
          </RequireAuth>
        ),
      },
      {
        path: "profile",
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
      {
        path: "intro",
        element: <Intro />,
      },
      {
        path: "happy",
        element: (
          <RequireAuth>
            <Happy />
          </RequireAuth>
        ),
      },
      {
        path: "middle",
        element: (
          <RequireAuth>
            <Middle />
          </RequireAuth>
        ),
      },
      {
        path: "sad",
        element: (
          <RequireAuth>
            <Sad />
          </RequireAuth>
        ),
      },
      {
        path: "hidden",
        element: (
          <RequireAuth>
            <Hidden />
          </RequireAuth>
        ),
      },
      {
        path: "result",
        element: (
          <RequireAuth>
            <Result />
          </RequireAuth>
        ),
      },
      {
        path: "ranking",
        element: <Navigate to="/board" />,
      },
      {
        path: "board",
        element: (
          <RequireAuth>
            <Board />
          </RequireAuth>
        ),
      },
      {
        path: "over",
        element: (
          <RequireAuth>
            <GameOver />
          </RequireAuth>
        ),
      },
    ],
  },
]);

export default router;
