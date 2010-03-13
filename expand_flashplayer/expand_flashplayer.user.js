// ==UserScript==
// @name           Expand Flashplayer (YouTube, Viddler, Dailymotion, Blip.tv, WeGame)
// @author         Justen Walker (http://www.justenwalker.com)
// @description    Creates a button which expands The flash player to fill your screen. Works on YouTube, Viddler, Dailymotion, Blip.tv, and WeGame.
// @include        http://www.viddler.com/*
// @include        http://www.dailymotion.com/video/*
// @include        http://blip.tv/file/*
// @include        http://www.youtube.com/watch*
// @include        http://www.wegame.com/watch/*
// @require        http://updater.usotools.co.cc/65592.js
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version        1.0.1
// ==/UserScript==

function ExpandVideo() {
	var SetupPage = function() {
		var body = document.body;
		var head = document.getElementsByTagName('head')[0];
		body.innerHTML = "";
		head.innerHTML = [
 "<style>"
,"html, body { margin: 0px; padding 0px; background-color: #000; text-align: center; overflow: hidden; }"
,"a { color: #000; text-decoration:none; }"
,".toolbar { position: absolute; bottom: 0px; left: 0px; background-color: #ffa; color: #000; height: 24px; width: 100%; }"
,"</style>"
		].join("\n");

	};
	var GeneralSetup = function()
	{
		var myself = this;
		// Get Objects
		this.flash_movie = document.getElementById(this.embed_id);
		this.container = this.flash_movie.parentNode;
		this.btnExpand = document.createElement('button');
		// Insert the expand button
		this.container.insertBefore(this.btnExpand,this.flash_movie);
		
		// Store the normal size of the player
		this.properties = {
			width: this.flash_movie.clientWidth,
			height: this.flash_movie.clientHeight
		};
		// Style & position the Expand Button
		this.btnExpand.innerHTML = 'Expand';
		this.btnExpand.style.position = 'absolute';
		this.btnExpand.style.display = 'block';
		this.btnExpand.style.left = '' + (this.flash_movie.clientWidth  - this.btnExpand.clientWidth) + 'px';
		this.btnExpand.onclick = function() { 
			myself.expand();
		}
		if( this.adjust ) this.adjust('setup');
	};
	var GeneralExpand = function()
	{
		var myself = this;

		// Create [Normal Size] Button
		this.btnNormal = document.createElement('button');
		this.btnNormal.innerHTML = 'Normal Size';
		this.btnNormal.onclick = function() {
			myself.my_player.width = myself.properties.width;
			myself.my_player.height = myself.properties.height;
			window.onresize = null;
		};
		// Create [Fullscreen] Button
		this.btnFullscreen = document.createElement('button');
		this.btnFullscreen.innerHTML = 'Fullscreen';
		this.btnFullscreen.onclick = function() {
			myself.resize();
			window.onresize = function() { myself.resize(); }
		};

		// Create Toolbar
		this.toolbar = document.createElement('div');
		this.toolbar.className = 'toolbar';
		this.toolbar.appendChild(this.btnNormal);
		this.toolbar.appendChild(this.btnFullscreen);
				
		// Create new Flash Player
		this.my_player = this.flash_movie.cloneNode(true);
		this.my_player.setAttribute('bgcolor',"#000000");

		// Setup Page
		SetupPage();
		document.body.appendChild(this.my_player);
		document.body.appendChild(this.toolbar);
		this.resize();
		window.onresize = function() { myself.resize(); }
		if( this.adjust ) this.adjust('expand');
	};
	var GeneralResize = function() {
		this.my_player.width = window.innerWidth;
		this.my_player.height = window.innerHeight - 24;
		if( this.adjust ) this.adjust('resize');
	};

	var modules = {
		viddler: {
			embed_id: 'viddler',
			setup: GeneralSetup,
			expand: GeneralExpand,
			resize: GeneralResize,
			adjust: function(type) {
				if( type == 'setup' )
				{
					// Get the author ID and Video ID
					// Store the normal size of the player
					this.flash_movie.style.marginTop = '8px';
					var info = document.getElementById('smLinkValue').value;
					var info_re = /([^\/]+)\/videos\/([0-9]+)/;
					var matches = info_re.exec(info);
					this.properties = {
						width: this.flash_movie.width,
						height: this.flash_movie.height,
						author: matches[1],
						vidid: matches[2]
					};

					this.btnExpand.style.left = '' + (this.flash_movie.clientWidth - this.btnExpand.clientWidth + 8 ) + 'px';
					this.btnExpand.style.top = '-1px';
				}
				if( type == 'expand' ) 
				{
					var myself = this;
					// Create [Next Video] Button
					this.btnNext = document.createElement('button');
					this.btnNext.innerHTML = 'Next Video';
					this.btnNext.onclick = function() { myself.next_video(); }
					this.toolbar.appendChild(this.btnNext);
				}
				if( type == 'resize' )
				{
					this.my_player.height = window.innerHeight - 32;
				}
			},
			next_video: function() {
				var url = 'http://viddler.com/explore/' + this.properties.author + '/videos/' + ( this.properties.vidid*1 + 1);
				window.location = url;
	    		}
		},
		dailymotion: {
			embed_id: 'videoplayer',
			setup: GeneralSetup,
			expand: GeneralExpand,
			adjust: function(type) {
				if( type == 'setup' )
				{
					this.btnExpand.style.left = '' + (this.flash_movie.clientWidth - this.btnExpand.clientWidth - 5 ) + 'px';
					this.btnExpand.style.top = '-1px';
				}
			},
			resize: GeneralResize
		},
		bliptv: {
			embed_id: 'video_player_embed',
			setup: GeneralSetup,
			expand: GeneralExpand,
			adjust: function(type) {
				if( type == 'setup' )
				{
					this.btnExpand.style.left = '' + (this.flash_movie.offsetLeft +  this.flash_movie.clientWidth - this.btnExpand.clientWidth - 5) + 'px';
					this.btnExpand.style.top = '' + (this.flash_movie.offsetTop  - this.btnExpand.clientHeight - 5) + 'px';
				}
			},
			resize: GeneralResize
		},
		youtube: {
			embed_id: 'movie_player',
			setup: GeneralSetup,
			expand: GeneralExpand,
			adjust: function(type) {
				if( type == 'setup' )
				{
					this.btnExpand.className = 'yt-button yt-button-primary';
					this.btnExpand.style.left = '' + (this.flash_movie.offsetLeft + this.flash_movie.clientWidth - this.btnExpand.clientWidth - 72) + 'px';
					this.btnExpand.style.top = '' + (this.flash_movie.offsetTop  - this.btnExpand.clientHeight - 8) + 'px';
				}
			},
			resize: GeneralResize
		},
		wegame: {
			embed_id: 'flash_player_swf',
			setup: GeneralSetup,
			expand: GeneralExpand,
			adjust: function(type) {
				var myself = this;
				if( type == 'setup' )
				{
					this.properties.width = this.flash_movie.width;
					this.properties.height = this.flash_movie.height;
					this.btnExpand.className = 'userbar2-menu-btn';
					this.btnExpand.style.width = '64px';
					this.btnExpand.style.height = '32px';
					this.btnExpand.style.backgroundImage = 'url(http://llnw-static.wegame.com/static/images/userbar-uploadvid-bg.gif)';
					this.repos();
					this.btnExpand.style.left = '' + (this.flash_movie.offsetLeft + this.flash_movie.width*0.5 - 75) + 'px';
					var current_resize = window.onresize;
					window.onresize = function() {
						if(current_resize) current_resize();
						myself.repos();
					}
				}
			},
			repos: function() {
				this.btnExpand.style.left = '' + (this.flash_movie.offsetLeft + this.flash_movie.width*1 - 86) + 'px';
				this.btnExpand.style.top = '' + (this.flash_movie.offsetTop  - this.btnExpand.clientHeight - 2) + 'px';
			},
			resize: GeneralResize
		}
	};

	// Viddler Setup
	if( /viddler[.]com/.test(window.location) ) {
		modules.viddler.setup();
	}
	// Dailymotion Setup
	if( /dailymotion[.]com/.test(window.location) ) {
		modules.dailymotion.setup();
	}
	// Blip.tv Setup
	if( /blip[.]tv/.test(window.location) ) {
		modules.bliptv.setup();
	}
	// YouTube Setup
	if( /youtube[.]com/.test(window.location) ) {
		modules.youtube.setup();
	}
	// WeGame Setup
	if( /wegame[.]com/.test(window.location) ) {
		modules.wegame.setup();
	}
}
var code = "(" + ExpandVideo + ")();";
document.body.appendChild(document.createElement("script")).innerHTML=code;
