// 座席データと色分けロジック

// 類別区分定数
export const BASE_OPTIONS = ["1塁（ライトスタンド）", "ネット裏(スタンド200番台)", "3塁（レフトスタンド）"];

// ブロック区分定数-1塁側
export const BLOCK_DATA_FIRST = {
  // 座席番号：[座席最小番号, 座席最大番号]
  "T1-T7": [1, 8],
  "L1-L9": [1, 2],
  "D1-D9": [1, 2],
  "101-178": [1, 60],
  "179": [29, 29],
  "180-184": [1, 21]
};

// ブロック区分定数-ネット裏
export const NET_BLOCK_MIN = 200; // ブロックが始まる数字
export const NET_BLOCK_MAX = 227; // ブロックが終わる数字
export const NET_BLOCK_DEFAULT_ROW_EVEN = [1, 16]; // 偶数ブロックの基本座席範囲
export const NET_BLOCK_DEFAULT_ROW_ODD = [27, 47]; // 奇数ブロックの基本座席範囲
export const NET_BLOCK_NOT_DEFAULT_PATTERN = {     // パターン外のブロック
  // 座席番号：[座席最小番号, 座席最大番号]
  "200": [13, 20],
  "210": [4, 20],
  "212": [8, 20],
  "213": [21, 26],
  "214": [8, 20],
  "215": [21, 26],
  "216": [4, 20],
  "226": [13, 20]
};

// ブロック区分定数-3塁側
export const BLOCK_DATA_THIRD = {
  // 座席番号：[座席最小番号, 座席最大番号]
  "T2-T8": [1, 8],
  "L2-L10": [1, 2],
  "D2-D10": [1, 2],
  "301-378": [1, 56],
  "379": [29, 29],
  "380-384": [1, 21]
};

// メンバーカラーセット
export const MEMBER_COLOR_SET = {
  "chika": {
    "color": "#ff7f32",
    "text": "みかん色",
    "member": "高海千歌",
  },
  "riko": {
    "color": "#FB6372",
    "text": "サクラピンク",
    "member": "桜内梨子",
  },
  "kanan": {
    "color": "#00c7b1",
    "text": "エメラルドグリーン",
    "member": "松浦果南",
  },
  "dia": {
    "color": "#e4002b",
    "text": "レッド",
    "member": "黒澤ダイヤ",
  },
  "you": {
    "color": "#00b5e2",
    "text": "ライトブルー",
    "member": "渡辺曜",
  },
  "yohane": {
    "color": "#d4d4d4",
    "text": "ホワイト",
    "member": "津島善子",
  },
  "maru": {
    "color": "#ffcd00",
    "text": "イエロー",
    "member": "国木田花丸",
  },
  "mari": {
    "color": "#9b26b6",
    "text": "バイオレット",
    "member": "小原鞠莉",
  },
  "ruby": {
    "color": "#e93cac",
    "text": "ピンク",
    "member": "黒澤ルビィ",
  },
};

// 列生成用の配列を生成
export function createRowArray(min: number, max: number): string[] {
  return Array.from({ length: max - min + 1 }, (_, i) => String(min + i));
}

// ネット裏ブロックの全体座席範囲を生成
export const BLOCK_DATA_NET = createRowArray(NET_BLOCK_MIN, NET_BLOCK_MAX);

// 色を検索する関数
export function findColor(block: string, row: number): string {
  // 当てはまる色があるか確認
  const colorFilter = (row: number, colorSet: Record<string, [number, number]>) => {
    const between = (x: number, min: number, max: number) => {
      return x >= min && x <= max;
    };

    for (const key in colorSet) {
      const [min, max] = colorSet[key];
      if (between(row, min, max)) {
        return key;
      }
    }
    return "rangeout";
  };

  let colorSet: Record<string, [number, number]> = {};

  // 検索対象のブロック、色による色を設定
  if (Object.keys(BLOCK_DATA_FIRST).includes(block) ||
    Object.keys(BLOCK_DATA_THIRD).includes(block)) {
    if (block === "T1-T7" || block === "T2-T8") {
      colorSet = {
        "mari": [1, 4],
        "kanan": [5, 8]
      };
    } else if (block === "L1-L9" || block === "L2-L10") {
      colorSet = {
        "maru": [1, 2]
      };
    } else if (block === "D1-D9" || block === "D2-D10") {
      colorSet = {
        "you": [1, 2]
      };
    } else if (["101-178", "180-184", "301-378", "380-384"].includes(block)) {
      colorSet = {
        "mari": [1, 7],
        "kanan": [8, 14],
        "dia": [15, 21],
        "yohane": [22, 28],
        "ruby": [29, 34],
        "maru": [35, 40],
        "riko": [41, 46],
        "you": [47, 60]
      };
    } else if (block === "179" || block === "379") {
      colorSet = {
        "yohane": [29, 29]
      };
    } else {
      return "rangeout";
    }
  } else if (BLOCK_DATA_NET.includes(block)) {
    if (block === "213" || block === "215") {
      colorSet = {
        "ruby": [21, 24],
        "maru": [25, 26]
      };
    } else {
      if (Number(block) % 2 == 0) {
        colorSet = {
          "mari": [1, 6],
          "kanan": [7, 12],
          "dia": [13, 16],
          "yohane": [17, 20]
        };
      } else {
        colorSet = {
          "ruby": [21, 26],
          "maru": [27, 32],
          "riko": [33, 38],
          "you": [39, 47]
        };
      }
    }
  } else {
    return "error";
  }

  return colorFilter(row, colorSet);
}

