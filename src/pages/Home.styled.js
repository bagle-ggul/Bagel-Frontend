import styled from "styled-components";

import { Button } from "../components/ui";
import { glass, layer, overlay, surface, text } from "../styles/semantic";
import { media } from "../styles/theme";
import { spacing } from "../styles/tokens";

// 홈 화면 레이아웃: 배경, 데스크톱·모바일 메뉴 패널, 캐릭터, 하단 모서리 버튼

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url("/img/bg_home_v4.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  text-align: center;
  color: ${text.primary};
  background: ${glass.background};
  backdrop-filter: ${glass.backdropFilter};
  border: ${glass.border};
  box-shadow: ${glass.boxShadow};
  padding: 3rem 2.5rem;
  border-radius: ${glass.borderRadius};
  width: 45rem;
  max-width: 45vw;
  z-index: ${layer.dropdown};

  @media (max-width: 1200px) {
    right: 8%;
    width: 40rem;
    max-width: 50vw;
  }

  ${media.tablet} {
    display: none; /* 모바일에서는 MobileContainer로 이동 */
  }
`;

export const CharacterWrapper = styled.div`
  position: absolute;
  left: 5%;
  bottom: 0;
  height: 80vh;
  width: auto;
  z-index: 15;

  img {
    height: 100%;
    width: auto;
    object-fit: contain;
    object-position: bottom;
    filter: drop-shadow(0 0 20px ${overlay.light});
  }

  @media (max-width: 1200px) {
    left: 3%;
    height: 70vh;
  }

  @media (max-width: 900px) {
    left: 2%;
    height: 60vh;
  }

  ${media.tablet} {
    display: none; /* 모바일에서는 MobileContainer로 이동 */
  }
`;

// 모바일 전용 컨테이너
export const MobileContainer = styled.div`
  display: none;

  ${media.tablet} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    bottom: 5vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    gap: 0;
  }

  ${media.mobile} {
    bottom: 9vh;
    gap: 0;
  }
`;

// 모바일 전용 캐릭터 래퍼
export const MobileCharacterWrapper = styled.div`
  width: auto;
  height: auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  img {
    width: auto;
    height: 38vh;
    object-fit: contain;
    object-position: bottom;
    filter: drop-shadow(0 0 20px ${overlay.light});
  }

  ${media.mobile} {
    img {
      height: 33vh;
    }
  }

  @media (max-width: 360px) {
    img {
      height: 24vh;
    }
  }
`;

// 모바일 전용 메인 래퍼
export const MobileMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  text-align: center;
  color: ${text.primary};
  background: ${glass.background};
  backdrop-filter: ${glass.backdropFilter};
  border: ${glass.border};
  box-shadow: ${glass.boxShadow};
  padding: 2rem 1.5rem;
  border-radius: ${glass.borderRadius};
  width: 45rem;
  max-width: 90vw;
  z-index: ${layer.dropdown};

  ${media.mobile} {
    padding: 1.5rem 1.2rem;
    width: 90vw;
    max-width: 90vw;
    gap: 0.5rem;
  }
`;

export const BottomRightButtonGroup = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
  z-index: ${layer.sticky};

  ${media.tablet} {
    bottom: 15px;
    right: 15px;
  }

  ${media.mobile} {
    bottom: 10px;
    right: 10px;
  }
`;

// 하단 모서리 보조 버튼(크레딧, 새로 시작): Button(ghost) 위에 어두운 유리 표면을 덧씌움
export const CornerButton = styled(Button)`
  background: ${surface.glass};
  backdrop-filter: blur(10px);
  font-size: 1rem;
  font-weight: 500;
  width: fit-content;

  &:hover:not(:disabled) {
    background: ${surface.glassHover};
  }

  ${media.tablet} {
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
  }

  ${media.mobile} {
    font-size: 0.8rem;
    padding: 0.7rem 1rem;
  }
`;

// 왼쪽 아래 버전 링크(Changelog)
export const BottomVersionInfo = styled(CornerButton)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: ${layer.sticky};

  ${media.tablet} {
    bottom: 15px;
    left: 15px;
  }

  ${media.mobile} {
    bottom: 10px;
    left: 10px;
  }
`;
