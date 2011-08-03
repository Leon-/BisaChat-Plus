/*
 * Message Prefilter Module
 * Copyright (c) 2011, Stefan Hahn
 */
Modules.MessagePrefilters = {
	init: function(callerObj) {
		callerObj.registerMessagePrefilter('colorlessNicknames', 'Farblose Nicknamen', 'Nicknamen farblos anzeigen', 'n', false, function(event, checked, nickname, message) {
			if (checked) {
				var nickname = event.target.getElementsByTagName('span')[1].getElementsByTagName('span');
				
				for (var i = 0; i < nickname.length; i++) {
					nickname[i].style.color = '';
				}
			}
		});
		
		callerObj.registerMessagePrefilter('greentext', 'Green text', 'Green text aktivieren', 'g', true, function(event, checked, nickname, message) {
			if ((checked) && (message.firstChild.nodeType === 3) && (String(message.firstChild.nodeValue)[0] === '>')) {
				message.style.color = '#792';
			}
		});
		
		callerObj.registerMessagePrefilter('background', 'Wechselnde Hintergrundfarbe der Chatmessages', 'Hintergrund aktivieren', 'h', false, function(event, checked, nickname, message) {
			if (checked) {
				event.target.className = (event.target.className+' container-'+((Registry.getValue('messageNumber', 0) % 2) + 1)).trim();
				Registry.setValue('messageNumber', (Registry.getValue('messageNumber') + 1));
			}
		});
	}
};
