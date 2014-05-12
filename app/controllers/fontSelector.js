var __onFontFamilyChange = arguments[0].onFontFamilyChange || function(){
	console.log('onFontFamilyChange not implemented.');
};

var __onFontColorChange = arguments[0].onFontColorChange || function(){
	console.log('onFontColorChange not implemented.');
};

var __onFontSizeChange = arguments[0].onFontSizeChange || function(){
	console.log('onFontSizeChange not implemented.');
};

var __onDone = arguments[0].onDone || function(){console.log("onDone not implemented");};
var __startingFontFamily = arguments[0].startingFontFamily;
var __startingFontColor = arguments[0].startingFontColor; 

var __fontTableOffset = 0;
var __currentlySelectedIndex = 0;


var STYLE_ORDERING = [
	"extraBold",
	"extraBoldItalic",
	"bold",
	"boldItalic",
	"demiBold",
	"demiBoldItalic",
	"mediumBold",
	"mediumBoldItalic",
	"normal",
	"italic",
	"mediumLight",
	"mediumLightItalic",
	"light",
	"lightItalic"];
	
var fonts = require('availableFonts').getAvailableFonts();
var colors = require('availableColors').getAvailableColors();
var pickerRows = [];

var fontsTopOffset = 0;
var fontFamilyViews = [];
var fontStylesViews = [];

fonts.forEach(function(font){
		
	var row = Ti.UI.createView({
		height: "30dip",
		width: "150dip",
		borderColor: "#ddd",
		top: fontsTopOffset + "dip",
		left: 0,
		bubbleParent: false,
		//backgroundColor: "rgba(255,255,255,0.8)"
		backgroundImage: '/IF_FontBG.png',
		backgroundRepeat: true,
	});
	
	var rowLabel = Ti.UI.createLabel({
		text: font.name,
		font: {fontSize: "10dip", fontFamily: font.styles.normal}
	});
	
	row.add(rowLabel);
	
	row.addEventListener('click', function(e){
		
		fontStylesViews.forEach(function(v){
			$.fontPicker.remove(v);
		});
		fontStylesViews = [];
		
		$.fontPicker.children.forEach(function(c){
			c.backgroundColor = "rgba(255,255,255,0.8)";
			c.children[0].color = "#000";
		});
		
		this.backgroundColor = "#999";
		this.children[0].color = "#DDD";
		
		var fontStylesOffset = row.rect.y; 
		STYLE_ORDERING.forEach(function(o){
			if ( font.styles[o] ) {
				
				var styleOption = Ti.UI.createView({
					top: fontStylesOffset + "dip",
					left: "149dip",
					borderColor: "#ddd",
					width: "30dip",
					height: "30dip",
					backgroundColor: "rgba(255,255,255,0.8)",
					bubbleParent: false	
				});
				
				styleOption.add(Ti.UI.createLabel({
					text: "Aa",
					font: {fontSize: "10dip", fontFamily: font.styles[o]},
				}));
				
				styleOption.addEventListener("click", function(e){
					fontStylesViews.forEach(function(fsv){
						fsv.backgroundColor = "rgba(255,255,255,0.8)";
						fsv.children[0].color = "#000"; 
					});
					this.backgroundColor = "#999";
					this.children[0].color = "#DDD";		
					__onFontFamilyChange({selectedFontFamily: font.styles[o]});	
				});
				
				fontStylesViews.push(styleOption);
				$.fontPicker.add(styleOption);
				fontStylesOffset += 29;
			}
		});
		
	});
	
	fontFamilyViews.push(row);
	$.fontPicker.add(row);
	
	fontsTopOffset += 29;
	
	
	
	
	/*
	var row = Ti.UI.createTableViewRow({
		title: font.name, 
		font: {fontSize: "10dip", fontFamily: font.styles.normal},
		height: "30dip",
		selectedBackgroundColor: "#999",
		selectedColor: "#DDD",
		bubbleParent: false
	});
		
	
	
	row.addEventListener('click', function(e){
		console.log(JSON.stringify(row.convertPointToView({x: e.x, y: e.y}, $.fontTable)));
		pickerRows.forEach(function(r) {
			r.backgroundColor = "rgba(0,0,0,0)";
			r.color = "#000";			
		});
		this.backgroundColor = "#999";
		this.color = "#DDD";
		var styles = [];
		STYLE_ORDERING.forEach(function(o){
			if ( font.styles[o] ) {
				var styleOption = Ti.UI.createTableViewRow({
					title: "Aa",
					font: {fontSize: "10dip", fontFamily: font.styles[o]},
					height: "30dip",
					selectedBackgroundColor: "#999",
					selectedColor: "#DDD", 
					bubbleParent: false	, 
					backgroundColor: "rgba(0,0,0,0)"	
				});
				styleOption.addEventListener("click", function(e){
					__onFontFamilyChange({selectedFontFamily: font.styles[o]});	
				});
				styles.push(styleOption);
			}
		});
		$.fontStylesTable.setData(styles);
		__currentlySelectedIndex = e.index + 1;
		var fontStylesTableTop = (__currentlySelectedIndex * 30) - __fontTableOffset;
		console.log( "Font styles table top: " + fontStylesTableTop + "; csi: " + __currentlySelectedIndex + "; fto: " + __fontTableOffset);
		$.fontStylesTable.top = fontStylesTableTop;
		$.fontStylesTable.height = styles.length * 30;
		$.fontStylesTable.show();
		
	});
	
	
	pickerRows.push(row);	
	*/

});


