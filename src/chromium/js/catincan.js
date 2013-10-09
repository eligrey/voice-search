chrome.storage.local.get('catincan_popup_seen', function(data) {
	if (!data.catincan_popup_seen) {
		chrome.tabs.create({
			url: "https://www.catincan.com/proposal/voice-search-chrome/voice-search-one-click-functionality-and-chrome-os-integration"
			, active: true
		});
	}
	chrome.storage.local.set({
		'catincan_popup_seen': true
	});
});