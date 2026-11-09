import { renderHook, waitFor } from "@testing-library/react";
import { RecoilRoot } from "recoil";

import { characterNameAtom } from "../atom/atom";
import axios from "../utils/axios";

import { usePlayerName } from "./usePlayerName";

jest.mock("../utils/axios");

// 초기 닉네임을 지정한 RecoilRoot
const wrapperWithName =
  (initialName) =>
  ({ children }) => (
    <RecoilRoot initializeState={({ set }) => set(characterNameAtom, initialName)}>
      {children}
    </RecoilRoot>
  );

describe("usePlayerName", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("닉네임이 비어 있으면 프로필을 조회해 채운다", async () => {
    axios.get.mockResolvedValue({ data: { characterName: "민수" } });
    const { result } = renderHook(() => usePlayerName(), { wrapper: wrapperWithName("") });
    await waitFor(() => expect(result.current).toBe("민수"));
    expect(axios.get).toHaveBeenCalledWith("/api/my-page");
  });

  it("닉네임이 있으면 조회하지 않는다", () => {
    const { result } = renderHook(() => usePlayerName(), { wrapper: wrapperWithName("지우") });
    expect(result.current).toBe("지우");
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("shouldRefresh면 닉네임이 있어도 다시 조회한다", async () => {
    axios.get.mockResolvedValue({ data: { characterName: "새이름" } });
    const { result } = renderHook(() => usePlayerName({ shouldRefresh: true }), {
      wrapper: wrapperWithName("옛이름"),
    });
    await waitFor(() => expect(result.current).toBe("새이름"));
  });

  it("조회에 실패하면 빈 값을 유지한다", async () => {
    axios.get.mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => usePlayerName(), { wrapper: wrapperWithName("") });
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(result.current).toBe("");
  });
});
