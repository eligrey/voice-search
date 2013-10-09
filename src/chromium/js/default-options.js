/*! Voice Search Chromium Extension
 *
 *  Copyright 2012 Eli Grey
 *  	See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global localStorage, i18n*/

var catincan_config = {
	name: "voice-search-one-click-functionality-and-chrome-os-integration"
};

(function() {
"use strict";
var opts = localStorage;
if (!opts.search_engines) {
	opts.search_engines = JSON.stringify([
		  {
			  "name": i18n("google_search_name")
			, "uri": i18n("google_search_uri_template")
		}
		, {
			  "name": "Search for"
			, "uri": i18n("google_search_uri_template")
			, "in_popup": false
		}		, {
			  "name": i18n("duckduckgo_search_name")
			, "uri": i18n("duckduckgo_search_uri_template")
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
			  "name": "Images of"
			, "uri": i18n("google_images_search_uri_template")
			, "in_popup": false
		}		, {
			  "name": "Pictures of"
			, "uri": i18n("google_images_search_uri_template")
			, "in_popup": false
		}
		, {
			  "name": i18n("google_maps_search_name")
			, "uri": i18n("google_maps_search_uri_template")
		}
		, {
			  "name": "Where is"
			, "uri": i18n("google_maps_search_uri_template")
			, "in_popup": false
		}
		, {
			  "name": i18n("google_videos_search_name")
			, "uri": i18n("google_videos_search_uri_template")
		}
		, {
			  "name": "Videos of"
			, "uri": i18n("google_videos_search_uri_template")
			, "in_popup": false
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
			  "name": "Calculate"
			, "uri": i18n("wolframalpha_search_uri_template")
			, "in_popup": false
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