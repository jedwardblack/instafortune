var __currentTheme = arguments[0].currentTheme;
var __onPaperSelected = arguments[0].onPaperSelected;

var TiParse = require('tiparse');
var TiParse = new TiParse();

var themes = [];
var papersRetrievedByTheme = {};


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
				papersRetrievedByTheme[themeName] = {allRetrieved: false, count: 0, currentlyRetrieving: false};
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
function loadPaperSelector() {
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
	loadMorePaperOptions($.scrollableView.getCurrentPage());
}



function loadMorePaperOptions(pageNumber) {
	
	var theme = themes[pageNumber];
	if (papersRetrievedByTheme[theme].allRetrieved == true || papersRetrievedByTheme[theme].currentlyRetrieving == true) {
		return;
	}
	
	Ti.API.info("Loading more papers for " + theme);
		
	// row and col are zero indexed.
	var row = papersRetrievedByTheme[theme].count / COLUMN_COUNT;
	var col = 0;
	retrieveMorePaperOptions(theme, function(err, papers){
		if ( err ) {
			// TODO: Handle this 
			Ti.API.error(err);
		} else {
			papers.forEach(function(paper) {
				var top = ((TOP_PADDING * (row + 1)) + (IMG_HEIGHT * row) + PAGE_TOP_PADDING) + "dip";
                var left = ((LEFT_PADDING * (col + 1)) + (IMG_WIDTH * col) + PAGE_LEFT_PADDING) + "dip";
                
                var paperView = Ti.UI.createImageView({ top: top, left: left, image: paper.image, width: IMG_WIDTH, height: IMG_HEIGHT});
				
				paperView.addEventListener('click', function(e){
					__onPaperSelected(paper);
				});
				
				$.scrollableView.views[pageNumber].children[0].add(paperView);
                
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



function retrieveMorePaperOptions(theme, callback) {
	$.activityIndicator.show();
	var b = TiParse.Object.extend("Paper");
	var query = new TiParse.Query(b);
	query.equalTo("theme", theme);
	query.limit(RETRIEVE_LIMIT);
	query.descending("createdAt");
	query.skip(papersRetrievedByTheme[theme].count);
	query.find({
		success: function(results) {
			// TODO: Hide activity indicator, unlock all scrolling
			papersRetrievedByTheme[theme].count += results.length;
			if (results.length < RETRIEVE_LIMIT) {
				papersRetrievedByTheme[theme].allRetrieved = true;
			}
			papersRetrievedByTheme[theme].currentlyRetrieving = false;
			var papers = [];
			results.forEach(function(paper){
				papers.push({
					image: paper.get("image")._url, 
					theme: paper.get("theme"),
					topPadding: paper.get("topPadding"),
					rightPadding: paper.get("rightPadding"),
					bottomPadding: paper.get("bottomPadding"),
					leftPadding: paper.get("leftPadding"),
					objectId: paper.get("objectId")	
				});
			});
			$.activityIndicator.hide();
			callback(null, papers);		
		},
		error: function(error) {
			// TODO: Hide activity indicator, unlock all scrolling
			papersRetrievedByTheme[theme].currentlyRetrieving = false;
			$.activityIndicator.hide();
			callback(error, null);
		}
	});
}



$.scrollableView.addEventListener('scrollend', function(e){
	var theme = themes[$.scrollableView.getCurrentPage()];
	if (papersRetrievedByTheme[theme].count == 0) {
		loadMorePaperOptions($.scrollableView.getCurrentPage());	
	}
	
});



retrieveThemes(function(err){
	if ( !err ) {
		loadPaperSelector();
	}
});
