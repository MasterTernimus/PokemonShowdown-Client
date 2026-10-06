(function (exports, $) {

	// this is a useful global
	var teams;

	exports.TeambuilderRoom = exports.Room.extend({
		type: 'teambuilder',
		title: 'Teambuilder',
		initialize: function () {
			teams = Storage.teams;

			// left menu
			this.$el.addClass('ps-room-light').addClass('scrollable');
			if (!Storage.whenTeamsLoaded.isLoaded) {
				Storage.whenTeamsLoaded(this.update, this);
			}
			this.update();
			if (typeof Storage.prefs('uploadprivacy') !== 'undefined') {
				this.$('input[name=teamprivacy]').is('checked', Storage.prefs('uploadprivacy'));
			}
		},
		focus: function () {
			if (this.curTeam) {
				this.curTeam.iconCache = '!';
				this.curTeam.gen = this.getGen(this.curTeam.format);
				this.curTeam.dex = Dex.forGen(this.curTeam.gen);
				if (this.curTeam.format.includes('letsgo')) {
					this.curTeam.dex = Dex.mod('gen7letsgo');
				}
				if (this.curTeam.format.includes('bdsp')) {
					this.curTeam.dex = Dex.mod('gen8bdsp');
				}
				Storage.activeSetList = this.curSetList;
			}
		},
		blur: function () {
			if (this.saveFlag) {
				this.saveFlag = false;
				app.user.trigger('saveteams');
			}
		},
		events: {
			'input .roster-species-search': 'searchRosterSpecies',
			'input .roster-import-text, .roster-import-name': 'cancelRosterImport',
			'change .roster-profile-select': 'rosterProfileChange',
			'change .roster-quick-select': 'rosterQuickChange',
			'change .roster-profile-filter': 'rosterFilterChange',
			'change .pokemon-picker-option': 'pokemonPickerChange',
			// team changes
			'change input.teamnameedit': 'teamNameChange',
			'click button.formatselect': 'selectFormat',
			'change input[name=nickname]': 'nicknameChange',

			// misc
			'click input[name=teamprivacy]': 'privacyChange',

			// details
			'change .detailsform input': 'detailsChange',
			'change .detailsform select': 'detailsChange',
			'submit .detailsform': 'detailsChange',
			'click .changeform' : 'altForm',
			'click .altform' : 'altForm',

			// stats
			'keyup .statform input.numform': 'statChange',
			'input .statform input[type=number].numform': 'statChange',
			'change select[name=nature]': 'natureChange',
			'change select[name=ivspread]': 'ivSpreadChange',
			'change .evslider': 'statSlided',
			'input .evslider': 'statSlide',

			// teambuilder events
			'click .utilichart a': 'chartClick',
			'keydown .chartinput': 'chartKeydown',
			'keyup .chartinput': 'chartKeyup',
			'focus .chartinput': 'chartFocus',
			'blur .chartinput': 'chartChange',
			'keyup .searchinput': 'searchChange',

			// drag/drop
			'click .team': 'edit',
			'click .selectFolder': 'selectFolder',
			'mouseover .team': 'mouseOverTeam',
			'mouseout .team': 'mouseOutTeam',
			'dragstart .team': 'dragStartTeam',
			'dragend .team': 'dragEndTeam',
			'dragenter .team': 'dragEnterTeam',
			'dragenter .folder .selectFolder': 'dragEnterFolder',
			'dragleave .folder .selectFolder': 'dragLeaveFolder',
			'dragexit .folder .selectFolder': 'dragExitFolder',

			// clipboard
			'click .teambuilder-clipboard-data .result': 'clipboardResultSelect',
			'click .teambuilder-clipboard-data': 'clipboardExpand',
			'blur .teambuilder-clipboard-data': 'clipboardShrink'
		},
		dispatchClick: function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (this[e.currentTarget.value]) this[e.currentTarget.value](e);
		},
		back: function () {
			if (this.profilesView) {
				this.profilesView = false;
				this.update();
				if (this.curSet) this.updateChart(true);
				return;
			}
			if (this.exportMode) {
				if (this.curTeam) {
					this.curTeam.team = Storage.packTeam(this.curSetList);
					Storage.saveTeam(this.curTeam);
				}
				this.exportMode = false;
			} else if (this.curSet) {
				this.curSet = null;
				Storage.saveTeam(this.curTeam);
			} else if (this.curTeam) {
				this.curTeam.team = Storage.packTeam(this.curSetList);
				this.curTeam.iconCache = '';
				var team = this.curTeam;
				this.curTeam = null;
				Storage.activeSetList = this.curSetList = null;
				Storage.saveTeam(team);
			} else {
				return;
			}
			app.user.trigger('saveteams');
			this.update();
		},

		// the teambuilder has three views:
		// - team list (curTeam falsy)
		// - team view (curTeam exists, curSet falsy)
		// - set view (curTeam exists, curSet exists)

		curTeam: null,
		curTeamLoc: 0,
		curSet: null,
		curSetLoc: 0,

		// curFolder will have '/' at the end if it's a folder, but
		// it will be alphanumeric (so guaranteed no '/') if it's a
		// format
		// Special values:
		// '' -     show all
		// 'gen9' - show teams with no format
		// '/' -    show teams with no folder
		curFolder: '',
		curFolderKeep: '',
		curSearchVal: '',

		exportMode: false,
		formatResources: {},
		update: function () {
			if (this.profilesView) return this.showRosterProfiles();
			teams = Storage.teams;
			if (this.curTeam) {
				if (this.curTeam.format && !this.formatResources[this.curTeam.format]) {
					this.tryLoadFormatResource(this.curTeam.format);
				}
				if (this.curTeam.loaded === false || (this.curTeam.teamid && !this.curTeam.loaded)) {
					this.loadTeam();
					return this.updateTeamView();
				}
				this.ignoreEVLimits = (this.curTeam.gen < 3 ||
					((this.curTeam.format.includes('hackmons') || this.curTeam.format.endsWith('bh')) && this.curTeam.gen !== 6) ||
					this.curTeam.format.includes('metronomebattle'));
				if (this.curSet) {
					return this.updateSetView();
				}
				return this.updateTeamView();
			}
			return this.updateTeamInterface();
		},

		privacyChange: function (ev) {
			Storage.prefs('uploadprivacy', ev.currentTarget.checked);
		},

		loadTeam: function () {
			if (this.loadingTeam) return false;
			this.loadingTeam = true;
			var teambuilder = this;
			app.loadTeam(this.curTeam, function (team) {
				window.builderTeam = team;
				teambuilder.loadingTeam = false;
				teambuilder.curSetList = Storage.unpackTeam(team.team);
				Storage.activeSetList = teambuilder.curSetList;
				teambuilder.curTeam.team = Storage.packTeam(teambuilder.curSetList);
				teambuilder.updateTeamView();
			});
		},

		tryLoadFormatResource: function (format) {
			var teambuilder = this;
			if (format in teambuilder.formatResources) { // already loading, bypass
				return;
			}
			teambuilder.formatResources[format] = true; // true - loading, array - loaded
			$.get('https://www.smogon.com/dex/api/formats/by-ps-name/' + format, {}, function (data) {
				// if the data doesn't exist, set it to true so it stops trying to load it
				teambuilder.formatResources[format] = data || true;
				teambuilder.update();
			});
		},

		/*********************************************************
		 * Team list view
		 *********************************************************/

		deletedTeam: null,
		deletedTeamLoc: -1,
		updateTeamInterface: function () {
			this.deletedSet = null;
			this.deletedSetLoc = -1;

			var buf = '';

			if (this.exportMode) {
				if (this.curFolder) {
					buf = '<div class="pad"><button name="back" class="button"><i class="fa fa-chevron-left"></i> List</button></div>';
					buf += '<div class="teamedit"><textarea readonly class="textbox" rows="17">' + BattleLog.escapeHTML(Storage.exportFolder(this.curFolder)) + '</textarea></div>';
				} else {
					buf = '<div class="pad"><button name="back" class="button"><i class="fa fa-chevron-left"></i> List</button> <button name="saveBackup" class="savebutton button"><i class="fa fa-floppy-o"></i> Save</button></div>';
					buf += '<div class="teamedit"><textarea class="textbox" rows="17">';
					if (Storage.teams.length > 350) {
						buf += BattleLog.escapeHTML(Storage.getPackedTeams());
					} else {
						buf += BattleLog.escapeHTML(Storage.exportAllTeams());
					}
					buf += '</textarea></div>';
				}
				this.$el.html(buf);
				this.$('.teamedit textarea').focus().select();
				return;
			}

			if (!Storage.whenTeamsLoaded.isLoaded) {
				if (Storage.whenTeamsLoaded.error === 'stalled') {
					buf = '<div class="pad"><p class="message-error">We\'re having some trouble loading teams securely.</p>';
					buf += '<p>This is sometimes caused by antiviruses like Avast and BitDefender.</p>';
					buf += '<p><strong>If you\'re using Firefox and an antivirus:</strong> Your antivirus is trying to scan your teams, and a recent Firefox update doesn\'t let it. Turn off HTTPS scanning in your antivirus or uninstall your antivirus, and your teams will come back.</p>';
					buf += '<p>You can use the teambuilder insecurely, but any teams you\'ve saved securely won\'t be there.</p>';
					buf += '<p><button class="button" name="insecureUse">Use teambuilder insecurely</button></p></div>';
				} else if (Storage.whenTeamsLoaded.error) {
					buf = '<div class="pad"><p class="message-error">We got an error trying to load teams: ' + Storage.whenTeamsLoaded.error.message + '.</p>';
					buf += '<p>This might be because you didn\'t give us permission to load teams: on macOS, this is in System Preferences → Security &amp; Privacy → Privacy → Files and Folders → Pokemon Showdown</p></div>';
				} else {
					buf = '<div class="pad"><p>lol zarel this is a horrible teambuilder</p>';
					buf += '<p>that\'s because we\'re not done loading it...</p></div>';
				}
				this.$el.html(buf);
				return;
			}

			// folderpane
			buf = '<div class="folderpane">';
			buf += '</div>';

			// teampane
			buf += '<div class="teampane">';
			buf += '</div>';

			this.$el.html(buf);

			this.updateFolderList();
			this.updateTeamList();
		},
		insecureUse: function () {
			Storage.whenTeamsLoaded.load();
			this.updateTeamInterface();
		},
		updateFolderList: function () {
			var buf = '<div class="folderlist"><div class="folderlistbefore"></div>';

			buf += '<div class="folder' + (!this.curFolder ? ' cur"><div class="folderhack3"><div class="folderhack1"></div><div class="folderhack2"></div>' : '">') + '<div class="selectFolder" data-value="all"><em>(all)</em></div></div>' + (!this.curFolder ? '</div>' : '');
			var folderTable = {};
			var folders = [];
			if (Storage.teams) for (var i = -2; i < Storage.teams.length; i++) {
				if (i >= 0) {
					var folder = Storage.teams[i].folder;
					if (folder && !((folder + '/') in folderTable)) {
						folders.push('Z' + folder);
						folderTable[folder + '/'] = 1;
						if (!('/' in folderTable)) {
							folders.push('Z~');
							folderTable['/'] = 1;
						}
					}
				}

				var format;
				if (i === -2) {
					format = this.curFolderKeep;
				} else if (i === -1) {
					format = this.curFolder;
				} else {
					format = Storage.teams[i].format;
					if (!format) format = 'gen9';
				}
				if (!format) continue;
				if (format in folderTable) continue;
				folderTable[format] = 1;
				if (format.slice(-1) === '/') {
					folders.push('Z' + (format.slice(0, -1) || '~'));
					if (!('/' in folderTable)) {
						folders.push('Z~');
						folderTable['/'] = 1;
					}
					continue;
				}
				if (format === 'gen9') {
					folders.push('A~');
					continue;
				}
				switch (format.slice(0, 4)) {
				case 'gen1': format = 'I' + format.slice(4); break;
				case 'gen2': format = 'H' + format.slice(4); break;
				case 'gen3': format = 'G' + format.slice(4); break;
				case 'gen4': format = 'F' + format.slice(4); break;
				case 'gen5': format = 'E' + format.slice(4); break;
				case 'gen6': format = 'D' + format.slice(4); break;
				case 'gen7': format = 'C' + format.slice(4); break;
				case 'gen8': format = 'B' + format.slice(4); break;
				case 'gen9': format = 'A' + format.slice(4); break;
				default: format = 'X' + format; break;
				}
				folders.push(format);
			}
			folders.sort();
			var gen = '';
			var formatFolderBuf = '<div class="foldersep"></div>';
			formatFolderBuf += '<div class="folder"><div class="selectFolder" data-value="+"><i class="fa fa-plus"></i><em>(add format folder)</em></div></div>';
			for (var i = 0; i < folders.length; i++) {
				var format = folders[i];
				var newGen;
				switch (format.charAt(0)) {
				case 'I': newGen = '1'; break;
				case 'H': newGen = '2'; break;
				case 'G': newGen = '3'; break;
				case 'F': newGen = '4'; break;
				case 'E': newGen = '5'; break;
				case 'D': newGen = '6'; break;
				case 'C': newGen = '7'; break;
				case 'B': newGen = '8'; break;
				case 'A': newGen = '9'; break;
				case 'X': newGen = 'X'; break;
				case 'Z': newGen = '/'; break;
				}
				if (gen !== newGen) {
					gen = newGen;
					if (gen === '/') {
						buf += formatFolderBuf;
						formatFolderBuf = '';
						buf += '<div class="foldersep"></div>';
						buf += '<div class="folder"><h3>Folders</h3></div>';
					} else if (gen === 'X') {
						buf += '<div class="folder"><h3>???</h3></div>';
					} else {
						buf += '<div class="folder"><h3>Gen ' + gen + '</h3></div>';
					}
				}
				var formatName;
				if (gen === '/') {
					formatName = format.slice(1);
					format = formatName + '/';
					if (formatName === '~') {
						formatName = '(uncategorized)';
						format = '/';
					} else {
						formatName = BattleLog.escapeHTML(formatName);
					}
					buf += '<div class="folder' + (this.curFolder === format ? ' cur"><div class="folderhack3"><div class="folderhack1"></div><div class="folderhack2"></div>' : '">') + '<div class="selectFolder" data-value="' + format + '"><i class="fa ' + (this.curFolder === format ? 'fa-folder-open' : 'fa-folder') + (format === '/' ? '-o' : '') + '"></i>' + formatName + '</div></div>' + (this.curFolder === format ? '</div>' : '');
					continue;
				}
				formatName = format.slice(1);
				if (formatName === '~') formatName = '';
				format = 'gen' + newGen + formatName;
				if (format.length === 4) formatName = '(uncategorized)';
				// folders are <div>s rather than <button>s because in theory it has
				// less weird interactions with HTML5 drag-and-drop
				buf += '<div class="folder' + (this.curFolder === format ? ' cur"><div class="folderhack3"><div class="folderhack1"></div><div class="folderhack2"></div>' : '">') + '<div class="selectFolder" data-value="' + format + '"><i class="fa ' + (this.curFolder === format ? 'fa-folder-open-o' : 'fa-folder-o') + '"></i>' + formatName + '</div></div>' + (this.curFolder === format ? '</div>' : '');
			}
			buf += formatFolderBuf;
			buf += '<div class="foldersep"></div>';
			buf += '<div class="folder"><div class="selectFolder" data-value="++"><i class="fa fa-plus"></i><em>(add folder)</em></div></div>';

			buf += '<div class="folderlistafter"></div></div>';

			this.$('.folderpane').html(buf);
		},
		updateTeamList: function (resetScroll) {
			var teams = Storage.teams;
			var buf = '';

			// teampane
			buf += '<p><button class="button big" name="showToolsManager">Library: names, sets & lists</button></p>';
			buf += this.clipboardHTML();

			var filterFormat = '';

			// filterFolder === undefined: show teams in any folder
			// filterFolder === '': show only teams that don't have a folder
			var filterFolder;

			if (!this.curFolder) {
				buf += '<h2>Hi</h2>';
				buf += '<p>Did you have a good day?</p>';
				buf += '<p><button class="button" name="greeting" value="Y"><i class="fa fa-smile-o"></i> Yes, my day was pretty good</button> <button class="button" name="greeting" value="N"><i class="fa fa-frown-o"></i> No, it wasn\'t great</button></p>';
				buf += '<h2>All teams <small style="font-weight: normal">(' + teams.length + ')</small></h2>';
			} else {
				if (this.curFolder.slice(-1) === '/') {
					filterFolder = this.curFolder.slice(0, -1);
					if (filterFolder) {
						buf += '<h2><i class="fa fa-folder-open"></i> ' + filterFolder + ' <button class="button small" style="margin-left:5px" name="renameFolder"><i class="fa fa-pencil"></i> Rename</button> <button class="button small" style="margin-left:5px" name="promptDeleteFolder"><i class="fa fa-times"></i> Remove</button></h2>';
					} else {
						buf += '<h2><i class="fa fa-folder-open-o"></i> Teams not in any folders</h2>';
					}
				} else {
					filterFormat = this.curFolder;
					var func = function (team) {
						return team.format === filterFormat;
					};
					buf += '<h2><i class="fa fa-folder-open-o"></i> ' + filterFormat + ' <small style="font-weight: normal">(' + teams.filter(func).length + ')</small></h2>';
				}
			}

			var newTeamButtonText = "New Team";
			if (filterFolder) newTeamButtonText = "New Team in folder";
			if (filterFormat && filterFormat !== 'gen9') {
				newTeamButtonText = "New " + BattleLog.escapeFormat(filterFormat) + " Team";
			}
			buf += '<p><button name="newTop" value="team" class="button big"><i class="fa fa-plus-circle"></i> ' + newTeamButtonText + '</button> ' +
				'<button name="newTop" value="box" class="button big"><i class="fa fa-archive"></i> New Box</button> ' +
				'<input type="text" id="teamSearchBar" name="search" class="textbox searchinput" value="' + this.curSearchVal + '" placeholder="search teams"/></p>';

			buf += '<ul class="teamlist">';
			var atLeastOne = false;

			try {
				if (!window.localStorage && !window.nodewebkit) buf += '<li>== CAN\'T SAVE ==<br /><small>Your browser doesn\'t support <code>localStorage</code> and can\'t save teams! Update to a newer browser.</small></li>';
			} catch (e) {
				buf += '<li>== CAN\'T SAVE ==<br /><small><code>Cookies</code> are disabled so you can\'t save teams! Enable them in your browser settings.</small></li>';
			}
			if (Storage.cantSave) buf += '<li>== CAN\'T SAVE ==<br /><small>You hit your browser\'s limit for team storage! Please backup them and delete some of them. Your teams won\'t be saved until you\'re under the limit again.</small></li>';
			if (!teams.length) {
				if (this.deletedTeamLoc >= 0) {
					buf += '<li><button name="undoDelete"><i class="fa fa-undo"></i> Undo Delete</button></li>';
				}
				buf += '<li><p><em>you don\'t have any teams lol</em></p></li>';
			} else {

				for (var i = 0; i < teams.length + 1; i++) {
					if (i === this.deletedTeamLoc) {
						if (!atLeastOne) atLeastOne = true;
						buf += '<li><button name="undoDelete"><i class="fa fa-undo"></i> Undo Delete</button></li>';
					}
					if (i >= teams.length) break;

					var team = teams[i];

					if (team && !team.team && team.team !== '') {
						team = null;
					}
					if (!team) {
						buf += '<li>Error: A corrupted team was dropped</li>';
						teams.splice(i, 1);
						i--;
						if (this.deletedTeamLoc && this.deletedTeamLoc > i) this.deletedTeamLoc--;
						continue;
					}

					if (filterFormat && filterFormat !== (team.format || 'gen9')) continue;
					if (filterFolder !== undefined && filterFolder !== team.folder) continue;

					if (this.curSearchVal) {
						// If a Pokemon hasn't been given a nickname, species is omitted
						// from the packed team.team in favor of the name field
						// since the name defaults to the species' display name.
						// While eliminating this redundancy between name and species
						// helps with packed team size, the display name unfortunately
						// won't match the ID search term and so we need to special case
						// searching for Pokemon here
						var pokemon = team.team.split(']').map(function (el) {
							return toID(PSUtils.splitFirst(el, '|')[0]);
						});
						var searchVal = this.curSearchVal.split(',').map(function (el) {
							return toID(el);
						});
						var meetsCriteria = searchVal.every(function (el) {
							return team.team.indexOf(el) > -1 || pokemon.includes(el);
						});
						if (!meetsCriteria) continue;
					}

					if (!atLeastOne) atLeastOne = true;
					var formatText = '';
					if (team.format) {
						formatText = '[' + team.format + '] ';
					}
					if (team.folder) formatText += team.folder + '/';

					// teams and boxes are <div>s rather than <button>s because Firefox doesn't
					// support dragging and dropping buttons.
					buf += '<li><div name="edit" data-value="' + i + '" class="team';
					if (team.capacity === 24) buf += ' pc-box';
					buf += '" draggable="true">' + formatText + '<strong>' + BattleLog.escapeHTML(team.name) + '</strong><br /><small>';
					buf += Storage.getTeamIcons(team);
					buf += '</small></div><button name="edit" value="' + i + '"><i class="fa fa-pencil" aria-label="Edit" title="Edit (you can also just click on the team)"></i></button><button name="duplicate" value="' + i + '" title="Duplicate" aria-label="Duplicate"><i class="fa fa-clone"></i></button><button name="delete" value="' + i + '"><i class="fa fa-trash"></i> Delete</button></li>';

				}
				if (!atLeastOne) {
					if (filterFolder) {
						buf += '<li><p><em>you don\'t have any teams in this folder lol</em></p></li>';
					} else {
						buf += '<li><p><em>you don\'t have any ' + this.curFolder + ' teams lol</em></p></li>';
					}
				}
			}

			buf += '</ul><p>';
			if (atLeastOne) {
				buf += '<button name="new" value="team" class="button"><i class="fa fa-plus-circle"></i> ' + newTeamButtonText + '</button> <button name="new" value="box" class="button"><i class="fa fa-archive"></i> New Box</button> ';
			}
			buf += '<button class="button" name="send" value="/teams">View teams uploaded to server</button>';
			buf += '</p>';

			if (window.nodewebkit) {
				buf += '<button name="revealFolder" class="button"><i class="fa fa-folder-open"></i> Reveal teams folder</button> <button name="reloadTeamsFolder" class="button"><i class="fa fa-refresh"></i> Reload teams files</button> <button name="backup" class="button"><i class="fa fa-upload"></i> Backup/Restore all teams</button>';
			} else if (this.curFolder) {
				buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Backup all teams from this folder</button>';
			} else if (atLeastOne) {
				buf += '<p><strong>Clearing your cookies (specifically, <code>localStorage</code>) will delete your teams.</strong> ';
				buf += '<span class="storage-warning">Browsers sometimes randomly clear cookies - you should upload your teams to the Showdown database ';
				buf += 'or make a backup yourself if you want to make sure you don\'t lose them.</span></p>';
				buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Backup/Restore all teams</button>';
				buf += '<p>If you want to clear your cookies or <code>localStorage</code>, you can use the Backup/Restore feature to save your teams as text first.</p>';
				var self = this;
				if (navigator.storage && navigator.storage.persisted) {
					navigator.storage.persisted().then(function (state) {
						self.updatePersistence(state);
					});
				}
			} else {
				buf += '<button name="backup" class="button"><i class="fa fa-upload"></i> Restore teams from backup</button>';
			}

			var $pane = this.$('.teampane');
			$pane.html(buf);
			if (resetScroll) {
				$pane.scrollTop(0);
			} else if (this.teamScrollPos) {
				$pane.scrollTop(this.teamScrollPos);
				this.teamScrollPos = 0;
			}

			//reset focus to searchbar
			var teamSearchBar = this.$("#teamSearchBar");
			var strLength = teamSearchBar.val().length;
			if (strLength) {
				teamSearchBar.focus();
				teamSearchBar[0].setSelectionRange(strLength, strLength);
			}
		},
		updatePersistence: function (state) {
			if (state) {
				this.$('.storage-warning').html('');
				return;
			}
		},
		greeting: function (answer, button) {
			var buf = '<p><strong>' + $(button).html() + '</p></strong>';
			if (answer === 'N') {
				buf += '<p>Aww, that\'s too bad. :( I hope playing on Pok&eacute;mon Showdown today can help cheer you up!</p>';
			} else if (answer === 'Y') {
				buf += '<p>Cool! I just added some pretty cool teambuilder features, so I\'m pretty happy, too. Did you know you can drag and drop teams to different format-folders? You can also drag and drop them to and from your computer (works best in Chrome).</p>';
				buf += '<p><button class="button" name="greeting" value="W"><i class="fa fa-question-circle"></i> Wait, who are you? Talking to a teambuilder is weird.</button></p>';
			} else if (answer === 'W') {
				buf += '<p>Oh, I\'m Zarel! I made a Credits button for this...</p>';
				buf += '<div class="menugroup"><p><a href="//pokemonshowdown.com/credits" target="_blank"><button class="button mainmenu4"><i class="fa fa-info-circle"></i> Credits</button></a></p></div>';
				buf += '<p>Isn\'t it pretty? Matches your background and everything. It used to be in the Main Menu but we had to get rid of it to save space.</p>';
				buf += '<p>Speaking of, you should try <button class="button" name="background"><i class="fa fa-picture-o"></i> changing your background</button>.';
				buf += '<p><button class="button" name="greeting" value="B"><i class="fa fa-hand-pointer-o"></i> You might be having too much fun with these buttons and icons</button></p>';
			} else if (answer === 'B') {
				buf += '<p>I paid good money for those icons! I need to get my money\'s worth!</p>';
				buf += '<p><button class="button" name="greeting" value="WR"><i class="fa fa-exclamation-triangle"></i> Wait, really?</button></p>';
			} else if (answer === 'WR') {
				buf += '<p>No, they were free. That just makes it easier to get my money\'s worth. Let\'s play rock paper scissors!</p>';
				buf += '<p><button class="button" name="greeting" value="RR"><i class="fa fa-hand-rock-o"></i> Rock</button> <button class="button" name="greeting" value="RP"><i class="fa fa-hand-paper-o"></i> Paper</button> <button class="button" name="greeting" value="RS"><i class="fa fa-hand-scissors-o"></i> Scissors</button> <button class="button" name="greeting" value="RL"><i class="fa fa-hand-lizard-o"></i> Lizard</button> <button class="button" name="greeting" value="RK"><i class="fa fa-hand-spock-o"></i> Spock</button></p>';
			} else if (answer[0] === 'R') {
				buf += '<p>I play laser, I win. <i class="fa fa-hand-o-left"></i></p>';
				buf += '<p><button class="button" name="greeting" value="YC"><i class="fa fa-thumbs-o-down"></i> You can\'t do that!</button></p>';
			} else if (answer === 'SP') {
				buf += '<p>Okay, sure. I warn you, I\'m using the same RNG that makes Stone Edge miss for you.</p>';
				buf += '<p><button class="button" name="greeting" value="SP3"><i class="fa fa-caret-square-o-right"></i> I want to play Rock Paper Scissors</button> <button class="button" name="greeting" value="SP5"><i class="fa fa-caret-square-o-right"></i> I want to play Rock Paper Scissors Lizard Spock</button></p>';
			} else if (answer === 'SP3') {
				buf += '<p><button class="button" name="greeting" value="PR3"><i class="fa fa-hand-rock-o"></i> Rock</button> <button class="button" name="greeting" value="PP3"><i class="fa fa-hand-paper-o"></i> Paper</button> <button class="button" name="greeting" value="PS3"><i class="fa fa-hand-scissors-o"></i> Scissors</button></p>';
			} else if (answer === 'SP5') {
				buf += '<p><button class="button" name="greeting" value="PR5"><i class="fa fa-hand-rock-o"></i> Rock</button> <button class="button" name="greeting" value="PP5"><i class="fa fa-hand-paper-o"></i> Paper</button> <button class="button" name="greeting" value="PS5"><i class="fa fa-hand-scissors-o"></i> Scissors</button> <button class="button" name="greeting" value="PL5"><i class="fa fa-hand-lizard-o"></i> Lizard</button> <button class="button" name="greeting" value="PK5"><i class="fa fa-hand-spock-o"></i> Spock</button></p>';
			} else if (answer[0] === 'P') {
				var rpsChart = {
					R: 'rock',
					P: 'paper',
					S: 'scissors',
					L: 'lizard',
					K: 'spock'
				};
				var rpsWinChart = {
					SP: 'cuts',
					SL: 'decapitates',
					PR: 'covers',
					PK: 'disproves',
					RL: 'crushes',
					RS: 'crushes',
					LK: 'poisons',
					LP: 'eats',
					KS: 'smashes',
					KR: 'vaporizes'
				};
				var my = ['R', 'P', 'S', 'L', 'K'][Math.floor(Math.random() * Number(answer[2]))];
				var your = answer[1];
				buf += '<p>I play <i class="fa fa-hand-' + rpsChart[my] + '-o"></i> ' + rpsChart[my] + '!</p>';
				if ((my + your) in rpsWinChart) {
					buf += '<p>And ' + rpsChart[my] + ' ' + rpsWinChart[my + your] + ' ' + rpsChart[your] + ', so I win!</p>';
				} else if ((your + my) in rpsWinChart) {
					buf += '<p>But ' + rpsChart[your] + ' ' + rpsWinChart[your + my] + ' ' + rpsChart[my] + ', so you win...</p>';
				} else {
					buf += '<p>We played the same thing, so it\'s a tie.</p>';
				}
				if (!this.rpsScores || !this.rpsScores.length) {
					this.rpsScores = ['pi', '$3.50', '9.80665 m/s<sup>2</sup>', '28°C', '百万点', '<i class="fa fa-bitcoin"></i>0.0000174', '<s>priceless</s> <i class="fa fa-cc-mastercard"></i> MasterCard', '127.0.0.1', 'C&minus;, see me after class'];
				}
				var score = this.rpsScores.splice(Math.floor(Math.random() * this.rpsScores.length), 1)[0];
				buf += '<p>Score: ' + score + '</p>';
				buf += '<p><button class="button" name="greeting" value="SP' + answer[2] + '"><i class="fa fa-caret-square-o-right"></i> I demand a rematch!</button></p>';
			} else if (answer === 'YC') {
				buf += '<p>Okay, then I play peace sign <i class="fa fa-hand-peace-o"></i>, everyone signs a peace treaty, ending the war and ushering in a new era of prosperity.</p>';
				buf += '<p><button class="button" name="greeting" value="SP"><i class="fa fa-caret-square-o-right"></i> I wanted to play for real...</button></p>';
			}
			$(button).parent().replaceWith(buf);
		},
		background: function () {
			app.addPopup(CustomBackgroundPopup);
		},
		selectFolder: function (format) {
			if (format && format.currentTarget) {
				var e = format;
				format = $(e.currentTarget).data('value');
				e.preventDefault();
				if (format === '+') {
					e.stopImmediatePropagation();
					var self = this;
					app.addPopup(FormatPopup, {format: '', sourceEl: e.currentTarget, selectType: 'teambuilder', onselect: function (newFormat) {
						self.selectFolder(newFormat);
					}});
					return;
				}
				if (format === '++') {
					e.stopImmediatePropagation();
					var self = this;
					// app.addPopupPrompt("Folder name:", "Create folder", function (newFormat) {
					// 	self.selectFolder(newFormat + '/');
					// });
					app.addPopup(PromptPopup, {message: "Folder name:", button: "Create folder", sourceEl: e.currentTarget, callback: function (name) {
						name = $.trim(name);
						if (name.indexOf('/') >= 0 || name.indexOf('\\') >= 0) {
							app.addPopupMessage("Names can't contain slashes, since they're used as a folder separator.");
							name = name.replace(/[\\\/]/g, '');
						}
						if (name.indexOf('|') >= 0) {
							app.addPopupMessage("Names can't contain the character |, since they're used for storing teams.");
							name = name.replace(/\|/g, '');
						}
						if (!name) return;
						self.selectFolder(name + '/');
					}});
					return;
				}
			} else {
				this.curFolderKeep = format;
			}
			this.curFolder = (format === 'all' ? '' : format);
			this.updateFolderList();
			this.updateTeamList(true);
		},
		renameFolder: function () {
			if (!this.curFolder) return;
			if (this.curFolder.slice(-1) !== '/') return;
			var oldFolder = this.curFolder.slice(0, -1);
			var self = this;
			app.addPopup(PromptPopup, {message: "Folder name:", button: "Rename folder", value: oldFolder, callback: function (name) {
				name = $.trim(name);
				if (name.indexOf('/') >= 0 || name.indexOf('\\') >= 0) {
					app.addPopupMessage("Names can't contain slashes, since they're used as a folder separator.");
					name = name.replace(/[\\\/]/g, '');
				}
				if (name.indexOf('|') >= 0) {
					app.addPopupMessage("Names can't contain the character |, since they're used for storing teams.");
					name = name.replace(/\|/g, '');
				}
				if (!name) return;
				if (name === oldFolder) return;
				for (var i = 0; i < Storage.teams.length; i++) {
					var team = Storage.teams[i];
					if (team.folder !== oldFolder) continue;
					team.folder = name;
					if (window.nodewebkit) Storage.saveTeam(team);
				}
				if (!window.nodewebkit) Storage.saveTeams();
				self.selectFolder(name + '/');
			}});
		},
		promptDeleteFolder: function () {
			app.addPopup(DeleteFolderPopup, {folder: this.curFolder, room: this});
		},
		deleteFolder: function (format, addName) {
			if (format.slice(-1) !== '/') return;
			var oldFolder = format.slice(0, -1);
			if (this.curFolderKeep === oldFolder) {
				this.curFolderKeep = '';
			}
			for (var i = 0; i < Storage.teams.length; i++) {
				var team = Storage.teams[i];
				if (team.folder !== oldFolder) continue;
				team.folder = '';
				if (addName) team.name = oldFolder + ' ' + team.name;
				if (window.nodewebkit) Storage.saveTeam(team);
			}
			if (!window.nodewebkit) Storage.saveTeams();
			this.selectFolder('/');
		},
		show: function () {
			Room.prototype.show.apply(this, arguments);
			var $teamwrapper = this.$('.teamwrapper');
			var width = $(window).width();
			if (!$teamwrapper.length) return;
			if (width < 640 && !this.curSet) {
				var scale = (width / 640);
				$teamwrapper.css('transform', 'scale(' + scale + ')');
				$teamwrapper.addClass('scaled');
			} else {
				$teamwrapper.css('transform', 'none');
				$teamwrapper.removeClass('scaled');
			}
		},
		// button actions
		revealFolder: function () {
			Storage.revealFolder();
		},
		reloadTeamsFolder: function () {
			Storage.nwLoadTeams();
		},
		edit: function (i) {
			this.teamScrollPos = this.$('.teampane').scrollTop();
			if (i && i.currentTarget) {
				i = $(i.currentTarget).data('value');
			}
			i = +i;
			this.curTeam = teams[i];
			this.curTeam.iconCache = '!';
			this.curTeam.gen = this.getGen(this.curTeam.format);
			this.curTeam.dex = Dex.forGen(this.curTeam.gen);
			if (this.curTeam.format.includes('letsgo')) {
				this.curTeam.dex = Dex.mod('gen7letsgo');
			}
			if (this.curTeam.format.includes('bdsp')) {
				this.curTeam.dex = Dex.mod('gen8bdsp');
			}
			Storage.activeSetList = this.curSetList = Storage.unpackTeam(this.curTeam.team);
			this.curTeamIndex = i;
			this.update();
		},
		"delete": function (i) {
			i = +i;
			this.deletedTeamLoc = i;
			this.deletedTeam = teams.splice(i, 1)[0];
			for (var room in app.rooms) {
				var selection = app.rooms[room].$('button.teamselect').val();
				if (!selection || selection === 'random') continue;
				var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
				if (i < obj.curTeamIndex) {
					obj.curTeamIndex--;
				} else if (i === obj.curTeamIndex) {
					obj.curTeamIndex = -1;
				}
			}
			Storage.deleteTeam(this.deletedTeam);
			app.user.trigger('saveteams');
			this.updateTeamList();
		},
		undoDelete: function () {
			if (this.deletedTeamLoc >= 0) {
				teams.splice(this.deletedTeamLoc, 0, this.deletedTeam);
				for (var room in app.rooms) {
					var selection = app.rooms[room].$('button.teamselect').val();
					if (!selection || selection === 'random') continue;
					var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
					if (this.deletedTeamLoc < obj.curTeamIndex + 1) {
						obj.curTeamIndex++;
					} else if (obj.curTeamIndex === -1) {
						obj.curTeamIndex = this.deletedTeamLoc;
					}
				}
				var undeletedTeam = this.deletedTeam;
				this.deletedTeam = null;
				this.deletedTeamLoc = -1;
				Storage.saveTeam(undeletedTeam);
				app.user.trigger('saveteams');
				this.update();
			}
		},
		saveBackup: function () {
			Storage.deleteAllTeams();
			Storage.importTeam(this.$('.teamedit textarea').val(), true);
			teams = Storage.teams;
			Storage.saveAllTeams();
			for (var room in app.rooms) {
				var selection = app.rooms[room].$('button.teamselect').val();
				if (!selection || selection === 'random') continue;
				var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
				obj.curTeamIndex = 0;
			}
			this.back();
		},
		"new": function (type) {
			var newTeam = this.createTeam(null, type === "box");

			teams.push(newTeam);
			this.edit(teams.length - 1);
		},
		newTop: function (type) {
			var newTeam = this.createTeam(null, type === "box");
			teams.unshift(newTeam);
			for (var room in app.rooms) {
				var selection = app.rooms[room].$('button.teamselect').val();
				if (!selection || selection === 'random') continue;
				var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
				obj.curTeamIndex++;
			}
			this.edit(0);
		},
		duplicate: function (i) {
			var newTeam = this.createTeam(i ? teams[i] : null);
			teams.unshift(newTeam);
			for (var room in app.rooms) {
				var selection = app.rooms[room].$('button.teamselect').val();
				if (!selection || selection === 'random') continue;
				var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
				obj.curTeamIndex++;
			}
			this.edit(0);
		},
		createTeam: function (orig, isBox) {
			var newTeam;
			if (orig) {
				newTeam = {
					name: 'Copy of ' + orig.name,
					format: orig.format,
					team: orig.team,
					capacity: orig.capacity,
					folder: orig.folder,
					iconCache: ''
				};
			} else {
				var format = this.curFolder || 'gen9';
				var folder = '';
				if (format && format.charAt(format.length - 1) === '/') {
					folder = format.slice(0, -1);
					format = 'gen9';
				}
				newTeam = {
					name: (isBox ? 'Box ' : 'Untitled ') + (teams.length + 1),
					format: format,
					team: '',
					capacity: isBox ? 24 : 6,
					folder: folder,
					iconCache: ''
				};
			}
			// work around Opera 42-45 crashing when persist() is called
			if (navigator.storage && navigator.storage.persist && !/ OPR\/4[0-5]/.test(navigator.userAgent)) {
				var self = this;
				navigator.storage.persist().then(function (state) {
					self.updatePersistence(state);
				});
			}

			return newTeam;
		},
		"import": function () {
			if (this.exportMode) return this.back();
			this.exportMode = true;
			if (!this.curTeam) {
				this['new']();
			} else {
				this.update();
			}
		},
		backup: function () {
			this.curTeam = null;
			this.curSetList = null;
			this.exportMode = true;
			this.update();
		},
		psExport: function () {
			var cmd = '/teams ';
			cmd += this.curTeam.teamid ? 'update' : 'save';
			// teamName, formatid, rawPrivacy, rawTeam
			var buf = [];
			if (this.curTeam.teamid) buf.push(this.curTeam.teamid);
			buf.push(this.curTeam.name);
			buf.push(this.curTeam.format);
			buf.push(this.$('input[name=teamprivacy]').get(0).checked ? 1 : 0);
			var team = Storage.exportTeam(this.curSetList, this.curTeam.gen, false);
			if (!team) return app.addPopupMessage("Add a Pokémon to your team before uploading it!");
			buf.push(team);
			app.send(cmd + " " + buf.join(', '));
			this.exported = true;
			$('button[name=psExport]').addClass('disabled');
			$('button[name=psExport]')[0].disabled = true;
			$('label[name=editMessage]').hide();
		},
		pokepasteExport: function (type) {
			var team = Storage.exportTeam(this.curSetList, this.curTeam.gen, type === 'openteamsheet');
			if (!team) return app.addPopupMessage("Add a Pokémon to your team before uploading it!");
			document.getElementById("pasteData").value = team;
			document.getElementById("pasteTitle").value = this.curTeam.name;
			if (type === 'openteamsheet') {
				document.getElementById("pasteTitle").value += " (OTS)";
			}
			document.getElementById("pasteAuthor").value = app.user.get('name');
			if (this.curTeam.format !== 'gen9') {
				document.getElementById("pasteNotes").value = "Format: " + this.curTeam.format;
			}
			document.getElementById("pokepasteForm").submit();
		},

		// drag and drop

		// because of a bug in Chrome and Webkit:
		//   https://code.google.com/p/chromium/issues/detail?id=410328
		// we can't use CSS :hover
		mouseOverTeam: function (e) {
			if (!e.currentTarget.className.endsWith('team-hover')) e.currentTarget.className += ' team-hover';
		},
		mouseOutTeam: function (e) {
			if (e.currentTarget.className.endsWith('team-hover')) e.currentTarget.className = e.currentTarget.className.slice(0, -11);
		},
		dragStartTeam: function (e) {
			var dataTransfer = e.originalEvent.dataTransfer;

			dataTransfer.effectAllowed = 'copyMove';

			dataTransfer.setData("text/plain", "Team " + e.currentTarget.dataset.value);

			var team = Storage.teams[e.currentTarget.dataset.value];
			var filename = team.name;
			if (team.format) filename = '[' + team.format + '] ' + filename;
			filename = $.trim(filename).replace(/[\\\/]+/g, '') + '.txt';
			var urlprefix = "data:text/plain;base64,";
			if (document.location.protocol === 'https:') {
				// Chrome is dumb and doesn't support data URLs in HTTPS
				urlprefix = "https://" + Config.routes.client + "/action.php?act=dlteam&team=";
			}
			var contents = Storage.exportTeam(team.team, team.gen).replace(/\n/g, '\r\n');
			var downloadurl = "text/plain:" + filename + ":" + urlprefix + encodeURIComponent(window.btoa(unescape(encodeURIComponent(contents))));
			dataTransfer.setData("DownloadURL", downloadurl);

			app.dragging = e.currentTarget;
			app.draggingRoom = this.id;
			app.draggingLoc = parseInt(e.currentTarget.dataset.value, 10);
			var elOffset = $(e.currentTarget).offset();
			app.draggingOffsetX = e.originalEvent.pageX - elOffset.left;
			app.draggingOffsetY = e.originalEvent.pageY - elOffset.top;
			this.finalOffset = null;
			setTimeout(function () {
				$(e.currentTarget).parent().addClass('dragging');
			}, 0);
		},
		dragEndTeam: function (e) {
			this.finishDrop();
		},
		finishDrop: function () {
			var teamEl = app.dragging;
			app.dragging = null;
			var originalLoc = parseInt(teamEl.dataset.value, 10);
			if (isNaN(originalLoc)) {
				throw new Error("drag failed");
			}
			var newLoc = Math.floor(app.draggingLoc);
			if (app.draggingLoc < originalLoc) newLoc += 1;
			var team = Storage.teams[originalLoc];
			var edited = false;
			if (newLoc !== originalLoc) {
				Storage.teams.splice(originalLoc, 1);
				Storage.teams.splice(newLoc, 0, team);
				for (var room in app.rooms) {
					var selection = app.rooms[room].$('button.teamselect').val();
					if (!selection || selection === 'random') continue;
					var obj = app.rooms[room].id === "" ? app.rooms[room] : app.rooms[room].tournamentBox;
					if (originalLoc === obj.curTeamIndex) {
						obj.curTeamIndex = newLoc;
					} else if (originalLoc > obj.curTeamIndex && newLoc <= obj.curTeamIndex) {
						obj.curTeamIndex++;
					} else if (originalLoc < obj.curTeamIndex && newLoc >= obj.curTeamIndex) {
						obj.curTeamIndex--;
					}
				}
				edited = true;
			}

			// possibly half-works-around a hover issue in
			this.$('.teamlist').css('pointer-events', 'none');
			$(teamEl).parent().removeClass('dragging');

			if (app.draggingFolder) {
				var $folder = $(app.draggingFolder);
				app.draggingFolder = null;
				var $plusOneFolder = $folder.find('.plusonefolder');
				$folder.removeClass('active');
				if (!$plusOneFolder.length) {
					$folder.prepend('<strong style="float:right;margin-right:3px;padding:0 2px;border-radius:3px;background:#CC8500;color:white" class="plusonefolder">+1</strong>');
				} else {
					var count = Number($plusOneFolder.text().substr(1)) + 1;
					$plusOneFolder.text('+' + count);
				}
				var format = $folder.data('value');
				if (format.slice(-1) === '/') {
					team.folder = format.slice(0, -1);
				} else {
					team.format = format;
				}
				edited = true;
			}
			this.updateTeamList();

			if (edited) {
				Storage.saveTeam(team);
				app.user.trigger('saveteams');
				this.exported = false;
				$('button[name=psExport]').removeClass('disabled');
				$('button[name=psExport]')[0].disabled = false;
				$('label[name=editMessage]').show();
			}

			// We're going to try to animate the team settling into its new position

			if (this.finalOffset) {
				// event.pageY and event.pageX are buggy on literally every browser:

				//   in Chrome:
				// event.pageX|pageY is the position of the bottom left corner of the draggable, instead
				// of the mouse position

				//   in Safari:
				// window.innerHeight * 2 - window.outerHeight - event.pageY is the mouse position
				// No, I don't understand what's going on, either, but unsurprisingly this fails utterly
				// if the page is zoomed.

				//   in Firefox:
				// event.pageX|pageY are straight-up unsupported

				// if you don't believe me, uncomment and see for yourself:
				// console.log('x,y = ' + [e.originalEvent.x, e.originalEvent.y]);
				// console.log('screenX,screenY = ' + [e.originalEvent.screenX, e.originalEvent.screenY]);
				// console.log('clientX,clientY = ' + [e.originalEvent.clientX, e.originalEvent.clientY]);
				// console.log('pageX,pageY = ' + [e.originalEvent.pageX, e.originalEvent.pageY]);

				// Because of this, we're just going to steal the values from the drop event, where
				// everything is sane.

				var $newTeamEl = this.$('.team[data-value=' + newLoc + ']');
				if (!$newTeamEl.length) return;
				var finalPos = $newTeamEl.offset();
				$newTeamEl.css('transform', 'translate(' + (this.finalOffset[0] - finalPos.left) + 'px, ' + (this.finalOffset[1] - finalPos.top) + 'px)');
				setTimeout(function () {
					$newTeamEl.css('transition', 'transform 0.15s');
					// it's 2015 and Safari doesn't support unprefixed transition!!!
					$newTeamEl.css('-webkit-transition', '-webkit-transform 0.15s');
					$newTeamEl.css('transform', 'translate(0px, 0px)');
				});
			}
		},
		dragEnterTeam: function (e) {
			if (!app.dragging) return;
			var $draggingLi = $(app.dragging).parent();
			this.dragLeaveFolder();
			if (e.currentTarget === app.dragging) {
				e.preventDefault();
				return;
			}
			var hoverLoc = parseInt(e.currentTarget.dataset.value, 10);
			if (app.draggingLoc > hoverLoc) {
				// dragging up
				$(e.currentTarget).parent().before($draggingLi);
				app.draggingLoc = parseInt(e.currentTarget.dataset.value, 10) - 0.5;
			} else {
				// dragging down
				$(e.currentTarget).parent().after($draggingLi);
				app.draggingLoc = parseInt(e.currentTarget.dataset.value, 10) + 0.5;
			}
		},
		dragEnterFolder: function (e) {
			if (!app.dragging) return;
			this.dragLeaveFolder();
			if (e.currentTarget === app.draggingFolder) {
				return;
			}
			var format = e.currentTarget.dataset.value;
			if (format === '+' || format === '++' || format === 'all' || format === this.curFolder) {
				return;
			}
			if (parseInt(app.dragging.dataset.value, 10) >= Storage.teams.length && format.slice(-1) !== '/') {
				// dragging a team file, already has a known format
				return;
			}
			app.draggingFolder = e.currentTarget;
			$(app.draggingFolder).addClass('active');
			// amusing note: using .detach() instead of .hide() will make `dragend` not fire
			$(app.dragging).parent().hide();
		},
		dragLeaveFolder: function (e) {
			// sometimes there's a race condition and dragEnter happens before dragLeave
			if (e && e.currentTarget !== app.draggingFolder) return;
			if (!app.dragging || !app.draggingFolder) return;
			$(app.draggingFolder).removeClass('active');
			app.draggingFolder = null;
			$(app.dragging).parent().show();
		},
		defaultDragEnterTeam: function (e) {
			var dataTransfer = e.originalEvent.dataTransfer;
			if (!dataTransfer) return;
			if (dataTransfer.types.indexOf && dataTransfer.types.indexOf('Files') === -1) return;
			if (dataTransfer.types.contains && !dataTransfer.types.contains('Files')) return;
			if (dataTransfer.files[0] && dataTransfer.files[0].name.slice(-4) !== '.txt') return;
			// We're dragging a file! It might be a team!
			if (app.curFolder && app.curFolder.slice(-1) !== '/') {
				this.selectFolder('all');
			}
			this.$('.teamlist').append('<li class="dragging"><div class="team" data-value="' + Storage.teams.length + '"></div></li>');
			app.dragging = this.$('.dragging .team')[0];
			app.draggingRoom = this.id;
			app.draggingLoc = Storage.teams.length;
			app.draggingOffsetX = 180;
			app.draggingOffsetY = 25;
		},
		defaultDropTeam: function (e) {
			if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
				var file = e.originalEvent.dataTransfer.files[0];
				var name = file.name;
				if (name.slice(-4) !== '.txt') {
					app.dragging = null;
					this.updateTeamList();
					app.addPopupMessage("Your file is not a valid team. Team files are .txt files.");
					return;
				}
				var reader = new FileReader();
				var self = this;
				reader.onload = function (e) {
					var team;
					try {
						team = Storage.packTeam(Storage.importTeam(e.target.result));
					} catch (err) {
						app.addPopupMessage("Your file is not a valid team.");
						self.updateTeamList();
						return;
					}
					var name = file.name;
					if (name.slice(name.length - 4).toLowerCase() === '.txt') {
						name = name.substr(0, name.length - 4);
					}
					var format = '';
					var bracketIndex = name.indexOf(']');
					var capacity = 6;
					if (bracketIndex >= 0) {
						format = name.substr(1, bracketIndex - 1);
						if (format && format.slice(0, 3) !== 'gen') format = 'gen6' + format;
						if (format && format.endsWith('-box')) {
							format = format.slice(0, -4);
							capacity = 24;
						}
						name = $.trim(name.substr(bracketIndex + 1));
					}
					Storage.teams.push({
						name: name,
						format: format,
						team: team,
						capacity: capacity,
						folder: '',
						iconCache: ''
					});
					self.finishDrop();
				};
				reader.readAsText(file);
			}
			this.finalOffset = [e.originalEvent.pageX - app.draggingOffsetX, e.originalEvent.pageY - app.draggingOffsetY];
		},

		/*********************************************************
		 * Team view
		 *********************************************************/

		updateTeamView: function () {
			this.curChartName = '';
			this.curChartType = '';

			var buf = '';
			if (this.exportMode) {
				buf = '<div class="pad"><button name="back" class="button"><i class="fa fa-chevron-left"></i> List</button> <input class="textbox teamnameedit" type="text" class="teamnameedit" size="30" value="' + BattleLog.escapeHTML(this.curTeam.name) + '" /> <button name="saveImport" class="button"><i class="fa fa-upload"></i> Import/Export</button> <button name="saveImport" class="savebutton button"><i class="fa fa-floppy-o"></i> Save</button></div>';
				buf += '<div class="teamedit"><textarea class="textbox" rows="17">' + BattleLog.escapeHTML(Storage.exportTeam(this.curSetList, this.curTeam.gen)) + '</textarea></div>';
			} else {
				buf = '<div class="pad"><button name="back" class="button"><i class="fa fa-chevron-left"></i> List</button> ';
				buf += '<input class="textbox teamnameedit" type="text" class="teamnameedit" size="30" value="' + BattleLog.escapeHTML(this.curTeam.name) + '" /> ';
				buf += '<button name="import" class="button"><i class="fa fa-upload"></i> Import/Export</button> ';
				buf += '<div class="teamchartbox">';
				buf += '<ol class="teamchart">';
				buf += '<li>' + this.clipboardHTML() + '</li>';
				var i = 0;
				if (this.curSetList.length && !this.curSetList[this.curSetList.length - 1].species) {
					this.curSetList.splice(this.curSetList.length - 1, 1);
				}

				var isGenericFormat = function (formatName) {
					if (!formatName) return true;
					if (/^gen\d+$/.test(formatName)) return true;
					return false;
				};
				if (this.loadingTeam) buf += '<div style="message-error">Downloading team from server...</strong><br />';
				buf += '<label name="editMessage" style="display: none">';
				buf += 'Remember to click the upload button below to sync your changes to the server!</label><br />';
				if (exports.BattleFormats) {
					buf += '<li class="format-select">';
					buf += '<label class="label">Format:</label><button class="select formatselect teambuilderformatselect" name="format" value="' + this.curTeam.format + '">' + (isGenericFormat(this.curTeam.format) ? '<em>Select a format</em>' : BattleLog.escapeFormat(this.curTeam.format)) + '</button>';
					var btnClass = 'button' + (!this.curSetList.length || app.isDisconnected ? ' disabled' : '');
					buf += ' <button name="validate" class="' + btnClass + '"><i class="fa fa-check"></i> Validate</button></li>';
				}
				if (!this.curSetList.length) {
					buf += '<li><em>you have no pokemon lol</em></li>';
				}
				for (i = 0; i < this.curSetList.length; i++) {
					if (this.curSetList.length < this.curTeam.capacity && this.deletedSet && i === this.deletedSetLoc) {
						buf += '<li><button name="undeleteSet" class="button"><i class="fa fa-undo"></i> Undo Delete</button></li>';
					}
					buf += this.renderSet(this.curSetList[i], i);
				}
				if (this.deletedSet && i === this.deletedSetLoc) {
					buf += '<li><button name="undeleteSet" class="button"><i class="fa fa-undo"></i> Undo Delete</button></li>';
				}
				if (i === 0) {
					buf += '<li><button name="import" class="button big"><i class="fa fa-upload"></i> Import from text or URL</button></li>';
				}
				if (i < this.curTeam.capacity) {
					buf += '<li><button name="addPokemon" class="button big"><i class="fa fa-plus"></i> Add Pok&eacute;mon</button></li>';
				}
				buf += '</ol>';
				var formatInfo = this.formatResources[this.curTeam.format];
				// data's there and loaded
				if (formatInfo && formatInfo !== true) {
					if (formatInfo.resources.length || formatInfo.url) {
						buf += '<div style="padding-left: 5px"><h3 style="font-size: 12px">Teambuilding resources for this tier:</h3></div><ul>';
						for (var i = 0; i < formatInfo.resources.length; i++) {
							var resource = formatInfo.resources[i];
							buf += '<li><p><a href="' + resource.url + '" target="_blank">' + resource.resource_name + '</a></p></li>';
						}
					}
					buf += '</ul>';
					var desc = formatInfo.resources.length ? 'more ' : '';
					buf += '<div style="padding-left: 5px">Find ' + desc + 'helpful resources for this tier on <a href="' + formatInfo.url + '" target="_blank">the Smogon Dex</a>.</div>';
				}
				buf += '<form id="pokepasteForm" style="display:inline" method="post" action="https://pokepast.es/create" target="_blank">';
				buf += '<input type="hidden" name="title" id="pasteTitle">';
				buf += '<input type="hidden" name="paste" id="pasteData">';
				buf += '<input type="hidden" name="author" id="pasteAuthor">';
				buf += '<input type="hidden" name="notes" id="pasteNotes">';
				buf += '<p><button name="psExport" type="submit" class="button exportbutton"> <i class="fa fa-upload"></i> Upload to Showdown database (saves across devices)</button>';
				var privacy = (Storage.prefs('uploadprivacy') || typeof Storage.prefs('uploadprivacy') !== 'boolean') ? 'checked' : '';
				buf += ' <label><small>(Private:</small> <input type="checkbox" name="teamprivacy" ' + privacy + ' /><small>)</small></label>';
				buf += '</p>';
				buf += '<p><button name="pokepasteExport" type="submit" class="button exportbutton"><i class="fa fa-upload"></i> Upload to PokePaste</button></p>';
				if (this.curTeam.format.includes('vgc')) {
					buf += '<p><button name="pokepasteExport" value="openteamsheet" type="submit" class="button exportbutton"><i class="fa fa-upload"></i> Upload to PokePaste (Open Team Sheet)</button></p>';
				}
				buf += '</form></div>';
			}
			this.$el.html('<div class="teamwrapper">' + buf + '</div>');
			this.$(".teamedit textarea").focus().select();
			if ($(window).width() < 640) this.show();
		},
		renderSet: function (set, i) {
			var species = this.curTeam.dex.species.get(set.species);
			var customFormNames = window.getCustomCosmeticFormes ? window.getCustomCosmeticFormes(species) : [];
			var isLetsGo = this.curTeam.format.includes('letsgo');
			var isBDSP = this.curTeam.format.includes('bdsp');
			var isNatDex = this.curTeam.format.includes('nationaldex') || this.curTeam.format.includes('natdex');
			var buf = '<li value="' + i + '">';
			if (!set.species) {
				if (this.deletedSet) {
					buf += '<div class="setmenu setmenu-left"><button name="undeleteSet" class="button"><i class="fa fa-undo"></i> Undo Delete</button></div>';
				}
				buf += '<div class="setmenu"><button name="importSet"><i class="fa fa-upload"></i>Import</button></div>';
				buf += '<div class="setchart" style="background-image:url(' + Dex.resourcePrefix + 'sprites/gen5/0.png);"><div class="setcol setcol-icon"><div class="setcell-sprite"></div><div class="setcell setcell-pokemon"><label>Pok&eacute;mon</label><input type="text" name="pokemon" class="textbox chartinput" value="" autocomplete="off" /></div></div></div>';
				buf += '</li>';
				return buf;
			}
			buf += '<div class="setmenu"><button name="copySet"><i class="fa fa-files-o"></i>Copy</button> <button name="importSet"><i class="fa fa-upload"></i>Import/Export</button> <button name="moveSet"><i class="fa fa-arrows"></i>Move</button> <button name="deleteSet"><i class="fa fa-trash"></i>Delete</button></div>';
			buf += '<div class="setchart-nickname">';
			buf += '<label>Nickname</label><input type="text" name="nickname" class="textbox" value="' + BattleLog.escapeHTML(set.name || '') + '" placeholder="' + BattleLog.escapeHTML(species.baseSpecies) + '" />';
			buf += '</div>';
			buf += '<div class="setchart" style="' + Dex.getTeambuilderSprite(Dex.getAbilityFormPreviewSet(set, this.curTeam.dex), this.curTeam.gen) + ';">';

			// icon
			buf += '<div class="setcol setcol-icon">';
			if (customFormNames.length > 1 || (species.cosmeticFormes && species.cosmeticFormes.length)) {
				buf += '<div class="setcell-sprite changeform"><i class="fa fa-caret-down"></i></div>';
			} else {
				buf += '<div class="setcell-sprite"></div>';
			}
			buf += '<div class="setcell setcell-pokemon"><label>Pok&eacute;mon</label><input type="text" name="pokemon" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.species) + '" autocomplete="off" /></div></div>';

			// details
			buf += '<div class="setcol setcol-details"><div class="setrow">';
			buf += '<div class="setcell setcell-details"><label>Details</label><button class="textbox setdetails" tabindex="-1" name="details">';

			var GenderChart = {
				'M': 'Male',
				'F': 'Female',
				'N': '&mdash;'
			};
			buf += '<span class="detailcell detailcell-first"><label>Level</label>' + (set.level || 100) + '</span>';
			if (this.curTeam.gen > 1) {
				buf += '<span class="detailcell"><label>Gender</label>' + GenderChart[set.gender || species.gender || 'N'] + '</span>';
				if (isLetsGo) {
					buf += '<span class="detailcell"><label>Happiness</label>' + (typeof set.happiness === 'number' ? set.happiness : 70) + '</span>';
				} else if (this.curTeam.gen < 8 || isNatDex) {
					buf += '<span class="detailcell"><label>Happiness</label>' + (typeof set.happiness === 'number' ? set.happiness : 255) + '</span>';
				}
				buf += '<span class="detailcell"><label>Shiny</label>' + (set.shiny ? 'Yes' : 'No') + '</span>';
				if (!isLetsGo && this.curTeam.gen < 9) {
					if (this.curTeam.gen === 8 && !isNatDex) {
						if (isBDSP && species.baseSpecies === "Unown") {
							buf += '<span class="detailcell"><label>HP Type</label>' + (set.hpType || 'Dark') + '</span>';
						}
						// Hidden Power isn't in normal Gen 8
					} else {
						buf += '<span class="detailcell"><label>HP Type</label>' + (set.hpType || 'Dark') + '</span>';
					}
				}
				if (species.canGigantamax || species.forme === 'Gmax') {
					buf += '<span class="detailcell"><label>Gmax</label>Yes</span>';
					set.gigantamax = true;
				}
				if (this.curTeam.gen === 9) {
					buf += '<span class="detailcell"><label>Tera Type</label>' + (species.forceTeraType || set.teraType || species.types[0]) + '</span>';
				}
			}
			buf += '</button></div></div>';

			// item/type icons
			buf += '<div class="setrow setrow-icons">';
			buf += '<div class="setcell">';
			var itemicon = '<span class="itemicon"></span>';
			if (set.item) {
				var item = this.curTeam.dex.items.get(set.item);
				itemicon = '<span class="itemicon" style="' + Dex.getItemIcon(item) + '"></span>';
			}
			buf += itemicon;
			buf += '</div>';
			buf += '<div class="setcell setcell-typeicons">';
			var types = Dex.getAbilityFormPreview(set, this.curTeam.dex).species.types;
			if (types) {
				for (var i = 0; i < types.length; i++) buf += Dex.getTypeIcon(types[i]);
			}
			buf += '</div></div>';

			buf += '<div class="setrow">';
			// if (this.curTeam.gen > 1 && !isLetsGo) buf += '<div class="setcell setcell-item"><label>Item</label><input type="text" name="item" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.item) + '" /></div>';
			if (this.curTeam.gen > 1) buf += '<div class="setcell setcell-item"><label>Item</label><input type="text" name="item" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.item) + '" autocomplete="off" /></div>';
			if (this.curTeam.gen > 2 && !isLetsGo) buf += '<div class="setcell setcell-ability"><label>Ability</label><input type="text" name="ability" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.ability) + '" autocomplete="off" />' + renderStarterPassives(this.curTeam.dex.species.get(set.species)) + '</div>';
			buf += '</div></div>';

			// moves
			if (!set.moves) set.moves = [];
			buf += '<div class="setcol setcol-moves"><div class="setcell"><label>Moves</label>';
			buf += '<input type="text" name="move1" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.moves[0]) + '" autocomplete="off" /></div>';
			buf += '<div class="setcell"><input type="text" name="move2" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.moves[1]) + '" autocomplete="off" /></div>';
			buf += '<div class="setcell"><input type="text" name="move3" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.moves[2]) + '" autocomplete="off" /></div>';
			buf += '<div class="setcell"><input type="text" name="move4" class="textbox chartinput" value="' + BattleLog.escapeHTML(set.moves[3]) + '" autocomplete="off" /></div>';
			buf += '</div>';

			// stats
			buf += '<div class="setcol setcol-stats"><div class="setrow"><label>Stats</label><button class="textbox setstats" name="stats">';
			buf += '<span class="statrow statrow-head"><label></label> <span class="statgraph"></span> <em>' + (!isLetsGo ? 'EV' : 'AV') + '</em></span>';
			var stats = {};
			var defaultEV = (this.curTeam.gen > 2 ? 0 : 252);
			for (var j in BattleStatNames) {
				if (j === 'spd' && this.curTeam.gen === 1) continue;
				stats[j] = this.getStat(j, set);
				var ev = (set.evs[j] === undefined ? defaultEV : set.evs[j]);
				var evBuf = '<em>' + (ev === defaultEV ? '' : ev) + '</em>';
				if (BattleNatures[set.nature] && BattleNatures[set.nature].plus === j) {
					evBuf += '<small>+</small>';
				} else if (BattleNatures[set.nature] && BattleNatures[set.nature].minus === j) {
					evBuf += '<small>&minus;</small>';
				}
				var width = stats[j] * 75 / 504;
				if (j == 'hp') width = stats[j] * 75 / 704;
				if (width > 75) width = 75;
				var color = Math.floor(stats[j] * 180 / 714);
				if (color > 360) color = 360;
				var statName = this.curTeam.gen === 1 && j === 'spa' ? 'Spc' : BattleStatNames[j];
				buf += '<span class="statrow"><label>' + statName + '</label> <span class="statgraph"><span style="width:' + width + 'px;background:hsl(' + color + ',40%,75%);"></span></span> ' + evBuf + '</span>';
			}
			buf += '</button></div></div>';

			buf += '</div></li>';
			return buf;
		},

		saveImport: function () {
			var text = this.$('.teamedit textarea').val();
			var url = this.importableUrl(text);

			if (url) {
				this.$('.teamedit textarea, .teamedit .savebutton').attr('disabled', true);
				var self = this;
				$.ajax({
					type: 'GET',
					url: url,
					success: function (data) {
						if (/^https?:\/\/pokepast\.es\/.*\/json\s*$/.test(url)) {

							var notes = data.notes.split('\n');
							if (notes[0].startsWith('Format: ')) {
								var formatid = toID(notes[0].slice(8));
								var format = window.BattleFormats && window.BattleFormats[formatid];
								if (format) self.changeFormat(format.id);
								notes.shift();
							}
							var teamNotes = notes.join('\n'); // Not implemented yet

							var title = data.title;
							if (title && !title.startsWith('Untitled')) {
								title = title.replace(/[\|\\\/]/g, '');
								self.$('.teamnameedit').val(title).change();
							}

							Storage.activeSetList = self.curSetList = Storage.importTeam(data.paste);
						} else {
							Storage.activeSetList = self.curSetList = Storage.importTeam(data);
						}
						self.$('.teamedit textarea, .teamedit .savebutton').attr('disabled', null);
						self.back();
					},
					error: function () {
						app.addPopupMessage("Could not fetch a team from this URL. Make sure you copied the full link, or paste the team in by hand.");
						self.$('.teamedit textarea, .teamedit .savebutton').attr('disabled', null);
					}
				});
			} else {
				Storage.activeSetList = this.curSetList = Storage.importTeam(text);
				this.back();
			}
		},
		importableUrl: function (value) {
			var match = value.match(/^https?:\/\/(pokepast\.es|gist\.github(?:usercontent)?\.com)\/(.*)\s*$/);
			if (!match) return;

			var host = match[1];
			var path = match[2];

			switch (host) {
			case 'pokepast.es':
				return 'https://pokepast.es/' + path.replace(/\/.*/, '') + '/json';
			default: // gist
				var split = path.split('/');
				return split.length < 2 ? undefined : 'https://gist.githubusercontent.com/' + split[0] + '/' + split[1] + '/raw';
			}
		},
		addPokemon: function () {
			if (!this.curTeam) return;
			var team = this.curSetList;
			if (!team.length || team[team.length - 1].species) {
				var newPokemon = {
					name: '',
					species: '',
					item: '',
					nature: '',
					evs: {},
					ivs: {},
					moves: []
				};
				team.push(newPokemon);
			}
			this.curSet = team[team.length - 1];
			this.curSetLoc = team.length - 1;
			this.curChartName = '';
			this.update();
			this.$('input[name=pokemon]').select();
			var formatid = this.curTeam.format;
			if (formatid.includes('monotype') || formatid.includes('monothreat')) {
				var typeTable = [];
				var dex = this.curTeam.dex;
				if (formatid.includes('monothreat')) {
					typeTable = [dex.types.get(formatid.slice(14)).name || 'Normal'];
				}
				for (var i = 0; i < this.curSetList.length; i++) {
					var set = this.curSetList[i];
					var species = dex.species.get(set.species);
					if (species.isMega) {
						species = dex.species.get(species.baseSpecies);
					}
					if (!species.exists) continue;
					if (!formatid.includes('monothreat')) {
						if (i === 0) {
							typeTable = species.types;
						} else {
							typeTable = typeTable.filter(function (type) {
								return species.types.includes(type);
							});
							if (!typeTable.length) break;
						}
					}
					if (this.curTeam.gen >= 6) {
						var item = dex.items.get(set.item);
						if (item.megaStone && species.baseSpecies === item.megaEvolves) {
							species = dex.species.get(item.megaStone);
							typeTable = typeTable.filter(function (type) {
								return species.types.includes(type);
							});
							if (!typeTable.length) break;
						}
					}
				}
				if (typeTable.length === 1) {
					this.search.engine.addFilter(['type', typeTable[0]]);
					this.search.filters = this.search.engine.filters;
					this.search.find('');
				}
			}
		},
		pastePokemon: function (i, btn) {
			if (!this.curTeam) return;
			var team = this.curSetList;
			if (team.length >= this.curTeam.capacity) return;
			if (!this.clipboardCount()) return;

			if (team.push($.extend(true, {}, this.clipboard[0])) >= 6) {
				$(btn).css('display', 'none');
			}
			this.update();
			this.save();
		},
		saveFlag: false,
		save: function () {
			this.saveFlag = true;
			if (this.curTeam) {
				Storage.saveTeam(this.curTeam);
			} else {
				Storage.saveTeams();
			}
		},
		validate: function () {
			if (this.curTeam.teamid && !this.curTeam.loaded) {
				return app.loadTeam(this.curTeam, this.validate.bind(this));
			}
			var format = this.curTeam.format || 'gen7anythinggoes';

			if (!this.curSetList.length) {
				app.addPopupMessage("You need at least one Pokémon to validate.");
				return;
			}

			if (window.BattleFormats && BattleFormats[format] && BattleFormats[format].battleFormat) {
				format = BattleFormats[format].battleFormat;
			}
			app.sendTeam(this.curTeam, function () {
				app.send('/vtm ' + format);
			});
		},
		teamNameChange: function (e) {
			var name = ($.trim(e.currentTarget.value) || 'Untitled ' + (this.curTeamLoc + 1));
			if (name.indexOf('/') >= 0 || name.indexOf('\\') >= 0) {
				app.addPopupMessage("Names can't contain slashes, since they're used as a folder separator.");
				name = name.replace(/[\\\/]/g, '');
			}
			if (name.indexOf('|') >= 0) {
				app.addPopupMessage("Names can't contain the character |, since they're used for storing teams.");
				name = name.replace(/\|/g, '');
			}
			if (name.indexOf('[') >= 0 || name.indexOf(']') >= 0) {
				app.addPopupMessage("Names can't contain the characters [ or ], since they're used for storing team IDs.");
				name = name.replace(/\[/g, '');
				name = name.replace(/\]/g, '');
			}
			this.curTeam.name = name;
			e.currentTarget.value = name;
			this.save();
		},
		format: function (format, button) {
			if (!window.BattleFormats) {
				return;
			}
			var self = this;
			app.addPopup(FormatPopup, {format: format, sourceEl: button, selectType: 'teambuilder', onselect: function (newFormat) {
				self.changeFormat(newFormat);
			}});
		},
		changeFormat: function (format) {
			if (this.curTeam.format === format) return;
			this.curTeam.format = format;
			this.curTeam.gen = this.getGen(this.curTeam.format);
			this.curTeam.dex = Dex.forGen(this.curTeam.gen);
			if (this.curTeam.format.includes('letsgo')) {
				this.curTeam.dex = Dex.mod('gen7letsgo');
			}
			if (this.curTeam.format.includes('bdsp')) {
				this.curTeam.dex = Dex.mod('gen8bdsp');
			}
			this.save();
			if (this.curTeam.gen === 5 && !Dex.loadedSpriteData['bw']) Dex.loadSpriteData('bw');
			this.update();
		},
		nicknameChange: function (e) {
			var i = +$(e.currentTarget).closest('li').attr('value');
			var set = this.curSetList[i];
			var name = $.trim(e.currentTarget.value).replace(/\|/g, '');
			e.currentTarget.value = set.name = name;
			this.save();
		},

		// clipboard
		clipboard: [],
		clipboardCount: function () {
			return this.clipboard.length;
		},
		clipboardVisible: function () {
			return !!this.clipboardCount();
		},
		clipboardHTML: function () {
			var buf = '';
			buf += '<div class="teambuilder-clipboard-container" style="display: ' + (this.clipboardVisible() ? 'block' : 'none') + ';">';
			buf += '<div class="teambuilder-clipboard-title">Clipboard:</div>';
			buf += '<div class="teambuilder-clipboard-data" tabindex="-1">' + this.clipboardInnerHTML() + '</div>';
			buf += '<div class="teambuilder-clipboard-buttons">';
			if (this.curTeam && this.curSetList.length < this.curTeam.capacity) {
				buf += '<button name="pastePokemon" class="teambuilder-clipboard-button-left button"><i class="fa fa-clipboard"></i> Paste!</button>';
			}
			buf += '<button name="clipboardRemoveAll" class="teambuilder-clipboard-button-right button"><i class="fa fa-trash"></i> Clear clipboard</button>';
			buf += '</div>';
			buf += '</div>';

			return buf;
		},
		clipboardInnerHTMLCache: '',
		clipboardInnerHTML: function () {
			if (this.clipboardInnerHTMLCache) {
				return this.clipboardInnerHTMLCache;
			}

			var buf = '';
			for (var i = 0; i < this.clipboardCount(); i++) {
				var res = this.clipboard[i];
				var species = Dex.species.get(res.species);

				buf += '<div class="result" data-id="' + i + '">';
				buf += '<div class="section"><span class="icon" style="' + Dex.getPokemonIcon(species.name) + '"></span>';
				buf += '<span class="species">' + (species.name === species.baseSpecies ? BattleLog.escapeHTML(species.name) : (BattleLog.escapeHTML(species.baseSpecies) + '-<small>' + BattleLog.escapeHTML(species.name.substr(species.baseSpecies.length + 1)) + '</small>')) + '</span></div>';
				buf += '<div class="section"><span class="ability-item">' + (BattleLog.escapeHTML(res.ability) || '<i>No ability</i>') + '<br />' + (BattleLog.escapeHTML(res.item) || '<i>No item</i>') + '</span></div>';
				buf += '<div class="section no-border">';
				for (var j = 0; j < 4; j++) {
					if (!(j & 1)) {
						buf += '<span class="moves">';
					}
					buf += (BattleLog.escapeHTML(res.moves[j]) || '<i>No move</i>') + (!(j & 1) ? '<br />' : '');
					if (j & 1) {
						buf += '</span>';
					}
				}
				buf += '</div>';
				buf += '</div>';
			}

			this.clipboardInnerHTMLCache = buf;
			return buf;
		},
		clipboardUpdate: function () {
			this.clipboardInnerHTMLCache = '';
			$('.teambuilder-clipboard-data').html(this.clipboardInnerHTML());
		},
		clipboardExpanded: false,
		clipboardExpand: function () {
			var $clipboard = $('.teambuilder-clipboard-data');
			$clipboard.animate({height: this.clipboardCount() * 34}, 500, function () {
				setTimeout(function () { $clipboard.focus(); }, 100);
			});

			setTimeout(function () {
				this.clipboardExpanded = true;
			}.bind(this), 10);
		},
		clipboardShrink: function () {
			var $clipboard = $('.teambuilder-clipboard-data');
			$clipboard.animate({height: 32}, 500);

			setTimeout(function () {
				this.clipboardExpanded = false;
			}.bind(this), 10);
		},
		clipboardResultSelect: function (e) {
			if (!this.clipboardExpanded) return;

			e.preventDefault();
			e.stopPropagation();
			var target = +($(e.target).closest('.result').data('id'));
			if (target === -1) {
				this.clipboardShrink();
				this.clipboardRemoveAll();
				return;
			}

			this.clipboard.unshift(this.clipboard.splice(target, 1)[0]);
			this.clipboardUpdate();
			this.clipboardShrink();
		},
		clipboardAdd: function (set) {
			if (this.clipboard.unshift(set) > 6) {
				// we don't want the clipboard so big that it lags the teambuilder
				this.clipboard.pop();
			}
			this.clipboardUpdate();

			if (this.clipboardCount() === 1) {
				var $clipboard = $('.teambuilder-clipboard-container').css('opacity', 0);
				$clipboard.slideDown(250, function () {
					$clipboard.animate({opacity: 1}, 250);
				});
			}
		},
		clipboardRemoveAll: function () {
			this.clipboard = [];

			var self = this;
			var $clipboard = $('.teambuilder-clipboard-container');
			$clipboard.animate({opacity: 0}, 250, function () {
				$clipboard.slideUp(250, function () {
					self.clipboardUpdate();
				});
			});
		},

		// copy/import/export/move/delete
		copySet: function (i, button) {
			i = +($(button).closest('li').attr('value'));
			this.clipboardAdd($.extend(true, {}, this.curSetList[i]));
			button.blur();
		},
		wasViewingPokemon: false,
		importSet: function (i, button) {
			i = +($(button).closest('li').attr('value'));

			this.wasViewingPokemon = true;
			if (!this.curSet) {
				this.wasViewingPokemon = false;
				this.selectPokemon(i);
			}

			this.$('li').find('input, button').prop('disabled', true);
			this.$chart.hide();
			this.$('.teambuilder-pokemon-import')
				.show()
				.find('textarea')
				.val(Storage.exportTeam([this.curSet], this.curTeam.gen).trim())
				.focus()
				.select();

			this.getSmogonSets();
		},
		getSmogonSets: function () {
			this.$('.teambuilder-pokemon-import .teambuilder-import-smogon-sets').empty();

			var format = this.curTeam.format;
			// If we don't have a specific format, don't try and guess which sets to use.
			if (format.match(/gen\d$/)) return;

			var self = this;
			this.smogonSets = this.smogonSets || {};
			if (this.smogonSets[format] !== undefined) {
				this.importSetButtons();
				return;
			}
			// We fetch this as 'text' and JSON.parse it ourserves in order to have consistent behavior
			// between the localdev CORS helper and the real jQuery.get function, which would already parse
			// this into an object based on the content-type header.
			$.get('https://' + Config.routes.client + '/data/sets/' + format + '.json', {}, function (data) {
				try {
					self.smogonSets[format] = JSON.parse(data);
				} catch (e) {
					// An error occured. Mark this as false, so that we don't try to reimport sets for this format
					// in the future.
					self.smogonSets[format] = false;
				}
				self.importSetButtons();
			}, 'text');
		},
		importSetButtons: function () {
			var formatSets = this.smogonSets[this.curTeam.format];
			var species = this.curSet.species;

			var $setDiv = this.$('.teambuilder-pokemon-import .teambuilder-import-smogon-sets');
			$setDiv.empty();

			if (!formatSets) return;

			var sets = $.extend({}, formatSets['dex'][species], (formatSets['stats'] || {})[species]);

			$setDiv.text('Sample sets: ');
			for (var set in sets) {
				$setDiv.append('<button name="importSmogonSet" class="button">' + BattleLog.escapeHTML(set) + '</button>');
			}
			$setDiv.append(' <small>(<a target="_blank" href="' + this.smogdexLink(species) + '">Smogon&nbsp;analysis</a>)</small>');
		},
		importSmogonSet: function (i, button) {
			var formatSets = this.smogonSets[this.curTeam.format];
			var species = this.curSet.species;

			var setName = this.$(button).text();
			var smogonSet = formatSets['dex'][species][setName] || formatSets['stats'][species][setName];
			var curSet = $.extend({}, this.curSet, smogonSet);

			var text = Storage.exportTeam([curSet], this.curTeam.gen);
			this.$('.teambuilder-pokemon-import .pokemonedit').val(text);
		},
		closePokemonImport: function (force) {
			if (!this.wasViewingPokemon) return this.back();

			var $li = this.$('li');
			var i = +($li.attr('value'));
			this.$('.teambuilder-pokemon-import').hide();
			this.$chart.show();

			if (force === true) return this.selectPokemon(i);
			$li.find('input, button').prop('disabled', false);
		},
		savePokemonImport: function (i) {
			i = +(this.$('li').attr('value'));
			var curSet = Storage.importTeam(this.$('.pokemonedit').val())[0];
			if (curSet) {
				this.curSet = curSet;
				this.curSetList[i] = curSet;
			}
			this.closePokemonImport(true);
		},
		moveSet: function (i, button) {
			i = +($(button).closest('li').attr('value'));
			app.addPopup(MoveSetPopup, {
				i: i,
				team: this.curSetList
			});
		},
		deleteSet: function (i, button) {
			i = +($(button).closest('li').attr('value'));
			this.deletedSetLoc = i;
			this.deletedSet = this.curSetList.splice(i, 1)[0];
			if (this.curSet) {
				this.addPokemon();
			} else {
				this.update();
			}
			this.save();
		},
		undeleteSet: function () {
			if (this.deletedSet) {
				var loc = this.deletedSetLoc;
				this.curSetList.splice(loc, 0, this.deletedSet);
				this.deletedSet = null;
				this.deletedSetLoc = -1;
				this.save();

				if (this.curSet) {
					this.curSetLoc = loc;
					this.curSet = this.curSetList[loc];
					this.curChartName = '';
					this.update();
					this.updateChart();
				} else {
					this.update();
				}
			}
		},

		/*********************************************************
		 * Set view
		 *********************************************************/

		showRosterProfiles: function () {
			this.profilesView = true;
			this.rosterImportPreview = null;
			this.$el.html('<div class="pad roster-page"><button class="button" name="back">Back to Teambuilder</button><h2>Pokémon lists</h2><p>Save Pokémon lists and use them to filter team selections. Saved in this browser.</p>' + this.renderRosterProfiles() +
				'<h3>Import a list</h3><p>One Pokémon name per line. A # header may name the profile. Base species include their Mega forms; remove any entry afterward.</p>' +
				'<label>New profile name <input class="textbox roster-import-name" placeholder="Leave blank to use the # header" maxlength="80" /></label><p><textarea class="textbox roster-import-text" rows="7" style="width:100%;box-sizing:border-box" aria-label="Pokémon list" placeholder="# My locks&#10;Charizard&#10;Venusaur"></textarea></p>' +
				'<p><button class="button" name="previewRosterImport" value="new">Create list</button> <button class="button" name="previewRosterImport" value="add">Add to selected list</button> <button class="button" name="previewRosterImport" value="replace">Replace selected list</button></p><div class="roster-import-preview" aria-live="polite"></div></div>');
		},
		rosterExpandedSpecies: function (id) {
			var result = [id];
			for (var key in window.BattlePokedex) {
				var species = Dex.species.get(key);
				// The legacy Dex flag omits custom Mega suffixes such as Mega-X-Alt.
				if (!species.isMega && !/^Mega(?:-|$)/.test(species.forme)) continue;
				var source = species.battleOnly || species.changesFrom || species.baseSpecies;
				if ((Array.isArray(source) ? source : [source]).some(function (name) { return toID(name) === id; })) result.push(species.id);
			}
			return result.filter(function (value, index) { return result.indexOf(value) === index; });
		},
		parseRosterImport: function (text) {
			var result = {name: '', species: [], unknown: []};
			var self = this;
			text.split(/\r?\n/).forEach(function (line) {
				line = line.trim();
				if (!line) return;
				if (line.charAt(0) === '#') { if (!result.name) result.name = line.slice(1).trim().slice(0, 80); return; }
				var id = self.rosterSpeciesID(line);
				if (!id) { if (result.unknown.indexOf(line) < 0) result.unknown.push(line); return; }
				self.rosterExpandedSpecies(id).forEach(function (entry) { if (result.species.indexOf(entry) < 0) result.species.push(entry); });
			});
			return result;
		},
		previewRosterImport: function (mode) {
			var data = this.rosterData();
			var profile = data.profiles.find(function (p) { return p.id === data.selected; });
			var parsed = this.parseRosterImport(this.$('.roster-import-text').val() || '');
			parsed.name = (this.$('.roster-import-name').val() || parsed.name).trim().slice(0, 80);
			this.rosterImportPreview = null;
			var html = parsed.unknown.length ? '<p>Unknown names: ' + BattleLog.escapeHTML(parsed.unknown.join(', ')) + '. Correct these before importing.</p>' : '';
			if (!parsed.species.length) html += '<p>No Pokémon found.</p>';
			if (mode !== 'new' && !profile) html += '<p>Select a profile first.</p>';
			if (mode === 'new' && !parsed.name) html += '<p>Enter a new profile name or add a # header.</p>';
			if (!html) {
				this.rosterImportPreview = {mode: mode, target: data.selected, parsed: parsed};
				html = '<p>' + (mode === 'replace' ? 'Replace all ' + profile.species.length + ' entries in ' : mode === 'add' ? 'Add to ' : 'Create ') + BattleLog.escapeHTML(mode === 'new' ? parsed.name : profile.name) + ': ' + parsed.species.length + ' entries (including Megas).</p><p>' + parsed.species.map(function (id) { return BattleLog.escapeHTML(Dex.species.get(id).name); }).join(', ') + '</p><button class="button" name="confirmRosterImport">Confirm ' + mode + '</button> <button class="button" name="cancelRosterImport">Cancel</button>';
			}
			this.$('.roster-import-preview').html(html);
		},
		cancelRosterImport: function () {
			this.rosterImportPreview = null;
			this.$('.roster-import-preview').empty();
		},
		confirmRosterImport: function () {
			var preview = this.rosterImportPreview;
			if (!preview) return;
			var data = this.rosterData();
			var profile = data.profiles.find(function (p) { return p.id === preview.target; });
			if (preview.mode === 'new') {
				profile = {id: Date.now().toString(36) + Math.random().toString(36).slice(2), name: preview.parsed.name, species: []};
				data.profiles.push(profile);
			} else if (!profile || data.selected !== preview.target) { return this.cancelRosterImport(); }
			if (preview.mode === 'replace') profile.species = [];
			preview.parsed.species.forEach(function (id) { if (profile.species.indexOf(id) < 0) profile.species.push(id); });
			data.selected = profile.id;
			this.saveRosterProfiles(data);
			this.$('.roster-import-preview').text('Imported ' + profile.species.length + ' entries into ' + profile.name + '.');
		},
		rosterData: function () {
			var data = Storage.prefs('rosterprofiles');
			if (!data || !Array.isArray(data.profiles)) return {profiles: [], selected: '', enabled: false};
			return data;
		},
		rosterSpeciesID: function (name) {
			var species = Dex.species.get(name);
			if (!species.exists) return '';
			var base = Dex.species.get(species.baseSpecies);
			// Only explicitly cosmetic forms share an entry. Regional and other true forms stay distinct.
			if (base.cosmeticFormes && base.cosmeticFormes.indexOf(species.name) >= 0) return base.id;
			return species.id;
		},
		rosterQuickChange: function (event) {
			var data = this.rosterData();
			data.selected = event.currentTarget.value;
			data.enabled = !!data.selected;
			this.saveRosterProfiles(data);
		},
		pokemonPickerOptions: function () {
			var saved = Storage.prefs('pokemonpickerview') || {};
			return {hideMegas: !!saved.hideMegas, hideGimmicks: !!saved.hideGimmicks, customOnly: !!saved.customOnly,
				group: ['pulse', 'rift', 'regional'].indexOf(saved.group) >= 0 ? saved.group : 'all'};
		},
		renderPokemonPickerFilters: function () {
			var options = this.pokemonPickerOptions();
			var html = '<div class="pokemon-picker-filters"' + (this.curChartType === 'pokemon' ? '' : ' hidden') + '><details class="picker-filter-panel"' + (this.pickerFiltersOpen ? ' open' : '') + '><summary>Filters <span class="picker-filter-status" role="status" aria-live="polite" aria-atomic="true"></span></summary><div class="picker-filter-options">';
			[['hideMegas', 'Hide Megas'], ['hideGimmicks', 'Hide Gimmick Forms'], ['customOnly', 'Custom-only']].forEach(function (option) {
				html += '<label><input type="checkbox" class="pokemon-picker-option" data-option="' + option[0] + '"' + (options[option[0]] ? ' checked' : '') + ' /> ' + option[1] + '</label>';
			});
			html += '<label>Form group <select class="pokemon-picker-option" data-option="group">';
			[['all', 'All forms'], ['pulse', 'Pulse'], ['rift', 'Rift'], ['regional', 'Regional (incl. Aevian)']].forEach(function (option) {
				html += '<option value="' + option[0] + '"' + (options.group === option[0] ? ' selected' : '') + '>' + option[1] + '</option>';
			});
			return html + '</select></label><button type="button" class="button small" name="resetPokemonPickerFilters" title="Reset view filters; keep your search and roster profile">Reset filters</button></div>' +
				'<details class="picker-filter-help"><summary>What counts as a gimmick form?</summary><p>Megas, Primal, Gmax, Anomaly Core transformations, and forms marked battle-only. Ordinary regional and cosmetic forms stay visible. These controls only filter this list; they do not change legality or your team. Custom-only uses the same catalog as -custom. Preferences are saved in this browser.</p></details>' +
				'</details></div>';
		},
		pokemonPickerChange: function (event) {
			var input = event.currentTarget;
			var options = this.pokemonPickerOptions();
			var key = input.getAttribute('data-option');
			if (key === 'group') options.group = input.value;
			else options[key] = input.checked;
			Storage.prefs('pokemonpickerview', options);
			this.refreshPokemonPicker();
		},
		resetPokemonPickerFilters: function () {
			Storage.prefs('pokemonpickerview', {});
			this.$('.pokemon-picker-option[type=checkbox]').prop('checked', false);
			this.$('.pokemon-picker-option[data-option=group]').val('all');
			this.refreshPokemonPicker();
		},
		refreshPokemonPicker: function () {
			if (!this.search) return;
			this.search.engine.pickerOptions = this.pokemonPickerOptions();
			this.search.engine.results = null;
			this.search.find(this.search.q || '');
		},
		updatePokemonPickerStatus: function (rows) {
			var options = this.pokemonPickerOptions(), active = [];
			if (options.hideMegas) active.push('Megas hidden');
			if (options.hideGimmicks) active.push('Gimmick forms hidden');
			if (options.customOnly || this.search.q === '-custom') active.push('Custom-only');
			if (options.group !== 'all') active.push(options.group === 'regional' ? 'Regional' : options.group === 'pulse' ? 'Pulse' : 'Rift');
			var count = rows.filter(function (row) { return row[0] === 'pokemon'; }).length;
			this.$('.picker-filter-status').text(count + ' Pokémon' + (active.length ? ' · ' + active.join(' · ') : ''));
			return count;
		},
		renderRosterProfiles: function () {
			var data = this.rosterData();
			var profile = data.profiles.find(function (p) { return p.id === data.selected; });
			if (!this.profilesView) {
				return '<div class="roster-profiles"><label>Pokémon: <select class="roster-quick-select"><option value="">All Pokémon</option>' + data.profiles.map(function (p) {
					return '<option value="' + BattleLog.escapeHTML(p.id) + '"' + (data.enabled && p.id === data.selected ? ' selected' : '') + '>' + BattleLog.escapeHTML(p.name) + '</option>';
				}).join('') + '</select></label> <button class="button small" name="showRosterProfiles">Pokémon lists</button></div>';
			}
			var html = '<div class="roster-profiles" style="padding:8px"><label>Pokémon list: <select class="roster-profile-select"><option value="">None</option>';
			data.profiles.forEach(function (p) {
				html += '<option value="' + BattleLog.escapeHTML(p.id) + '"' + (p.id === data.selected ? ' selected' : '') + '>' + BattleLog.escapeHTML(p.name) + '</option>';
			});
			html += '</select></label> <label><input type="checkbox" class="roster-profile-filter"' + (data.enabled ? ' checked' : '') + (profile ? '' : ' disabled') + ' /> Only this roster</label> ';
			html += '<button class="button" name="createRosterProfile">New</button> ';
			if (profile) {
				html += '<button class="button" name="renameRosterProfile">Rename</button> <button class="button" name="deleteRosterProfile">Delete</button> ';
				html += '<details class="roster-manager"' + (this.profilesView ? ' open' : '') + '><summary>Manage species (' + profile.species.length + ')</summary>';
				html += '<p>Saved in this browser. True forms have separate entries.</p><div class="roster-chips">';
				html += profile.species.length ? profile.species.map(function (id) {
					var name = BattleLog.escapeHTML(Dex.species.get(id).name);
					return '<button class="button roster-chip" name="removeRosterSpecies" value="' + id + '" aria-label="Remove ' + name + '">' + name + ' ×</button>';
				}).join(' ') : '<p>This roster is empty. Add species below or turn the filter off.</p>';
				html += '</div><label>Find species or form <input class="textbox roster-species-search" type="search" placeholder="e.g. Raichu or Raichu-Alola" autocomplete="off" /></label>';
				html += '<div class="roster-species-matches" aria-live="polite">Type a name to add species.</div></details>';
			}
			if (data.deleted) {
				html += '<p class="roster-undo" role="status">Deleted “' + BattleLog.escapeHTML(data.deleted.profile.name) + '”. <button class="button" name="undoRosterDelete">Undo delete</button></p>';
			}
			return html + '</div>';
		},
		saveRosterProfiles: function (data) {
			this.cancelRosterImport();
			Storage.prefs('rosterprofiles', data);
			this.$('.roster-page [name=previewRosterImport][value=add], .roster-page [name=previewRosterImport][value=replace]').prop('disabled', !data.selected).attr('title', data.selected ? '' : 'Choose a Pokémon list first');
			var open = this.$('.roster-manager').prop('open');
			var query = this.$('.roster-species-search').val() || '';
			this.$('.roster-profiles').replaceWith(this.renderRosterProfiles());
			this.$('.roster-manager').prop('open', open);
			this.$('.roster-species-search').val(query);
			this.searchRosterSpecies();
			if (this.search && this.curChartType in this.searchChartTypes && this.search.engine.typedSearch) {
				this.search.engine.query = undefined;
				this.search.find(this.search.q || '');
			}
		},
		rosterProfileChange: function (event) {
			var data = this.rosterData();
			data.selected = event.currentTarget.value;
			if (!data.selected) data.enabled = false;
			this.saveRosterProfiles(data);
		},
		rosterFilterChange: function (event) {
			var data = this.rosterData();
			data.enabled = event.currentTarget.checked;
			this.saveRosterProfiles(data);
		},
		createRosterProfile: function () {
			var self = this;
			app.addPopupPrompt('Roster name:', 'Create', function (name) {
				name = name.trim().slice(0, 80);
				if (!name) return;
				var data = self.rosterData();
				data.selected = Date.now().toString(36) + Math.random().toString(36).slice(2);
				data.profiles.push({id: data.selected, name: name, species: []});
				self.saveRosterProfiles(data);
			});
		},
		renameRosterProfile: function () {
			var self = this;
			var data = this.rosterData();
			var profile = data.profiles.find(function (p) { return p.id === data.selected; });
			if (!profile) return;
			app.addPopupPrompt('New roster name:', 'Rename', function (name) {
				name = name.trim().slice(0, 80);
				if (!name) return;
				profile.name = name;
				self.saveRosterProfiles(data);
			});
		},
		deleteRosterProfile: function () {
			var data = this.rosterData();
			var index = data.profiles.findIndex(function (p) { return p.id === data.selected; });
			if (index < 0) return;
			data.deleted = {profile: data.profiles[index], index: index, enabled: data.enabled};
			data.profiles.splice(index, 1);
			data.selected = '';
			data.enabled = false;
			this.saveRosterProfiles(data);
		},
		undoRosterDelete: function () {
			var data = this.rosterData();
			var deleted = data.deleted;
			if (!deleted) return;
			if (!data.profiles.some(function (p) { return p.id === deleted.profile.id; })) {
				data.profiles.splice(deleted.index, 0, deleted.profile);
			}
			data.selected = deleted.profile.id;
			data.enabled = deleted.enabled;
			delete data.deleted;
			this.saveRosterProfiles(data);
		},
		searchRosterSpecies: function () {
			var query = toID(this.$('.roster-species-search').val() || '');
			var data = this.rosterData();
			var profile = data.profiles.find(function (p) { return p.id === data.selected; });
			if (!profile) return;
			var matches = [];
			var seen = {};
			if (query) for (var key in window.BattlePokedex) {
				if (key.indexOf(query) < 0) continue;
				var id = this.rosterSpeciesID(key);
				if (!id || seen[id] || DexSearch.pokemonPickerTraits(Dex.species.get(id)).totem) continue;
				seen[id] = true;
				var added = profile.species.indexOf(id) >= 0;
				matches.push('<button class="button" name="addRosterSpecies" value="' + id + '"' + (added ? ' disabled' : '') + '>' + BattleLog.escapeHTML(Dex.species.get(id).name) + (added ? ' — Added' : ' +') + '</button>');
				if (matches.length === 20) break;
			}
			this.$('.roster-species-matches').html(matches.join(' ') || (query ? 'No matching species. Try another name.' : 'Type a name to add species.'));
		},
		addRosterSpecies: function (id) { this.editRosterSpecies(id, false); },
		removeRosterSpecies: function (id) { this.editRosterSpecies(id, true); },
		editRosterSpecies: function (id, remove) {
			var data = this.rosterData();
			var profile = data.profiles.find(function (p) { return p.id === data.selected; });
			id = this.rosterSpeciesID(id);
			if (!profile || !id) return;
			if (remove) profile.species = profile.species.filter(function (species) { return species !== id; });
			else this.rosterExpandedSpecies(id).forEach(function (entry) { if (profile.species.indexOf(entry) < 0) profile.species.push(entry); });
			this.saveRosterProfiles(data);
			this.$('.roster-species-search').focus();
		},

		updateSetView: function () {
			// pokemon
			var buf = '<div class="pad">';
			buf += '<button name="back" class="button"><i class="fa fa-chevron-left"></i> Team</button></div>';
			buf += '<div class="teambar">';
			buf += this.renderTeambar();
			buf += '</div>';

			// pokemon
			buf += '<div class="teamchartbox individual">';
			buf += '<ol class="teamchart">';
			buf += this.renderSet(this.curSet, this.curSetLoc);
			buf += '</ol>';
			buf += '</div>';

			// results
			this.chartPrevSearch = '[init]';
			buf += '<div class="teambuilder-results"><div class="picker-return-bar"><button type="button" class="button" name="returnToPokemonEditor">↑ Back to Pokémon</button></div>' + this.renderRosterProfiles() + this.renderPokemonPickerFilters() + '<div class="roster-search-results"></div></div>';

			// import/export
			buf += '<div class="teambuilder-pokemon-import">';
			buf += '<div class="pokemonedit-buttons"><button name="closePokemonImport" class="button"><i class="fa fa-chevron-left"></i> Back</button> <button name="savePokemonImport" class="button"><i class="fa fa-floppy-o"></i> Save</button></div>';
			buf += '<textarea class="pokemonedit textbox" rows="14"></textarea>';
			buf += '<div class="teambuilder-import-smogon-sets"></div>';
			buf += '</div>';

			this.$el.html('<div class="teamwrapper editing-set">' + buf + '</div>');
			if ($(window).width() < 640) this.show();
			this.$chart = this.$('.roster-search-results');
			this.search = new BattleSearch(this.$chart, this.$('.teambuilder-results'));
			// These lists scroll with the room rather than an internal results viewport.
			this.search.renderAll = true;
			this.search.engine.pickerOptions = this.pokemonPickerOptions();
			var room = this;
			this.search.rosterFilter = function (rows) {
				var data = room.rosterData();
				var profile = data.profiles.find(function (p) { return p.id === data.selected; });
				if (data.enabled && profile) rows = rows.filter(function (row) {
					return row[0] !== 'pokemon' || profile.species.indexOf(room.rosterSpeciesID(row[1])) >= 0;
				});
				rows = rows.filter(function (row, index) {
					if (row[0] !== 'header') return true;
					for (var i = index + 1; i < rows.length && rows[i][0] !== 'header'; i++) {
						if (rows[i][0] === 'pokemon') return true;
					}
					return false;
				});
				if (!room.updatePokemonPickerStatus(rows)) {
					rows.push(['html', '<p>No Pokemon match. <button type="button" class="button" name="resetPokemonPickerFilters">Reset view filters</button> or adjust the search, type/ability filters, or roster profile.</p>']);
				}
				return rows;
			};
			var self = this;
			// fun fact: Backbone DOM events don't support scroll...
			// I guess scroll doesn't bubble like other events
			this.$('.teambuilder-results').on('scroll', function () {
				if (self.curChartType in self.searchChartTypes) {
					self.search.updateScroll();
				}
			});
		},
		updateSetTop: function () {
			this.$('.teambar').html(this.renderTeambar());
			this.$('.teamchart').first().html(this.renderSet(this.curSet, this.curSetLoc));
		},
		renderTeambar: function () {
			var buf = '';
			var isAdd = false;
			if (this.curSetList.length && !this.curSetList[this.curSetList.length - 1].species && this.curSetLoc !== this.curSetList.length - 1) {
				this.curSetList.splice(this.curSetList.length - 1, 1);
			}
			// if in a box, try to show at least 2 and up to 4 other pokemon in each direction
			// but don't step outside the array bounds (obviously)
			var start = 0;
			var end = this.curSetList.length;
			if (end > 6 || (end === 6 && this.curTeam.capacity > 6)) {
				start = this.curSetLoc - 2;
				if (start < 0) start = 0;
				if (start + 5 > end) start = end - 5;
				end = start + 5;
			}
			for (var i = start; i < end; i++) {
				var set = this.curSetList[i];
				var pokemonicon = '<span class="picon pokemonicon-' + i + '" style="' + Dex.getPokemonIcon(Dex.getAbilityFormPreviewSet(set)) + '"></span>';
				if (!set.species) {
					buf += '<button disabled class="addpokemon" aria-label="Add Pok&eacute;mon"><i class="fa fa-plus"></i></button> ';
					isAdd = true;
				} else if (i == this.curSetLoc) {
					buf += '<button disabled class="pokemon">' + pokemonicon + BattleLog.escapeHTML(set.name || this.curTeam.dex.species.get(set.species).baseSpecies || '<i class="fa fa-plus"></i>') + '</button> ';
				} else {
					buf += '<button name="selectPokemon" value="' + i + '" class="pokemon">' + pokemonicon + BattleLog.escapeHTML(set.name || this.curTeam.dex.species.get(set.species).baseSpecies) + '</button> ';
				}
			}
			if (this.curSetList.length < this.curTeam.capacity && !isAdd) {
				buf += '<button name="addPokemon"><i class="fa fa-plus"></i></button> ';
			}
			return buf;
		},
		updatePokemonSprite: function () {
			var set = this.curSet;
			if (!set) return;

			this.$('.setchart').attr('style', Dex.getTeambuilderSprite(Dex.getAbilityFormPreviewSet(set, this.curTeam.dex), this.curTeam.gen));

			this.$('.pokemonicon-' + this.curSetLoc).css('background', Dex.getPokemonIcon(Dex.getAbilityFormPreviewSet(set)).substr(11));

			var item = this.curTeam.dex.items.get(set.item);
			if (item.id) {
				this.$('.setcol-details .itemicon').css('background', Dex.getItemIcon(item).substr(11));
			} else {
				this.$('.setcol-details .itemicon').css('background', 'none');
			}

			var previewSpecies = Dex.getAbilityFormPreview(set, this.curTeam.dex).species;
			this.$('.setcell-typeicons').html(previewSpecies.types.map(function (type) { return Dex.getTypeIcon(type); }).join(''));
			this.updateStatGraph();
		},
		updateStatGraph: function () {
			var set = this.curSet;
			if (!set) return;

			var stats = {hp:'', atk:'', def:'', spa:'', spd:'', spe:''};

			var supportsEVs = !this.curTeam.format.includes('letsgo');

			// stat cell
			var buf = '<span class="statrow statrow-head"><label></label> <span class="statgraph"></span> <em>' + (supportsEVs ? 'EV' : 'AV') + '</em></span>';
			var defaultEV = (this.curTeam.gen > 2 ? 0 : 252);
			for (var stat in stats) {
				if (stat === 'spd' && this.curTeam.gen === 1) continue;
				stats[stat] = this.getStat(stat, set);
				var ev = (set.evs[stat] === undefined ? defaultEV : set.evs[stat]);
				var evBuf = '<em>' + (ev === defaultEV ? '' : ev) + '</em>';
				if (BattleNatures[set.nature] && BattleNatures[set.nature].plus === stat) {
					evBuf += '<small>+</small>';
				} else if (BattleNatures[set.nature] && BattleNatures[set.nature].minus === stat) {
					evBuf += '<small>&minus;</small>';
				}
				var width = stats[stat] * 75 / 504;
				if (stat == 'hp') width = stats[stat] * 75 / 704;
				if (width > 75) width = 75;
				var color = Math.floor(stats[stat] * 180 / 714);
				if (color > 360) color = 360;
				var statName = this.curTeam.gen === 1 && stat === 'spa' ? 'Spc' : BattleStatNames[stat];
				buf += '<span class="statrow"><label>' + statName + '</label> <span class="statgraph"><span style="width:' + width + 'px;background:hsl(' + color + ',40%,75%);"></span></span> ' + evBuf + '</span>';
			}
			this.$('button[name=stats]').html(buf);

			if (this.curChartType !== 'stats') return;

			buf = '<div></div>';
			for (var stat in stats) {
				if (stat === 'spd' && this.curTeam.gen === 1) continue;
				buf += '<div><b>' + stats[stat] + '</b></div>';
			}
			this.$chart.find('.statscol').html(buf);

			buf = '<div></div>';
			var totalev = 0;
			for (var stat in stats) {
				if (stat === 'spd' && this.curTeam.gen === 1) continue;
				var width = stats[stat] * 180 / 504;
				if (stat == 'hp') width = stats[stat] * 180 / 704;
				if (width > 179) width = 179;
				var color = Math.floor(stats[stat] * 180 / 714);
				if (color > 360) color = 360;
				buf += '<div><em><span style="width:' + Math.floor(width) + 'px;background:hsl(' + color + ',85%,45%);border-color:hsl(' + color + ',85%,35%)"></span></em></div>';
				totalev += (set.evs[stat] || 0);
			}

			if (this.curTeam.gen > 2 && supportsEVs) buf += '<div><em>Remaining:</em></div>';
			this.$chart.find('.graphcol').html(buf);

			if (this.curTeam.gen <= 2) return;
			if (supportsEVs) {
				var maxEv = 510;
				if (totalev <= maxEv) {
					this.$chart.find('.totalev').html('<em>' + (totalev > (maxEv - 2) ? 0 : (maxEv - 2) - totalev) + '</em>');
				} else {
					this.$chart.find('.totalev').html('<b>' + (maxEv - totalev) + '</b>');
				}
			}
			this.$chart.find('select[name=nature]').val(set.nature || 'Serious');
		},
		curChartType: '',
		curChartName: '',
		searchChartTypes: {
			pokemon: 'pokemon',
			ability: 'abilities',
			move: 'moves',
			item: 'items'
		},
		updateChart: function (pokemonChanged, wasIncomplete) {
			var type = this.curChartType;
			this.$('.pokemon-picker-filters').prop('hidden', type !== 'pokemon');
			if (type === 'stats') {
				this.search.qType = null;
				this.search.qName = null;
				this.updateStatForm();
				return;
			}
			if (type === 'details') {
				this.search.qType = null;
				this.search.qName = null;
				this.updateDetailsForm();
				return;
			}

			var $inputEl = this.$('input[name=' + this.curChartName + ']');
			var q = $inputEl.val();

			if (pokemonChanged || this.search.qName !== this.curChartName) {
				var cur = {};
				cur[toID(q)] = 1; // make sure selected one is first
				if (type === 'move') {
					cur[toID(this.$('input[name=move1]').val())] = 1;
					cur[toID(this.$('input[name=move2]').val())] = 1;
					cur[toID(this.$('input[name=move3]').val())] = 1;
					cur[toID(this.$('input[name=move4]').val())] = 1;
				}
				if (type !== this.search.qType) {
					this.$chart.scrollTop(0);
				}
				this.search.$inputEl = $inputEl;
				this.search.setType(type, this.curTeam.format || 'gen9', this.curSet, cur);
				this.qInitial = q;
				this.search.qName = this.curChartName;
				if (wasIncomplete) {
					if (this.search.find(q)) {
						if (this.search.q) this.$chart.find('a').first().addClass('hover');
					}
				}
			} else if (q !== this.qInitial) {
				this.qInitial = undefined;
				if (this.search.find(q)) {
					if (this.search.q) this.$chart.find('a').first().addClass('hover');
				}
			}
		},
		selectPokemon: function (i) {
			i = +i;
			var set = this.curSetList[i];
			if (set) {
				this.curSet = set;
				this.curSetLoc = i;
				if (!this.curChartName) {
					this.curChartName = 'details';
					this.curChartType = 'details';
				}
				if (this.curChartType in this.searchChartTypes) {
					this.update();
					this.updateChart(true);
					this.$('input[name=' + this.curChartName + ']').select();
				} else {
					this.update();
					this.updateChart(true);
				}
			}
		},
		stats: function (i, button) {
			if (!this.curSet) this.selectPokemon($(button).closest('li').val());
			this.curChartName = 'stats';
			this.curChartType = 'stats';
			this.updateChart();
		},
		details: function (i, button) {
			if (!this.curSet) this.selectPokemon($(button).closest('li').val());
			this.curChartName = 'details';
			this.curChartType = 'details';
			this.updateChart();
		},

		/*********************************************************
		 * Set stat form
		 *********************************************************/

		plus: '',
		minus: '',
		smogdexLink: function (s) {
			var species = this.curTeam.dex.species.get(s);
			var format = this.curTeam && this.curTeam.format;
			var smogdexid = toID(species.baseSpecies);

			if (species.id === 'meowstic') {
				smogdexid = 'meowstic-m';
			} else if (species.forme) {
				switch (species.baseSpecies) {
				case 'Alcremie':
				case 'Basculin':
				case 'Burmy':
				case 'Castform':
				case 'Cherrim':
				case 'Deerling':
				case 'Flabebe':
				case 'Floette':
				case 'Florges':
				case 'Gastrodon':
				case 'Genesect':
				case 'Keldeo':
				case 'Mimikyu':
				case 'Minior':
				case 'Pikachu':
				case 'Polteageist':
				case 'Sawsbuck':
				case 'Shellos':
				case 'Sinistea':
				case 'Vivillon':
					break;
				default:
					smogdexid += '-' + toID(species.forme);
					break;
				}
			}

			var generationNumber = 9;
			if (format.substr(0, 3) === 'gen') {
				var number = parseInt(format.charAt(3), 10);
				if (1 <= number && number <= 8) {
					generationNumber = number;
				}
				format = format.substr(4);
			}
			var generation = ['rb', 'gs', 'rs', 'dp', 'bw', 'xy', 'sm', 'ss', 'sv'][generationNumber - 1];
			if (format === 'battlespotdoubles') {
				smogdexid += '/vgc15';
			} else if (format === 'doublesou' || format === 'doublesuu') {
				smogdexid += '/doubles';
			} else if (format === 'ou' || format === 'uu' || format === 'ru' || format === 'nu' || format === 'pu' || format === 'lc' || format === 'monotype' || format === 'mixandmega' || format === 'nfe' || format === 'nationaldex' || format === 'stabmons' || format === '1v1' || format === 'almostanyability') {
				smogdexid += '/' + format;
			} else if (format === 'balancedhackmons') {
				smogdexid += '/bh';
			} else if (format === 'anythinggoes') {
				smogdexid += '/ag';
			} else if (format === 'nationaldexag') {
				smogdexid += '/national-dex-ag';
			}
			return 'http://smogon.com/dex/' + generation + '/pokemon/' + smogdexid + '/';
		},
		updateStatForm: function (setGuessed) {
			var buf = '';
			var set = this.curSet;
			var selectedForm = this.currentFormPreview && this.currentFormPreview(set);
			if (selectedForm) { set = Object.assign({}, set, {species: selectedForm.name, ability: selectedForm.ability}); }
			var species = Dex.getAbilityFormPreview(set, this.curTeam.dex).species;

			var baseStats = Dex.getAbilityFormPreview(set, this.curTeam.dex).baseStats;

			buf += '<div class="resultheader"><h3>EVs' + (selectedForm ? ' — Preview: ' + BattleLog.escapeHTML(selectedForm.name) : '') + '</h3></div>';
			buf += '<div class="statform">';
			var guess = new BattleStatGuesser(this.curTeam.format).guess(set);
			var role = guess.role;

			var guessedEVs = guess.evs;
			var guessedPlus = guess.plusStat;
			var guessedMinus = guess.minusStat;
			buf += '<p class="suggested"><small>Guessed spread:';
			if (role === '?') {
				buf += ' (Please choose 4 moves to get a guessed spread) (<a target="_blank" href="' + this.smogdexLink(species) + '">Smogon&nbsp;analysis</a>)</small></p>';
			} else {
				buf += ' </small><button name="setStatFormGuesses" class="button">' + role + ': ';
				for (var i in BattleStatNames) {
					if (guessedEVs[i]) {
						var statName = this.curTeam.gen === 1 && i === 'spa' ? 'Spc' : BattleStatNames[i];
						buf += '' + guessedEVs[i] + ' ' + statName + ' / ';
					}
				}
				if (guessedPlus && guessedMinus) buf += ' (+' + BattleStatNames[guessedPlus] + ', -' + BattleStatNames[guessedMinus] + ')';
				else buf = buf.slice(0, -3);
				buf += '</button><small> (<a target="_blank" href="' + this.smogdexLink(species) + '">Smogon&nbsp;analysis</a>)</small></p>';
				// buf += ' <small>(' + role + ' | bulk: phys ' + Math.round(guess.moveCount.physicalBulk/1000) + ' + spec ' + Math.round(guess.moveCount.specialBulk/1000) + ' = ' + Math.round(guess.moveCount.bulk/1000) + ')</small>';
			}

			if (setGuessed) {
				set.evs = guessedEVs;
				this.plus = guessedPlus;
				this.minus = guessedMinus;
				this.updateNature();

				this.save();
				this.updateStatGraph();
				this.natureChange();
				return;
			}

			var stats = {hp:'', atk:'', def:'', spa:'', spd:'', spe:''};
			if (this.curTeam.gen === 1) delete stats.spd;
			if (!set) return;
			var nature = BattleNatures[set.nature || 'Serious'];
			if (!nature) nature = {};

			var supportsEVs = !this.curTeam.format.includes('letsgo');
			// var supportsAVs = !supportsEVs && this.curTeam.format.endsWith('norestrictions');
			var defaultEV = this.curTeam.gen <= 2 ? 252 : 0;
			var maxEV = supportsEVs ? 252 : 200;
			var stepEV = supportsEVs ? 4 : 1;

			// label column
			buf += '<div class="col labelcol"><div></div>';
			buf += '<div><label>HP</label></div><div><label>Attack</label></div><div><label>Defense</label></div><div>';
			if (this.curTeam.gen === 1) {
				buf += '<label>Special</label></div>';
			} else {
				buf += '<label>Sp. Atk.</label></div><div><label>Sp. Def.</label></div>';
			}

			buf += '<div><label>Speed</label></div></div>';

			buf += '<div class="col basestatscol"><div><em>Base</em></div>';
			for (var i in stats) {
				buf += '<div><b>' + baseStats[i] + '</b></div>';
			}
			buf += '</div>';

			buf += '<div class="col graphcol"><div></div>';
			for (var i in stats) {
				stats[i] = this.getStat(i);
				var width = stats[i] * 180 / 504;
				if (i == 'hp') width = Math.floor(stats[i] * 180 / 704);
				if (width > 179) width = 179;
				var color = Math.floor(stats[i] * 180 / 714);
				if (color > 360) color = 360;
				buf += '<div><em><span style="width:' + Math.floor(width) + 'px;background:hsl(' + color + ',85%,45%);border-color:hsl(' + color + ',85%,35%)"></span></em></div>';
			}
			if (this.curTeam.gen > 2 && supportsEVs) buf += '<div><em>Remaining:</em></div>';
			buf += '</div>';

			buf += '<div class="col evcol"><div><strong>' + (supportsEVs ? 'EVs' : 'AVs') + '</strong></div>';
			var totalev = 0;
			this.plus = '';
			this.minus = '';
			for (var i in stats) {
				var val;
				val = '' + ((set.evs[i] === undefined ? defaultEV : set.evs[i]) || '');
				if (nature.plus === i) {
					val += '+';
					this.plus = i;
				}
				if (nature.minus === i) {
					val += '-';
					this.minus = i;
				}
				buf += '<div><input type="text" name="stat-' + i + '" value="' + val + '" class="textbox inputform numform" /></div>';
				totalev += (set.evs[i] || 0);
			}
			if (this.curTeam.gen > 2 && supportsEVs) {
				var maxTotalEVs = 510;
				if (totalev <= maxTotalEVs) {
					buf += '<div class="totalev"><em>' + (totalev > (maxTotalEVs - 2) ? 0 : (maxTotalEVs - 2) - totalev) + '</em></div>';
				} else {
					buf += '<div class="totalev"><b>' + (maxTotalEVs - totalev) + '</b></div>';
				}
			}
			buf += '</div>';

			buf += '<div class="col evslidercol"><div></div>';
			for (var i in stats) {
				if (i === 'spd' && this.curTeam.gen === 1) continue;
				buf += '<div><input type="range" name="evslider-' + i + '" value="' + BattleLog.escapeHTML(set.evs[i] === undefined ? '' + defaultEV : '' + set.evs[i]) + '" min="0" max="' + maxEV + '" step="' + stepEV + '" class="evslider" tabindex="-1" aria-hidden="true" /></div>';
			}
			buf += '</div>';

			if (this.curTeam.gen > 2) {
				buf += '<div class="col ivcol"><div><strong>IVs</strong></div>';
				if (!set.ivs) set.ivs = {};
				for (var i in stats) {
					if (set.ivs[i] === undefined || isNaN(set.ivs[i])) set.ivs[i] = 31;
					var val = '' + (set.ivs[i]);
					buf += '<div><input type="number" name="iv-' + i + '" value="' + BattleLog.escapeHTML(val) + '" class="textbox inputform numform" min="0" max="31" step="1" /></div>';
				}
				var hpType = '';
				if (set.moves) {
					for (var i = 0; i < set.moves.length; i++) {
						var moveid = toID(set.moves[i]);
						if (moveid.slice(0, 11) === 'hiddenpower') {
							hpType = moveid.slice(11);
						}
					}
				}
				if (hpType && !this.canHyperTrain(set)) {
					var hpIVs;
					switch (hpType) {
					case 'dark':
						hpIVs = ['111111']; break;
					case 'dragon':
						hpIVs = ['011111', '101111', '110111']; break;
					case 'ice':
						hpIVs = ['010111', '100111', '111110']; break;
					case 'psychic':
						hpIVs = ['011110', '101110', '110110']; break;
					case 'electric':
						hpIVs = ['010110', '100110', '111011']; break;
					case 'grass':
						hpIVs = ['011011', '101011', '110011']; break;
					case 'water':
						hpIVs = ['100011', '111010']; break;
					case 'fire':
						hpIVs = ['101010', '110010']; break;
					case 'steel':
						hpIVs = ['100010', '111101']; break;
					case 'ghost':
						hpIVs = ['101101', '110101']; break;
					case 'bug':
						hpIVs = ['100101', '111100', '101100']; break;
					case 'rock':
						hpIVs = ['001100', '110100', '100100']; break;
					case 'ground':
						hpIVs = ['000100', '111001', '101001']; break;
					case 'poison':
						hpIVs = ['001001', '110001', '100001']; break;
					case 'flying':
						hpIVs = ['000001', '111000', '101000']; break;
					case 'fighting':
						hpIVs = ['001000', '110000', '100000']; break;
					}
					buf += '<div style="margin-left:-80px;text-align:right"><select name="ivspread" class="button">';
					buf += '<option value="" selected>HP ' + hpType.charAt(0).toUpperCase() + hpType.slice(1) + ' IVs</option>';

					var minStat = this.curTeam.gen >= 6 ? 0 : 2;

					buf += '<optgroup label="min Atk">';
					for (var i = 0; i < hpIVs.length; i++) {
						var spread = '';
						for (var j = 0; j < 6; j++) {
							if (j) spread += '/';
							spread += (j === 1 ? minStat : 30) + parseInt(hpIVs[i].charAt(j), 10);
						}
						buf += '<option value="' + spread + '">' + spread + '</option>';
					}
					buf += '</optgroup>';
					buf += '<optgroup label="min Atk, min Spe">';
					for (var i = 0; i < hpIVs.length; i++) {
						var spread = '';
						for (var j = 0; j < 6; j++) {
							if (j) spread += '/';
							spread += (j === 5 || j === 1 ? minStat : 30) + parseInt(hpIVs[i].charAt(j), 10);
						}
						buf += '<option value="' + spread + '">' + spread + '</option>';
					}
					buf += '</optgroup>';
					buf += '<optgroup label="max all">';
					for (var i = 0; i < hpIVs.length; i++) {
						var spread = '';
						for (var j = 0; j < 6; j++) {
							if (j) spread += '/';
							spread += 30 + parseInt(hpIVs[i].charAt(j), 10);
						}
						buf += '<option value="' + spread + '">' + spread + '</option>';
					}
					buf += '</optgroup>';
					buf += '<optgroup label="min Spe">';
					for (var i = 0; i < hpIVs.length; i++) {
						var spread = '';
						for (var j = 0; j < 6; j++) {
							if (j) spread += '/';
							spread += (j === 5 ? minStat : 30) + parseInt(hpIVs[i].charAt(j), 10);
						}
						buf += '<option value="' + spread + '">' + spread + '</option>';
					}
					buf += '</optgroup>';

					buf += '</select></div>';
				} else {
					buf += '<div style="margin-left:-80px;text-align:right"><select name="ivspread" class="button">';
					buf += '<option value="" selected>IV spreads</option>';

					buf += '<optgroup label="min Atk">';
					buf += '<option value="31/0/31/31/31/31">31/0/31/31/31/31</option>';
					buf += '</optgroup>';
					buf += '<optgroup label="min Atk, min Spe">';
					buf += '<option value="31/0/31/31/31/0">31/0/31/31/31/0</option>';
					buf += '</optgroup>';
					buf += '<optgroup label="max all">';
					buf += '<option value="31/31/31/31/31/31">31/31/31/31/31/31</option>';
					buf += '</optgroup>';
					buf += '<optgroup label="min Spe">';
					buf += '<option value="31/31/31/31/31/0">31/31/31/31/31/0</option>';
					buf += '</optgroup>';

					buf += '</select></div>';
				}
				buf += '</div>';
			} else {
				buf += '<div class="col ivcol"><div><strong>DVs</strong></div>';
				if (!set.ivs) set.ivs = {};
				for (var i in stats) {
					if (set.ivs[i] === undefined || isNaN(set.ivs[i])) set.ivs[i] = 31;
					var val = '' + Math.floor(set.ivs[i] / 2);
					buf += '<div><input type="number" name="iv-' + i + '" value="' + BattleLog.escapeHTML(val) + '" class="textbox inputform numform" min="0" max="15" step="1" /></div>';
				}
				buf += '</div>';
			}

			buf += '<div class="col statscol"><div></div>';
			for (var i in stats) {
				buf += '<div><b>' + stats[i] + '</b></div>';
			}
			buf += '</div>';

			if (this.curTeam.gen > 2) {
				buf += '<p style="clear:both">Nature: <select name="nature" class="button">';
				for (var i in BattleNatures) {
					var curNature = BattleNatures[i];
					buf += '<option value="' + i + '"' + (curNature === nature ? 'selected="selected"' : '') + '>' + i;
					if (curNature.plus) {
						buf += ' (+' + BattleStatNames[curNature.plus] + ', -' + BattleStatNames[curNature.minus] + ')';
					}
					buf += '</option>';
				}
				buf += '</select></p>';

				buf += '<p><em>Protip:</em> You can also set natures by typing <kbd>+</kbd> and <kbd>-</kbd> next to a stat.</p>';
			}

			buf += '</div>';
			this.$chart.html(buf);
		},
		setStatFormGuesses: function () {
			this.updateStatForm(true);
		},
		setSlider: function (stat, val) {
			this.$chart.find('input[name=evslider-' + stat + ']').val(val || 0);
		},
		updateNature: function () {
			var set = this.curSet;
			if (!set) return;

			if (this.plus === '' || this.minus === '') {
				set.nature = 'Serious';
			} else {
				for (var i in BattleNatures) {
					if (BattleNatures[i].plus === this.plus && BattleNatures[i].minus === this.minus) {
						set.nature = i;
						break;
					}
				}
			}
		},
		statChange: function (e) {
			var inputName = '';
			inputName = e.currentTarget.name;
			var val = Math.abs(parseInt(e.currentTarget.value, 10));
			var supportsEVs = !this.curTeam.format.includes('letsgo');
			var supportsAVs = !supportsEVs && this.curTeam.format.endsWith('norestrictions');
			var set = this.curSet;
			if (!set) return;

			if (inputName.substr(0, 5) === 'stat-') {
				// EV
				// Handle + and -
				var stat = inputName.substr(5);

				var lastchar = e.currentTarget.value.charAt(e.target.value.length - 1);
				var firstchar = e.currentTarget.value.charAt(0);
				var natureChange = true;
				if ((lastchar === '+' || firstchar === '+') && stat !== 'hp') {
					if (this.plus && this.plus !== stat) this.$chart.find('input[name=stat-' + this.plus + ']').val(set.evs[this.plus] || '');
					this.plus = stat;
				} else if ((lastchar === '-' || lastchar === "\u2212" || firstchar === '-' || firstchar === "\u2212") && stat !== 'hp') {
					if (this.minus && this.minus !== stat) this.$chart.find('input[name=stat-' + this.minus + ']').val(set.evs[this.minus] || '');
					this.minus = stat;
				} else if (this.plus === stat) {
					this.plus = '';
				} else if (this.minus === stat) {
					this.minus = '';
				} else {
					natureChange = false;
				}
				if (natureChange) {
					this.updateNature();
				}

				// cap
				if (val > 252) val = 252;
				if (val < 0 || isNaN(val)) val = 0;

				if (set.evs[stat] !== val || natureChange) {
					set.evs[stat] = val;
					if (this.ignoreEVLimits) {
						var evNum = supportsEVs ? 252 : supportsAVs ? 200 : 0;
						if (set.evs['hp'] === undefined) set.evs['hp'] = evNum;
						if (set.evs['atk'] === undefined) set.evs['atk'] = evNum;
						if (set.evs['def'] === undefined) set.evs['def'] = evNum;
						if (set.evs['spa'] === undefined) set.evs['spa'] = evNum;
						if (set.evs['spd'] === undefined) set.evs['spd'] = evNum;
						if (set.evs['spe'] === undefined) set.evs['spe'] = evNum;
					}
					this.setSlider(stat, val);
					this.updateStatGraph();
				}
			} else {
				// IV
				var stat = inputName.substr(3);

				if (this.curTeam.gen <= 2) {
					val *= 2;
					if (val === 30) val = 31;
				}

				if (val > 31 || isNaN(val)) val = 31;
				if (val < 0) val = 0;

				if (!set.ivs) set.ivs = {};
				if (set.ivs[stat] !== val) {
					set.ivs[stat] = val;
					this.updateIVs();
					this.updateStatGraph();
				}
			}
			this.save();
		},
		updateIVs: function () {
			var set = this.curSet;
			if (!set.moves || this.canHyperTrain(set)) return;
			var hasHiddenPower = false;
			for (var i = 0; i < set.moves.length; i++) {
				if (toID(set.moves[i]).slice(0, 11) === 'hiddenpower') {
					hasHiddenPower = true;
					break;
				}
			}
			if (!hasHiddenPower) return;
			var hpTypes = ['Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark'];
			var hpType;
			if (this.curTeam.gen <= 2) {
				var hpDV = Math.floor(set.ivs.hp / 2);
				var atkDV = Math.floor(set.ivs.atk / 2);
				var defDV = Math.floor(set.ivs.def / 2);
				var speDV = Math.floor(set.ivs.spe / 2);
				var spcDV = Math.floor(set.ivs.spa / 2);
				hpType = hpTypes[4 * (atkDV % 4) + (defDV % 4)];
				var expectedHpDV = (atkDV % 2) * 8 + (defDV % 2) * 4 + (speDV % 2) * 2 + (spcDV % 2);
				if (expectedHpDV !== hpDV) {
					set.ivs.hp = expectedHpDV * 2;
					if (set.ivs.hp === 30) set.ivs.hp = 31;
					this.$chart.find('input[name=iv-hp]').val(expectedHpDV);
				}
			} else {
				var hpTypeX = 0;
				var i = 1;
				var stats = {hp: 31, atk: 31, def: 31, spe: 31, spa: 31, spd: 31};
				for (var s in stats) {
					if (set.ivs[s] === undefined) set.ivs[s] = 31;
					hpTypeX += i * (set.ivs[s] % 2);
					i *= 2;
				}
				hpType = hpTypes[Math.floor(hpTypeX * 15 / 63)];
			}
			for (var i = 0; i < set.moves.length; i++) {
				if (toID(set.moves[i]).slice(0, 11) === 'hiddenpower') {
					set.moves[i] = "Hidden Power " + hpType;
					if (i < 4) this.$('input[name=move' + (i + 1) + ']').val("Hidden Power " + hpType);
				}
			}
		},
		statSlide: function (e) {
			var slider = e.currentTarget;
			var stat = slider.name.substr(9);
			var set = this.curSet;
			if (!set) return;
			var val = +slider.value;
			var originalVal = val;
			var result = this.getStat(stat, set, val);
			var supportsEVs = !this.curTeam.format.includes('letsgo');
			var supportsAVs = !supportsEVs && this.curTeam.format.endsWith('norestrictions');
			if (supportsEVs) {
				while (val > 0 && this.getStat(stat, set, val - 4) == result) val -= 4;
			}

			if (supportsEVs && !this.ignoreEVLimits && set.evs) {
				var total = 0;
				for (var i in set.evs) {
					total += (i === stat ? val : set.evs[i]);
				}
				var totalLimit = 508;
				var limit = 252;
				if (total > totalLimit && val - total + totalLimit >= 0) {
					// don't allow dragging beyond 508 EVs
					val = val - total + totalLimit;

					// make sure val is a legal value
					val = +val;
					if (!val || val <= 0) val = 0;
					if (val > limit) val = limit;
				}
			}

			// Don't try this at home.
			// I am a trained professional.
			if (val !== originalVal) slider.value = val;

			if (!set.evs) set.evs = {};
			if (this.ignoreEVLimits) {
				var evNum = supportsEVs ? 252 : supportsAVs ? 200 : 0;
				if (set.evs['hp'] === undefined) set.evs['hp'] = evNum;
				if (set.evs['atk'] === undefined) set.evs['atk'] = evNum;
				if (set.evs['def'] === undefined) set.evs['def'] = evNum;
				if (set.evs['spa'] === undefined) set.evs['spa'] = evNum;
				if (set.evs['spd'] === undefined) set.evs['spd'] = evNum;
				if (set.evs['spe'] === undefined) set.evs['spe'] = evNum;
			}
			set.evs[stat] = val;

			val = '' + (val || '') + (this.plus === stat ? '+' : '') + (this.minus === stat ? '-' : '');
			this.$('input[name=stat-' + stat + ']').val(val);

			this.updateStatGraph();
		},
		statSlided: function (e) {
			this.statSlide(e);
			this.save();
		},
		natureChange: function (e) {
			var set = this.curSet;
			if (!set) return;

			if (e) {
				set.nature = e.currentTarget.value;
			}
			this.plus = '';
			this.minus = '';
			var nature = BattleNatures[set.nature || 'Serious'];
			for (var i in BattleStatNames) {
				var val = '' + (set.evs[i] || '');
				if (nature.plus === i) {
					this.plus = i;
					val += '+';
				}
				if (nature.minus === i) {
					this.minus = i;
					val += '-';
				}
				this.$chart.find('input[name=stat-' + i + ']').val(val);
				if (!e) this.setSlider(i, set.evs[i]);
			}

			this.save();
			this.updateStatGraph();
		},
		ivSpreadChange: function (e) {
			var set = this.curSet;
			if (!set) return;

			var spread = e.currentTarget.value.split('/');
			if (!set.ivs) set.ivs = {};
			if (spread.length !== 6) return;

			var stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
			for (var i = 0; i < 6; i++) {
				this.$chart.find('input[name=iv-' + stats[i] + ']').val(spread[i]);
				set.ivs[stats[i]] = parseInt(spread[i], 10);
			}
			$(e.currentTarget).val('');

			this.save();
			this.updateStatGraph();
		},

		/*********************************************************
		 * Set details form
		 *********************************************************/

		updateDetailsForm: function () {
			var buf = '';
			var set = this.curSet;
			var isLetsGo = this.curTeam.format.includes('letsgo');
			var isBDSP = this.curTeam.format.includes('bdsp');
			var isNatDex = this.curTeam.format.includes('nationaldex') || this.curTeam.format.includes('natdex');
			var isHackmons = this.curTeam.format.includes('hackmons') || this.curTeam.format.endsWith('bh');
			var species = this.curTeam.dex.species.get(set.species);
			var customFormNames = window.getCustomCosmeticFormes ? window.getCustomCosmeticFormes(species) : [];
			if (!set) return;
			buf += '<div class="resultheader"><h3>Details</h3></div>';
			buf += '<form class="detailsform">';

			buf += '<div class="formrow"><label class="formlabel">Level:</label><div><input type="number" min="1" max="100" step="1" name="level" value="' + (typeof set.level === 'number' ? set.level : 100) + '" class="textbox inputform numform" /></div></div>';

			if (this.curTeam.gen > 1) {
				buf += '<div class="formrow"><label class="formlabel">Gender:</label><div>';
				if (species.gender && !isHackmons) {
					var genderTable = {'M': "Male", 'F': "Female", 'N': "Genderless"};
					buf += genderTable[species.gender];
				} else {
					buf += '<label class="checkbox inline"><input type="radio" name="gender" value="M"' + (set.gender === 'M' ? ' checked' : '') + ' /> Male</label> ';
					buf += '<label class="checkbox inline"><input type="radio" name="gender" value="F"' + (set.gender === 'F' ? ' checked' : '') + ' /> Female</label> ';
					if (!isHackmons) {
						buf += '<label class="checkbox inline"><input type="radio" name="gender" value="N"' + (!set.gender ? ' checked' : '') + ' /> Random</label>';
					} else {
						buf += '<label class="checkbox inline"><input type="radio" name="gender" value="N"' + (set.gender === 'N' ? ' checked' : '') + ' /> Genderless</label>';
					}
				}
				buf += '</div></div>';

				if (isLetsGo) {
					buf += '<div class="formrow"><label class="formlabel">Happiness:</label><div><input type="number" name="happiness" value="70" class="textbox inputform numform" /></div></div>';
				} else {
					if (this.curTeam.gen < 8 || isNatDex) buf += '<div class="formrow"><label class="formlabel">Happiness:</label><div><input type="number" min="0" max="255" step="1" name="happiness" value="' + (typeof set.happiness === 'number' ? set.happiness : 255) + '" class="textbox inputform numform" /></div></div>';
				}

				buf += '<div class="formrow"><label class="formlabel">Shiny:</label><div>';
				buf += '<label class="checkbox inline"><input type="radio" name="shiny" value="yes"' + (set.shiny ? ' checked' : '') + ' /> Yes</label> ';
				buf += '<label class="checkbox inline"><input type="radio" name="shiny" value="no"' + (!set.shiny ? ' checked' : '') + ' /> No</label>';
				buf += '</div></div>';


				if (species.canGigantamax || species.forme === 'Gmax') {
					buf += '<div class="formrow"><label class="formlabel">Gigantamax:</label><div>';
					if (species.forme === 'Gmax') {
						buf += 'Yes';
					} else {
						buf += '<label class="checkbox inline"><input type="radio" name="gigantamax" value="yes"' + (' checked') + ' /> Yes</label> ';
						buf += '<label class="checkbox inline"><input type="radio" name="gigantamax" value="no"' + ' /> No</label>';
					}
					buf += '</div></div>';
				}
			}

			if (this.curTeam.gen > 2) {
				buf += '<div class="formrow" style="display:none"><label class="formlabel">Pokeball:</label><div><select name="pokeball" class="button">';
				buf += '<option value=""' + (!set.pokeball ? ' selected="selected"' : '') + '></option>'; // unset
				var balls = this.curTeam.dex.getPokeballs();
				for (var i = 0; i < balls.length; i++) {
					buf += '<option value="' + balls[i] + '"' + (set.pokeball === balls[i] ? ' selected="selected"' : '') + '>' + balls[i] + '</option>';
				}
				buf += '</select></div></div>';
			}

			if (!isLetsGo && (this.curTeam.gen === 7 || isNatDex || (isBDSP && species.baseSpecies === 'Unown'))) {
				buf += '<div class="formrow"><label class="formlabel" title="Hidden Power Type">Hidden Power:</label><div><select name="hptype" class="button">';
				buf += '<option value=""' + (!set.hpType ? ' selected="selected"' : '') + '>(automatic type)</option>'; // unset
				var types = Dex.types.all();
				for (var i = 0; i < types.length; i++) {
					if (types[i].HPivs) {
						buf += '<option value="' + types[i].name + '"' + (set.hpType === types[i].name ? ' selected="selected"' : '') + '>' + types[i].name + '</option>';
					}
				}
				buf += '</select></div></div>';
			}

			if (this.curTeam.gen === 9) {
				buf += '<div class="formrow"><label class="formlabel" title="Tera Type">Tera Type:</label><div>';
				if (species.forceTeraType) {
					buf += species.forceTeraType;
				} else {
					buf += '<select name="teratype" class="button">';
					var types = Dex.types.all();
					var teraType = set.teraType || species.types[0];
					for (var i = 0; i < types.length; i++) {
						buf += '<option value="' + types[i].name + '"' + (teraType === types[i].name ? ' selected="selected"' : '') + '>' + types[i].name + '</option>';
					}
					buf += '</select>';
				}
				buf += '</div></div>';
			}

			buf += '</form>';
			if (customFormNames.length > 1 || (species.cosmeticFormes && species.cosmeticFormes.length)) {
				buf += '<button class="altform button">Change sprite</button>';
			}

			this.$chart.html(buf);
		},
		detailsChange: function (e) {
			e.preventDefault();
			e.stopPropagation();
			var set = this.curSet;
			if (!set) return;
			var species = this.curTeam.dex.species.get(set.species);
			var isLetsGo = this.curTeam.format.includes('letsgo');
			var isBDSP = this.curTeam.format.includes('bdsp');
			var isNatDex = this.curTeam.format.includes('nationaldex') || this.curTeam.format.includes('natdex');

			// level
			var level = parseInt(this.$chart.find('input[name=level]').val(), 10);
			if (!level || level > 100 || level < 1) level = 100;
			if (level !== 100 || set.level) set.level = level;

			// happiness
			var happiness = parseInt(this.$chart.find('input[name=happiness]').val(), 10);
			if (isNaN(happiness) || happiness > 255 || happiness < 0) happiness = 255;
			set.happiness = happiness;
			if (set.happiness === 255) delete set.happiness;

			// shiny
			var shiny = (this.$chart.find('input[name=shiny]:checked').val() === 'yes');
			if (shiny) {
				set.shiny = true;
			} else {
				delete set.shiny;
			}

			// dynamax level
			var dynamaxLevel = parseInt(this.$chart.find('input[name=dynamaxlevel]').val(), 10);
			if (isNaN(dynamaxLevel) || dynamaxLevel > 10 || dynamaxLevel < 0) dynamaxLevel = 10;
			set.dynamaxLevel = dynamaxLevel;
			if (set.dynamaxLevel === 10) delete set.dynamaxLevel;

			// gigantamax
			var gmax = (this.$chart.find('input[name=gigantamax]:checked').val() === 'yes');
			if (gmax) {
				set.gigantamax = true;
			} else {
				delete set.gigantamax;
			}

			// gender
			var gender = this.$chart.find('input[name=gender]:checked').val();
			if (gender === 'M' || gender === 'F') {
				set.gender = gender;
			} else {
				delete set.gender;
			}

			// pokeball
			var pokeball = this.$chart.find('select[name=pokeball]').val();
			if (pokeball && this.curTeam.dex.items.get(pokeball).isPokeball) {
				set.pokeball = pokeball;
			} else {
				delete set.pokeball;
			}

			// HP type
			var hpType = this.$chart.find('select[name=hptype]').val();
			if (Dex.types.isName(hpType)) {
				set.hpType = hpType;
			} else {
				delete set.hpType;
			}

			// Tera type
			var teraType = this.$chart.find('select[name=teratype]').val();
			if (Dex.types.isName(teraType) && teraType !== species.types[0]) {
				set.teraType = teraType;
			} else {
				delete set.teraType;
			}

			// update details cell
			var buf = '';
			var GenderChart = {
				'M': 'Male',
				'F': 'Female',
				'N': '&mdash;'
			};
			buf += '<span class="detailcell detailcell-first"><label>Level</label>' + (set.level || 100) + '</span>';
			if (this.curTeam.gen > 1) {
				buf += '<span class="detailcell"><label>Gender</label>' + GenderChart[set.gender || 'N'] + '</span>';
				if (isLetsGo) {
					buf += '<span class="detailcell"><label>Happiness</label>70</span>';
				} else {
					if (this.curTeam.gen < 8 || isNatDex) buf += '<span class="detailcell"><label>Happiness</label>' + (typeof set.happiness === 'number' ? set.happiness : 255) + '</span>';
				}
				buf += '<span class="detailcell"><label>Shiny</label>' + (set.shiny ? 'Yes' : 'No') + '</span>';
				if (!isLetsGo && (this.curTeam.gen < 8 || isNatDex)) buf += '<span class="detailcell"><label>HP Type</label>' + (set.hpType || 'Dark') + '</span>';
				if (species.canGigantamax || species.forme === 'Gmax') buf += '<span class="detailcell"><label>Gmax</label>' + (set.gigantamax || species.forme === 'Gmax' ? 'Yes' : 'No') + '</span>';
			}
			if (this.curTeam.gen === 9) {
				buf += '<span class="detailcell"><label>Tera Type</label>' + (species.forceTeraType || set.teraType || species.types[0]) + '</span>';
			}
			this.$('button[name=details]').html(buf);

			this.save();
			this.updatePokemonSprite();
		},
		altForm: function (e) {
			var set = this.curSet;
			var i = 0;
			if (!set) {
				i = +$(e.currentTarget).closest('li').attr('value');
				set = this.curSetList[i];
			}
			app.addPopup(AltFormPopup, {curSet: set, index: i, room: this});
		},

		/*********************************************************
		 * Set charts
		 *********************************************************/

		chartTypes: {
			pokemon: 'pokemon',
			item: 'item',
			ability: 'ability',
			move1: 'move',
			move2: 'move',
			move3: 'move',
			move4: 'move',
			stats: 'stats',
			details: 'details'
		},
		chartClick: function (e) {
			if (this.search.addFilter(e.currentTarget)) {
				var curChart = this.$('input[name=' + this.curChartName + ']');
				// if we were searching for the filter, remove it
				if (this.search.q) curChart.val('');
				curChart.select();
				this.search.find('');
				return;
			}
			var entry = $(e.currentTarget).data('entry');
			var val = entry.slice(entry.indexOf("|") + 1);
			if (this.curChartType === 'move' && e.currentTarget.className === 'cur') {
				// clicked a move, remove it if we already have it
				var moves = [];
				for (var i = 0; i < this.curSet.moves.length; i++) {
					var curVal = this.curSet.moves[i];
					if (curVal === val) {
						this.unChooseMove(curVal);
						delete this.search.cur[toID(val)];
					} else if (curVal) {
						moves.push(curVal);
					}
				}
				if (moves.length < this.curSet.moves.length) {
					this.$('input[name=move1]').val(moves[0] || '');
					this.$('input[name=move2]').val(moves[1] || '');
					this.$('input[name=move3]').val(moves[2] || '');
					this.$('input[name=move4]').val(moves[3] || '');
					this.$('input[name=move' + Math.min(moves.length + 1, 4) + ']').focus();
					this.curSet.moves = moves;
					this.search.find('');
					return;
				}
			}
			this.chartSet(val, true);
		},
		chartKeydown: function (e) {
			var modifier = (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || e.cmdKey);
			if (e.keyCode === 13 || (e.keyCode === 9 && !modifier)) { // enter/tab
				if (!(this.curChartType in this.searchChartTypes)) return;
				this.updateChart();
				var $firstResult = this.$chart.find('a.hover');
				e.stopPropagation();
				e.preventDefault();
				if (!$firstResult.length) {
					this.chartChange(e, true);
					return;
				}

				if (this.search.addFilter($firstResult[0])) {
					$(e.currentTarget).val('').select();
					this.search.find('');
					return;
				}
				var entry = $firstResult.data('entry');
				var val = entry.slice(entry.indexOf("|") + 1);
				this.chartSet(val, true);
				return;
			} else if (e.keyCode === 38) { // up
				e.preventDefault();
				e.stopPropagation();
				var $active = this.$chart.find('a.hover');
				if (!$active.length) return this.$chart.find('a').first().addClass('hover');
				var $li = $active.parent().prev();
				while ($li[0] && $li[0].firstChild.tagName !== 'A') $li = $li.prev();
				if ($li[0] && $li.children()[0]) {
					$active.removeClass('hover');
					$active = $li.children();
					$active.addClass('hover');
				}
			} else if (e.keyCode === 40) { // down
				e.preventDefault();
				e.stopPropagation();
				var $active = this.$chart.find('a.hover');
				if (!$active.length) return this.$chart.find('a').first().addClass('hover');
				var $li = $active.parent().next();
				while ($li[0] && $li[0].firstChild.tagName !== 'A') $li = $li.next();
				if ($li[0] && $li.children()[0]) {
					$active.removeClass('hover');
					$active = $li.children();
					$active.addClass('hover');
				}
			} else if (e.keyCode === 27 || e.keyCode === 8) { // esc, backspace
				if (!e.currentTarget.value && this.search.removeFilter()) {
					this.search.find('');
					return;
				}
			} else if (e.keyCode === 188) {
				var $firstResult = this.$chart.find('a').first();
				if (!this.search.q) return;
				if (this.search.addFilter($firstResult[0])) {
					e.preventDefault();
					e.stopPropagation();
					$(e.currentTarget).val('').select();
					this.search.find('');
					return;
				}
			}
		},
		chartKeyup: function () {
			this.updateChart();
		},
		chartFocus: function (e) {
			var $target = $(e.currentTarget);
			var name = e.currentTarget.name;
			var type = this.chartTypes[name];
			var wasIncomplete = false;
			if ($target.hasClass('incomplete')) {
				wasIncomplete = true;
				$target.removeClass('incomplete');
			}

			if (this.curChartName === name) return;

			if (!this.curSet) {
				var i = +$target.closest('li').prop('value');
				this.curSet = this.curSetList[i];
				this.curSetLoc = i;
				this.update();
				if (type === 'stats' || type === 'details') {
					this.$('button[name=' + name + ']').click();
				} else {
					this.$('input[name=' + name + ']').select();
				}
				return;
			}

			this.curChartName = name;
			this.curChartType = type;
			this.updateChart(false, wasIncomplete);
		},
		chartChange: function (e, selectNext) {
			var name = e.currentTarget.name;
			if (this.curChartName !== name) return;
			var id = toID(e.currentTarget.value);
			if (id in BattleAliases) id = toID(BattleAliases[id]);
			var val = '';
			var format = this.curTeam.format;
			switch (name) {
			case 'pokemon':
				val = (id in BattlePokedex ? this.curTeam.dex.species.get(e.currentTarget.value).name : '');
				break;
			case 'ability':
				if (id in BattleItems && format && format.endsWith("dualwielding")) {
					val = BattleItems[id].name;
				} else if (id in BattleMovedex && format && format.endsWith("trademarked")) {
					val = BattleMovedex[id].name;
				} else {
					val = (id in BattleAbilities ? BattleAbilities[id].name : '');
				}
				break;
			case 'item':
				if (id in BattleMovedex && format && format.endsWith("fortemons")) {
					val = BattleMovedex[id].name;
				} else if (id in BattleAbilities && format && format.endsWith("multibility")) {
					val = BattleAbilities[id].name;
				} else {
					val = (id in BattleItems ? BattleItems[id].name : '');
				}
				break;
			case 'move1': case 'move2': case 'move3': case 'move4':
				val = (id in BattleMovedex ? BattleMovedex[id].name : '');
				break;
			}
			if (!val) {
				if (name === 'pokemon' || name === 'ability' || id) {
					$(e.currentTarget).addClass('incomplete');
					return;
				}
			}
			this.chartSet(val, selectNext);
		},
		searchChange: function (e) {
			// 91 for right CMD / 93 for left CMD / 17 for CTL
			if (e.keyCode !== 91 && e.keyCode !== 93 && e.keyCode !== 17) {
				this.curSearchVal = e.currentTarget.value;
				this.updateTeamList();
			}
		},
		chartSetCustom: function (val) {
			val = toID(val);
			if (val === 'cathy') {
				var set = this.curSet;
				set.name = "Cathy";
				set.species = 'Trevenant';
				delete set.level;
				var baseFormat = this.curTeam.format;
				if (baseFormat.substr(0, 3) === 'gen') baseFormat = baseFormat.substr(4);
				if (baseFormat.substr(0, 4) === 'bdsp') baseFormat = baseFormat.substr(4);
				if (baseFormat.substr(0, 8) === 'pokebank') baseFormat = baseFormat.substr(8);
				if (baseFormat.substr(0, 6) === 'natdex') baseFormat = baseFormat.substr(6);
				if (baseFormat.substr(0, 11) === 'nationaldex') baseFormat = baseFormat.substr(11);
				if (baseFormat.substr(-5) === 'draft') baseFormat = baseFormat.substr(0, baseFormat.length - 5);
				if (!baseFormat) baseFormat = 'ou';
				if (this.curTeam && this.curTeam.format) {
					if (baseFormat === 'battlespotsingles' || baseFormat === 'battlespotdoubles' || baseFormat.substr(0, 3) === 'vgc' ||
						baseFormat === 'battlefestivaldoubles') {
						set.level = 50;
					}
					if (baseFormat.startsWith('lc') || baseFormat.endsWith('lc')) set.level = 5;
				}
				set.gender = 'F';
				if (set.happiness) delete set.happiness;
				if (set.shiny) delete set.shiny;
				if (set.dynamaxLevel) delete set.dynamaxLevel;
				if (set.gigantamax) delete set.gigantamax;
				set.item = 'Starf Berry';
				set.ability = 'Harvest';
				set.moves = ['Substitute', 'Horn Leech', 'Earthquake', 'Phantom Force'];
				set.evs = {hp: 36, atk: 252, def: 0, spa: 0, spd: 0, spe: 220};
				set.ivs = {};
				set.nature = 'Jolly';
				this.updateSetTop();
				this.$(!this.$('input[name=item]').length ? (this.$('input[name=ability]').length ? 'input[name=ability]' : 'input[name=move1]') : 'input[name=item]').select();
				return true;
			}
			if (val === 'citizensnips' || val === 'snips') {
				var set = this.curSet;
				set.name = "citizen snips";
				set.species = 'Drapion';
				delete set.level;
				var baseFormat = this.curTeam.format;
				if (baseFormat.substr(0, 3) === 'gen') baseFormat = baseFormat.substr(4);
				if (baseFormat.substr(0, 4) === 'bdsp') baseFormat = baseFormat.substr(4);
				if (baseFormat.substr(0, 8) === 'pokebank') baseFormat = baseFormat.substr(8);
				if (baseFormat.substr(0, 6) === 'natdex') baseFormat = baseFormat.substr(6);
				if (baseFormat.substr(0, 11) === 'nationaldex') baseFormat = baseFormat.substr(11);
				if (baseFormat.substr(-5) === 'draft') baseFormat = baseFormat.substr(0, baseFormat.length - 5);
				if (!baseFormat) baseFormat = 'ou';
				if (this.curTeam && this.curTeam.format) {
					if (baseFormat === 'battlespotsingles' || baseFormat === 'battlespotdoubles' || baseFormat.substr(0, 3) === 'vgc' ||
						baseFormat === 'battlefestivaldoubles') {
						set.level = 50;
					}
					if (baseFormat.startsWith('lc') || baseFormat.endsWith('lc')) set.level = 5;
				}
				if (set.happiness) delete set.happiness;
				if (set.shiny) delete set.shiny;
				if (set.dynamaxLevel) delete set.dynamaxLevel;
				if (set.gigantamax) delete set.gigantamax;
				set.item = 'Leftovers';
				set.ability = 'Battle Armor';
				set.moves = ['Acupressure', 'Knock Off', 'Rest', 'Sleep Talk'];
				set.evs = {hp: 248, atk: 0, def: 96, spa: 0, spd: 108, spe: 56};
				set.ivs = {};
				set.nature = 'Impish';
				this.updateSetTop();
				this.$(!this.$('input[name=item]').length ? (this.$('input[name=ability]').length ? 'input[name=ability]' : 'input[name=move1]') : 'input[name=item]').select();
				return true;
			}
		},
		chartSet: function (val, selectNext) {
			var inputName = this.curChartName;
			var input = this.$('input[name=' + inputName + ']');
			if (this.chartSetCustom(input.val())) return;
			input.val(val).removeClass('incomplete');
			switch (inputName) {
			case 'pokemon':
				this.setPokemon(val, selectNext);
				break;
			case 'item':
				this.curSet.item = val;
				this.updatePokemonSprite();
				if (selectNext) this.$(this.$('input[name=ability]').length ? 'input[name=ability]' : 'input[name=move1]').select();
				break;
			case 'ability':
				this.curSet.ability = val;
				this.updatePokemonSprite();
				if (selectNext) this.$('input[name=move1]').select();
				break;
			case 'move1':
				this.unChooseMove(this.curSet.moves[0]);
				this.curSet.moves[0] = val;
				this.chooseMove(val);
				if (selectNext) this.$('input[name=move2]').select();
				break;
			case 'move2':
				if (!this.curSet.moves[0]) this.curSet.moves[0] = '';
				this.unChooseMove(this.curSet.moves[1]);
				this.curSet.moves[1] = val;
				this.chooseMove(val);
				if (selectNext) this.$('input[name=move3]').select();
				break;
			case 'move3':
				if (!this.curSet.moves[0]) this.curSet.moves[0] = '';
				if (!this.curSet.moves[1]) this.curSet.moves[1] = '';
				this.unChooseMove(this.curSet.moves[2]);
				this.curSet.moves[2] = val;
				this.chooseMove(val);
				if (selectNext) this.$('input[name=move4]').select();
				break;
			case 'move4':
				if (!this.curSet.moves[0]) this.curSet.moves[0] = '';
				if (!this.curSet.moves[1]) this.curSet.moves[1] = '';
				if (!this.curSet.moves[2]) this.curSet.moves[2] = '';
				this.unChooseMove(this.curSet.moves[3]);
				this.curSet.moves[3] = val;
				this.chooseMove(val);
				if (selectNext) {
					this.stats();
					this.$('button.setstats').focus();
				}
				break;
			}
			this.save();
		},
		unChooseMove: function (moveName) {
			var set = this.curSet;
			if (!moveName || !set || this.curTeam.format === 'gen7hiddentype') return;
			if (moveName.substr(0, 13) === 'Hidden Power ') {
				if (set.ivs) {
					for (var i in set.ivs) {
						if (set.ivs[i] === 30) set.ivs[i] = 31;
						if (set.ivs[i] <= 3) set.ivs[i] = 0;
					}
				}
			}
			var resetSpeed = false;
			if (moveName === 'Gyro Ball') {
				resetSpeed = true;
			}
			this.chooseMove('', resetSpeed);
		},
		canHyperTrain: function (set) {
			if (this.curTeam.gen < 7 || this.curTeam.format === 'gen7hiddentype') return false;
			var format = this.curTeam.format;
			if (!set.level || set.level === 100) return true;
			if (format.substr(0, 3) === 'gen') format = format.substr(4);
			if (format.substr(0, 10) === 'battlespot' || format.substr(0, 3) === 'vgc' || format === 'ultrasinnohclassic') {
				if (set.level === 50) return true;
			}
			return false;
		},
		chooseMove: function (moveName, resetSpeed) {
			var set = this.curSet;
			if (!set) return;
			var gen = this.curTeam.gen;

			var minSpe;
			if (resetSpeed) minSpe = false;
			if (moveName.substr(0, 13) === 'Hidden Power ') {
				if (!this.canHyperTrain(set)) {
					var hpType = moveName.substr(13);

					set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
					if (this.curTeam.gen > 2) {
						var HPivs = this.curTeam.dex.types.get(hpType).HPivs;
						for (var i in HPivs) {
							set.ivs[i] = HPivs[i];
						}
					} else {
						var HPdvs = this.curTeam.dex.types.get(hpType).HPdvs;
						for (var i in HPdvs) {
							set.ivs[i] = HPdvs[i] * 2;
						}
						var atkDV = Math.floor(set.ivs.atk / 2);
						var defDV = Math.floor(set.ivs.def / 2);
						var speDV = Math.floor(set.ivs.spe / 2);
						var spcDV = Math.floor(set.ivs.spa / 2);
						var expectedHpDV = (atkDV % 2) * 8 + (defDV % 2) * 4 + (speDV % 2) * 2 + (spcDV % 2);
						set.ivs.hp = expectedHpDV * 2;
						if (set.ivs.hp === 30) set.ivs.hp = 31;
					}
				}
			} else if (moveName === 'Return') {
				this.curSet.happiness = 255;
			} else if (moveName === 'Frustration') {
				this.curSet.happiness = 0;
			} else if (moveName === 'Gyro Ball') {
				minSpe = true;
			}

			// only available through an event with 31 Spe IVs
			if (set.species.startsWith('Terapagos')) minSpe = false;

			if (this.curTeam.format === 'gen7hiddentype') return;

			var minAtk = true;
			// only available through an event with 31 Atk IVs
			if (set.ability === 'Battle Bond' || ['Koraidon', 'Miraidon'].includes(set.species)) minAtk = false;
			var hpModulo = (this.curTeam.gen >= 6 ? 2 : 4);
			var hasHiddenPower = false;
			var moves = set.moves;
			for (var i = 0; i < moves.length; ++i) {
				if (!moves[i]) continue;
				if (moves[i].substr(0, 13) === 'Hidden Power ') hasHiddenPower = true;
				var move = this.curTeam.dex.moves.get(moves[i]);
				if (move.id === 'transform') {
					hasHiddenPower = true; // A Pokemon with Transform can copy another Pokemon that knows Hidden Power

					var hasMoveBesidesTransform = false;
					for (var j = 0; j < moves.length; ++j) {
						if (j !== i && moves[j]) {
							hasMoveBesidesTransform = true;
							break;
						}
					}
					if (!hasMoveBesidesTransform) minAtk = false;
				} else if (move.category === 'Physical' && !move.damage && !move.ohko &&
					!['foulplay', 'endeavor', 'counter', 'bodypress', 'seismictoss', 'bide', 'metalburst', 'superfang'].includes(move.id) && !(this.curTeam.gen < 8 && move.id === 'rapidspin')) {
					minAtk = false;
				} else if (['metronome', 'assist', 'copycat', 'mefirst', 'photongeyser', 'shellsidearm'].includes(move.id) || (this.curTeam.gen === 5 && move.id === 'naturepower')) {
					minAtk = false;
				}
				if (minSpe === false && moveName === 'Gyro Ball') {
					minSpe = undefined;
				}
			}

			if (!set.ivs) {
				if (minSpe === undefined && (!minAtk || gen < 3)) return;
				set.ivs = {};
			}
			if (!set.ivs['spe'] && set.ivs['spe'] !== 0) set.ivs['spe'] = 31;
			if (minSpe) {
				// min Spe
				set.ivs['spe'] = (hasHiddenPower ? set.ivs['spe'] % hpModulo : 0);
			} else if (minSpe === false) {
				// max Spe
				set.ivs['spe'] = (hasHiddenPower ? 30 + (set.ivs['spe'] % 2) : 31);
			}
			if (gen < 3) return;
			if (!set.ivs['atk'] && set.ivs['atk'] !== 0) set.ivs['atk'] = 31;
			if (minAtk) {
				// min Atk
				if (['Gouging Fire', 'Iron Boulder', 'Iron Crown', 'Raging Bolt'].includes(set.species)) {
					// only available with 20 Atk IVs
					set.ivs['atk'] = 20;
				} else if (set.species.startsWith('Terapagos')) {
					// only available with 15 Atk IVs
					set.ivs['atk'] = 15;
				} else {
					set.ivs['atk'] = (hasHiddenPower ? set.ivs['atk'] % hpModulo : 0);
				}
			} else {
				// max Atk
				set.ivs['atk'] = (hasHiddenPower ? 30 + (set.ivs['atk'] % 2) : 31);
			}
		},
		setPokemon: function (val, selectNext) {
			var set = this.curSet;
			var species = this.curTeam.dex.species.get(val);
			if (!species.exists || set.species === species.name) {
				if (selectNext) this.$('input[name=item]').select();
				return;
			}

			set.name = "";
			set.species = val;
			if (set.level) delete set.level;
			if (this.curTeam && this.curTeam.format) {
				var baseFormat = this.curTeam.format;
				var format = window.BattleFormats && window.BattleFormats[baseFormat];
				if (baseFormat.substr(0, 3) === 'gen') baseFormat = baseFormat.substr(4);
				if (baseFormat.substr(0, 4) === 'bdsp') baseFormat = baseFormat.substr(4);
				if (baseFormat.substr(0, 8) === 'pokebank') baseFormat = baseFormat.substr(8);
				if (baseFormat.substr(0, 6) === 'natdex') baseFormat = baseFormat.substr(6);
				if (baseFormat.substr(0, 11) === 'nationaldex') baseFormat = baseFormat.substr(11);
				if (baseFormat.substr(-5) === 'draft') baseFormat = baseFormat.substr(0, baseFormat.length - 5);
				if (!baseFormat) baseFormat = 'ou';
				if (this.curTeam && this.curTeam.format) {
					if (baseFormat.substr(0, 10) === 'battlespot' && baseFormat.substr(0, 19) !== 'battlespotspecial13' ||
						baseFormat.substr(0, 3) === 'vgc' || baseFormat.substr(0, 14) === 'battlefestival') set.level = 50;
					if (baseFormat.startsWith('lc') || baseFormat.endsWith('lc')) set.level = 5;
					if (baseFormat.substr(0, 19) === 'battlespotspecial17') set.level = 1;
					if (format && format.teambuilderLevel) {
						set.level = format.teambuilderLevel;
					}
				}
			}
			if (set.gender) delete set.gender;
			if (species.gender && species.gender !== 'N') set.gender = species.gender;
			if (set.happiness) delete set.happiness;
			if (set.shiny) delete set.shiny;
			if (set.dynamaxLevel) delete set.dynamaxLevel;
			if (set.gigantamax) delete set.gigantamax;
			if (set.teraType) delete set.teraType;
			if (!(this.curTeam.format.includes('hackmons') || this.curTeam.format.endsWith('bh')) && species.requiredItems.length === 1) {
				set.item = species.requiredItems[0];
			} else {
				set.item = '';
			}
			applySilvallyVariant(set, species);
			set.ability = species.abilities['0'];

			set.moves = [];
			set.evs = {};
			set.ivs = {};
			set.nature = '';
			this.updateSetTop();
			if (selectNext) this.$(set.item || !this.$('input[name=item]').length ? (this.$('input[name=ability]').length ? 'input[name=ability]' : 'input[name=move1]') : 'input[name=item]').select();
		},

		/*********************************************************
		 * Utility functions
		 *********************************************************/

		// Stat calculator

		getStat: function (stat, set, evOverride, natureOverride) {
			var supportsEVs = !this.curTeam.format.includes('letsgo');
			var supportsAVs = !supportsEVs;
			if (!set) set = this.curSet;
			if (!set) return 0;

			if (!set.ivs) set.ivs = {
				hp: 31,
				atk: 31,
				def: 31,
				spa: 31,
				spd: 31,
				spe: 31
			};
			if (!set.evs) set.evs = {};

			// do this after setting set.evs because it's assumed to exist
			// after getStat is run
			var species = Dex.getAbilityFormPreview(set, this.curTeam.dex).species;
			if (!species.exists) return 0;

			if (!set.level) set.level = 100;
			if (typeof set.ivs[stat] === 'undefined') set.ivs[stat] = 31;

			var baseStat = Dex.getAbilityFormPreview(set, this.curTeam.dex).baseStats[stat];
			var iv = (set.ivs[stat] || 0);
			if (this.curTeam.gen <= 2) iv &= 30;
			var ev = set.evs[stat];
			if (evOverride !== undefined) ev = evOverride;
			if (ev === undefined) ev = (this.curTeam.gen > 2 ? 0 : 252);

			if (stat === 'hp') {
				if (baseStat === 1) return 1;
				if (!supportsEVs) return Math.floor(Math.floor(2 * baseStat + iv + 100) * set.level / 100 + 10) + (supportsAVs ? ev : 0);
				return Math.floor(Math.floor(2 * baseStat + iv + Math.floor(ev / 4) + 100) * set.level / 100 + 10);
			}
			var val = Math.floor(Math.floor(2 * baseStat + iv + Math.floor(ev / 4)) * set.level / 100 + 5);
			if (!supportsEVs) {
				val = Math.floor(Math.floor(2 * baseStat + iv) * set.level / 100 + 5);
			}
			if (natureOverride) {
				val *= natureOverride;
			} else if (BattleNatures[set.nature] && BattleNatures[set.nature].plus === stat) {
				val *= 1.1;
			} else if (BattleNatures[set.nature] && BattleNatures[set.nature].minus === stat) {
				val *= 0.9;
			}
			if (!supportsEVs) {
				var friendshipValue = Math.floor((70 / 255 / 10 + 1) * 100);
				val = Math.floor(val) * friendshipValue / 100 + (supportsAVs ? ev : 0);
			}
			return Math.floor(val);
		},

		// initialization

		getGen: function (format) {
			format = '' + format;
			if (!format) return 7;
			if (format.substr(0, 3) !== 'gen') return 6;
			return parseInt(format.substr(3, 1), 10) || 6;
		}
	});

	var MoveSetPopup = exports.MoveSetPopup = Popup.extend({
		initialize: function (data) {
			var buf = '<ul class="popupmenu">';
			this.i = data.i;
			this.team = data.team;
			for (var i = 0; i < data.team.length; i++) {
				var set = data.team[i];
				if (i !== data.i && i !== data.i + 1) {
					buf += '<li><button name="moveHere" value="' + i + '" class="option"><i class="fa fa-arrow-right"></i> Move here</button></li>';
				}
				buf += '<li' + (i === data.i ? ' style="opacity:.3"' : ' style="opacity:.6"') + '><span class="picon" style="display:inline-block;vertical-align:middle;' + Dex.getPokemonIcon(Dex.getAbilityFormPreviewSet(set)) + '"></span> ' + BattleLog.escapeHTML(set.name || set.species) + '</li>';
			}
			if (i !== data.i && i !== data.i + 1) {
				buf += '<li><button name="moveHere" value="' + i + '" class="option"><i class="fa fa-arrow-right"></i> Move here</button></li>';
			}
			buf += '</ul>';
			this.$el.html(buf);
		},
		moveHere: function (i) {
			this.close();
			i = +i;

			var movedSet = this.team.splice(this.i, 1)[0];

			if (i > this.i) i--;
			this.team.splice(i, 0, movedSet);

			app.rooms['teambuilder'].save();
			if (app.rooms['teambuilder'].curSet) {
				app.rooms['teambuilder'].curSetLoc = i;
				app.rooms['teambuilder'].update();
				app.rooms['teambuilder'].updateChart();
			} else {
				app.rooms['teambuilder'].update();
			}
		}
	});

	var DeleteFolderPopup = this.DeleteFolderPopup = Popup.extend({
		type: 'semimodal',
		initialize: function (data) {
			this.room = data.room;
			this.folder = data.folder;
			var buf = '<form><p>Remove "' + data.folder.slice(0, -1) + '"?</p><p><label><input type="checkbox" name="addname" /> Add "' + BattleLog.escapeHTML(this.folder.slice(0, -1)) + '" before team names</label></p>';
			buf += '<p><button type="submit"><strong>Remove (keep teams)</strong></button> <!--button name="removeDelete"><strong>Remove (delete teams)</strong></button--> <button type="button" name="close" class="autofocus">Cancel</button></p></form>';
			this.$el.html(buf);
		},
		submit: function (data) {
			this.room.deleteFolder(this.folder, !!this.$('input[name=addname]')[0].checked);
			this.close();
		}
	});
	function applySilvallyVariant(set, species) {
		if (species.baseSpecies !== 'Silvally' && species.id !== 'silvally') return;
		set.shiny = true;
		var type = species.types[0];
		if (type !== 'Normal') {
			set.item = species.requiredItems && species.requiredItems[0] || type + ' Memory';
		} else if (/memory$/i.test(set.item || '')) {
			set.item = '';
		}
	}
	var AltFormPopup = this.AltFormPopup = Popup.extend({
		type: 'semimodal',
		initialize: function (data) {
			this.room = data.room;
			this.curSet = data.curSet;
			this.chartIndex = data.index;
			if (window.ensureCustomSpecies) window.ensureCustomSpecies();
			var species = this.room.curTeam.dex.species.get(this.curSet.species);
			var customFormNames = window.getCustomCosmeticFormes ? window.getCustomCosmeticFormes(species) : [];
			var formNames = customFormNames.length > 1 ? customFormNames :
				[species.baseSpecies].concat(species.cosmeticFormes || []);
			var forms = [];
			var seenForms = {};
			for (var formIndex = 0; formIndex < formNames.length; formIndex++) {
				var formSpecies = this.room.curTeam.dex.species.get(formNames[formIndex]);
				var isListedCustomForm = customFormNames.some(function (formName) {
					return toID(formName) === formSpecies.id;
				});
				if ((!formSpecies.exists && !isListedCustomForm) || seenForms[formSpecies.id]) continue;
				seenForms[formSpecies.id] = true;
				forms.push(formSpecies);
			}
			var spriteSize = 96;
			var spriteDim = 'width: 96px; height: 96px;';

			var gen = Math.max(this.room.curTeam.gen, species.gen);
			if (gen > 5 && !Dex.prefs('bwgfx')) {
				spriteSize = 120;
				spriteDim = 'width: 120px; height: 120px;';
			}

			var buf = '';
			buf += '<p>Pick a variant or <button name="close" class="button">Cancel</button></p>';
			buf += '<div class="formlist">';

			var formCount = forms.length;
			for (var i = 0; i < formCount; i++) {
				var formSpecies = forms[i];
				var spriteStyle = Dex.getTeambuilderSprite({
					species: formSpecies.name,
					shiny: this.curSet.shiny,
					gender: this.curSet.gender,
				}, gen);
				buf += '<button name="setForm" value="' + BattleLog.escapeHTML(formSpecies.name) + '" style="';
				buf += spriteStyle + '; ' + spriteDim + '" title="' + BattleLog.escapeHTML(formSpecies.name) + '" class="option';
				buf += (formSpecies.id === species.id ? ' cur' : '') + '"></button>';
			}
			buf += '<div style="clear:both"></div>';
			buf += '</div>';

			this.$el.html(buf).css({'max-width': (4 + spriteSize) * 7});
		},
		setForm: function (speciesName) {
			if (window.ensureCustomSpecies) window.ensureCustomSpecies();
			var species = this.room.curTeam.dex.species.get(speciesName);
			var currentSpecies = this.room.curTeam.dex.species.get(this.curSet.species);
			var customFormNames = window.getCustomCosmeticFormes ? window.getCustomCosmeticFormes(currentSpecies) : [];
			var isListedCustomForm = customFormNames.some(function (formName) {
				return toID(formName) === species.id;
			});
			if (!species.exists && !isListedCustomForm) return;
			var currentAbilitySlot = Object.keys(currentSpecies.abilities || {}).find(function (slot) {
				return toID(currentSpecies.abilities[slot]) === toID(this.curSet.ability);
			}, this);
			this.curSet.species = species.name;
			applySilvallyVariant(this.curSet, species);
			if (species.abilities) {
				this.curSet.ability = species.abilities[currentAbilitySlot || '0'] || species.abilities['0'];
			}
			this.close();
			// Re-render the set so form typing, abilities, stats, and sprites all
			// reflect the selected profile instead of updating only the artwork.
			this.room.update();
			this.room.$('input[name=pokemon]').eq(this.chartIndex).val(this.curSet.species);
			this.room.curTeam.team = Storage.packTeam(this.room.curSetList);
			Storage.saveTeam(this.room.curTeam);
		}
	});

})(window, jQuery);

