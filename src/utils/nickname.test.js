import { getNicknameError, NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from "./nickname";

describe("getNicknameError", () => {
  it.each([undefined, null, "", "   "])(
    "비어 있으면(%p) 통과한다 (서버가 자동 생성)",
    (emptyValue) => {
      expect(getNicknameError(emptyValue)).toBe("");
    }
  );

  it.each(["베이글", "bagel_01", "고소한베이글482", "ab"])(
    "유효한 닉네임(%s)은 통과한다",
    (nickname) => {
      expect(getNicknameError(nickname)).toBe("");
    }
  );

  it("앞뒤 공백은 무시하고 검증한다", () => {
    expect(getNicknameError("  베이글  ")).toBe("");
  });

  it("최소 길이보다 짧으면 길이 안내를 돌려준다", () => {
    expect(getNicknameError("a")).toContain(`${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자`);
  });

  it("최대 길이를 넘으면 길이 안내를 돌려준다", () => {
    expect(getNicknameError("가".repeat(NICKNAME_MAX_LENGTH + 1))).toContain(
      `${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자`
    );
  });

  it("최대 길이 경계는 통과한다", () => {
    expect(getNicknameError("가".repeat(NICKNAME_MAX_LENGTH))).toBe("");
  });

  it.each(["<script>", "공 백", "이모지😀닉", "a-b"])(
    "허용되지 않는 문자(%s)는 거부한다",
    (nickname) => {
      expect(getNicknameError(nickname)).toContain("한글, 영문, 숫자");
    }
  );
});
