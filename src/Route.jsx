import { createBrowserRouter } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import RequireProgress from "./components/RequireProgress";
import { ROUTES } from "./constants/routes";
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
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Result from "./pages/Result";
import Sad from "./pages/Sad";

/** 로그인만 필요한 화면 */
const authOnly = (element) => <RequireAuth>{element}</RequireAuth>;

/** 로그인 + 해당 스테이지까지 진행했어야 하는 화면 */
const stageGuarded = (element, stage) => (
  <RequireAuth>
    <RequireProgress stage={stage}>{element}</RequireProgress>
  </RequireAuth>
);

/** 로그인 + 게임을 끝냈어야 하는 화면 (결과·엔딩) */
const completedOnly = (element) => (
  <RequireAuth>
    <RequireProgress requireCompleted>{element}</RequireProgress>
  </RequireAuth>
);

/** 로그인 + 게임을 시작했어야 하는 화면 (게임오버는 플레이 도중 발생한다) */
const startedOnly = (element) => (
  <RequireAuth>
    <RequireProgress requireStarted>{element}</RequireProgress>
  </RequireAuth>
);

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    // 정의되지 않은 주소는 여기서 404 화면으로 처리한다
    errorElement: <NotFound />,
    children: [
      { path: "", element: <Home /> },
      { path: "help", element: <Help /> },
      { path: "intro", element: <Intro /> },

      // 게임 스테이지 — 직전 스테이지까지 진행해야 진입할 수 있다
      { path: "main1", element: stageGuarded(<Main1 />, 1) },
      { path: "main2", element: stageGuarded(<Main2 />, 2) },
      { path: "main3", element: stageGuarded(<Main3 />, 3) },
      { path: "main4", element: stageGuarded(<Main4 />, 4) },
      { path: "main5", element: stageGuarded(<Main5 />, 5) },

      // 결과·엔딩 — 게임을 끝내야 볼 수 있다
      { path: "result", element: completedOnly(<Result />) },
      { path: "happy", element: completedOnly(<Happy />) },
      { path: "middle", element: completedOnly(<Middle />) },
      { path: "sad", element: completedOnly(<Sad />) },
      { path: "hidden", element: completedOnly(<Hidden />) },
      { path: "over", element: startedOnly(<GameOver />) },

      // 부가 화면
      { path: "board", element: authOnly(<Board />) },
      { path: "profile", element: authOnly(<Profile />) },

      // 위에 걸리지 않는 모든 경로
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
