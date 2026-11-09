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
});