// BEGIN LOCAL TEAMBUILDER TOOLS
(function (exports, $) {
	'use strict';
	var T = exports.TeambuilderTools = {};
	T.clone = function (value) { return JSON.parse(JSON.stringify(value)); };
	T.id = function (value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, ''); };
	T.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); };
	T.empty = function () { return {version: 1, builds: [], nicknames: [], selectedNickname: '', autoNickname: false}; };
	T.cleanSet = function (set) {
		if (!set || typeof set.species !== 'string' || !set.species.trim()) throw new Error('A build needs a species.');
		var result = {};
		['name', 'species', 'item', 'ability', 'moves', 'nature', 'gender', 'evs', 'ivs', 'shiny', 'level', 'happiness', 'hpType', 'pokeball', 'gigantamax', 'dynamaxLevel', 'teraType'].forEach(function (key) {
			if (set[key] !== undefined) result[key] = T.clone(set[key]);
		});
		if (result.moves && (!Array.isArray(result.moves) || result.moves.some(function (m) { return typeof m !== 'string'; }))) throw new Error('Invalid move list.');
		for (var key of ['evs', 'ivs']) {
			if (result[key] && (typeof result[key] !== 'object' || Array.isArray(result[key]))) throw new Error('Invalid stat spread.');
		}
		return result;
	};
	T.parse = function (text) {
		var data = JSON.parse(text);
		if (data.version !== 1 || !Array.isArray(data.builds) || !Array.isArray(data.nicknames)) throw new Error('Expected a version 1 build/nickname library.');
		var result = T.empty();
		result.builds = data.builds.map(function (b) {
			if (typeof b.name !== 'string' || !b.name.trim()) throw new Error('A build needs a name.');
			return {id: T.uid(), name: b.name.trim().slice(0, 80), format: String(b.format || ''), set: T.cleanSet(b.set)};
		});
		result.nicknames = data.nicknames.map(function (p) {
			if (typeof p.name !== 'string' || !p.name.trim() || !p.entries || typeof p.entries !== 'object' || Array.isArray(p.entries)) throw new Error('Invalid nickname profile.');
			var entries = {};
			Object.keys(p.entries).forEach(function (species) {
				var id = T.id(species), nickname = p.entries[species];
				if (!id || typeof nickname !== 'string' || !nickname.trim() || /[\x00-\x1f|\[\]]/.test(nickname)) throw new Error('Invalid nickname mapping.');
				if (entries[id]) throw new Error('Duplicate species mapping: ' + species);
				entries[id] = nickname.trim().slice(0, 24);
			});
			var genderEntries = {};
			Object.keys(p.genderEntries || {}).forEach(function (id) {
				var species = Dex.species.get(id);
				if (!species.exists) throw new Error('Invalid gender nickname species.');
				genderEntries[species.id] = {};
				Object.keys(p.genderEntries[id]).forEach(function (gender) {
					var value = p.genderEntries[id][gender];
					if (!['M', 'F', 'N'].includes(gender) || typeof value !== 'string' || !value.trim() || Array.from(value).length > 24 || /[\x00-\x1f|\[\]]/.test(value)) throw new Error('Invalid gender nickname.');
					genderEntries[species.id][gender] = value.trim();
				});
			});
			return {id: T.uid(), name: p.name.trim().slice(0, 80), entries: entries, fallback: !!p.fallback, shiny: ['yes', 'no'].includes(p.shiny) ? p.shiny : '', gendered: !!p.gendered, genderEntries: genderEntries};
		});
		return result;
	};
	T.nickname = function (set, profile, dex) {
		if (!profile) return '';
		var species = dex.species.get(set.species), gender = set.gender || species.gender;
		var find = function (id) {
			return (profile.gendered && gender && profile.genderEntries && profile.genderEntries[id] && profile.genderEntries[id][gender]) || profile.entries[id] || '';
		};
		return find(T.id(set.species)) || (profile.fallback ? find(T.id(species.baseSpecies)) : '') || '';
	};
	T.applyNickname = function (set, profile, dex, replace) {
		if (profile && profile.shiny === 'yes') set.shiny = true;
		if (profile && profile.shiny === 'no') set.shiny = false;
		var name = T.nickname(set, profile, dex);
		if (name && (replace || !set.name || T.id(set.name) === T.id(set.species))) set.name = name;
		return set;
	};
	T.compatibility = function (build, set, format, dex) {
		if (T.id(build.set.species) !== T.id(set.species)) return 'Different species/form';
		if (!dex.species.get(build.set.species).exists) return 'Species unavailable';
		return build.format && build.format !== format ? 'Different format: validate after applying' : 'Legality not checked';
	};
	if (!exports.TeambuilderRoom || !exports.TeambuilderRoom.prototype) return;
	var proto = exports.TeambuilderRoom.prototype;
	var escape = function (text) { return BattleLog.escapeHTML(String(text || '')); };
	var button = function (name, text, value) { return '<button class="button" name="' + name + '" value="' + escape(value) + '">' + escape(text) + '</button> '; };
	T.teamSignature = function (team) { return JSON.stringify([team.name, team.format, team.folder, team.team]); };
	T.teamKey = function (team) {
		if (!team) return '';
		if (team.toolsKey) return team.toolsKey;
		var records = Storage.prefs('teamtoolbindings') || [], used = {};
		(Storage.teams || [team]).forEach(function (entry) { if (entry.toolsKey) used[entry.toolsKey] = true; });
		(Storage.teams || [team]).forEach(function (entry) {
			if (entry.toolsKey) return;
			var signature = T.teamSignature(entry), record = records.find(function (r) { return r.signature === signature && !used[r.id]; });
			entry.toolsKey = record ? record.id : T.uid(); used[entry.toolsKey] = true;
		});
		if (!team.toolsKey) team.toolsKey = T.uid();
		return team.toolsKey;
	};
	proto.toolsData = function (readOnly) {
		var stored = Storage.prefs('pokemontools');
		var data = stored && stored.version === 1 && Array.isArray(stored.builds) && Array.isArray(stored.nicknames) ? (readOnly ? Object.assign({}, stored) : T.clone(stored)) : T.empty();
		var key = T.teamKey(this.curTeam), settings = data.teamProfiles && data.teamProfiles[key];
		if (key) { data.selectedNickname = settings ? settings.id : ''; data.autoNickname = settings ? settings.auto : false; }
		return data;
	};
	proto.saveToolsData = function (data) {
		var key = T.teamKey(this.curTeam);
		if (key) {
			data.teamProfiles = data.teamProfiles || {};
			data.teamProfiles[key] = {id: data.selectedNickname, auto: data.autoNickname};
		}
		Storage.prefs('pokemontools', T.clone(data));
		this.saveTeamToolBindings();
	};
	proto.saveTeamToolBindings = function () {
		var previous = Storage.prefs('teamtoolbindings') || [];
		var liveKeys = new Set((Storage.teams || []).map(function (team) { return team.toolsKey; }));
		var records = previous.filter(function (record) { return !liveKeys.has(record.id); });
		(Storage.teams || []).forEach(function (team) { if (team.toolsKey) records.push({id: team.toolsKey, signature: T.teamSignature(team)}); });
		if (JSON.stringify(previous) !== JSON.stringify(records)) Storage.prefs('teamtoolbindings', records);
	};
	var saveWithBindings = proto.save;
	proto.save = function () { var result = saveWithBindings.apply(this, arguments); this.saveTeamToolBindings(); return result; };
	proto.toolsCommit = function () {
		this.curTeam.team = Storage.packTeam(this.curSetList);
		this.curTeam.iconCache = '';
		this.save();
		this.update();
	};
	proto.toolsSetIndex = function (btn) { return Number($(btn).closest('li[value]').attr('value')); };
	var renderSet = proto.renderSet;
	proto.renderSet = function (set, index) {
		var html = renderSet.call(this, set, index);
		if (!set.species) return html;
		var data = this.toolsData(true), self = this;
		var builds = data.builds.filter(function (b) { return T.id(b.set.species) === T.id(set.species); });
		var open = this.openSetTools && this.openSetTools.has(set);
		var selectedBuild = this.selectedSavedSets && this.selectedSavedSets.get(set);
		var box = '<details class="set-tools-panel"' + (open ? ' open' : '') + '><summary>Set &amp; form options<span class="set-tools-state"></span></summary><div class="set-tools-content"><div class="set-tools-row"><span class="set-tools-label">Saved set</span><div class="set-tools-controls"><select class="saved-build-choice" aria-label="Saved build for ' + escape(set.species) + '"><option value="">Load a saved set…</option>';
		builds.forEach(function (b) {
			box += '<option value="' + escape(b.id) + '"' + (selectedBuild === b.id ? ' selected' : '') + '>' + escape(b.name) + ' — ' + escape(T.compatibility(b, set, self.curTeam.format, self.curTeam.dex)) + '</option>';
		});
		box += '</select>' + button('applySavedBuild', 'Load selected set') + button('saveNamedBuild', 'Save this Pokémon…') + button('updateSavedBuild', 'Overwrite saved set');
		if (this.buildUndo && this.buildUndo.team === this.curTeam && this.buildUndo.applied === set) box += button('undoSavedBuild', 'Undo apply');
		box += '</div></div><div class="set-tools-row"><span class="set-tools-label">Calculator</span><div class="set-tools-controls">' + button('calculateSetAs', 'As attacker', index + ':0') + button('calculateSetAs', 'As defender', index + ':1') + '</div></div><!-- SET FORM PREVIEW --></div></details>';
		return html.replace(/<\/li>$/, box + '</li>');
	};
	proto.toggleSetTools = function (event) {
		var set = this.curSetList[this.toolsSetIndex(event.currentTarget)];
		if (!set) return;
		if (!this.openSetTools) this.openSetTools = new WeakSet();
		if ($(event.currentTarget).parent().prop('open')) this.openSetTools.delete(set);
		else this.openSetTools.add(set);
	};
	proto.events['click .set-tools-panel > summary'] = 'toggleSetTools';
	proto.events['click .picker-filter-panel > summary'] = 'togglePickerFilters';
	proto.togglePickerFilters = function (event) { this.pickerFiltersOpen = !$(event.currentTarget).parent().prop('open'); };
	proto.saveNamedBuild = function (value, btn) {
		var index = this.toolsSetIndex(btn), team = this.curTeam, self = this;
		var snapshot = T.cleanSet(this.curSetList[index]);
		app.addPopupPrompt('Name this ' + snapshot.species + ' build:', 'Save build', function (name) {
			if (!name || !name.trim() || self.curTeam !== team) return;
			var data = self.toolsData();
			data.builds.push({id: T.uid(), name: name.trim().slice(0, 80), format: team.format || '', set: snapshot});
			self.saveToolsData(data);
			self.update();
		});
	};
	proto.loadSavedBuildNow = function (index, build, keepAppearance) {
		if (!this.curSetList[index] || !this.curTeam.dex.species.get(build.set.species).exists) return app.addPopupMessage('This form is unavailable in the current format.');
		this.buildUndo = {team: this.curTeam, index: index, set: T.clone(this.curSetList[index])};
		var current = this.curSetList[index];
		this.curSetList[index] = T.buildResult(current, build.set, keepAppearance);
		this.buildUndo.applied = this.curSetList[index];
		this.selectedSavedSets = this.selectedSavedSets || new WeakMap(); this.selectedSavedSets.set(this.curSetList[index], build.id);
		this.openSetTools = this.openSetTools || new WeakSet(); this.openSetTools.add(this.curSetList[index]);
		if (this.curSet === current || this.curSetLoc === index) this.curSet = this.curSetList[index];
		this.toolsView = false; this.profilesView = false;
		this.toolsCommit();
		this.buildUndo.snapshot = T.clone(this.buildUndo.applied);
	};
	proto.updateSavedBuild = function (value, btn) {
		var index = this.toolsSetIndex(btn), id = $(btn).closest('li').find('.saved-build-choice').val();
		var data = this.toolsData(), build = data.builds.find(function (b) { return b.id === id; });
		if (!build) return app.addPopupMessage('Choose the saved set to update.');
		this.libraryUndo = {field: 'builds', entry: T.clone(build), overwrite: true};
		build.set = T.cleanSet(this.curSetList[index]);
		build.format = this.curTeam.format || '';
		this.libraryUndo.after = T.clone(build);
		this.saveToolsData(data);
		this.update();
	};
	proto.undoSavedBuild = function () {
		var undo = this.buildUndo;
		if (!undo || undo.team !== this.curTeam) return;
		const index = this.curSetList.indexOf(undo.applied);
		if (index < 0) { this.buildUndo = null; return; }
		if (!undo.snapshot || JSON.stringify(undo.snapshot) !== JSON.stringify(undo.applied)) return app.addPopupMessage('This set changed after applying the build. Undo would overwrite those edits.');
		this.curSetList[index] = T.clone(undo.set);
		if (this.openSetTools) this.openSetTools.add(this.curSetList[index]);
		if (this.curSetLoc === index) this.curSet = this.curSetList[index];
		this.buildUndo = null;
		this.toolsCommit();
	};
	T.namedBuilds = function (sets, name, format) {
		if (!sets || !sets.length) throw new Error('Paste at least one Showdown set.');
		return sets.map(function (set) {
			if (!Dex.species.get(set.species).exists) throw new Error('Unknown Pokémon: ' + set.species);
			return {id: T.uid(), name: (name ? name + (sets.length > 1 ? ' — ' + set.species : '') : set.name || set.species).slice(0, 80), format: format || '', set: T.cleanSet(set)};
		});
	};
	proto.saveImportedBuilds = function () {
		this.saveNicknameDraft();
		try {
			var builds = T.namedBuilds(Storage.importTeam(String(this.$('.imported-build-sets').val())), String(this.$('.imported-build-name').val()).trim(), this.curTeam && this.curTeam.format);
			var data = this.toolsData(); data.builds = data.builds.concat(builds);
			this.saveToolsData(data); this.showToolsManager();
		} catch (err) { app.addPopupMessage(err.message); }
	};
	proto.addLibraryBuild = function (id) {
		this.saveNicknameDraft();
		if (!this.curTeam || !this.curSetList) return app.addPopupMessage('Open the team you want to add this build to first.');
		var data = this.toolsData(), build = data.builds.find(function (b) { return b.id === id; });
		if (!build) return;
		if (!this.curTeam.dex.species.get(build.set.species).exists) return app.addPopupMessage('This Pokémon is unavailable in the selected format.');
		var set = T.cleanSet(build.set);
		if (data.autoNickname) T.applyNickname(set, data.nicknames.find(function (p) { return p.id === data.selectedNickname; }), this.curTeam.dex, false);
		var index = this.curSetList.findIndex(function (entry) { return !entry.species; });
		if (index < 0) index = this.curSetList.length;
		if (index >= (this.curTeam.capacity || 6)) return app.addPopupMessage('This team is full. Select a Pokémon slot and use Replace selected set instead.');
		this.curSetList[index] = set;
		this.curSet = null; this.curSetLoc = -1; this.toolsView = false; this.profilesView = false;
		this.toolsCommit();
	};
	proto.showToolsManager = function () {
		this.toolsView = true;
		var data = this.toolsData(), html = '<div class="pad local-tools-manager">' + button('back', 'Back to Teambuilder') + '<h2>Team Builder library</h2><nav class="library-tabs" aria-label="Library sections"><button class="button" name="libraryTab" value="names">Nickname profiles</button><button class="button" name="libraryTab" value="sets">Saved sets</button><button class="button" name="libraryTab" value="lists">Pokémon lists</button></nav><p class="tools-intro">Save names and appearance rules in a nickname profile. Save moves, items, abilities and stats as reusable Pokémon sets.</p><p class="tools-note">Saved in this browser. Export a backup below to move your library to another device.</p><details class="tools-panel library-sets"><summary>Saved Pokémon sets</summary><p class="tools-note">Save a Pokémon from its Set &amp; form options in the Team Builder, or import sets here. Add a saved set to your team or replace the selected Pokémon.</p><input class="textbox build-library-search" aria-label="Search saved builds" placeholder="Search Pokémon, build, ability or moves" />';
		if (!data.builds.length) html += '<p>No saved sets yet. Open a Pokémon and choose “Save this Pokémon…” in Set &amp; form options, or import a set below.</p>';
		data.builds.forEach(function (b) {
			html += '<div class="saved-build-entry" data-search="' + escape([b.name, b.set.species, b.set.ability, (b.set.moves || []).join(' ')].join(' ').toLowerCase()) + '"><p><strong>' + escape(b.name) + '</strong> — ' + escape(b.set.species) + ' (' + escape(b.format || 'no format') + ') ' + button('renameToolEntry', 'Rename', 'build:' + b.id) + button('duplicateToolEntry', 'Duplicate', 'build:' + b.id) + button('deleteToolEntry', 'Delete', 'build:' + b.id) + button('addLibraryBuild', 'Add to team', b.id) + button('replaceLibraryBuild', 'Replace selected set', b.id) + '</p><small>' + escape([b.set.ability, b.set.item, b.set.nature, (b.set.moves || []).join(' / ')].filter(Boolean).join(' · ')) + '</small></div>';
		});
		html += '<details><summary>Import named sets</summary><label>Build name / group <input class="textbox imported-build-name" placeholder="e.g. Rain offense" maxlength="80" /></label><textarea class="textbox imported-build-sets" rows="6" aria-label="Showdown sets to save" placeholder="Paste one or more Showdown sets"></textarea>' + button('saveImportedBuilds', 'Save sets to library') + '</details>';
		html += '</details><section class="tools-panel library-names"><h3>Pokémon nicknames &amp; appearance</h3><p class="tools-note">1. Create or choose a profile. 2. Add Pokémon and names, then Save profile. 3. Preview and apply it to your team.</p><label>Profile <select class="nickname-profile-choice"><option value="">None</option>';
		data.nicknames.forEach(function (p) { html += '<option value="' + escape(p.id) + '"' + (data.selectedNickname === p.id ? ' selected' : '') + '>' + escape(p.name) + '</option>'; });
		html += '</select></label> <label><input type="checkbox" class="auto-nickname"' + (data.autoNickname ? ' checked' : '') + ' /> Use this profile for newly added Pokémon</label><p>' + button('newNicknameProfile', 'Create nickname profile') + '</p>';
		var profile = data.nicknames.find(function (p) { return p.id === data.selectedNickname; });
		if (profile) {
			var draft = (Storage.prefs('nicknamedrafts') || {})[profile.id];
			html += '<p>' + button('renameToolEntry', 'Rename', 'nickname:' + profile.id) + button('duplicateToolEntry', 'Duplicate', 'nickname:' + profile.id) + button('deleteToolEntry', 'Delete', 'nickname:' + profile.id) + '</p>';
			html += '<p><input class="textbox nickname-search" aria-label="Search nicknames" placeholder="Find Pokémon or nickname" /> <label><input type="checkbox" class="nickname-team-only" /> Current team only</label> ' + button('addTeamNicknameRows', 'Add current team') + '</p><div class="nickname-rows"><div class="nickname-row nickname-head"><span>Pokémon / form</span><span>Gender</span><span>Nickname</span><span></span></div>';
			if (draft) {
				draft.rows.filter(function (row) { return row[0].trim() || row[1].trim(); }).forEach(function (row) { html += T.nicknameRow(row[0], row[1], row[2]); });
				profile.shiny = draft.shiny; profile.gendered = draft.gendered; profile.fallback = draft.fallback;
			} else {
				Object.keys(profile.entries).sort().forEach(function (id) { html += T.nicknameRow(Dex.species.get(id).name, profile.entries[id]); });
				Object.keys(profile.genderEntries || {}).sort().forEach(function (id) { Object.keys(profile.genderEntries[id]).forEach(function (gender) { html += T.nicknameRow(Dex.species.get(id).name, profile.genderEntries[id][gender], gender); }); });
			}

			html += T.nicknameRow('', '') + '</div><datalist id="nickname-species-options">';
			Object.keys(window.BattlePokedex || {}).forEach(function (id) { html += '<option value="' + escape(Dex.species.get(id).name) + '"></option>'; });
			html += '</datalist><p>' + button('addNicknameRow', 'Add Pokémon') + ' ' + button('saveNicknameMappings', 'Save profile') + ' <span class="nickname-save-status" role="status">' + (draft ? 'Unsaved changes — recovered draft' : 'Profile saved') + '</span></p>';
			html += '<p><label>Team-wide shiny rule <select class="nickname-shiny"><option value="">Keep unchanged</option><option value="yes"' + (profile.shiny === 'yes' ? ' selected' : '') + '>Always shiny</option><option value="no"' + (profile.shiny === 'no' ? ' selected' : '') + '>Never shiny</option></select></label><label><input type="checkbox" class="nickname-gendered"' + (profile.gendered ? ' checked' : '') + ' /> Use gender-specific nicknames</label></p><p class="tools-note">The shiny rule affects every Pokémon on the team, including those without nickname entries. Default names apply to any gender. Gender rows override them when enabled; an unspecified gender uses the default name.</p>';
			html += '<label><input type="checkbox" class="nickname-fallback"' + (profile.fallback ? ' checked' : '') + ' /> Use the base Pokémon’s name for forms without an entry</label>';
			html += '<details><summary>Paste a list</summary><p>One Pokémon = nickname per line. Dashes (— or –) also work.</p><textarea class="textbox nickname-paste" rows="5" aria-label="Paste nickname list" placeholder="Togekiss = Deneb"></textarea>' + button('pasteNicknameRows', 'Add pasted names') + '</details>';

		}
		html += '<label><input type="checkbox" class="nickname-replace" /> Replace existing nicknames when applying</label><p>' + button('applyNicknameToTeam', 'Preview changes for this team') + '</p></section><details class="tools-panel library-backup"><summary>Backup nicknames &amp; saved sets</summary><p class="tools-note">Includes saved nickname profiles and Pokémon sets only. Pokémon lists, teams and unfinished drafts are not included. Save nickname drafts before exporting.</p><p><button class="button" name="downloadToolsBackup">Download backup</button> <label class="button">Import backup <input type="file" class="tools-backup-file" accept=".json,application/json" /></label></p><details><summary>Advanced: raw JSON</summary><p>Import adds copies without replacing saved profiles.</p><textarea class="textbox tools-transfer" rows="8" aria-label="Build and nickname library JSON">' + escape(JSON.stringify(data, null, 2)) + '</textarea><p>' + button('exportToolsLibrary', 'Refresh export') + button('importToolsLibrary', 'Import library') + '</p></details></details></div>';
		this.$el.html(html);
		this.refreshLibraryControls();
		this.restoreLibraryView();
	};
	proto.exportToolsLibrary = function () { if (!this.saveNicknameMappings()) return; this.$('.tools-transfer').val(JSON.stringify(this.toolsData(), null, 2)).focus().select(); };
	proto.importToolsLibrary = function () {
		this.saveNicknameDraft();
		try {
			var incoming = T.parse(this.$('.tools-transfer').val()), data = this.toolsData();
			data.builds = data.builds.concat(incoming.builds);
			data.nicknames = data.nicknames.concat(incoming.nicknames);
			this.saveToolsData(data);
			this.showToolsManager();
		} catch (err) { app.addPopupMessage(err.message); }
	};
	proto.newNicknameProfile = function () {
		this.saveNicknameDraft();
		var self = this;
		app.addPopupPrompt('Profile name:', 'Create nickname profile', function (name) {
			if (!name || !name.trim()) return;
			var data = self.toolsData(), id = T.uid();
			data.nicknames.push({id: id, name: name.trim().slice(0, 80), entries: {}, fallback: false});
			data.selectedNickname = id;
			self.saveToolsData(data);
			self.showToolsManager();
		});
	};
	T.nicknameRow = function (species, name, gender) {
		var choices = '<select class="nickname-gender" aria-label="Nickname gender">' + [['', 'Default'], ['M', 'Male'], ['F', 'Female'], ['N', 'Genderless']].map(function (option) { return '<option value="' + option[0] + '"' + (gender === option[0] ? ' selected' : '') + '>' + option[1] + '</option>'; }).join('') + '</select>';
		return '<div class="nickname-row"><input class="textbox nickname-species" list="nickname-species-options" aria-label="Pokémon or form" placeholder="Pokémon or form" value="' + escape(species) + '" />' + choices + '<input class="textbox nickname-value" aria-label="Nickname" placeholder="Nickname" value="' + escape(name) + '" />' + button('removeNicknameRow', 'Remove') + '</div>';
	};
	T.nicknameEntries = function (rows) {
		var entries = {};
		rows.forEach(function (row, index) {
			var raw = row[0].trim(), name = row[1].trim(), species = Dex.species.get(raw);
			if (!raw && !name) return;
			if (!species.exists) throw new Error('Row ' + (index + 1) + ': choose a valid Pokémon or form.');
			if (!name || /[\x00-\x1f|\[\]]/.test(name) || Array.from(name).length > 24) throw new Error(species.name + ': enter a nickname of 1–24 characters, without | or brackets.');
			if (entries[species.id]) throw new Error('Duplicate Pokémon: ' + species.name);
			entries[species.id] = name;
		});
		return entries;
	};
	T.nicknameMappings = function (rows) {
		var result = {entries: {}, genderEntries: {}};
		rows.forEach(function (row) {
			var parsed = T.nicknameEntries([row]);
			Object.keys(parsed).forEach(function (id) {
				var gender = row[2] || '';
				if (gender && !['M', 'F', 'N'].includes(gender)) throw new Error('Invalid gender.');
				var dest = gender ? (result.genderEntries[id] || (result.genderEntries[id] = {})) : result.entries;
				var key = gender || id;
				if (dest[key]) throw new Error('Duplicate Pokémon / gender: ' + row[0]);
				dest[key] = parsed[id];
			});
		});
		return result;
	};
	T.nicknameList = function (text) {
		return text.split(/\r?\n/).filter(function (line) { return line.trim(); }).map(function (line) {
			var match = line.match(/^(.*?)\s*(?:=|—|–|\s-\s)\s*(.+)$/);
			if (!match) throw new Error('Use Pokémon = nickname on each line.');
			return [match[1], match[2]];
		});
	};
	proto.addNicknameRow = function () { this.$('.nickname-rows').append(T.nicknameRow('', '')); this.$('.nickname-species').last().focus(); this.saveNicknameDraft(); };
	proto.removeNicknameRow = function (value, btn) { $(btn).closest('.nickname-row').remove(); this.saveNicknameDraft(); };
	proto.pasteNicknameRows = function () {
		try {
			var rows = T.nicknameList(String(this.$('.nickname-paste').val()));
			T.nicknameEntries(rows);
			var self = this;
			rows.forEach(function (row) { self.$('.nickname-rows').append(T.nicknameRow(row[0], row[1])); });
			this.$('.nickname-paste').val('');
			this.saveNicknameDraft();
		} catch (err) { app.addPopupMessage(err.message); }
	};
	proto.saveNicknameMappings = function () {
		if (!this.toolsView) return true;
		var data = this.toolsData(), profile = data.nicknames.find(function (p) { return p.id === data.selectedNickname; });
		if (!profile) return true;
		var rows = [];
		this.$('.nickname-row').not('.nickname-head').each(function () { rows.push([String($(this).find('.nickname-species').val()), String($(this).find('.nickname-value').val()), String($(this).find('.nickname-gender').val() || '')]); });
		try {
			var mapped = T.nicknameMappings(rows);
			profile.entries = mapped.entries; profile.genderEntries = mapped.genderEntries;
		} catch (err) { app.addPopupMessage(err.message); return false; }
		profile.fallback = !!this.$('.nickname-fallback').prop('checked');
		profile.shiny = this.$('.nickname-shiny').val() || '';
		profile.gendered = !!this.$('.nickname-gendered').prop('checked');
		this.saveToolsData(data);
		var drafts = Storage.prefs('nicknamedrafts') || {}; delete drafts[profile.id]; Storage.prefs('nicknamedrafts', drafts);
		this.$('.nickname-save-status').text('Profile saved');
		return true;
	};
	proto.nicknameSettingsChange = function () {
		this.saveNicknameDraft();
		var data = this.toolsData();
		data.selectedNickname = this.$('.nickname-profile-choice').val() || '';
		data.autoNickname = !!this.$('.auto-nickname').prop('checked');
		this.saveToolsData(data);
		this.showToolsManager();
	};
	proto.applyNicknameProfile = function (index) {
		if (!this.curTeam || !this.curSetList[Number(index)]) return;
		var data = this.toolsData(), profile = data.nicknames.find(function (p) { return p.id === data.selectedNickname; });
		if (!profile) return app.addPopupMessage('Select a nickname profile in Builds & nicknames first.');
		T.applyNickname(this.curSetList[Number(index)], profile, this.curTeam.dex, false);
		this.toolsCommit();
	};
	proto.applyNicknameToTeam = function () {
		if (!this.saveNicknameMappings()) return;
		if (!this.curTeam || !this.curSetList) return app.addPopupMessage('Open a team first.');
		var data = this.toolsData(), profile = data.nicknames.find(function (p) { return p.id === data.selectedNickname; });
		if (!profile) return app.addPopupMessage('Choose a nickname profile first.');
		var replace = !!this.$('.nickname-replace').prop('checked'), dex = this.curTeam.dex;
		var before = T.clone(this.curSetList), after = T.clone(before);
		after.forEach(function (set) { T.applyNickname(set, profile, dex, replace); });
		this.pendingProfileApply = {team: this.curTeam, before: before, after: after};
		var names = after.filter(function (set, i) { return set.name !== before[i].name; }).length;
		var shiny = after.filter(function (set, i) { return !!set.shiny !== !!before[i].shiny; }).length;
		this.$('.profile-apply-preview').remove();
		this.$el.append('<div class="pad profile-apply-preview" role="dialog" aria-label="Preview profile changes" tabindex="-1"><b>' + escape(profile.name) + '</b>: ' + names + ' nickname changes, ' + shiny + ' shiny changes.' + T.profileChanges(before, after, profile, dex) + '<div class="profile-confirm-actions">' + button('confirmProfileApply', 'Apply to whole team') + button('cancelProfileApply', 'Cancel') + '</div></div>');
		this.$('.profile-apply-preview').focus();
	};
	proto.confirmProfileApply = function () {
		var pending = this.pendingProfileApply;
		if (!pending || pending.team !== this.curTeam || JSON.stringify(pending.before) !== JSON.stringify(this.curSetList)) return app.addPopupMessage('The team changed. Preview these changes again.');
		this.profileApplyUndo = pending;
		this.curSetList = T.clone(pending.after); Storage.activeSetList = this.curSetList;
		if (this.curSetLoc >= 0) this.curSet = this.curSetList[this.curSetLoc];
		this.pendingProfileApply = null; this.toolsCommit();
		this.profileApplyUndo.after = T.clone(this.curSetList);
		this.$el.prepend('<div class="pad profile-apply-preview">Profile applied. ' + button('undoProfileApply', 'Undo profile changes') + '</div>');
	};
	proto.cancelProfileApply = function () { this.pendingProfileApply = null; this.$('.profile-apply-preview').remove(); };
	proto.undoProfileApply = function () {
		var undo = this.profileApplyUndo;
		if (!undo || undo.team !== this.curTeam || JSON.stringify(undo.after) !== JSON.stringify(this.curSetList)) return app.addPopupMessage('The team changed after applying. Undo would overwrite those edits.');
		this.curSetList = T.clone(undo.before); Storage.activeSetList = this.curSetList;
		if (this.curSetLoc >= 0) this.curSet = this.curSetList[this.curSetLoc];
		this.profileApplyUndo = null; this.toolsCommit();
	};
	var originalRosterManager = proto.showRosterProfiles;
	proto.openRosterManager = function () { this.saveNicknameDraft(); this.toolsView = false; originalRosterManager.call(this); };
	proto.filterSavedBuilds = function (event) {
		var query = event.currentTarget.value.toLowerCase().trim();
		this.$('.saved-build-entry').each(function () { $(this).toggle($(this).attr('data-search').includes(query)); });
	};
	proto.replaceLibraryBuild = function (id) {
		this.saveNicknameDraft();
		if (!this.curTeam || !this.curSet) return app.addPopupMessage('Select the Pokémon slot to replace first.');
		var build = this.toolsData().builds.find(function (b) { return b.id === id; });
		if (!build || !this.curTeam.dex.species.get(build.set.species).exists) return;
		var index = this.curSetList.indexOf(this.curSet); if (index < 0) return;
		this.openBuildComparison(index, build);
	};
	proto.saveNicknameDraft = function () {
		var id = this.toolsData().selectedNickname; if (!id || !this.toolsView) return;
		var rows = []; this.$('.nickname-row').not('.nickname-head').each(function () { rows.push([String($(this).find('.nickname-species').val()), String($(this).find('.nickname-value').val()), String($(this).find('.nickname-gender').val() || '')]); });
		var drafts = Storage.prefs('nicknamedrafts') || {};
		rows = T.nonemptyNicknameRows(rows);
		drafts[id] = {rows: rows, shiny: this.$('.nickname-shiny').val() || '', gendered: !!this.$('.nickname-gendered').prop('checked'), fallback: !!this.$('.nickname-fallback').prop('checked')};
		Storage.prefs('nicknamedrafts', drafts); this.$('.nickname-save-status').text('Unsaved changes — draft retained');
	};
	proto.renameToolEntry = function (key) {
		this.saveNicknameDraft();
		var self = this, parts = key.split(':'), field = parts[0] === 'build' ? 'builds' : 'nicknames';
		app.addPopupPrompt('New name:', 'Rename', function (name) {
			if (!name || !name.trim()) return;
			var data = self.toolsData(), entry = data[field].find(function (x) { return x.id === parts[1]; });
			if (!entry) return;
			entry.name = name.trim().slice(0, 80);
			self.saveToolsData(data);
			self.showToolsManager();
		});
	};
	proto.duplicateToolEntry = function (key) {
		this.saveNicknameDraft();
		var parts = key.split(':'), field = parts[0] === 'build' ? 'builds' : 'nicknames', data = this.toolsData();
		var entry = data[field].find(function (x) { return x.id === parts[1]; });
		if (!entry) return;
		var copy = T.clone(entry);
		if (field === 'nicknames') {
			var draft = (Storage.prefs('nicknamedrafts') || {})[entry.id];
			if (draft) {
				try { Object.assign(copy, T.nicknameMappings(draft.rows), {shiny: draft.shiny, gendered: draft.gendered, fallback: draft.fallback}); }
				catch (err) { return app.addPopupMessage('Fix the nickname draft before duplicating: ' + err.message); }
			}
		}
		copy.id = T.uid();
		copy.name += ' (copy)';
		data[field].push(copy);
		this.saveToolsData(data);
		this.showToolsManager();
	};
	proto.deleteToolEntry = function (key) {
		var parts = key.split(':'), field = parts[0] === 'build' ? 'builds' : 'nicknames', data = this.toolsData();
		this.saveNicknameDraft();
		this.libraryUndo = {field: field, entry: T.clone(data[field].find(function (entry) { return entry.id === parts[1]; })), selected: data.selectedNickname};
		data[field] = data[field].filter(function (x) { return x.id !== parts[1]; });
		if (data.selectedNickname === parts[1]) data.selectedNickname = '';
		this.saveToolsData(data);
		this.showToolsManager();
	};
	var setPokemon = proto.setPokemon;
	proto.setPokemon = function (value, next) {
		var previous = this.curSet, manualName = previous && previous.name && T.id(previous.name) !== T.id(previous.species) ? previous.name : '';
		var result = setPokemon.call(this, value, next), data = this.toolsData();
		if (manualName && this.curSet) this.curSet.name = manualName;
		if (this.curSet && data.autoNickname) {
			var profile = data.nicknames.find(function (p) { return p.id === data.selectedNickname; });
			T.applyNickname(this.curSet, profile, this.curTeam.dex, false);
		}
		if (this.curSet) this.$('input[name=nickname]').val(this.curSet.name || '');
		return result;
	};
	var profiles = proto.renderRosterProfiles;
	proto.renderRosterProfiles = function () {
		var html = profiles.apply(this, arguments), data = this.toolsData(true);
		var active = data.nicknames.find(function (p) { return p.id === data.selectedNickname; });
		html = html.replace(/<button[^>]*name="showRosterProfiles"[^>]*>(?:Profiles|Pokémon lists)<\/button>/, '');
		html = html.replace(/<\/div>$/, '<span class="active-name-profile">Names: ' + escape(active ? active.name : 'None') + '</span></div>');
		return html;
	};
	var update = proto.update;
	proto.update = function () {
		if (this.toolsView) return this.showToolsManager();
		var result = update.apply(this, arguments);
		if (this.curTeam && !this.profilesView && !this.validationView && !this.exportMode) {
			var data = this.toolsData(true);
			var html = '<div class="pad team-profile-toolbar"><label>Nickname profile <select class="team-profile-choice"><option value="">None</option>';
			data.nicknames.forEach(function (p) { html += '<option value="' + escape(p.id) + '"' + (data.selectedNickname === p.id ? ' selected' : '') + '>' + escape(p.name) + '</option>'; });
			html += '</select></label> ' + button('showToolsManager', 'Manage nicknames & sets') + button('applyNicknameToTeam', 'Preview team changes') + '<small class="team-profile-help">Choose saved names and shiny settings, then preview before applying.</small></div>';
			this.$('.team-profile-toolbar').remove();
			// Keep List/Team and the Pokémon tabs first; tools belong in the content flow.
			this.$('.teamchartbox').first().prepend(html);
		}
		return result;
	};
	proto.returnToPokemonEditor = function () {
		var editor = this.$('.teamchartbox.individual')[0];
		if (editor) editor.scrollIntoView({block: 'start', behavior: 'auto'});
	};
	proto.changeTeamNicknameProfile = function (event) {
		var data = this.toolsData(), id = event.currentTarget.value;
		if (data.selectedNickname === id) return;
		data.selectedNickname = id; this.saveToolsData(data);
		var profile = data.nicknames.find(function (entry) { return entry.id === id; });
		this.$('.active-name-profile').text('Names: ' + (profile ? profile.name : 'None'));
		this.refreshLibraryControls();
	};
	proto.events['change .team-profile-choice'] = 'changeTeamNicknameProfile';
	var back = proto.back;
	proto.back = function () { if (this.toolsView) { this.saveNicknameDraft(); this.toolsView = false; return this.update(); } return back.apply(this, arguments); };
	proto.events['change .nickname-profile-choice'] = 'nicknameSettingsChange';
	proto.events['change .auto-nickname'] = 'nicknameSettingsChange';
	proto.events['input .nickname-row input'] = 'saveNicknameDraft';
	proto.events['change .nickname-gender, .nickname-shiny, .nickname-gendered, .nickname-fallback'] = 'saveNicknameDraft';
	proto.events['input .build-library-search'] = 'filterSavedBuilds';
	// Item search uses descriptions and activation data exported from this server checkout.
	T.itemMetadata = {"parasectite":{"text":"Allows Parasect, including its Rejuv or Parasite form, to Mega Evolve.", "tags":["mega evolution transformation", "evolution"]}, "anomalycore":{"text":"If held by a designated Pulse or Rift Pokemon, this Anomaly Core allows it to undergo its Pulse or Rift Evolution in battle.", "tags":["mega evolution transformation", "evolution"]}, "belliboltite":{"text":"If held by a Bellibolt, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "sunflorite":{"text":"If held by a Sunflora, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "claydolite":{"text":"If held by a Claydol, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "abilityshield":{"text":"Holder's Ability cannot be changed, suppressed, or ignored by any effect.", "tags":[]}, "abomasite":{"text":"If held by an Abomasnow, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "absolite":{"text":"If held by an Absol, this item allows it to Mega Evolve into Mega Absol in battle.", "tags":["mega evolution transformation", "evolution"]}, "absolitez":{"text":"If held by an Absol, this item allows it to Mega Evolve into Mega Absol Z in battle.", "tags":["mega evolution transformation", "evolution"]}, "absorbbulb":{"text":"Raises Sp. Atk by 1 if hit by Water or on Misty/Water Surface/Underwater. Single use.", "tags":[]}, "adamantcrystal":{"text":"If held by a Dialga, its Steel- and Dragon-type attacks have 1.2x power.", "tags":[]}, "adamantorb":{"text":"If held by a Dialga, its Steel- and Dragon-type attacks have 1.2x power.", "tags":[]}, "adrenalineorb":{"text":"Raises holder's Speed by 1 stage if it gets affected by Intimidate. Single use.", "tags":[]}, "aerodactylite":{"text":"If held by an Aerodactyl, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "aggronite":{"text":"If held by an Aggron, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "aguavberry":{"text":"Restores 1/2 max HP at 1/4 max HP or less; confuses if -SpD Nature. Single use.", "tags":["healing recovery", "low HP pinch healing"], "threshold":0.25}, "airballoon":{"text":"Holder is immune to Ground-type attacks. Pops when holder is hit.", "tags":[]}, "alakazite":{"text":"If held by an Alakazam, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "aloraichiumz":{"text":"Alolan Raichu with Thunderbolt can use Stoked Sparksurfer once per battle.", "tags":[]}, "altarianite":{"text":"If held by an Altaria, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "ampharosite":{"text":"If held by an Ampharos, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "amplifieldrock":{"text":"Extends temporary terrains and room effects created by the holder, usually by 3 turns.", "tags":[]}, "apicotberry":{"text":"Raises holder's Sp. Def by 1 stage when at 1/4 max HP or less. Single use.", "tags":["low HP pinch stat boost", "offense offensive boost"], "threshold":0.25}, "armorfossil":{"text":"Can be revived into Shieldon.", "tags":[]}, "aspearberry":{"text":"Holder is cured if it is frozen. Single use.", "tags":["status cure"]}, "assaultvest":{"text":"Holder's Sp. Def is 1.5x, but it can only select damaging moves.", "tags":["defense defensive boost"]}, "audinite":{"text":"If held by an Audino, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "auspiciousarmor":{"text":"Evolves Charcadet into Armarouge when used.", "tags":["evolution"]}, "babiriberry":{"text":"Halves damage taken from a supereffective Steel-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "banettite":{"text":"If held by a Banette, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "barbaracite":{"text":"If held by a Barbaracle, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "baxcalibrite":{"text":"If held by a Baxcalibur, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "beastball":{"text":"A special Poke Ball designed to catch Ultra Beasts.", "tags":[]}, "beedrillite":{"text":"If held by a Beedrill, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "berryjuice":{"text":"Restores 20 HP when at 1/2 max HP or less. Single use.", "tags":["healing recovery", "low HP pinch healing"], "threshold":0.5}, "berrysweet":{"text":"Evolves Milcery into Alcremie when held and spun around.", "tags":["evolution"]}, "bignugget":{"text":"A big nugget of pure gold that gives off a lustrous gleam.", "tags":[]}, "bigroot":{"text":"Holder gains 1.3x HP from draining/Aqua Ring/Ingrain/Leech Seed/Strength Sap.", "tags":[]}, "bindingband":{"text":"Holder's partial-trapping moves deal 1/6 max HP per turn instead of 1/8.", "tags":[]}, "blackbelt":{"text":"Holder's Fighting-type attacks have 1.2x power.", "tags":[]}, "blackglasses":{"text":"Holder's Dark-type attacks have 1.2x power.", "tags":[]}, "blacksludge":{"text":"Each turn, Poison types or Parasitism holders heal 1/16 max HP; others lose 1/8.", "tags":["healing recovery"]}, "blastoisinite":{"text":"If held by a Blastoise, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "blazikenite":{"text":"If held by a Blaziken, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "blueorb":{"text":"If held by a Kyogre, this item triggers its Primal Reversion in battle.", "tags":[]}, "blunderpolicy":{"text":"If the holder misses due to accuracy, its Speed is raised by 2 stages. Single use.", "tags":[]}, "boosterenergy":{"text":"Activates the Protosynthesis or Quark Drive Abilities. Single use.", "tags":[]}, "bottlecap":{"text":"Used for Hyper Training. One of a Pokemon's stats is calculated with an IV of 31.", "tags":[]}, "brightpowder":{"text":"The accuracy of attacks against the holder is 0.9x.", "tags":[]}, "buggem":{"text":"Holder's first successful Bug-type attack will have 1.3x power. Single use.", "tags":[]}, "buginiumz":{"text":"Once per battle, converts a damaging Bug-type move into Savage Spin-Out, or gives a Bug-type status move its Z-effect.", "tags":[]}, "bugmemory":{"text":"Holder's Multi-Attack is Bug type. RKS System gives Tinted Lens and Shield Dust.", "tags":[]}, "burndrive":{"text":"Holder's Techno Blast is Fire type.", "tags":[]}, "cameruptite":{"text":"If held by a Camerupt, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "cellbattery":{"text":"Raises holder's Attack by 1 if hit by an Electric-type attack. Single use.", "tags":[]}, "chandelurite":{"text":"If held by a Chandelure, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "charcoal":{"text":"Holder's Fire-type attacks have 1.2x power.", "tags":[]}, "charizarditex":{"text":"If held by a Charizard, this item allows it to Mega Evolve into either Mega Charizard X or Mega Charizard Y.", "tags":["mega evolution transformation", "evolution"]}, "charizarditey":{"text":"If held by a Charizard, this item allows it to Mega Evolve into either Mega Charizard X or Mega Charizard Y.", "tags":["mega evolution transformation", "evolution"]}, "chartiberry":{"text":"Halves damage taken from a supereffective Rock-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "cheriberry":{"text":"Holder cures itself if it is paralyzed. Single use.", "tags":["status cure"]}, "cherishball":{"text":"A rare Poke Ball that has been crafted to commemorate an occasion.", "tags":[]}, "chesnaughtite":{"text":"If held by a Chesnaught, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "chestoberry":{"text":"Holder wakes up if it is asleep. Single use.", "tags":["status cure"]}, "chilanberry":{"text":"Halves damage taken from a Normal-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "chilldrive":{"text":"Holder's Techno Blast is Ice type.", "tags":[]}, "chimechite":{"text":"If held by a Chimecho, this item allows it to Mega Evolve into either Chimecho-Mega or Chimecho-Mega-Y in battle.", "tags":["mega evolution transformation", "evolution"]}, "chippedpot":{"text":"Evolves Sinistea-Antique into Polteageist-Antique when used.", "tags":["evolution"]}, "choiceband":{"text":"Holder's Attack is 1.5x, but it can only select the first move it executes.", "tags":["offense offensive boost"]}, "choicescarf":{"text":"Holder's Speed is 1.5x, but it can only select the first move it executes.", "tags":[]}, "choicespecs":{"text":"Holder's Sp. Atk is 1.5x, but it can only select the first move it executes.", "tags":["offense offensive boost"]}, "chopleberry":{"text":"Halves damage taken from a supereffective Fighting-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "clawfossil":{"text":"Can be revived into Anorith.", "tags":[]}, "clearamulet":{"text":"Prevents other Pokemon from lowering the holder's stat stages.", "tags":[]}, "clefablite":{"text":"If held by a Clefable, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "haxorite":{"text":"If held by a Haxorus, this item allows it to Mega Evolve into Haxorus-Mega in battle.", "tags":["mega evolution transformation", "evolution"]}, "arbokite":{"text":"If held by an Arbok, this item allows it to Mega Evolve into either Arbok-Mega-X or Arbok-Mega-Y in battle.", "tags":["mega evolution transformation", "evolution"]}, "cinderite":{"text":"", "tags":["mega evolution transformation"]}, "ledianite":{"text":"", "tags":["mega evolution transformation"]}, "aridiate":{"text":"", "tags":["mega evolution transformation"]}, "clawitzerite":{"text":"", "tags":["mega evolution transformation"]}, "zangoosite":{"text":"", "tags":["mega evolution transformation"]}, "sevipite":{"text":"", "tags":["mega evolution transformation"]}, "salazzite":{"text":"", "tags":["mega evolution transformation"]}, "arbolivite":{"text":"", "tags":["mega evolution transformation"]}, "tyrantrumite":{"text":"", "tags":["mega evolution transformation"]}, "torterranite":{"text":"", "tags":["mega evolution transformation"]}, "infernite":{"text":"", "tags":["mega evolution transformation"]}, "empoleonite":{"text":"", "tags":["mega evolution transformation"]}, "aurorite":{"text":"", "tags":["mega evolution transformation"]}, "miloticide":{"text":"", "tags":["mega evolution transformation"]}, "cloversweet":{"text":"Evolves Milcery into Alcremie when held and spun around.", "tags":["evolution"]}, "cobaberry":{"text":"Halves damage taken from a supereffective Flying-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "colburberry":{"text":"Halves damage taken from a supereffective Dark-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "cornerstonemask":{"text":"Ogerpon-Cornerstone: 1.2x power attacks; Terastallize to gain Embody Aspect.", "tags":[]}, "coverfossil":{"text":"Can be revived into Tirtouga.", "tags":[]}, "covertcloak":{"text":"The holder is not affected by the secondary effect of another Pokemon's attack. Attacks with secondary effects that are prevented include those with a chance (even 100%) to paralyze, sleep, freeze, burn, poison, confuse, cause the holder to flinch, cause the holder's stat stages to be lowered, as well as Anchor Shot, Eerie Spell, Fling, Psychic Noise, Salt Cure, Spirit Shackle, Syrup Bomb, and Throat Chop. The effect of Sparkling Aria is prevented if the holder is the only target. Secondary effects added by King's Rock, Razor Fang, and the Poison Touch, Stench, and Toxic Chain Abilities are also prevented against the holder.", "tags":[]}, "crabominite":{"text":"If held by a Crabominable, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "crackedpot":{"text":"Evolves Sinistea into Polteageist when used.", "tags":["evolution"]}, "custapberry":{"text":"Holder moves first in its priority bracket when at 1/4 max HP or less. Single use.", "tags":[]}, "damprock":{"text":"Holder's use of Rain Dance lasts 8 turns instead of 5.", "tags":[]}, "darkgem":{"text":"Holder's first successful Dark-type attack will have 1.3x power. Single use.", "tags":[]}, "darkiniumz":{"text":"Once per battle, converts a damaging Dark-type move into Black Hole Eclipse, or gives a Dark-type status move its Z-effect.", "tags":[]}, "darkmemory":{"text":"Holder's Multi-Attack is Dark type. RKS System gives Pressure and Intimidate.", "tags":[]}, "darkranite":{"text":"If held by a Darkrai, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "dawnstone":{"text":"Evolves male Kirlia into Gallade and female Snorunt into Froslass when used.", "tags":["mega evolution transformation", "evolution"]}, "decidiumz":{"text":"Decidueye with Spirit Shackle can use Sinister Arrow Raid once per battle.", "tags":[]}, "deepseascale":{"text":"If held by a Clamperl, its Sp. Def is doubled. Evolves Clamperl into Gorebyss when traded.", "tags":["defense defensive boost", "evolution"]}, "deepseatooth":{"text":"If held by a Clamperl, its Sp. Atk is doubled. Evolves Clamperl into Huntail when traded.", "tags":["offense offensive boost", "evolution"]}, "delphoxite":{"text":"If held by a Delphox, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "destinyknot":{"text":"If holder becomes infatuated, the other Pokemon also becomes infatuated.", "tags":[]}, "diancite":{"text":"If held by a Diancie, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "diveball":{"text":"A Poke Ball that works especially well on Pokemon that live underwater.", "tags":[]}, "domefossil":{"text":"Can be revived into Kabuto.", "tags":[]}, "dousedrive":{"text":"Holder's Techno Blast is Water type.", "tags":[]}, "dracoplate":{"text":"Holder's Dragon-type attacks have 1.2x power. Judgment is Dragon type.", "tags":[]}, "dragalgite":{"text":"If held by a Dragalge, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "dragonfang":{"text":"Holder's Dragon-type attacks have 1.2x power.", "tags":[]}, "dragongem":{"text":"Holder's first successful Dragon-type attack will have 1.3x power. Single use.", "tags":[]}, "dragoninite":{"text":"If held by a Dragonite, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "dragoniumz":{"text":"Once per battle, converts a damaging Dragon-type move into Devastating Drake, or gives a Dragon-type status move its Z-effect.", "tags":[]}, "dragonmemory":{"text":"Holder's Multi-Attack is Dragon type. RKS System gives Marvel Scale and Tough Claws.", "tags":[]}, "dragonscale":{"text":"Evolves Seadra into Kingdra when traded.", "tags":["evolution"]}, "drampanite":{"text":"If held by a Drampa, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "dreadplate":{"text":"Holder's Dark-type attacks have 1.2x power. Judgment is Dark type.", "tags":[]}, "dreamball":{"text":"A Poke Ball that makes it easier to catch wild Pokémon while they're asleep.", "tags":[]}, "dubiousdisc":{"text":"Evolves Porygon2 into Porygon-Z when traded.", "tags":["evolution"]}, "duskball":{"text":"A Poke Ball that makes it easier to catch wild Pokemon at night or in caves.", "tags":[]}, "duskstone":{"text":"Evolves Murkrow into Honchkrow, Misdreavus into Mismagius, Lampent into Chandelure, and Doublade into Aegislash when used.", "tags":["mega evolution transformation", "evolution"]}, "earthplate":{"text":"Holder's Ground-type attacks have 1.2x power. Judgment is Ground type.", "tags":[]}, "eelektrossite":{"text":"If held by an Eelektross, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "eeviumz":{"text":"Eevee forms: heals 1/16 max HP each turn; Extreme Evoboost via Last Resort or Veevee Volley.", "tags":["healing recovery"]}, "ejectbutton":{"text":"If holder survives a hit, it immediately switches out to a chosen ally. Single use.", "tags":[]}, "ejectpack":{"text":"If the holder's stat stages are lowered, it switches to a chosen ally. Single use.", "tags":[]}, "electirizer":{"text":"Evolves Electabuzz into Electivire when traded.", "tags":["evolution"]}, "electricgem":{"text":"Holder's first successful Electric-type attack will have 1.3x power. Single use.", "tags":[]}, "electricmemory":{"text":"Holder's Multi-Attack is Electric type. RKS System gives Transistor and Lightning Rod.", "tags":[]}, "electriumz":{"text":"Once per battle, converts a damaging Electric-type move into Gigavolt Havoc, or gives a Electric-type status move its Z-effect.", "tags":[]}, "emboarite":{"text":"", "tags":["mega evolution transformation"]}, "elementalseed":{"text":"If the terrain is a Elemental Terrain, boosts the holder in a unique way. Single use.", "tags":["offense offensive boost"]}, "enigmaberry":{"text":"Restores 1/4 max HP after holder is hit by a supereffective move. Single use.", "tags":["healing recovery"]}, "eviolite":{"text":"If holder's species can evolve, its Defense and Sp. Def are 1.5x.", "tags":["defense defensive boost", "evolution"]}, "excadrite":{"text":"If held by an Excadrill, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "expertbelt":{"text":"Holder's attacks that are super effective against the target do 1.2x damage.", "tags":[]}, "fairiumz":{"text":"Once per battle, converts a damaging Fairy-type move into Twinkle Tackle, or gives a Fairy-type status move its Z-effect.", "tags":[]}, "fairyfeather":{"text":"Holder's Fairy-type attacks have 1.2x power.", "tags":[]}, "fairygem":{"text":"Holder's first successful Fairy-type attack will have 1.3x power. Single use.", "tags":[]}, "fairymemory":{"text":"Holder's Multi-Attack is Fairy type. RKS System gives Invigorate and Friend Guard.", "tags":[]}, "falinksite":{"text":"If held by a Falinks, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "fastball":{"text":"A Poke Ball that makes it easier to catch Pokemon which are quick to run away.", "tags":[]}, "feraligite":{"text":"If held by a Feraligatr, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "fightinggem":{"text":"Holder's first successful Fighting-type attack will have 1.3x power. Single use.", "tags":[]}, "fightingmemory":{"text":"Holder's Multi-Attack is Fighting type. RKS System gives Inner Focus and Sheer Force.", "tags":[]}, "fightiniumz":{"text":"Once per battle, converts a damaging Fighting-type move into All-Out Pummeling, or gives a Fighting-type status move its Z-effect.", "tags":[]}, "figyberry":{"text":"Restores 1/2 max HP at 1/4 max HP or less; confuses if -Atk Nature. Single use.", "tags":["healing recovery", "low HP pinch healing"], "threshold":0.25}, "firegem":{"text":"Holder's first successful Fire-type attack will have 1.3x power. Single use.", "tags":[]}, "firememory":{"text":"Holder's Multi-Attack is Fire type. RKS System gives Soul Fire and Flame Body.", "tags":[]}, "firestone":{"text":"Evolves Vulpix into Ninetales, Growlithe into Arcanine, Eevee into Flareon, and Pansear into Simisear when used.", "tags":["evolution"]}, "firiumz":{"text":"Once per battle, converts a damaging Fire-type move into Inferno Overdrive, or gives a Fire-type status move its Z-effect.", "tags":[]}, "fistplate":{"text":"Holder's Fighting-type attacks have 1.2x power. Judgment is Fighting type.", "tags":[]}, "flameorb":{"text":"At the end of every turn, this item attempts to burn the holder.", "tags":[]}, "flameplate":{"text":"Holder's Fire-type attacks have 1.2x power. Judgment is Fire type.", "tags":[]}, "floatstone":{"text":"Holder's weight is halved.", "tags":[]}, "floettite":{"text":"If held by an Eternal Flower Floette, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "flowersweet":{"text":"Evolves Milcery into Alcremie when held and spun around.", "tags":["evolution"]}, "flyinggem":{"text":"Holder's first successful Flying-type attack will have 1.3x power. Single use.", "tags":[]}, "flyingmemory":{"text":"Holder's Multi-Attack is Flying type. RKS System gives Gale Wings and Air Lock.", "tags":[]}, "flygonite":{"text":"Allows Flygon to Mega Evolve into Flygon-Mega or Flygon-Mega-Z.", "tags":["mega evolution transformation", "evolution"]}, "flyiniumz":{"text":"Once per battle, converts a damaging Flying-type move into Supersonic Skystrike, or gives a Flying-type status move its Z-effect.", "tags":[]}, "focusband":{"text":"Holder has a 10% chance to survive an attack that would KO it with 1 HP.", "tags":[]}, "focussash":{"text":"If holder's HP is full, will survive an attack that would KO it with 1 HP. Single use.", "tags":[]}, "fossilizedbird":{"text":"Can revive into Dracozolt with Fossilized Drake or Arctozolt with Fossilized Dino.", "tags":[]}, "fossilizeddino":{"text":"Can revive into Arctovish with Fossilized Fish or Arctozolt with Fossilized Bird.", "tags":[]}, "fossilizeddrake":{"text":"Can revive into Dracozolt with Fossilized Bird or Dracovish with Fossilized Fish.", "tags":[]}, "fossilizedfish":{"text":"Can revive into Dracovish with Fossilized Drake or Arctovish with Fossilized Dino.", "tags":[]}, "friendball":{"text":"A Poke Ball that makes caught Pokemon more friendly.", "tags":[]}, "froslassite":{"text":"If held by a Froslass, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "fullincense":{"text":"Holder moves last in its priority bracket.", "tags":[]}, "galaricacuff":{"text":"Evolves Galarian Slowpoke into Galarian Slowbro when used.", "tags":["evolution"]}, "galaricawreath":{"text":"Evolves Galarian Slowpoke into Galarian Slowking when used.", "tags":["evolution"]}, "galladite":{"text":"If held by a Gallade, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "ganlonberry":{"text":"Raises holder's Defense by 1 stage when at 1/4 max HP or less. Single use.", "tags":["low HP pinch stat boost", "offense offensive boost"], "threshold":0.25}, "garchompite":{"text":"If held by a Garchomp, this item allows it to Mega Evolve into Mega Garchomp.", "tags":["mega evolution transformation", "evolution"]}, "garchompitez":{"text":"If held by a Garchomp, this item allows it to Mega Evolve into Mega Garchomp Z.", "tags":["mega evolution transformation", "evolution"]}, "gardevoirite":{"text":"If held by a Gardevoir, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "gengarite":{"text":"If held by a Gengar, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "ghostgem":{"text":"Holder's first successful Ghost-type attack will have 1.3x power. Single use.", "tags":[]}, "ghostiumz":{"text":"Once per battle, converts a damaging Ghost-type move into Never-Ending Nightmare, or gives a Ghost-type status move its Z-effect.", "tags":[]}, "ghostmemory":{"text":"Holder's Multi-Attack is Ghost type. RKS System gives Soul Fire and Cursed Body.", "tags":[]}, "glalitite":{"text":"If held by a Glalie, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "glimmoranite":{"text":"If held by a Glimmora, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "goldbottlecap":{"text":"Used for Hyper Training. All of a Pokemon's stats are calculated with an IV of 31.", "tags":[]}, "golisopite":{"text":"Allows Golisopod or Golisopod-Aevian to Mega Evolve into its own Mega form.", "tags":["mega evolution transformation", "evolution"]}, "megagolisopite":{"text":"If held by a regular Golisopod, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "golurkite":{"text":"If held by a Golurk, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "grassgem":{"text":"Holder's first successful Grass-type attack will have 1.3x power. Single use.", "tags":[]}, "grassiumz":{"text":"Once per battle, converts a damaging Grass-type move into Bloom Doom, or gives a Grass-type status move its Z-effect.", "tags":[]}, "grassmemory":{"text":"Holder's Multi-Attack is Grass type. RKS System gives Hospitality and Chlorophyll.", "tags":[]}, "greatball":{"text":"A high-performance Ball that provides a higher catch rate than a Poke Ball.", "tags":[]}, "greninjite":{"text":"If held by a Greninja, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "gripclaw":{"text":"Holder's partial-trapping moves always last 7 turns.", "tags":[]}, "griseouscore":{"text":"If held by a Giratina, its Ghost- and Dragon-type attacks have 1.2x power.", "tags":[]}, "griseousorb":{"text":"If held by a Giratina, its Ghost- and Dragon-type attacks have 1.2x power.", "tags":[]}, "groundgem":{"text":"Holder's first successful Ground-type attack will have 1.3x power. Single use.", "tags":[]}, "groundiumz":{"text":"Once per battle, converts a damaging Ground-type move into Tectonic Rage, or gives a Ground-type status move its Z-effect.", "tags":[]}, "groundmemory":{"text":"Holder's Multi-Attack is Ground type. RKS System gives Sand Rush and Stamina.", "tags":[]}, "gyaradosite":{"text":"If held by a Gyarados, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "habanberry":{"text":"Halves damage taken from a supereffective Dragon-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "hardstone":{"text":"Holder's Rock-type attacks have 1.2x power.", "tags":[]}, "hawluchanite":{"text":"If held by a Hawlucha, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "healball":{"text":"A remedial Poke Ball that restores the caught Pokemon's HP and status problem.", "tags":[]}, "hearthflamemask":{"text":"Ogerpon-Hearthflame: 1.2x power attacks; Terastallize to gain Embody Aspect.", "tags":[]}, "heatranite":{"text":"If held by a Heatran, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "heatrock":{"text":"Holder's use of Sunny Day lasts 8 turns instead of 5.", "tags":[]}, "heavyball":{"text":"A Poke Ball for catching very heavy Pokemon.", "tags":[]}, "heavydutyboots":{"text":"When switching in, the holder is unaffected by hazards on its side of the field.", "tags":[]}, "helixfossil":{"text":"Can be revived into Omanyte.", "tags":[]}, "heracronite":{"text":"If held by a Heracross, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "houndoominite":{"text":"If held by a Houndoom, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "iapapaberry":{"text":"Restores 1/2 max HP at 1/4 max HP or less; confuses if -Def Nature. Single use.", "tags":["healing recovery", "low HP pinch healing"], "threshold":0.25}, "icegem":{"text":"Holder's first successful Ice-type attack will have 1.3x power. Single use.", "tags":[]}, "icememory":{"text":"Holder's Multi-Attack is Ice type. RKS System gives Ice Body and Slush Rush.", "tags":[]}, "icestone":{"text":"Evolves Alolan Sandshrew into Alolan Sandslash, Alolan Vulpix into Alolan Ninetales, Eevee into Glaceon, and Galarian Darumaka into Galarian Darmanitan when used.", "tags":["evolution"]}, "icicleplate":{"text":"Holder's Ice-type attacks have 1.2x power. Judgment is Ice type.", "tags":[]}, "iciumz":{"text":"Once per battle, converts a damaging Ice-type move into Subzero Slammer, or gives a Ice-type status move its Z-effect.", "tags":[]}, "icyrock":{"text":"Holder's use of Snowscape lasts 8 turns instead of 5.", "tags":[]}, "inciniumz":{"text":"Incineroar with Darkest Lariat can use Malicious Moonsault once per battle.", "tags":[]}, "insectplate":{"text":"Holder's Bug-type attacks have 1.2x power. Judgment is Bug type.", "tags":[]}, "ironball":{"text":"Holder is grounded, Speed halved. If Flying type, takes neutral Ground damage.", "tags":[]}, "ironplate":{"text":"Holder's Steel-type attacks have 1.2x power. Judgment is Steel type.", "tags":[]}, "jabocaberry":{"text":"If holder is hit by a physical move, attacker loses 1/8 of its max HP. Single use.", "tags":[]}, "jawfossil":{"text":"Can be revived into Tyrunt.", "tags":[]}, "kangaskhanite":{"text":"If held by a Kangaskhan, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "kasibberry":{"text":"Halves damage taken from a supereffective Ghost-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "kebiaberry":{"text":"Halves damage taken from a supereffective Poison-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "keeberry":{"text":"Raises holder's Defense by 1 stage after it is hit by a physical attack. Single use.", "tags":["offense offensive boost"]}, "kingsrock":{"text":"Holder's attacks without a chance to make the target flinch gain a 10% chance to make the target flinch. Evolves Poliwhirl into Politoed and Slowpoke into Slowking when traded.", "tags":["evolution"]}, "kommoniumz":{"text":"Kommo-o with Clanging Scales can use Clangorous Soulblaze once per battle.", "tags":[]}, "laggingtail":{"text":"Holder moves last in its priority bracket.", "tags":[]}, "lansatberry":{"text":"Holder gains the Focus Energy effect when at 1/4 max HP or less. Single use.", "tags":["low HP pinch stat boost"], "threshold":0.25}, "latiasite":{"text":"If held by a Latias, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "latiosite":{"text":"If held by a Latios, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "laxincense":{"text":"The accuracy of attacks against the holder is 0.9x.", "tags":[]}, "leafstone":{"text":"Evolves Gloom into Vileplume, Weepinbell into Victreebel, Exeggcute into Exeggutor or Alolan Exeggutor, Eevee into Leafeon, Nuzleaf into Shiftry, and Pansage into Simisage when used.", "tags":["evolution"]}, "leek":{"text":"If held by a Farfetch’d or Sirfetch’d, its critical hit ratio is raised by 2 stages.", "tags":[]}, "leftovers":{"text":"At the end of every turn, holder restores 1/16 of its max HP.", "tags":["healing recovery"]}, "leppaberry":{"text":"Restores 10 PP to the first of the holder's moves to reach 0 PP. Single use.", "tags":[]}, "levelball":{"text":"A Poke Ball for catching Pokemon that are a lower level than your own.", "tags":[]}, "liechiberry":{"text":"Raises holder's Attack by 1 stage when at 1/4 max HP or less. Single use.", "tags":["low HP pinch stat boost", "offense offensive boost"], "threshold":0.25}, "lifeorb":{"text":"Holder's attacks do 1.3x damage, and it loses 1/10 its max HP after the attack.", "tags":[]}, "lightball":{"text":"Pikachu forms: Atk/SpA 2x, Def/SpD 1.5x; heals 1/16 each turn.", "tags":["healing recovery", "offense offensive boost", "defense defensive boost"]}, "lightclay":{"text":"Holder's use of Aurora Veil, Light Screen, or Reflect lasts 8 turns instead of 5.", "tags":[]}, "loadeddice":{"text":"The holder's multi-hit moves hit 5 or 6 times when possible. If the first hit is successful, the holder's use of Triple Kick or Triple Axel hits 3 times.", "tags":[]}, "lopunnite":{"text":"If held by a Lopunny, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "loveball":{"text":"Poke Ball for catching Pokemon that are the opposite gender of your Pokemon.", "tags":[]}, "lovesweet":{"text":"Evolves Milcery into Alcremie when held and spun around.", "tags":["evolution"]}, "lucarionite":{"text":"If held by a Lucario, this item allows it to Mega Evolve into Mega Lucario in battle.", "tags":["mega evolution transformation", "evolution"]}, "lucarionitez":{"text":"If held by a Lucario, this item allows it to Mega Evolve into Mega Lucario Z in battle.", "tags":["mega evolution transformation", "evolution"]}, "luckypunch":{"text":"If held by a Chansey, its critical hit ratio is raised by 2 stages.", "tags":[]}, "lumberry":{"text":"Holder cures itself if it has a non-volatile status or is confused. Single use.", "tags":["status cure"]}, "luminousmoss":{"text":"Raises holder's Sp. Def by 1 stage if hit by a Water-type attack. Single use.", "tags":[]}, "lunaliumz":{"text":"Lunala or Dawn Wings Necrozma with Moongeist Beam can use Menacing Moonraze Maelstrom once per battle.", "tags":[]}, "lureball":{"text":"A Poke Ball for catching Pokemon hooked by a Rod when fishing.", "tags":[]}, "lustrousglobe":{"text":"If held by a Palkia, its Water- and Dragon-type attacks have 1.2x power.", "tags":[]}, "lustrousorb":{"text":"If held by a Palkia, its Water- and Dragon-type attacks have 1.2x power.", "tags":[]}, "luxuryball":{"text":"A comfortable Poke Ball that makes a caught wild Pokemon quickly grow friendly.", "tags":[]}, "lycaniumz":{"text":"Any Lycanroc form with Stone Edge can use Splintered Stormshards once per battle.", "tags":[]}, "machobrace":{"text":"Holder's Speed is halved. The Klutz Ability does not ignore this effect.", "tags":[]}, "magicalseed":{"text":"If the terrain is a Magical Terrain, boosts the holder in a unique way. Single use.", "tags":["offense offensive boost"]}, "magearnite":{"text":"If held by a Magearna, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "magmarizer":{"text":"Evolves Magmar into Magmortar when traded.", "tags":["evolution"]}, "magnet":{"text":"Holder's Electric-type attacks have 1.2x power.", "tags":[]}, "magoberry":{"text":"Restores 1/2 max HP at 1/4 max HP or less; confuses if -Spe Nature. Single use.", "tags":["healing recovery", "low HP pinch healing"], "threshold":0.25}, "mail":{"text":"Cannot be given to or taken from a Pokemon, except by Covet/Knock Off/Thief.", "tags":[]}, "malamarite":{"text":"If held by a Malamar, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "maliciousarmor":{"text":"Evolves Charcadet into Ceruledge when used.", "tags":["evolution"]}, "manectite":{"text":"If held by a Manectric, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "marangaberry":{"text":"Raises holder's Sp. Def by 1 stage after it is hit by a special attack. Single use.", "tags":["offense offensive boost"]}, "marshadiumz":{"text":"Marshadow with Spectral Thief can use Soul-Stealing 7-Star Strike once per battle.", "tags":[]}, "masterball":{"text":"The best Ball with the ultimate performance. It will catch any wild Pokemon.", "tags":[]}, "masterpieceteacup":{"text":"Evolves Poltchageist-Artisan into Sinistcha-Masterpiece when used.", "tags":["evolution"]}, "mawilite":{"text":"If held by a Mawile, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "meadowplate":{"text":"Holder's Grass-type attacks have 1.2x power. Judgment is Grass type.", "tags":[]}, "medichamite":{"text":"If held by a Medicham, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "meganiumite":{"text":"If held by a Meganium, this item allows it to Mega Evolve into either Meganium-Mega or Meganium-Mega-Y in battle.", "tags":["mega evolution transformation", "evolution"]}, "mentalherb":{"text":"Cures holder of Attract, Disable, Encore, Heal Block, Taunt, Torment. Single use.", "tags":[]}, "meowsticite":{"text":"If held by a Meowstic, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "reuniclusite":{"text":"Allows Reuniclus to Mega Evolve into Mega Reuniclus in battle.", "tags":["mega evolution transformation", "evolution"]}, "metagrossite":{"text":"If held by a Metagross, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "metalalloy":{"text":"Evolves Duraludon into Archaludon when used.", "tags":["evolution"]}, "metalcoat":{"text":"Holder's Steel-type attacks have 1.2x power. Evolves Onix into Steelix and Scyther into Scizor when traded.", "tags":["evolution"]}, "metalpowder":{"text":"If held by a Ditto that hasn't Transformed, its Defense is doubled.", "tags":["defense defensive boost"]}, "metronome":{"text":"Damage of moves used on consecutive turns is increased. Max 2x after 5 turns.", "tags":[]}, "mewniumz":{"text":"Mew with Psychic can use Genesis Supernova once per battle.", "tags":[]}, "mewtwonitex":{"text":"If held by a Mewtwo, this item allows it to Mega Evolve into Mega Mewtwo X in battle.", "tags":["mega evolution transformation", "evolution"]}, "mewtwonitey":{"text":"If held by a Mewtwo, this item allows it to Mega Evolve into Mega Mewtwo Y in battle.", "tags":["mega evolution transformation", "evolution"]}, "micleberry":{"text":"Holder's next move has 1.2x accuracy when at 1/4 max HP or less. Single use.", "tags":[]}, "mimikiumz":{"text":"Mimikyu with Play Rough can use Let's Snuggle Forever once per battle.", "tags":[]}, "mindplate":{"text":"Holder's Psychic-type attacks have 1.2x power. Judgment is Psychic type.", "tags":[]}, "miracleseed":{"text":"Holder's Grass-type attacks have 1.2x power.", "tags":[]}, "mirrorherb":{"text":"When an opposing Pokemon raises a stat stage, the holder copies it. Single use.", "tags":["offense offensive boost"]}, "moonball":{"text":"A Poke Ball for catching Pokemon that evolve using the Moon Stone.", "tags":["evolution"]}, "moonstone":{"text":"Evolves Nidorina into Nidoqueen, Nidorino into Nidoking, Clefairy into Clefable, Jigglypuff into Wigglytuff, Skitty into Delcatty, and Munna into Musharna when used.", "tags":["evolution"]}, "muscleband":{"text":"Holder's physical attacks have 1.1x power.", "tags":[]}, "mysticwater":{"text":"Holder's Water-type attacks have 1.2x power.", "tags":[]}, "nestball":{"text":"A Poke Ball that works especially well on weaker Pokemon in the wild.", "tags":[]}, "netball":{"text":"A Poke Ball that works especially well on Water- and Bug-type Pokemon.", "tags":[]}, "nevermeltice":{"text":"Holder's Ice-type attacks have 1.2x power.", "tags":[]}, "normalgem":{"text":"Holder's first successful Normal-type attack will have 1.3x power. Single use.", "tags":[]}, "normaliumz":{"text":"Once per battle, converts a damaging Normal-type move into Breakneck Blitz, or gives a Normal-type status move its Z-effect.", "tags":[]}, "occaberry":{"text":"Halves damage taken from a supereffective Fire-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "oddincense":{"text":"Holder's Psychic-type attacks have 1.2x power.", "tags":[]}, "oldamber":{"text":"Can be revived into Aerodactyl.", "tags":[]}, "oranberry":{"text":"Restores 10 HP when at 1/2 max HP or less. Single use.", "tags":["healing recovery", "low HP pinch healing"], "threshold":0.5}, "ovalstone":{"text":"Evolves Happiny into Chansey when held and leveled up during the day.", "tags":["evolution"]}, "parkball":{"text":"A special Poke Ball for the Pal Park.", "tags":[]}, "passhoberry":{"text":"Halves damage taken from a supereffective Water-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "payapaberry":{"text":"Halves damage taken from a supereffective Psychic-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "pechaberry":{"text":"Holder is cured if it is poisoned. Single use.", "tags":["status cure"]}, "persimberry":{"text":"Holder is cured if it is confused. Single use.", "tags":["status cure"]}, "petayaberry":{"text":"Raises holder's Sp. Atk by 1 stage when at 1/4 max HP or less. Single use.", "tags":["low HP pinch stat boost", "offense offensive boost"], "threshold":0.25}, "pidgeotite":{"text":"If held by a Pidgeot, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "pikaniumz":{"text":"Pikachu with Volt Tackle can use Catastropika once per battle.", "tags":["defense defensive boost"]}, "pikashuniumz":{"text":"Cap Pikachu with Thunderbolt can use 10,000,000 Volt Thunderbolt once per battle.", "tags":[]}, "pinsirite":{"text":"If held by a Pinsir, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "pixieplate":{"text":"Holder's Fairy-type attacks have 1.2x power. Judgment is Fairy type.", "tags":[]}, "plumefossil":{"text":"Can be revived into Archen.", "tags":[]}, "poisonbarb":{"text":"Holder's Poison-type attacks have 1.2x power.", "tags":[]}, "poisongem":{"text":"Holder's first successful Poison-type attack will have 1.3x power. Single use.", "tags":[]}, "poisoniumz":{"text":"Once per battle, converts a damaging Poison-type move into Acid Downpour, or gives a Poison-type status move its Z-effect.", "tags":[]}, "poisonmemory":{"text":"Holder's Multi-Attack is Poison type. RKS System gives Regenerator and Corrosion.", "tags":[]}, "pokeball":{"text":"A device for catching wild Pokemon. It is designed as a capsule system.", "tags":[]}, "poweranklet":{"text":"Holder's Speed is halved. The Klutz Ability does not ignore this effect.", "tags":[]}, "powerband":{"text":"Holder's Speed is halved. The Klutz Ability does not ignore this effect.", "tags":[]}, "powerbelt":{"text":"Holder's Speed is halved. The Klutz Ability does not ignore this effect.", "tags":[]}, "powerbracer":{"text":"Holder's Speed is halved. The Klutz Ability does not ignore this effect.", "tags":[]}, "powerherb":{"text":"Holder's two-turn moves complete in one turn (except Sky Drop). Single use.", "tags":[]}, "powerlens":{"text":"Holder's Speed is halved. The Klutz Ability does not ignore this effect.", "tags":[]}, "powerweight":{"text":"Holder's Speed is halved. The Klutz Ability does not ignore this effect.", "tags":[]}, "premierball":{"text":"A rare Poke Ball that has been crafted to commemorate an event.", "tags":[]}, "prettyfeather":{"text":"Though this feather is beautiful, it's just a regular feather and has no effect.", "tags":[]}, "primariumz":{"text":"Primarina with Sparkling Aria can use Oceanic Operetta once per battle.", "tags":[]}, "prismscale":{"text":"Evolves Feebas into Milotic when traded.", "tags":["evolution"]}, "protectivepads":{"text":"Holder's moves are protected from adverse contact effects, except Pickpocket.", "tags":[]}, "protector":{"text":"Evolves Rhydon into Rhyperior when traded.", "tags":["evolution"]}, "psychicgem":{"text":"Holder's first successful Psychic-type attack will have 1.3x power. Single use.", "tags":[]}, "psychicmemory":{"text":"Holder's Multi-Attack is Psychic type. RKS System gives Magic Bounce and Magic Guard.", "tags":[]}, "psychiumz":{"text":"Once per battle, converts a damaging Psychic-type move into Shattered Psyche, or gives a Psychic-type status move its Z-effect.", "tags":[]}, "punchingglove":{"text":"Holder's punch-based attacks have 1.4x power and do not make contact.", "tags":[]}, "pyroarite":{"text":"If held by a Pyroar, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "quickball":{"text":"A Poke Ball that provides a better catch rate at the start of a wild encounter.", "tags":[]}, "quickclaw":{"text":"Each turn, holder has a 20% chance to move first in its priority bracket.", "tags":[]}, "quickpowder":{"text":"If held by a Ditto that hasn't Transformed, its Speed is doubled.", "tags":[]}, "raichunitex":{"text":"If held by a Raichu, this item allows it to Mega Evolve into Mega Raichu X in battle.", "tags":["mega evolution transformation", "evolution"]}, "raichunitey":{"text":"If held by a Raichu, this item allows it to Mega Evolve into Mega Raichu Y in battle.", "tags":["mega evolution transformation", "evolution"]}, "rarebone":{"text":"No competitive use other than when used with Fling.", "tags":[]}, "rawstberry":{"text":"Holder is cured if it is burned. Single use.", "tags":["status cure"]}, "razorclaw":{"text":"Holder's critical hit ratio is raised by 1 stage. Evolves Sneasel into Weavile when held and leveled up during the night.", "tags":["evolution"]}, "razorfang":{"text":"Holder's attacks without a chance to make the target flinch gain a 10% chance to make the target flinch. Evolves Gligar into Gliscor when held and leveled up during the night.", "tags":["evolution"]}, "reapercloth":{"text":"Evolves Dusclops into Dusknoir when traded.", "tags":["evolution"]}, "redcard":{"text":"If holder survives a hit, attacker is forced to switch to a random ally. Single use.", "tags":[]}, "redorb":{"text":"If held by a Groudon, this item triggers its Primal Reversion in battle.", "tags":[]}, "repeatball":{"text":"A Poke Ball that works well on Pokemon species that were previously caught.", "tags":[]}, "ribbonsweet":{"text":"Evolves Milcery into Alcremie when held and spun around.", "tags":["evolution"]}, "rindoberry":{"text":"Halves damage taken from a supereffective Grass-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "ringtarget":{"text":"The holder's type immunities granted solely by its typing are negated.", "tags":[]}, "rockgem":{"text":"Holder's first successful Rock-type attack will have 1.3x power. Single use.", "tags":[]}, "rockincense":{"text":"Holder's Rock-type attacks have 1.2x power.", "tags":[]}, "rockiumz":{"text":"Once per battle, converts a damaging Rock-type move into Continental Crush, or gives a Rock-type status move its Z-effect.", "tags":[]}, "rockmemory":{"text":"Holder's Multi-Attack is Rock type. RKS System gives Purifying Salt and Solid Rock.", "tags":[]}, "rockyhelmet":{"text":"If holder is hit by a contact move, the attacker loses 1/6 of its max HP.", "tags":[]}, "roomservice":{"text":"If Trick Room is active, the holder's Speed is lowered by 1 stage. Single use.", "tags":[]}, "rootfossil":{"text":"Can be revived into Lileep.", "tags":[]}, "roseincense":{"text":"Holder's Grass-type attacks have 1.2x power.", "tags":[]}, "roseliberry":{"text":"Halves damage taken from a supereffective Fairy-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "roseradite":{"text":"", "tags":["mega evolution transformation"]}, "rowapberry":{"text":"If holder is hit by a special move, attacker loses 1/8 of its max HP. Single use.", "tags":[]}, "rustedshield":{"text":"If held by a Zamazenta, this item changes its forme to Crowned Shield.", "tags":[]}, "rustedsword":{"text":"If held by a Zacian, this item changes its forme to Crowned Sword.", "tags":[]}, "sablenite":{"text":"If held by a Sableye, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "sachet":{"text":"Evolves Spritzee into Aromatisse when traded.", "tags":["evolution"]}, "safariball":{"text":"A special Poke Ball that is used only in the Safari Zone and Great Marsh.", "tags":[]}, "safetygoggles":{"text":"Holder is immune to powder moves and damage from Sandstorm or Hail.", "tags":[]}, "sailfossil":{"text":"Can be revived into Amaura.", "tags":[]}, "salacberry":{"text":"Raises holder's Speed by 1 stage when at 1/4 max HP or less. Single use.", "tags":["low HP pinch stat boost", "offense offensive boost"], "threshold":0.25}, "salamencite":{"text":"If held by a Salamence, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "sceptilite":{"text":"If held by a Sceptile, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "scizorite":{"text":"If held by a Scizor, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "scolipite":{"text":"If held by a Scolipede, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "scopelens":{"text":"Holder's critical hit ratio is raised by 1 stage.", "tags":[]}, "scovillainite":{"text":"If held by a Scovillain, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "scraftinite":{"text":"If held by a Scrafty, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "seaincense":{"text":"Holder's Water-type attacks have 1.2x power.", "tags":[]}, "sharpbeak":{"text":"Holder's Flying-type attacks have 1.2x power.", "tags":[]}, "bronzongite":{"text":"Allows Bronzong to Mega Evolve into Mega Bronzong.", "tags":["mega evolution transformation", "evolution"]}, "noivernite":{"text":"Allows Noivern to Mega Evolve into Mega Noivern.", "tags":["mega evolution transformation", "evolution"]}, "weavilite":{"text":"Allows Weavile to Mega Evolve into Mega Weavile.", "tags":["mega evolution transformation", "evolution"]}, "dusknoirite":{"text":"Allows Dusknoir to Mega Evolve into Mega Dusknoir.", "tags":["mega evolution transformation", "evolution"]}, "noctowlite":{"text":"Allows Noctowl to Mega Evolve into Mega Noctowl.", "tags":["mega evolution transformation", "evolution"]}, "luxranite":{"text":"Allows Luxray to Mega Evolve into Mega Luxray.", "tags":["mega evolution transformation", "evolution"]}, "breloomite":{"text":"Allows Breloom and Breloom-Rejuv to Mega Evolve into Mega Breloom.", "tags":["mega evolution transformation", "evolution"]}, "sharpedonite":{"text":"If held by a Sharpedo, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "shedshell":{"text":"Holder cannot be prevented from choosing to switch out by any effect.", "tags":[]}, "shellbell":{"text":"After an attack, holder gains 1/8 of the damage in HP dealt to other Pokemon.", "tags":["healing recovery"]}, "shinystone":{"text":"Evolves Togetic into Togekiss, Roselia into Roserade, Minccino into Cinccino, and Floette into Florges when used.", "tags":["mega evolution transformation", "evolution"]}, "shockdrive":{"text":"Holder's Techno Blast is Electric type.", "tags":[]}, "shucaberry":{"text":"Halves damage taken from a supereffective Ground-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "silkscarf":{"text":"Holder's Normal-type attacks have 1.2x power.", "tags":[]}, "silverpowder":{"text":"Holder's Bug-type attacks have 1.2x power.", "tags":[]}, "sitrusberry":{"text":"Restores 1/4 max HP when at 1/2 max HP or less. Single use.", "tags":["healing recovery", "low HP pinch healing"], "threshold":0.5}, "skarmorite":{"text":"If held by a Skarmory, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "skullfossil":{"text":"Can be revived into Cranidos.", "tags":[]}, "skyplate":{"text":"Holder's Flying-type attacks have 1.2x power. Judgment is Flying type.", "tags":[]}, "slowbronite":{"text":"If held by a Slowbro, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "smoothrock":{"text":"Holder's use of Sandstorm lasts 8 turns instead of 5.", "tags":[]}, "snorliumz":{"text":"Snorlax with Giga Impact can use Pulverizing Pancake once per battle.", "tags":[]}, "snowball":{"text":"Raises holder's Attack by 1 if hit by an Ice-type attack. Single use.", "tags":[]}, "softsand":{"text":"Holder's Ground-type attacks have 1.2x power.", "tags":[]}, "solganiumz":{"text":"Solgaleo or Dusk Mane Necrozma with Sunsteel Strike can use Searing Sunraze Smash once per battle.", "tags":[]}, "souldew":{"text":"If held by a Latias/Latios, its Dragon- and Psychic-type moves have 1.2x power.", "tags":[]}, "spelltag":{"text":"Holder's Ghost-type attacks have 1.2x power.", "tags":[]}, "splashplate":{"text":"Holder's Water-type attacks have 1.2x power. Judgment is Water type.", "tags":[]}, "spookyplate":{"text":"Holder's Ghost-type attacks have 1.2x power. Judgment is Ghost type.", "tags":[]}, "sportball":{"text":"A special Poke Ball for the Bug-Catching Contest.", "tags":[]}, "staraptite":{"text":"If held by a Staraptor, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "starfberry":{"text":"Raises a random stat by 2 when at 1/4 max HP or less (not acc/eva). Single use.", "tags":["low HP pinch stat boost", "offense offensive boost"], "threshold":0.25}, "starminite":{"text":"If held by a Starmie, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "amuletcoin":{"text":"In Dragon's Den, the holder cannot be afflicted with a status condition.", "tags":[]}, "steelgem":{"text":"Holder's first successful Steel-type attack will have 1.3x power. Single use.", "tags":[]}, "steeliumz":{"text":"Once per battle, converts a damaging Steel-type move into Corkscrew Crash, or gives a Steel-type status move its Z-effect.", "tags":[]}, "steelixite":{"text":"If held by a Steelix, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "steelmemory":{"text":"Holder's Multi-Attack is Steel type. RKS System gives Sworn Duty and Mirror Armor.", "tags":[]}, "stick":{"text":"If held by a Farfetch’d, its critical hit ratio is raised by 2 stages.", "tags":[]}, "stickybarb":{"text":"Each turn, holder loses 1/8 max HP. An attacker making contact can receive it.", "tags":[]}, "stoneplate":{"text":"Holder's Rock-type attacks have 1.2x power. Judgment is Rock type.", "tags":[]}, "strangeball":{"text":"Placeholder if caught in Poke Ball not in current game.", "tags":[]}, "strawberrysweet":{"text":"Evolves Milcery into Alcremie when held and spun around.", "tags":["evolution"]}, "sunstone":{"text":"Evolves Gloom into Bellossom, Sunkern into Sunflora, Cottonee into Whimsicott, Petilil into Lilligant, and Helioptile into Heliolisk when used.", "tags":["evolution"]}, "swampertite":{"text":"If held by a Swampert, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "sweetapple":{"text":"Evolves Applin into Appletun when used.", "tags":["evolution"]}, "syntheticseed":{"text":"If the terrain is a Synthetic Terrain, boosts the holder in a unique way. Single use.", "tags":["offense offensive boost"]}, "syrupyapple":{"text":"Evolves Applin into Dipplin when used.", "tags":["evolution"]}, "tangaberry":{"text":"Halves damage taken from a supereffective Bug-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "tapuniumz":{"text":"A Tapu with Nature's Madness can use Guardian of Alola once per battle.", "tags":[]}, "tartapple":{"text":"Evolves Applin into Flapple when used.", "tags":["evolution"]}, "tatsugirinite":{"text":"If held by a Tatsugiri, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "telluricseed":{"text":"If the terrain is a Telluric Terrain, boosts the holder in a unique way. Single use.", "tags":["offense offensive boost"]}, "thickclub":{"text":"If held by a Cubone or a Marowak, its Attack is doubled.", "tags":["offense offensive boost"]}, "throatspray":{"text":"Raises holder's Special Attack by 1 stage after it uses a sound move. Single use.", "tags":[]}, "thunderstone":{"text":"Evolves Pikachu into Raichu or Alolan Raichu, Eevee into Jolteon, Eelektrik into Eelektross, and Charjabug into Vikavolt when used.", "tags":["mega evolution transformation", "evolution"]}, "timerball":{"text":"A Poke Ball that becomes better the more turns there are in a battle.", "tags":[]}, "toxicorb":{"text":"At the end of every turn, this item attempts to badly poison the holder.", "tags":[]}, "toxicplate":{"text":"Holder's Poison-type attacks have 1.2x power. Judgment is Poison type.", "tags":[]}, "tr00":{"text":"Teaches certain Pokemon the move Swords Dance. One use.", "tags":[]}, "tr01":{"text":"Teaches certain Pokemon the move Body Slam. One use.", "tags":[]}, "tr02":{"text":"Teaches certain Pokemon the move Flamethrower. One use.", "tags":[]}, "tr03":{"text":"Teaches certain Pokemon the move Hydro Pump. One use.", "tags":[]}, "tr04":{"text":"Teaches certain Pokemon the move Surf. One use.", "tags":[]}, "tr05":{"text":"Teaches certain Pokemon the move Ice Beam. One use.", "tags":[]}, "tr06":{"text":"Teaches certain Pokemon the move Blizzard. One use.", "tags":[]}, "tr07":{"text":"Teaches certain Pokemon the move Low Kick. One use.", "tags":[]}, "tr08":{"text":"Teaches certain Pokemon the move Thunderbolt. One use.", "tags":[]}, "tr09":{"text":"Teaches certain Pokemon the move Thunder. One use.", "tags":[]}, "tr10":{"text":"Teaches certain Pokemon the move Earthquake. One use.", "tags":[]}, "tr11":{"text":"Teaches certain Pokemon the move Psychic. One use.", "tags":[]}, "tr12":{"text":"Teaches certain Pokemon the move Agility. One use.", "tags":[]}, "tr13":{"text":"Teaches certain Pokemon the move Focus Energy. One use.", "tags":[]}, "tr14":{"text":"Teaches certain Pokemon the move Metronome. One use.", "tags":[]}, "tr15":{"text":"Teaches certain Pokemon the move Fire Blast. One use.", "tags":[]}, "tr16":{"text":"Teaches certain Pokemon the move Waterfall. One use.", "tags":[]}, "tr17":{"text":"Teaches certain Pokemon the move Amnesia. One use.", "tags":[]}, "tr18":{"text":"Teaches certain Pokemon the move Leech Life. One use.", "tags":[]}, "tr19":{"text":"Teaches certain Pokemon the move Tri Attack. One use.", "tags":[]}, "tr20":{"text":"Teaches certain Pokemon the move Substitute. One use.", "tags":[]}, "tr21":{"text":"Teaches certain Pokemon the move Reversal. One use.", "tags":[]}, "tr22":{"text":"Teaches certain Pokemon the move Sludge Bomb. One use.", "tags":[]}, "tr23":{"text":"Teaches certain Pokemon the move Spikes. One use.", "tags":[]}, "tr24":{"text":"Teaches certain Pokemon the move Outrage. One use.", "tags":[]}, "tr25":{"text":"Teaches certain Pokemon the move Psyshock. One use.", "tags":[]}, "tr26":{"text":"Teaches certain Pokemon the move Endure. One use.", "tags":[]}, "tr27":{"text":"Teaches certain Pokemon the move Sleep Talk. One use.", "tags":[]}, "tr28":{"text":"Teaches certain Pokemon the move Megahorn. One use.", "tags":[]}, "tr29":{"text":"Teaches certain Pokemon the move Baton Pass. One use.", "tags":[]}, "tr30":{"text":"Teaches certain Pokemon the move Encore. One use.", "tags":[]}, "tr31":{"text":"Teaches certain Pokemon the move Iron Tail. One use.", "tags":[]}, "tr32":{"text":"Teaches certain Pokemon the move Crunch. One use.", "tags":[]}, "tr33":{"text":"Teaches certain Pokemon the move Shadow Ball. One use.", "tags":[]}, "tr34":{"text":"Teaches certain Pokemon the move Future Sight. One use.", "tags":[]}, "tr35":{"text":"Teaches certain Pokemon the move Uproar. One use.", "tags":[]}, "tr36":{"text":"Teaches certain Pokemon the move Heat Wave. One use.", "tags":[]}, "tr37":{"text":"Teaches certain Pokemon the move Taunt. One use.", "tags":[]}, "tr38":{"text":"Teaches certain Pokemon the move Trick. One use.", "tags":[]}, "tr39":{"text":"Teaches certain Pokemon the move Superpower. One use.", "tags":[]}, "tr40":{"text":"Teaches certain Pokemon the move Skill Swap. One use.", "tags":[]}, "tr41":{"text":"Teaches certain Pokemon the move Blaze Kick. One use.", "tags":[]}, "tr42":{"text":"Teaches certain Pokemon the move Hyper Voice. One use.", "tags":[]}, "tr43":{"text":"Teaches certain Pokemon the move Overheat. One use.", "tags":[]}, "tr44":{"text":"Teaches certain Pokemon the move Cosmic Power. One use.", "tags":[]}, "tr45":{"text":"Teaches certain Pokemon the move Muddy Water. One use.", "tags":[]}, "tr46":{"text":"Teaches certain Pokemon the move Iron Defense. One use.", "tags":[]}, "tr47":{"text":"Teaches certain Pokemon the move Dragon Claw. One use.", "tags":[]}, "tr48":{"text":"Teaches certain Pokemon the move Bulk Up. One use.", "tags":[]}, "tr49":{"text":"Teaches certain Pokemon the move Calm Mind. One use.", "tags":[]}, "tr50":{"text":"Teaches certain Pokemon the move Leaf Blade. One use.", "tags":[]}, "tr51":{"text":"Teaches certain Pokemon the move Dragon Dance. One use.", "tags":[]}, "tr52":{"text":"Teaches certain Pokemon the move Gyro Ball. One use.", "tags":[]}, "tr53":{"text":"Teaches certain Pokemon the move Close Combat. One use.", "tags":[]}, "tr54":{"text":"Teaches certain Pokemon the move Toxic Spikes. One use.", "tags":[]}, "tr55":{"text":"Teaches certain Pokemon the move Flare Blitz. One use.", "tags":[]}, "tr56":{"text":"Teaches certain Pokemon the move Aura Sphere. One use.", "tags":[]}, "tr57":{"text":"Teaches certain Pokemon the move Poison Jab. One use.", "tags":[]}, "tr58":{"text":"Teaches certain Pokemon the move Dark Pulse. One use.", "tags":[]}, "tr59":{"text":"Teaches certain Pokemon the move Seed Bomb. One use.", "tags":[]}, "tr60":{"text":"Teaches certain Pokemon the move X-Scissor. One use.", "tags":[]}, "tr61":{"text":"Teaches certain Pokemon the move Bug Buzz. One use.", "tags":[]}, "tr62":{"text":"Teaches certain Pokemon the move Dragon Pulse. One use.", "tags":[]}, "tr63":{"text":"Teaches certain Pokemon the move Power Gem. One use.", "tags":[]}, "tr64":{"text":"Teaches certain Pokemon the move Focus Blast. One use.", "tags":[]}, "tr65":{"text":"Teaches certain Pokemon the move Energy Ball. One use.", "tags":[]}, "tr66":{"text":"Teaches certain Pokemon the move Brave Bird. One use.", "tags":[]}, "tr67":{"text":"Teaches certain Pokemon the move Earth Power. One use.", "tags":[]}, "tr68":{"text":"Teaches certain Pokemon the move Nasty Plot. One use.", "tags":[]}, "tr69":{"text":"Teaches certain Pokemon the move Zen Headbutt. One use.", "tags":[]}, "tr70":{"text":"Teaches certain Pokemon the move Flash Cannon. One use.", "tags":[]}, "tr71":{"text":"Teaches certain Pokemon the move Leaf Storm. One use.", "tags":[]}, "tr72":{"text":"Teaches certain Pokemon the move Power Whip. One use.", "tags":[]}, "tr73":{"text":"Teaches certain Pokemon the move Gunk Shot. One use.", "tags":[]}, "tr74":{"text":"Teaches certain Pokemon the move Iron Head. One use.", "tags":[]}, "tr75":{"text":"Teaches certain Pokemon the move Stone Edge. One use.", "tags":[]}, "tr76":{"text":"Teaches certain Pokemon the move Stealth Rock. One use.", "tags":[]}, "tr77":{"text":"Teaches certain Pokemon the move Grass Knot. One use.", "tags":[]}, "tr78":{"text":"Teaches certain Pokemon the move Sludge Wave. One use.", "tags":[]}, "tr79":{"text":"Teaches certain Pokemon the move Heavy Slam. One use.", "tags":[]}, "tr80":{"text":"Teaches certain Pokemon the move Electro Ball. One use.", "tags":[]}, "tr81":{"text":"Teaches certain Pokemon the move Foul Play. One use.", "tags":[]}, "tr82":{"text":"Teaches certain Pokemon the move Stored Power. One use.", "tags":[]}, "tr83":{"text":"Teaches certain Pokemon the move Ally Switch. One use.", "tags":[]}, "tr84":{"text":"Teaches certain Pokemon the move Scald. One use.", "tags":[]}, "tr85":{"text":"Teaches certain Pokemon the move Work Up. One use.", "tags":[]}, "tr86":{"text":"Teaches certain Pokemon the move Wild Charge. One use.", "tags":[]}, "tr87":{"text":"Teaches certain Pokemon the move Drill Run. One use.", "tags":[]}, "tr88":{"text":"Teaches certain Pokemon the move Heat Crash. One use.", "tags":[]}, "tr89":{"text":"Teaches certain Pokemon the move Hurricane. One use.", "tags":[]}, "tr90":{"text":"Teaches certain Pokemon the move Play Rough. One use.", "tags":[]}, "tr91":{"text":"Teaches certain Pokemon the move Venom Drench. One use.", "tags":[]}, "tr92":{"text":"Teaches certain Pokemon the move Dazzling Gleam. One use.", "tags":[]}, "tr93":{"text":"Teaches certain Pokemon the move Darkest Lariat. One use.", "tags":[]}, "tr94":{"text":"Teaches certain Pokemon the move High Horsepower. One use.", "tags":[]}, "tr95":{"text":"Teaches certain Pokemon the move Throat Chop. One use.", "tags":[]}, "tr96":{"text":"Teaches certain Pokemon the move Pollen Puff. One use.", "tags":[]}, "tr97":{"text":"Teaches certain Pokemon the move Psychic Fangs. One use.", "tags":[]}, "tr98":{"text":"Teaches certain Pokemon the move Liquidation. One use.", "tags":[]}, "tr99":{"text":"Teaches certain Pokemon the move Body Press. One use.", "tags":[]}, "twistedspoon":{"text":"Holder's Psychic-type attacks have 1.2x power.", "tags":[]}, "tyranitarite":{"text":"If held by a Tyranitar, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "typhlosionite":{"text":"Allows Typhlosion and Typhlosion-Hisui to Mega Evolve.", "tags":["mega evolution transformation", "evolution"]}, "ultraball":{"text":"An ultra-performance Ball that provides a higher catch rate than a Great Ball.", "tags":[]}, "ultranecroziumz":{"text":"Dusk Mane or Dawn Wings Necrozma can Ultra Burst; with Photon Geyser, it can use Light That Burns the Sky once per battle.", "tags":[]}, "unremarkableteacup":{"text":"Evolves Poltchageist into Sinistcha when used.", "tags":["evolution"]}, "upgrade":{"text":"Evolves Porygon into Porygon2 when traded.", "tags":["evolution"]}, "utilityumbrella":{"text":"The holder ignores rain- and sun-based effects, including those of its Ability unless it is Orichalcum Pulse or Protosynthesis. Damage and accuracy calculations from attacks used by the holder are affected by rain and sun, but not attacks used against the holder.", "tags":[]}, "venusaurite":{"text":"If held by a Venusaur, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "victreebelite":{"text":"If held by a Victreebel, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "wacanberry":{"text":"Halves damage taken from a supereffective Electric-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "watergem":{"text":"Holder's first successful Water-type attack will have 1.3x power. Single use.", "tags":[]}, "wateriumz":{"text":"Once per battle, converts a damaging Water-type move into Hydro Vortex, or gives a Water-type status move its Z-effect.", "tags":[]}, "watermemory":{"text":"Holder's Multi-Attack is Water type. RKS System gives Swift Swim and Water Veil.", "tags":[]}, "waterstone":{"text":"Evolves Poliwhirl into Poliwrath, Shellder into Cloyster, Staryu into Starmie, Eevee into Vaporeon, Lombre into Ludicolo, and Panpour into Simipour when used.", "tags":["evolution"]}, "waveincense":{"text":"Holder's Water-type attacks have 1.2x power.", "tags":[]}, "weaknesspolicy":{"text":"If holder is hit super effectively, raises Attack, Sp. Atk by 2 stages. Single use.", "tags":[]}, "wellspringmask":{"text":"Ogerpon-Wellspring: 1.2x power attacks; Terastallize to gain Embody Aspect.", "tags":[]}, "whippeddream":{"text":"Evolves Swirlix into Slurpuff when traded.", "tags":["evolution"]}, "whiteherb":{"text":"Restores all lowered stat stages to 0 when one is less than 0. Single use.", "tags":[]}, "widelens":{"text":"The accuracy of attacks by the holder is 1.1x.", "tags":[]}, "wikiberry":{"text":"Restores 1/2 max HP at 1/4 max HP or less; confuses if -SpA Nature. Single use.", "tags":["healing recovery", "low HP pinch healing"], "threshold":0.25}, "wiseglasses":{"text":"Holder's special attacks have 1.1x power.", "tags":[]}, "yacheberry":{"text":"Halves damage taken from a supereffective Ice-type attack. Single use.", "tags":["resistance resist berry defensive"]}, "zapplate":{"text":"Holder's Electric-type attacks have 1.2x power. Judgment is Electric type.", "tags":[]}, "zeraorite":{"text":"If held by a Zeraora, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "zoomlens":{"text":"The accuracy of attacks by the holder is 1.2x if it moves after its target.", "tags":[]}, "zygardite":{"text":"If held by a Zygarde in Complete Forme, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "pinkbow":{"text":"(Gen 2) Holder's Normal-type attacks have 1.1x power.", "tags":[]}, "polkadotbow":{"text":"(Gen 2) Holder's Normal-type attacks have 1.1x power.", "tags":[]}, "crucibellite":{"text":"If held by a Crucibelle, this item allows it to Mega Evolve in battle.", "tags":["mega evolution transformation", "evolution"]}, "vilevial":{"text":"If held by a Venomicon, its Poison- and Flying-type attacks have 1.2x power.", "tags":[]}};
	T.itemData = function () {
		var value = Storage.prefs('itempickertools') || {};
		return {favorites: (value.favorites || []).slice(), recent: (value.recent || []).slice()};
	};
	T.selectItem = function (data, id) {
		id = T.id(id);
		return {favorites: data.favorites.slice(), recent: [id].concat(data.recent.filter(function (x) { return x !== id; })).slice(0, 24)};
	};
	T.starItem = function (data, id) {
		id = T.id(id);
		var favorites = data.favorites.slice(), index = favorites.indexOf(id);
		if (index >= 0) favorites.splice(index, 1); else favorites.push(id);
		return {favorites: favorites, recent: data.recent.slice()};
	};
	T.itemMatches = function (id, query, dex) {
		var item = dex.items.get(id), meta = T.itemMetadata[id] || {};
		var haystack = [item.name, meta.text || item.desc, meta.tags && meta.tags.join(' ')].join(' ').toLowerCase();
		var aliases = {heal: 'healing', recovery: 'healing', recover: 'healing', restore: 'healing', resist: 'resistance', offensive: 'offense', defensive: 'defense', pinchheal: 'pinch healing', pinchhealing: 'pinch healing'};
		return query.toLowerCase().trim().split(/\s+/).every(function (word) {
			var term = aliases[word] || word;
			return term.split(' ').every(function (part) { return haystack.includes(part) || T.id(item.name).includes(T.id(part)); });
		});
	};
	var updateChart = proto.updateChart;
	proto.updateChart = function () {
		var result = updateChart.apply(this, arguments);
		this.$('.teambuilder-results').toggleClass('compact-item-picker', this.curChartType === 'item');
		this.$('.item-picker-tools').remove();
		if (this.curChartType !== 'item' || !this.search || !this.curSet) return result;
		var data = T.itemData(), id = T.id(this.curSet.item), filter = this.search.engine.itemToolFilter || 'all';
		var html = '<div class="item-picker-tools pad"><label>Items <select class="item-tool-filter">';
		['all', 'favorites', 'recent'].forEach(function (mode) { html += '<option value="' + mode + '"' + (mode === filter ? ' selected' : '') + '>' + mode + '</option>'; });
		html += '</select></label> ' + button('starCurrentItem', (data.favorites.includes(id) ? '★ Unstar ' : '☆ Star ') + (this.curSet.item || 'selected item')) + '<small>Search by name or effect · ☆ Favorite</small></div>';
		this.$chart.before(html);
		return result;
	};
	proto.itemToolFilterChange = function (event) {
		if (!this.search) return;
		this.search.engine.itemToolFilter = event.currentTarget.value;
		this.search.engine.results = null;
		this.$('input[name=item]').val('');
		this.search.find('');
	};
	proto.starListedItem = function (id) {
		if (!this.curTeam || !this.curTeam.dex.items.get(id).exists || !this.search) return;
		Storage.prefs('itempickertools', T.starItem(T.itemData(), id));
		this.search.engine.results = null;
		this.updateChart();
		this.search.find(this.$('input[name=item]').val() || '');
	};
	proto.starCurrentItem = function () {
		if (!this.curSet || !this.curTeam.dex.items.get(this.curSet.item).exists) return;
		Storage.prefs('itempickertools', T.starItem(T.itemData(), this.curSet.item));
		this.search.engine.results = null;
		this.updateChart();
		this.search.find(this.$('input[name=item]').val() || '');
	};
	var chartSet = proto.chartSet;
	proto.chartSet = function (value) {
		var isItem = this.curChartName === 'item', result = chartSet.apply(this, arguments);
		if (isItem && this.curSet && this.curTeam.dex.items.get(this.curSet.item).exists) {
			Storage.prefs('itempickertools', T.selectItem(T.itemData(), this.curSet.item));
		}
		return result;
	};
	proto.events['change .item-tool-filter'] = 'itemToolFilterChange';

	T.previewKey = function (set, format) { return JSON.stringify([format, set.species, set.item, set.ability, set.moves, set.gigantamax]); };
	var initialize = proto.initialize;
	proto.initialize = function () {
		this.toolRequests = {};
		this.listenTo(app, 'response:teamtools', this.receiveTeamTools);
		return initialize.apply(this, arguments);
	};
	proto.requestTeamTools = function (payload, callback) {
		if (app.isDisconnected) return callback({error: 'Not checked: server is disconnected.'});
		var id = T.uid(), self = this;
		payload.requestId = id;
		if (!this.toolRequests) this.toolRequests = {};
		this.toolRequests[id] = {callback: callback, timer: setTimeout(function () {
			if (!self.toolRequests[id]) return;
			delete self.toolRequests[id];
			callback({error: 'Not checked: this server did not respond or does not support these team tools.'});
		}, 15000)};
		app.send('/teamtools ' + JSON.stringify(payload));
	};
	proto.receiveTeamTools = function (response) {
		var request = this.toolRequests && this.toolRequests[response.requestId];
		if (!request) return;
		clearTimeout(request.timer);
		delete this.toolRequests[response.requestId];
		request.callback(response);
	};
	proto.currentFormPreview = function (set) {
		var preview = this.formPreview;
		if (!preview || preview.set !== set || preview.key !== T.previewKey(set, this.curTeam.format)) {
			if (preview && preview.set === set) this.formPreview = null;
			return null;
		}
		return preview.options.find(function (option) { return option.id === preview.selected; }) || null;
	};
	var renderBuildSet = proto.renderSet;
	proto.renderSet = function (set, index) {
		var html = renderBuildSet.call(this, set, index);
		if (!set.species) return html;
		this.currentFormPreview(set);
		var preview = this.formPreview, box = '<div class="form-preview-tools"><div class="set-tools-row"><span class="set-tools-label">Forms</span><div class="set-tools-controls">' + button('loadFormPreviews', preview && preview.set === set ? 'Refresh' : 'Preview battle forms', index);
		if (preview && preview.set === set) {
			box += button('returnBasePreview', 'Return to base form') + '<select class="form-preview-choice" aria-label="Preview battle form"><option value="">Base set</option>';
			preview.options.forEach(function (option) { box += '<option value="' + escape(option.id) + '"' + (preview.selected === option.id ? ' selected' : '') + '>' + escape(option.name) + '</option>'; });
			box += '</select>';
			var selected = this.currentFormPreview(set);
			box += '</div></div>';
			if (selected) {
				var view = T.clone(set);
				view.species = selected.name;
				var ability = this.curTeam.dex.abilities.get(selected.ability);
				box += '<div class="form-preview-result"><span class="form-preview-sprite" style="display:inline-block;width:100px;height:100px;' + Dex.getTeambuilderSprite(view, this.curTeam.gen) + '"></span><strong>Preview: ' + escape(selected.name) + '</strong><span>' + escape(selected.types.join(' / ')) + '</span><span><b>Ability: ' + escape(selected.ability) + '</b> — ' + escape(ability.shortDesc || ability.desc || 'No description available.') + '</span></div>';
				box += renderStarterPassives(this.curTeam.dex.species.get(selected.species || selected.name));
				var components = Dex.getAbilityDisplayComponents(toID(selected.ability), this.curTeam.dex);
				if (components.length) box += '<p class="form-preview-notice"><b>Includes:</b> ' + components.map(function (id) { return escape(Dex.abilities.get(id).name); }).join(' · ') + '</p>';
				if (ability.desc && ability.desc !== ability.shortDesc) box += '<details class="form-preview-help"><summary>Full ability effect</summary><p>' + escape(ability.desc) + '</p></details>';
				box += this.renderFormStatComparison(set, selected);
				box += '<p class="form-preview-notice">PREVIEW STATS — saved Pokémon unchanged. EVs and IVs edit your saved base set; shown stats use this form.</p>';

			}
			if (preview.error || !preview.options.length) box += '<p class="form-preview-notice" role="status">' + escape(preview.error || (preview.note === 'Loading from server…' ? preview.note : 'No eligible forms for this set and format.')) + '</p>';
			else box += '<details class="form-preview-help"><summary>Preview details</summary><p>' + escape(preview.note || 'Uses this set’s EVs, IVs and nature. Your saved set stays unchanged.') + '</p></details>';
		}
		else box += '</div></div>';
		var state = selected ? ' · ' + escape(selected.name) : '';
		if (this.buildUndo && this.buildUndo.team === this.curTeam && this.buildUndo.applied === set) state += ' · Undo available';
		return html.replace('<span class="set-tools-state"></span>', '<span class="set-tools-state">' + state + '</span>')
			.replace('<!-- SET FORM PREVIEW -->', box + '</div>');
	};
	proto.renderFormStatComparison = function (set, selected) {
		var previewSet = T.clone(set); previewSet.species = selected.name; previewSet.ability = selected.ability;
		var baseStats = Dex.getAbilityFormPreview(previewSet, this.curTeam.dex).baseStats;
		var labels = {hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
		var self = this, html = '<table class="form-stat-comparison"><caption>Stats with current EVs, IVs and nature</caption><thead><tr><th>Stat</th><th>Form base</th><th>Base set</th><th>Preview</th><th>Change</th></tr></thead><tbody>';
		Object.keys(labels).forEach(function (stat) {
			var before = getStat.call(self, stat, set), after = getStat.call(self, stat, previewSet), delta = after - before;
			html += '<tr><th>' + labels[stat] + '</th><td>' + baseStats[stat] + '</td><td>' + before + '</td><td><b>' + after + '</b></td><td>' + (delta > 0 ? '+' : '') + delta + '</td></tr>';
		});
		return html + '</tbody></table>';
	};
	proto.loadFormPreviews = function (index) {
		var self = this, set = this.curSetList[Number(index)], team = this.curTeam;
		if (!set) return;
		var key = T.previewKey(set, team.format);
		this.formPreview = {set: set, key: key, options: [], selected: '', note: 'Loading from server…'};
		this.update();
		this.requestTeamTools({action: 'preview', format: team.format, team: Storage.packTeam([T.clone(set)])}, function (response) {
			if (self.curTeam !== team || !self.formPreview || self.formPreview.key !== key || T.previewKey(set, team.format) !== key) return;
			self.formPreview = {set: set, key: key, options: response.options || [], selected: '', note: response.note, error: response.error};
			self.update();
		});
	};
	proto.formPreviewChange = function (event) {
		if (!this.formPreview) return;
		this.formPreview.selected = event.currentTarget.value;
		this.update();
		if (this.curChartType === 'stats') this.updateStatForm();
		this.$('.form-preview-choice').focus();
	};
	var getStat = proto.getStat;
	proto.getStat = function (stat, set, ev, nature) {
		set = set || this.curSet;
		var base = getStat.call(this, stat, set, ev, nature), selected = set && this.currentFormPreview(set);
		if (!selected) return base;
		var previewSet = T.clone(set);
		previewSet.species = selected.name;
		previewSet.ability = selected.ability;
		return getStat.call(this, stat, previewSet, ev, nature);
	};
	proto.events['change .form-preview-choice'] = 'formPreviewChange';
	proto.events['change .saved-build-choice'] = function (event) {
		this.selectedSavedSets = this.selectedSavedSets || new WeakMap();
		var set = this.curSetList[this.toolsSetIndex(event.currentTarget)];
		if (set) this.selectedSavedSets.set(set, event.currentTarget.value);
		this.refreshSavedSetControls($(event.currentTarget).closest('li'));
	};
	proto.validate = function () {
		if (!this.curTeam) return;
		if (this.curTeam.teamid && !this.curTeam.loaded) return app.loadTeam(this.curTeam, this.validate.bind(this));
		this.validationView = true;
		this.validationResults = null;
		this.validationSelection = [{localTeam: this.curTeam, name: this.curTeam.name, format: this.curTeam.format, team: Storage.packTeam(T.clone(this.curSetList))}];
		this.runSavedTeamValidation();
	};
	proto.showTeamValidation = function () {
		this.validationView = true;
		var self = this, html = '<div class="pad team-validation"><h2>Validate saved teams</h2><p>Each team is checked independently against its own selected format on the connected server. Choose up to 12 teams. Cross-team league budgets are not checked. No sets will be changed.</p>' + button('back', 'Back') + '<div class="validation-choices">';
		Storage.teams.forEach(function (team, index) {
			var format = window.BattleFormats && BattleFormats[team.format];
			html += '<p><label><input type="checkbox" class="validate-team-choice" value="' + index + '" /> ' + escape(team.name) + ' — ' + escape(format ? format.name : team.format || 'No format: not checked') + '</label></p>';
		});
		html += '</div>' + button('validateSelectedTeams', 'Validate selected teams') + '<div class="validation-results" aria-live="polite">';
		if (this.validationPending) html += '<p>Checking with server…</p>';
		if (this.validationError) html += '<p>' + escape(this.validationError) + '</p>';
		if (this.validationResults) this.validationResults.forEach(function (result, resultIndex) {
			html += '<section><h3>' + escape(result.name) + ' — ' + escape(result.format || 'No format') + '</h3><p><strong>' + escape(result.status === 'valid' ? 'Passes selected format' : result.status) + '</strong></p>';
			if (result.permissive) html += '<p>Permissive Custom Game rules: this is not proof of league legality.</p>';
			(result.problems || []).forEach(function (problem, problemIndex) { html += '<p>' + escape(problem) + ' ' + button('jumpValidationProblem', 'Review in team', resultIndex + ':' + problemIndex) + '</p>'; });
			(result.suggestions || []).forEach(function (suggestion) { html += '<p>Suggestion: ' + escape(suggestion) + '</p>'; });
			html += '<p>' + escape(result.matchup) + '</p></section>';
		});
		html += '<p>Cross-team roster, opponent and matchup/gimmick rules are not checked without their definitions. Hidden opponent information is never assumed.</p></div></div>';
		this.$el.html(html);
	};
	proto.validateSelectedTeams = function () {
		var self = this, selected = [];
		this.$('.validate-team-choice:checked').each(function () {
			var team = Storage.teams[Number(this.value)];
			selected.push({localTeam: team, name: team.name, format: team.format, team: team === self.curTeam && self.curSetList ? Storage.packTeam(T.clone(self.curSetList)) : team.team});
		});
		if (!selected.length || selected.length > 12) return app.addPopupMessage('Select 1–12 teams.');
		this.validationSelection = selected;
		this.runSavedTeamValidation();
	};
	T.problemLocation = function (problem, sets) {
		var matches = sets.map(function (set, index) { return {set: set, index: index}; }).filter(function (row) {
			return [row.set.name, row.set.species].filter(Boolean).some(function (name) { return problem.startsWith(name + ' ') || problem.startsWith(name + "'") || problem.startsWith(name + ':'); });
		});
		if (matches.length !== 1) return null;
		var row = matches[0], field = 'pokemon';
		if (row.set.ability && problem.includes(row.set.ability)) field = 'ability';
		if (row.set.item && problem.includes(row.set.item)) field = 'item';
		(row.set.moves || []).forEach(function (move, index) { if (problem.includes(move)) field = 'move' + (index + 1); });
		return {index: row.index, field: field};
	};
	proto.jumpValidationProblem = function (key) {
		var parts = key.split(':').map(Number), selection = this.validationSelection && this.validationSelection[parts[0]];
		var result = this.validationResults && this.validationResults[parts[0]];
		if (!selection || !result) return;
		var teamIndex = Storage.teams.indexOf(selection.localTeam);
		if (teamIndex < 0) return app.addPopupMessage('This team has been removed.');
		var problem = result.problems[parts[1]], sets = Storage.unpackTeam(selection.localTeam.team);
		var location = T.problemLocation(problem, sets);
		this.validationView = false; this.toolsView = false; this.profilesView = false; this.edit(teamIndex);
		if (location) { this.selectPokemon(location.index); this.$('input[name="' + location.field + '"]').focus(); }
		var issue = '<div class="pad validation-issue" role="status">' + escape(problem) + '</div>';
		if (location) this.$('input[name="' + location.field + '"]').attr('aria-invalid', 'true').closest('.setchart').after(issue);
		else this.$el.prepend(issue);
	};
	proto.runSavedTeamValidation = function () {
		var self = this, token = T.uid();
		this.validationToken = token;
		this.validationPending = true;
		this.validationResults = null;
		this.validationError = '';
		this.showTeamValidation();
		this.requestTeamTools({action: 'validate', teams: this.validationSelection.map(function (entry) { return {name: entry.name, format: entry.format, team: entry.team}; })}, function (response) {
			if (self.validationToken !== token) return;
			self.validationPending = false;
			self.validationResults = response.results || null;
			self.validationError = response.error ? 'Not checked: ' + response.error : '';
			if (self.validationView) self.showTeamValidation();
		});
	};
	var toolsUpdate = proto.update;
	proto.update = function () {
		if (this.validationView) return this.showTeamValidation();
		var result = toolsUpdate.apply(this, arguments);
		if (!this.curTeam && !this.toolsView && !this.profilesView && !this.$('.batch-validation-button').length) {
			this.$('.teamlist').before('<p class="batch-validation-button">' + button('showTeamValidation', 'Validate saved teams') + '</p>');
		}
		return result;
	};
	var toolsBack = proto.back;
	proto.back = function () {
		if (this.validationView) { this.validationView = false; return this.update(); }
		return toolsBack.apply(this, arguments);
	};

	var previewChartSet = proto.chartSet;
	proto.chartSet = function () {
		var preview = this.formPreview, result = previewChartSet.apply(this, arguments);
		if (preview && (!this.formPreview || preview.key !== T.previewKey(this.curSet, this.curTeam.format))) {
			this.formPreview = null;
			this.$('.form-preview-tools').html('<div class="set-tools-row"><span class="set-tools-label">Forms</span><div class="set-tools-controls">' + button('loadFormPreviews', 'Preview battle forms', this.curSetLoc) + '</div></div>');
			this.updateStatGraph();
		}
		return result;
	};

	T.profileChanges = function (before, after, profile, dex) {
		var html = '<table class="profile-change-table"><thead><tr><th>Pokémon</th><th>Nickname</th><th>Shiny</th><th>Result</th></tr></thead><tbody>';
		before.forEach(function (set, i) {
			if (!set.species) return;
			var next = after[i], mapped = T.nickname(set, profile, dex);
			var reason = next.name !== set.name ? 'Name updated' : !mapped ? 'No matching nickname' : next.name === mapped ? 'Name already matches' : 'Existing nickname kept';
			html += '<tr><th>' + escape(set.species) + '</th><td>' + escape(set.name || set.species) + ' → ' + escape(next.name || next.species) + '</td><td>' + (set.shiny ? 'Yes' : 'No') + ' → ' + (next.shiny ? 'Yes' : 'No') + '</td><td>' + reason + '</td></tr>';
		});
		return html + '</tbody></table>';
	};
	proto.refreshSavedSetControls = function (row) {
		var id = row.find('.saved-build-choice').val(), data = this.toolsData(true);
		var entry = data.builds.find(function (b) { return b.id === id; });
		row.find('[name=applySavedBuild], [name=updateSavedBuild]').prop('disabled', !entry).attr('title', entry ? '' : 'Choose a saved set first');
		row.find('[name=updateSavedBuild]').text(entry ? 'Overwrite “' + entry.name + '”' : 'Overwrite saved set');
	};
	proto.refreshLibraryControls = function () {
		var data = this.toolsData(true), self = this;
		this.$('.library-sets').prop('open', this.librarySection === 'sets').toggle(this.librarySection === 'sets');
		this.$('.library-names').toggle(this.librarySection !== 'sets');
		this.$('.library-tabs [value]').attr('aria-pressed', 'false').filter('[value=' + (this.librarySection || 'names') + ']').attr('aria-pressed', 'true');
		this.$('[name=applyNicknameToTeam]').prop('disabled', !data.selectedNickname || !this.curTeam).attr('title', !this.curTeam ? 'Open a team first' : !data.selectedNickname ? 'Choose a nickname profile first' : '');
		this.$('[name=addTeamNicknameRows]').prop('disabled', !this.curTeam);
		this.$('[name=addLibraryBuild]').prop('disabled', !this.curTeam || !this.curSetList || this.curSetList.filter(function (s) { return s.species; }).length >= (this.curTeam.capacity || 6)).attr('title', 'Requires an open team with an empty slot');
		this.$('[name=replaceLibraryBuild]').prop('disabled', !this.curSet).text(this.curSet ? 'Replace ' + this.curSet.species : 'Select a Pokémon to replace');
		this.$('.nickname-gender').prop('disabled', !this.$('.nickname-gendered').prop('checked')).attr('title', 'Enable gender-specific nicknames to edit');
		this.$('.saved-build-choice').each(function () { self.refreshSavedSetControls($(this).closest('li')); });
		this.$('.library-undo').remove();
		if (this.libraryUndo) this.$el.prepend('<div class="pad library-undo">Saved library changed. ' + button('undoLibraryChange', 'Undo library change') + '</div>');
	};
	var rosterLibraryView = proto.showRosterProfiles;
	proto.showRosterProfiles = function () {
		var result = rosterLibraryView.apply(this, arguments);
		var selected = this.rosterData().selected;
		this.$('[name=previewRosterImport][value=add], [name=previewRosterImport][value=replace]').prop('disabled', !selected).attr('title', selected ? '' : 'Choose a Pokémon list first');
		this.$('.roster-page h2').after('<nav class="library-tabs" aria-label="Library sections">' + button('libraryTab', 'Nickname profiles', 'names') + button('libraryTab', 'Saved sets', 'sets') + '<button class="button" disabled>Pokémon lists</button></nav>');
		return result;
	};
	proto.openRosterManager = function () { this.saveNicknameDraft(); this.toolsView = false; this.showRosterProfiles(); };
	proto.libraryTab = function (section) {
		this.captureLibraryView();
		this.saveNicknameDraft();
		if (section === 'lists') return this.openRosterManager();
		this.profilesView = false; this.librarySection = section; this.showToolsManager();
	};
	proto.filterNicknameRows = function () {
		var query = String(this.$('.nickname-search').val() || '').toLowerCase(), teamOnly = this.$('.nickname-team-only').prop('checked');
		var ids = new Set((this.curSetList || []).map(function (s) { return T.id(s.species); }));
		this.$('.nickname-row').not('.nickname-head').each(function () {
			var row = $(this), species = String(row.find('.nickname-species').val()), name = String(row.find('.nickname-value').val());
			row.toggle((species + ' ' + name).toLowerCase().includes(query) && (!teamOnly || ids.has(T.id(species))));
		});
	};
	proto.addTeamNicknameRows = function () {
		var ids = new Set(), self = this;
		this.$('.nickname-species').each(function () { ids.add(T.id($(this).val())); });
		(this.curSetList || []).forEach(function (set) {
			if (!set.species || ids.has(T.id(set.species))) return;
			ids.add(T.id(set.species)); self.$('.nickname-rows').append(T.nicknameRow(set.species, set.name || ''));
		});
		this.saveNicknameDraft(); this.refreshLibraryControls(); this.filterNicknameRows();
	};
	proto.undoLibraryChange = function () {
		var undo = this.libraryUndo; if (!undo || !undo.entry) return;
		var data = this.toolsData(), index = data[undo.field].findIndex(function (e) { return e.id === undo.entry.id; });
		if (!T.canUndoLibrary(undo, index < 0 ? null : data[undo.field][index])) return app.addPopupMessage('This library entry changed afterward. Undo would overwrite newer edits.');
		if (index >= 0) data[undo.field][index] = undo.entry; else data[undo.field].push(undo.entry);
		if (undo.selected === undo.entry.id) data.selectedNickname = undo.selected;
		this.saveToolsData(data); this.libraryUndo = null; this.update();
	};
	proto.downloadToolsBackup = function () {
		this.saveNicknameDraft();
		var data = this.toolsData();
		var url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}));
		var link = document.createElement('a'); link.href = url; link.download = 'teambuilder-library.json'; link.click();
		setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
	};
	proto.readToolsBackup = function (event) {
		var file = event.currentTarget.files[0], self = this, token = T.uid();
		this.libraryImportToken = token; this.pendingLibraryImport = null; this.$('.library-import-preview').remove();
		if (!file) return;
		var reader = new FileReader(); reader.onload = function () {
			if (self.libraryImportToken !== token) return;
			try {
				var incoming = T.parse(String(reader.result)); self.pendingLibraryImport = incoming;
				self.$('.library-import-preview').remove();
				self.$('.library-backup').append('<div class="library-import-preview"><b>' + escape(file.name) + '</b>: Import ' + incoming.builds.length + ' saved sets and ' + incoming.nicknames.length + ' nickname profiles as new copies? ' + button('confirmLibraryImport', 'Import copies') + button('cancelLibraryImport', 'Cancel') + '</div>');
			} catch (err) { app.addPopupMessage(err.message); }
		}; reader.onerror = function () { app.addPopupMessage('Could not read this backup.'); }; reader.readAsText(file);
	};
	proto.confirmLibraryImport = function () {
		if (!this.pendingLibraryImport) return; this.saveNicknameDraft(); var data = this.toolsData();
		data.builds = data.builds.concat(this.pendingLibraryImport.builds); data.nicknames = data.nicknames.concat(this.pendingLibraryImport.nicknames);
		this.saveToolsData(data); this.pendingLibraryImport = null; this.showToolsManager();
	};
	proto.cancelLibraryImport = function () { this.libraryImportToken = null; this.pendingLibraryImport = null; this.$('.library-import-preview').remove(); };
	proto.returnBasePreview = function () { this.formPreviewChange({currentTarget: {value: ''}}); };
	proto.events['input .nickname-search'] = 'filterNicknameRows';
	proto.events['change .nickname-team-only'] = 'filterNicknameRows';
	proto.events['change .tools-backup-file'] = 'readToolsBackup';
	var saveDraftWithControls = proto.saveNicknameDraft;
	proto.saveNicknameDraft = function () { var result = saveDraftWithControls.apply(this, arguments); if (this.toolsView) this.$('.nickname-gender').prop('disabled', !this.$('.nickname-gendered').prop('checked')); return result; };
	var updateLibraryControls = proto.update;
	proto.update = function () { var result = updateLibraryControls.apply(this, arguments); if (!this.toolsView && !this.profilesView) this.refreshLibraryControls(); return result; };

	T.nonemptyNicknameRows = function (rows) { return rows.filter(function (row) { return row[0].trim() || row[1].trim(); }); };
	T.canUndoLibrary = function (undo, current) {
		return undo.overwrite ? !!undo.after && JSON.stringify(current) === JSON.stringify(undo.after) : !current;
	};
	proto.captureLibraryView = function () {
		if (!this.toolsView) return;
		this.libraryViews = this.libraryViews || {};
		this.libraryViews[this.librarySection || 'names'] = {scroll: this.$el.scrollTop(), search: this.$('.build-library-search').val(), names: this.$('.nickname-search').val(), teamOnly: this.$('.nickname-team-only').prop('checked'), rowsScroll: this.$('.nickname-rows').scrollTop()};
	};
	proto.restoreLibraryView = function () {
		var state = this.libraryViews && this.libraryViews[this.librarySection || 'names']; if (!state) return;
		this.$('.build-library-search').val(state.search || ''); this.filterSavedBuilds({currentTarget: {value: state.search || ''}});
		this.$('.nickname-search').val(state.names || ''); this.$('.nickname-team-only').prop('checked', !!state.teamOnly); this.filterNicknameRows();
		this.$('.nickname-rows').scrollTop(state.rowsScroll || 0); this.$el.scrollTop(state.scroll || 0);
	};
	proto.showAbilityPickerDetails = function (event) {
		event.preventDefault(); event.stopPropagation();
		app.addPopupMessage($(event.currentTarget).attr('data-description'));
	};
	proto.events['click .ability-picker-info'] = 'showAbilityPickerDetails';

	T.buildResult = function (before, saved, keepAppearance) {
		var result = T.cleanSet(saved);
		if (keepAppearance) ['name', 'shiny', 'gender'].forEach(function (key) {
			if (before[key] === undefined) delete result[key]; else result[key] = T.clone(before[key]);
		});
		return result;
	};
	T.setDifference = function (before, after) {
		before = T.cleanSet(before); after = T.cleanSet(after);
		return Object.keys(Object.assign({}, before, after)).filter(function (key) { return JSON.stringify(before[key]) !== JSON.stringify(after[key]); }).map(function (key) { return {key: key, before: before[key], after: after[key]}; });
	};
	T.setSearchText = function (set) { return [set.species, set.name, set.item, set.ability].concat(set.moves || []).join(' ').toLowerCase(); };
	proto.calculateSetAs = function (value) {
		var parts = value.split(':'), set = this.curSetList[Number(parts[0])]; if (!set) return;
		app.pendingCalculatorSet = {slot: Number(parts[1]), set: T.cleanSet(set)};
		app.rooms[''].customCalculator();
		var calc = app.rooms.calculator; if (calc && calc.metadata) calc.acceptTeamBuilderSet();
	};
	proto.applySavedBuild = function (value, btn) {
		var index = this.toolsSetIndex(btn), id = $(btn).closest('li').find('.saved-build-choice').val();
		var build = this.toolsData(true).builds.find(function (b) { return b.id === id; }); if (!build) return;
		this.openBuildComparison(index, build);
	};
	proto.openBuildComparison = function (index, build) {
		var set = this.curSetList[index]; if (!set) return;
		this.pendingBuildComparison = {team: this.curTeam, index: index, set: set, before: T.clone(set), build: T.clone(build)};
		this.renderBuildComparison(true);
	};
	proto.renderBuildComparison = function (keepAppearance) {
		var pending = this.pendingBuildComparison; if (!pending) return;
		var build = pending.build;
		var labels = {species: 'Pokémon', item: 'Item', ability: 'Ability', moves: 'Moves', nature: 'Nature', evs: 'EVs', ivs: 'IVs', level: 'Level', teraType: 'Tera type', name: 'Nickname', shiny: 'Shiny', gender: 'Gender', happiness: 'Happiness', hpType: 'Hidden Power type', pokeball: 'Poké Ball', gigantamax: 'Gigantamax', dynamaxLevel: 'Dynamax level'};
		var rows = T.setDifference(pending.before, T.buildResult(pending.before, build.set, keepAppearance)).map(function (row) {
			function format(value) { return value === undefined ? 'Default' : typeof value === 'object' ? JSON.stringify(value) : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value); }
			return '<tr><th>' + escape(labels[row.key] || row.key) + '</th><td>' + escape(format(row.before)) + '</td><td>' + escape(format(row.after)) + '</td></tr>';
		}).join('');
		this.$('.build-comparison').remove();
		this.$el.append('<div class="pad profile-apply-preview build-comparison" role="dialog" aria-label="Compare saved set" tabindex="-1"><b>Load “' + escape(build.name) + '”</b><table class="profile-change-table"><tr><th>Changes</th><th>Current</th><th>After loading</th></tr>' + rows + '</table>' + (!rows ? '<p>No changes with these options.</p>' : '') + '<label><input type="checkbox" class="keep-build-appearance"' + (keepAppearance ? ' checked' : '') + ' /> Keep current nickname, shiny and gender</label><div class="profile-confirm-actions">' + button('confirmBuildComparison', 'Load set') + button('cancelBuildComparison', 'Cancel') + '</div></div>');
		this.$('.build-comparison').focus();
	};
	proto.changeBuildAppearance = function (event) {
		this.renderBuildComparison(!!event.currentTarget.checked);
		this.$('.keep-build-appearance').focus();
	};
	proto.events['change .keep-build-appearance'] = 'changeBuildAppearance';
	proto.confirmBuildComparison = function () {
		var pending = this.pendingBuildComparison; if (!pending) return;
		var build = this.toolsData(true).builds.find(function (b) { return b.id === pending.build.id; });
		if (pending.team !== this.curTeam || pending.set !== this.curSetList[pending.index] || JSON.stringify(pending.before) !== JSON.stringify(this.curSetList[pending.index]) || JSON.stringify(build) !== JSON.stringify(pending.build)) return app.addPopupMessage('The set changed. Open the comparison again.');
		var keepAppearance = !!this.$('.keep-build-appearance').prop('checked');
		try { this.loadSavedBuildNow(pending.index, pending.build, keepAppearance); } finally { this.cancelBuildComparison(); }
	};
	proto.cancelBuildComparison = function () { this.pendingBuildComparison = null; this.$('.build-comparison').remove(); };
	proto.filterCurrentTeam = function (event) {
		this.currentTeamSearch = event.currentTarget.value;
		var self = this, query = this.currentTeamSearch.trim().toLowerCase();
		this.$('.teamchart > li[value]').each(function () { var set = self.curSetList[Number($(this).attr('value'))]; $(this).toggle(!set || T.setSearchText(set).includes(query)); });
	};
	proto.clearAllPickerFilters = function () {
		var data = this.rosterData(); data.enabled = false; this.saveRosterProfiles(data); this.resetPokemonPickerFilters();
	};
	var pickerStatusWithHint = proto.updatePokemonPickerStatus;
	proto.updatePokemonPickerStatus = function (rows) {
		var count = pickerStatusWithHint.call(this, rows); this.$('.picker-empty-hint').remove();
		if (!count && this.curChartType === 'pokemon') this.$('.pokemon-picker-filters').after('<div class="pad picker-empty-hint">No Pokémon match this search and the active filters. ' + button('clearAllPickerFilters', 'Clear filters') + ' <small>Your search text stays unchanged; format restrictions still apply.</small></div>');
		return count;
	};
	var selectWithUndo = proto.chartSet;
	proto.chartSet = function (value, next) {
		var team = this.curTeam, index = this.curSetLoc, field = this.curChartName, before = this.curSet && T.clone(this.curSet);
		var result = selectWithUndo.apply(this, arguments);
		if (before && /^(pokemon|move[1-4])$/.test(field) && JSON.stringify(before) !== JSON.stringify(this.curSetList[index])) {
			this.selectionUndo = {team: team, index: index, before: before, after: T.clone(this.curSetList[index])}; this.showSelectionUndo();
		}
		return result;
	};
	proto.showSelectionUndo = function () {
		this.$('.selection-undo').remove(); if (!this.selectionUndo || this.selectionUndo.team !== this.curTeam) return;
		this.$('.teamchartbox').first().append('<div class="selection-undo" role="status">Selection changed. ' + button('undoSelection', 'Undo selection') + button('dismissSelectionUndo', 'Dismiss') + '</div>');
	};
	proto.dismissSelectionUndo = function () { this.selectionUndo = null; this.$('.selection-undo').remove(); };
	proto.undoSelection = function () {
		var undo = this.selectionUndo; if (!undo || undo.team !== this.curTeam) return;
		if (JSON.stringify(this.curSetList[undo.index]) !== JSON.stringify(undo.after)) return app.addPopupMessage('This Pokémon changed afterward. Undo would overwrite those edits.');
		this.curSetList[undo.index] = T.clone(undo.before); if (this.curSetLoc === undo.index) this.curSet = this.curSetList[undo.index];
		this.selectionUndo = null; this.toolsCommit();
	};
	var easyUpdate = proto.update;
	proto.update = function () {
		var result = easyUpdate.apply(this, arguments);
		if (this.curTeam && !this.curSet && !this.toolsView && !this.profilesView && !this.validationView && !this.exportMode) {
			this.$('.team-search-controls').remove(); this.$('.teamchart').first().before('<label class="team-search-controls">Find on this team <input type="search" class="textbox current-team-search" placeholder="Pokémon, nickname, move, item or ability" value="' + escape(this.currentTeamSearch || '') + '" /></label>');
			this.filterCurrentTeam({currentTarget: {value: this.currentTeamSearch || ''}});
		}
		this.showSelectionUndo(); return result;
	};
	var easyBlur = proto.blur, easyFocus = proto.focus;
	proto.blur = function () { this.editorScroll = this.$el.scrollTop(); if (easyBlur) return easyBlur.apply(this, arguments); };
	proto.focus = function () { var result = easyFocus && easyFocus.apply(this, arguments); if (this.editorScroll !== undefined) this.$el.scrollTop(this.editorScroll); return result; };
	proto.events['input .current-team-search'] = 'filterCurrentTeam';

})(window, jQuery);
// END LOCAL TEAMBUILDER TOOLS

// Species passives are informational; they are not saved in the team's ability slot.
function renderStarterPassives(species) {
 if (!species || !species.passives || !species.passives.length) return '';
 return '<div class="starter-passives"><label>Passives</label>' + species.passives.map(function (id) {
  var ability = Dex.abilities.get(id);
  return '<span class="passive-chip" title="' + BattleLog.escapeHTML(ability.shortDesc || ability.desc) + '">' + BattleLog.escapeHTML(ability.name) + '</span>';
 }).join(' ') + '</div>';
}
