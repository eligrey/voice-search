/*! Voice Search Chromium Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global location, document, chrome*/

(function(document) {
"use strict";

var init = function(website_integration) {
	if (website_integration === "none") {
		return;
	}
	var
		  full_host = location.hostname
		, host = full_host.split(".").slice(-2).join(".")
		, $ = function(query) {
			return document.querySelectorAll(query);
		}
		, inject_CSS = function() {
			var
				  style = document.createElement("style")
				, rules = arguments
				, i = 0
				, len = rules.length
			;
			document.documentElement.appendChild(style);
			for (; i < len; i++) {
				style.sheet.insertRule(rules[i], style.sheet.cssRules.length);
			}
		}
		, submit = function(event) {
			var target = event.target;
			if (!target.grammar && !target.webkitGrammar) {
				// don't auto-submit if a grammar is specified (compatibility with Google)
				target.form.submit();
			}
		}
		, speech_change_event = ("onspeechchange" in document.createElement("input") ? "" : "webkit")
			+ "speechchange"
		, add_speech_input = function(elts, auto_submit) {
			if (elts === null) {
				return;
			}
			var
				  i = elts.length
				, elt
			;
			while (i--) {
				elt = elts[i];
				if (auto_submit && !elt.speech && !elt.webkitSpeech) {
					// don't auto-submit if speech is already being used
					elt.addEventListener(speech_change_event, submit, false);
				}
				elt.speech = elt.webkitSpeech = true;
			}
		}
		, inputs
		// Google TLDs list from http://www.thomasbindl.com/blog/?title=list_of_googel_tlds
		, google_TLDs = "com de at pl fr nl it com.tr es ch be gr com.br lu fi pt hu hr bg com.mx si sk ro ca co.uk cl com.ar se cz dk co.th com.co lt co.id co.in co.il com.eg cn co.ve ru co.jp com.pe com.au co.ma co.za com.ph com.sa ie co.kr no com.ec com.vn lv com.mt com.uy ae ba co.nz com.ua co.cr ee com.do com.tw com.hk com.my com.sv com.pr lk com.gt com.bd com.pk is li com.bh com.ni com.py com.ng com.bo co.ke hn com.sg mu ci jo nu com.jm com.ly co.yu tt com.kh ge com.na com.et sm cd gm com.qa dj com.cu com.pa gp az as pl mn ht md am sn je com.bn com.ai co.zm ma rw co.ug com.vc com at com.gi to com.om kz co.uz"
			.replace(/\./g, "\\.").split(" ")
		, supported_google_subdomains = "www encrypted code video maps news books scholar blogsearch".split(" ")
		, google_hosts = new RegExp("(?:" + supported_google_subdomains.join("|") + ")+\\.google\\.(?:" + google_TLDs.join("|") + ")$")
		, sites = [
			  {host: google_hosts, selectors: "input[name='q']"}
			, {host: "duckduckgo.com", selectors: ["#hfih", "#hfi"], margin: "2px 0 0 0"}
			, {host: "bing.com", selectors: "input[name='q']"}
			, {host: "yahoo.com", selectors: "input[name='p']"}
			, {host: "wikipedia.org", selectors: "input[name='search']"}
			, {host: "wolframalpha.com", selectors: "#i"}
			, {host: "github.com", selectors: "#search_form input[name='q']"}
			, {host: "reddit.com", selectors: "input[name='q']", margin: "3px 0 0 0"}
			, {host: "twitter.com", selectors: "#search-query", margin: "0 25px 0 0"}
			, {host: "facebook.com", selectors: "#q"}
			, {host: "youtube.com", selectors: "#masthead-search-term"}
		]
		, i = sites.length
		, arr = function(maybe_array) {
			return [].concat(maybe_array);
		}
		, selectors
		, css
	;
	// process non-HTML5 input type=search sites
	while (i--) {
		if (
			   (typeof sites[i].host === "string" && host === sites[i].host)
			|| (sites[i].host instanceof RegExp && sites[i].host.test(full_host))
		) {
			selectors = arr(sites[i].selectors);
			inputs = $(selectors.join(","));
			if (inputs !== null) {
				add_speech_input(inputs, true);
				css = selectors.join("::-webkit-input-speech-button,") + "::-webkit-input-speech-button{";
				//	+ "float: right;";
				if (sites[i].margin) {
					css += "margin:" + sites[i].margin + ";";
				}
				css += "}";
				inject_CSS(css);
			}
			break;
		}
	}
	// general speech input solution for any other site
	inputs = $("input[type='search']");
	add_speech_input(inputs, true);
	if (website_integration === "all") {
		inputs = $("input:not([type='search']),textarea");
		add_speech_input(inputs, false);
	}
}

, port = chrome.extension.connect({name: chrome.extension.getURL("")})
, init_listener = function(website_integration) {
	port.onMessage.removeListener(init_listener);
	init(website_integration);
}
;

port.onMessage.addListener(init_listener);

}(document));