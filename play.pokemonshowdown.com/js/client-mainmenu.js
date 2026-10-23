(function ($) {

	this.MainMenuRoom = this.Room.extend({
		type: 'mainmenu',
		openPublicFieldGuide: function () { window.openPublicFieldGuide(); },
		openRulesEncyclopedia: function () { window.openRulesEncyclopedia(); },
		customCalculator: function () { if (!app.rooms.calculator) app.addRoom('calculator', CustomCalculatorRoom, true, 'Calculator'); app.focusRoom('calculator'); app.topbar.updateTabbar(); },
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
			this.listenTo(app, 'response:interactiontest', function (data) { if (data && data.open) window.openInteractionTest(); });
			this.listenTo(app, 'response:customrules', function (data) { if (data && data.open) window.openRulesEncyclopedia(); });
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
			buf += '<p><button class="button mainmenu3" name="customCalculator">Custom calculator</button></p><p><button class="button mainmenu3" name="openPublicFieldGuide">Field Guide</button></p>';

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
				buf += group + BattleLog.accountName(name.substr(1)) + '</h3>';
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
					buf += '<div><a href="/' + toRoomid(roomid) + '" class="blocklink" style="text-align: center">' + (roomid.startsWith('battle-') ? BattleLog.battleTitle(name) : BattleLog.escapeHTML(name)) + '</a></div>';
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
			buf += '<details class="challenge-options"><summary>Battle options</summary><p><label>Weather: <select name="startingweather" disabled><option value="">Format default</option><option value="raindance">Rain</option><option value="sunnyday">Sun</option><option value="sandstorm">Sandstorm</option><option value="hail">Hail</option></select></label><small class="weather-reason">Checking format support…</small></p>';
			buf += '<p><label>Gimmicks / trainer: <select name="gimmicklimit" disabled><option value="">Format default</option><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></label><small class="gimmicks-reason">Checking format support…</small></p><p><small>Gen 9 · Same allowance for every trainer. Format bans and caps apply.</small></p></details>';
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
			$form.find('.weather-reason, .gimmicks-reason').text('Checking support…');
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
					var hint = reason;
					if (reason.indexOf('random field') >= 0) hint = 'Unavailable on a random field. Choose a fixed field.';
					else if (reason.indexOf('Gen 9') >= 0) hint = 'Gen 9 only.';
					else if (reason.indexOf('Multi 1v2') >= 0) hint = 'Unavailable in solo Multi 1v2.';
					$form.find('.' + key + '-reason').attr('title', reason).text(hint || (key === 'weather' ? 'Normal duration; can change.' : '0–2 shared uses per trainer; existing mechanic bans still apply.'));
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
			var clickableName = '<small>' + BattleLog.escapeHTML(group) + '</small><span class="username" data-roomgroup="' + BattleLog.escapeHTML(group) + '" data-name="' + BattleLog.escapeHTML(name) + '">' + BattleLog.accountName(name) + '</span>';
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
		type: 'modal',
		className: 'ps-popup custom-calculator',
		events: {'input input': 'scenarioEdited', 'change select': 'scenarioEdited', 'change input': 'scenarioEdited', 'input [name=species]': 'searchSpecies', 'input [name=calc-field-search]': 'searchFields', 'change [name=calc-mode]': 'changeMode', 'change .calc-saved-set': 'loadCalcSavedSet'},
		initialize: function () {
			this.scenarioRevision = 0;
			this.pendingScenario = null;
			this.$el.attr({'role': 'dialog', 'aria-label': 'Custom battle calculator'}).css({width: 'min(1000px, 92vw)', maxHeight: '86vh', overflow: 'auto'});
			this.listenTo(app, 'response:customcalc', this.receiveCalculator);
			this.$el.html('<h2>Custom battle calculator</h2><p class="calc-status" role="status">Loading the connected server\'s engine...</p><button name="retryCalculator" class="button">Retry connection</button> <button name="close" class="button">Close</button>');
			this.requestCalculator('');
		},
		requestCalculator: function (payload) {
			this.calculatorLastSentAt = Date.now();
			var self = this;
			clearTimeout(this.calcTimer);
			this.calcTimer = setTimeout(function () { self.$('.calc-status').text('No response. Connect to a server with the custom calculator installed, then use Retry connection.'); self.$('button[name=calculate]').prop('disabled', false); self.$el.attr('aria-busy', 'false'); self.$('.calc-status').addClass('calc-error'); }, 18000);
			this.requestId = Date.now().toString(36) + Math.random().toString(36).slice(2);
			app.send('/cmd customcalc ' + this.requestId + (payload ? ' ' + payload : ''));
		},
		remove: function () {
			clearTimeout(this.calcTimer);
			return Popup.prototype.remove.call(this);
		},
		escape: function (value) { return BattleLog.escapeHTML('' + value); },
		scenarioEdited: function (event) {
			if (event && $(event.target).hasClass('calc-form-choice')) return;
			this.scenarioRevision++;
			this.pendingScenario = null;
			this.requestId = null;
			clearTimeout(this.calcTimer);
			this.$el.attr('aria-busy', 'false');
			this.$('button[name=calculate]').prop('disabled', false);
			this.$('.calc-results').empty();
			this.$('.calc-status').removeClass('calc-error').text('Settings changed. Calculate again.');
			this.refreshActors();
			this.refreshCalcMoves();
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
				var info = (self.metadata.species || []).find(function (p) { return toID(p.name) === species.id; });
				var slots = '';
				Object.keys(info ? info.abilities : {}).forEach(function (slot) { var name = info.abilities[slot]; slots += '<button type="button" class="button" name="chooseAbility" value="' + $actor.attr('data-slot') + ':' + self.escape(name) + '">' + self.escape(slot === 'H' ? 'Hidden' : slot === 'S' ? 'Special' : 'Slot ' + (Number(slot) + 1)) + ': ' + self.escape(name) + '</button> '; });
				$actor.find('.calc-ability-slots').html(slots);
				$actor.find('.calc-passives').remove();
				if (info && info.passives && info.passives.length) $actor.find('.calc-identity').append('<div class="calc-passives"><b>Passives:</b> ' + info.passives.map(function (id) { return self.escape(Dex.abilities.get(id).name); }).join(' · ') + '</div>');
				var parts = (self.metadata.abilityComponents || {})[toID($actor.find('[name=ability]').val())] || [];
				if (species.baseSpecies === 'Silvally' && toID($actor.find('[name=ability]').val()) === 'rkssystem') {
					var memories = self.metadata.rksSystemMemoryAbilities || {};
					parts = (memories[toID($actor.find('[name=item]').val())] || memories[''] || []).map(function (id) { return Dex.abilities.get(id).name; });
				}
				if (info && toID(info.name) === 'pidgeotmega' && toID($actor.find('[name=ability]').val()) === 'stormsovereign') {
					parts = parts.filter(function (part) { return toID(part) !== 'galewings' && toID(part) !== 'noguard'; });
				}
				$actor.find('.calc-component-details').toggle(!!parts.length);
				$actor.find('.calc-components').text(parts.length ? 'Components: ' + parts.join(' · ') + '. Each effect has its own conditions.' : 'No composite components listed.');
				if (species.baseSpecies === 'Silvally' && toID($actor.find('[name=ability]').val()) === 'rkssystem') $actor.find('.calc-components').append(' Heals 1/16 HP each turn.');
				var spec = self.readActor(Number($actor.attr('data-slot')));
				var evTotal = Object.keys(spec.evs).reduce(function (total, stat) { return total + spec.evs[stat]; }, 0);
				var stages = Object.keys(spec.boosts).filter(function (stat) { return spec.boosts[stat] !== 0; }).length;
				$actor.find('.calc-advanced > summary').text('Stats, stages & moveset' + (evTotal ? ' | ' + evTotal + ' EVs' : '') + (stages ? ' | ' + stages + ' changed stages' : '') + (spec.moves ? ' | ' + spec.moves.length + ' moves' : ''));
			});
		},
		searchFields: function () {
			var q = toID(this.$('[name=calc-field-search]').val());
			this.$('[name=calc-field] option').each(function () { this.hidden = !!q && toID(this.text).indexOf(q) < 0; });
		},
		changeMode: function () {
			var mode = this.$('[name=calc-mode]').val();
			var f = this.metadata.formats.find(function (f) { return f.mode === mode && !f.field; }) || this.metadata.formats.find(function (f) { return f.mode === mode; });
			this.$('[name=calc-format]').val(f.id);
			this.scenarioEdited();
		},
		searchSpecies: function (e) {
			var self = this, $actor = $(e.target).closest('.calc-actor'), q = toID(e.target.value), index = $actor.attr('data-slot');
			var matches = (this.metadata.species || []).filter(function (p) { return q && toID(p.name).indexOf(q) >= 0; }).slice(0, 12);
			$actor.find('.calc-species-results').html(matches.map(function (p) { return '<button type="button" class="button" name="chooseSpecies" value="' + index + ':' + self.escape(p.name) + '">' + self.escape(p.name) + '</button>'; }).join(' ') || 'No matching Pokémon.');
			this.scenarioEdited();
		},
		chooseSpecies: function (value) {
			var parts = value.split(':'), $actor = this.$('.calc-actor[data-slot=' + parts[0] + ']');
			var species = this.metadata.species.find(function (p) { return p.name === parts[1]; });
			$actor.find('[name=species]').val(species.name);
			$actor.find('[name=ability]').val(species.abilities['0']);
			$actor.find('.calc-species-results').empty();
			this.scenarioEdited();
		},
		chooseAbility: function (value) {
			var parts = value.split(':'); this.$('.calc-actor[data-slot=' + parts[0] + '] [name=ability]').val(parts[1]); this.scenarioEdited();
		},

		retryCalculator: function () { this.pendingScenario = null; this.$('.calc-status').removeClass('calc-error').text('Connecting…'); this.requestCalculator(''); },

		acceptTeamBuilderSet: function () {
			var pending = app.pendingCalculatorSet; if (!pending) return;
			try { this.writeActor(pending.slot, pending.set); if (pending.slot === 0 && pending.set.moves && pending.set.moves.length) this.$('[name=calc-move]').val(pending.set.moves[0]); this.scenarioEdited(); app.pendingCalculatorSet = null; this.$('.calc-status').text('Loaded ' + pending.set.species + ' from Team Builder. Choose the matchup and calculate.'); } catch (err) { this.$('.calc-status').addClass('calc-error').text(err.message); }
		},
		renderResolvedSummary: function (resolved) {
			if (!resolved) return '';
			var self = this, html = '<div class="calc-resolved"><strong>Engine setup · first sample, before the attack</strong><p>';
			[['Field', resolved.field], ['Aura', resolved.aura], ['Weather', resolved.weather]].forEach(function (entry) {
				var value = entry[1], list = entry[0] === 'Field' ? self.metadata.fields : entry[0] === 'Aura' ? self.metadata.auras : [];
				var named = (list || []).find(function (x) { return x.id === value; }); html += self.escape(entry[0]) + ': ' + self.escape(named ? named.name : value || 'None') + ' · ';
			});
			html += '</p><ul>'; (resolved.actors || []).slice(0, 2).forEach(function (actor, index) { html += '<li>' + (index ? 'Defender' : 'Attacker') + ': <b>' + self.escape(actor.species) + '</b> · ' + self.escape(actor.ability) + (actor.passives && actor.passives.length ? '<br />Passives: ' + actor.passives.map(function (id) { return self.escape(Dex.abilities.get(id).name); }).join(' · ') : '') + (actor.item ? ' · ' + self.escape(actor.item) : '') + '</li>'; }); return html + '</ul></div>';
		},
		populateCalcSets: function () {
			var self = this; this.savedCalcSets = [];
			(Storage.teams || []).forEach(function (team) {
				if (team.teamid && !team.loaded) return;
				(Storage.unpackTeam(team.team) || []).forEach(function (set) { self.savedCalcSets.push({name: team.name + ' — ' + (set.name || set.species), set: set}); });
			});
			var library = Storage.prefs('pokemontools') || {};
			(library.builds || []).forEach(function (build) { self.savedCalcSets.push({name: 'Saved set: ' + build.name + ' — ' + build.set.species, set: build.set}); });
			var html = '<option value="">Choose a saved Pokémon…</option>';
			this.savedCalcSets.forEach(function (entry, i) { html += '<option value="' + i + '">' + self.escape(entry.name) + '</option>'; });
			this.$('.calc-saved-set').html(html).prop('disabled', !this.savedCalcSets.length);
		},
		loadCalcSavedSet: function (event) {
			if (event.currentTarget.value === '') return;
			var entry = this.savedCalcSets[Number(event.currentTarget.value)], slot = Number($(event.currentTarget).attr('data-slot'));
			if (!entry) return;
			try { this.writeActor(slot, entry.set); if (slot === 0 && entry.set.moves && entry.set.moves.length) this.$('[name=calc-move]').val(entry.set.moves[0]); this.scenarioEdited(); } catch (err) { this.$('.calc-status').addClass('calc-error').text(err.message); }
		},
		refreshCalcMoves: function () {
			var self = this, actor = this.readActor(0), moves = actor.moves || [];
			this.$('.calc-move-shortcuts').html(moves.map(function (move) { return '<button class="button" name="chooseCalcMove" value="' + self.escape(move) + '">' + self.escape(move) + '</button>'; }).join(' '));
		},
		chooseCalcMove: function (move) { this.$('[name=calc-move]').val(move); this.scenarioEdited(); },
		swapCalcActors: function () {
			try {
				var attacker = this.readActor(0), defender = this.readActor(1);
				this.validateActorImport(0, defender); this.validateActorImport(1, attacker);
				this.writeActor(0, defender); this.writeActor(1, attacker);
				this.$('[name=calc-move]').val(defender.moves && defender.moves[0] || '');
				this.$('.calc-saved-set').val('');
				this.$('[name=reflect], [name=lightscreen], [name=auroraveil], .calc-side-controls [data-condition=reflect], .calc-side-controls [data-condition=lightscreen], .calc-side-controls [data-condition=auroraveil]').prop('checked', false);
				this.scenarioEdited(); this.$('.calc-status').text('Pokémon swapped. Screens cleared on both sides; other side conditions stay on their field sides. Choose the new attacker’s move.');
			} catch (err) { this.$('.calc-status').addClass('calc-error').text(err.message); }
		},
		validateCalcInputs: function () {
			var mode = this.$('[name=calc-mode]').val(), count = mode === 'singles' ? 2 : 4;
			for (var i = 0; i < count; i++) {
				var actor = this.readActor(i), label = i === 0 ? 'Attacker' : i === 1 ? 'Defender' : 'Slot ' + (i + 1);
				this.validateActorImport(i, actor);
				if (!Dex.species.get(actor.species).exists) throw new Error(label + ': choose a valid Pokémon.');
				if (actor.ability && !Dex.abilities.get(actor.ability).exists) throw new Error(label + ': choose a valid ability.');
				if (actor.item && !Dex.items.get(actor.item).exists) throw new Error(label + ': choose a valid item.');
			}
			if (!Dex.moves.get(this.$('[name=calc-move]').val()).exists) throw new Error('Choose a valid attack before calculating.');
		},
		actorHTML: function (index, label) {
			var buf = '<fieldset class="calc-actor" data-slot="' + index + '"><legend>' + label + '</legend><div class="calc-identity"></div><div class="calc-species-results" aria-live="polite"></div><div class="calc-ability-slots" aria-label="Species ability slots"></div><details class="calc-component-details"><summary>Ability details</summary><p class="calc-components"></p></details><div class="calc-fields">';
			[['species', 'Pokémon', 'Mew'], ['ability', 'Ability', 'No Ability'], ['item', 'Item', ''], ['nature', 'Nature', 'Serious'], ['level', 'Level', '100'], ['hpPercent', 'Current HP %', '100'], ['rageFistBonus', 'Rage Fist bonus (0–100)', '0']].forEach(function (f) {
				buf += '<label>' + f[1] + '<input class="textbox" autocomplete="off" list="calc-list-' + f[0] + '" name="' + f[0] + '" value="' + f[2] + '" /></label>';
			});
			[['threadShelterGuard', 'Thread Shelter guard ready'], ['silentFlightSpent', 'Silent Flight protection already used'], ['buriedTrioSpent', 'Buried Trio already used'], ['elasticBellySpent', 'Elastic Belly already used'], ['feedbackMarked', 'Marked by active Feedback foe']].forEach(function (f) {
				buf += '<label>' + f[1] + '<select name="' + f[0] + '"><option value="false">No</option><option value="true">Yes</option></select></label>';
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
			var buf = '<header class="calc-header"><div><span class="calc-eyebrow">REBORN · BATTLE TOOLS</span><h2>Damage calculator</h2></div><button name="close" class="button" aria-label="Close calculator">Close</button></header><p class="calc-intro">1. Choose two Pokémon or load saved sets. 2. Choose a move. 3. Calculate. <strong>Sampled results, not guaranteed limits.</strong></p><section class="calc-conditions" aria-label="Battle conditions"><h3>Battle conditions</h3><div class="calc-condition-grid">';
			buf += '<label hidden><span hidden>Engine rules<select name="calc-format">';
			this.metadata.formats.forEach(function (f) { buf += '<option value="' + self.escape(f.id) + '"' + (f.id === 'gen9nofieldsinglesgame' ? ' selected' : '') + '>' + self.escape(f.name) + '</option>'; });
			buf += '</select></span></label><label>Battle mode<select name="calc-mode"><option value="singles">Singles</option><option value="doubles">Doubles</option><option value="freeforall">FFA · 4 trainers</option></select></label><label>Find a field<input class="textbox" name="calc-field-search" placeholder="Search all fields" autocomplete="off" /></label><label>Starting field<select name="calc-field">';
			(this.metadata.fields || []).forEach(function (f) { buf += '<option value="' + self.escape(f.id) + '">' + self.escape(f.name) + '</option>'; });
			buf += '</select></label><label>Temporary aura <select name="calc-aura"><option value="">Entry state / none</option>';
			this.metadata.auras.forEach(function (a) { buf += '<option value="' + self.escape(a.id) + '">' + self.escape(a.name) + '</option>'; });
			buf += '</select></label> <label>Weather <select name="calc-weather"><option value="">Entry state / format default</option><option value="raindance">Rain</option><option value="sunnyday">Sun</option><option value="sandstorm">Sandstorm</option><option value="hail">Hail</option></select></label></div>';
			buf += '<p class="calc-screens"><strong>Defender screens</strong> <label><input type="checkbox" name="reflect" /> Reflect</label> <label><input type="checkbox" name="lightscreen" /> Light Screen</label> <label><input type="checkbox" name="auroraveil" /> Aurora Veil</label></p></section>';
			buf += '<div class="calc-matchup">' + this.actorHTML(0, 'Attacker') + this.actorHTML(1, 'Defender') + '</div>';
			buf += '<details><summary>Allies / other players</summary><p>Doubles: attacker ally and defender ally. FFA: two other foes. Defaults are Mew with No Ability.</p><div class="calc-matchup">' + this.actorHTML(2, 'Slot 3') + this.actorHTML(3, 'Slot 4') + '</div></details>';
			buf += '<section class="calc-action" aria-label="Attack and sampling"><div class="calc-action-fields"><label>Move <input class="textbox" list="calc-list-move" autocomplete="off" name="calc-move" value="Psychic" /></label> <label>Powered move <select name="calc-powered"><option value="">Normal</option><option value="z">Z-move</option><option value="max">Max move (activate Gmax)</option></select></label><details class="calc-sampling"><summary>Advanced sampling</summary><label>Samples <select name="calc-samples"><option>8</option><option selected>32</option><option>64</option></select></label> <label>Seed <input name="calc-seed" type="number" min="1" max="2147483647" value="1"  /></label></details> </div><button type="button" class="button calc-primary" name="calculate"><strong>Calculate damage</strong></button></section><p class="calc-status" role="status">Choose Pokémon and a move, then calculate.</p><div class="calc-results" aria-live="polite"></div>';
			buf += '<details><summary>Save / load setup</summary><textarea name="calc-json" rows="5" style="width:98%" aria-label="Scenario JSON"></textarea><br /><button type="button" name="exportScenario" class="button">Export scenario</button> <button type="button" name="importScenario" class="button">Import scenario</button></details><details><summary>How results work</summary><ul>';
			this.metadata.assumptions.forEach(function (a) { buf += '<li>' + self.escape(a) + '</li>'; });
			buf += '</ul><p>Custom type rules apply (including this engine\'s Stellar Tera behavior). These are hypothetical sets; this tool does not validate team legality. Delayed and charging moves can show zero damage for this action. Engine log and resolved forms are shown below each result.</p></details>';
			buf += '<p class="calc-version"></p>';
			[['species', window.BattlePokedex], ['ability', window.BattleAbilities], ['item', window.BattleItems], ['move', window.BattleMovedex], ['nature', window.BattleNatures]].forEach(function (entry) {
				buf += '<datalist id="calc-list-' + entry[0] + '">';
				Object.keys(entry[1] || {}).forEach(function (id) { var value = entry[1][id]; buf += '<option value="' + self.escape(value.name || id) + '"></option>'; });
				buf += '</datalist>';
			});
			this.$el.html(buf).css({position: 'fixed', left: '50%', right: 'auto', top: '3vh', bottom: 'auto', transform: 'translateX(-50%)', width: 'min(1000px, 96vw)', maxWidth: '96vw', maxHeight: '90vh', margin: 0});
			this.$('.calc-action').insertAfter(this.$('.calc-matchup').first());
			this.$('.calc-status, .calc-results').insertAfter(this.$('.calc-action'));
			this.$('.calc-action-fields').before('<div class="calc-move-shortcuts" aria-label="Moves from attacker set"></div>');
			this.$('.calc-matchup').first().before('<p>' + '<button class="button" name="swapCalcActors">Swap attacker / defender</button></p>');
			this.$('.calc-actor').each(function () {
				var slot = $(this).attr('data-slot');
				$(this).find('.calc-identity').after('<div class="calc-load-set"><label>Load saved Pokémon <select class="calc-saved-set" data-slot="' + slot + '"><option value="">Choose from your teams or saved sets…</option></select></label></div>');
			});
			this.populateCalcSets();
			this.refreshActors();
			this.refreshCalcMoves();
			if (this.workspace) {
				this.$el.removeAttr('style');
				var draft = app.calculatorDraft;
				if (draft) { this.$('[name=calc-json]').val(draft); this.importScenario(); }
				if (app.calculatorInputs) {
					this.$('input,select,textarea').each(function (i) { var slot = $(this).closest('.calc-actor').attr('data-slot') || ''; var saved = app.calculatorInputs.find(function (entry) { return entry.name === this.name && entry.slot === slot; }, this); if (saved && this.name) { this.value = saved.value; this.checked = saved.checked; } });
					this.refreshActors(); this.refreshCalcMoves();
					this.$('.calc-status').text('Draft restored. Calculate when ready.');
				}
			}
			this.acceptTeamBuilderSet();
			this.$('.calc-version').text('Engine build ' + this.metadata.version.engine + ' — ' + this.metadata.version.builtAt);
		},
		readActor: function (index) {
			var $actor = this.$('.calc-actor[data-slot=' + index + ']');
			var result = {evs: {}, ivs: {}, boosts: {}};
			$actor.find('input,select').each(function () {
				var key = this.name; if (!key) return;
				if (key.indexOf('-') >= 0) { var parts = key.split('-'); result[parts[0]][parts[1]] = Number(this.value); } else if (key === 'level' || key === 'hpPercent' || key === 'rageFistBonus') result[key] = Number(this.value);
				else if (["threadShelterGuard", "silentFlightSpent", "buriedTrioSpent", "elasticBellySpent", "feedbackMarked"].includes(key)) result[key] = this.value === 'true';
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
				if (['threadShelterGuard', 'silentFlightSpent', 'buriedTrioSpent', 'elasticBellySpent', 'feedbackMarked'].includes(this.name)) { if (typeof value !== 'boolean') throw new Error('Invalid ' + this.name + '.'); return; }
				if (typeof value !== 'string' || !Array.from(this.options).some(function (option) { return option.value === value; })) throw new Error('Unsupported ' + this.name + '.');
			});
			['species', 'ability', 'item', 'nature', 'teraType'].forEach(function (key) {
				if (actor[key] !== undefined && typeof actor[key] !== 'string') throw new Error('Invalid ' + key + '.');
			});
			['level', 'hpPercent'].forEach(function (key) {
				if (actor[key] !== undefined && (typeof actor[key] !== 'number' || !Number.isInteger(actor[key]) || actor[key] < 1 || actor[key] > 100)) throw new Error('Invalid ' + key + '.');
			});
			if (actor.rageFistBonus !== undefined && (typeof actor.rageFistBonus !== 'number' || !Number.isFinite(actor.rageFistBonus) || actor.rageFistBonus < 0 || actor.rageFistBonus > 100)) throw new Error('Invalid Rage Fist bonus.');
			["threadShelterGuard", "silentFlightSpent", "buriedTrioSpent", "elasticBellySpent", "feedbackMarked"].forEach(function (key) { if (actor[key] !== undefined && typeof actor[key] !== 'boolean') throw new Error('Invalid ' + key + '.'); });
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
				var key = this.name; if (!key) return;
				if (key.indexOf('-') >= 0) { var parts = key.split('-'); this.value = actor[parts[0]] && actor[parts[0]][parts[1]] !== undefined ? actor[parts[0]][parts[1]] : parts[0] === 'ivs' ? 31 : 0; } else if (key === 'moves') this.value = (actor.moves || []).join(', ');
				else this.value = actor[key] === undefined ? key === 'level' || key === 'hpPercent' ? 100 : key === 'rageFistBonus' ? 0 : ['threadShelterGuard', 'silentFlightSpent', 'buriedTrioSpent', 'elasticBellySpent', 'feedbackMarked'].includes(key) ? 'false' : key === 'nature' ? 'Serious' : key === 'teraType' ? 'Stellar' : '' : actor[key];
			});
			this.scenarioEdited();
		},
		scenario: function () {
			var self = this;
			return {format: this.$('[name=calc-format]').val(), field: this.$('[name=calc-field]').val(), move: this.$('[name=calc-move]').val(), aura: this.$('[name=calc-aura]').val(), weather: this.$('[name=calc-weather]').val(), attackMode: this.$('[name=calc-powered]').val(), samples: Number(this.$('[name=calc-samples]').val()), seed: Number(this.$('[name=calc-seed]').val()), actors: [0, 1, 2, 3].map(function (i) { return self.readActor(i); }), screens: ['reflect', 'lightscreen', 'auroraveil'].filter(function (s) { return self.$('[name=' + s + ']').is(':checked'); })};
		},
		calculate: function () {
			try { this.validateCalcInputs(); } catch (err) { this.$('.calc-status').addClass('calc-error').text(err.message); return; }
			this.$('.calc-status').removeClass('calc-error').text('Calculating…');
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
				this.scenarioEdited();
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
				var allowed = ['format', 'field', 'move', 'aura', 'weather', 'samples', 'seed', 'attackMode', 'screens', 'actors'];
				if (Object.keys(data).some(function (key) { return allowed.indexOf(key) < 0; })) throw new Error('Unsupported scenario field.');
				for (var i = 0; i < 4; i++) this.validateActorImport(i, data.actors[i]);
				var defaults = {field: (this.metadata.formats.find(function (f) { return f.id === data.format; }) || {}).field || '', aura: '', weather: '', samples: 32, seed: 1, attackMode: '', screens: []};
				Object.keys(defaults).forEach(function (key) { if (data[key] === undefined) data[key] = defaults[key]; });
				['format', 'field', 'aura', 'weather', 'samples', 'attackMode'].forEach(function (key) {
					var select = self.$('[name=calc-' + (key === 'attackMode' ? 'powered' : key) + ']')[0];
					if (typeof data[key] !== (key === 'samples' ? 'number' : 'string') || !Array.from(select.options).some(function (option) { return option.value === '' + data[key]; })) throw new Error('Unsupported ' + key + '.');
				});
				if (typeof data.move !== 'string' || !data.move.trim()) throw new Error('Expected an attack.');
				if (!Number.isInteger(data.seed) || data.seed < 1 || data.seed > 2147483647) throw new Error('Invalid seed.');
				if (!Array.isArray(data.screens) || data.screens.some(function (key) { return ['reflect', 'lightscreen', 'auroraveil'].indexOf(key) < 0; })) throw new Error('Unsupported screens.');
				// Commit only after every slot and control can be represented without loss.
				for (var i = 0; i < 4; i++) this.writeActor(i, data.actors[i]);
				['format', 'field', 'move', 'aura', 'weather', 'samples', 'seed'].forEach(function (key) { self.$('[name=calc-' + key + ']').val(data[key]); });
				this.$('[name=calc-powered]').val(data.attackMode);
				this.$('[name=calc-mode]').val(this.metadata.formats.find(function (f) { return f.id === data.format; }).mode);
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
			this.$('.calc-status').text(data.samples + ' samples · Seed ' + data.seed + '. Results may vary.');
			this.$('.calc-version').text('Engine build ' + data.version.engine + ' — ' + data.version.builtAt);
			var main = data.results[1];
			var html = '<div class="calc-result-card"><span class="calc-eyebrow">DEFENDER · SAMPLED DAMAGE</span><div class="calc-result-head"><h3>' + this.escape(data.move) + '</h3><strong>' + main.minPercent.toFixed(1) + '–' + main.maxPercent.toFixed(1) + '%</strong></div><p>' + main.min + '–' + main.max + ' HP removed · KOs: ' + main.kos + '/' + data.samples + ' samples</p><div class="calc-damage-bar" role="img" aria-label="Observed damage ' + main.minPercent.toFixed(1) + ' to ' + main.maxPercent.toFixed(1) + ' percent of maximum HP"><span style="width:' + Math.min(100, main.maxPercent) + '%"></span><b style="width:' + Math.min(100, main.minPercent) + '%"></b></div><small>Percent of max HP lost in these samples.</small></div><h3>' + this.escape(data.move) + ' — observed damage</h3><div style="overflow:auto"><table class="calc-result-table"><tr><th>Slot</th><th>HP removed</th><th>% max HP</th><th>Net HP loss</th><th>Sample KOs</th></tr>';
			data.results.forEach(function (r) { html += '<tr><th>' + self.escape(r.label) + '</th><td>' + r.min + '–' + r.max + '</td><td>' + r.minPercent.toFixed(1) + '–' + r.maxPercent.toFixed(1) + '%</td><td>' + r.minNetLoss + '–' + r.maxNetLoss + '</td><td>' + r.kos + '/' + data.samples + ' (' + (100 * r.kos / data.samples).toFixed(1) + '%)</td></tr>'; });
			html += '</table></div><p>Samples do not guarantee a KO.</p><details><summary>Battle details</summary><pre style="white-space:pre-wrap">' + this.escape(JSON.stringify(data.resolved, null, 2)) + '\n' + this.escape(data.exampleLog.join('\n')) + '</pre></details>';
			this.$('.calc-results').html(html);
			var otherTargets = data.results.slice(2).filter(function (row) {return row.max > 0;});
			if (otherTargets.length) this.$('.calc-result-card').append($('<p class="calc-other-targets"></p>').text('Other affected targets: ' + otherTargets.map(function (row) {return row.label + ' ' + row.min + '–' + row.max + ' HP';}).join('; ') + '. The headline shows only the selected defender; remaining hits may chain after a KO. See the per-target table.'));

			if (data.powerDistribution) this.$('.calc-result-card').append($('<p class="calc-power-branches"></p>').text('Power outcomes: ' + data.powerDistribution.map(function (branch) { return branch.power + ' BP (' + Math.round(branch.probability * 100) + '%)'; }).join(' / ') + '. Each use rolls once; a sampled range may omit an outcome.'));

			var card = this.$('.calc-result-card').detach();
			if (data.resolved && data.resolved.actors && data.resolved.actors.length >= 2) card.find('.calc-eyebrow').text(data.resolved.actors[0].species + ' → ' + data.resolved.actors[1].species + ' · SAMPLED');
			var detail = $('<details class="calc-result-details"><summary>Damage table &amp; battle details</summary></details>');
			detail.append(this.renderResolvedSummary(data.resolved), this.$('.calc-results').contents().detach());
			this.$('.calc-results').append(card, detail);
			// Results occupy the center panel; retain the user's scroll position.
		}
	});
	var CustomCalculatorRoom = this.CustomCalculatorRoom = Room.extend($.extend({}, CustomCalculatorPopup.prototype, {
		constructor: function () { Room.apply(this, arguments); },
		type: 'calculator', title: 'Calculator', workspace: true, minWidth: 320, maxWidth: 1100,
		initialize: function () { this.$el.addClass('calculator-workspace custom-calculator'); CustomCalculatorPopup.prototype.initialize.call(this); this.$el.removeAttr('style'); },
		close: function () { app.leaveRoom(this.id); },
		remove: function () { if (this.metadata) { app.calculatorDraft = JSON.stringify(this.scenario()); app.calculatorInputs = this.$('input,select,textarea').map(function () { return {slot: $(this).closest('.calc-actor').attr('data-slot') || '', name: this.name, value: this.value, checked: this.checked}; }).get(); } clearTimeout(this.calcTimer); return Room.prototype.remove.call(this); },
		destroy: function () { this.remove(); }
	}));


}).call(this, jQuery);

