import axios from "./axios";
import { fetchSuggestedNickname, startAsGuest } from "./guestApi";

jest.mock("./axios");

describe("fetchSuggestedNickname", () => {
  it("추천 닉네임 문자열만 꺼내 돌려준다", async () => {
    axios.get.mockResolvedValue({ data: { characterName: "고소한베이글482" } });

    await expect(fetchSuggestedNickname()).resolves.toBe("고소한베이글482");
    expect(axios.get).toHaveBeenCalledWith("/api/guest/nickname");
  });
});

describe("startAsGuest", () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { id: 1, characterName: "베이글", refreshToken: "r" } });
  });

  it("닉네임을 trim해서 MBTI와 함께 보낸다", async () => {
    const started = await startAsGuest({ characterName: "  베이글 ", mbti: "ENFP" });

    expect(axios.post).toHaveBeenCalledWith("/api/guest/start", {
      characterName: "베이글",
      mbti: "ENFP",
    });
    expect(started.refreshToken).toBe("r");
  });

  it.each([undefined, "", "   "])(
    "닉네임이 비어 있으면(%p) 필드를 보내지 않는다",
    async (emptyName) => {
      await startAsGuest({ characterName: emptyName, mbti: "INTJ" });

      expect(axios.post).toHaveBeenLastCalledWith("/api/guest/start", { mbti: "INTJ" });
    }
  );

  it("서버 오류는 호출부가 처리하도록 그대로 던진다", async () => {
    axios.post.mockRejectedValue(new Error("400"));

    await expect(startAsGuest({ mbti: "ENFP" })).rejects.toThrow("400");
  });
});
