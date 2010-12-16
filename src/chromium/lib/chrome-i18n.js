/* Chrome DOM I18N: Easy i18n for your Chrome extensions and apps' DOM.
 * 2010-12-12
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

"use strict";
var i18n = function (key) {
	return chrome.i18n.getMessage(key);
};
(function () {
	var
		  doc = document
		, localeText = doc.querySelectorAll("[data-i18n]")
		, elt
		, terms
		, term
		, i = localeText.length
		, j
	;
	while (i--) {
		elt = localeText.item(i);
		terms = elt.dataset.i18n.split(/\s*,\s*/);
		delete elt.dataset.i18n;
		j = terms.length;
		while (j--) {
			term = terms[j].split(/\s*=\s*/);
			if (term.length > 1 && isNaN(term[0])) {
				elt.setAttribute(term[0], i18n(term[1]));
			} else {
				elt.insertBefore(
					  doc.createTextNode(i18n(term[term.length - 1]))
					, elt.children.item(+term[0] || 0)
				);
			}
		}
	}
}());