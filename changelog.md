Voice Search Changelog
======================

1.0.9
-----

* Made Google the default search engine again, partially in response to DuckDuckGo's
  immature FUD campaign against Google.

1.0.8
-----

* No longer auto-submitting when speech input and/or grammars are already being used.
* Fixed some margin issues.

1.0.7
-----

* Fixed debug mode.
* Fixed not replacing all instances of `%s` (for real this time).
* Added Russian locale by Pavel Argentov.
* Removed unused PayPal button icon.

1.0.6
-----

* Added a third state for website integration, which is to add speech input buttons to
  *all* input elements. This should take care Speechify.
* Using the `SpeechInputResult` interface now that Chrome stable supports it.
* Normalized code style.
* Sorta-linted all non-lib code. There are some things in JSLint that I disagree with,
  such as `in`, referencing a function in it's own definition, and `!!+` being bad.

1.0.5
-----

* Fixed the speech input microphone position on integrated websites.
* Now replacing every instance of `%s` in search engine URL templates.
* Updated the donation link on the options page to use WePay instead of PayPal.
* Updated Chromium DOM i18n (chromium-i18n.js).

1.0.4
-----

* Made DuckDuckGo the default search engine.
* Corrected image filenames to correspond to the Chromium project instead of Google
  Chrome.

1.0.3
-----

* Added OSX instructions to the readme.
* Updated Twitter search box margin in content script for a change in Twitter.
* Now using `chrome.tabs.create()` instead of `open()`.
* Removed extra copy of a microphone image.

1.0.2
-----

* Added a debug mode that can be enabled by setting `localStorage.debug` to `1`. Debug
  mode is intended for testing how queries are intepereted.
* Made column headers on the options page i18nizable.

1.0.1
-----

* Added support for multiple search boxes in website integration.
* Added YouTube to the default integrated websites.

1.0.0
-----

* Initial release.
