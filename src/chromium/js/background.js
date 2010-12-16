/*! Voice Search Google Chrome Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global localStorage, chrome*/

"use strict";

chrome.extension.onConnect.addListener(function (port) {
	if (port.name === chrome.extension.getURL("")) {
		port.postMessage(!!+localStorage.websiteIntegration);
	}
});