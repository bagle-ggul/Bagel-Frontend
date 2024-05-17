import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
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
import Hidden from "./pages/Hidden";
import GameOver from "./pages/GameOver";
import MyGameResult from "./pages/MyGameResult";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("refreshToken");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};

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
        path: "signup",
        element: <Signup />,
      },
      {
        path: "main1",
        element: (
          <ProtectedRoute>
            <Main1 />
          </ProtectedRoute>
        ),
      },
      {
        path: "main2",
        element: (
          <ProtectedRoute>
            <Main2 />
          </ProtectedRoute>
        ),
      },
      {
        path: "main3",
        element: (
          <ProtectedRoute>
            <Main3 />
          </ProtectedRoute>
        ),
      },
      {
        path: "main4",
        element: (
          <ProtectedRoute>
            <Main4 />
          </ProtectedRoute>
        ),
      },
      {
        path: "main5",
        element: (
          <ProtectedRoute>
            <Main5 />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute>
            <Happy />
          </ProtectedRoute>
        ),
      },
      {
        path: "middle",
        element: (
          <ProtectedRoute>
            <Middle />
          </ProtectedRoute>
        ),
      },
      {
        path: "sad",
        element: (
          <ProtectedRoute>
            <Sad />
          </ProtectedRoute>
        ),
      },
      {
        path: "hidden",
        element: (
          <ProtectedRoute>
            <Hidden />
          </ProtectedRoute>
        ),
      },
      {
        path: "result",
        element: (
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        ),
      },
      {
        path: "board/:page",
        element: (
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        ),
      },
      {
        path: "over",
        element: (
          <ProtectedRoute>
            <GameOver />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
