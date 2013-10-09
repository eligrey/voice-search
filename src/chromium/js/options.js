/*! Voice Search Chromium Extension
 *
 *  Copyright 2012 Eli Grey
 *  	See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/
/*global
	  i18n, localStorage, navigator, location, document, setTimeout, clearTimeout
	, Slick, TextCellEditor
	, jQuery
*/


(function(document) {
	"use strict";
	var
		  $ = jQuery
		, text = function(data) {
			return document.createTextNode(data);
		}
		, opts = localStorage
		, id = function(id) {
			return document.getElementById(id);
		}
		, save_btn = id("save")
		, restore_defaults_btn = id("restore-defaults")
		, website_integration_select = id("website-integration")
		, status = id("status")
		, website_integration_options = {
			  "all": 0
			, "search": 1
			, "none": 2
		}
		, message
		, message_timeout
		, update_status = function(message_text) {
			if (message) {
				clearTimeout(message_timeout);
				status.removeChild(message);
			}
			message = status.appendChild(text(message_text));
			message_timeout = setTimeout(function() {
				status.removeChild(message);
				message = null;
			}, 4000);
		}
		, search_engines = JSON.parse(opts.search_engines)
		, grid
		, origin_regex = /^[\w\-]+:\/*\[?[\w\.:\-]+\]?(?::\d+)?/
		, URI_formatter = function(row, cell, value, columnDef, dataContext) {
			value = value || "";
			var
				  origin = value.match(origin_regex)
				, favicon = "chrome://favicon/"
			;
			if (origin) {
				favicon += origin[0];
			}
			return "<img src='" + favicon + "' /> " + value;
		}
		, save_opts = function() {
			opts.search_engines = JSON.stringify(grid.getData());
			opts.website_integration = website_integration_select.value;
			update_status(i18n("opts_settings_saved"));
		}
		, restore_opts = function() {
			opts.clear();
			location.reload();
		}
		, columns = [
			  {
				  id: "#"
				, name: ""
				, width: 40
				, behavior: "selectAndMove"
				, unselectable: true
				, resizable: false
				, cssClass: "reorder-cell dnd"
			}
			, {
				  id: "name"
				, name: i18n("opts_name_column")
				, field: "name"
				, width: 200
				, cssClass: "cell-search-engine-name"
				, editor: TextCellEditor
			}
			, {
				  id: "uri"
				, name: i18n("opts_uri_column")
				, width: 500
				, cssClass: "cell-search-engine-uri"
				, field: "uri"
				, formatter: URI_formatter
				, editor: TextCellEditor
			}
		]
		, options = {
			  editable: true
			, enableAddRow: true
			, enableRowReordering: true
			, enableCellNavigation: true
			, forceFitColumns: true
			, autoEdit: false
		}
	;
	
	website_integration_select.selectedIndex = website_integration_options[opts.website_integration];
	
	save_btn.addEventListener("click", save_opts);
	restore_defaults_btn.addEventListener("click", restore_opts);
	
	grid = new Slick.Grid(id("search-engines"), search_engines, columns, options);
	
	$("#search-engines")
		.bind("draginit", function(e, dd) {
			var cell = grid.getCellFromEvent(e);
			if (!cell) {
				return false;
			}
			dd.row = cell.row;
			if (!search_engines[dd.row]) {
				return false;
			}
			if (Slick.GlobalEditorLock.isActive() && !Slick.GlobalEditorLock.cancelCurrentEdit()) {
				return false;
			}
		})
		.bind("dragstart", function(e, dd) {
			var selectedRows = grid.getSelectedRows();

			if (!selectedRows.length || $.inArray(dd.row, selectedRows) === -1) {
				selectedRows = [dd.row];
				grid.setSelectedRows(selectedRows);
			}

			dd.rows = selectedRows;
			dd.count = selectedRows.length;

			var proxy = $(document.createElement("span"))
				.css({
					  position: "absolute"
					, display: "inline-block"
					, padding: "4px 10px"
					, background: "#e0e0e0"
					, border: "1px solid gray"
					, "z-index": 99999
					, "border-radius": "8px"
					, "-webkit-box-shadow": "2px 2px 6px silver"
					, "box-shadow": "2px 2px 6px silver"
				})
				.text(i18n("opts_delete_drag"))
				.appendTo(document.body);

			dd.helper = proxy;

			$(dd.available).css("background-color", "transparent");

			return proxy;
		})
		.bind("drag", function(e, dd) {
			dd.helper.css({top: e.pageY + 5, left: e.pageX + 5});
		})
		.bind("dragend", function(e, dd) {
			dd.helper.remove();
			$(dd.available).css("background-color", "transparent");
		});


	$("#delete-search-engine")
		.bind("dropstart", function(e,dd) {
			$(this).css("background-color","red");
		})
		.bind("dropend", function(e,dd) {
			$(dd.available).css("background-color","transparent");
		})
		.bind("drop", function(e,dd) {
			var
				  rowsToDelete = dd.rows.sort().reverse()
				, i = 0
				, len = rowsToDelete.length
			;
			for (; i < len; i++) {
				search_engines.splice(rowsToDelete[i],1);
			}
			grid.invalidate();
			grid.setSelectedRows([]);
		});
	
	grid.onAddNewRow = function(newItem,columnDef) {
		var item = {name:"", uri: ""};
		$.extend(item,newItem);
		search_engines.push(item);
		grid.removeRows([search_engines.length - 1]);
		grid.updateRowCount();
		grid.render();
	};
	grid.onBeforeMoveRows = function(rows, insertBefore) {
		var
			  i = 0
			, len = rows.length
		;
		for (; i < len; i++) {
			// no point in moving before or after itself
			if (rows[i] === insertBefore || rows[i] === insertBefore - 1) {
				return false;
			}
		}
		return true;
	};
	grid.onMoveRows = function(rows, insertBefore) {
		var
			  extractedRows = []
			, selectedRows = []
			, left
			, right
			, i = 0
			, len = rows.length
		;
		
		left = search_engines.slice(0, insertBefore);
		right = search_engines.slice(insertBefore, search_engines.length);
		
		for (; i < len; i++) {
			extractedRows.push(search_engines[rows[i]]);
		}
		
		rows.sort().reverse();
		
		for (i = 0; i < len; i++) {
			var row = rows[i];
			if (row < insertBefore) {
				left.splice(row, 1);
			} else {
				right.splice(row-insertBefore, 1);
			}
		}

		search_engines = left.concat(extractedRows.concat(right));

		for (i = 0; i < len; i++) {
			selectedRows.push(left.length + i);
		}

		grid.setData(search_engines);
		grid.setSelectedRows(selectedRows);
		grid.render();
	};
	
	if (/^Win\d*$/.test(navigator.platform)) {
		var style = document.createElement("style");
		document.documentElement.appendChild(style);
		style.sheet.insertRule(
			  "h1,h2,h3,h4,h5,h6,legend{text-shadow:transparent 0 0 1px}"
			, style.sheet.cssRules.length
		);
	}
}(document));
