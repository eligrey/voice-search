/*! Voice Search Chromium Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global localStorage, i18n*/

(function() {
"use strict";
var opts = localStorage;
// pre-1.0.6 Voice Search used camelCase option names
if (opts.searchEngines) {
	opts.search_engines = opts.searchEngines;
	delete opts.searchEngines;
}
if (opts.websiteIntegration) {
	if (opts.websiteIntegration === "1") {
		opts.website_integration = "all";
	} else {
		opts.website_integration = "none";
	}
	delete opts.websiteIntegration;
}

if (!opts.search_engines) {
	opts.search_engines = JSON.stringify([
		 {
			  "name": i18n("duckduckgo_search_name")
			, "uri": i18n("duckduckgo_search_uri_template")
		}
		, {
			  "name": i18n("google_search_name")
			, "uri": i18n("google_search_uri_template")
		}
		, {
			  "name": i18n("wikipedia_search_name")
			, "uri": i18n("wikipedia_search_uri_template")
		}
		, {
			  "name": i18n("google_images_search_name")
			, "uri": i18n("google_images_search_uri_template")
		}
		, {
			  "name": i18n("google_maps_search_name")
			, "uri": i18n("google_maps_search_uri_template")
		}
		, {
			  "name": i18n("google_videos_search_name")
			, "uri": i18n("google_videos_search_uri_template")
		}
		, {
			  "name": i18n("youtube_search_name")
			, "uri": i18n("youtube_search_uri_template")
		}
		, {
			  "name": i18n("wolframalpha_search_name")
			, "uri": i18n("wolframalpha_search_uri_template")
		}
		, {
			  "name": i18n("bing_search_name")
			, "uri": i18n("bing_search_uri_template")
		}
		, {
			  "name": i18n("yahoo_search_name")
			, "uri": i18n("yahoo_search_uri_template")
		}
	]);
}
if (!opts.website_integration) {
	opts.website_integration = "all";
}
if (!opts.debug) {
	opts.debug = "0";
}
}());