function getParam(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//videojs
let player = videojs('videoPlayer ', {
		autoplay: false,
		loop: true,
		controls: false,
		preload: 'auto',
		playbackRates: [0.5, 1, 1.5, 2]
});

function get_categories(platform_token, platform_uid) { //get_tokenから呼び出せ
		const urlSearch = "https://platform-api.tver.jp/service/api/v1/callSearchFilter";;
		const method = "POST";
		const objConfig = {
				"device_type": "pc"
		};
		let headers = {
				"x-tver-platform-type": "web"
		};
		const body = Object.keys(objConfig).map((key) => key + "=" + encodeURIComponent(objConfig[key])).join("&");
		const url = urlSearch + `?platform_uid=${platform_uid}&platform_token=${platform_token}&keyword=&require_data=later`;
		console.log("request url=" + url);
		return (fetch(url, {
				headers
		}))
		/*.then((res) => {
						return (res.json())
				}).then((json) => {
						// 「さがす」の番組情報
						console.log(json["result"]["contents"]);
				})*/
		;
}

function get_programs(platform_token, platform_uid, tag) {
		const urlSearch = "https://platform-api.tver.jp/service/api/v1/callTagSearch/" + tag;;
		const method = "POST";
		const objConfig = {
				"device_type": "pc"
		};
		let headers = {
				"x-tver-platform-type": "web"
		};
		const body = Object.keys(objConfig).map((key) => key + "=" + encodeURIComponent(objConfig[key])).join("&");
		const url = urlSearch + `?platform_uid=${platform_uid}&platform_token=${platform_token}&keyword=&require_data=later`;
		//console.log("request url=" + url);
		return (fetch(url, {
				headers
		}))
		/*.then((res) => {
						return (res.json())
				}).then((json) => {
						// 「さがす」の番組情報
						console.log(json["result"]["contents"]);
				})*/
		;
}
/*
const urlConfig = "https://platform-api.tver.jp/v2/api/platform_users/browser/create";;
const urlSearch = "https://platform-api.tver.jp/service/api/v1/callSearch";;
const method = "POST";
const objConfig = {
		"device_type": "pc"
};
let headers = {
		'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
};
const body = Object.keys(objConfig).map((key) => key + "=" + encodeURIComponent(objConfig[key])).join("&");
fetch(urlConfig, {
		method,
		headers,
		body
}).then((res) => {
		return (res.json())
}).then((resp) => {
		let platform_uid = resp.result.platform_uid;
		let platform_token = resp.result.platform_token;
		console.log("platform_uid =" + platform_uid);
		console.log("platform_token=" + platform_token);
		const url = urlSearch + `?platform_uid=${platform_uid}&platform_token=${platform_token}&keyword=&require_data=later`;
		headers = {
				"x-tver-platform-type": "web"
		};
		console.log("request url=" + url);
		fetch(url, {
				headers
		}).then((res) => {
				return (res.json())
		}).then((json) => {
				// 「さがす」の番組情報
				console.log(json);
		});
}).catch(console.error);
*/
function get_token() {
		const urlConfig = "https://platform-api.tver.jp/v2/api/platform_users/browser/create";;
		const method = "POST";
		const objConfig = {
				"device_type": "pc"
		};
		let headers = {
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		};
		const body = Object.keys(objConfig).map((key) => key + "=" + encodeURIComponent(objConfig[key])).join("&");
		return (fetch(urlConfig, {
				method,
				headers,
				body
		}));
		/*.then(response => response.json()).then(json => {
				platform_token=(json["result"]["platform_token"]);
				platform_uid=(json["result"]["platform_uid"]);
				console.log(platform_token);
				get_categories(platform_token,platform_uid);
		})*/
}

function list_categories() {
		get_token().then(response => response.json()).then(json => {
				platform_token = (json["result"]["platform_token"]);
				platform_uid = (json["result"]["platform_uid"]);
				//カテゴリー取得
				get_categories(platform_token, platform_uid).then((res) => {
						return (res.json())
				}).then((json) => {
						// 「さがす」の番組情報
						categories = (json["result"]["contents"]);
						for (const category of categories) {
								//console.log(category);
								$('div.list-box>ul').append('<a href="list.html?mode=seltag&category=' + category["id"] + '"><li class="program-list">' + category["name"] + '</li></a>') //カテゴリ選択
								//$('div.categories').append('<div id='+category["id"]+'"></div>')//中身を置く
								/*for (const category_list of category["tags"]) {
									$('#'+category["id"]).append('<div id='+category_list["id"]+'">'+category_list["name"]+'</div>')//中身を置く
								}*/
						}
						//init
						$('a').eq(0).focus();
				});
		})
}

function list_tags(cat) {
		get_token().then(response => response.json()).then(json => {
				platform_token = (json["result"]["platform_token"]);
				platform_uid = (json["result"]["platform_uid"]);
				//カテゴリー取得
				get_categories(platform_token, platform_uid).then((res) => {
						return (res.json())
				}).then((json) => {
						// 「さがす」の番組情報
						categories = (json["result"]["contents"]);
						$('div.list-box>ul').append('<a href="#" onclick="history.back(-1);return false;"><li   class="program-list">戻る</li></a>') //中身を置く
						for (const category of categories) {
								//console.log(category);
								//$('div.categories>ul.category').append('<li><a href="#'+category["id"]+'">'+category["name"]+'</a></li>')//カテゴリ選択
								for (const category_list of category["tags"]) {
										if (category["id"] == cat) {
												$('div.list-box>ul').append('<a href="list.html?mode=selprog&tag=' + category_list["id"] + '" class="' + category["id"] + '" id="' + category_list["id"] + '"><li  class="program-list">' + category_list["name"] + '</li></a>') //中身を置く
										}
								}
						}
						//init
						$('a').eq(0).focus();
				});
		})
}

function list_programs(tag) {
		let broadcastDateLabel = "";
		get_token().then(response => response.json()).then(json => {
				platform_token = (json["result"]["platform_token"]);
				platform_uid = (json["result"]["platform_uid"]);
				//カテゴリー取得
				get_programs(platform_token, platform_uid, tag).then((res) => {
						return (res.json())
				}).then((json) => {
						// 「さがす」の番組情報
						programs = (json["result"]["contents"]);
						for (let program of programs) {
								program = program["content"];
								//console.log(program);
								if (program["broadcastDateLabel"] != 0) {
										broadcastDateLabel = "【" + program["broadcastDateLabel"] + "】";
								}
								$('div.list-box>ul').append('<a id="' + program["id"] + '" href="player.html?type=tver&mode=player&id=' + program["id"] + '"><li class="program-list"><div class="program-desc-1">' + program["seriesTitle"] + "　" + program["title"] + '</div><div class="program-desc-2">' + broadcastDateLabel + '</div><div class="program-desc-3">' + program["productionProviderName"] + '</div>' + '</li></a>') //カテゴリ選択
						}
						//init
						console.log($.cookie("focus"));
						if ($('#' + $.cookie("focus")).length) {
								$('#' + $.cookie("focus")).focus();
								console.log("存在");
						} else {
								$('a').eq(0).focus();
								console.log("存在しない");
						}
						changeData();
						//videojs
				});
		})
}
if (getParam("mode") == "selcat") {
		list_categories();
} else if (getParam("mode") == "seltag") {
		list_tags(getParam("category"));
} else if (getParam("mode") == "selprog") {
		list_programs(getParam("tag"));
}
//tverのm3u8取得
function changeVideo(url, id) {
		$.post('/cgi-bin/extract_m3u8.py', 'url=' + url).done(function (data) {
				console.log(data);
				player.src({
						type: "application/x-mpegURL",
						src: data,
						poster: 'https://statics.tver.jp/images/content/thumbnail/episode/xlarge/' + id + '.jpg'
				});
				player.play();
		})
}

function changeData() {
		var currentId = ($(':focus')[0]["id"]); //現在のidを取得
		changeVideo("https://tver.jp/lp/episodes/" + currentId, currentId); //m3u8変更
		$('.videoPlayer').attr('poster', 'https://statics.tver.jp/images/content/thumbnail/episode/xlarge/' + currentId + '.jpg'); //画像変更
		var descText = (($(':focus').children('li').children('.program-desc-1')[0]["innerText"])); //説明取得
		$('.desc').text(descText); //説明反映
		var descText = (($(':focus').children('li').children('.program-desc-2')[0]["innerText"])); //日付取得
		$('.date').text(descText); //日付反映
		var descText = (($(':focus').children('li').children('.program-desc-3')[0]["innerText"])); //放送局取得
		$('.station').text(descText); //放送局反映
		console.log("changed");
}
var timer;

function changeDataTimeout() {
		clearTimeout(timer); //stop timer
		timer = setTimeout("changeData()", 500); //reset timer
}
$(window).on('keydown', function (e) {
		if (e.keyCode == 38) { // ↑
				focus_prev();
				$.cookie("focus", $(':focus')[0]["id"], {
						expires: 100 * 365
				}); //100years
				return false;
		} else if (e.keyCode == 40) { // ↓
				focus_next();
				$.cookie("focus", $(':focus')[0]["id"], {
						expires: 100 * 365
				}); //100years
				return false;
		} else if (e.keyCode == 27) { // esc
				$.removeCookie("focus");
				history.back();
				return false;
		}
});
/**
 * フォーカスを前に移動する
 */
function focus_prev() {
		// 現在のフォーカスを取得
		var currentFocusIndex = $('a').index($(':focus'));
		if (currentFocusIndex > -1) {
				for (var i = 0; i < $('a').length; i++) {
						if (i == currentFocusIndex && i > 0) {
								$('a').eq(i - 1).focus();
						}
				}
		}
		if (getParam("mode") == "selprog") {
				changeDataTimeout();
		}
}
/**
 * フォーカスを次に移動する
 */
function focus_next() {
		// 現在のフォーカスを取得
		var currentFocusIndex = $('a').index($(':focus'));
		if (currentFocusIndex > -1) {
				for (var i = 0; i < $('a').length; i++) {
						if (i == currentFocusIndex && i < $('a').length - 1) {
								$('a').eq(i + 1).focus();
						}
				}
		} else {
				$('a').eq(0).focus();
		}
		if (getParam("mode") == "selprog") {
				changeDataTimeout();
		}
}
