import { fireEvent, render, screen } from "@testing-library/react";

import DialogueLogModal from "./DialogueLogModal";

const entries = [
  { id: "1", speakerId: "sujung", speakerName: "이수정", text: "안녕" },
  { id: "2", speakerId: "narration", speakerName: "", text: "바람이 분다" },
  { id: "3", speakerId: "choice", speakerName: "", text: "손을 잡는다" },
];

describe("DialogueLogModal", () => {
  it("항목을 순서대로 보여 준다", () => {
    render(<DialogueLogModal entries={entries} onClose={() => {}} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("이수정");
    expect(items[1]).toHaveTextContent("바람이 분다");
  });

  it('선택 항목은 "선택 ·"으로 표시', () => {
    render(<DialogueLogModal entries={entries} onClose={() => {}} />);
    expect(screen.getByText("선택 · 손을 잡는다")).toBeInTheDocument();
  });

  it("비면 안내 문구", () => {
    render(<DialogueLogModal entries={[]} onClose={() => {}} />);
    expect(screen.getByText("아직 지난 대사가 없어요.")).toBeInTheDocument();
  });

  it("닫기 버튼으로 onClose", () => {
    const onClose = jest.fn();
    render(<DialogueLogModal entries={entries} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("열리면 목록 끝으로 스크롤한다", () => {
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = jest.fn();
    render(<DialogueLogModal entries={entries} onClose={() => {}} />);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });
});
