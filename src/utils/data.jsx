export const Data1 = {
  place: "Home",
  plot: [
    {
      index: "1",
      text: "내일 여행 갈 준비 다 했어?",
    },
    {
      index: "2",
      text: "알람을 맞출까?",
    },
    {
      index: "3",
      text: "카페로 가기 위한 이동수단 선택!",
    },
  ],
};

export const Ans1 = {
  place: "Home",
  plot: [
    {
      index: "1",
      text: [
        {
          ans: "계획을 준비한다.",
          score: 10,
        },
        {
          ans: "계획을 준비하지 않는다.",
          score: 0,
        },
      ],
    },
    {
      index: "2",
      text: [
        {
          ans: "Yes",
          score: 5,
        },
        {
          ans: "No",
          score: 0,
          error: "알람을 맞추지 않아서 늦잠을 자버렸다... Game Over",
        },
      ],
    },
    {
      index: "3",
      text: [
        {
          ans: "자동차",
          score: 10,
        },
        {
          ans: "도보",
          score: 0,
        },
      ],
    },
  ],
};
