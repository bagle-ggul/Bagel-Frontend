import { render, screen } from "@testing-library/react";

import DialogueBox from "./DialogueBox";

describe("DialogueBox", () => {
  it("화자 이름표와 본문을 분리해 보여 준다", () => {
    const line = { speakerId: "sujung", speakerName: "이수정", text: "안녕" };
    render(<DialogueBox line={line} visibleText="안녕" isDone />);
    expect(screen.getByText("이수정")).toBeInTheDocument();
    expect(screen.getByText("안녕")).toBeInTheDocument();
    expect(screen.queryByText(/이수정 :/)).toBeNull();
  });

  it("나레이션은 이름표가 없다", () => {
    const line = { speakerId: "narration", speakerName: "나레이터", text: "비가 온다" };
    render(<DialogueBox line={line} visibleText="비가 온다" isDone={false} />);
    expect(screen.getByText("비가 온다")).toBeInTheDocument();
    expect(screen.queryByText("나레이터")).toBeNull();
  });

  it("타이핑 중에도 낭독 영역은 줄 전체를 한 번에 담는다", () => {
    const line = { speakerId: "sujung", speakerName: "이수정", text: "우산 있어?" };
    const { rerender } = render(<DialogueBox line={line} visibleText="우" isDone={false} />);
    const announcer = screen.getByRole("status");
    expect(announcer).toHaveTextContent("이수정: 우산 있어?");
    rerender(<DialogueBox line={line} visibleText="우산" isDone={false} />);
    expect(screen.getByRole("status")).toHaveTextContent("이수정: 우산 있어?");
  });

  it("나레이션 낭독은 본문만", () => {
    const line = { speakerId: "narration", speakerName: "", text: "비가 온다" };
    render(<DialogueBox line={line} visibleText="" isDone={false} />);
    expect(screen.getByRole("status")).toHaveTextContent(/^비가 온다$/);
  });

  it("타이핑 본문에는 aria-live가 없다", () => {
    const line = { speakerId: "sujung", speakerName: "이수정", text: "안녕" };
    render(<DialogueBox line={line} visibleText="안" isDone={false} />);
    const typingBox = screen.getByText("안");
    expect(typingBox).not.toHaveAttribute("aria-live");
    expect(typingBox).toHaveAttribute("aria-hidden", "true");
  });
});
