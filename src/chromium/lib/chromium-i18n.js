/* Chromium DOM i18n: Easy i18n for your Chromium extensions and apps' DOM.
 * 2011-04-05
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self */

"use strict";
(function (view) {
	var
		i18n = view.i18n = function (key) {
			return view.chrome.i18n.getMessage(key);
		}
		, doc = view.document
		, localeText = doc.querySelectorAll("[data-i18n]")
		, i = localeText.length
		, j
		, elt
		, terms
		, term
		, child
		, len
	;
	while (i--) {
		elt = localeText.item(i);
		terms = elt.dataset.i18n.split(/\s*,\s*/);
		delete elt.dataset.i18n;
		child = j = 0;
		len = terms.length;
		for (; j < len; j++) {
			term = terms[j].split(/\s*=\s*/);
			if (term.length > 1 && isNaN(term[0])) {
				elt.setAttribute(term[0], i18n(term[1]));
			} else {
				if (term.length === 1) {
					child++;
				} else {
					child = +term[0];
				}
				elt.insertBefore(
					  doc.createTextNode(i18n(term[term.length - 1]))
					, elt.children.item(child - 1)
				);
			}
		}
	}
}(self));