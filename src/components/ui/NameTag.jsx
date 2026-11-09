import PropTypes from "prop-types";
import styled from "styled-components";

import { border, surface, text } from "../../styles/semantic";
import { radius, spacing } from "../../styles/tokens";

const NameTagLabel = styled.span`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.md};
  background: ${surface.strong};
  color: ${text.accent};
  border: 1px solid ${border.accent};
  border-radius: ${radius.pill};
  font-weight: 600;
`;

/**
 * 화자 이름표: 대사창 위에 붙는 이름 라벨
 */
function NameTag({ name }) {
  return <NameTagLabel>{name}</NameTagLabel>;
}

NameTag.propTypes = {
  name: PropTypes.string.isRequired,
};

export default NameTag;
