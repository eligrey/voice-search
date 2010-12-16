/*! Voice Search Google Chrome Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global localStorage, document, open, Option*/
 
"use strict";

(function () {
var
	  opts = localStorage
	, doc = document
	, $ = function (id) {
		return doc.getElementById(id);
	}
	, openSearchQuery = function (query, templateURI) {
		open(templateURI.replace("%s", encodeURIComponent(query)));
	}
	, voiceSearch = $("voice-search")
	, searchEngineSelect = $("search-engines")
	, speechChangeEvent = (voiceSearch.onspeechchange === null ? "" : "webkit")
		+ "speechchange"
	, searchEngines = JSON.parse(opts.searchEngines)
	, searchEngineRegexs = []
	, periods = /\./g
	, punctuation = /[.,"'?!;:#$%&()*+-\/<>=@\[\]\\\^_{}\|~]+/g
	, whitespace = /\s+/g
	, midWordCapitalization = /([a-z])([A-Z])/g
	, dictatedPeriod = i18n("popup_dictated_period_regex")
	, searchEngineRegex
	, i = 0
	, len = searchEngines.length
;
for (; i < len; i++) {
	// make regexps for matching commands dictated for a certain search engine
	searchEngineRegex = "^(" +
		searchEngines[i].name
			// other punctuation optional
			.replace(punctuation, "\\W*")
			// periods pronounced as "dot" optional
			.replace(periods, "(?:" + dictatedPeriod + "|\\.|\\s*)")
			// whitespace optional
			.replace(whitespace, "\\s*")
			// allow possible spaces from capitalization (e.g. YouTube ~ You Tube)
			.replace(midWordCapitalization, "$1\\s*$2") +
		")\\s+([\\s\\S]+)$" // query capture group
	;
	searchEngineRegexs.push(new RegExp(searchEngineRegex, "i"));
}
searchEngineSelect.children.item(0).value = searchEngines[0].uri;
for (i = 0, len = searchEngines.length; i < len; i++) {
	searchEngineSelect.appendChild(new Option(
		searchEngines[i].name, searchEngines[i].uri
	));
}
voiceSearch.addEventListener(speechChangeEvent, function (event) {
	var query = event.target.value; // event.target.results.item(0).utterance
	event.target.value = ""; // hide any text from showing behind the voice input button
	if (!searchEngineSelect.selectedIndex) {
		// attempt to discern a dictation to use a specific search engine
		var
			  specificSearchEngineQuery
			, i = searchEngines.length
			// longest matching search engine detected
			// for cases like 'google: videos foobar' vs 'google videos: foobar'
			, bestMatch = {matched: false}
		;
		while (i--) {
			if ((specificSearchEngineQuery = query.match(searchEngineRegexs[i]))) {
				if (!bestMatch.matched ||
					bestMatch.name.length < searchEngines[i].name.length
				) {
					bestMatch.matched = true;
					bestMatch.name = searchEngines[i].name;
					bestMatch.uri = searchEngines[i].uri;
					bestMatch.query = specificSearchEngineQuery[2];
				}
			}
		}
		if (bestMatch.matched) {
			openSearchQuery(bestMatch.query, bestMatch.uri);
		} else {
			// otherwise use the default search engine
			openSearchQuery(query, searchEngineSelect.children.item(1).value);
		}
	} else {
		openSearchQuery(query, searchEngineSelect.value);
	}
}, false);
}());