// CRA가 모든 테스트 실행 전 자동으로 로드하는 파일
// toBeInTheDocument 같은 DOM matcher를 전역 등록한다
import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

// ByText는 화면에 보이는 글자만 대상 (대사 낭독 영역은 role="status"로 따로 확인)
configure({ defaultIgnore: "script, style, [data-announcer], [data-announcer] *" });
