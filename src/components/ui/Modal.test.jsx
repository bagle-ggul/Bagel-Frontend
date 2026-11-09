import { fireEvent, render, screen } from "@testing-library/react";

import Modal from "./Modal";

const renderModal = (onClose) => {
  render(
    <Modal title="제목" onClose={onClose}>
      <p>내용</p>
    </Modal>
  );
};

describe("Modal", () => {
  it("Esc로 onClose를 호출한다", () => {
    const onClose = jest.fn();
    renderModal(onClose);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("오버레이 클릭으로 onClose를 호출한다", () => {
    const onClose = jest.fn();
    renderModal(onClose);

    fireEvent.click(screen.getByTestId("modal-overlay"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("내용 클릭은 닫지 않는다", () => {
    const onClose = jest.fn();
    renderModal(onClose);

    fireEvent.click(screen.getByText("내용"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("닫기 버튼에 aria-label이 있고 누르면 닫는다", () => {
    const onClose = jest.fn();
    renderModal(onClose);

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("열리면 dialog에 포커스하고 제목과 연결한다", () => {
    renderModal(jest.fn());

    const dialog = screen.getByRole("dialog", { name: "제목" });
    expect(dialog).toHaveFocus();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});
