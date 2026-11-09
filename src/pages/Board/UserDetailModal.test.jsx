import { render, screen } from "@testing-library/react";

import UserDetailModal from "./UserDetailModal";

const rankOneUser = {
  rank: 1,
  characterName: "베이글",
  finalScore: 120,
  mbti: "INFP",
  gameDate: "2026-11-09T00:00:00",
  gamePlaySeconds: 0,
};

describe("UserDetailModal", () => {
  it("순위 아이콘을 한 번만 렌더하고 순위 텍스트도 한 번만 보인다", () => {
    const getRankIcon = jest.fn(() => <svg data-testid="rank-icon" />);
    render(<UserDetailModal user={rankOneUser} onClose={() => {}} getRankIcon={getRankIcon} />);

    expect(screen.getAllByTestId("rank-icon")).toHaveLength(1);
    expect(screen.getAllByText(/1위/)).toHaveLength(1);
  });
});
