/*! Voice Search Chromium Extension
 *
 *  By Eli Grey, http://eligrey.com
 *  License: MIT/X11. See LICENSE.md
 */

/*jslint laxbreak: true, strict: true*/

"use strict";

(function () {
	var
		  opts = localStorage
		, $id = function (id) {
			return document.getElementById(id);
		}
		, saveBtn = $id("save")
		, restoreDefaultsBtn = $id("restore-defaults")
		, websiteIntegrationCheckbox = $id("enable-website-integration")
		, status = $id("status")
		, message
		, messageTimeout
		, updateStatus = function (messageText) {
			if (message) {
				clearTimeout(messageTimeout);
				status.removeChild(message);
			}
			message = status.appendChild(document.createTextNode(messageText));
			messageTimeout = setTimeout(function() {
				status.removeChild(message);
				message = null;
			}, 4000);
		}
		, searchEngines = JSON.parse(opts.searchEngines)
		, grid
		, originRegex = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::\d+)?/
		, uriFormatter = function (row, cell, value, columnDef, dataContext) {
			value = value || "";
			var
				  origin = value.match(originRegex)
				, favicon = "chrome://favicon/"
			;
			if (origin) {
				favicon += origin[0];
			}
			return "<img src='" + favicon + "' /> " + value;
		}
		, saveOpts = function () {
			opts.searchEngines = JSON.stringify(grid.getData());
			opts.websiteIntegration = +websiteIntegrationCheckbox.checked;
			updateStatus(i18n("opts_settings_saved"));
		}
		, restoreOpts = function () {
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
				, formatter: uriFormatter
				, editor: TextCellEditor
			}
		]
		, options = {
			editable: true,
			enableAddRow: true,
			enableRowReordering: true,
			enableCellNavigation: true,
			forceFitColumns: true,
			autoEdit: false
		}
	;
	
	websiteIntegrationCheckbox.checked = !!+opts.websiteIntegration;
	
	saveBtn.addEventListener("DOMActivate", saveOpts, false);
	restoreDefaultsBtn.addEventListener("DOMActivate", restoreOpts, false);
	
	function selectMultipleRows() {
		if (!Slick.GlobalEditorLock.commitCurrentEdit()) { return; }
		grid.setSelectedRows([0,1,2]);
	}

	grid = new Slick.Grid($("#search-engines"), searchEngines, columns, options);
	
	$("#search-engines")
		.bind("draginit", function(e,dd) {
			var cell = grid.getCellFromEvent(e);
			if (!cell)
				return false;

			dd.row = cell.row;
			if (!searchEngines[dd.row])
				return false;

			if (Slick.GlobalEditorLock.isActive() && !Slick.GlobalEditorLock.cancelCurrentEdit())
				return false;
		})
		.bind("dragstart", function(e,dd) {
			var selectedRows = grid.getSelectedRows();

			if (!selectedRows.length || $.inArray(dd.row,selectedRows) == -1) {
				selectedRows = [dd.row];
				grid.setSelectedRows(selectedRows);
			}

			dd.rows = selectedRows;
			dd.count = selectedRows.length;

			var proxy = $("<span></span>")
				.css({
					position: "absolute",
					display: "inline-block",
					padding: "4px 10px",
					background: "#e0e0e0",
					border: "1px solid gray",
					"z-index": 99999,
					"border-radius": "8px",
					"-webkit-box-shadow": "2px 2px 6px silver",
					"box-shadow": "2px 2px 6px silver"
					})
				.text(i18n("opts_delete_drag"))
				.appendTo("body");

			dd.helper = proxy;

			$(dd.available).css("background-color","transparent");

			return proxy;
		})
		.bind("drag", function(e,dd) {
			dd.helper.css({top: e.pageY + 5, left: e.pageX + 5});
		})
		.bind("dragend", function(e,dd) {
			dd.helper.remove();
			$(dd.available).css("background-color","transparent");
		});


	$("#delete-search-engine")
		.bind("dropstart", function(e,dd) {
			$(this).css("background-color","red");
		})
		.bind("dropend", function(e,dd) {
			$(dd.available).css("background-color","transparent");
		})
		.bind("drop", function(e,dd) {
			var rowsToDelete = dd.rows.sort().reverse();
			for (var i=0; i<rowsToDelete.length; i++) {
				searchEngines.splice(rowsToDelete[i],1);
			}
			grid.invalidate();
			grid.setSelectedRows([]);
		});
	
	

	
	grid.onAddNewRow = function(newItem,columnDef) {
		var item = {name:"", uri: ""};
		$.extend(item,newItem);
		searchEngines.push(item);
		grid.removeRows([searchEngines.length - 1]);
		grid.updateRowCount();
		grid.render();
	};

	grid.onBeforeMoveRows = function(rows, insertBefore) {
		for (var i = 0; i < rows.length; i++) {
			// no point in moving before or after itself
			if (rows[i] == insertBefore || rows[i] == insertBefore - 1) return false;
		}

		return true;
	};

	grid.onMoveRows = function(rows,insertBefore) {
		var extractedRows = [], left, right;
		left = searchEngines.slice(0,insertBefore);
		right = searchEngines.slice(insertBefore,searchEngines.length);

		for (var i=0; i<rows.length; i++) {
			extractedRows.push(searchEngines[rows[i]]);
		}

		rows.sort().reverse();

		for (var i=0; i<rows.length; i++) {
			var row = rows[i];
			if (row < insertBefore)
				left.splice(row,1);
			else
				right.splice(row-insertBefore,1);
		}

		searchEngines = left.concat(extractedRows.concat(right));

		var selectedRows = [];
		for (var i=0; i<rows.length; i++)
			selectedRows.push(left.length+i);

		grid.setData(searchEngines);
		grid.setSelectedRows(selectedRows);
		grid.render();
	}
	
	if (/^Win\d*$/.test(navigator.platform)) {
		var style = document.createElement("style");
		document.documentElement.appendChild(style);
		style.sheet.insertRule(
			  "h1,h2,h3,h4,h5,h6,legend{text-shadow:transparent 0 0 1px}"
			, style.sheet.cssRules.length
		);
	}
}());
