import styled from "styled-components";

import { surface } from "../styles/semantic";

const FallbackScreen = styled.div`
  min-height: 100dvh;
  background: ${surface.strong};
`;

/**
 * 지연 로드 화면 대기 표시: 어두운 전체 화면 (aria-busy)
 */
function RouteFallback() {
  return <FallbackScreen aria-busy="true" />;
}

export default RouteFallback;
