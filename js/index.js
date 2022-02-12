$(function () {
  // 画像配列
  const img = new Array();
  img[0] = new Image();
  img[0] = "./img/result_sample.png";

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
    $("#select-number").empty();
  }

  // 特定の選択肢をアンマウントする
  function deleteTargetOptions(target) {
    $(target).empty();
  }

  //席種に応じて選択肢の表示を変える
  $("#select-seet-type").change(function() {
    displayNoneAll();
    const seet_type = $("#select-seet-type").val();
    if (seet_type) {
      releaseDisplay("#judge-btn");
      if (seet_type === "stand") {
        releaseDisplay("#input-base");
        releaseDisplay("#input-block");
        releaseDisplay("#input-row");
        releaseDisplay("#input-number");
        standFunc();
        return;
      }
      arenaFunc();
      return;
    }
  });

  // アリーナ席、フィールドシートの場合
  function arenaFunc() {
    console.log("arena!!")
    judgeDone();
  }
  // スタンド席の場合
  function standFunc() {
    console.log("stand!!")
    // 選択肢を動的生成してください
  }


  // judgeボタン押下時
  // 各メンバーカラーごとの判定を作成してください。
  function judgeDone(base, block, row, number) {
    console.log("base: ", base, "block: ", block, "row: ", row, "number: ", number)
    $("#judge-btn").click(function() {
      // 千歌㌠
      if (!base && !block && !row && !number) {
        result("chika");
        return;
      }
      // 鞠莉㌠
      if (false) {
        result("mari");
        return;
      }
      // 果南㌠
      if (false) {
        result("kanan");
        return;
      }
      // ダイヤ㌠
      if (false) {
        result("dia");
        return;
      }
      // ヨハネ㌠
      if (false) {
        result("yohane");
        return;
      }
      // ルビィ㌠
      if (false) {
        result("ruby");
        return;
      }
      // 花丸㌠
      if (false) {
        result("hanamaru");
        return;
      }
      // 梨子㌠
      if (false) {
        result("riko");
        return;
      }
      // 曜㌠
      if (false) {
        result("you");
        return;
      }
      // 曜㌠
      else {
        result("error");
        return;
      }
    });
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
    if (member === "error") {
      src = "./img/error.png";
      color = "";
      text = "みかん色";
    }
    $('#result-img').attr("src", src);
    $('#result').css('color', color);
    $('#result').html(text);
    $('#modal-options').iziModal('open');
  }


  // モーダル初期化
  $("#modal-options").iziModal();
});