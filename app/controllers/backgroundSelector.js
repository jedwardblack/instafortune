var __currentBackgroundId = arguments[0].currentBackgroundId;
var __currentTheme = arguments[0].currentTheme;
var __onBackgroundSelected = arguments[0].onBackgroundSelected;

var TiParse = require('tiparse');
var TiParse = new TiParse();

var themes = [];
var backgroundsRetrievedByTheme = {};


var BG_RETRIEVE_LIMIT = 30;
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
				backgroundsRetrievedByTheme[themeName] = {allRetrieved: false, count: 0, currentlyRetrieving: false};
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
function loadBackgroundSelector() {
	themes.forEach(function(theme){
		var view = Ti.UI.createView({
			backgroundColor: "rgba(0,0,0,0.7)",
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			zIndex: 50001	
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
	loadMoreBackgroundOptions($.scrollableView.getCurrentPage());
}



/**
 * Loads more background images onto the given page.
 */
function loadMoreBackgroundOptions(pageNumber) {
	
	var theme = themes[pageNumber];
	if ( backgroundsRetrievedByTheme[theme].allRetrieved == true || backgroundsRetrievedByTheme[theme].currentlyRetrieving == true) {
		return;
	}
	
	Ti.API.info("Loading more backgrounds for " + theme);
		
	// row and col are zero indexed.
	var row = backgroundsRetrievedByTheme[theme].count / COLUMN_COUNT;
	var col = 0;
	retrieveMoreBackgroundOptions(theme, function(err, backgrounds){
		if ( err ) {
			// TODO: Handle this 
			Ti.API.error(err);
		} else {
			backgrounds.forEach(function(background) {
				var top = ((TOP_PADDING * (row + 1)) + (IMG_HEIGHT * row) + PAGE_TOP_PADDING) + "dip";
                var left = ((LEFT_PADDING * (col + 1)) + (IMG_WIDTH * col) + PAGE_LEFT_PADDING) + "dip";
                
                var previewContainer = Ti.UI.createView({
					width: Ti.UI.SIZE,
					height: Ti.UI.SIZE,
					top: top,
					left: left	                	
                });
                
                var circleBorderImage = Ti.UI.createImageView({
					width: IMG_WIDTH + "dip", 
					height: IMG_HEIGHT + "dip", 
					image: "/circle_border_with_shadow.png"
				});
	
				var modifierPreviewImage = Ti.UI.createImageView({
					width: "88 dip", 
					height: "88 dip", 
					borderRadius: Ti.Platform.osname == "android" ? 100 : 50,
					image: background.imagePreview
				});
				
				previewContainer.add(modifierPreviewImage);
				previewContainer.add(circleBorderImage);
	
                previewContainer.addEventListener('click', function(e){
					__onBackgroundSelected(background);
				});
				
				$.scrollableView.views[pageNumber].children[0].add(previewContainer);
                
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



function retrieveMoreBackgroundOptions(theme, callback) {
	$.activityIndicator.show();
	var b = TiParse.Object.extend("Background");
	var query = new TiParse.Query(b);
	query.equalTo("theme", theme);
	query.limit(BG_RETRIEVE_LIMIT);
	query.descending("createdAt");
	query.skip(backgroundsRetrievedByTheme[theme].count);
	query.find({
		success: function(results) {
			// TODO: Hide activity indicator, unlock all scrolling
			backgroundsRetrievedByTheme[theme].count += results.length;
			if (results.length < BG_RETRIEVE_LIMIT) {
				backgroundsRetrievedByTheme[theme].allRetrieved = true;
			}
			backgroundsRetrievedByTheme[theme].currentlyRetrieving = false;
			var backgrounds = [];
			results.forEach(function(background){
				backgrounds.push({
					image: background.get("image")._url, 
					imagePreview: background.get("imagePreview")._url, 
					theme: background.get("theme"),
					objectId: background.get("objectId")	
				});
			});
			$.activityIndicator.hide();
			callback(null, backgrounds);		
		},
		error: function(error) {
			// TODO: Hide activity indicator, unlock all scrolling
			backgroundsRetrievedByTheme[theme].currentlyRetrieving = false;
			$.activityIndicator.hide();
			callback(error, null);
		}
	});
}



$.scrollableView.addEventListener('scrollend', function(e){
	var theme = themes[$.scrollableView.getCurrentPage()];
	if (backgroundsRetrievedByTheme[theme].count == 0) {
		loadMoreBackgroundOptions($.scrollableView.getCurrentPage());	
	}
	
});



retrieveThemes(function(err){
	if ( !err ) {
		loadBackgroundSelector();
	}
});
