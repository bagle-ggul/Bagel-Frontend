export const storyData = {
  place: "Cafe",
  plot: [
    {
      index: "1",
      text: `두 사람은 카페에 도착하고, 수정이는 주인공에게 무엇을 마실지 묻는다. 
      이수정: “음… 뭘 마실까?”`,
      img: "/img/bg_cafe_scene1.png",
      options: [
        {
          ans: "카페 라떼",
          score: 0,
          subtext: `주인공: “카페 라떼 마시는건 어때?” ^ 이수정: “음.. 그래!”`,
          img: "/img/bg_cafe_scene1.png",
        },
        {
          ans: "레몬에이드",
          score: 10,
          subtext: `주인공: “레몬에이드는 어때? 네가 레몬에이드 좋아한다고 했잖아.” ^ 이수정: “어? ㅎㅎ 그걸 기억하고 있었네.”`,
          img: "/img/bg_cafe_scene2.png",
        },
        {
          ans: "아샷추",
          score: 0,
          subtext: `주인공: “아샷추 마시자.” ^ 이수정: “아샷추? 너 원래 그런 거 잘 안 마시지 않아?”`,
          img: "/img/bg_cafe_scene3.png",
        },
      ],
    },
    {
      index: "2",
      text: `이수정: “너 음료 마신 거 어땠어?”`,
      img: "/img/bg_cafe_mid.png",
      options: [
        {
          ans: "난 괜찮았는데, 네가 마신 건 어땠어?",
          score: 10,
          subtext: `주인공: “맛있던데? 너는? 네가 마신 건 어땠어?” ^ 이수정: “나도 좋았어 ㅎㅎ.”`,
          img: "/img/bg_cafe_high.png",
        },
        {
          ans: "맛없었다고 말한다.",
          score: 0,
          subtext: `주인공: “맛없었어… 차라리 다른거 마실걸…” ^ 이수정: “아.. 그래? 다음엔 더 맛있는 거 마시자.”`,
          img: "/img/bg_cafe_high.png",
        },
        {
          ans: "네가 마신게 더 맛있어 보이던데?",
          score: 0,
          subtext: `주인공: “네가 마신게 더 맛있어 보이더라.” ^ 이수정: “우리 같은 거 마셨잖아…” ^ 주인공: “아.. 그러네”`,
          img: "/img/bg_cafe_high.png",
        },
      ],
    },
    {
      index: "3",
      text: `이수정: “아, 차라리 카페 가지 말 걸 그랬나…?”`,
      img: "/img/bg_cafe_low.png",
      options: [
        {
          ans: "왜? 음료 마신게 마음에 안 들었어?",
          score: 0,
          subtext: `이수정: “어? 아니야…” ^ 주인공: “그럼 좀 있다가 맛있는 거 먹으러 가자.”`,
          img: "/img/bg_cafe_low.png",
        },
      ],
    },
    {
      index: "4",
      text: `카페에서 나오는 길에 바닥에 돈이 떨어져 있는 것을 발견했다.`,
      img: "/img/bg_cafe_alt1.png",
      options: [
        {
          ans: "줍는다",
          score: 0,
          subtext: `주인공: “어? 여기 돈이 떨어져 있네. 내가 가져도 되겠지?” ^ 이수정: “뭐야, 누구 돈인줄 알고 그걸 가져가?” ^ 주인공: “뭐 어때?”`,
          img: "/img/bg_cafe_mid.png",
        },
        {
          ans: "카운터에 준다.",
          score: 10,
          subtext: `주인공: “누가 떨어뜨린 것 같아. 카운터에 맡겨야겠다.”`,
          img: "/img/bg_cafe_mid.png",
        },
        {
          ans: "그냥 간다.",
          score: 0,
          subtext: `주인공은 그냥 지나친다.`,
          img: "/img/bg_cave_scene2.png",
        },
      ],
    },
  ],
};
