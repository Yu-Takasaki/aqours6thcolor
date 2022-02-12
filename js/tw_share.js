const hashTags = [
  "Liella",
  "Liella_東京追加_Day2",
  "Liella5lines"
];

function createHashTagMessage() {
  const str = "%0a"
  hashTags.map((tag) => {
    const newTag = "%23" + tag + "%20";
    str.concat(newTag);
  });

  return str +'%0a';
}

//----シェア機能----
function tw_share() {
  console.log("tw_clicked!!")
  var url = 'https://liella5lines-project.jimdofree.com/';
  //結果をHTMLから取得する
  var color = document.getElementById("result").innerHTML;
  //キャラクター画像をリンクで取得
  var character = document.getElementById('liella-img').src;
  //ツイート内容をセット
  var tw_contents = (
    'Starlight Prologueの演出をみんなでしてみませんか？%0a私の色は【' + color + '】だったよ！%0a' + createHashTagMessage()
  );
  //#twitter_buttonのhrefにパラメーターを渡す
  window.open().location.href = ("https://twitter.com/share?url=" + url + "&text=" + tw_contents + "&count=none&lang=ja");
}