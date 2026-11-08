import { act, renderHook, waitFor } from "@testing-library/react";

import { getRefreshToken } from "../utils/auth";
import { fetchSuggestedNickname, startAsGuest } from "../utils/guestApi";
import { logger } from "../utils/logger";

import { useGuestStartForm } from "./useGuestStartForm";

// 실제 네트워크 호출 금지 — API 모듈 단위로 모킹한다
jest.mock("../utils/guestApi");
// 의도된 실패 케이스의 에러 로그가 테스트 출력을 어지럽히지 않게 한다
jest.mock("../utils/logger");

const selectAllMbtiAxes = (result, [e, s, t, j] = ["E", "N", "F", "P"]) => {
  act(() => {
    result.current.selectMbtiAxis("e", e);
    result.current.selectMbtiAxis("s", s);
    result.current.selectMbtiAxis("t", t);
    result.current.selectMbtiAxis("j", j);
  });
};

describe("useGuestStartForm 닉네임 추천", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("열리면 서버가 추천한 닉네임으로 입력란이 채워진다", async () => {
    fetchSuggestedNickname.mockResolvedValue("고소한베이글482");

    const { result } = renderHook(() => useGuestStartForm({ onStarted: jest.fn() }));

    await waitFor(() => expect(result.current.characterName).toBe("고소한베이글482"));
    expect(result.current.isNicknameLoading).toBe(false);
  });

  it("다시 뽑으면 새 추천값으로 바뀐다", async () => {
    fetchSuggestedNickname.mockResolvedValueOnce("첫번째100").mockResolvedValueOnce("두번째200");
    const { result } = renderHook(() => useGuestStartForm({ onStarted: jest.fn() }));
    await waitFor(() => expect(result.current.characterName).toBe("첫번째100"));

    await act(async () => {
      await result.current.rerollNickname();
    });

    expect(result.current.characterName).toBe("두번째200");
  });

  it("추천 호출이 실패해도 입력란은 비어 있는 채로 시작할 수 있다", async () => {
    fetchSuggestedNickname.mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useGuestStartForm({ onStarted: jest.fn() }));

    await waitFor(() => expect(result.current.isNicknameLoading).toBe(false));
    expect(result.current.characterName).toBe("");
    expect(result.current.errorMessage).toBe("");
  });
});

describe("useGuestStartForm MBTI 선택", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchSuggestedNickname.mockResolvedValue("추천닉네임100");
  });

  it("4축을 모두 고르면 MBTI 문자열이 완성된다", async () => {
    const { result } = renderHook(() => useGuestStartForm({ onStarted: jest.fn() }));
    await waitFor(() => expect(result.current.isNicknameLoading).toBe(false));

    expect(result.current.mbtiResult).toBe("");
    selectAllMbtiAxes(result);

    expect(result.current.mbtiResult).toBe("ENFP");
  });

  it("같은 축을 다시 고르면 마지막 선택이 남는다", async () => {
    const { result } = renderHook(() => useGuestStartForm({ onStarted: jest.fn() }));
    await waitFor(() => expect(result.current.isNicknameLoading).toBe(false));

    selectAllMbtiAxes(result);
    act(() => result.current.selectMbtiAxis("e", "I"));

    expect(result.current.mbtiResult).toBe("INFP");
  });
});

describe("useGuestStartForm 제출", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    fetchSuggestedNickname.mockResolvedValue("추천닉네임100");
  });

  const renderReadyForm = async (onStarted = jest.fn()) => {
    const view = renderHook(() => useGuestStartForm({ onStarted }));
    await waitFor(() => expect(view.result.current.characterName).toBe("추천닉네임100"));
    return view;
  };

  it("MBTI를 덜 고르면 요청 없이 안내 메시지를 보여준다", async () => {
    const { result } = await renderReadyForm();
    act(() => result.current.selectMbtiAxis("e", "E"));

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.errorMessage).toBe("MBTI를 모두 선택해주세요.");
    expect(startAsGuest).not.toHaveBeenCalled();
  });

  it("닉네임 규칙을 어기면 요청 없이 안내 메시지를 보여주고, 고치면 메시지가 사라진다", async () => {
    const { result } = await renderReadyForm();
    selectAllMbtiAxes(result);
    act(() => result.current.changeCharacterName("<script>"));

    await act(async () => {
      await result.current.submit();
    });
    expect(result.current.errorMessage).toContain("한글, 영문, 숫자");
    expect(startAsGuest).not.toHaveBeenCalled();

    act(() => result.current.changeCharacterName("고친닉네임"));
    expect(result.current.errorMessage).toBe("");
  });

  it("성공하면 리프레시 토큰을 저장하고 onStarted를 호출한다", async () => {
    startAsGuest.mockResolvedValue({
      id: 7,
      characterName: "추천닉네임100",
      refreshToken: "refresh-xyz",
    });
    const onStarted = jest.fn();
    const { result } = await renderReadyForm(onStarted);
    selectAllMbtiAxes(result);

    await act(async () => {
      await result.current.submit({ preventDefault: jest.fn() });
    });

    expect(startAsGuest).toHaveBeenCalledWith({ characterName: "추천닉네임100", mbti: "ENFP" });
    expect(getRefreshToken()).toBe("refresh-xyz");
    expect(onStarted).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }));
    expect(result.current.isSubmitting).toBe(false);
  });

  it("폼 이벤트가 오면 기본 제출 동작을 막는다", async () => {
    startAsGuest.mockResolvedValue({ refreshToken: "r" });
    const { result } = await renderReadyForm();
    selectAllMbtiAxes(result);
    const event = { preventDefault: jest.fn() };

    await act(async () => {
      await result.current.submit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("서버 오류면 토큰을 저장하지 않고 재시도 안내를 보여준다", async () => {
    startAsGuest.mockRejectedValue(new Error("500"));
    const onStarted = jest.fn();
    const { result } = await renderReadyForm(onStarted);
    selectAllMbtiAxes(result);

    await act(async () => {
      await result.current.submit();
    });

    expect(getRefreshToken()).toBeNull();
    expect(onStarted).not.toHaveBeenCalled();
    expect(result.current.errorMessage).toContain("다시 시도");
    expect(result.current.isSubmitting).toBe(false);
    expect(logger.error).toHaveBeenCalled();
  });

  it("응답에 토큰이 없으면 성공으로 처리하지 않는다", async () => {
    startAsGuest.mockResolvedValue({ id: 1 });
    const onStarted = jest.fn();
    const { result } = await renderReadyForm(onStarted);
    selectAllMbtiAxes(result);

    await act(async () => {
      await result.current.submit();
    });

    expect(onStarted).not.toHaveBeenCalled();
    expect(result.current.errorMessage).toContain("다시 시도");
  });
});
