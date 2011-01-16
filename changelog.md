Voice Search Changelog
======================

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