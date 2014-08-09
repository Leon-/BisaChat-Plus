/* 
 * Highlighting Module
 * Copyright (C) 2011-2012 Stefan Hahn
 */
// TODO: chose highlighting animation color depending on user's style
// TODO: no highlighting animation in some cases
// TODO: add broadcast highlighting
Modules.AddOn.Highlighting = new ClassSystem.Class(Modules.Util.AbstractModule, {
	initialize: function($super, callerObj) {
		this.removeBasicHighlighting();
		$super(callerObj);
	},
	
	removeBasicHighlighting: function() {
		var basicHighlightingButton = $$('#chatOptions .smallButtons > ul > li')[2];
		Window.chat.enableAnimating = false;
		
		basicHighlightingButton.style.overflow = 'hidden';
		new Animations.Morph(basicHighlightingButton, {
			properties: ['border-width', 'width'],
			values: ['0px', '0px'],
			onAnimationEnd: function(event) {
				event.target.parentNode.removeChild(event.target);
			}
		});
	},
	
	initializeVariables: function() {
		this.docTitle = document.title;
		this.regExp = null;
		this.messageIDs = [];
		this.listenerFunction = null;
	},
	
	registerOptions: function() {
		this.callerObj.registerBoolOption('blurHR', 'Horizontale Linie beim verlassen des Tabs', 'Horizontale Linie', 'r', false);
		this.callerObj.registerTextOption('highlightingText', 'Highlighten bei', Window.settings.username, function(optionValue) {
			this.buildRegExp(optionValue);
		}, this);
		this.callerObj.registerBoolOption('highlighting', 'Highlighting', 'Highlighting aktivieren', 'l', false);
	},
	
	addListeners: function() {
		Event.register('messageAfterNodeSetup', function(event) {
			if (this.storage.getValue('highlightingStatus', false) && (!document.hasFocus() || this.callerObj.isAway) && (!event.ownMessage) && (event.usernameSimple.toLowerCase() !== 'chatbot') && !event.text.startsWith('np:')) {
				if (this.regExp === null) {
					this.buildRegExp(this.storage.getValue('highlightingTextValue', Window.settings.username));
				}
				
				if (this.regExp.test(event.text)) {
					this.highlight(event.id);
					
					if (!!this.callerObj.moduleInstances.get('MessageBox') && !!this.callerObj.moduleInstances.get('MessageBox').pushMessage && (event.type !== 7)) {
						this.callerObj.moduleInstances.get('MessageBox').pushMessage(event);
					}
				}
				else if (event.type === 7) {
					this.highlight(event.id);
				}
			}
		}, this);
		Event.register('tabBlur', function(event) {
			if (this.storage.getValue('blurHRStatus', false)) {
				$$('#chatMessage'+Window.chat.activeUserID+' ul .blurHr').each(function(item) {
					item.parentNode.removeChild(item);
				});
				var line = (new Element('li', { 'class': 'blurHr' }));
				
				line.appendChild(new Element('hr', { style: 'display: block; width: 75%;' }));
				$$('#chatMessage'+Window.chat.activeUserID+' ul')[0].appendChild(line);
			}
		}, this);
	},
	
	buildRegExp: function(basicString) {
		var regExpString = basicString.split(',').map(function(item) {
			return RegExp.escape(item.trim());
		}).join('|');
		this.regExp = null;
		this.regExp = new RegExp('\\b('+regExpString+')\\b', 'i');
	},
	
	updateDocTitle: function() {
		if (this.messageIDs.size() > 0) {
			document.title = this.docTitle + ' (' + this.messageIDs.size().toString() + ')';
		}
		else {
			document.title = this.docTitle;
		}
	},
	
	highlight: function(id) {
		new Audio(Media.bing.dataURI).play();
		this.messageIDs.push('chatMessage'+id);
		this.updateDocTitle();
		
		if (this.listenerFunction === null) {
			if (this.callerObj.isAway) {
				this.listenerFunction = Event.register('awayStatusChange', function(event) {
					this.messageIDs.each(function(item) {
						new Animations.Highlight(item);
					}, this);
					this.messageIDs.clear();
					this.updateDocTitle();
					
					Event.unregister('awayStatusChange', this.listenerFunction);
					this.listenerFunction = null;
				}, this);
			}
			else if (!document.hasFocus()) {
				this.listenerFunction = Event.register('tabFocus', function(event) {
					this.messageIDs.each(function(item) {
						new Animations.Highlight(item);
					}, this);
					this.messageIDs.clear();
					this.updateDocTitle();
					
					Event.unregister('tabFocus', this.listenerFunction);
					this.listenerFunction = null;
				}, this);
			}
		}
	}
});
