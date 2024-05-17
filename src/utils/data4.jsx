export const storyData = {
  place: "Umbrella",
  plot: [
    {
      index: "1",
      text: `(갑자기 비가 온다). 
      얻은 돈으로 편의점에서 우산을 사올 수 있었다."`,
      img: "/img/road1-1.png",
      options: [
        {
          ans: "조금 더 가까이 걸어간다.",
          score: 10,
          subtext: `주인공: "나한테 조금 더 붙어봐. 둘이서 쓰기에는 우산이 너무 작다."`,
          img: "/img/road1-1.png",
        },
        {
          ans: "그대로 간다.",
          score: 0,
          subtext: `(어깨가 젖은 수정이의 표정이 굳어진다.)`,
          img: "/img/road1-2.png",
        },
      ],
    },
    {
      index: "2",
      text: `둘 사이에 정적이 흐른다.`,
      img: "/img/road1-2.png",
      options: [
        {
          ans: "날씨 얘기를 한다.",
          score: 0,
          subtext: `주인공: "오늘 날씨가 참... 그렇네…" ^ (흥미 없는 이야기에 수정이는 대답이 없다.)`,
          img: "/img/cave_high.png",
        },
        {
          ans: `있잖아.. 만약 너한테 시간을 되돌릴 수 있는 능력이 생긴다면 어떻게 할 거야?`,
          score: 10,
          subtext: `주인공: "있잖아.. 만약 너한테 시간을 되돌릴 수 있는 능력이 생긴다면 어떻게 할 거야?" ^ 이수정 : “시간을 되돌릴 수 있는 능력? 그런 능력이 있다면 정말 좋겠다 ㅎㅎㅎ.” ^ (흥미로운 주제에 그녀가 즐겁게 이야기 한다.)`,
          img: "/img/cave1-1.png",
        },
        {
          ans: "그대로 간다.",
          score: 0,
          subtext: `(두 사람 사이의 정적이 계속된다.)`,
          img: "/img/road1-2.png",
        },
      ],
    },
    {
      index: "3",
      text: `뱀이 나타났다.`,
      img: "/img/road3.png",
      options: [
        {
          ans: "이수정 앞에 서서 뱀으로부터 막아준다.",
          score: 0,
          subtext: `주인공: "뒤로 물러서! 내가 막을게." ^ 주인공: “으악!” ^ (주인공은 뱀에 물려 끝을 맞이한다.)`,
          error: "error",
          img: "/img/road3.png",
        },
        {
          ans: "같이 도망친다.",
          score: 5,
          subtext: `주인공: "뛰어! 도망치자" ^ (두 사람은 뱀을 피해 멀리 도망쳤다.) ^ 이수정: “갑자기 뱀이 나타나서 깜짝 놀랐네…”`,
          img: "/img/road3.png",
        },
        {
          ans: "뱀을 위협한다.",
          score: 10,
          subtext: `(주인공이 팔을 휘두르며 뱀을 쫓아낸다) ^ 주인공: "저리 가!" ^ (겁먹은 뱀은 도망친다.) ^ 이수정 : “깜짝 놀랐어… 그래도 덕분에 뱀이 가서 다행이네….” ^ (두 사람은 해변을 향해 걸어간다.)`,
          img: "/img/road3.png",
        },
      ],
    },

    //특수
    {
      index: "4",
      love: 60,
      text: `이수정: "있잖아.. 우리 맥주 좀 사갈까?"`,
      img: "/img/cave1-1.png",
      options: [
        {
          ans: "그래! 좋아, 맥주 마시자.",
          score: 10,
          subtext: `주인공: "그래! 좋아, 맥주 마시자."`,
          img: "/img/cave1-1.png",
        },
        {
          ans: "아니, 난 맥주는 별로 안 마시고 싶은데.",
          score: 0,
          subtext: `주인공: "아니, 난 맥주는 별로 안 마시고 싶은데." ^ 이수정: “아.. 그래? 알았어…” ^ (그녀의 얼굴에 서운함이 가득해졌다.)`,
          img: "/img/cave_high.png",
        },
      ],
    },
  ],
};
