function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "fontSelector";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.container = Ti.UI.createView({
        zIndex: 5e3,
        id: "container"
    });
    $.__views.container && $.addTopLevelView($.__views.container);
    $.__views.mainSectionContainer = Ti.UI.createView({
        left: 0,
        top: 0,
        width: "200 dip",
        id: "mainSectionContainer"
    });
    $.__views.container.add($.__views.mainSectionContainer);
    $.__views.fontLabelContainer = Ti.UI.createView({
        width: "75 dip",
        height: "30 dip",
        borderColor: "#999",
        backgroundColor: "#999",
        top: 0,
        left: 0,
        bubbleParent: false,
        id: "fontLabelContainer"
    });
    $.__views.mainSectionContainer.add($.__views.fontLabelContainer);
    $.__views.fontLabel = Ti.UI.createLabel({
        color: "#DDD",
        textAlign: "Ti.UI.TEXT_ALIGNMENT_CENTER",
        id: "fontLabel",
        text: "Font"
    });
    $.__views.fontLabelContainer.add($.__views.fontLabel);
    $.__views.colorLabelContainer = Ti.UI.createView({
        width: "75 dip",
        height: "30 dip",
        borderColor: "#999",
        top: 0,
        left: "75 dip",
        bubbleParent: false,
        backgroundColor: "rgba(255,255,255,0.8)",
        id: "colorLabelContainer"
    });
    $.__views.mainSectionContainer.add($.__views.colorLabelContainer);
    $.__views.colorLabel = Ti.UI.createLabel({
        color: "#999",
        textAlign: "Ti.UI.TEXT_ALIGNMENT_CENTER",
        id: "colorLabel",
        text: "Color"
    });
    $.__views.colorLabelContainer.add($.__views.colorLabel);
    $.__views.fontPicker = Ti.UI.createScrollView({
        backgroundColor: "rgba(0,0,0,0)",
        top: "58 dip",
        left: 0,
        id: "fontPicker"
    });
    $.__views.mainSectionContainer.add($.__views.fontPicker);
    $.__views.fontSizeModifier = Ti.UI.createView({
        backgroundColor: "rgba(255,255,255,0.8)",
        width: "150 dip",
        height: "30 dip",
        top: "29 dip",
        left: 0,
        bubbleParent: false,
        id: "fontSizeModifier"
    });
    $.__views.mainSectionContainer.add($.__views.fontSizeModifier);
    $.__views.fontSizeLabelContainer = Ti.UI.createView({
        top: 0,
        left: 0,
        width: "76 dip",
        height: "30 dip",
        borderColor: "#999",
        id: "fontSizeLabelContainer"
    });
    $.__views.fontSizeModifier.add($.__views.fontSizeLabelContainer);
    $.__views.fontSizeLabel = Ti.UI.createLabel({
        color: "#999",
        textAlign: "Ti.UI.TEXT_ALIGNMENT_CENTER",
        font: {
            fontSize: "12 dip"
        },
        id: "fontSizeLabel",
        text: "Font Size"
    });
    $.__views.fontSizeLabelContainer.add($.__views.fontSizeLabel);
    $.__views.plusButtonContainer = Ti.UI.createView({
        top: 0,
        left: "75 dip",
        width: "38 dip",
        height: "30dip",
        borderColor: "#999",
        id: "plusButtonContainer"
    });
    $.__views.fontSizeModifier.add($.__views.plusButtonContainer);
    $.__views.plusButtonLabel = Ti.UI.createLabel({
        color: "#999",
        textAlign: "Ti.UI.TEXT_ALIGNMENT_CENTER",
        id: "plusButtonLabel",
        text: "+"
    });
    $.__views.plusButtonContainer.add($.__views.plusButtonLabel);
    $.__views.minusButtonContainer = Ti.UI.createView({
        top: 0,
        left: "112 dip",
        width: "38 dip",
        height: "30 dip",
        borderColor: "#999",
        id: "minusButtonContainer"
    });
    $.__views.fontSizeModifier.add($.__views.minusButtonContainer);
    $.__views.minusButtonLabel = Ti.UI.createLabel({
        color: "#999",
        textAlign: "Ti.UI.TEXT_ALIGNMENT_CENTER",
        id: "minusButtonLabel",
        text: "-"
    });
    $.__views.minusButtonContainer.add($.__views.minusButtonLabel);
    $.__views.colorTable = Ti.UI.createTableView({
        backgroundColor: "rgba(0,0,0,0)",
        top: "30 dip",
        left: 0,
        visible: false,
        width: "150 dip",
        id: "colorTable"
    });
    $.__views.mainSectionContainer.add($.__views.colorTable);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var __onFontFamilyChange = arguments[0].onFontFamilyChange || function() {
        console.log("onFontFamilyChange not implemented.");
    };
    var __onFontColorChange = arguments[0].onFontColorChange || function() {
        console.log("onFontColorChange not implemented.");
    };
    var __onFontSizeChange = arguments[0].onFontSizeChange || function() {
        console.log("onFontSizeChange not implemented.");
    };
    var __onDone = arguments[0].onDone || function() {
        console.log("onDone not implemented");
    };
    var __startingFontFamily = arguments[0].startingFontFamily;
    arguments[0].startingFontColor;
    var STYLE_ORDERING = [ "extraBold", "extraBoldItalic", "bold", "boldItalic", "demiBold", "demiBoldItalic", "mediumBold", "mediumBoldItalic", "normal", "italic", "mediumLight", "mediumLightItalic", "light", "lightItalic" ];
    var fonts = require("availableFonts").getAvailableFonts();
    var colors = require("availableColors").getAvailableColors();
    var fontsTopOffset = 0;
    var fontFamilyViews = [];
    var fontStylesViews = [];
    fonts.forEach(function(font) {
        var row = Ti.UI.createView({
            height: "30dip",
            width: "150dip",
            borderColor: "#ddd",
            top: fontsTopOffset + "dip",
            left: 0,
            bubbleParent: false,
            backgroundImage: "/IF_FontBG.png",
            backgroundRepeat: true
        });
        var rowLabel = Ti.UI.createLabel({
            text: font.name,
            font: {
                fontSize: "10dip",
                fontFamily: font.styles.normal
            }
        });
        row.add(rowLabel);
        row.addEventListener("click", function() {
            fontStylesViews.forEach(function(v) {
                $.fontPicker.remove(v);
            });
            fontStylesViews = [];
            $.fontPicker.children.forEach(function(c) {
                c.backgroundColor = "rgba(255,255,255,0.8)";
                c.children[0].color = "#000";
            });
            this.backgroundColor = "#999";
            this.children[0].color = "#DDD";
            var fontStylesOffset = row.rect.y;
            STYLE_ORDERING.forEach(function(o) {
                if (font.styles[o]) {
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
                        font: {
                            fontSize: "10dip",
                            fontFamily: font.styles[o]
                        }
                    }));
                    styleOption.addEventListener("click", function() {
                        fontStylesViews.forEach(function(fsv) {
                            fsv.backgroundColor = "rgba(255,255,255,0.8)";
                            fsv.children[0].color = "#000";
                        });
                        this.backgroundColor = "#999";
                        this.children[0].color = "#DDD";
                        __onFontFamilyChange({
                            selectedFontFamily: font.styles[o]
                        });
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
    });
    colors.forEach(function(color) {
        var colorRow = Ti.UI.createTableViewRow({
            backgroundColor: color,
            bubbleParent: false
        });
        colorRow.addEventListener("click", function() {
            __onFontColorChange({
                selectedFontColor: color
            });
        });
        $.colorTable.appendRow(colorRow);
    });
    $.colorLabelContainer.addEventListener("click", function() {
        $.fontLabelContainer.backgroundColor = "rgba(255,255,255,0.8)";
        $.fontLabel.color = "#999";
        $.colorLabelContainer.backgroundColor = "#999";
        $.colorLabel.color = "#DDD";
        $.fontPicker.hide();
        $.colorTable.show();
    });
    $.fontLabelContainer.addEventListener("click", function() {
        $.colorLabelContainer.backgroundColor = "rgba(255,255,255,0.8)";
        $.colorLabel.color = "#999";
        $.fontLabelContainer.backgroundColor = "#999";
        $.fontLabel.color = "#DDD";
        $.colorTable.hide();
        $.fontPicker.show();
    });
    for (var i = 0; fonts.length > i; i++) {
        var found = false;
        for (var style in fonts[i].styles) if (fonts[i].styles[style] === __startingFontFamily) {
            found = true;
            $.fontPicker.addEventListener("postlayout", function() {
                fontFamilyViews[i].fireEvent("click");
                $.fontPicker.scrollTo(0, fontFamilyViews[i].top);
            });
            break;
        }
        if (found) break;
    }
    $.plusButtonContainer.addEventListener("touchstart", function() {
        this.setBackgroundColor("#999");
        this.setColor("#DDD");
        __onFontSizeChange("PLUS");
    });
    $.plusButtonContainer.addEventListener("touchend", function() {
        this.setBackgroundColor("rgba(255,255,255,0.8)");
        this.setColor("#999");
    });
    $.minusButtonContainer.addEventListener("touchstart", function() {
        this.setBackgroundColor("#999");
        this.setColor("#DDD");
        __onFontSizeChange("MINUS");
    });
    $.minusButtonContainer.addEventListener("touchend", function() {
        this.setBackgroundColor("rgba(255,255,255,0.8)");
        this.setColor("#999");
    });
    $.container.addEventListener("click", __onDone);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;