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
		autoplay: true,
		loop: false,
		controls: true,
		preload: 'auto',
		playbackRates: [0.5, 1, 1.5, 2],
		controlBar: { volumePanel: false,
		fullscreenToggle: false,
		pictureInPictureToggle:false,
		playbackRateMenuButton:false
		}
});

function set2fig(num) {
   // 桁数が1桁だったら先頭に0を加えて2桁に調整する
   var ret;
   if( num < 10 ) { ret = "0" + num; }
   else { ret = num; }
   return ret;
}
function showClock2() {
   var nowTime = new Date();
   var nowHour = ( nowTime.getHours() );
   if(nowHour>=12){
   nowHour-=12;
   }
   var nowMin  = set2fig( nowTime.getMinutes() );
   var nowSec  = set2fig( nowTime.getSeconds() );
   var msg =  nowHour + ":" + nowMin;
   document.getElementById("clock").innerHTML = msg;
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
}


function changeDataTimeout() {
		let timer;
		clearTimeout(timer); //stop timer
		timer = setTimeout("changeData()", 500); //reset timer
}


//tverのm3u8取得
function changeVideoM3u8(url) {
				player.src({
						type: "application/x-mpegURL",
						src: url,
				});
				player.play();
}


function  select_ch(ch){
	$.getJSON("live.json", function(data){
if(ch<=data.length){
		changeVideoM3u8(data[ch-1]["url"]);}
		console.log(data);
		$(".vjs-live-display").html(data[ch-1]["ch"]+" "+data[ch-1]["name"]);
		$.cookie("channel",ch, {
						expires: 100 * 365
				}); //100years
	    });
}

$(window).on('keydown', function(e) {
console.log(e.keyCode);
	if(e.keyCode == 32) { // space
		if(player.paused()==false){
			player.pause()
		}
		else{
			player.play()
		}
		return false;
	}else if(e.keyCode == 27) { // esc
		history.back();
		return false;
	}else if(e.keyCode==76){//l
		window.location.href = "list.html?mode=selcat";
	}
	else if(e.keyCode==38){//↑

		if( $('#clock').css('display')=="none"){
			$('#clock').css('display', 'block');
			$.cookie("clock",1, {
						expires: 100 * 365
				}); //100years
		}else{
			$('#clock').css('display', 'none');
			$.cookie("clock",0, {
						expires: 100 * 365
				}); //100years
		}
		
	}else if(e.keyCode==49){//1
	select_ch(1)
	}else if(e.keyCode==50){//2
	select_ch(2)
	}else if(e.keyCode==51){//3
	select_ch(3)
	}else if(e.keyCode==52){//4
	select_ch(4)
	}else if(e.keyCode==53){//5
	select_ch(5)
	}else if(e.keyCode==54){//6
	select_ch(6)
	}else if(e.keyCode==55){//7
	select_ch(7)
	}else if(e.keyCode==56){//8
	select_ch(8)
	}else if(e.keyCode==57){//9
	select_ch(9)
	}else if(e.keyCode==58){//10
	select_ch(10)
	}else if(e.keyCode==59){//11
	select_ch(11)
	}else if(e.keyCode==60){//12
	select_ch(12)
	}
});

console.log(getParam("mode"));

	 if(getParam("mode")=="player"){
	changeVideo("https://tver.jp/lp/episodes/" + getParam("id"), getParam("id"));
	//clock
	setInterval('showClock2()',1000);	
	}else if(getParam("mode")=="live"){
	
	if ($.cookie("channel")!=undefined) {
			select_ch( $.cookie("channel"));
	} else {
			select_ch( 1);
	}
	//clock
	setInterval('showClock2()',1000);
	}

			if ($.cookie("clock")==undefined||$.cookie("clock")==1) {
			$('#clock').css('display', 'block');
			} else {
			$('#clock').css('display', 'none');
			}
