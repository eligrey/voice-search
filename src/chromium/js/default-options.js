/*! Voice Search Google Chrome Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global localStorage, i18n*/

"use strict";

if (!localStorage.length) {
	localStorage.debug = 0;
	localStorage.searchEngines = JSON.stringify([
		  {
			  "name": i18n("google_search_name")
			, "uri": i18n("google_search_uri_template")
		}
		, {
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
	localStorage.websiteIntegration = 1;
}
