/*! Voice Search Google Chrome Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global location, document, chrome*/

"use strict";

(function () {

var init = function () {
	var
		  host = location.hostname.split(".").slice(-2).join(".")
		, subdomain = location.hostname.split(".")[0]
		, path = location.pathname
		, doc = document
		, $ = function (query) {
			return doc.querySelectorAll(query);
		}
		, injectCSS = function () {
			var
				  style = doc.createElement("style")
				, rules = arguments
			;
			doc.documentElement.appendChild(style);
			for (var i = 0, len = rules.length; i < len; i++) {
				style.sheet.insertRule(rules[i], style.sheet.cssRules.length);
			}
		}
		, submit = function (event) {
			event.target.form.submit();
		}
		, addSpeechInput = function (elt) {
			elt.addEventListener((elt.onspeechchange === null ? "" : "webkit")
				+ "speechchange", submit, false);
			elt.setAttribute("x-webkit-speech", "");
			elt.setAttribute("speech", "");
		}
		, searchBoxes
		// Google TLDs list from http://www.thomasbindl.com/blog/?title=list_of_googel_tlds
		, googleTLDs = "com de at pl fr nl it com.tr es ch be gr com.br lu fi pt hu hr bg com.mx si sk ro ca co.uk cl com.ar se cz dk co.th com.co lt co.id co.in co.il com.eg cn co.ve ru co.jp com.pe com.au co.ma co.za com.ph com.sa ie co.kr no com.ec com.vn lv com.mt com.uy ae ba co.nz com.ua co.cr ee com.do com.tw com.hk com.my com.sv com.pr lk com.gt com.bd com.pk is li com.bh com.ni com.py com.ng com.bo co.ke hn com.sg mu ci jo nu com.jm com.ly co.yu tt com.kh ge com.na com.et sm cd gm com.qa dj com.cu com.pa gp az as pl mn ht md am sn je com.bn com.ai co.zm ma rw co.ug com.vc com at com.gi to com.om kz co.uz"
			.replace(/\./g, "\\.").split(" ")
		, supportedGoogleSubdomains = "www encrypted code video maps news books scholar blogsearch".split(" ")
		, supportedGooglePaths = " webhp search maps imghp news prdhp bkshp finance schhp realtime".split(" ")
		, googleHostRegex = new RegExp("(?:" + supportedGoogleSubdomains.join("|") + ")+\.google\\.(?:" + googleTLDs.join("|") + ")$")
		, simpleCases = [
			  {host: "duckduckgo.com", selectors: ["#hfih", "#hfi"], margin: "6px 0 0 0"}
			, {host: "bing.com", selectors: "input[name='q']", margin: "2px 0 0 0"}
			, {host: "yahoo.com", selectors: "input[name='p']", margin: "4px 0 0 0"}
			, {host: "wikpedia.org", excludedPaths: "/", selectors: "#searchInput", margin: "3px 0 0 0"}
			, {host: "wolframalpha.com", selectors: "#i"}
			, {host: "github.com", allowedPaths: "/search", selectors:"#search_form input[name='q']", margin: "3px 0 0 0"}
			, {host: "reddit.com", selectors: "input[name='q']", margin: "3px 0 0 0"}
			, {host: "twitter.com", excludedSubdomains: "search", selectors: "#search-query", margin: "5px 1.4em 0 0"}
			, {host: "facebook.com", selectors: "#q", margin: "2px 0 0 0"}
			, {host: "youtube.com", selectors: "#masthead-search-term", margin:"3px 0 0 0"}
		]
		, i = simpleCases.length
		, j
		, arr = function (maybeArray) {
			return [].concat(maybeArray);
		}
		, filter
		, selectors
		, css
	;
	// process simple cases
	while (i--) {
		if (host === simpleCases[i].host) {
			if ( // apply filters
				(simpleCases[i].excludedSubdomains &&
					((filter = arr(simpleCases[i].excludedSubdomains))[0] && filter.indexOf(subdomain) !== -1)) ||
				(simpleCases[i].allowedSubdomains &&
					((filter = arr(simpleCases[i].allowedSubdomains))[0] && filter.indexOf(subdomain) === -1)) ||
				(simpleCases[i].excludedPaths &&
					((filter = arr(simpleCases[i].excludedPaths))[0] && filter.indexOf(path) !== -1)) ||
				(simpleCases[i].allowedPaths &&
					((filter = arr(simpleCases[i].allowedPaths))[0] && filter.indexOf(path) === -1))
			) {
					break;
			}
			selectors = arr(simpleCases[i].selectors);
			searchBoxes = $(selectors.join(", "));
			j = searchBoxes.length;
			if (j) {
				while (j--) {
					addSpeechInput(searchBoxes.item(j));
				}
				css = selectors.join("::-webkit-input-speech-button, ") + "::-webkit-input-speech-button {" +
					"float: right;";
				if (simpleCases[i].margin) {
					css += "margin: " + simpleCases[i].margin + ";";
				}
				css += "}";
				injectCSS(css);
			}
			break;
		}
	}
	if (googleHostRegex.test(location.hostname)) {
		searchBoxes = $("input[name='q']");
		var
			  googleSubdomain
			, googlePath
			, topMargin = 2
		;
		i = searchBoxes.length;
		// code.google.com has consistent search boxes on every page
		if (i && subdomain === "code" || (
				(googleSubdomain = supportedGoogleSubdomains.indexOf(subdomain)) !== -1 &&
				(googlePath = supportedGooglePaths.indexOf(path.slice(1))) !== -1
			)
		) {
			if (googleSubdomain === 5) {
				topMargin = 5;
			} else if (googlePath === 8) {
				topMargin = 4;
			}
			while (i--) {
				addSpeechInput(searchBoxes.item(i));
			}
			injectCSS(
				"input[name='q']::-webkit-input-speech-button {" +
					"float: right;" +
					"margin-top: " + topMargin + "px;" +
				"}"
			);
		}
	} else {
		// general solution for any site using an HTML5 input type=search
		// field (e.g. GitHub, Wikipedia home page)
		searchBoxes = $("input[type='search']");
		i = searchBoxes.length;
		while (i--) {
			addSpeechInput(searchBoxes.item(i));
		}
	}
}

, port = chrome.extension.connect({name: chrome.extension.getURL("")})
, initListener = function (contentScriptEnabled) {
	port.onMessage.removeListener(initListener);
	if (contentScriptEnabled) {
		init();
	}
}
;

port.onMessage.addListener(initListener);

}());