/*! Voice Search Chromium Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global i18n, chrome, localStorage, location, document, Option*/

// manually set localStorage.debug to "1" in the console to enable debug mode
const DEBUG = !!+localStorage.debug;

if (DEBUG && location.pathname !== "/views/popup-debug.xhtml") {
	location.replace("/views/popup-debug.xhtml");
}

(function (document) {
"use strict";
var
	  opts = localStorage
	, $ = function (id) {
		return document.getElementById(id);
	}
	, open_search_query = function (name, template_uri, query) {
		chrome.tabs.create({
			  url: template_uri.replace(/%s/g, encodeURIComponent(query))
			, selected: true
		});
	}
	, voice_search_input = $("voice-search")
	, search_engine_select = $("search-engines")
	, speech_change_event = ("onspeechchange" in document.createElement("input") ? "" : "webkit")
		+ "speechchange"
	, search_engines = JSON.parse(opts.search_engines)
	, search_engine_regexs = []
	, punctuation = /[,"'?!;:#$%&()*+\/<>=@\[\]\\\^_{}\|~.\-]+/g
	, whitespace = /\s+/g
	, mid_word_capitalization = /([a-z])([A-Z])/g
	, search_engine_regex
	, i = 0
	, len = search_engines.length
	, on_speech_change = function (event) {
		var
			  query = "results" in event ?
			  	event.results.item(0).utterance : event.target.value
			, selected = search_engine_select.selectedIndex
		;
		if (!DEBUG) {
			// hide any text from showing behind the voice input button
			event.target.value = "";
		}
		if (!selected) {
			// attempt to discern a dictation to use a specific search engine
			var
				  specific_search_engine_query
				, i = search_engines.length
				// longest matching search engine detected
				// for cases like 'google: videos foobar' vs 'google videos: foobar'
				, best_match = {matched: false}
			;
			while (i--) {
				specific_search_engine_query = query.match(search_engine_regexs[i]);
				if (specific_search_engine_query !== null) {
					if (!best_match.matched ||
						best_match.name.length < search_engines[i].name.length
					) {
						best_match.matched = true;
						best_match.name = search_engines[i].name;
						best_match.uri = search_engines[i].uri;
						best_match.query = specific_search_engine_query[2];
					}
				}
			}
			if (!best_match.matched) {
				// use default search engine if no match
				best_match = search_engines[0];
				best_match.query = query;
			}
			open_search_query(best_match.name, best_match.uri, best_match.query);
		} else {
			open_search_query(
				  search_engine_select.children.item(selected).firstChild.data
				, search_engine_select.value
				, query
			);
		}
	}
;
for (; i < len; i++) {
	// make regexps for matching commands dictated for a certain search engine
	search_engine_regex = "^(" +
		search_engines[i].name
			// punctuation optional
			.replace(punctuation, "\\W*")
			// whitespace optional
			.replace(whitespace, "\\s*")
			// allow possible spaces from capitalization (e.g. YouTube ~ You Tube)
			.replace(mid_word_capitalization, "$1\\s*$2") +
		")\\s+([\\s\\S]+)$" // query capture group
	;
	search_engine_regexs.push(new RegExp(search_engine_regex, "i"));
}
search_engine_select.children.item(0).value = search_engines[0].uri;
for (i = 0, len = search_engines.length; i < len; i++) {
	search_engine_select.appendChild(new Option(
		search_engines[i].name, search_engines[i].uri
	));
}
if (DEBUG) {
	var
		  form = $("debug")
		, test_query_btn = $("test-query")
		, debug_engine_name = $("debug-engine-name").appendChild(document.createTextNode(""))
		, debug_query = $("debug-query").appendChild(document.createTextNode(""))
		, debug_URI = $("debug-uri").appendChild(document.createTextNode(""))
	;
	open_search_query = function (name, template_uri, query) {
		debug_engine_name.data = name;
		debug_query.data = query;
		debug_URI.data = template_uri.replace(/%s/g, encodeURIComponent(query));
	};
	form.addEventListener("submit", function (event) {
		event.preventDefault();
	}, false);
	test_query_btn.addEventListener("DOMActivate", function () {
		on_speech_change({target: voice_search_input});
	}, false);
} else {
	voice_search_input.addEventListener(speech_change_event, on_speech_change, false);
}
}(document));
