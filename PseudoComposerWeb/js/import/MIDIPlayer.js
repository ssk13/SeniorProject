if (typeof (console) === "undefined") var console = {
	log: function() {}
};
// Toggle between Pause and Play modes.
var pausePlayStop = function(stop) {
	var d = document.getElementById("pausePlayStop");
	if (stop) {
		MIDI.Player.stop();
		d.src = "./img/play.png";
	} else if (MIDI.Player.playing) {
		d.src = "./img/play.png";
		MIDI.Player.pause(true);
	} else {
		d.src = "./img/pause.png";
		MIDI.Player.resume();
	}
};
eventjs.add(window, "load", function(event) {
	var link = document.createElement("link");
	link.href = "//fonts.googleapis.com/css?family=Oswald";
	link.ref = "stylesheet";
	link.type = "text/css";
	document.body.appendChild(link);
	var link = document.createElement("link");
	link.href = "//fonts.googleapis.com/css?family=Andada";
	link.ref = "stylesheet";
	link.type = "text/css";
	document.body.appendChild(link);

	///
	MIDI.loader = new sketch.ui.Timer;
	MIDI.loadPlugin({
		soundfontUrl: "./soundfont/",
		onprogress: function(state, progress) {
			MIDI.loader.setValue(progress * 100);
		},
		onsuccess: function() {

			/// this sets up the MIDI.Player and gets things going...
			player = MIDI.Player;
			player.timeWarp = 1; // speed the song is played back
			player.loadFile(song[songid++ % song.length], player.start);

			MIDIPlayerPercentage(player);
		}
	});
});

var MIDIPlayerPercentage = function(player) {
	// update the timestamp
	var time1 = document.getElementById("time1");
	var time2 = document.getElementById("time2");
	var capsule = document.getElementById("capsule");
	var timeCursor = document.getElementById("cursor");
	//
	eventjs.add(capsule, "drag", function(event, self) {
		eventjs.cancel(event);
		player.currentTime = (self.x) / 420 * player.endTime;
		if (player.currentTime < 0) player.currentTime = 0;
		if (player.currentTime > player.endTime) player.currentTime = player.endTime;
		if (self.state === "down") {
			player.pause(true);
		} else if (self.state === "up") {
			player.resume();
		}
	});
	//
	function timeFormatting(n) {
		var minutes = n / 60 >> 0;
		var seconds = String(n - (minutes * 60) >> 0);
		if (seconds.length == 1) seconds = "0" + seconds;
		return minutes + ":" + seconds;
	};
	player.getNextSong = function(n) {
		var id = Math.abs((songid += n) % song.length);
		player.loadFile(song[id], player.start); // load MIDI
	};
	player.setAnimation(function(data, element) {
		var percent = data.now / data.end;
		var now = data.now >> 0; // where we are now
		var end = data.end >> 0; // end of song
		if (now === end) { // go to next song
			var id = ++songid % song.length;
			player.loadFile(song[id], player.start); // load MIDI
		}
		// display the information to the user
		timeCursor.style.width = (percent * 100) + "%";
		time1.innerHTML = timeFormatting(now);
		time2.innerHTML = "-" + timeFormatting(end - now);
	});
};


// Begin loading indication.
var player;
// MIDI files from Disklavier World
var songid = 0;
var song = [
	 //Test 1
	'data:audio/mid;base64,TVRoZAAAAAYAAQABAMBNVHJrAAAARwD/WAQEAhgIAP9RAwehIAD/AwlOZXcgVHJhY2sAwHMAkDxkMoA8MIEOkDxkMoA8MIEOkDxkMoA8MIEOkDxkgT+APDAB/y8A'
];