// Keep all calculator inputs and engine requests; reorganize the actual workspace.
(function () {
	[window.CustomCalculatorPopup.prototype, window.CustomCalculatorRoom.prototype].forEach(function (p) {
		p.events = Object.assign({}, p.events, {'change .calc-form-choice': 'changeCalcForm'});
		p.changeCalcForm = function (e) { this.chooseSpecies($(e.currentTarget).closest('.calc-actor').attr('data-slot') + ':' + e.currentTarget.value); };
		var render = p.renderCalculator;
		p.renderCalculator = function () {
			var result = render.apply(this, arguments), matchup = this.$('.calc-matchup').first().addClass('calc-primary-matchup');
			var center = $('<section class="calc-center" aria-label="Move and damage result"></section>');
			center.insertAfter(matchup.children().first());
			center.append(this.$('.calc-action'), this.$('.calc-status'), this.$('.calc-results'));
			this.$('[name=swapCalcActors]').parent().prependTo(center);
			var conditions = this.$('.calc-conditions');
			var conditionDrawer = $('<details class="calc-battle-options"><summary>Battle conditions · field, weather &amp; screens</summary></details>').insertAfter(matchup);
			conditionDrawer.append(conditions);
			this.$('.calc-actor').each(function () {
				var actor = $(this), fields = actor.children('.calc-fields');
				var load = actor.find('.calc-load-set');
				var drawer = $('<details class="calc-load-details"><summary>Load a saved set</summary></details>').insertBefore(load); drawer.append(load);
				actor.find('.calc-ability-slots').prependTo(actor.find('.calc-component-details'));
				actor.find('.calc-component-details > summary').prependTo(actor.find('.calc-component-details'));
				fields.find('[name=nature]').closest('label').prependTo(actor.find('.calc-advanced > .calc-fields'));
				var options = $('<details class="calc-actor-options"><summary>Level, status &amp; transformation</summary><div class="calc-fields"></div></details>').insertAfter(fields);
				['level', 'gender', 'status', 'gimmick'].forEach(function (name) { fields.find('[name=' + name + ']').closest('label').appendTo(options.find('.calc-fields')); });
				fields.find('[name=species]').closest('label').after('<label class="calc-form-label">Form<select class="calc-form-choice" aria-label="Battle form"></select></label>');
			});
			this.refreshActors();
			return result;
		};
		var refresh = p.refreshActors;
		p.refreshActors = function () {
			var result = refresh.apply(this, arguments), self = this;
			this.$('.calc-actor').each(function () {
				var actor = $(this), species = Dex.species.get(actor.find('[name=species]').val());
				var family = (self.metadata.species || []).filter(function (entry) { return Dex.species.get(entry.name).baseSpecies === species.baseSpecies; });
				actor.find('.calc-form-choice').html(family.map(function (entry) { return '<option' + (toID(entry.name) === species.id ? ' selected' : '') + '>' + self.escape(entry.name) + '</option>'; }).join(''));
				actor.find('.calc-form-label').prop('hidden', family.length < 2);
				actor.find('.calc-passives').remove();
				var info = (self.metadata.species || []).find(function (entry) { return toID(entry.name) === species.id; });
				if (info && info.passives && info.passives.length) actor.find('.calc-identity').after('<div class="calc-passives"><b>Passives</b> ' + info.passives.map(function (id) { var a = Dex.getPassiveAbilityDetails(id); return '<details class="passive-details"><summary>' + self.escape(a.name) + ': ' + self.escape(a.shortDesc) + '</summary><div>' + self.escape(a.desc || a.shortDesc) + '</div></details>'; }).join('') + '</div>');
				actor.find('.calc-component-details').toggle(!!actor.find('.calc-ability-slots button').length || !!actor.find('.calc-components').text().match(/^Components:/));
			});
			return result;
		};
	});
})();

