(function ($) {

	this.MainMenuRoom = this.Room.extend({
		type: 'mainmenu',
		customCalculator: function () { app.addPopup(CustomCalculatorPopup); },
		tinyWidth: 340,
		bestWidth: 628,
		events: {
			'keydown textarea': 'keyDown',
			'keyup textarea': 'keyUp',
			'click .username': 'clickUsername',
			'click .header-username': 'clickUsername',
			'click .closebutton': 'closePM',
			'click .minimizebutton': 'minimizePM',
			'click .pm-challenge': 'clickPMButtonBarChallenge',
			'click .pm-userOptions':'clickPMButtonBarUserOptions',
			'click .pm-window': 'clickPMBackground',
			'dblclick .pm-window h3': 'dblClickPMHeader',
			'focus textarea': 'onFocusPM',
			'blur textarea': 'onBlurPM',
			'click .spoiler': 'clickSpoiler',
			'click button.formatselect': 'selectFormat',
			'click button.teamselect': 'selectTeam',
			'keyup input': 'selectTeammate'
		},
		initialize: function () {
			this.$el.addClass('scrollable');

			// left menu 2 (high-res: right, low-res: top)
			// (created during page load)

			// left menu 1 (high-res: left, low-res: bottom)
			var buf = '';
			if (app.down) {
				buf += '<div class="menugroup" style="background: rgba(10,10,10,.6)">';
				if (app.down === 'ddos') {
					buf += '<p class="error"><strong>Pok&eacute;mon Showdown is offline due to a DDoS attack!</strong></p>';
				} else {
					buf += '<p class="error"><strong>Pok&eacute;mon Showdown is offline due to technical difficulties!</strong></p>';
				}
				buf += '<p><div style="text-align:center"><img width="96" height="96" src="//play.pokemonshowdown.com/sprites/gen5/teddiursa.png" alt="" class="pixelated" /></div> Bear with us as we freak out.</p>';
				buf += '<p>(We\'ll be back up in a few hours.)</p>';
				buf += '</div>';
			} else {
				buf += '<div class="menugroup"><form class="battleform" data-search="1">';
				buf += '<p><label class="label">Format:</label>' + this.renderFormats() + '</p>';
				buf += '<p><label class="label">Team:</label>' + this.renderTeams() + '</p>';
				buf += '<p><label class="label" name="partner" style="display:none">';
				buf += 'Partner: <input name="teammate" /></label></p>';
				buf += '<p><label class="checkbox"><input type="checkbox" name="private" ' + (Storage.prefs('disallowspectators') ? 'checked' : '') + ' /> <abbr title="You can still invite spectators by giving them the URL or using the /invite command">Don\'t allow spectators</abbr></label></p>';
				buf += '<p><button class="button mainmenu1 big" name="search"><strong>Battle!</strong><br /><small>Find a random opponent</small></button></p></form></div>';
			}

			buf += '<div class="menugroup">';
			buf += '<p><button class="button mainmenu2" name="joinRoom" value="teambuilder">Teambuilder</button></p>';
			buf += '<p><button class="button mainmenu3" name="customCalculator">Custom calculator</button></p>';
			buf += '<p><button class="button mainmenu3" name="joinRoom" value="ladder">Ladder</button></p>';
			buf += '<p><button class="button mainmenu4" name="send" value="/smogtours">Tournaments</button></p>';
			buf += '</div>';

			buf += '<div class="menugroup"><p><button class="button mainmenu4 onlineonly disabled" name="joinRoom" value="battles">Watch a battle</button></p>';
			buf += '<p><button class="button mainmenu5 onlineonly disabled" name="finduser">Find a user</button></p>';
			buf += '<p><button class="button mainmenu6 onlineonly disabled" name="send" value="/friends">Friends</button></p></div>';

			this.$('.mainmenu').html(buf);

			// right menu
			if (document.location.hostname === Config.routes.client) {
				this.$('.rightmenu').html('<div class="menugroup"><p><button class="button mainmenu1 onlineonly disabled" name="joinRoom" value="rooms">Join chat</button></p></div>');
			} else {
				this.$('.rightmenu').html('<div class="menugroup"><p><button class="button mainmenu1 onlineonly disabled" name="joinRoom" value="lobby">Join lobby chat</button></p></div>');
			}

			// footer
			// (created during page load)

			this.$activityMenu = this.$('.activitymenu');
			this.$pmBox = this.$activityMenu.find('.pmbox');

			app.on('init:formats', this.updateFormats, this);
			app.on('response:challengeoptions', this.receiveChallengeOptions, this);
			this.updateFormats();

			app.user.on('saveteams', this.updateTeams, this);

			// news
			// (created during page load)

			var self = this;
			Storage.whenPrefsLoaded(function () {
				var newsid = Number(Storage.prefs('newsid'));
				var $news = self.$('.news-embed');
				$news.find('.minimizebutton').attr('tabindex', '0');
				if ($(window).width() < 628) return;
				if (!newsid) return;
				var $newsEntries = $news.find('.newsentry');
				var hasUnread = false;
				for (var i = 0; i < $newsEntries.length; i++) {
					if (Number($newsEntries.eq(i).data('newsid')) > newsid) {
						hasUnread = true;
						$newsEntries.eq(i).addClass('unread');
					}
				}
				if (!hasUnread) self.minimizePM($news);
			});

			if (!app.roomsFirstOpen && window.location.host !== 'demo.psim.us' && window.innerWidth < 630) {
				if (Config.roomsFirstOpenScript) {
					Config.roomsFirstOpenScript(true);
				}
				app.roomsFirstOpen = 2;
			}
			if ('nw' in window && !nw.process.version.startsWith('v13.')) {
				app.addPopupMessage(
					"Your version of the app is out of date.\n" +
					"Please go to pokemonshowdown.com to update it."
				);
			}
		},

		addPseudoPM: function (options) {
			if (!options) return;
			options.title = options.title || '';
			options.html = options.html || '';
			options.cssClass = options.cssClass || '';
			options.height = options.height || 'auto';
			options.maxHeight = options.maxHeight || '';
			options.attributes = options.attributes || '';
			options.append = options.append || false;
			options.noMinimize = options.noMinimize || false;

			this.$pmBox[options.append ? 'append' : 'prepend']('<div class="pm-window ' + options.cssClass + '" ' + options.attributes + '><h3><button class="closebutton" tabindex="-1" aria-label="Close"><i class="fa fa-times-circle"></i></button>' + (!options.noMinimize ? '<button class="minimizebutton" tabindex="-1" aria-label="Minimize"><i class="fa fa-minus-circle"></i></button>' : '') + options.title + '</h3><div class="pm-log" style="overflow:visible;height:' + (typeof options.height === 'number' ? options.height + 'px' : options.height) + ';' + (parseInt(options.height, 10) ? 'max-height:none' : (options.maxHeight ? 'max-height:' + (typeof options.maxHeight === 'number' ? options.maxHeight + 'px' : options.maxHeight) : '')) + '">' +
				options.html +
				'</div></div>');
		},

		// news

		addNews: function () {
			var self = this;
			$.ajax({
				url: "https://" + Config.routes.root + "/news.json",
				dataType: "json",
				success: function (data) {
					var html = '';
					for (var i = 0; i < 2; i++) {
						var post = data[i];
						var hasRead = data[i].id && Dex.prefs('readnews') === '' + data[i].id;

						html += '<div class="newsentry' + (hasRead ? '' : ' unread') + '">';
						if (post.title) html += '<h4>' + post.title + '</h4>';
						if (post.summaryHTML) html += '<p>' + post.summaryHTML + '</p>';
						html += '<p>';
						if (post.author) html += '—<strong>' + post.author + '</strong>';
						if (post.date) {
							html += '<small class="date"> on ' + new Date(post.date * 1000).toDateString() + '</small>';
						}
						html += '</p></div>';
					}
					self.addPseudoPM({
						title: 'Latest News',
						html: html,
						attributes: 'data-newsid="' + (data[0].id ? data[0].id : '1990') + '"',
						cssClass: 'news-embed',
						maxHeight: 'none'
					});
				}
			});
		},

		/*********************************************************
		 * PMs
		 *********************************************************/

		addPM: function (name, message, target) {
			var userid = toUserid(name);
			if (app.ignore[userid] && " +\u2606\u203D\u2716!".includes(name.charAt(0))) {
				if (!app.ignoreNotified) {
					message = '/nonotify A message from ' + BattleLog.escapeHTML(name) + ' was ignored.';
					app.ignoreNotified = true;
				}
				return;
			}
			var isSelf = (toID(name) === app.user.get('userid'));
			var oName = isSelf ? target : name;
			Storage.logChat('pm-' + toID(oName), '' + name + ': ' + message);

			var $pmWindow = this.openPM(oName, true);
			var $chatFrame = $pmWindow.find('.pm-log');
			var $chat = $pmWindow.find('.inner');

			var autoscroll = ($chatFrame.scrollTop() + 60 >= $chat.height() - $chatFrame.height());

			var parsedMessage = MainMenuRoom.parseChatMessage(message, name, ChatRoom.getTimestamp('pms'), false, $chat, false);
			if (typeof parsedMessage.challenge === 'string') {
				this.updateChallenge($pmWindow, parsedMessage.challenge, name, oName);
				return;
			}
			var canNotify = true;
			if (typeof parsedMessage === 'object' && 'noNotify' in parsedMessage) {
				canNotify = !parsedMessage.noNotify;
				parsedMessage = parsedMessage.message;
			}
			if (!$.isArray(parsedMessage)) parsedMessage = [parsedMessage];
			for (var i = 0; i < parsedMessage.length; i++) {
				if (!parsedMessage[i]) continue;
				$chat.append(parsedMessage[i]);
			}

			var $lastMessage = $chat.children().last();
			var textContent = $lastMessage.html().includes('<span class="spoiler">') ? '(spoiler)' : $lastMessage.children().last().text();
			if (textContent && app.curSideRoom && app.curSideRoom.addPM && Dex.prefs('inchatpm')) {
				app.curSideRoom.addPM(name, message, target);
			}

			if (canNotify && !isSelf && textContent) {
				this.notifyOnce("PM from " + name, "\"" + textContent + "\"", 'pm');
			}

			if (autoscroll) {
				$chatFrame.scrollTop($chat.height());
			}

			if (!$pmWindow.hasClass('focused') && name.substr(1) !== app.user.get('name')) {
				$pmWindow.find('h3').addClass('pm-notifying');
			}
		},
		updateChallenge: function ($pmWindow, challenge, name, oName) {
			var splitChallenge = challenge.split('|');
			var formatName = splitChallenge[0];
			var teamFormat = splitChallenge[1];
			var official = splitChallenge[2] === "true";
			var message = splitChallenge[3];
			var acceptButtonLabel = splitChallenge[4] || 'Accept';
			var rejectButtonLabel = splitChallenge[5] || 'Reject';
			var oUserid = toID(oName);
			var userid = toID(name);

			var $challenge = $pmWindow.find('.challenge');
			if ($challenge.find('button[name=makeChallenge]').length) {
				// we're currently trying to challenge that user; suppress the challenge and wait until later
				$challenge.find('button[name=dismissChallenge]').attr(
					'data-pendingchallenge', challenge ? (name + '|' + oName + '|' + challenge) : ''
				);
				return;
			}

			if (!formatName && !message) {
				if ($challenge.length) {
					$challenge.remove();
					this.closeNotification('challenge:' + oUserid);
				}
				return;
			}

			$challenge = this.openChallenge(oName, $pmWindow);

			if (userid !== oUserid) {
				// we are sending the challenge
				var buf = '<form class="battleform"><p>Waiting for ' + BattleLog.escapeHTML(oName) + '...</p>';
				if (formatName) {
					buf += '<p><label class="label">' + (teamFormat ? 'Format' : 'Game') + ':</label>' + this.renderFormats(formatName, true) + '</p>';
				}
				if (message) buf += '<p>' + BattleLog.escapeHTML(message) + '</p>';
				buf += '<p class="buttonbar"><button name="cancelChallenge" class="button">Cancel</button></p></form>';
				$challenge.html(buf);
				return;
			}

			app.playNotificationSound();
			this.notifyOnce((official ? "OFFICIAL " : "") + "Challenge from " + name, "Format: " + BattleLog.escapeFormat(formatName), 'challenge:' + userid);
			var buf = '<form class="battleform"><p>' + BattleLog.escapeHTML(message || (name + ' wants to battle!')) + '</p>';
			if (formatName) {
				buf += '<p><label class="label">' + (teamFormat ? 'Format' : 'Game') + ':</label>' + this.renderFormats(formatName, true) + '</p>';
			}
			if (teamFormat) {
				buf += '<p><label class="label">Team:</label>' + this.renderTeams(teamFormat) + '</p>';
				buf += '<p><label class="checkbox"><input type="checkbox" name="private" ' + (Storage.prefs('disallowspectators') ? 'checked' : '') + ' /> <abbr title="You can still invite spectators by giving them the URL or using the /invite command">Don\'t allow spectators</abbr></label></p>';
			}
			if (official) {
				buf += '<p style="text-align:center"><label class="label" style="centered">--- OFFICIAL BATTLE! ---</label></p>';
			}
			buf += '<p class="buttonbar"><button name="acceptChallenge" class="button"><strong>' + BattleLog.escapeHTML(acceptButtonLabel) + '</strong></button> <button type="button" name="rejectChallenge" class="button">' + BattleLog.escapeHTML(rejectButtonLabel) + '</button></p></form>';
			$challenge.html(buf);
		},

		selectTeammate: function (e) {
			if (e.currentTarget.name !== 'teammate' || e.keyCode !== 13) return;
			var partner = toID(e.currentTarget.value);
			if (!partner.length) return;
			app.send('/requestpartner ' + partner + ',' + this.curFormat);
			e.currentTarget.value = '';
		},

		openPM: function (name, dontFocus) {
			var userid = toID(name);
			var $pmWindow = this.$pmBox.find('.pm-window-' + userid);
			if (!$pmWindow.length) {
				var group = name.charAt(0);
				if (group === ' ') {
					group = '';
				} else if (/[a-zA-Z0-9]/.test(group)) {
					group = '';
					name = ' ' + name;
				} else {
					group = '<small>' + BattleLog.escapeHTML(group) + '</small>';
				}
				var buf = '<div class="pm-window pm-window-' + userid + '" data-userid="' + userid + '" data-name="' + BattleLog.escapeHTML(name) + '">';
				buf += '<h3><button class="closebutton" href="' + app.root + 'teambuilder" tabindex="-1" aria-label="Close"><i class="fa fa-times-circle"></i></button>';
				buf += '<button class="minimizebutton" href="' + app.root + 'teambuilder" tabindex="-1" aria-label="Minimize"><i class="fa fa-minus-circle"></i></button>';
				buf += group + BattleLog.escapeHTML(name.substr(1)) + '</h3>';
				buf += '<div class="pm-log"><div class="pm-buttonbar"><button class="pm-challenge">Challenge</button><button class="pm-userOptions">...</button></div><div class="inner" role="log"></div></div>';
				buf += '<div class="pm-log-add"><form class="chatbox nolabel"><textarea class="textbox" type="text" size="70" autocomplete="off" name="message"></textarea></form></div></div>';
				$pmWindow = $(buf).prependTo(this.$pmBox);
				$pmWindow.find('textarea').autoResize({
					animate: false,
					extraSpace: 0
				});
				// create up/down history for this PM
				this.chatHistories[userid] = new ChatHistory();
			} else {
				$pmWindow.show();
				if (!dontFocus) {
					var $chatFrame = $pmWindow.find('.pm-log');
					var $chat = $pmWindow.find('.inner');
					$chatFrame.scrollTop($chat.height());
				}
			}
			if (!dontFocus) this.$el.scrollTop(0);
			return $pmWindow;
		},
		closePM: function (e) {
			var userid;
			if (e.currentTarget) {
				e.preventDefault();
				e.stopPropagation();
				userid = $(e.currentTarget).closest('.pm-window').data('userid');
				// counteract jQuery auto-casting
				if (userid !== undefined && userid !== '') userid = '' + userid;
			} else {
				userid = toID(e);
			}
			var $pmWindow;
			if (!userid) {
				// not a true PM; just close the window
				$pmWindow = $(e.currentTarget).closest('.pm-window');
				var newsId = $pmWindow.data('newsid');
				if (newsId) {
					$.cookie('showdown_readnews', '' + newsId, {expires: 365});
				}
				$pmWindow.remove();
				return;
			}
			$pmWindow = this.$pmBox.find('.pm-window-' + userid);
			$pmWindow.hide();

			var $rejectButton = $pmWindow.find('button[name=rejectChallenge]');
			if ($rejectButton.length) {
				this.rejectChallenge(userid, $rejectButton);
			}
			$rejectButton = $pmWindow.find('button[name=cancelChallenge]');
			if ($rejectButton.length) {
				this.cancelChallenge(userid, $rejectButton);
			}

			var $next = $pmWindow.next();
			while ($next.length && $next.css('display') === 'none') {
				$next = $next.next();
			}
			if ($next.length) {
				$next.find('textarea[name=message]').focus();
				return;
			}

			$next = $pmWindow.prev();
			while ($next.length && $next.css('display') === 'none') {
				$next = $next.prev();
			}
			if ($next.length) {
				$next.find('textarea[name=message]').focus();
				return;
			}

			if (app.curSideRoom) app.curSideRoom.focus();
		},
		minimizePM: function (e) {
			var $pmWindow;
			if (e.currentTarget) {
				e.preventDefault();
				e.stopPropagation();
				$pmWindow = $(e.currentTarget).closest('.pm-window');
			} else {
				$pmWindow = e;
			}
			if (!$pmWindow) {
				return;
			}

			if ($pmWindow.hasClass('news-embed') && $(window).width() < 628) {
				var expanded = !$pmWindow.hasClass('mobile-news-open');
				$pmWindow.toggleClass('mobile-news-open', expanded).data('minimized', !expanded);
				$pmWindow.find('.pm-log, .pm-log-add, .pm-buttonbar').toggle(expanded);
				$pmWindow.find('h3').toggleClass('pm-minimized', !expanded);
				$pmWindow.find('.minimizebutton').attr('aria-expanded', '' + expanded);
				return;
			}

			var $pmHeader = $pmWindow.find('h3');
			var $pmContent = $pmWindow.find('.pm-log, .pm-log-add, .pm-buttonbar');
			if (!$pmWindow.data('minimized')) {
				$pmContent.hide();
				$pmHeader.addClass('pm-minimized');
				$pmWindow.data('minimized', true);
			} else {
				$pmContent.show();
				$pmHeader.removeClass('pm-minimized');
				$pmWindow.data('minimized', false);
			}

			if ($pmWindow.hasClass('news-embed')) {
				$pmWindow.toggleClass('mobile-news-open', !$pmWindow.data('minimized'));
				$pmWindow.find('.minimizebutton').attr('aria-expanded', '' + !$pmWindow.data('minimized'));
			}

			$pmWindow.find('h3').removeClass('pm-notifying');
		},
		clickUsername: function (e) {
			e.stopPropagation();
			var name = $(e.currentTarget).data('name') || $(e.currentTarget).text();
			app.addPopup(UserPopup, {name: name, sourceEl: e.currentTarget});
		},
		clickPMButtonBarChallenge: function (e) {
			var name = $(e.currentTarget).closest('.pm-window').data('name');
			app.rooms[''].requestNotifications();
			app.focusRoom('');
			app.rooms[''].challenge(name);
		},
		clickPMButtonBarUserOptions: function (e) {
			e.stopPropagation();
			var name = $(e.currentTarget).closest('.pm-window').data('name');
			var userid = toID($(e.currentTarget).closest('.pm-window').data('name'));
			app.addPopup(UserOptions, {name: name, userid: userid, sourceEl: e.currentTarget});
		},
		focusPM: function (name) {
			this.openPM(name).prependTo(this.$pmBox).find('textarea[name=message]').focus();
		},
		onFocusPM: function (e) {
			$(e.currentTarget).closest('.pm-window').addClass('focused').find('h3').removeClass('pm-notifying');
		},
		onBlurPM: function (e) {
			$(e.currentTarget).closest('.pm-window').removeClass('focused');
		},
		keyUp: function (e) {
			var $target = $(e.currentTarget);
			// Android Chrome compose keycode
			// Android Chrome no longer sends keyCode 13 when Enter is pressed on
			// the soft keyboard, resulting in this annoying hack.
			// https://bugs.chromium.org/p/chromium/issues/detail?id=118639#c232
			if (!e.shiftKey && e.keyCode === 229 && $target.val().slice(-1) === '\n') {
				this.submitPM(e);
			}
		},
		submitPM: function (e) {
			e.preventDefault();
			e.stopPropagation();
			var $target = $(e.currentTarget);

			var text = $.trim($target.val());
			if (!text) return;
			var $pmWindow = $target.closest('.pm-window');
			var userid = $pmWindow.attr('data-userid') || '';
			var $chat = $pmWindow.find('.inner');
			// this.tabComplete.reset();
			this.chatHistories[userid].push(text);

			var data = '';
			var cmd = '';
			var spaceIndex = text.indexOf(' ');
			if (text.substr(0, 2) !== '//' && text.charAt(0) === '/' || text.charAt(0) === '!') {
				if (spaceIndex > 0) {
					data = text.substr(spaceIndex + 1);
					cmd = text.substr(1, spaceIndex - 1);
				} else {
					data = '';
					cmd = text.substr(1);
				}
			}
			switch (cmd.toLowerCase()) {
			case 'ignore':
				if (app.ignore[userid]) {
					$chat.append('<div class="chat">User ' + userid + ' is already on your ignore list. (Moderator messages will not be ignored.)</div>');
				} else {
					app.ignore[userid] = 1;
					$chat.append('<div class="chat">User ' + userid + ' ignored. (Moderator messages will not be ignored.)</div>');
					app.saveIgnore();
				}
				break;
			case 'unignore':
				if (!app.ignore[userid]) {
					$chat.append('<div class="chat">User ' + userid + ' isn\'t on your ignore list.</div>');
				} else {
					delete app.ignore[userid];
					$chat.append('<div class="chat">User ' + userid + ' no longer ignored.</div>');
					app.saveIgnore();
				}
				break;
			case 'nick':
				if ($.trim(data)) {
					app.user.rename(data);
				} else {
					app.addPopup(LoginPopup);
				}
				return false;
			case 'chal':
			case 'chall':
			case 'challenge':
				this.challenge(userid, data);
				break;
			case 'clear':
				$chat.empty();
				break;
			case 'rank': case 'ranking': case 'rating': case 'ladder':
			case 'user': case 'open':
			case 'debug':
			case 'news':
			case 'ignorelist':
			case 'clearpms':
			case 'showdebug': case 'hidedebug':
			case 'showjoins': case 'hidejoins':
			case 'showbattles': case 'hidebattles':
			case 'packhidden': case 'unpackhidden':
			case 'timestamps':
			case 'hl': case 'highlight':
			case 'buttonban': case 'buttonmute': case 'buttonunmute': case 'buttonkick': case 'buttonwarn':
			case 'part': case 'leave':
			case 'afd':
				$chat.append('<div class="chat">Use this command in a proper chat room.</div>');
				break;
			default:
				if (!userid) userid = '~';
				if (text.startsWith('\n')) text = text.slice(1);
				if (text.endsWith('\n')) text = text.slice(0, -1);
				text = ('\n' + text).replace(/\n/g, '\n/pm ' + userid + ', ').slice(1);
				if (text.length > 80000) {
					app.addPopupMessage("Your message is too long.");
					return;
				}
				if (!(text.startsWith('/') || text.startsWith('!')) && app.ignore[userid]) {
					app.addPopupMessage("You can't PM a user you've ignored. Use /unignore to remove them from your ignore list.");
					return;
				}
				this.send(text);
			}
			$target.val('');
			$target.trigger('keyup'); // force a resize
		},
		keyDown: function (e) {
			var cmdKey = (((e.cmdKey || e.metaKey) ? 1 : 0) + (e.ctrlKey ? 1 : 0) === 1) && !e.altKey && !e.shiftKey;
			if (e.keyCode === 13 && !e.shiftKey) { // Enter
				this.submitPM(e);
			} else if (e.keyCode === 27) { // Esc
				if (app.curSideRoom && app.curSideRoom.undoTabComplete && app.curSideRoom.undoTabComplete($(e.currentTarget))) {
					e.preventDefault();
					e.stopPropagation();
				} else {
					this.closePM(e);
				}
			} else if (e.keyCode === 73 && cmdKey) { // Ctrl + I key
				if (ConsoleRoom.toggleFormatChar(e.currentTarget, '_')) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if (e.keyCode === 66 && cmdKey) { // Ctrl + B key
				if (ConsoleRoom.toggleFormatChar(e.currentTarget, '*')) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if (e.keyCode === 33) { // Pg Up key
				var $target = $(e.currentTarget);
				var $pmWindow = $target.closest('.pm-window');
				var $chat = $pmWindow.find('.pm-log');
				$chat.scrollTop($chat.scrollTop() - $chat.height() + 60);
			} else if (e.keyCode === 34) { // Pg Dn key
				var $target = $(e.currentTarget);
				var $pmWindow = $target.closest('.pm-window');
				var $chat = $pmWindow.find('.pm-log');
				$chat.scrollTop($chat.scrollTop() + $chat.height() - 60);
			} else if (e.keyCode === 9 && !e.ctrlKey) { // Tab key
				var reverse = !!e.shiftKey; // Shift+Tab reverses direction
				var handlerRoom = app.curSideRoom;
				if (!handlerRoom) {
					for (var roomid in app.rooms) {
						if (!app.rooms[roomid].handleTabComplete) continue;
						handlerRoom = app.rooms[roomid];
						break;
					}
				}
				if (handlerRoom && handlerRoom.handleTabComplete && handlerRoom.handleTabComplete($(e.currentTarget), reverse)) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if (e.keyCode === 38 && !e.shiftKey && !e.altKey) { // Up key
				if (this.chatHistoryUp(e)) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if (e.keyCode === 40 && !e.shiftKey && !e.altKey) { // Down key
				if (this.chatHistoryDown(e)) {
					e.preventDefault();
					e.stopPropagation();
				}
			}
		},
		chatHistoryUp: function (e) {
			var $textbox = $(e.currentTarget);
			var idx = +$textbox.prop('selectionStart');
			var line = $textbox.val();
			if (e && !e.ctrlKey && idx !== 0 && idx !== line.length) return false;
			var userid = $textbox.closest('.pm-window').data('userid');
			var chatHistory = this.chatHistories[userid];
			if (chatHistory.index === 0) return false;
			$textbox.val(chatHistory.up(line));
			return true;
		},
		chatHistoryDown: function (e) {
			var $textbox = $(e.currentTarget);
			var idx = +$textbox.prop('selectionStart');
			var line = $textbox.val();
			if (e && !e.ctrlKey && idx !== 0 && idx !== line.length) return false;
			var userid = $textbox.closest('.pm-window').data('userid');
			var chatHistory = this.chatHistories[userid];
			$textbox.val(chatHistory.down(line));
			return true;
		},
		chatHistories: {},
		clickPMBackground: function (e) {
			if (!e.shiftKey && !e.cmdKey && !e.ctrlKey) {
				if (window.getSelection && !window.getSelection().isCollapsed) {
					return;
				}
				app.dismissPopups();
				var $target = $(e.currentTarget);
				var newsid = $target.data('newsid');
				if ($target.data('minimized')) {
					this.minimizePM(e);
				} else if ($(e.target).closest('h3').length) {
					// only preventDefault here, so clicking links/buttons in PMs
					// still works
					e.preventDefault();
					e.stopPropagation();
					this.minimizePM(e);
					return;
				} else if (newsid) {
					if (Storage.prefs('newsid', newsid)) {
						$target.find('.unread').removeClass('unread');
					}
					return;
				}
				$target.find('textarea[name=message]').focus();
			}
		},
		dblClickPMHeader: function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (window.getSelection) {
				window.getSelection().removeAllRanges();
			} else if (document.selection) {
				document.selection.empty();
			}
		},
		clickSpoiler: function (e) {
			$(e.currentTarget).toggleClass('spoiler-shown');
		},

		// support for buttons that can be sent by the server:

		joinRoom: function (room) {
			app.joinRoom(room);
		},
		avatars: function () {
			app.addPopup(AvatarsPopup);
		},
		openSounds: function () {
			app.addPopup(SoundsPopup, {type: 'semimodal'});
		},
		openOptions: function () {
			app.addPopup(OptionsPopup, {type: 'semimodal'});
		},

		// challenges and searching

		challengesFrom: null,
		challengeTo: null,
		resetPending: function () {
			this.updateSearch();
			var self = this;
			this.$('form.pending').closest('.pm-window').each(function (i, el) {
				$(el).find('.challenge').remove();
				self.challenge($(el).data('userid'));
			});
			this.$('button[name=acceptChallenge]').each(function (i, el) {
				el.disabled = false;
			});
		},
		searching: false,
		updateSearch: function (data) {
			if (data) {
				this.searching = data.searching;
				this.games = data.games;
			}
			var $searchForm = $('.mainmenu button.big').closest('form');
			var $formatButton = $searchForm.find('button[name=format]');
			var $teamButton = $searchForm.find('button[name=team]');
			if (!this.searching || $.isArray(this.searching) && !this.searching.length) {
				var format = $formatButton.val();
				var teamIndex = $teamButton.val();
				$formatButton.replaceWith(this.renderFormats(format));
				$teamButton.replaceWith(this.renderTeams(format, teamIndex));

				$searchForm.find('button.big').html('<strong>Battle!</strong><br /><small>Find a random opponent</small>').removeClass('disabled');
				$searchForm.find('p.cancel').remove();
			} else {
				$formatButton.addClass('preselected')[0].disabled = true;
				$teamButton.addClass('preselected')[0].disabled = true;
				$searchForm.find('button.big').html('<strong><i class="fa fa-refresh fa-spin"></i> Searching...</strong>').addClass('disabled');
				var searchEntries = $.isArray(this.searching) ? this.searching : [this.searching];
				for (var i = 0; i < searchEntries.length; i++) {
					var format = searchEntries[i].format || searchEntries[i];
					if (format.substr(0, 4) === 'gen5' && !Dex.loadedSpriteData['bw']) {
						Dex.loadSpriteData('bw');
						break;
					}
				}
			}

			var $searchGroup = $searchForm.closest('.menugroup');
			if (this.games) {
				var newlyCreated = false;
				if (!this.$gamesGroup) {
					this.$gamesGroup = $('<div class="menugroup"></div>');
					$searchGroup.before(this.$gamesGroup);
					newlyCreated = true;
				}
				if (!this.$gamesGroup.is(':visible') || newlyCreated) {
					$searchGroup.hide();
					this.$gamesGroup.show();
				}
				var buf = '<form class="battleform"><p><label class="label">Games:</label></p>';
				buf += '<div class="roomlist">';
				for (var roomid in this.games) {
					var name = this.games[roomid];
					if (name.slice(-1) === '*') name = name.slice(0, -1);
					buf += '<div><a href="/' + toRoomid(roomid) + '" class="blocklink" style="text-align: center">' + BattleLog.escapeHTML(name) + '</a></div>';
				}
				buf += '</div>';
				if (!$searchGroup.is(':visible')) buf += '<p class="buttonbar"><button name="showSearchGroup" class="button">Add game</button></p>';
				buf += '</form>';
				this.$gamesGroup.html(buf);
			} else {
				if (this.$gamesGroup) {
					this.$gamesGroup.hide();
					$searchGroup.show();
				}
			}
		},
		showSearchGroup: function (v, el) {
			var $searchGroup = $('.mainmenu button.big').closest('.menugroup');
			$searchGroup.show();
			$(el).closest('p').hide();
		},
		updateChallenges: function (data) {
			this.challengesFrom = data.challengesFrom;
			this.challengeTo = data.challengeTo;
			for (var i in data.challengesFrom) {
				if (app.ignore[i]) {
					delete data.challengesFrom[i];
					continue;
				}
				this.openPM(' ' + i, true);
			}
			var atLeastOneGen5 = false;

			var challengeToUserid = '';
			if (data.challengeTo) {
				var challenge = data.challengeTo;
				var name = challenge.to;
				var userid = toID(name);
				var $challenge = this.openChallenge(name);

				var buf = '<form class="battleform"><p>Waiting for ' + BattleLog.escapeHTML(name) + '...</p>';
				buf += '<p><label class="label">Format:</label>' + this.renderFormats(challenge.format, true) + '</p>';
				buf += '<p class="buttonbar"><button name="cancelChallenge" class="button">Cancel</button></p></form>';

				$challenge.html(buf);
				if (challenge.format.substr(0, 4) === 'gen5') atLeastOneGen5 = true;
				challengeToUserid = userid;
			}

			var self = this;
			this.$('.pm-window').each(function (i, el) {
				var $pmWindow = $(el);
				var userid = el.getAttribute('data-userid');
				var name = $pmWindow.data('name');
				if (data.challengesFrom[userid]) {
					var format = data.challengesFrom[userid];
					if (!$pmWindow.find('.challenge').length) {
						self.notifyOnce("Challenge from " + name, "Format: " + BattleLog.escapeFormat(format), 'challenge:' + userid);
					}
					var $challenge = self.openChallenge(name, $pmWindow);
					if (!$challenge.find('button[name=makeChallenge]').length) {
						app.playNotificationSound();
						var buf = '<form class="battleform"><p>' + BattleLog.escapeHTML(name) + ' wants to battle!</p>';
						buf += '<p><label class="label">Format:</label>' + self.renderFormats(format, true) + '</p>';
						buf += '<p><label class="label">Team:</label>' + self.renderTeams(format) + '</p>';
						buf += '<p><label class="checkbox"><input type="checkbox" name="private" ' + (Storage.prefs('disallowspectators') ? 'checked' : '') + ' /> <abbr title="You can still invite spectators by giving them the URL or using the /invite command">Don\'t allow spectators</abbr></label></p>';
						buf += '<p class="buttonbar"><button name="acceptChallenge" class="button"><strong>Accept</strong></button> <button type="button" name="rejectChallenge" class="button">Reject</button></p></form>';
						$challenge.html(buf);
						if (format.substr(0, 4) === 'gen5') atLeastOneGen5 = true;
					}
				} else {
					var $challenge = $pmWindow.find('.challenge');
					if ($challenge.length) {
						var $acceptButton = $challenge.find('button[name=acceptChallenge]');
						if ($acceptButton.length) {
							if ($acceptButton[0].disabled) {
								// You accepted someone's challenge and it started
								$challenge.remove();
							} else {
								// Someone was challenging you, but cancelled their challenge
								$challenge.html('<form class="battleform"><p>The challenge was cancelled.</p><p class="buttonbar"><button name="dismissChallenge" class="button">OK</button></p></form>');
							}
						} else if ($challenge.find('button[name=cancelChallenge]').length && challengeToUserid !== userid) {
							// You were challenging someone else, and they either accepted
							// or rejected it
							$challenge.remove();
						}
						self.closeNotification('challenge:' + userid);
					}
				}
			});

			if (atLeastOneGen5 && !Dex.loadedSpriteData['bw']) Dex.loadSpriteData('bw');
		},
		openChallenge: function (name, $pmWindow) {
			if (!$pmWindow) $pmWindow = this.openPM(name, true);
			var $challenge = $pmWindow.find('.challenge');
			if (!$challenge.length) {
				$challenge = $('<div class="challenge"></div>').insertAfter($pmWindow.find('h3'));
			}
			return $challenge;
		},
		updateFormats: function () {
			if (!window.BattleFormats) {
				this.$('.mainmenu button.big').html('<em>Connecting...</em>').addClass('disabled');
				return;
			} else if (app.isDisconnected) {
				var $searchForm = $('.mainmenu button.big').closest('form');
				$searchForm.find('button.big').html('<em>Disconnected</em>').addClass('disabled');
				$searchForm.find('.mainmenu p.cancel').remove();
				$searchForm.append('<p class="cancel buttonbar"><button name="reconnect" class="button">Reconnect</button></p>');
				this.$('button.onlineonly').addClass('disabled');
				return;
			}
			this.$('button.onlineonly').removeClass('disabled');

			if (!this.searching) this.$('.mainmenu button.big').html('<strong>Battle!</strong><br /><small>Find a random opponent</small>').removeClass('disabled');
			var self = this;
			this.$('button[name=format]').each(function (i, el) {
				var val = el.value;
				var $teamButton = $(el).closest('form').find('button[name=team]');
				$(el).replaceWith(self.renderFormats(val));
				$teamButton.replaceWith(self.renderTeams(val));
			});
		},
		reconnect: function () {
			document.location.reload();
		},
		updateTeams: function () {
			if (!window.BattleFormats) return;
			var self = this;

			this.$('button[name=team]').each(function (i, el) {
				if (el.value === 'random') return;
				var format = $(el).closest('form').find('button[name=format]').val();
				$(el).replaceWith(self.renderTeams(format));
			});
		},
		updateRightMenu: function () {
			if (app.curSideRoom) {
				this.$('.rightmenu').hide();
			} else {
				this.$('.rightmenu').show();
			}
		},

		// challenge buttons
		challenge: function (name, format, team) {
			var userid = toID(name);
			var $challenge = this.$('.pm-window-' + userid + ' .challenge');
			if ($challenge.length && !$challenge.find('button[name=dismissChallenge]').length) {
				return;
			}

			if (format) {
				var formatParts = format.split('@@@', 2);
				formatParts[0] = toID(formatParts[0]);
				if (!formatParts[0].startsWith('gen')) formatParts[0] = 'gen9' + formatParts[0];
				format = formatParts.length > 1 ? formatParts[0] + '@@@' + formatParts[1] : formatParts[0];
			}

			$challenge = this.openChallenge(name);
			var buf = '<form class="battleform"><p>Challenge ' + BattleLog.escapeHTML(name) + '?</p>';
			buf += '<p><label class="label">Format:</label>' + this.renderFormats(format) + '</p>';
			buf += '<p><label class="label">Team:</label>' + this.renderTeams(format) + '</p>';
			buf += '<p><label class="checkbox"><input type="checkbox" name="private" ' + (Storage.prefs('disallowspectators') ? 'checked' : '') + ' /><abbr title="You can still invite spectators by giving them the URL or using the /invite command">Don\'t allow spectators</abbr></label></p>';
			buf += '<details class="challenge-options"><summary>Battle options</summary><p><label>Starting weather: <select name="startingweather" disabled><option value="">Format default</option><option value="raindance">Rain</option><option value="sunnyday">Sun</option><option value="sandstorm">Sandstorm</option><option value="hail">Hail</option></select></label><small class="weather-reason">Checking format support…</small></p>';
			buf += '<p><label>Shared gimmick uses per trainer: <select name="gimmicklimit" disabled><option value="">Format default</option><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></label><small class="gimmicks-reason">Checking format support…</small></p><p><small>Gen 9 engine only. Existing mechanic bans and caps apply. Weather has normal duration and may change. Applies equally to each trainer, including FFA and supported Multi formats.</small></p></details>';
			var bestOfDefault = format && BattleFormats[format] ? BattleFormats[format].bestOfDefault : false;
			buf += '<p><label class="checkbox"><input type="checkbox" name="official"/>Official match</label></p>';
			buf += '<p' + (!bestOfDefault ? ' class="hidden">' : '>');
			buf += '<label class="checkbox"><input type="checkbox" name="bestof" /> <abbr title="Start a team-locked best-of-n series">Best-of-<input name="bestofvalue" type="number" min="3" max="9" step="2" value="3" style="width: 28px; vertical-align: initial;"></abbr></label></p>';
			buf += '<p class="buttonbar"><button name="makeChallenge" class="button"><strong>Challenge</strong></button> <button type="button" name="dismissChallenge" class="button">Cancel</button></p></form>';
			$challenge.html(buf);
			this.refreshChallengeOptions($challenge.find("form"));
		},
		refreshChallengeOptions: function ($form) {
			if (!$form.find('.challenge-options').length) return;
			$form.find('.challenge-options select').val('').prop('disabled', true);
			$form.find('.weather-reason, .gimmicks-reason').text('Checking format support. Defaults remain available.');
			app.send('/cmd challengeoptions ' + $form.find('button[name=format]').val());
		},
		receiveChallengeOptions: function (data) {
			if (!data || !data.format) return;
			this.$('.challenge form:not(.pending)').each(function (i, form) {
				var $form = $(form);
				if ($form.find('button[name=format]').val() !== data.format) return;
				['weather', 'gimmicks'].forEach(function (key) {
					var reason = data[key];
					if (typeof reason !== 'string') return;
					var $select = $form.find('select[name=' + (key === 'weather' ? 'startingweather' : 'gimmicklimit') + ']');
					$select.prop('disabled', !!reason);
					if (reason) $select.val('');
					$form.find('.' + key + '-reason').text(reason || (key === 'weather' ? 'Normal duration; weather can change.' : '0–2 shared uses per trainer; existing mechanic bans still apply.'));
				});
			});
		},
		acceptChallenge: function (i, target) {
			this.requestNotifications();
			var $pmWindow = $(target).closest('.pm-window');
			var userid = $pmWindow.data('userid');

			var format = $pmWindow.find('button[name=format]').val();
			var $teamButton = $pmWindow.find('button[name=team]');
			var privacy = this.adjustPrivacy($pmWindow.find('input[name=private]').is(':checked'));

			if ($teamButton.length) {
				var teamIndex = $teamButton.val();
				var team = null;
				if (Storage.teams[teamIndex]) team = Storage.teams[teamIndex];
				if (format.indexOf('@@@') === -1 && !window.BattleFormats[format].team && !team) {
					app.addPopupMessage("You need to go into the Teambuilder and build a team for this format.");
					return;
				}
				app.sendTeam(team, function () {
					target.disabled = true;
					app.send(privacy + '/accept ' + userid);
				});
			} else {
				target.disabled = true;
				app.send(privacy + '/accept ' + userid);
			}
		},
		rejectChallenge: function (i, target) {
			var userid = $(target).closest('.pm-window').data('userid');
			$(target).closest('.challenge').remove();
			app.send('/reject ' + userid);
		},
		makeChallenge: function (i, target) {
			this.requestNotifications();
			var $pmWindow = $(target).closest('.pm-window');
			var userid = $pmWindow.data('userid');
			var name = $pmWindow.data('name');

			var format = $pmWindow.find('button[name=format]').val();
			var teamIndex = $pmWindow.find('button[name=team]').val();
			var privacy = this.adjustPrivacy($pmWindow.find('input[name=private]').is(':checked'));
			var official = $pmWindow.find('input[name=official]').is(':checked');
			var battleOptions = [];
			var weather = $pmWindow.find('select[name=startingweather]:enabled').val();
			var gimmicks = $pmWindow.find('select[name=gimmicklimit]:enabled').val();
			if (weather) battleOptions.push('weather=' + weather);
			if (gimmicks !== '' && gimmicks !== undefined) battleOptions.push('gimmicks=' + gimmicks);
			var optionsSuffix = battleOptions.length ? ', ' + battleOptions.join(';') : '';

			var bestOf = $pmWindow.find('input[name=bestof]').is(':checked');
			var bestOfValue = $pmWindow.find('input[name=bestofvalue]').val();
			if (bestOf && bestOfValue) {
				var hasCustomRules = format.includes('@@@');
				format += hasCustomRules ? ', ' : '@@@';
				format += 'Best of = ' + bestOfValue;
			}

			var team = null;
			if (Storage.teams[teamIndex]) team = Storage.teams[teamIndex];

			// if it's a custom format, let the user figure it out
			if (window.BattleFormats[format] && !window.BattleFormats[format].team && !team) {
				app.addPopupMessage("You need to go into the Teambuilder and build a team for this format.");
				return;
			}

			var buf = '<form class="battleform pending"><p>Challenging ' + BattleLog.escapeHTML(name) + '...</p>';
			buf += '<p><label class="label">Format:</label>' + this.renderFormats(format, true) + '</p>';
			buf += '<p class="buttonbar"><button name="cancelChallenge" class="button">Cancel</button></p></form>';

			$(target).closest('.challenge').html(buf);
			var pendingForm = $pmWindow.find('.challenge form.pending')[0];
			app.sendTeam(team, function () {
				if (!pendingForm || !$.contains(document, pendingForm)) return;
				app.send(privacy + '/challenge ' + userid + ', ' + format + ', ' + official + optionsSuffix);
			});
		},
		cancelChallenge: function (i, target) {
			var userid = $(target).closest('.pm-window').data('userid');
			$(target).closest('.challenge').remove();
			app.send('/cancelchallenge ' + userid);
		},
		dismissChallenge: function (i, target) {
			var $challenge = $(target).closest('.challenge');
			var pChallenge = $challenge.find('button[name=dismissChallenge]').attr('data-pendingchallenge');
			var $pmWindow = $challenge.closest('.pm-window');
			$challenge.remove();
			if (pChallenge) {
				var pChallengeParts = pChallenge.split('|');
				var name = pChallengeParts[0];
				var oName = pChallengeParts[1];
				var challenge = pChallengeParts.slice(2).join('|');
				this.updateChallenge($pmWindow, challenge, name, oName);
			}
		},
		format: function (format, button) {
			if (window.BattleFormats) app.addPopup(FormatPopup, {format: format, sourceEl: button});
		},
		adjustPrivacy: function (disallowSpectators) {
			Storage.prefs('disallowspectators', disallowSpectators);
			if (disallowSpectators) return '/noreply /hidenext\n';
			var settings = app.user.get('settings');
			return (settings.hiddenNextBattle ? '/noreply /hidenext off\n' : '') + (settings.inviteOnlyNextBattle ? '/noreply /ionext off\n' : '');
		},
		team: function (team, button) {
			var format = $(button).closest('form').find('button[name=format]').val();
			app.addPopup(TeamPopup, {team: team, format: format, sourceEl: button, folderToggleOn: true, folderNotExpanded: []});
		},

		// format/team selection

		curFormat: '',
		renderFormats: function (formatid, noChoice) {
			if (!window.BattleFormats) {
				return '<button class="select formatselect" name="format" disabled value="' + BattleLog.escapeHTML(formatid) + '"><em>Loading...</em></button>';
			}
			if (_.isEmpty(BattleFormats)) {
				return '<button class="select formatselect" name="format" disabled><em>No formats available</em></button>';
			}
			if (!noChoice) {
				this.curFormat = formatid;
				if (!this.curFormat) {
					if (BattleFormats['gen9randombattle']) {
						this.curFormat = 'gen9randombattle';
					} else for (var i in BattleFormats) {
						if (!BattleFormats[i].searchShow || !BattleFormats[i].challengeShow) continue;
						this.curFormat = i;
						break;
					}
				}
				formatid = this.curFormat;
			}
			return '<button class="select formatselect' + (noChoice ? ' preselected' : '') + '" name="format" value="' + formatid + '"' + (noChoice ? ' disabled' : '') + '>' + BattleLog.escapeFormat(formatid) + '</button>';
		},
		curTeamFormat: '',
		curTeamIndex: 0,
		renderTeams: function (formatid, teamIndex) {
			if (Storage.whenTeamsLoaded.error) {
				return '<button class="select teamselect" name="joinRoom" value="teambuilder"><em class="message-error">Error loading teams</em></button>';
			}
			if (!Storage.teams || !window.BattleFormats) {
				return '<button class="select teamselect" name="team" disabled><em>Loading...</em></button>';
			}
			if (!formatid) formatid = this.curFormat;
			var atIndex = formatid.indexOf('@@@');
			if (atIndex >= 0) formatid = formatid.slice(0, atIndex);
			if (!window.BattleFormats[formatid]) {
				return '<button class="select teamselect" name="team" disabled></button>';
			}
			if (window.BattleFormats[formatid].team) {
				return '<button class="select teamselect preselected" name="team" value="random" disabled>' + TeamPopup.renderTeam('random') + '</button>';
			}

			var format = window.BattleFormats[formatid];
			var teamFormat = (format.teambuilderFormat || (format.isTeambuilderFormat ? formatid : false));

			var teams = Storage.teams;
			if (!teams.length) {
				return '<button class="select teamselect" name="team" disabled>You have no teams</button>';
			}
			if (teamIndex === undefined) teamIndex = -1;
			if (teamIndex < 0) {
				if (this.curTeamIndex >= 0) {
					teamIndex = this.curTeamIndex;
				}
				if (this.curTeamFormat !== teamFormat) {
					for (var i = 0; i < teams.length; i++) {
						if (teams[i].format === teamFormat && teams[i].capacity === 6) {
							teamIndex = i;
							break;
						}
					}
				}
			} else {
				teamIndex = +teamIndex;
			}
			return '<button class="select teamselect" name="team" value="' + (teamIndex < 0 ? '' : teamIndex) + '">' + TeamPopup.renderTeam(teamIndex) + '</button>';
		},

		// buttons
		search: function (i, button) {
			if (!window.BattleFormats) return;
			this.requestNotifications();
			var $searchForm = $(button).closest('form');
			if ($searchForm.find('.cancel').length) {
				return;
			}

			if (!app.user.get('named')) {
				app.addPopup(LoginPopup);
				return;
			}

			var $formatButton = $searchForm.find('button[name=format]');
			var $teamButton = $searchForm.find('button[name=team]');
			var $privacyCheckbox = $searchForm.find('input[name=private]');

			var format = $formatButton.val();
			var teamIndex = $teamButton.val();
			var team = null;
			if (Storage.teams[teamIndex]) team = Storage.teams[teamIndex];
			if (!window.BattleFormats[format].team && (teamIndex === '' || !team)) {
				if (Storage.teams) {
					app.addPopupMessage("Please select a team.");
				} else {
					app.addPopupMessage("You need to go into the Teambuilder and build a team for this format.");
				}
				return;
			}

			$formatButton.addClass('preselected')[0].disabled = true;
			$teamButton.addClass('preselected')[0].disabled = true;
			$searchForm.find('button.big').html('<strong><i class="fa fa-refresh fa-spin"></i> Connecting...</strong>').addClass('disabled');
			$searchForm.append('<p class="cancel buttonbar"><button name="cancelSearch" class="button">Cancel</button></p>');

			var self = this;
			app.sendTeam(team, function () {
				self.searchDelay = setTimeout(function () {
					app.send(self.adjustPrivacy($privacyCheckbox.is(':checked')) + '/search ' + format);
				}, 3000);
			});
		},
		cancelSearch: function () {
			clearTimeout(this.searchDelay);
			app.send('/cancelsearch');
			this.searching = false;
			this.updateSearch();
		},
		finduser: function () {
			if (app.isDisconnected) {
				app.addPopupMessage("You are offline.");
				return;
			}
			app.addPopupPrompt("Username", "Open", function (target) {
				if (!target) return;
				if (toID(target) === 'zarel') {
					app.addPopup(Popup, {htmlMessage: "Zarel is very busy; please don't contact him this way. If you're looking for help, try <a href=\"/help\">joining the Help room</a>?"});
					return;
				}
				if (target === '~') {
					app.focusRoom('');
					app.rooms[''].focusPM('~');
					return;
				}
				app.addPopup(UserPopup, {name: target});
			});
		}
	}, {
		parseChatMessage: function (message, name, timestamp, isHighlighted, $chatElem, isNotPM) {
			var showMe = !((Dex.prefs('chatformatting') || {}).hideme);
			var group = ' ';
			if (!/[A-Za-z0-9]/.test(name.charAt(0))) {
				// Backwards compatibility
				group = name.charAt(0);
				name = name.substr(1);
			}
			var color = BattleLog.hashColor(toID(name));
			var clickableName = '<small>' + BattleLog.escapeHTML(group) + '</small><span class="username" data-roomgroup="' + BattleLog.escapeHTML(group) + '" data-name="' + BattleLog.escapeHTML(name) + '">' + BattleLog.escapeHTML(name) + '</span>';
			var hlClass = isHighlighted ? ' highlighted' : '';
			var mineClass = (window.app && app.user && app.user.get('name') === name ? ' mine' : '');

			var cmd = '';
			var target = '';
			if (message.charAt(0) === '/') {
				if (message.charAt(1) === '/') {
					message = message.slice(1);
				} else {
					var spaceIndex = message.indexOf(' ');
					cmd = (spaceIndex >= 0 ? message.slice(1, spaceIndex) : message.slice(1));
					if (spaceIndex >= 0) target = message.slice(spaceIndex + 1);
				}
			}

			switch (cmd) {
			case 'me':
				if (!showMe) return '<div class="chat chatmessage-' + toID(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <em>/me' + BattleLog.parseMessage(' ' + target) + '</em></div>';
				return '<div class="chat chatmessage-' + toID(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">&bull;</strong> <em>' + clickableName + '<i>' + BattleLog.parseMessage(' ' + target) + '</i></em></div>';
			case 'mee':
				if (!showMe) return '<div class="chat chatmessage-' + toID(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <em>/me' + BattleLog.parseMessage(' ' + target).slice(1) + '</em></div>';
				return '<div class="chat chatmessage-' + toID(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">&bull;</strong> <em>' + clickableName + '<i>' + BattleLog.parseMessage(' ' + target).slice(1) + '</i></em></div>';
			case 'invite':
				var roomid = toRoomid(target);
				return [
					'<div class="chat">' + timestamp + '<em>' + clickableName + ' invited you to join the room "' + roomid + '"</em></div>',
					'<div class="notice"><button name="joinRoom" value="' + roomid + '" class="button">Join ' + roomid + '</button></div>'
				];
			case 'announce':
				return '<div class="chat chatmessage-' + toID(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <span class="message-announce">' + BattleLog.parseMessage(target) + '</span></div>';
			case 'log':
				return '<div class="chat chatmessage-' + toID(name) + hlClass + mineClass + '">' + timestamp + '<span class="message-log">' + BattleLog.parseMessage(target) + '</span></div>';
			case 'data-pokemon':
			case 'data-item':
			case 'data-ability':
			case 'data-move':
				return '[outdated message type not supported]';
			case 'text':
				return {message: '<div class="chat">' + BattleLog.parseMessage(target) + '</div>', noNotify: true};
			case 'error':
				return '<div class="chat message-error">' + BattleLog.escapeHTML(target) + '</div>';
			case 'html':
				return {message: '<div class="chat chatmessage-' + toID(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <em>' + BattleLog.sanitizeHTML(target) + '</em></div>', noNotify: isNotPM};
			case 'uhtml':
			case 'uhtmlchange':
				var parts = target.split(',');
				var $elements = $chatElem.find('div.uhtml-' + toID(parts[0]));
				var html = parts.slice(1).join(',');
				if (!html) {
					$elements.remove();
				} else if (!$elements.length) {
					$chatElem.append('<div class="chat uhtml-' + toID(parts[0]) + ' chatmessage-' + toID(name) + '">' + BattleLog.sanitizeHTML(html) + '</div>');
				} else if (cmd === 'uhtmlchange') {
					$elements.html(BattleLog.sanitizeHTML(html));
				} else {
					$elements.remove();
					$chatElem.append('<div class="chat uhtml-' + toID(parts[0]) + ' chatmessage-' + toID(name) + '">' + BattleLog.sanitizeHTML(html) + '</div>');
				}
				return {message: '', noNotify: isNotPM};
			case 'raw':
				return {message: '<div class="chat chatmessage-' + toID(name) + '">' + BattleLog.sanitizeHTML(target) + '</div>', noNotify: isNotPM};
			case 'nonotify':
				return {message: '<div class="chat">' + timestamp + BattleLog.sanitizeHTML(target) + '</div>', noNotify: true};
			case 'challenge':
				return {challenge: target};
			default:
				// Not a command or unsupported. Parsed as a normal chat message.
				if (!name) {
					return '<div class="chat' + hlClass + '">' + timestamp + '<em>' + BattleLog.parseMessage(message) + '</em></div>';
				}
				return '<div class="chat chatmessage-' + toID(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <em>' + BattleLog.parseMessage(message) + '</em></div>';
			}
		}
	});

	var FormatPopup = this.FormatPopup = this.Popup.extend({
		events: {
			'keyup input[name=search]': 'updateSearch',
			'click details': 'updateOpen',
			'click i.fa': 'updateStar',
		},
		initialize: function (data) {
			this.data = data;
			if (!this.open) {
				// todo: maybe make this configurable? not sure since it will cache what users toggle.
				// avoiding that decision for now because it requires either an ugly hack
				// or an overhaul of BattleFormats.
				this.open = Storage.prefs('openformats') || {
					"S/V Singles": true, "S/V Doubles": true, "Unofficial Metagames": true, "National Dex": true, "OM of the Month": true,
					"Other Metagames": true, "Randomized Format Spotlight": true, "RoA Spotlight": true,
				};
			}
			if (!this.starred) this.starred = Storage.prefs('starredformats') || {};
			if (!this.search) this.search = "";
			this.onselect = data.onselect;
			this.selectType = data.selectType;
			if (!this.selectType) this.selectType = (this.sourceEl.closest('form').data('search') ? 'search' : 'challenge');

			var html = '<p><ul class="popupmenu"><li><input name="search" placeholder="Search formats" value="' + this.search + '" class="textbox autofocus" autocomplete="off" />';
			html += '</li></ul></p><span name="formats">';
			html += this.renderFormats();
			html += '</span><div style="clear:left"></div><p></p>';
			this.$el.html(html);
		},
		renderFormats: function () {
			var data = this.data;
			var curFormat = data.format;
			var bufs = [];
			var curBuf = 0;
			if (this.selectType === 'watch' && !this.search) {
				bufs[1] = '<li><button name="selectFormat" value="" class="option' + (curFormat === '' ? ' cur' : '') + '">(All formats)</button></li>';
			}

			for (var i in this.starred) {
				if (!bufs[1]) bufs[1] = '';
				var format = BattleFormats[i];
				if (!format) {
					delete this.starred[i];
					continue;
				}
				if (!this.shouldDisplayFormat(format)) continue;
				if (this.search && !i.includes(toID(this.search))) {
					continue;
				}
				// <i class="fa fa-star"></i>
				var formatName = BattleLog.escapeFormat(BattleFormats[i].id);
				bufs[1] += (
					'<li><button name="selectFormat" value="' + i +
					'" class="option' + (curFormat === i ? ' cur' : '') + '">' + formatName +
					'<i class="fa fa-star" style="float: right; color: #FFD700; text-shadow: 0 0 1px #000;"></i></button></li>'
				);
			}

			var curSection = '';
			var curSubSection = '';
			for (var i in BattleFormats) {
				var format = BattleFormats[i];
				if (!this.shouldDisplayFormat(format)) continue;
				if (this.search && !format.id.includes(toID(this.search))) continue;
				if (this.starred[i]) continue; // only show it in the starred section
				if (format.section && format.section !== curSection) {
					if (curSubSection) bufs[curBuf] += '</details>';
					curSubSection = '';
					if (curSection) bufs[curBuf] += '</details></p>';
					curSection = format.section;
					if (!app.supports['formatColumns']) {
						curBuf = (curSection === 'Doubles' || curSection === 'Past Generations') ? 2 : 1;
					} else {
						curBuf = format.column || 1;
					}
					if (!bufs[curBuf]) {
						bufs[curBuf] = '';
					}
					var open = (this.open[curSection] || toID(this.search)) ? ' open' : '';
					bufs[curBuf] += '<p><details' + open + ' section="' + curSection + '">';
					bufs[curBuf] += '<summary><strong style="color: #579">';
					bufs[curBuf] += BattleLog.escapeHTML(curSection) + '</strong></summary>';
				}
				if (format.subsection && curSubSection !== format.subsection) {
					if (curSubSection) bufs[curBuf] += '</details>';
					curSubSection = format.subsection;
					bufs[curBuf] += '<p><details' + ' subsection="' + curSubSection + '">';
					bufs[curBuf] += '<summary><style="color: #579">';
					bufs[curBuf] += BattleLog.escapeHTML(curSubSection) + '</summary>';
				}
				var formatName = BattleLog.escapeFormat(format.id);
				if (formatName.charAt(0) !== '[') formatName = '[Gen 6] ' + formatName;
				formatName = formatName.replace('[Gen 9] ', '');
				formatName = formatName.replace('[Gen 9 ', '[');
				formatName = formatName.replace('[Gen 8 ', '[');
				formatName = formatName.replace('[Gen 7 ', '[');
				bufs[curBuf] += (
					'<li><button name="selectFormat" value="' + i +
					'" class="option' + (curFormat === i ? ' cur' : '') + '">' + formatName +
					'<i class="fa fa-star subtle" style="float: right;"></i></button></li>'
				);
			}
			var html = '';
			if (bufs.every(function (buf) { return !buf; })) {
				html = '<ul class="popupmenu"><em>No formats found</em></ul>';
			} else {
				for (var i = 1; i < bufs.length; i++) {
					if (!bufs[i]) continue;
					html += '<ul class="popupmenu" style="float:left;padding-left:5px">' + bufs[i] + '</ul>';
				}
			}
			return html;
		},
		update: function () {
			var $formatEl = this.$el.find('span[name=formats]');
			$formatEl.empty();
			$formatEl.html(this.renderFormats());
		},
		updateStar: function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			var format = $(ev.target).parent().attr('value');
			if (this.starred[format]) {
				delete this.starred[format];
			} else {
				this.starred[format] = true;
			}
			Storage.prefs('starredformats', this.starred);
			this.update();
		},
		updateOpen: function (ev) {
			var section = $(ev.currentTarget).attr('section') || $(ev.currentTarget).attr('subsection');
			this.open[section] = !this.open[section];
			Storage.prefs('openformats', this.open);
		},
		updateSearch: function (event) {
			this.search = $(event.currentTarget).val();
			this.update();
		},
		shouldDisplayFormat: function (format) {
			if (this.selectType === 'teambuilder') {
				if (!format.isTeambuilderFormat) return false;
			} else {
				if (format.effectType !== 'Format' || format.battleFormat) return false;
				if (this.selectType != 'watch' && !format[this.selectType + 'Show']) return false;
			}
			return true;
		},
		selectFormat: function (format) {
			if (this.onselect) {
				this.onselect(format);
			} else if (app.rooms[''].curFormat !== format) {
				app.rooms[''].curFormat = format;
				app.rooms[''].curTeamIndex = -1;
				var $teamButton = this.sourceEl.closest('form').find('button[name=team]');
				if ($teamButton.length) $teamButton.replaceWith(app.rooms[''].renderTeams(format));

				var $bestOfCheckbox = this.sourceEl.closest('form').find('input[name=bestof]');
				var $bestOfValueInput = this.sourceEl.closest('form').find('input[name=bestofvalue]');
				if ($bestOfCheckbox && $bestOfValueInput) {
					var $parentTag = $bestOfCheckbox.parent().parent();
					var bestOfDefault = BattleFormats[format] && BattleFormats[format].bestOfDefault;
					if (bestOfDefault) {
						$parentTag.removeClass('hidden');
						$bestOfValueInput.val(3);
					} else {
						$parentTag.addClass('hidden');
						$bestOfCheckbox.prop('checked', false);
					}
				}

				var $partnerLabels = $('label[name=partner]');
				$partnerLabels.each(function (i, label) {
					label.style.display = BattleFormats[format].partner ? '' : 'none';
				});
			}
			this.sourceEl.val(format).html(BattleLog.escapeFormat(format) || '(Select a format)');
			app.rooms[''].refreshChallengeOptions(this.sourceEl.closest('form'));

			this.close();
		}
	});

	var TeamPopup = this.TeamPopup = this.Popup.extend({
		initialize: function (data) {
			var bufs = ['', '', '', '', ''];
			var curBuf = 0;
			var teams = Storage.teams;
			var bufBoundary = 128;
			if (teams.length > 128 && $(window).width() > 1080) {
				bufBoundary = Math.ceil(teams.length / 5);
			} else if (teams.length > 81) {
				bufBoundary = Math.ceil(teams.length / 4);
			} else if (teams.length > 54) {
				bufBoundary = Math.ceil(teams.length / 3);
			} else if (teams.length > 27) {
				bufBoundary = Math.ceil(teams.length / 2);
			}
			this.folderNotExpanded = data.folderNotExpanded || [];
			this.folderToggleOn = data.folderToggleOn;
			var folders = {};
			this.team = data.team;
			this.format = data.format;
			this.room = data.room;
			this.isMoreTeams = data.isMoreTeams || false;
			var format = BattleFormats[data.format];
			if (data.format.includes('@@@')) {
				format = BattleFormats[toID(data.format.split('@@@')[0])];
			}

			var teamFormat = (format.teambuilderFormat || (format.isTeambuilderFormat ? format.id : false));
			this.teamFormat = teamFormat;
			if (!teams.length) {
				bufs[curBuf] = '<li><p><em>You have no teams</em></p></li>';
				bufs[curBuf] += '<li><button name="teambuilder" class="button"><strong>Teambuilder</strong><br />' + BattleLog.escapeFormat(teamFormat) + ' teams</button></li>';
			} else {
				var curTeam = (data.team === '' ? -1 : +data.team);
				var count = 0;
				if (teamFormat) {
					bufs[curBuf] = '<li><h3 style="margin-bottom: 5px;">' + BattleLog.escapeFormat(teamFormat) + ' teams</h3></li>';
					bufs[curBuf] += '<li style="padding-bottom: 5px;"><label class="checkbox"><input type="checkbox"' + (this.folderToggleOn ? ' checked' : '') + '> Group by folders</label></li>';
					for (var i = 0; i < teams.length; i++) {
						if ((!teams[i].format && !teamFormat) || teams[i].format === teamFormat) {
							var selected = (i === curTeam);
							if (!this.folderToggleOn) {
								bufs[curBuf] += '<li><button name="selectTeam" value="' + i + '" class="option' + (selected ? ' cur' : '') + '">' + BattleLog.escapeHTML(teams[i].name) + '</button></li>';
								count++;
								if (count % bufBoundary === 0 && curBuf < 4) curBuf++;
							} else {
								var folderName = teams[i].folder || "";
								if (folderName) {
									if (folders[folderName] === undefined) folders[folderName] = [];
									var thisTeam = teams[i];
									thisTeam.id = i;
									folders[folderName].push(thisTeam);
								}
							}
						}
					}
					if (this.folderToggleOn) {
						for (var key in folders) {
							var folderData = folders[key];
							var exists = false;
							for (var j = 0; j < this.folderNotExpanded.length; j++) {
								if (this.folderNotExpanded[j] === key) {
									exists = true;
									break;
								}
							}
							if (!exists) {
								bufs[curBuf] += '<li><button name="selectFolder" class="button" value="' + key + '"><i class="fa fa-folder-open" style="margin-right: 7px; margin-left: 4px;"></i>' + BattleLog.escapeHTML(key) + '</button></li>';
								count++;
								if (count % bufBoundary === 0 && curBuf < 4) curBuf++;
								for (var j = 0; j < folderData.length; j++) {
									var selected = (folderData[j].id === curTeam);
									bufs[curBuf] += '<li><button name="selectTeam" value="' + folders[key][j].id + '" class="option' + (selected ? ' cur' : '') + '">' + BattleLog.escapeHTML(folderData[j].name) + '</button></li>';
									count++;
									if (count % bufBoundary === 0 && curBuf < 4) curBuf++;
								}
							} else {
								bufs[curBuf] += '<li><button name="selectFolder" class="button" value="' + key + '"><i class="fa fa-folder" style="margin-right: 7px; margin-left: 4px;"></i>' + BattleLog.escapeHTML(key) + '</button></li>';
								count++;
								if (count % bufBoundary === 0 && curBuf < 4) curBuf++;
							}
						}
						var isNoFolder = false;
						for (var i = 0; i < this.folderNotExpanded.length; i++) {
							if (this.folderNotExpanded[i] === "(No Folder)") {
								isNoFolder = true;
								break;
							}
						}
						if (!isNoFolder) {
							bufs[curBuf] += '<li><button name="selectFolder" class="button" value="(No Folder)"><i class="fa fa-folder-open" style="margin-right: 7px; margin-left: 4px;"></i>(No Folder)</button></li>';
						} else {
							bufs[curBuf] += '<li><button name="selectFolder" class="button" value="(No Folder)"><i class="fa fa-folder" style="margin-right: 7px; margin-left: 4px;"></i>(No Folder)</button></li>';
							count++;
							if (count % bufBoundary === 0 && count != 0 && curBuf < 4) curBuf++;
						}
						if (!isNoFolder) {
							for (var i = 0; i < teams.length; i++) {
								if ((!teams[i].format && !teamFormat) || teams[i].format === teamFormat) {
									var selected = (i === curTeam);
									if (teams[i].folder === "") {
										bufs[curBuf] += '<li><button name="selectTeam" value="' + i + '" class="option' + (selected ? ' cur' : '') + '">' + BattleLog.escapeHTML(teams[i].name) + '</button></li>';
										count++;
										if (count % bufBoundary === 0 && curBuf < 4) curBuf++;
									}
								}
							}
						}
					}
					if (!count) bufs[curBuf] += '<li><p><em>You have no ' + BattleLog.escapeFormat(teamFormat) + ' teams</em></p></li>';
					bufs[curBuf] += '<li><button name="teambuilder" class="button"><strong>Teambuilder</strong><br />' + BattleLog.escapeFormat(teamFormat) + ' teams</button></li>';
					bufs[curBuf] += '<li><h3>Other teams</h3></li>';
				} else {
					bufs[curBuf] = '<li><button name="teambuilder" class="button"><strong>Teambuilder</strong></button></li>';
					bufs[curBuf] += '<li><h3>All teams</h3></li>';
					this.isMoreTeams = true;
				}
				if (this.isMoreTeams) {
					for (var i = 0; i < teams.length; i++) {
						if (teamFormat && teams[i].format === teamFormat) continue;
						var selected = (i === curTeam);
						bufs[curBuf] += '<li><button name="selectTeam" value="' + i + '" class="option' + (selected ? ' cur' : '') + '">' + BattleLog.escapeHTML(teams[i].name) + '</button></li>';
						count++;
						if (count % bufBoundary === 0 && curBuf < 4) curBuf++;
					}
				} else {
					bufs[curBuf] += '<li><button name="moreTeams" class="button">Show all teams</button></li>';
				}
			}
			if (format.canUseRandomTeam) {
				bufs[curBuf] += '<li><button value="-1">Random Team</button></li>';
			}

			if (bufs[1]) {
				while (!bufs[bufs.length - 1]) bufs.pop();
				this.$el.html('<ul class="popupmenu" style="float:left">' + bufs.join('</ul><ul class="popupmenu" style="float:left;padding-left:5px">') + '</ul><div style="clear:left"></div>');
			} else {
				this.$el.html('<ul class="popupmenu">' + bufs[0] + '</ul>');
			}
		},
		events: {
			'click input[type=checkbox]': 'foldersToggle',
		},
		moreTeams: function () {
			this.close();
			app.addPopup(TeamPopup, {team: this.team, format: this.format, sourceEl: this.sourceEl, room: this.room, isMoreTeams: true, folderToggleOn: this.folderToggleOn, folderNotExpanded: this.folderNotExpanded});
		},
		teambuilder: function () {
			var teamFormat = this.teamFormat;
			this.close();
			app.joinRoom('teambuilder');
			var teambuilder = app.rooms['teambuilder'];
			if (!teambuilder.exportMode && !teambuilder.curTeam && teamFormat) {
				teambuilder.selectFolder(teamFormat);
			}
		},
		selectFolder: function (key) {
			var keyExists = false;
			var folderNotExpanded = this.folderNotExpanded.filter(function (folder) {
				if (folder === key) {
					keyExists = true;
					return false;
				} else {
					return true;
				}
			});
			if (!keyExists) {
				folderNotExpanded.push(key);
			}
			this.close();
			app.addPopup(TeamPopup, {team: this.team, format: this.format, sourceEl: this.sourceEl, room: this.room, isMoreTeams: this.isMoreTeams, folderToggleOn: this.folderToggleOn, folderNotExpanded: folderNotExpanded});
		},
		foldersToggle: function () {
			this.close();
			app.addPopup(TeamPopup, {team: this.team, format: this.format, sourceEl: this.sourceEl, room: this.room, isMoreTeams: this.isMoreTeams, folderToggleOn: !this.folderToggleOn, folderNotExpanded: this.folderNotExpanded});
		},
		selectTeam: function (i) {
			i = +i;
			this.sourceEl.val(i).html(TeamPopup.renderTeam(i));
			if (this.sourceEl[0].offsetParent.className === 'mainmenuwrapper') {
				var formatid = this.sourceEl.closest('form').find('button[name=format]').val();
				app.rooms[''].curTeamIndex = i;
				app.rooms[''].curTeamFormat = formatid;
			} else if (this.sourceEl[0].offsetParent.className === 'tournament-box active') {
				app.rooms[this.room].tournamentBox.curTeamIndex = i;
			}
			this.close();
		}
	}, {
		renderTeam: function (i) {
			if (i === 'random') {
				var buf = '<strong>Random team</strong><small>';
				for (var i = 0; i < 6; i++) {
					buf += '<span class="picon" style="float:left;' + Dex.getPokemonIcon() + '"></span>';
				}
				buf += '</small>';
				return buf;
			}
			if (i < 0) {
				return '<em>Select a team</em>';
			}
			var team = Storage.teams[i];
			if (!team) return 'Error: Corrupted team';
			var buf = '<strong>' + BattleLog.escapeHTML(team.name) + '</strong><small>';
			buf += Storage.getTeamIcons(team) + '</small>';
			return buf;
		}
	});

	var CustomCalculatorPopup = this.CustomCalculatorPopup = Popup.extend({
		type: 'semimodal',
		className: 'ps-popup custom-calculator',
		events: {'input input': 'scenarioEdited', 'change select': 'scenarioEdited', 'change input': 'scenarioEdited'},
		initialize: function () {
			this.scenarioRevision = 0;
			this.pendingScenario = null;
			this.$el.attr({'role': 'dialog', 'aria-label': 'Custom battle calculator'}).css({width: 'min(1000px, 92vw)', maxHeight: '86vh', overflow: 'auto'});
			this.listenTo(app, 'response:customcalc', this.receiveCalculator);
			this.$el.html('<h2>Custom battle calculator</h2><p class="calc-status" role="status">Loading the connected server\'s engine...</p><button name="close" class="button">Close</button>');
			this.requestCalculator('');
		},
		requestCalculator: function (payload) {
			var self = this;
			clearTimeout(this.calcTimer);
			this.calcTimer = setTimeout(function () { self.$('.calc-status').text('No response. Connect to a server with the custom calculator installed, then reopen this window.'); self.$('button[name=calculate]').prop('disabled', false); self.$el.attr('aria-busy', 'false'); self.$('.calc-status').addClass('calc-error'); }, 18000);
			this.requestId = Date.now().toString(36) + Math.random().toString(36).slice(2);
			app.send('/cmd customcalc ' + this.requestId + (payload ? ' ' + payload : ''));
		},
		remove: function () {
			clearTimeout(this.calcTimer);
			return Popup.prototype.remove.call(this);
		},
		escape: function (value) { return BattleLog.escapeHTML('' + value); },
		scenarioEdited: function () {
			this.scenarioRevision++;
			this.pendingScenario = null;
			this.requestId = null;
			clearTimeout(this.calcTimer);
			this.$el.attr('aria-busy', 'false');
			this.$('button[name=calculate]').prop('disabled', false);
			this.$('.calc-results').empty();
			this.$('.calc-status').removeClass('calc-error').text('Scenario changed. Calculate again for these settings.');
			this.refreshActors();
		},
		refreshActors: function () {
			var self = this;
			this.$('.calc-actor').each(function () {
				var $actor = $(this), species = Dex.species.get($actor.find('[name=species]').val());
				var icon = Dex.getPokemonIcon(species.name).replace(Dex.resourcePrefix + 'sprites/', '/sprites/');
				var html = '<span class="calc-picon" aria-hidden="true" style="' + self.escape(icon) + '"></span><div><strong>' + self.escape(species.exists ? species.name : 'Choose a species') + '</strong><div class="calc-chips">';
				(species.exists ? species.types : []).forEach(function (type) { html += '<span>' + self.escape(type) + '</span>'; });
				html += '<span>' + self.escape($actor.find('[name=ability]').val() || 'Default ability') + '</span></div></div>';
				$actor.find('.calc-identity').html(html);
				var spec = self.readActor(Number($actor.attr('data-slot')));
				var evTotal = Object.keys(spec.evs).reduce(function (total, stat) { return total + spec.evs[stat]; }, 0);
				var stages = Object.keys(spec.boosts).filter(function (stat) { return spec.boosts[stat] !== 0; }).length;
				$actor.find('.calc-advanced > summary').text('Stats, stages & moveset' + (evTotal ? ' | ' + evTotal + ' EVs' : '') + (stages ? ' | ' + stages + ' changed stages' : '') + (spec.moves ? ' | ' + spec.moves.length + ' moves' : ''));
			});
		},
		actorHTML: function (index, label) {
			var buf = '<fieldset class="calc-actor" data-slot="' + index + '"><legend>' + label + '</legend><div class="calc-identity"></div><div class="calc-fields">';
			[['species', 'Species / form', 'Mew'], ['ability', 'Ability', 'No Ability'], ['item', 'Item', ''], ['nature', 'Nature', 'Serious'], ['level', 'Level', '100'], ['hpPercent', 'Current HP %', '100']].forEach(function (f) {
				buf += '<label>' + f[1] + '<input class="textbox" autocomplete="off" list="calc-list-' + f[0] + '" name="' + f[0] + '" value="' + f[2] + '" /></label>';
			});
			buf += '<label>Gender<select name="gender"><option value="">Engine default</option><option value="M">Male</option><option value="F">Female</option><option value="N">Genderless</option></select></label>';
			buf += '<label>Status<select name="status"><option value="">Entry state</option><option value="brn">Burn</option><option value="par">Paralysis</option><option value="psn">Poison</option><option value="tox">Toxic</option><option value="slp">Sleep</option><option value="frz">Freeze</option></select></label>';
			buf += '<label>Activate<select name="gimmick"><option value="">None</option><option value="mega">Mega / Ultra (requires item)</option><option value="tera">Tera</option><option value="gmax">Gigantamax</option></select></label></div>';
			buf += '<details class="calc-advanced"><summary>Stats, stages &amp; moveset</summary><div class="calc-fields"><label>Tera type (engine rules apply)<input class="textbox" name="teraType" value="Stellar" /></label><label>Moveset (comma-separated)<input class="textbox" name="moves" value="" /></label></div><table class="calc-stats"><tr><th>Stat</th><th>EV</th><th>IV</th><th>Stage</th></tr>';
			['hp', 'atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'].forEach(function (stat) {
				buf += '<tr><th>' + stat.toUpperCase() + '</th>';
				['evs', 'ivs', 'boosts'].forEach(function (kind) {
					var applicable = kind === 'boosts' ? stat !== 'hp' : stat !== 'accuracy' && stat !== 'evasion';
					buf += '<td>' + (applicable ? '<input aria-label="' + label + ' ' + stat + ' ' + kind + '" type="number" min="' + (kind === 'boosts' ? -6 : 0) + '" max="' + (kind === 'boosts' ? 6 : kind === 'ivs' ? 31 : 252) + '" name="' + kind + '-' + stat + '" value="' + (kind === 'ivs' ? 31 : 0) + '" />' : '') + '</td>';
				});
				buf += '</tr>';
			});
			buf += '</table></details><details class="calc-set"><summary>Import / export one team set</summary><textarea name="settext" class="textbox" rows="5" aria-label="' + label + ' team set"></textarea><button type="button" class="button" name="importCalcSet" value="' + index + '">Import set</button> <button type="button" class="button" name="exportCalcSet" value="' + index + '">Export set</button></details></fieldset>';
			return buf;
		},
		renderCalculator: function () {
			var self = this;
			var buf = '<header class="calc-header"><div><span class="calc-eyebrow">REBORN · BATTLE TOOLS</span><h2>Damage calculator</h2></div><button name="close" class="button" aria-label="Close calculator">Close</button></header><p class="calc-intro">Your custom engine. One attack, fresh battle entry. <strong>Sampled outcomes, not guaranteed bounds.</strong></p><section class="calc-conditions" aria-label="Battle conditions"><h3>Battle conditions</h3><div class="calc-condition-grid">';
			buf += '<label>Mode / full base field <select name="calc-format" style="max-width:95%">';
			this.metadata.formats.forEach(function (f) { buf += '<option value="' + self.escape(f.id) + '"' + (f.id === 'gen9nofieldsinglesgame' ? ' selected' : '') + '>' + self.escape(f.name) + '</option>'; });
			buf += '</select></label><label>Temporary aura <select name="calc-aura"><option value="">Entry state / none</option>';
			this.metadata.auras.forEach(function (a) { buf += '<option value="' + self.escape(a.id) + '">' + self.escape(a.name) + '</option>'; });
			buf += '</select></label> <label>Weather <select name="calc-weather"><option value="">Entry state / format default</option><option value="raindance">Rain</option><option value="sunnyday">Sun</option><option value="sandstorm">Sandstorm</option><option value="hail">Hail</option></select></label></div>';
			buf += '<p class="calc-screens"><strong>Defender screens</strong> <label><input type="checkbox" name="reflect" /> Reflect</label> <label><input type="checkbox" name="lightscreen" /> Light Screen</label> <label><input type="checkbox" name="auroraveil" /> Aurora Veil</label></p></section>';
			buf += '<div class="calc-matchup">' + this.actorHTML(0, 'Attacker') + this.actorHTML(1, 'Selected defender') + '</div>';
			buf += '<details><summary>Other active slots (used in Doubles / FFA)</summary><p>Doubles: attacker ally and defender ally. FFA: two other foes. Defaults are Mew with No Ability.</p><div class="calc-matchup">' + this.actorHTML(2, 'Slot 3') + this.actorHTML(3, 'Slot 4') + '</div></details>';
			buf += '<section class="calc-action" aria-label="Attack and sampling"><div class="calc-action-fields"><label>Attack <input class="textbox" list="calc-list-move" autocomplete="off" name="calc-move" value="Psychic" /></label> <label>Powered move <select name="calc-powered"><option value="">Normal</option><option value="z">Z-move</option><option value="max">Max move (activate Gmax)</option></select></label><label>Samples <select name="calc-samples"><option>8</option><option selected>32</option><option>64</option></select></label> <label>Seed <input name="calc-seed" type="number" min="1" max="2147483647" value="1"  /></label> </div><button type="button" class="button calc-primary" name="calculate"><strong>Calculate damage</strong></button></section><p class="calc-status" role="status">Choose your sets and attack, then calculate.</p><div class="calc-results" aria-live="polite"></div>';
			buf += '<details><summary>Scenario JSON: save / load</summary><textarea name="calc-json" rows="5" style="width:98%" aria-label="Scenario JSON"></textarea><br /><button type="button" name="exportScenario" class="button">Export scenario</button> <button type="button" name="importScenario" class="button">Import scenario</button></details><details><summary>Assumptions and coverage</summary><ul>';
			this.metadata.assumptions.forEach(function (a) { buf += '<li>' + self.escape(a) + '</li>'; });
			buf += '</ul><p>Custom type rules apply (including this engine\'s Stellar Tera behavior). These are hypothetical sets; this tool does not validate team legality. Delayed and charging moves can show zero damage for this action. Engine log and resolved forms are shown below each result.</p></details>';
			buf += '<p class="calc-version"></p>';
			[['species', window.BattlePokedex], ['ability', window.BattleAbilities], ['item', window.BattleItems], ['move', window.BattleMovedex], ['nature', window.BattleNatures]].forEach(function (entry) {
				buf += '<datalist id="calc-list-' + entry[0] + '">';
				Object.keys(entry[1] || {}).forEach(function (id) { var value = entry[1][id]; buf += '<option value="' + self.escape(value.name || id) + '"></option>'; });
				buf += '</datalist>';
			});
			this.$el.html(buf).css({position: 'fixed', left: '50%', right: 'auto', top: '3vh', bottom: 'auto', transform: 'translateX(-50%)', width: 'min(1000px, 96vw)', maxWidth: '96vw', maxHeight: '90vh', margin: 0});
			this.refreshActors();
			this.$('.calc-version').text('Engine build ' + this.metadata.version.engine + ' — ' + this.metadata.version.builtAt);
		},
		readActor: function (index) {
			var $actor = this.$('.calc-actor[data-slot=' + index + ']');
			var result = {evs: {}, ivs: {}, boosts: {}};
			$actor.find('input,select').each(function () {
				var key = this.name;
				if (key.indexOf('-') >= 0) { var parts = key.split('-'); result[parts[0]][parts[1]] = Number(this.value); } else if (key === 'level' || key === 'hpPercent') result[key] = Number(this.value);
				else if (key === 'moves') { if (this.value.trim()) result.moves = this.value.split(',').map(function (m) { return m.trim(); }); } else result[key] = this.value;
			});
			return result;
		},
		validateActorImport: function (index, actor) {
			if (!actor || typeof actor !== 'object' || Array.isArray(actor)) throw new Error('Expected an actor object.');
			var $actor = this.$('.calc-actor[data-slot=' + index + ']');
			$actor.find('select').each(function () {
				if (actor[this.name] === undefined) return;
				var value = actor[this.name];
				if (typeof value !== 'string' || !Array.from(this.options).some(function (option) { return option.value === value; })) throw new Error('Unsupported ' + this.name + '.');
			});
			['species', 'ability', 'item', 'nature', 'teraType'].forEach(function (key) {
				if (actor[key] !== undefined && typeof actor[key] !== 'string') throw new Error('Invalid ' + key + '.');
			});
			['level', 'hpPercent'].forEach(function (key) {
				if (actor[key] !== undefined && (typeof actor[key] !== 'number' || !Number.isInteger(actor[key]) || actor[key] < 1 || actor[key] > 100)) throw new Error('Invalid ' + key + '.');
			});
			if (actor.moves !== undefined && (!Array.isArray(actor.moves) || actor.moves.length > 4 || actor.moves.some(function (move) { return typeof move !== 'string'; }))) throw new Error('Invalid moveset.');
			['evs', 'ivs', 'boosts'].forEach(function (kind) {
				var values = actor[kind];
				if (values === undefined) return;
				if (!values || typeof values !== 'object' || Array.isArray(values)) throw new Error('Invalid ' + kind + '.');
				Object.keys(values).forEach(function (stat) {
					var input = $actor.find('[name=' + kind + '-' + stat + ']')[0];
					if (!input || typeof values[stat] !== 'number' || !Number.isInteger(values[stat]) || values[stat] < Number(input.min) || values[stat] > Number(input.max)) throw new Error('Invalid ' + kind + ' ' + stat + '.');
				});
			});
		},
		writeActor: function (index, actor) {
			this.validateActorImport(index, actor);
			var $actor = this.$('.calc-actor[data-slot=' + index + ']');
			$actor.find('input,select').each(function () {
				var key = this.name;
				if (key.indexOf('-') >= 0) { var parts = key.split('-'); this.value = actor[parts[0]] && actor[parts[0]][parts[1]] !== undefined ? actor[parts[0]][parts[1]] : parts[0] === 'ivs' ? 31 : 0; } else if (key === 'moves') this.value = (actor.moves || []).join(', ');
				else this.value = actor[key] === undefined ? key === 'level' || key === 'hpPercent' ? 100 : key === 'nature' ? 'Serious' : key === 'teraType' ? 'Stellar' : '' : actor[key];
			});
			this.scenarioEdited();
		},
		scenario: function () {
			var self = this;
			return {format: this.$('[name=calc-format]').val(), move: this.$('[name=calc-move]').val(), aura: this.$('[name=calc-aura]').val(), weather: this.$('[name=calc-weather]').val(), attackMode: this.$('[name=calc-powered]').val(), samples: Number(this.$('[name=calc-samples]').val()), seed: Number(this.$('[name=calc-seed]').val()), actors: [0, 1, 2, 3].map(function (i) { return self.readActor(i); }), screens: ['reflect', 'lightscreen', 'auroraveil'].filter(function (s) { return self.$('[name=' + s + ']').is(':checked'); })};
		},
		calculate: function () {
			this.$('.calc-status').removeClass('calc-error').text('Running isolated engine samples...');
			this.$el.attr('aria-busy', 'true');
			this.$('.calc-results').empty();
			this.$('button[name=calculate]').prop('disabled', true);
			var snapshot = JSON.stringify(this.scenario());
			this.pendingScenario = Object.freeze({json: snapshot, revision: this.scenarioRevision});
			this.requestCalculator(snapshot);
		},
		importCalcSet: function (index) {
			var text = this.$('.calc-actor[data-slot=' + index + '] textarea').val();
			try {
				var sets = Storage.importTeam(text);
				if (!sets || sets.length !== 1) throw new Error('Paste exactly one team set.');
				this.writeActor(index, sets[0]);
				if (Number(index) === 0 && sets[0].moves.length) this.$('[name=calc-move]').val(sets[0].moves[0]);
			} catch (e) { this.$('.calc-status').text(e.message); }
		},
		exportCalcSet: function (index) {
			var actor = this.readActor(index);
			actor.moves = actor.moves || [Number(index) ? 'Splash' : this.$('[name=calc-move]').val()];
			this.$('.calc-actor[data-slot=' + index + '] textarea').val(Storage.exportTeam([actor]));
		},
		exportScenario: function () { this.$('[name=calc-json]').val(JSON.stringify(this.scenario(), null, 2)); },
		importScenario: function () {
			try {
				var data = JSON.parse(this.$('[name=calc-json]').val());
				if (!data || !Array.isArray(data.actors) || data.actors.length !== 4) throw new Error('Expected four actor slots.');
				var self = this;
				var allowed = ['format', 'move', 'aura', 'weather', 'samples', 'seed', 'attackMode', 'screens', 'actors'];
				if (Object.keys(data).some(function (key) { return allowed.indexOf(key) < 0; })) throw new Error('Unsupported scenario field.');
				for (var i = 0; i < 4; i++) this.validateActorImport(i, data.actors[i]);
				var defaults = {aura: '', weather: '', samples: 32, seed: 1, attackMode: '', screens: []};
				Object.keys(defaults).forEach(function (key) { if (data[key] === undefined) data[key] = defaults[key]; });
				['format', 'aura', 'weather', 'samples', 'attackMode'].forEach(function (key) {
					var select = self.$('[name=calc-' + (key === 'attackMode' ? 'powered' : key) + ']')[0];
					if (typeof data[key] !== (key === 'samples' ? 'number' : 'string') || !Array.from(select.options).some(function (option) { return option.value === '' + data[key]; })) throw new Error('Unsupported ' + key + '.');
				});
				if (typeof data.move !== 'string' || !data.move.trim()) throw new Error('Expected an attack.');
				if (!Number.isInteger(data.seed) || data.seed < 1 || data.seed > 2147483647) throw new Error('Invalid seed.');
				if (!Array.isArray(data.screens) || data.screens.some(function (key) { return ['reflect', 'lightscreen', 'auroraveil'].indexOf(key) < 0; })) throw new Error('Unsupported screens.');
				// Commit only after every slot and control can be represented without loss.
				for (var i = 0; i < 4; i++) this.writeActor(i, data.actors[i]);
				['format', 'move', 'aura', 'weather', 'samples', 'seed'].forEach(function (key) { self.$('[name=calc-' + key + ']').val(data[key]); });
				this.$('[name=calc-powered]').val(data.attackMode);
				['reflect', 'lightscreen', 'auroraveil'].forEach(function (key) { self.$('[name=' + key + ']').prop('checked', data.screens.indexOf(key) >= 0); });
				this.$('.calc-status').text('Scenario loaded. Calculate to validate it against the current engine.');
			} catch (e) { this.$('.calc-status').text('Invalid scenario: ' + e.message); }
		},

		receiveCalculator: function (data) {
			if (!this.requestId || (data && data.requestId && data.requestId !== this.requestId)) return;
			if (this.pendingScenario && (this.pendingScenario.revision !== this.scenarioRevision ||
				this.pendingScenario.json !== JSON.stringify(this.scenario()))) {
				this.scenarioEdited();
				return;
			}
			clearTimeout(this.calcTimer);
			this.$('button[name=calculate]').prop('disabled', false);
			this.$el.attr('aria-busy', 'false');
			if (!data || data.error) { this.$('.calc-status').addClass('calc-error').text(data && data.error || 'This server does not support the custom calculator.'); return; }
			if (data.formats) { this.metadata = data; this.renderCalculator(); return; }
			if (!this.pendingScenario) return;
			var self = this;
			this.$('.calc-status').text(data.samples + ' reproducible samples, seed ' + data.seed + '. Observed outcomes only; unobserved extremes remain possible.');
			this.$('.calc-version').text('Engine build ' + data.version.engine + ' — ' + data.version.builtAt);
			var main = data.results[1];
			var html = '<div class="calc-result-card"><span class="calc-eyebrow">SELECTED DEFENDER · OBSERVED RANGE</span><div class="calc-result-head"><h3>' + this.escape(data.move) + '</h3><strong>' + main.minPercent.toFixed(1) + '–' + main.maxPercent.toFixed(1) + '%</strong></div><p>' + main.min + '–' + main.max + ' HP removed · Observed KOs: ' + main.kos + '/' + data.samples + ' samples</p><div class="calc-damage-bar" role="img" aria-label="Observed damage ' + main.minPercent.toFixed(1) + ' to ' + main.maxPercent.toFixed(1) + ' percent of maximum HP"><span style="width:' + Math.min(100, main.maxPercent) + '%"></span><b style="width:' + Math.min(100, main.minPercent) + '%"></b></div><small>Bar shows HP removed as a share of max HP. Unobserved extremes remain possible.</small></div><h3>' + this.escape(data.move) + ' — observed damage</h3><div style="overflow:auto"><table class="calc-result-table"><tr><th>Slot</th><th>HP removed</th><th>% max HP</th><th>Net HP loss</th><th>Observed KO frequency</th></tr>';
			data.results.forEach(function (r) { html += '<tr><th>' + self.escape(r.label) + '</th><td>' + r.min + '–' + r.max + '</td><td>' + r.minPercent.toFixed(1) + '–' + r.maxPercent.toFixed(1) + '%</td><td>' + r.minNetLoss + '–' + r.maxNetLoss + '</td><td>' + r.kos + '/' + data.samples + ' (' + (100 * r.kos / data.samples).toFixed(1) + '%)</td></tr>'; });
			html += '</table></div><p>No guaranteed KO / 2HKO claim is made from sampled results.</p><details><summary>Resolved engine state and first sample log</summary><pre style="white-space:pre-wrap">' + this.escape(JSON.stringify(data.resolved, null, 2)) + '\n' + this.escape(data.exampleLog.join('\n')) + '</pre></details>';
			this.$('.calc-results').html(html);
		}
	});

}).call(this, jQuery);
