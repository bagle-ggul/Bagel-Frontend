/**
 * 라우트 경로 상수
 *
 * 경로 문자열이 컴포넌트 곳곳에 흩어져 있으면 오타를 런타임에야 발견한다.
 * 한곳에서 관리해 오타를 정의 시점에 잡는다.
 *
 * 로그인·회원가입은 별도 라우트가 아니라 홈(HOME)의 모달로 처리된다.
 */
export const ROUTES = {
  HOME: "/",
  HELP: "/help",
  INTRO: "/intro",

  // 게임 스테이지
  MAIN1: "/main1",
  MAIN2: "/main2",
  MAIN3: "/main3",
  MAIN4: "/main4",
  MAIN5: "/main5",

  // 결과·엔딩
  RESULT: "/result",
  HAPPY: "/happy",
  MIDDLE: "/middle",
  SAD: "/sad",
  HIDDEN: "/hidden",
  GAME_OVER: "/over",

  // 부가 화면
  BOARD: "/board",
  PROFILE: "/profile",
};

/**
 * 스테이지 번호 → 경로.
 * 진행도 가드가 "N번째 스테이지"를 경로로 바꿀 때 쓴다.
 */
export const STAGE_ROUTES = [ROUTES.MAIN1, ROUTES.MAIN2, ROUTES.MAIN3, ROUTES.MAIN4, ROUTES.MAIN5];

/** 게임을 완료해야 볼 수 있는 화면들 */
export const ENDING_ROUTES = [
  ROUTES.RESULT,
  ROUTES.HAPPY,
  ROUTES.MIDDLE,
  ROUTES.SAD,
  ROUTES.HIDDEN,
  ROUTES.GAME_OVER,
];

export default ROUTES;