// Compact engine-backed comparison workspace. No independent damage formula.
(function () {
	[window.CustomCalculatorPopup.prototype, window.CustomCalculatorRoom.prototype].forEach(function (p) {
		p.events = Object.assign({}, p.events, {'input .calc-move-entry': 'editComparisonMove'});
		p.cancelComparison = function () {
			clearTimeout(this.comparisonTimer); clearTimeout(this.calcTimer);
			this.comparisonGeneration = (this.comparisonGeneration || 0) + 1;
			this.comparisonQueue = null; this.comparisonTask = null; this.comparisonRequest = null;
			this.requestId = null; this.pendingScenario = null;
		};
		['calculate', 'retryCalculator', 'remove'].forEach(function (name) {
			var original = p[name];
			p[name] = function () {this.cancelComparison(); return original.apply(this, arguments);};
		});
		var edited = p.scenarioEdited;
		p.scenarioEdited = function (event) {
			if (event && $(event.target).hasClass('calc-move-entry')) {var a = $(event.target).closest('.calc-actor'); a.find('[name=moves]').val(a.find('.calc-move-entry').map(function () {return this.value.trim();}).get().filter(Boolean).join(', '));}
			this.cancelComparison(); this.comparisonResults = {};
			var result = edited.apply(this, arguments);
			this.$('.calc-move-result').text('Not calculated');
			this.refreshFieldState();
			return result;
		};
		p.editComparisonMove = function (e) {
			var actor = $(e.target).closest('.calc-actor');
			actor.find('[name=moves]').val(actor.find('.calc-move-entry').map(function () {return this.value.trim();}).get().filter(Boolean).join(', '));
			this.scenarioEdited();
		};
		var write = p.writeActor;
		p.writeActor = function (index, actor) {
			var result = write.apply(this, arguments);
			this.$('.calc-actor[data-slot=' + index + '] .calc-move-entry').each(function (i) {this.value = (actor.moves || [])[i] || '';});
			this.refreshActors(); return result;
		};
		p.refreshFieldState = function () {
			var info = (this.metadata.fieldStates || {})[this.$('[name=calc-field]').val()];
			this.$('.calc-field-state').each(function () {$(this).prop('hidden', !info || $(this).attr('data-state') !== info.key);});
		};
		var refresh = p.refreshActors;
		p.refreshActors = function () {
			var result = refresh.apply(this, arguments), self = this;
			var active = this.$('.calc-actor').map(function () {
				var actor = $(this), species = Dex.species.get(actor.find('[name=species]').val());
				var info = (self.metadata.species || []).find(function (entry) {return toID(entry.name) === species.id;});
				return [actor.find('[name=ability]').val()].concat((self.metadata.abilityComponents || {})[toID(actor.find('[name=ability]').val())] || [], info && info.passives || []).map(toID);
			}).get();
			this.$('.calc-actor').each(function () {
				var actor = $(this), species = Dex.species.get(actor.find('[name=species]').val()), ability = toID(actor.find('[name=ability]').val());
				var info = (self.metadata.species || []).find(function (entry) {return toID(entry.name) === species.id;});
				var effects = [ability].concat(((self.metadata.abilityComponents || {})[ability] || []).map(toID), info && info.passives || []);
				var moves = (actor.find('[name=moves]').val() || '').split(',').map(toID);
				var relevant = {rageFistBonus:moves.includes('ragefist') || toID(self.$('[name=calc-move]').val()) === 'ragefist', threadShelterGuard:effects.includes('threadshelter'), silentFlightSpent:effects.includes('silentflight'), buriedTrioSpent:effects.includes('buriedtrio'), elasticBellySpent:effects.includes('elasticbelly'), feedbackMarked:active.includes('feedback')};
				Object.keys(relevant).forEach(function (key) {var input = actor.find('[name=' + key + ']'); input.closest('label').prop('hidden', !relevant[key]); if (!relevant[key]) input.val(key === 'rageFistBonus' ? '0' : 'false');});
				actor.find('.calc-state-options').prop('hidden', !Object.keys(relevant).some(function (k) {return relevant[k];}));
				actor.find('.calc-passives .passive-details > summary').each(function (i) {$(this).text(Dex.abilities.get((info && info.passives || [])[i]).name);});
				actor.find('.calc-base-stat').each(function () {$(this).text((info && info.baseStats || species.baseStats || {})[$(this).attr('data-stat')] || '—');});
				actor.find('.calc-move-entry').each(function (i) {if (document.activeElement !== this) this.value = (actor.find('[name=moves]').val() || '').split(',').map(function (m) {return m.trim();})[i] || '';});
			});
			return result;
		};
		var scenario = p.scenario;
		p.scenario = function () {
			var result = scenario.apply(this, arguments), self = this;
			if (!this.$('.calc-side-controls').length) return result;
			result.sideConditions = [0, 1].map(function (i) {return self.$('.calc-side-controls[data-side=' + i + '] input:checked').map(function () {return $(this).attr('data-condition');}).get();});
			result.screens = [];
			result.rooms = this.$('.calc-room-controls input:checked').map(function () {return $(this).attr('data-condition');}).get();
			result.fieldState = {};
			this.$('.calc-field-state:not([hidden]) select').each(function () {result.fieldState[$(this).attr('data-state')] = Number(this.value);});
			return result;
		};
		// Preserve legacy exported scenarios and round-trip the new explicit state.
		var importScenario = p.importScenario;
		p.importScenario = function () {
			var text = this.$('[name=calc-json]').val(), data;
			try {
				data = JSON.parse(text); var clean = Object.assign({}, data); delete clean.sideConditions; delete clean.rooms; delete clean.fieldState;
				if (data.sideConditions && (!Array.isArray(data.sideConditions) || data.sideConditions.length !== 2 || data.sideConditions.some(function (side) {return !Array.isArray(side) || side.some(function (c) {return !(this.metadata.sideConditions || []).includes(c);}, this);}, this))) throw Error('Unsupported side conditions');
				if (data.rooms && (!Array.isArray(data.rooms) || data.rooms.some(function (c) {return !(this.metadata.rooms || []).includes(c);}, this))) throw Error('Unsupported rooms');
				var state = data.fieldState || {}; if (Object.keys(state).some(function (k) {return !['shortCircuit', 'crystalCavern'].includes(k) || !Number.isInteger(state[k]) || state[k] < 0 || state[k] > (k === 'shortCircuit' ? 4 : 3);})) throw Error('Invalid field state');
				this.$('[name=calc-json]').val(JSON.stringify(clean)); importScenario.call(this);
				if (this.$('.calc-status').text().indexOf('Invalid scenario:') === 0) return;
				this.$('.calc-side-controls input,.calc-room-controls input').prop('checked', false);
				var self = this; (data.sideConditions || [[], data.screens || []]).forEach(function (side, i) {side.forEach(function (c) {self.$('.calc-side-controls[data-side=' + i + '] [data-condition=' + c + ']').prop('checked', true);});});
				(data.rooms || []).forEach(function (c) {self.$('.calc-room-controls [data-condition=' + c + ']').prop('checked', true);});
				this.$('.calc-field-state select').each(function () {this.value = state[$(this).attr('data-state')] || 0;}); this.refreshFieldState();
			} catch (e) {this.$('.calc-status').text('Invalid scenario: ' + e.message);} finally {this.$('[name=calc-json]').val(text);}
		};
		p.compareMoves = function (value) {
			this.cancelComparison();
			var self = this, base = this.scenario(), tasks = [];
			[0, 1].forEach(function (side) {
				(base.actors[side].moves || []).forEach(function (move, index) {
					if (value && value !== side + ':' + index) return;
					var task = JSON.parse(JSON.stringify(base)); task.move = move;
					if (side) {task.actors = [base.actors[1], base.actors[0], base.actors[3], base.actors[2]]; task.sideConditions = [base.sideConditions[1], base.sideConditions[0]];}
					tasks.push(Object.freeze({side:side, index:index, scenario:task, json:JSON.stringify(task), generation:self.comparisonGeneration}));
				});
			});
			if (!tasks.length) {this.$('.calc-status').text('Enter at least one move in either Pokémon’s four move slots.'); return;}
			this.comparisonQueue = tasks; this.comparisonSnapshot = JSON.stringify(base); this.comparisonResults = {}; this.nextComparison();
		};
		p.nextComparison = function () {
			if (!this.comparisonQueue) return;
			var task = this.comparisonQueue.shift();
			if (!task) {this.comparisonQueue = null; this.$('.calc-status').text('Comparisons complete. Each row is an independent sampled action, not a guaranteed range or KO probability.'); this.$el.attr('aria-busy', 'false'); return;}
			this.comparisonTask = task; this.$('.calc-status').text('Sampling ' + task.scenario.actors[0].species + ' → ' + task.scenario.actors[1].species + ': ' + task.scenario.move + '…');
			this.$el.attr('aria-busy', 'true'); var self = this;
			clearTimeout(this.comparisonTimer); this.comparisonTimer = setTimeout(function () {if (!self.comparisonQueue || task.generation !== self.comparisonGeneration || self.comparisonTask !== task) return; self.comparisonSentAt = Date.now(); self.requestCalculator(task.json); self.comparisonRequest = Object.freeze({id:self.requestId, task:task, generation:task.generation});}, Math.max(0, 1100 - (Date.now() - (this.calculatorLastSentAt || 0))));
		};
		var receive = p.receiveCalculator;
		p.receiveCalculator = function (data) {
			if (this.comparisonQueue) {
				var active = this.comparisonRequest;
				if (!active || active.generation !== this.comparisonGeneration || active.task !== this.comparisonTask || !data || data.requestId !== active.id || this.requestId !== active.id) return;
				if (this.comparisonSnapshot !== JSON.stringify(this.scenario())) {this.scenarioEdited(); return;}
				clearTimeout(this.calcTimer); var task = active.task, key = task.side + ':' + task.index;
				this.comparisonRequest = null;
				var cell = this.$('.calc-actor[data-slot=' + task.side + '] [data-result=' + task.index + ']');
				if (data.error) {cell.text(data.error).addClass('calc-error');} else {
					var r = data.results[1]; cell.removeClass('calc-error').text(r.minPercent.toFixed(1) + '–' + r.maxPercent.toFixed(1) + '% · ' + r.kos + '/' + data.samples + ' sample KOs');
					if (data.powerDistribution) cell.attr('title', data.powerDistribution.map(function (branch) {return branch.power + ' BP: ' + Math.round(branch.probability * 100) + '%';}).join('; ') + '; sampled range may omit a branch.'); else cell.removeAttr('title');
					this.comparisonResults[key] = data;
					this.pendingScenario = {json:JSON.stringify(this.scenario()), revision:this.scenarioRevision}; receive.call(this, data);
					var resolvedActors = data.resolved && data.resolved.actors || task.scenario.actors;
					this.$('.calc-result-card .calc-eyebrow').text(resolvedActors[0].species + ' → ' + resolvedActors[1].species + ' · SAMPLED');
				}
				this.requestId = null; this.pendingScenario = null;
				this.nextComparison(); return;
			}
			return receive.apply(this, arguments);
		};
		var render = p.renderCalculator;
		p.renderCalculator = function () {
			var result = render.apply(this, arguments), self = this;
			this.$el.addClass('calc-compact');
			this.$('.calc-intro').html('Compare four moves on each side using this server’s custom battle engine. <strong>Observed samples—not guaranteed damage ranges.</strong>');
			var center = this.$('.calc-center'), conditions = this.$('.calc-conditions'); conditions.prependTo(center); this.$('.calc-battle-options').remove();
			this.$('.calc-screens').hide();
			var sideHTML = '<div class="calc-sides">'; [0, 1].forEach(function (i) {sideHTML += '<fieldset class="calc-side-controls" data-side="' + i + '"><legend>' + (i ? 'Right side' : 'Left side') + '</legend>'; (self.metadata.sideConditions || []).forEach(function (id) {sideHTML += '<label><input type="checkbox" data-condition="' + id + '" />' + self.escape(Dex.conditions ? Dex.conditions.get(id).name : ({reflect:'Reflect', lightscreen:'Light Screen', auroraveil:'Aurora Veil', tailwind:'Tailwind', safeguard:'Safeguard', mist:'Mist'})[id]) + '</label>';}); sideHTML += '</fieldset>';}); sideHTML += '</div><div class="calc-room-controls">';
			(this.metadata.rooms || []).forEach(function (id) {sideHTML += '<label><input type="checkbox" data-condition="' + id + '" />' + self.escape({gravity:'Gravity', magicroom:'Magic Room', wonderroom:'Wonder Room', trickroom:'Trick Room'}[id]) + '</label>';}); conditions.append(sideHTML + '</div>');
			this.$('[name=calc-weather]').append('<option value="desolateland">Harsh sun</option><option value="primordialsea">Heavy rain</option><option value="deltastream">Strong winds</option>');
			Object.keys(this.metadata.fieldStates || {}).forEach(function (field) {var def = self.metadata.fieldStates[field]; conditions.find('.calc-condition-grid').append('<label class="calc-field-state" data-state="' + def.key + '" hidden>' + self.escape(def.label) + '<select data-state="' + def.key + '">' + def.options.map(function (label, i) {return '<option value="' + i + '">' + self.escape(label) + '</option>';}).join('') + '</select></label>');});
			conditions.append('<small>Base fields / terrains and temporary auras are distinct. Flower Garden stages are listed individually. Entry abilities may change the requested field; check resolved setup.</small>');
			this.$('.calc-action').prepend('<button type="button" class="button calc-compare-all" name="compareMoves">Compare both movesets</button>');
			this.$('.calc-move-shortcuts').remove(); this.$('.calc-action-fields').wrap('<details class="calc-single-attack"><summary>Single attack / powered move / sampling</summary></details>');
			this.$('[name=calculate]').appendTo(this.$('.calc-single-attack')).text('Calculate left → right');
			this.$('.calc-actor').each(function () {
				var actor = $(this), slot = Number(actor.attr('data-slot')); actor.children('legend').text(slot === 0 ? 'Pokémon 1' : slot === 1 ? 'Pokémon 2' : 'Ally / other foe ' + (slot - 1));
				var fields = actor.children('.calc-fields'); fields.find('[name=hpPercent]').closest('label').appendTo(actor.find('.calc-actor-options > .calc-fields'));
				var special = $('<details class="calc-state-options"><summary>Relevant custom state</summary><div class="calc-fields"></div></details>').appendTo(actor);
				['rageFistBonus', 'threadShelterGuard', 'silentFlightSpent', 'buriedTrioSpent', 'elasticBellySpent', 'feedbackMarked'].forEach(function (key) {actor.find('[name=' + key + ']').closest('label').appendTo(special.find('.calc-fields'));});
				actor.find('.calc-advanced').prop('open', true); actor.find('[name=moves]').closest('label').hide();
				actor.find('.calc-stats tr').each(function (i) {if (!i)$(this).children().first().after('<th>Base</th>'); else {var stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'][i - 1]; $(this).children().first().after('<td class="calc-base-stat" data-stat="' + stat + '"></td>');}});
				if (slot < 2) {var rows = '<section class="calc-comparison-moves"><h3>Moves → ' + (slot ? 'Pokémon 1' : 'Pokémon 2') + '</h3>'; for (var i = 0; i < 4; i++)rows += '<div class="calc-comparison-row"><input class="textbox calc-move-entry" list="calc-list-move" aria-label="Pokémon ' + (slot + 1) + ' move ' + (i + 1) + '" placeholder="Move ' + (i + 1) + '" /><button class="button" name="compareMoves" value="' + slot + ':' + i + '" aria-label="Calculate move ' + (i + 1) + ' from Pokémon ' + (slot + 1) + '">Calc</button><output class="calc-move-result" data-result="' + i + '">Not calculated</output></div>'; actor.find('.calc-advanced').after(rows + '</section>');}
			});
			// Explicit defaults make both directions useful, while imported sets keep their moves.
			[0, 1].forEach(function (i) {var actor = self.$('.calc-actor[data-slot=' + i + ']'); if (!actor.find('[name=moves]').val())actor.find('[name=moves]').val(i ? 'Psychic, Shadow Ball, Aura Sphere, Ice Beam' : 'Psychic, Thunderbolt, Ice Beam, Flamethrower');});
			if (this.workspace && app.calculatorDraft) {this.$('[name=calc-json]').val(app.calculatorDraft); this.importScenario();} this.refreshActors(); this.refreshFieldState(); return result;
		};
	});
})();

(function () {
	var escape = BattleLog.escapeHTML;
	window.openPublicFieldGuide = function (id) {var origin = app.curRoom && app.curRoom.id; if (!app.rooms.fieldguide)app.addRoom('fieldguide', window.FieldGuideRoom, true, 'Field Guide'); var room = app.rooms.fieldguide; if (origin && origin !== 'fieldguide')room.returnRoom = origin; room.selected = id || room.selected || 'hauntedterrain'; if (room.data)room.renderPage(); app.focusRoom('fieldguide'); app.topbar.updateTabbar();};
	window.FieldGuideRoom = Room.extend({
		type:'fieldguide', title:'Field Guide', minWidth:320, maxWidth:1200,
		events:{'input [name=guide-search]':'filterGuide', 'change [name=guide-kind]':'filterGuide'},
		initialize:function () {this.$el.addClass('field-guide-room'); this.listenTo(app, 'response:fieldguide', this.receiveGuide); this.$el.html('<h2>Field Guide</h2><p role="status">Loading this server’s public field reference…</p><button class="button" name="retryGuide">Retry</button>'); app.send('/fieldguide');},
		retryGuide:function () {app.send('/fieldguide');},
		receiveGuide:function (data) {this.data = data; this.$el.html('<header><h2>Field Guide</h2><button class="button" name="close">Close</button></header><p class="guide-notice">' + escape(data.notice) + '</p><div class="guide-layout"><nav aria-label="Fields and auras"><label>Find a field<input class="textbox" name="guide-search" placeholder="Search fields, moves or abilities" /></label><label>Layer<select name="guide-kind"><option value="">All layers</option><option value="field">Full fields / terrains</option><option value="aura">Temporary auras</option></select></label><div class="guide-list"></div></nav><article class="guide-page"></article></div>'); this.filterGuide(); this.renderPage();},
		filterGuide:function () {var self = this, q = toID(this.$('[name=guide-search]').val()), kind = this.$('[name=guide-kind]').val(); var list = this.data.entries.filter(function (e) {return (!kind || e.kind === kind) && (!q || toID(e.name + ' ' + JSON.stringify(e.sections) + ' ' + JSON.stringify(e.references) + ' ' + JSON.stringify(e.referenceDetails)).includes(q));}); this.$('.guide-list').html(list.map(function (e) {var key = (e.kind === 'aura' ? 'aura/' : '') + e.id; return '<button class="button" name="chooseGuide" value="' + escape(key) + '" aria-pressed="' + (key === self.selected) + '">' + escape(e.name) + '<small>' + (e.kind === 'aura' ? 'Aura' : 'Full field') + '</small></button>';}).join('') || '<p>No matching entries.</p>');},
		chooseGuide:function (id) {this.selected = id; this.renderPage(); this.filterGuide();},
		renderPage:function () {
			if (!this.data) return; var key = this.selected || 'hauntedterrain', aura = key.startsWith('aura/'), id = aura ? key.slice(5) : key, e = this.data.entries.find(function (e) {return e.id === id && e.kind === (aura ? 'aura' : 'field');}); if (!e) {this.$('.guide-page').html('<p>This entry is not registered on the connected server.</p>'); return;}
			var html = '<header><div><small>' + (aura ? 'TEMPORARY AURA' : 'FULL FIELD / TERRAIN') + '</small><h2>' + escape(e.name) + '</h2></div>' + (!aura ? '<button class="button" name="calculateGuideField" value="' + escape(e.id) + '">Use in calculator</button>' : '') + '</header><p class="guide-review">' + escape(e.review) + '</p>';
			['Transitions', 'Boosts and general effects', 'Abilities', 'Moves', 'Seeds and other effects', 'Battle messages'].forEach(function (section) {var lines = e.sections[section] || []; html += '<details' + (lines.length ? ' open' : '') + '><summary>' + escape(section) + (lines.length ? '' : ' — documentation pending') + '</summary>' + (lines.length ? '<ul>' + lines.map(function (line) {return '<li>' + escape(line) + '</li>';}).join('') + '</ul>' : '<p>This section has not been reviewed. No claim of “no effects” is made.</p>') + '</details>';});
			if (e.legacyNotes.length)html += '<details class="guide-unverified"><summary>Older notes — not source-verified for this release</summary><p>These notes may be outdated. They are provided separately from reviewed rules.</p><ul>' + e.legacyNotes.map(function (n) {return '<li>' + escape(n) + '</li>';}).join('') + '</ul></details>';
			html += '<details class="guide-reference-details" open><summary>Related moves, abilities and items</summary><p>Field-specific effects are shown below. Any remaining unaudited interaction is labeled pending.</p>'; ['moves', 'abilities', 'items'].forEach(function (kind) {var rows = (e.referenceDetails || {})[kind] || []; if (!rows.length) return; html += '<h4>' + escape(kind.charAt(0).toUpperCase() + kind.slice(1)) + '</h4><div class="guide-reference-cards">'; rows.forEach(function (row) {html += '<article class="guide-reference-card"><h5>' + escape(row.name) + '</h5>'; if (row.moveStats) {var m = row.moveStats; html += '<small class="guide-reference-stats">' + escape(m.type + ' · ' + m.category + (m.category === 'Status' ? '' : ' · ' + m.power + ' power') + ' · ' + (m.accuracy === true ? 'Always hits' : m.accuracy + ' accuracy') + ' · ' + m.pp + ' PP') + '</small>';} if (row.fieldEffects.length) {html += '<ul>' + row.fieldEffects.map(function (text) {return '<li>' + escape(text) + '</li>';}).join('') + '</ul>';} else {html += '<p class="guide-pending">Field-specific detail pending review.</p>'; if (row.generalSummary)html += '<p><strong>General effect:</strong> ' + escape(row.generalSummary) + '</p>';}html += '</article>';}); html += '</div>';}); html += '</details>'; this.$('.guide-page').html(html);
		},
		calculateGuideField:function (id) {app.pendingCalculatorField = id; app.rooms[''].customCalculator(); var r = app.rooms.calculator; if (r.metadata) {r.$('[name=calc-field]').val(id); r.scenarioEdited(); app.pendingCalculatorField = null;}},
		close:function () {var origin = this.returnRoom; app.leaveRoom(this.id); if (origin && app.rooms[origin])app.focusRoom(origin);}
	});
	[window.CustomCalculatorPopup.prototype, window.CustomCalculatorRoom.prototype].forEach(function (p) {var render = p.renderCalculator; p.renderCalculator = function () {var out = render.apply(this, arguments); this.$('[name=calc-field]').closest('label').append('<button class="button" name="openCalcFieldGuide">Field Guide</button>'); if (app.pendingCalculatorField) {this.$('[name=calc-field]').val(app.pendingCalculatorField); this.scenarioEdited(); app.pendingCalculatorField = null;} return out;}; p.openCalcFieldGuide = function () {window.openPublicFieldGuide(this.$('[name=calc-field]').val());};});
})();

// Keep the common comparison path visible; rare state remains available on demand.
(function () {
	[window.CustomCalculatorPopup.prototype, window.CustomCalculatorRoom.prototype].forEach(function (p) {
		var edited = p.scenarioEdited;
		p.scenarioEdited = function () {var result = edited.apply(this, arguments); this.updateConditionSummary(); return result;};
		p.updateConditionSummary = function () {var active = []; this.$('.calc-extra-conditions input:checked').each(function () {var input = $(this), side = input.closest('fieldset').children('legend').text(); active.push((side ? side + ': ' : '') + input.closest('label').text().trim());}); this.$('.calc-extra-conditions > summary').text(active.length ? active.join(' · ') : 'Screens, team effects and rooms');};
		var render = p.renderCalculator;
		p.renderCalculator = function () {
			var result = render.apply(this, arguments), self = this;
			this.$el.addClass('calc-simple');
			this.$('.calc-intro').html('Choose two Pokémon, edit their moves, then <strong>Compare all 8 moves</strong>. Results are sampled, not guaranteed ranges.');
			this.$('.calc-compare-all').text('Compare all 8 moves');
			this.$('.calc-actor').each(function () {
				var actor = $(this), moves = actor.find('.calc-comparison-moves');
				moves.insertBefore(actor.find('.calc-actor-options'));
				actor.find('.calc-advanced > summary').text('Stats and stages');
				actor.find('.calc-advanced').prop('open', true);
				var extra = $('<details class="calc-accuracy-extra"><summary>Accuracy and evasion stages</summary><table class="calc-stats"></table></details>');
				actor.find('.calc-stats tr').filter(function () {return $(this).find('[data-stat=accuracy],[data-stat=evasion]').length;}).appendTo(extra.find('table'));
				actor.find('.calc-advanced').append(extra);
			});
			var conditions = this.$('.calc-conditions');
			var extra = $('<details class="calc-extra-conditions"><summary>Screens, team effects and rooms</summary></details>').appendTo(conditions);
			conditions.find('.calc-sides,.calc-room-controls').appendTo(extra);
			this.$('.calc-single-attack > summary .calc-action-fields').appendTo(this.$('.calc-single-attack'));
			this.$('.calc-single-attack').prop('open', false);
			this.$('.calc-conditions > small').hide(); this.updateConditionSummary();
			return result;
		};
	});
})();

// Four seed-family navigation groups; search remains global across every group.
(function () {
	var p = window.FieldGuideRoom.prototype, escape = BattleLog.escapeHTML;
	p.filterGuide = function () {
		if (!this.data) return;
		var self = this, q = toID(this.$('[name=guide-search]').val()), kind = this.$('[name=guide-kind]').val();
		var list = this.data.entries.filter(function (e) {return (!kind || e.kind === kind) && (!q || toID(e.name + ' ' + e.group + ' ' + JSON.stringify(e.sections) + ' ' + JSON.stringify(e.references) + ' ' + JSON.stringify(e.referenceDetails)).includes(q));});
		var html = ''; ['Elemental', 'Magical', 'Synthetic', 'Telluric'].forEach(function (group) {
			var entries = list.filter(function (e) {return e.group === group;}).sort(function (a, b) {return a.name.localeCompare(b.name, undefined, {numeric:true});});
			if (!entries.length) return;
			html += '<details class="guide-group" open><summary>' + escape(group) + '<span>' + entries.length + '</span></summary><div>';
			entries.forEach(function (e) {var key = (e.kind === 'aura' ? 'aura/' : '') + e.id, reviewed = Object.keys(e.sections).length > 0; html += '<button class="button" name="chooseGuide" value="' + escape(key) + '" aria-pressed="' + (key === self.selected) + '"><span>' + escape(e.name) + '</span><small>' + (e.kind === 'aura' ? 'Temporary aura' : reviewed ? 'Checked sections' : 'Details pending') + '</small></button>';}); html += '</div></details>';
		}); this.$('.guide-list').html(html || '<p>No matching fields or interactions.</p>');
	};
	var render = p.renderPage; p.renderPage = function () {
		var out = render.apply(this, arguments); if (!this.data) return out;
		var key = this.selected || 'hauntedterrain', e = this.data.entries.find(function (e) {return ((e.kind === 'aura' ? 'aura/' : '') + e.id) === key;}); if (!e) return out;
		this.$el.addClass('guide-organized'); this.$('.guide-page').attr('data-group', e.group);
		this.$('.guide-page > header small').text(e.group + ' · ' + (e.kind === 'aura' ? 'Temporary aura' : 'Full field'));
		if (e.groupingNote) this.$('.guide-page > header').after('<p class="guide-group-note">' + escape(e.groupingNote) + '</p>');
		var titles = {'Transitions':'When the field changes', 'Boosts and general effects':'What the field does', 'Seeds and other effects':'Seeds and other effects', 'Implementation reference index':'Related moves, abilities and items'};
		this.$('.guide-page > details > summary').each(function () {var text = $(this).text(); Object.keys(titles).forEach(function (from) {if (text.startsWith(from))text = text.replace(from, titles[from]);}); $(this).text(text);});
		var coverage = this.data.coverage; this.$('.guide-notice').text('Browse by seed family, or search every field, move and ability. ' + coverage.reviewedFields + ' of ' + coverage.fields + ' field pages have checked sections; indexed interactions include source-checked details. Temporary auras are labeled separately.');
		this.$('.guide-page > details').last().find('p').first().text('These entries explain checked field effects. A general effect is shown separately only when its field-specific detail is still pending.');
		return out;
	};
})();


// Unified local species/set picker; changes apply only on explicit selection.
(function () {
	[window.CustomCalculatorPopup.prototype, window.CustomCalculatorRoom.prototype].forEach(function (p) {
		p.events = Object.assign({}, p.events, {'input .calc-pick-query':'filterCalcPicker', 'change .calc-pick-source':'filterCalcPicker', 'keydown .calc-pick-query':'keyCalcPicker', 'change .calc-valid-ability':'selectValidCalcAbility'});
		var edited = p.scenarioEdited; p.scenarioEdited = function (e) {if (e && $(e.target).is('.calc-pick-query,.calc-pick-source,.calc-valid-ability')) return; return edited.apply(this, arguments);};
		p.openCalcPicker = function (slot) {this.populateCalcSets(); var a = this.$('.calc-actor[data-slot=' + slot + ']'); var filter = a.find('.calc-pick-source'), selected = filter.val(); filter.find('option[data-profile]').remove(); (Storage.prefs('rosterprofiles') || {profiles:[]}).profiles.forEach(function (profile) {filter.append($('<option>').attr('data-profile', 'true').val('profile:' + profile.id).text('Pokémon list: ' + profile.name));}); filter.val(selected || 'all'); a.find('.calc-picker').prop('hidden', false); a.find('.calc-pick-query').val('').focus(); this.filterCalcPicker({target:a.find('.calc-pick-query')[0]});};
		p.closeCalcPicker = function (slot) {var a = this.$('.calc-actor[data-slot=' + slot + ']'); a.find('.calc-picker').prop('hidden', true); a.find('[name=openCalcPicker]').focus();};
		p.keyCalcPicker = function (e) {if (e.key === 'Escape') {e.preventDefault(); this.closeCalcPicker($(e.target).closest('.calc-actor').attr('data-slot'));} if (e.key === 'ArrowDown') {e.preventDefault(); $(e.target).closest('.calc-picker').find('.calc-pick-results button').first().focus();}};
		p.filterCalcPicker = function (e) {
			var self = this, a = $(e.target).closest('.calc-actor'), slot = a.attr('data-slot'), q = toID(a.find('.calc-pick-query').val()), source = a.find('.calc-pick-source').val(), rows = [], profile = (Storage.prefs('rosterprofiles') || {profiles:[]}).profiles.find(function (r) {return source === 'profile:' + r.id;});
			if (source !== 'species' && !profile)(this.savedCalcSets || []).forEach(function (r, i) {if (!q || toID(r.name + ' ' + r.set.species).includes(q))rows.push({name:r.name, species:r.set.species, value:slot + ':set:' + i, kind:'Replace entire set'});});
			if (source !== 'sets')(this.metadata.species || []).forEach(function (r) {if ((!profile || profile.species.includes(toID(r.name))) && (!q || toID(r.name).includes(q)))rows.push({name:r.name, species:r.name, value:slot + ':species:' + r.name, kind:'Species only; keep moves, item and spread'});});
			a.find('.calc-pick-count').text(rows.length + ' matches' + (rows.length > 40 ? ' — showing first 40; narrow your search' : '')); a.find('.calc-pick-results').html(rows.slice(0, 40).map(function (r) {var s = Dex.species.get(r.species), icon = Dex.getPokemonIcon(s.name).replace(Dex.resourcePrefix + 'sprites/', '/sprites/'); return '<button type="button" name="applyCalcPick" value="' + self.escape(r.value) + '"><span class="calc-picon" aria-hidden="true" style="' + self.escape(icon) + '"></span><span><strong>' + self.escape(r.name) + '</strong><small>' + self.escape(s.name + ' · ' + s.types.join(' / ')) + '</small><small>' + self.escape(r.kind) + '</small></span></button>';}).join('') || '<p>No matching Pokémon or saved sets.</p>');
		};
		p.applyCalcPick = function (value) {var parts = value.split(':'), slot = Number(parts.shift()), kind = parts.shift(), key = parts.join(':'), actor; try {if (kind === 'set') {var r = this.savedCalcSets[Number(key)]; if (!r) return; actor = JSON.parse(JSON.stringify(r.set));} else {var info = this.metadata.species.find(function (s) {return s.name === key;}); if (!info) return; actor = this.readActor(slot); actor.species = info.name; actor.ability = info.abilities[0]; actor.boosts = {}; actor.status = ''; actor.gimmick = ''; actor.hpPercent = 100; ['rageFistBonus', 'threadShelterGuard', 'silentFlightSpent', 'buriedTrioSpent', 'elasticBellySpent', 'feedbackMarked', 'voidCrossingCurse'].forEach(function (k) {actor[k] = k === 'rageFistBonus' ? 0 : false;});} this.writeActor(slot, actor); this.closeCalcPicker(slot); this.$('.calc-status').text(kind === 'set' ? 'Saved set loaded. Battle conditions retained.' : 'Species changed. Moves, item and spread retained; ability and battle state reset. Check move eligibility.');} catch (err) {this.$('.calc-status').addClass('calc-error').text(err.message);}};
		p.selectValidCalcAbility = function (e) {$(e.target).closest('.calc-actor').find('[name=ability]').val(e.target.value); this.scenarioEdited();};
		var refresh = p.refreshActors; p.refreshActors = function () {var result = refresh.apply(this, arguments), self = this; this.$('.calc-actor').each(function () {var a = $(this), id = toID(a.find('[name=species]').val()), info = (self.metadata.species || []).find(function (s) {return toID(s.name) === id;}), current = a.find('[name=ability]').val(), choices = Object.values(info && info.abilities || {}); a.find('.calc-valid-ability').html(choices.map(function (name) {var slot = Object.keys(info.abilities).find(function (k) {return info.abilities[k] === name;}); return '<option value="' + self.escape(name) + '">' + self.escape(name + (slot === 'S' ? ' · Event' : slot === 'H' ? ' · Hidden' : '')) + '</option>';}).join('') + (!choices.includes(current) ? '<option value="' + self.escape(current) + '">' + self.escape(current || 'No Ability') + ' · Override</option>' : '')).val(current); var ability = Dex.abilities.get(current); a.find('.calc-ability-summary').text(ability.shortDesc || ability.desc || 'No description available.').attr('title', ability.desc || ability.shortDesc || ''); a.find('.calc-ability-slots,.calc-component-details,.calc-form-label').hide();}); return result;};
		var render = p.renderCalculator; p.renderCalculator = function () {var result = render.apply(this, arguments); this.$el.addClass('calc-picker-workspace'); this.$('.calc-actor').each(function () {var a = $(this), slot = a.attr('data-slot'); a.find('.calc-identity').before('<button type="button" class="button calc-pick-open" name="openCalcPicker" value="' + slot + '">Choose Pokémon / saved set</button><section class="calc-picker" aria-label="Choose Pokémon or saved set" hidden><div class="calc-picker-heading"><strong>Choose Pokémon / saved set</strong><button class="button" name="closeCalcPicker" value="' + slot + '">Cancel</button></div><label>Search<input class="textbox calc-pick-query" placeholder="Species, form, team or set name" autocomplete="off" /></label><label>Show<select class="calc-pick-source"><option value="all">Pokémon + my saved sets</option><option value="sets">My teams and saved sets</option><option value="species">Pokémon / forms only</option></select></label><small>Uses teams loaded on this device and your local saved builds.</small><p class="calc-pick-count" role="status"></p><div class="calc-pick-results"></div></section>'); a.find('.calc-load-details').hide(); a.find('[name=species]').closest('label').hide(); var label = a.find('[name=ability]').closest('label'), box = $('<div class="calc-ability-picker"><label>Ability<select class="calc-valid-ability" aria-label="Species ability"></select></label><p class="calc-ability-summary"></p><details class="calc-ability-override"><summary>Override ability for a hypothetical matchup</summary></details></div>'); label.before(box); box.find('details').append(label); a.find('.calc-advanced').prop('open', false);}); this.refreshActors(); return result;};
	});
})();

// Read-only custom rules and team clinic, backed by the connected server.
(function () {
	var esc = BattleLog.escapeHTML;
	window.openRulesEncyclopedia = function (team, format) {
		if (!app.rooms.customrules)app.addRoom('customrules', window.CustomRulesRoom, true, 'Custom rules');
		var r = app.rooms.customrules; if (team !== undefined)r.pendingTeam = {team:team, format:format}; if (r.catalog)r.renderRules();
		app.focusRoom('customrules'); app.topbar.updateTabbar();
	};
	window.CustomRulesRoom = Room.extend({
		type:'customrules', title:'Custom rules', minWidth:320, maxWidth:1200,
		events:{'input [name=rules-search]':'filterRules', 'change [name=rules-kind]':'filterRules', 'input [name=clinic-team]':'clinicEdited', 'change .clinic-controls select':'clinicEdited'},
		initialize:function () {this.$el.addClass('field-guide-room custom-rules-room'); this.listenTo(app, 'response:rulesencyclopedia', this.receiveRules); this.$el.html('<h2>Custom rules</h2><p role="status">Loading connected server data…</p><button class="button" name="retryRules">Retry</button>'); this.retryRules();},
		retryRules:function () {app.send('/rulesencyclopedia ' + JSON.stringify({action:'catalog'}));},
		receiveRules:function (response) {if (response.action === 'clinic') {var pending = this.pendingClinic; if (!pending || response.requestId !== pending.id) return; this.pendingClinic = null; if (JSON.stringify(pending.context) !== JSON.stringify(this.readClinicContext())) {this.clinicEdited(); return;} if (response.error) {this.$('.rules-status').text(response.error); return;} this.renderClinic(response.data, pending.context); return;} if (response.error) {this.$('.rules-status').text(response.error); if (!this.catalog) this.$el.append('<p role="alert">' + esc(response.error) + '</p>'); return;} if (response.action === 'catalog') {this.catalog = response.data; this.renderRules();} else if (response.action === 'detail') {this.renderDetail(response.data);} },
		renderRules:function () {var c = this.catalog, old = this.$('[name=clinic-team]').val(), format = this.$('[name=clinic-format]').val(), field = this.$('[name=clinic-field]').val(), aura = this.$('[name=clinic-aura]').val(); this.$el.html('<header><h2>Custom rules &amp; team clinic</h2><button class="button" name="close">Close</button></header><p>' + esc(c.notice) + '</p><p class="rules-status" role="status" aria-live="polite"></p><div class="guide-layout"><nav><label>Find Pokémon or ability<input class="textbox" name="rules-search" placeholder="Name, form or type" /></label><label>Browse<select name="rules-kind"><option value="species">Pokémon</option><option value="ability">Abilities</option></select></label><div class="rules-list"></div></nav><article class="rules-detail"><p>Select a Pokémon or ability to inspect its current rules.</p></article></div><details class="rules-clinic" open><summary>Team clinic — check an export without changing it</summary><label>Team export<textarea class="textbox" name="clinic-team" rows="7" spellcheck="false"></textarea></label><div class="clinic-controls"><label>Validation format<select name="clinic-format">' + c.formats.map(function (f) {return '<option value="' + esc(f.id) + '">' + esc(f.name) + '</option>';}).join('') + '</select></label><label>Planning field<select name="clinic-field"><option value="">No field</option>' + c.fields.map(function (f) {return '<option value="' + esc(f.id) + '">' + esc(f.name) + '</option>';}).join('') + '</select></label><label>Temporary aura<select name="clinic-aura"><option value="">No aura</option>' + c.auras.map(function (f) {return '<option value="' + esc(f.id) + '">' + esc(f.name) + '</option>';}).join('') + '</select></label></div><button class="button" name="checkClinic">Check team &amp; explain field rules</button> <button class="button" name="clinicGuide">Open chosen Field Guide</button><div class="clinic-results" aria-live="polite"></div></details>'); var pending = this.pendingTeam; this.$('[name=clinic-team]').val(pending ? pending.team : old || ''); this.$('[name=clinic-format]').val((pending && pending.format) || format || 'gen9nofieldsinglesgame'); if (!this.$('[name=clinic-format]').val()) this.$('[name=clinic-format]')[0].selectedIndex = 0; this.$('[name=clinic-field]').val(field || ''); this.$('[name=clinic-aura]').val(aura || ''); this.pendingTeam = null; this.filterRules();},
		filterRules:function () {var kind = this.$('[name=rules-kind]').val(), q = toID(this.$('[name=rules-search]').val()), rows = this.catalog[kind === 'ability' ? 'abilities' : 'species'].filter(function (r) {return !q || toID(r.name + ' ' + (r.types || []).join(' ')).includes(q);}); this.$('.rules-list').html(rows.slice(0, 80).map(function (r) {return '<button class="button" name="chooseRule" value="' + esc(kind + ':' + r.id) + '">' + esc(r.name) + (r.types ? '<small>' + esc(r.types.join(' / ')) + '</small>' : '') + '</button>';}).join('') + (rows.length > 80 ? '<p>Showing 80 of ' + rows.length + '. Refine your search.</p>' : rows.length ? '' : '<p>No matching entries.</p>'));},
		chooseRule:function (value) {var parts = value.split(':'); this.$('.rules-status').text('Loading rules…'); app.send('/rulesencyclopedia ' + JSON.stringify({action:'detail', kind:parts[0], query:parts[1]}));},
		abilityCard:function (a) {return '<article><button class="button" name="chooseRule" value="ability:' + esc(a.id) + '">' + esc(a.name) + '</button><p>' + esc(a.description || 'Description pending.') + '</p>' + (a.identityNote ? '<small>' + esc(a.identityNote) + '</small>' : '') + (a.components && a.components.length ? '<p>Includes: ' + a.components.map(function (c) {return '<button class="button" name="chooseRule" value="ability:' + esc(c.id) + '">' + esc(c.name) + '</button>';}).join(' ') + '</p>' : '') + '</article>';},
		renderDetail:function (d) {this.$('.rules-status').text(''); var self = this, h = '<h2>' + esc(d.name) + '</h2>'; if (d.kind === 'ability') {h += this.abilityCard(d); h += '<h3>Indexed field interactions</h3>' + ((d.fields || []).map(function (f) {return '<button class="button" name="ruleGuide" value="' + esc(f.id) + '">' + esc(f.name) + '</button>';}).join(' ') || '<p>No direct interaction is indexed. This is not proof of no indirect effects.</p>');} else {h += '<p>' + esc(d.types.join(' / ')) + '</p><dl class="rules-stats">' + Object.keys(d.stats).map(function (k) {return '<div><dt>' + esc(k.toUpperCase()) + '</dt><dd>' + d.stats[k] + '</dd></div>';}).join('') + '</dl><h3>Selectable abilities</h3>' + d.abilities.map(function (a) {return self.abilityCard(a);}).join('') + '<h3>Passive</h3>' + (d.passives.map(function (a) {return self.abilityCard(a);}).join('') || '<p>No registered passive.</p>') + '<h3>Forms</h3>' + d.forms.map(function (f) {return '<button class="button" name="chooseRule" value="species:' + esc(f) + '">' + esc(f) + '</button>';}).join(' '); if (d.event) {h += '<details open><summary>Event option: ' + esc(d.event.ability.name) + '</summary>' + this.abilityCard(d.event.ability) + '<ul>' + d.event.moves.map(function (m) {return '<li>' + esc(m.name) + ' — ' + esc(m.sources.map(function (s) {return /L0$/.test(s) ? 'Evolution' : /L/.test(s) ? 'Level ' + s.split('L')[1] : 'TM / tutor';}).join(', ')) + '; ' + (m.exclusive ? 'requires this event ability' : 'also ordinarily available') + '</li>';}).join('') + '</ul></details>';}} this.$('.rules-detail').html(h);},
		readClinicContext:function () {return {team:this.$('[name=clinic-team]').val(), format:this.$('[name=clinic-format]').val(), field:this.$('[name=clinic-field]').val(), aura:this.$('[name=clinic-aura]').val()};},
		clinicEdited:function () {this.pendingClinic = null; this.clinicResult = null; this.clinicContext = null; this.$('.clinic-results').empty(); this.$('.rules-status').text('The team or planning conditions changed. Check again before sending a set.');},
		checkClinic:function () {var context = Object.freeze(this.readClinicContext()), id = Date.now().toString(36) + '-' + (this.clinicSequence = (this.clinicSequence || 0) + 1); this.clinicResult = null; this.clinicContext = null; this.$('.clinic-results').empty(); this.pendingClinic = Object.freeze({id:id, context:context}); this.$('.rules-status').text('Checking with the server validator…'); app.send('/rulesencyclopedia ' + JSON.stringify(Object.assign({action:'clinic', requestId:id}, context)));},
		renderClinic:function (d, context) {this.clinicResult = d; this.clinicContext = context; this.$('.rules-status').text(''); var h = '<h3>' + (!d.checked ? 'Check incomplete' : d.errors.length ? 'Validator found issues' : 'Valid for ' + esc(d.format)) + '</h3><ul>' + d.errors.map(function (e) {return '<li>' + esc(e) + '</li>';}).join('') + '</ul>'; if (d.proposals.length)h += '<h4>Corrections you can apply</h4><ul>' + d.proposals.map(function (p) {return '<li>' + esc(p) + '</li>';}).join('') + '</ul>'; h += (d.sets || []).map(function (s, i) {return '<section><h4>' + esc(s.name) + '</h4><button class="button" name="clinicCalculator" value="' + i + '">Inspect this set in calculator</button>' + (s.naturePower ? '<p>Nature Power calls <strong>' + esc(s.naturePower) + '</strong> in these planning conditions.</p>' : '') + (s.interactions || []).map(function (r) {return '<p><strong>' + esc(r.name) + ':</strong> ' + esc(r.effects.join(' ') || 'Interaction detail pending review.') + '</p>';}).join('') + '</section>';}).join(''); h += '<h4>Supported role checks</h4><p>Missing means not found by this check, not that your team needs this role.</p>' + (d.checks || []).map(function (c) {return '<p><strong>' + esc(c.role) + ':</strong> ' + esc(c.missing ? 'Not found' : c.evidence.join(', ')) + '<br><small>' + esc(c.scope) + '</small></p>';}).join(''); if (d.forecast)h += '<details open><summary>Conditional field forecast</summary><p>' + esc(d.forecast.notice) + '</p><ul>' + d.forecast.rules.map(function (r) {return '<li>' + esc(r) + '</li>';}).join('') + '</ul></details>'; this.$('.clinic-results').html(h + '<p>' + esc(d.notice || 'No changes were made.') + '</p>');},
		clinicCalculator:function (index) {if (!this.clinicResult || !this.clinicContext || JSON.stringify(this.readClinicContext()) !== JSON.stringify(this.clinicContext)) {this.$('.rules-status').text('The team or planning conditions changed. Check again before sending a set.'); return;} var set = this.clinicResult.sets[Number(index)].calculatorSet; app.pendingCalculatorSet = {slot:0, set:JSON.parse(JSON.stringify(set))}; app.pendingClinicConditions = {field:this.clinicContext.field, aura:this.clinicContext.aura}; app.rooms[''].customCalculator(); var r = app.rooms.calculator; if (r.metadata)r.acceptTeamBuilderSet();}, ruleGuide:function (id) {window.openPublicFieldGuide(id);}, clinicGuide:function () {window.openPublicFieldGuide(this.$('[name=clinic-field]').val());},
		close:function () {app.leaveRoom(this.id);}
	});
})();

(function () {[window.CustomCalculatorPopup.prototype, window.CustomCalculatorRoom.prototype].forEach(function (p) {var accept = p.acceptTeamBuilderSet; p.acceptTeamBuilderSet = function () {var out = accept.apply(this, arguments), c = app.pendingClinicConditions; if (c && !app.pendingCalculatorSet) {this.$('[name=calc-field]').val(c.field); this.$('[name=calc-aura]').val(c.aura); this.scenarioEdited(); app.pendingClinicConditions = null; this.$('.calc-status').text('Copied from the clinic. Source team unchanged; passives follow the selected species/form.'); if (!this.$('[name=returnClinic]').length) this.$('.calc-status').after('<button class="button" name="returnClinic">Back to team clinic</button>');} return out;}; p.returnClinic = function () {app.focusRoom('customrules');};});})();

// Command-only single-action sandbox; all execution stays in the validated calculator worker.
(function () {
	var base = window.CustomCalculatorRoom.prototype, esc = BattleLog.escapeHTML;
	window.openInteractionTest = function () {if (!app.rooms.interactiontest)app.addRoom('interactiontest', window.InteractionTestRoom, true, 'Interaction test'); app.focusRoom('interactiontest'); app.topbar.updateTabbar();};
	window.InteractionTestRoom = window.CustomCalculatorRoom.extend({
		type:'interactiontest', title:'Interaction test',
		events:Object.assign({}, base.events, {'change [name=test-sample]':'showInteractionSample'}),
		initialize:function () {base.initialize.call(this); this.$el.addClass('interaction-test'); this.$el.attr('aria-label', 'Interaction sandbox');},
		remove:function () {clearTimeout(this.calcTimer); return Room.prototype.remove.call(this);},
		renderCalculator:function () {base.renderCalculator.call(this); this.$('h2').first().text('Interaction sandbox'); this.$('.calc-intro').text('Choose an engine scenario and run one selected action. Outcomes are sampled, not exact probabilities.'); this.$('.calc-comparison-moves,.calc-compare-all').hide(); this.$('[name=calculate]').text('Run selected action'); this.$('[name=calc-samples]').val('8'); this.$('.calc-center').prepend('<section class="interaction-controls"><h3>One action, observed outcomes</h3><p>Species determine passives. Arbitrary active abilities are hypothetical overrides, not a legality approval. No opponent turn or end-of-turn effects are simulated.</p><label>Move to execute<input class="textbox" name="test-move" list="interaction-moves" value="Tackle"></label><datalist id="interaction-moves">' + (this.metadata.moves || []).map(function (m) {var n = typeof m === 'string' ? m : m.name; return '<option value="' + esc(n) + '">';}).join('') + '</datalist><label>Starting state<select name="test-mode"><option value="fresh-entry">Fresh entry — switch-in effects run</option><option value="public-state">Bounded public state — no entry replay</option></select></label><details><summary>Supported defender state</summary><label><input type="checkbox" name="test-protect"> Protect already active</label><label>Remaining Substitute HP<input type="number" min="0" name="test-substitute" value="0"></label><label><input type="checkbox" name="test-decoy"> Decoy Pincers already consumed</label></details><p class="muted">Public-state mode accepts only the engine’s reviewed abilities/items and statuses. Unknown history, arbitrary suppression inputs and other unlisted state are rejected. Use Gastro Acid to inspect suppression as the executed action.</p></section>'); this.$('[name=calc-move]').closest('label').hide(); this.$('.interaction-controls').append(this.$('[name=calculate]').detach().show()); this.$('.interaction-controls').after(this.$('.calc-results').detach().show()); this.scenarioEdited();},
		scenario:function () {var s = base.scenario.call(this); s.move = this.$('[name=test-move]').val() || s.move; s.evaluationMode = this.$('[name=test-mode]').val() || 'fresh-entry'; s.actors[0].moves = [s.move]; s.actors[1].protect = this.$('[name=test-protect]').is(':checked'); s.actors[1].substituteHP = Number(this.$('[name=test-substitute]').val() || 0); s.actors[1].decoyPincersSpent = this.$('[name=test-decoy]').is(':checked'); return s;},
		calculate:function () {var snapshot = JSON.stringify(this.scenario()); this.pendingScenario = {json:snapshot, revision:this.scenarioRevision}; this.$('.calc-status').removeClass('calc-error').text('Executing sampled engine actions…'); this.$('[name=calculate]').prop('disabled', true); this.requestCalculator(snapshot);},
		receiveCalculator:function (data) {if (!this.requestId || data.requestId !== this.requestId) return; clearTimeout(this.calcTimer); this.$('[name=calculate]').prop('disabled', false); if (data.error) {this.$('.calc-status').addClass('calc-error').text(data.error); return;} if (data.formats) {this.metadata = data; this.renderCalculator(); return;} if (!this.pendingScenario || this.pendingScenario.json !== JSON.stringify(this.scenario())) return; this.interactionResult = data; this.$('.calc-status').text(data.samples + ' sampled executions · seed ' + data.seed + '. Frequencies are not exact probabilities.'); this.$('.calc-results').html('<h3>' + esc(data.move) + '</h3>' + this.renderResolvedSummary(data.resolved) + '<label>Inspect execution<select name="test-sample">' + data.actionOutcomes.map(function (o, i) {return '<option value="' + i + '">Sample ' + (i + 1) + '</option>';}).join('') + '</select></label><div class="interaction-outcome"></div><details><summary>Scope and limitations</summary><ul>' + data.assumptions.map(function (a) {return '<li>' + esc(a) + '</li>';}).join('') + '</ul></details>'); this.showInteractionSample();},
		showInteractionSample:function () {var r = this.interactionResult; if (!r) return; var o = r.actionOutcomes[Number(this.$('[name=test-sample]').val()) || 0]; var html = '<p>Field: ' + esc(o.before.field || 'none') + ' → ' + esc(o.after.field || 'none') + '<br>Aura: ' + esc(o.before.aura || 'none') + ' → ' + esc(o.after.aura || 'none') + '<br>Weather: ' + esc(o.before.weather || 'none') + ' → ' + esc(o.after.weather || 'none') + '</p>'; o.after.actors.forEach(function (a, i) {var b = o.before.actors[i], changes = Object.keys(a.boosts).filter(function (k) {return a.boosts[k] !== b.boosts[k];}).map(function (k) {return k + ' ' + b.boosts[k] + ' → ' + a.boosts[k];}); html += '<article class="interaction-actor-outcome"><strong>' + esc(r.results[i].label) + '</strong><p>HP ' + b.hp + ' → ' + a.hp + ' / ' + a.maxhp + '; status ' + esc(b.status || 'none') + ' → ' + esc(a.status || 'none') + '; ability suppressed ' + (a.abilitySuppressed ? 'yes' : 'no') + '</p><p>' + esc(changes.join(', ') || 'No stage change.') + ' Substitute ' + b.substituteHP + ' → ' + a.substituteHP + '</p></article>';}); html += '<details open><summary>Actual engine messages for this sample</summary><pre>' + esc((o.log || []).join('\n')) + '</pre></details>'; this.$('.interaction-outcome').html(html);}
	});
})();
