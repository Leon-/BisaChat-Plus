/* 
 * Auto Away Module
 * Copyright (C) 2011 Stefan Hahn
 */
Modules.AutoAway = {
	callerObj: null,
	timerHandle: null,
	
	init: function(callerObj) {
		this.callerObj = callerObj;
		
		if (API.Storage.getValue('autoAwayTimeoutStatus', true)) this.startTimer();
		this.registerOptions();
	},
	
	registerOptions: function() {
		this.callerObj.registerTextOption('autoAwayTimeout', 'Zeit bis zum Away-Status in Minuten', 5, function(newValue) {
			this.startTimer();
		}, this);
		this.callerObj.registerMessagePrefilter('autoAway', 'Auto Away', 'Auto Away aktivieren', 'a', true, function(event, checked, nickname, message, messageType, ownMessage) {
			if (checked && ownMessage) {
				this.startTimer();
			}
		}, function(event, checked) {
			if (checked) {
				this.startTimer();
			}
			else {
				this.stopTimer();
			}
			
			return true;
		}, this);
	},
	
	startTimer: function() {
		this.stopTimer();
		this.timerHandle = API.w.setTimeout(function() {
			if (!this.callerObj.isAway) this.callerObj.pushMessage('/away');
		}.bind(this), API.Storage.getValue('autoAwayTimeoutValue', 5)*60000);
	},
	
	stopTimer: function() {
		if (this.timerHandle !== null) {
			API.w.clearTimeout(this.timerHandle);
			this.timerHandle = null;
		}
	}
};
