export const storyData = {
  place: "Cave",
  plot: [
    {
      index: "1",
      text: `(갑자기 비가 쏟아진다.) 우산이 없는 나머지 급히 동굴로 들어가서 피해야 한다. 어두운 동굴에 들어가니 그녀가 무서워한다.`,
      img: "/img/cave_low.png",
      options: [
        {
          ans: `주인공: "괜찮아, 우리 비 그칠 때까지 조금만 있자."`,
          score: 10,
          subtext: `여자: “그래, 그러자.”`,
          img: "/img/cave1-1.png",
        },
        {
          ans: `주인공: “우리가 동굴 탐험가가 된 거라고 생각해봐! 숨겨진 보물이라도 찾을까?"`,
          score: 0,
          subtext: `여자: “ㅎㅎㅎ 무슨 소리야. 장난치지마.” ^ (그녀가 잠시 웃지만 금세 얼굴이 굳는다.)`,
          img: "/img/cave1-2.png",
        },
      ],
    },
    {
      index: "2",
      text: `동굴 벽에 튀어나온 돌에 그녀가 상처 입었다.`,
      img: "/img/cave_low.png",
      options: [
        {
          ans: `주인공: "잠깐, 내가 치료해줄게. 조금만 참아."`,
          score: 10,
          subtext: `여자: “응 고마워…” ^ (그녀가 수줍게 웃음 짓는다.)`,
          img: "/img/cafe1-2.png",
        },
        {
          ans: `주인공: "의사 자격증은 없지만, 내가 할 수 있는 건 해볼게!"`,
          score: 0,
          subtext: `여자: “ㅋㅋㅋㅋㅋ 그래”`,
          img: "/img/cafe1-2.png",
        },
      ],
    },
    {
      index: "3",
      text: `여자: "좀 추운 것 같아..."`,
      img: "/img/cave_low.png",
      options: [
        {
          ans: `주인공: "내 겉옷 줄게. 이거라도 입어."`,
          score: 0,
          subtext: `여자: “어.. 고마워…”`,
          img: "/img/cave1-1.png",
        },
        {
          ans: `어깨동무를 하며 살짝 감싸준다.`,
          score: 10,
          subtext: `(아무 말 없이 그녀를 팔로 감싸줬다.) ^ (그녀의 얼굴이 살짝 붉어진다.)`,
          img: "/img/cave1-1.png",
        },
      ],
    },
    {
      index: "4",
      text: `정적을 깨기 위해 주인공이 이야기를 꺼낸다.`,
      img: "/img/cave2.png",
      options: [
        {
          ans: `주인공: "내 취미는 사실…"`,
          score: 0,
          subtext: `(주인공이 자신의 취미에 대해 설명한다.) ^ (그녀가 지루해 하며 표정이 굳는다.)`,
          img: "/img/cave2.png",
        },
        {
          ans: `주인공: "지금 우리가 해야 할 일은..."`,
          score: 0,
          subtext: `(주인공이 현재 동굴 속에서 어떻게 해야 할지 얘기한다.) ^ (믿음직한 모습에 그녀가 미소 짓는다.)`,
          img: "/img/cave1-1.png",
        },
      ],
    },
    {
      index: "5",
      img: "/img/cave_low.png",
      text: `갑자기 동굴 속에서 쥐가 찍찍 거리며 나타났다.`,
      options: [
        {
          ans: `주인공: "저리 가!"`,
          score: 0,
          subtext: `(겁먹은 쥐가 다시 동굴 속으로 돌아갔다.)`,
          img: "/img/cave_low.png",
        },
        {
          ans: `주인공: "어, 쥐다! 내가 잡아볼게!"`,
          score: 0,
          subtext: `(쥐가 주인공을 피해 도망치다 그녀에게 다가간다.) ^ 여자: “꺄악! 뭐하는 짓이야!”`,
          img: "/img/cave_low.png",
        },
      ],
    },

    //모두
    {
      index: "6",
      text: `갑자기 동굴 안에서 큰 진동과 울리는 소리가 들려온다.`,
      img: "/img/cave2.png",
      options: [
        {
          ans: `소리를 무시하고 계속 이동한다.`,
          score: 0,
          subtext: `(갑자기 동굴이 붕괴하기 시작했다.)`,
          img: "/img/cave_low.png",
        },
        {
          ans: `곧바로 동굴을 나간다`,
          score: 0,
          subtext: `주인공: "소리가 불길한데? 여긴 위험할 것 같아. 나가자." ^ (밖에 나오니 비가 그쳐 있고 두 사람은 해변으로 이동한다.)`,
          error: "error",
          img: "/img/cafe1-1.png",
        },
      ],
    },
  ],
};
