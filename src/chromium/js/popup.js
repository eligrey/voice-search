/*! Voice Search Google Chrome Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global localStorage, location, document, open, Option*/

// manually set localStorage.debug to "1" in the console to enable debug mode
const DEBUG = !!+localStorage.debug;

if (DEBUG && location.pathname !== "/views/popup-debug.xhtml") {
	location.replace("/views/popup-debug.xhtml");
}

"use strict";

(function () {
var
	  opts = localStorage
	, doc = document
	, $ = function (id) {
		return doc.getElementById(id);
	}
	, openSearchQuery = function (name, query, templateURI) {
		chrome.tabs.create({
			  url: templateURI.replace("%s", encodeURIComponent(query))
			, selected: true
		});
	}
	, voiceSearch = $("voice-search")
	, searchEngineSelect = $("search-engines")
	, speechChangeEvent = (voiceSearch.onspeechchange === null ? "" : "webkit")
		+ "speechchange"
	, searchEngines = JSON.parse(opts.searchEngines)
	, searchEngineRegexs = []
	, periods = /\./g
	, dashes = /-/g
	, punctuation = /[,"'?!;:#$%&()*+\/<>=@\[\]\\\^_{}\|~.\-]+/g
	, whitespace = /\s+/g
	, midWordCapitalization = /([a-z])([A-Z])/g
	, dictatedPeriod = i18n("dictated_period_regex")
	, dictatedDash = i18n("dictated_dash_regex")
	, searchEngineRegex
	, i = 0
	, len = searchEngines.length
	, onSpeechChange = function (event) {
		var
			  query = event.target.value // event.target.results.item(0).utterance
			, selected = searchEngineSelect.selectedIndex
		;
		if (!DEBUG) {
			// hide any text from showing behind the voice input button
			event.target.value = "";
		}
		if (!selected) {
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
				openSearchQuery(bestMatch.name, bestMatch.query, bestMatch.uri);
			} else {
				// otherwise use the default search engine
				openSearchQuery(
					  searchEngineSelect.children.item(1).firstChild.data
					, query
					, searchEngineSelect.children.item(1).value
				);
			}
		} else {
			openSearchQuery(
				  searchEngineSelect.children.item(selected).firstChild.data
				, query
				, searchEngineSelect.value
			);
		}
	}
;
for (; i < len; i++) {
	// make regexps for matching commands dictated for a certain search engine
	searchEngineRegex = "^(" +
		searchEngines[i].name
			// punctuation optional
			.replace(punctuation, "\\W*")
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
if (DEBUG) {
	var
		  form = $("debug")
		, testQueryBtn = $("test-query")
		, debugEngineName = $("debug-engine-name").appendChild(doc.createTextNode(""))
		, debugQuery = $("debug-query").appendChild(doc.createTextNode(""))
		, debugURI = $("debug-uri").appendChild(doc.createTextNode(""))
	;
	openSearchQuery = function (name, query, templateURI) {
		debugEngineName.data = name;
		debugQuery.data = query;
		debugURI.data = templateURI.replace("%s", encodeURIComponent(query));
	};
	form.addEventListener("submit", function (event) {
		event.preventDefault();
	}, false);
	testQueryBtn.addEventListener("DOMActivate", function () {
		onSpeechChange({target: voiceSearch});
	}, false);
} else {
	voiceSearch.addEventListener(speechChangeEvent, onSpeechChange, false);
}
}());
