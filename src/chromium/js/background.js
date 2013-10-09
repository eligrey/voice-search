/*! Voice Search Chromium Extension
 *
 *  Copyright 2012 Eli Grey
 *  	See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global localStorage, chrome*/

"use strict";

chrome.browserAction.onClicked.addListener(function() {
	chrome.windows.getCurrent(function(window) {
		chrome.windows.create({
			  url: chrome.extension.getURL("views/popup.xhtml")
			, width: 100
			, height: 100
			, left: window.left + window.width - 145
			, top: window.top
			, focused: true
			, type: "popup"
		});
	});
});