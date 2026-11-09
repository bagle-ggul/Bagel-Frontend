import styled from "styled-components";

/**
 * 화면에는 숨기고 스크린리더에만 읽히는 영역 (as="label" 등으로 태그 교체 가능)
 */
const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export default VisuallyHidden;
