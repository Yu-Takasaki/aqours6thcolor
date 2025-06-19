// 座席データと色分けロジック

// 座席タイプの選択肢
export const SEAT_TYPE_OPTIONS: Record<string, Record<'ja' | 'en', string>> = {
  "arena": { ja: "アリーナ", en: "Arena" },
  "field": { ja: "フィールドシート(スタンドFブロック)", en: "Field Sheet (Stand F Block)" },
  "other": { ja: "上記以外", en: "Others" }
};

// 座席タイプの選択肢を取得する関数
export function getSeatTypeOptions(locale: 'ja' | 'en') {
  return Object.entries(SEAT_TYPE_OPTIONS).map(([value, labels]) => ({
    value,
    label: labels[locale] ?? labels.ja
  }));
}

// 類別区分定数
export const BASE_OPTIONS: Record<string, Record<'ja' | 'en', string>> = {
  "first": { ja: "1塁（ライトスタンド）", en: "1st Base (Right Stand)" },
  "net": { ja: "ネット裏(スタンド200番台)", en: "Behind Net (Stand 200s)" },
  "third": { ja: "3塁（レフトスタンド）", en: "3rd Base (Left Stand)" }
};

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
export const NET_BLOCK_DEFAULT_ROW_EVEN = [1, 20]; // 偶数ブロックの基本座席範囲
export const NET_BLOCK_DEFAULT_ROW_ODD = [21, 47]; // 奇数ブロックの基本座席範囲
export const NET_BLOCK_NOT_DEFAULT_PATTERN = {     // パターン外のブロック
  // 座席番号：[座席最小番号, 座席最大番号]
  "200": [13, 20],
  "210": [4, 20],
  "212": [8, 20],
  "213": [21, 26],
  "214": [8, 18],
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
export const MEMBER_COLOR_SET: Record<string, {
  color: string;
  text: Record<'ja' | 'en', string>;
  member: Record<'ja' | 'en', string>;
}> = {
  "chika": {
    "color": "#ff7f32",
    "text": { ja: "みかん色", en: "Mikan Orange" },
    "member": { ja: "高海千歌", en: "Chika Takami" },
  },
  "riko": {
    "color": "#FB6372",
    "text": { ja: "サクラピンク", en: "Sakura Pink" },
    "member": { ja: "桜内梨子", en: "Riko Sakurauchi" },
  },
  "kanan": {
    "color": "#00c7b1",
    "text": { ja: "エメラルドグリーン", en: "Emerald Green" },
    "member": { ja: "松浦果南", en: "Kanan Matsuura" },
  },
  "dia": {
    "color": "#e4002b",
    "text": { ja: "レッド", en: "Red" },
    "member": { ja: "黒澤ダイヤ", en: "Dia Kurosawa" },
  },
  "you": {
    "color": "#00b5e2",
    "text": { ja: "ライトブルー", en: "Light Blue" },
    "member": { ja: "渡辺曜", en: "You Watanabe" },
  },
  "yohane": {
    "color": "#d4d4d4",
    "text": { ja: "ホワイト", en: "White" },
    "member": { ja: "津島善子", en: "Yoshiko Tsushima" },
  },
  "maru": {
    "color": "#ffcd00",
    "text": { ja: "イエロー", en: "Yellow" },
    "member": { ja: "国木田花丸", en: "Hanamaru Kunikida" },
  },
  "mari": {
    "color": "#9b26b6",
    "text": { ja: "バイオレット", en: "Violet" },
    "member": { ja: "小原鞠莉", en: "Mari Ohara" },
  },
  "ruby": {
    "color": "#e93cac",
    "text": { ja: "ピンク", en: "Pink" },
    "member": { ja: "黒澤ルビィ", en: "Ruby Kurosawa" },
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
export function getBaseOptions(seatType: string, locale: 'ja' | 'en'): string[] {
  if (seatType === "arena") {
    return ["100番台", "200番台", "300番台"];
  } else if (seatType === "field") {
    return ["100番台", "200番台"];
  } else if (seatType === "other") {
    return Object.values(BASE_OPTIONS).map(option => option[locale] ?? option.ja);
  }
  return [];
}

// 塁側に応じたブロックオプションを取得
export function getBlockOptions(seatType: string, base: string, locale: 'ja' | 'en'): string[] {
  if (!seatType || !base) return [];
  
  if (seatType === "arena") {
    return ["A", "B", "C", "D", "E", "F", "G", "H"];
  } else if (seatType === "field") {
    return ["F"];
  } else if (seatType === "other") {
    // 多言語対応のため、日本語の値で比較
    const baseJaValues = Object.values(BASE_OPTIONS).map(option => option[locale] ?? option.ja);
    if (base === baseJaValues[0]) {
      return Object.keys(BLOCK_DATA_FIRST).sort();
    } else if (base === baseJaValues[1]) {
      return BLOCK_DATA_NET;
    } else if (base === baseJaValues[2]) {
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
export function getResult(member: string, locale: 'ja' | 'en') {
  if (Object.keys(MEMBER_COLOR_SET).includes(member)) {
    const result = MEMBER_COLOR_SET[member as keyof typeof MEMBER_COLOR_SET];
    return {
      color: result.color,
      member: result.member[locale] ?? result.member.ja,
      text: result.text[locale] ?? result.text.ja,
      image: `/img/member_icon/${member}.png`
    };
  } else {
    if (member === "error") {
      return {
        color: "#ff0000",
        member: locale === 'en' ? "Error" : "エラー",
        text: locale === 'en' ? "Error" : "エラー",
        image: "/img/error.png"
      };
    }
    if (member === "rangeout") {
      return {
        color: "#ff0000",
        member: locale === 'en' ? "Out of range" : "範囲外",
        text: locale === 'en'
          ? "There is no seat there. Please check your seat again."
          : "そこに座席はありませんわ。もう一度自分の座席を確認してごらんなさい。",
        image: "/img/error.png"
      };
    }
  }
  return {
    color: "#ff0000",
    member: locale === 'en' ? "Error" : "エラー",
    text: locale === 'en' ? "Error" : "エラー",
    image: "/img/error.png"
  };
} 