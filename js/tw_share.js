const hashTags = [
  "Aqours",
  "Aqours_SUNNY_Day1",
  "Aqours_SUNNY_Day2",
  "lovelive"
];

const cardLink = "https://aqoursrainbow2018.wixsite.com/aqours-rainbow/project";

function createHashTagMessage() {
  let str = "";
  hashTags.map((tag) => {
    const newTag = "%23" + tag + "%20";
    str = str.concat(newTag);
  });
  return str +'%0a';
}

//----シェア機能----
function tw_share() {
  //結果をHTMLから取得する
  var color = document.getElementById("result").innerHTML;
  //ツイート内容をセット
  var tw_contents = (
    'Aqoursに「おかえり」を込めた虹をみんなで架けませんか？%0a私の色は【' + color + '】だったよ！%0a' + createHashTagMessage()
  );
  //#twitter_buttonのhrefにパラメーターを渡す
  window.open().location.href = ("https://twitter.com/share?url=" + cardLink + "&text=" + tw_contents + "&count=none&lang=ja");
}