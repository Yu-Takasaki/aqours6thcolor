$(function () {
  // 画像関連
  const ICON_PATH_GEN = (name) => {
    return `./img/member_icon/${name}.png`
  };

  // 選択項目初期値
  const DEFAULT_SELECT_OPTION = "選択してください";

  // 類別区分定数
  const BASE_OPTIONS = ["1塁（ライトスタンド）", "ネット裏", "3塁（レフトスタンド）"];

  // 入力フォームのIDオブジェクト
  const INPUT_IDS = {
    "type": "#select-seat-type",
    "base": "#select-base",
    "block": "#select-block",
    "row": "#select-row",
    "number": "#textbox-number",
    "row-number": "#input-row-number"
  }

  // ブロック区分定数-1塁側
  const BLOCK_DATA_FIRST = {
    // 座席番号：[座席最小番号, 座席最大番号]
    "T1-T7": [1, 8],
    "L1-L9": [1, 2],
    "D1-D9": [1, 2],
    "101-178": [1, 60],
    "179": [29, 29],
    "180-184": [1, 21]
  };

  // ブロック区分定数-ネット裏
  const NET_BLOCK_MIN = 200; // ブロックが始まる数字
  const NET_BLOCK_MAX = 227; // ブロックが終わる数字
  const BLOCK_DATA_NET = createRowArray(NET_BLOCK_MIN, NET_BLOCK_MAX); // 全体座席範囲
  const NET_BLOCK_DEFAULT_ROW_EVEN = [1, 16]; // 偶数ブロックの基本座席範囲
  const NET_BLOCK_DEFAULT_ROW_ODD = [27, 47]; // 奇数ブロックの基本座席範囲
  const NET_BLOCK_NOT_DEFAULT_PATTERN = {     // パターン外のブロック
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
  const BLOCK_DATA_THIRD = {
    // 座席番号：[座席最小番号, 座席最大番号]
    "T2-T8": [1, 8],
    "L2-L10": [1, 2],
    "D2-D10": [1, 2],
    "301-378": [1, 56],
    "379": [29, 29],
    "380-384": [1, 21]
  };

  // 指定した要素を表示させる
  function releaseDisplay(target) {
    $(target).removeClass("d-none");
    $(target).css({
      display: "block",
    });
  }
  // 指定した要素を隠す
  function displayNone(target) {
    $(target).addClass("d-none");
    $(target).css({
      display: "none",
    });
  }

  // 指定したリンクボタンをdisable
  function anchorDisable(target) {
    $(target).addClass("disabled");
    $(target).attr("aria-disabled", "true");
  }

  // 指定したリンクボタンをable
  function anchorUndisable(target) {
    $(target).removeClass("disabled");
    $(target).attr("aria-disabled", "false");
  }

  // すべて隠す
  function displayNoneAll() {
    $("#input-base").css({ display: "none" });
    $("#input-row").css({ display: "none" });
    $("#input-block").css({ display: "none" });
    $("#input-number").css({ display: "none" });
    $("#judge-btn").css({ display: "none" });
  }

  // 選択肢を生成する
  function createOptions(target, val) {
    _.map(val, (item) => {
      let op = $("<option>");
      if (typeof item === "string") {
        op.val(item);
      } else {
        op.val(String(item));
      }

      if (typeof item === "string") {
        op.html(item);
      } else {
        op.html(String(item));
      }
      $(target).append(op);
    });
  }

  // 検索ボタンを非活性
  function disableButton() {
    $("#judge-btn").addClass("disabled");
  }

  // 選択肢をアンマウントする(selectの子要素をemptyにする)
  function deleteOptions() {
    $(INPUT_IDS["base"]).empty();
    $(INPUT_IDS["block"]).empty();
    $(INPUT_IDS["row"]).empty();
  }

  // 特定の選択肢をアンマウントする
  function deleteTargetOptions(target) {
    $(target).empty();
  }

  // セレクトボックスを初期化
  function selectBoxInitialize(target) {
    const initValues = [DEFAULT_SELECT_OPTION];
    deleteTargetOptions(target);
    createOptions(target, initValues);
  }

  // スタンド席の全体選択項目を初期化する
  function clearAllSelectBox() {
    selectBoxInitialize(INPUT_IDS["base"]);
    selectBoxInitialize(INPUT_IDS["block"]);
    selectBoxInitialize(INPUT_IDS["row"]);
  }

  // スタンド席の全体選択項目を初期化する
  function clearAllInputData() {
    $(INPUT_IDS["number"]).val('');
  }

  // エラー表示用のクラスを追加
  function addInvalidClass(target) {
    $(target).addClass("is-invalid");
  }
  // エラー表示用のクラスを削除
  function removeInvalidClass(target) {
    $(target).removeClass("is-invalid");
  }

  //バリデーション（選択項目）
  function selectValid(val) {
    if (val === DEFAULT_SELECT_OPTION) {
      return false;
    }
    if (!val) {
      return false;
    }
    return true;
  }

  //バリデーション（入力項目）
  function inputValid(val) {
    if (!val) {
      return false;
    }
    return true;
  }

  // スタンド席の全体選択項目のバリデーションチェック結果を初期化する
  function clearAllValid() {
    removeInvalidClass(INPUT_IDS["base"]);
    removeInvalidClass(INPUT_IDS["block"]);
    removeInvalidClass(INPUT_IDS["row"]);
    removeInvalidClass(INPUT_IDS["number"]);
  }

  // 列生成用の配列を生成
  function createRowArray(min, max) {
    return Array.from({ length: max - min + 1 }, (_, i) => String(min + i));
  }

  //席種に応じて選択肢の表示を変える
  $(INPUT_IDS["type"]).change(function () {
    displayNoneAll();

    //入力項目初期化
    clearAllSelectBox();
    clearAllInputData();
    clearAllValid();

    const seat_type = $(INPUT_IDS["type"]).val();
    if (seat_type === "other") {
      initBase();
      return;
    } else if (seat_type) {
      arenaFunc();
      return;
    }
  });

  // アリーナ席、フィールドシートの場合
  function arenaFunc() {
    $("#judge-btn").removeClass("disabled");
    releaseDisplay("#judge-btn");
    judgeDone();
  }

  // 塁側選択項目初期処理
  function initBase() {
    releaseDisplay("#input-base");
    const baseId = INPUT_IDS["base"];

    selectBoxInitialize(baseId);
    createOptions(baseId, BASE_OPTIONS);

    // 塁側選択項目イベント登録
    $(baseId).change((e) => {
      const val = e.target.value;
      const selectBlockId = INPUT_IDS["block"];
      let optionArray = []

      //入力チェック
      if (selectValid(val)) {
        removeInvalidClass(baseId);
        initBlock();
        disableButton();
      } 

      selectBoxInitialize(selectBlockId);
      selectBoxInitialize(INPUT_IDS["row"]);
      clearAllInputData();

      if (val === BASE_OPTIONS[0]) {
        optionArray = Object.keys(BLOCK_DATA_FIRST);
      } else if (val === BASE_OPTIONS[1]) {
        optionArray = BLOCK_DATA_NET;
      } else if (val === BASE_OPTIONS[2]) {
        optionArray = Object.keys(BLOCK_DATA_THIRD);
      }

      createOptions(selectBlockId, optionArray)
    })
  }

  // ブロック選択項目初期処理
  function initBlock() {
    releaseDisplay("#input-block");
    const blockId = INPUT_IDS["block"];
    $(blockId).change((e) => {
      const val = e.target.value;
      const selectRowId = INPUT_IDS["row"];
      let data = [];

      //入力チェック
      if (selectValid(val)) {
        initRow_Number();
        removeInvalidClass(blockId);
        disableButton();
      }

      selectBoxInitialize(selectRowId);
      clearAllInputData();
      clearAllValid();

      // 選択した席により列の項目を生成
      if (Object.keys(BLOCK_DATA_FIRST).includes(val)) {
        const [min, max] = BLOCK_DATA_FIRST[val];
        data = createRowArray(min, max);
      } else if (Object.keys(BLOCK_DATA_THIRD).includes(val)) {
        const [min, max] = BLOCK_DATA_THIRD[val];
        data = createRowArray(min, max);
      } else if (BLOCK_DATA_NET.includes(val)) {
        let min, max;

        if (Object.keys(NET_BLOCK_NOT_DEFAULT_PATTERN).includes(val)) {
          [min, max] = NET_BLOCK_NOT_DEFAULT_PATTERN[val];
        } else {
          [min, max] = Number(val) % 2 == 0 ? NET_BLOCK_DEFAULT_ROW_EVEN : NET_BLOCK_DEFAULT_ROW_ODD;
        }
        data = createRowArray(min, max);
      }

      createOptions(selectRowId, data);
    })
  }

  // 列＆座席番号入力項目初期処理
  function initRow_Number() {
    releaseDisplay("#judge-btn");
    disableButton();
    releaseDisplay("#input-row");
    releaseDisplay("#input-number");

    const rowId = INPUT_IDS["row"];
    const numberId = INPUT_IDS["number"];
    const rowNumId = INPUT_IDS["row-number"];
    let rowVal, numVal;
    $(rowNumId).change((e) => {
      const targetName = e.target.name;
      if (targetName === "select_row") {
        rowVal = e.target.value;
      }
      if (targetName === "input_number") {
        numVal = e.target.value;
      }

      //入力チェック
      if (selectValid(rowVal)) {
        removeInvalidClass(rowId);
      } else {
        disableButton();
      }
      if (inputValid(numVal)) {
        removeInvalidClass(numberId);
      } else {
        disableButton();
      }
      if (selectValid(rowVal) && inputValid(numVal)) {
        $("#judge-btn").removeClass("disabled");
        judgeDone();
      }
    })
  }

  // judgeボタン押下時
  // 各メンバーカラーごとの判定を作成してください。
  function judgeDone() {
    $("#judge-btn").click(function () {
      try {
        const seatType = $(INPUT_IDS["type"]).val();

        // スタンド席以外
        if (seatType !== "other") {
          result("chika");
          return;
        }

        // スタンド席選択・入力値取得
        const standSeatData = {
          "base": $(INPUT_IDS["base"]).val(),
          "block": $(INPUT_IDS["block"]).val(),
          "row": $(INPUT_IDS["row"]).val(),
          "number": $(INPUT_IDS["number"]).val()
        };

        // 未選択判別
        const unseletedCheck = Object.values(standSeatData).map(val => {
          if (!val || val === DEFAULT_SELECT_OPTION) {
            return true;
          } else {
            return false;
          }
        });

        if (unseletedCheck.includes(true)) {
          const ids = Object.keys(standSeatData);
          for (i in unseletedCheck) {
            if (unseletedCheck[i]) {
              const id = ids[i];
              addInvalidClass(INPUT_IDS[id]);
            }
          }
          return;
        }

        // スタンド席色分け
        const seatBlock = standSeatData["block"];
        const seatRow = Number(standSeatData["row"]);

        const color = findColor(seatBlock, seatRow);
        result(color);

      } catch {
        result("error");
      }
    });
  }

  // 色を検索
  function findColor(block, row) {
    // 当てはまる色があるか確認
    const colorFiler = (row, colorSet) => {
      const between = (x, min, max) => {
        return x >= min && x <= max;
      };

      for (key in colorSet) {
        [min, max] = colorSet[key];
        if (between(row, min, max)) {
          return key;
        }
      }
      return "rangeout";
    };

    let colorSet = {};

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
        result("rangeout");
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

    return colorFiler(row, colorSet);
  }


  // 結果を返す
  function result(member) {
    let src, color, text;

    const memberColorSet = {
      "chika": {
        "color": "#ff7f32",
        "text": "みかん色",
      },
      "riko": {
        "color": "#FB6372",
        "text": "サクラピンク",
      },
      "kanan": {
        "color": "#00c7b1",
        "text": "エメラルドグリーン",
      },
      "dia": {
        "color": "#e4002b",
        "text": "レッド",
      },
      "you": {
        "color": "#00b5e2",
        "text": "ライトブルー",
      },
      "yohane": {
        "color": "#d4d4d4",
        "text": "ホワイト",
      },
      "maru": {
        "color": "#ffcd00",
        "text": "イエロー",
      },
      "mari": {
        "color": "#9b26b6",
        "text": "バイオレット",
      },
      "ruby": {
        "color": "#e93cac",
        "text": "ピンク",
      },
    }

    if (Object.keys(memberColorSet).includes(member)) {
      src = ICON_PATH_GEN(member);
      ({ color, text } = memberColorSet[member]);
    } else {
      if (member === "error") {
        src = "./img/error.png";
        color = "";
        text = "エラー";
      }
      if (member === "rangeout") {
        src = "./img/error.png";
        color = "red";
        text = "そこに座席はありませんわ。もう一度自分の座席を確認してごらんなさい。";
      }
    }

    $("#result-img").attr("src", src);
    $("#result").css("color", color);
    $("#result").html(text);
    $("#modal-options").iziModal("open");
  }

  // モーダル初期化
  $("#modal-options").iziModal();
});