// 座席タイプに応じた塁側オプションを取得
export function getBaseOptions(seatType: string): string[] {
  if (seatType === "arena") {
    return ["100番台", "200番台", "300番台"];
  } else if (seatType === "field") {
    return ["100番台", "200番台"];
  } else if (seatType === "other") {
    return BASE_OPTIONS;
  }
  return [];
}

// 塁側に応じたブロックオプションを取得
export function getBlockOptions(seatType: string, base: string): string[] {
  if (!seatType || !base) return [];
  
  if (seatType === "arena") {
    return ["A", "B", "C", "D", "E", "F", "G", "H"];
  } else if (seatType === "field") {
    return ["F"];
  } else if (seatType === "other") {
    if (base === BASE_OPTIONS[0]) {
      return Object.keys(BLOCK_DATA_FIRST).sort();
    } else if (base === BASE_OPTIONS[1]) {
      return BLOCK_DATA_NET;
    } else if (base === BASE_OPTIONS[2]) {
      return Object.keys(BLOCK_DATA_THIRD).sort();
    }
  }
  return [];
}

// ブロックに応じた列オプションを取得
export function getRowOptions(seatType: string, base: string, block: string): string[] {
  if (!seatType || !base || !block) return [];
  
  if (seatType === "arena") {
    return createRowArray(1, 20);
  } else if (seatType === "field") {
    return createRowArray(1, 15);
  } else if (seatType === "other") {
    let data: number[] = [];

    // 選択した席により列の項目を生成
    if (Object.keys(BLOCK_DATA_FIRST).includes(block)) {
      const [min, max] = BLOCK_DATA_FIRST[block as keyof typeof BLOCK_DATA_FIRST];
      data = [min, max];
    } else if (Object.keys(BLOCK_DATA_THIRD).includes(block)) {
      const [min, max] = BLOCK_DATA_THIRD[block as keyof typeof BLOCK_DATA_THIRD];
      data = [min, max];
    } else if (BLOCK_DATA_NET.includes(block)) {
      let min: number, max: number;

      if (Object.keys(NET_BLOCK_NOT_DEFAULT_PATTERN).includes(block)) {
        [min, max] = NET_BLOCK_NOT_DEFAULT_PATTERN[block as keyof typeof NET_BLOCK_NOT_DEFAULT_PATTERN];
      } else {
        [min, max] = Number(block) % 2 == 0 ? NET_BLOCK_DEFAULT_ROW_EVEN : NET_BLOCK_DEFAULT_ROW_ODD;
      }
      data = [min, max];
    }

    if (data.length === 2) {
      return createRowArray(data[0], data[1]);
    }
  }
  return [];
}

// 結果を取得する関数
export function getResult(member: string) {
  if (Object.keys(MEMBER_COLOR_SET).includes(member)) {
    const result = MEMBER_COLOR_SET[member as keyof typeof MEMBER_COLOR_SET];
    return {
      color: result.color,
      member: result.member,
      text: result.text,
      image: `/img/member_icon/${member}.png`
    };
  } else {
    if (member === "error") {
      return {
        color: "#ff0000",
        member: "エラー",
        text: "エラー",
        image: "/img/error.png"
      };
    }
    if (member === "rangeout") {
      return {
        color: "#ff0000",
        member: "範囲外",
        text: "そこに座席はありませんわ。もう一度自分の座席を確認してごらんなさい。",
        image: "/img/error.png"
      };
    }
  }
  return {
    color: "#ff0000",
    member: "エラー",
    text: "エラー",
    image: "/img/error.png"
  };
} 