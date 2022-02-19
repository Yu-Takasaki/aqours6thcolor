$(function () {
  // 画像配列
  const img = new Array();
  img[0] = new Image();
  img[0] = "./img/result_sample.png";

  // 選択項目初期値
  const DEFAULT_SELECT_OPTION　= "選択してください";

  // 類別区分定数
  const BASE_OPTIONS = ["1塁（ライトスタンド）","ネット裏","3塁（レフトスタンド）"];

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
  const NET_BLOCK_MAX = 227;　// ブロックが終わる数字
  const BLOCK_DATA_NET = createRowArray(NET_BLOCK_MIN, NET_BLOCK_MAX);　// 全体座席範囲
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

  // 選択肢をアンマウントする(selectの子要素をemptyにする)
  function deleteOptions() {
    $("#select-base").empty();
    $("#select-block").empty();
    $("#select-row").empty();
    $("#textbox-number").empty();
  }

  // 特定の選択肢をアンマウントする
  function deleteTargetOptions(target) {
    $(target).empty();
  }

  function selectBoxInitialize(target) {
    const initValues = ["選択してください"];
    deleteTargetOptions(target);
    createOptions(target, initValues);
  }

  // スタンド席の全体選択項目を初期化する
  function clearAllSelectBox(){
    selectBoxInitialize("#select-base");
    selectBoxInitialize("#select-block");
    selectBoxInitialize("#select-row");
    selectBoxInitialize("#textbox-number");
  }

  function createRowArray(min, max) {
    return Array.from({length: max - min + 1}, (_, i)=> String(min + i));
  }

  //席種に応じて選択肢の表示を変える
  $("#select-seat-type").change(function() {
    displayNoneAll();
    clearAllSelectBox();
    
    const seat_type = $("#select-seat-type").val();
    if (seat_type) {
      releaseDisplay("#judge-btn");
      judgeDone();

      if (seat_type === "other") {
        selectedSeatByOther();
        return;
      }
      arenaFunc();
      return;
    }
  });

  // アリーナ席、フィールドシートの場合
  function arenaFunc() {
    console.log("arena!!")
  }

  // スタンド席の場合
  function selectedSeatByOther() {
    // 選択項目を表示
    releaseDisplay("#input-base");
    releaseDisplay("#input-block");
    releaseDisplay("#input-row");
    releaseDisplay("#input-number");

    // 塁側選択項目追加
    initBase();
    initBlock();
  }

  // 塁側選択項目初期化
  function initBase() {
    const baseId = "#select-base";

    selectBoxInitialize(baseId);
    createOptions(baseId, BASE_OPTIONS);

    const $base = $(baseId);

    // 塁側選択項目イベント登録
    $base.change((e) => {
      const val = e.target.value;
      const target = "#select-block";

      selectBoxInitialize(target);
      selectBoxInitialize("#select-row");
      
      if (val === BASE_OPTIONS[0]) {
        createOptions(target, Object.keys(BLOCK_DATA_FIRST));
      }else  if (val === BASE_OPTIONS[1]) {
        createOptions(target, BLOCK_DATA_NET);
      }else if (val === BASE_OPTIONS[2]) {
        createOptions(target, Object.keys(BLOCK_DATA_THIRD));  
      }
    })
  }

  // ブロック選択項目初期化
  function initBlock() { 
    $("#select-block").change((e) => {
      const val = e.target.value;
      const target = "#select-row";

      selectBoxInitialize(target);
      
      // 選択した席により列の項目を生成
      if (Object.keys(BLOCK_DATA_FIRST).includes(val)) {
        const [min, max] = BLOCK_DATA_FIRST[val];
        const data = createRowArray(min,max);
        createOptions(target, data);  
      } else if (Object.keys(BLOCK_DATA_THIRD).includes(val)) {
        const [min, max] = BLOCK_DATA_THIRD[val];
        const data = createRowArray(min, max);
        createOptions(target, data);  
      } else if (BLOCK_DATA_NET.includes(val)) {
        let min, max;
        let data = [];
        
        if (Object.keys(NET_BLOCK_NOT_DEFAULT_PATTERN).includes(val)) {
          [min, max] = NET_BLOCK_NOT_DEFAULT_PATTERN[val];
        }else{
          if (Number(val) % 2 == 0) {
            [min, max] = NET_BLOCK_DEFAULT_ROW_EVEN;
          } else {
            [min, max] = NET_BLOCK_DEFAULT_ROW_ODD;
          }
        }
        data = createRowArray(min, max);
        createOptions(target, data);  
      }
    })
  }

  // judgeボタン押下時
  // 各メンバーカラーごとの判定を作成してください。
  function judgeDone() {
    $("#judge-btn").click(function() {
      try {
        const seatType = $("#select-seat-type").val();
      
        // スタンド席以外
        if (seatType !== "other") {
          result("chika");
          return;
        }
        
        // スタンド席選択・入力値取得
        const standSeatData = {
          "base" : $("#select-base").val(),
          "block" : $("#select-block").val(),
          "row" : $("#select-row").val(),
          "seatNumber" : $("#textbox-number").val()
        };
                
        // 未選択判別
        const unseletedCheck = Object.values(standSeatData).map(val => {
          if (!val || val === DEFAULT_SELECT_OPTION){
            return true;
          } else {
            return false;
          } 
        });

        if (unseletedCheck.includes(true)) {
          result('unselected');
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


  function findColor(block, row) {
    // 当てはまる色があるか確認
    const filerColor = (row, colorSet) => {
      const between = (x, min, max) => {
        return x >= min && x <= max;
      };

      for(key in colorSet) {
        [min, max] = colorSet[key];
        if (between(row, min, max)) {
          return key;
        } 
      }
      return "rangeOut";
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
          "hanamaru": [1, 2]
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
          "hanamaru": [35, 40],
          "riko": [41, 46],
          "you": [39, 47]
        };
      } else if (block === "179" || block === "379") {
        colorSet = {
          "yohane": [29, 29]
        };
      } else {
        result("rangeOut");
      }
    } else if (BLOCK_DATA_NET.includes(block)) {
      if (block === "213" || block === "215") {
        colorSet = {
          "ruby": [21, 24],
          "hanamaru": [25, 26]
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
            "hanamaru": [27, 32],
            "riko": [33, 38],
            "you": [39, 47]
          };
        }
      }
    } else{
      return "error";
    } 

    return filerColor(row, colorSet);
  }


  // 結果を返す
  function result(member) {
    console.log("member: ", member)
    let src, color, text;
    if (member === "chika") {
      src = img[0];
      color = "";
      text = "みかん色";
    }
    if (member === "riko") {
      src = img[0];
      color = "";
      text = "サクラピンク";
    }
    if (member === "kanan") {
      src = img[0];
      color = "";
      text = "エメラルドグリーン";
    }
    if (member === "dia") {
      src = img[0];
      color = "";
      text = "レッド";
    }
    if (member === "you") {
      src = img[0];
      color = "";
      text = "ライトブルー";
    }
    if (member === "yohane") {
      src = img[0];
      color = "";
      text = "ホワイト";
    }
    if (member === "hanamaru") {
      src = img[0];
      color = "";
      text = "イエロー";
    }
    if (member === "mari") {
      src = img[0];
      color = "";
      text = "バイオレット";
    }
    if (member === "ruby") {
      src = img[0];
      color = "";
      text = "ピンク";
    }
    if (member === "error") {
      src = "./img/error.png";
      color = "";
      text = "エラー";
    }
    if (member === "unselected") {
      src = "./img/error.png";
      color = "";
      text = "未選択";
    }
    $("#result-img").attr("src", src);
    $("#result").css("color", color);
    $("#result").html(text);
    $("#modal-options").iziModal("open");
  }


  // モーダル初期化
  $("#modal-options").iziModal();
});