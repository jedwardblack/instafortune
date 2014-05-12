var __currentTheme = arguments[0].currentTheme;
var __onEmoticonSelected = arguments[0].onEmoticonSelected;

var TiParse = require('tiparse');
var TiParse = new TiParse();

var themes = [];
var emoticonsRetrievedByTheme = {};


var RETRIEVE_LIMIT = 30;
var IMG_HEIGHT = 93;
var IMG_WIDTH = 93;
var COLUMN_COUNT = 3;

// padding before first row.
var PAGE_TOP_PADDING = 30;

// padding before first column.
var PAGE_LEFT_PADDING = 0;

// padding between rows.
var TOP_PADDING = 10;

// padding between columns.
var LEFT_PADDING = 10;



/**
 * Retrieve the names of all themes.
 * @param {Object} callback
 */
function retrieveThemes(callback) {
	var t = TiParse.Object.extend("Theme");
	var query = new TiParse.Query(t);
	query.exists("name");
	query.find({
		success: function(results) {
			results.forEach(function(e){
				var themeName = e.get("name"); 
				themes.push(themeName);	
				emoticonsRetrievedByTheme[themeName] = {allRetrieved: false, count: 0, currentlyRetrieving: false};
			});
			callback(null, themes);		
		},
		error: function(error) {
			callback(error, null);
		}
	});
}



/**
 * 
 * @param {Object} args 
 */
function loadEmoticonSelector() {
	$.activityIndicator.show();
	themes.forEach(function(theme){
		var view = Ti.UI.createView({
			backgroundColor: "rgba(0,0,0,0.7)",
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			zIndex: 5001	
		});
		
		
		var scrollView = Ti.UI.createScrollView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			showVerticalScrollIndicator: true
			
		});
		
		scrollView.add(Ti.UI.createLabel({
			text: theme,
			top: "5dip",
			font: {fontSize: "24pt", fontFamily: "Helvetica", fontStyle: "normal"},
			color: "#ffffff",
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
		}));
		
		view.add(scrollView);
		
		$.scrollableView.addView(view);
		if ( theme === __currentTheme ) {
			$.scrollableView.scrollToView(view);
		}
	});
	loadMoreEmoticonOptions($.scrollableView.getCurrentPage());
}



function loadMoreEmoticonOptions(pageNumber) {
	var theme = themes[pageNumber];
	if ( emoticonsRetrievedByTheme[theme].allRetrieved == true || emoticonsRetrievedByTheme[theme].currentlyRetrieving == true) {
		return;
	}
	
	Ti.API.info("Loading more emoticons for " + theme);
		
	// row and col are zero indexed.
	var row = emoticonsRetrievedByTheme[theme].count / COLUMN_COUNT;
	var col = 0;
	retrieveMoreEmoticonOptions(theme, function(err, emoticons){
		if ( err ) {
			// TODO: Handle this 
			Ti.API.error(err);
		} else {
			emoticons.forEach(function(emoticon) {
				var top = ((TOP_PADDING * (row + 1)) + (IMG_HEIGHT * row) + PAGE_TOP_PADDING) + "dip";
                var left = ((LEFT_PADDING * (col + 1)) + (IMG_WIDTH * col) + PAGE_LEFT_PADDING) + "dip";
                
                var emoticonView = Ti.UI.createImageView({ top: top, left: left, image: emoticon.image, width: IMG_WIDTH, height: IMG_HEIGHT});
				
				emoticonView.addEventListener('click', function(e){
					__onEmoticonSelected(emoticon);
				});
				
				$.scrollableView.views[pageNumber].children[0].add(emoticonView);
                
                if ( col == (COLUMN_COUNT - 1) ) {
                	col = 0;
                	row++;
                } else {
                	col++;
                }	
			});
		}		
	});
}



function retrieveMoreEmoticonOptions(theme, callback) {
	
	$.activityIndicator.show();
	var b = TiParse.Object.extend("Emoticon");
	var query = new TiParse.Query(b);
	query.equalTo("theme", theme);
	query.limit(RETRIEVE_LIMIT);
	query.descending("createdAt");
	query.skip(emoticonsRetrievedByTheme[theme].count);
	query.find({
		success: function(results) {
			// TODO: Hide activity indicator, unlock all scrolling
			emoticonsRetrievedByTheme[theme].count += results.length;
			if (results.length < RETRIEVE_LIMIT) {
				emoticonsRetrievedByTheme[theme].allRetrieved = true;
			}
			emoticonsRetrievedByTheme[theme].currentlyRetrieving = false;
			var emoticons = [];
			results.forEach(function(emoticon){
				emoticons.push({
					image: emoticon.get("image")._url, 
					theme: emoticon.get("theme"),
					objectId: emoticon.get("objectId")	
				});
			});
			$.activityIndicator.hide();
			callback(null, emoticons);		
		},
		error: function(error) {
			// TODO: Hide activity indicator, unlock all scrolling
			emoticonsRetrievedByTheme[theme].currentlyRetrieving = false;
			$.activityIndicator.hide();
			callback(error, null);
		}
	});
}



$.scrollableView.addEventListener('scrollend', function(e){
	var theme = themes[$.scrollableView.getCurrentPage()];
	if (emoticonsRetrievedByTheme[theme].count == 0) {
		loadMoreEmoticonOptions($.scrollableView.getCurrentPage());	
	}
	
});



retrieveThemes(function(err){
	if ( !err ) {
		loadEmoticonSelector();
	}
});