/*
$.fontTable.appendRow(pickerRows);
$.fontTable.addEventListener('scroll', function(e){
	console.log(e);
	__fontTableOffset = e.contentOffset.y;
	$.fontStylesTable.top = (__currentlySelectedIndex * 30) - __fontTableOffset;
});
*/

colors.forEach(function(color){
	var colorRow = Ti.UI.createTableViewRow({
		backgroundColor: color,
		bubbleParent: false,
		//title: color
	});
	
	colorRow.addEventListener("click", function(e){
		__onFontColorChange({selectedFontColor: color});		
	});
		
	$.colorTable.appendRow(colorRow);
});


$.colorLabelContainer.addEventListener("click", function(e){	
	$.fontLabelContainer.backgroundColor = "rgba(255,255,255,0.8)";
	$.fontLabel.color = "#999";
	$.colorLabelContainer.backgroundColor = "#999";
	$.colorLabel.color = "#DDD";
	$.fontPicker.hide();
	$.colorTable.show();
	
});


$.fontLabelContainer.addEventListener("click", function(e){	
	$.colorLabelContainer.backgroundColor = "rgba(255,255,255,0.8)";
	$.colorLabel.color = "#999";
	$.fontLabelContainer.backgroundColor = "#999";
	$.fontLabel.color = "#DDD";
	$.colorTable.hide();
	$.fontPicker.show();
});



// Find the current fonts and colors and select those in the tables.

for ( var i = 0; i < fonts.length; i++ ) {
	var found = false;
	for ( var style in fonts[i].styles ) {
		if ( fonts[i].styles[style] === __startingFontFamily ) {
			found = true;
			$.fontPicker.addEventListener("postlayout", function(e){
				fontFamilyViews[i].fireEvent("click");
				$.fontPicker.scrollTo(0, fontFamilyViews[i].top);
			});
			
			
			/*
			$.fontTable.addEventListener("postlayout", function(e){
				var row = $.fontTable.getSections()[0].getRows()[i];
				row.addEventListener("postlayout", function(e){console.log(JSON.stringify(row.getRect()))});
				setTimeout(function(){
					//$.fontTable.selectRow(i);
					__fontTableOffset = i * 30;
					$.fontTable.scrollToIndex(i, {
						animated: true,
						animationStyle: Ti.UI.iPhone.RowAnimationStyle.BOTTOM,
						position: Ti.UI.iPhone.TableViewScrollPosition.MIDDLE
					});
					row.fireEvent("click", {
						x: 1,
						//section: {"horizontalWrap":true},
						//row: this, 
						index: i,
						y: 1,
						//rowData: this,
						//searchMode: false,
						//detail: false,
						//bubbles: true,
						//type: "click",
						//source: this,
						//cancelBubble: false
								
					});
				}, 200);
				
			});
			*/
			break;
		} 
	}
	if ( found ) {
		break;
	}
}



$.plusButtonContainer.addEventListener("touchstart", function(e) {
	this.setBackgroundColor("#999");
	this.setColor("#DDD");
	__onFontSizeChange("PLUS");
		
});


$.plusButtonContainer.addEventListener("touchend", function(e) {
	this.setBackgroundColor("rgba(255,255,255,0.8)");
	this.setColor("#999");
});


$.minusButtonContainer.addEventListener("touchstart", function(e) {
	this.setBackgroundColor("#999");
	this.setColor("#DDD");
	__onFontSizeChange("MINUS");
});


$.minusButtonContainer.addEventListener("touchend", function(e) {
	this.setBackgroundColor("rgba(255,255,255,0.8)");
	this.setColor("#999");	
});


// Click off means exit. Registered as click off since no children bubble events.
$.container.addEventListener("click", __onDone);




