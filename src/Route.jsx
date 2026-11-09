import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import RequireProgress from "./components/RequireProgress";
import RouteFallback from "./components/RouteFallback";
import { ROUTES } from "./constants/routes";
import Board from "./pages/Board";
import Help from "./pages/Help";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

// 게임 화면 지연 로드 (첫 화면 번들에서 제외)
const Intro = lazy(() => import("./pages/Intro"));
const StagePage = lazy(() => import("./pages/StagePage"));
const Result = lazy(() => import("./pages/Result"));
const Happy = lazy(() => import("./pages/Happy"));
const Middle = lazy(() => import("./pages/Middle"));
const Sad = lazy(() => import("./pages/Sad"));
const Hidden = lazy(() => import("./pages/Hidden"));
const GameOver = lazy(() => import("./pages/GameOver"));

/** 지연 로드 화면 대기 표시 */
const withSuspense = (element) => <Suspense fallback={<RouteFallback />}>{element}</Suspense>;

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
      // 프로필(/api/my-page)을 읽는 화면이라 토큰 없이 직접 진입하면 빈 화면이 된다
      { path: "intro", element: authOnly(withSuspense(<Intro />)) },

      // 게임 스테이지 — 직전 스테이지까지 진행해야 진입할 수 있다
      // key: 스테이지 간 이동 시 상태(점수 ref·대사 흐름) 재생성
      { path: "main1", element: stageGuarded(withSuspense(<StagePage key={1} stage={1} />), 1) },
      { path: "main2", element: stageGuarded(withSuspense(<StagePage key={2} stage={2} />), 2) },
      { path: "main3", element: stageGuarded(withSuspense(<StagePage key={3} stage={3} />), 3) },
      { path: "main4", element: stageGuarded(withSuspense(<StagePage key={4} stage={4} />), 4) },
      { path: "main5", element: stageGuarded(withSuspense(<StagePage key={5} stage={5} />), 5) },

      // 결과·엔딩 — 게임을 끝내야 볼 수 있다
      { path: "result", element: completedOnly(withSuspense(<Result />)) },
      { path: "happy", element: completedOnly(withSuspense(<Happy />)) },
      { path: "middle", element: completedOnly(withSuspense(<Middle />)) },
      { path: "sad", element: completedOnly(withSuspense(<Sad />)) },
      { path: "hidden", element: completedOnly(withSuspense(<Hidden />)) },
      { path: "over", element: startedOnly(withSuspense(<GameOver />)) },

      // 부가 화면
      { path: "board", element: authOnly(<Board />) },
      { path: "profile", element: authOnly(<Profile />) },

      // 위에 걸리지 않는 모든 경로
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
