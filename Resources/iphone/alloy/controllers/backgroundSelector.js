function Controller() {
    function retrieveThemes(callback) {
        var t = TiParse.Object.extend("Theme");
        var query = new TiParse.Query(t);
        query.exists("name");
        query.find({
            success: function(results) {
                results.forEach(function(e) {
                    var themeName = e.get("name");
                    themes.push(themeName);
                    backgroundsRetrievedByTheme[themeName] = {
                        allRetrieved: false,
                        count: 0,
                        currentlyRetrieving: false
                    };
                });
                callback(null, themes);
            },
            error: function(error) {
                callback(error, null);
            }
        });
    }
    function loadBackgroundSelector() {
        themes.forEach(function(theme) {
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
                font: {
                    fontSize: "24pt",
                    fontFamily: "Helvetica",
                    fontStyle: "normal"
                },
                color: "#ffffff",
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
            }));
            view.add(scrollView);
            $.scrollableView.addView(view);
            theme === __currentTheme && $.scrollableView.scrollToView(view);
        });
        loadMoreBackgroundOptions($.scrollableView.getCurrentPage());
    }
    function loadMoreBackgroundOptions(pageNumber) {
        var theme = themes[pageNumber];
        if (true == backgroundsRetrievedByTheme[theme].allRetrieved || true == backgroundsRetrievedByTheme[theme].currentlyRetrieving) return;
        Ti.API.info("Loading more backgrounds for " + theme);
        var row = backgroundsRetrievedByTheme[theme].count / COLUMN_COUNT;
        var col = 0;
        retrieveMoreBackgroundOptions(theme, function(err, backgrounds) {
            err ? Ti.API.error(err) : backgrounds.forEach(function(background) {
                var top = TOP_PADDING * (row + 1) + IMG_HEIGHT * row + PAGE_TOP_PADDING + "dip";
                var left = LEFT_PADDING * (col + 1) + IMG_WIDTH * col + PAGE_LEFT_PADDING + "dip";
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
                    borderRadius: "android" == Ti.Platform.osname ? 100 : 50,
                    image: background.imagePreview
                });
                previewContainer.add(modifierPreviewImage);
                previewContainer.add(circleBorderImage);
                previewContainer.addEventListener("click", function() {
                    __onBackgroundSelected(background);
                });
                $.scrollableView.views[pageNumber].children[0].add(previewContainer);
                if (col == COLUMN_COUNT - 1) {
                    col = 0;
                    row++;
                } else col++;
            });
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
                backgroundsRetrievedByTheme[theme].count += results.length;
                BG_RETRIEVE_LIMIT > results.length && (backgroundsRetrievedByTheme[theme].allRetrieved = true);
                backgroundsRetrievedByTheme[theme].currentlyRetrieving = false;
                var backgrounds = [];
                results.forEach(function(background) {
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
                backgroundsRetrievedByTheme[theme].currentlyRetrieving = false;
                $.activityIndicator.hide();
                callback(error, null);
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "backgroundSelector";
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
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        color: "white",
        style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 26,
            fontWeight: "bold"
        },
        zIndex: 9999,
        id: "activityIndicator",
        message: "Loading..."
    });
    $.__views.container.add($.__views.activityIndicator);
    var __alloyId0 = [];
    $.__views.scrollableView = Ti.UI.createScrollableView({
        showPagingControl: true,
        views: __alloyId0,
        id: "scrollableView"
    });
    $.__views.container.add($.__views.scrollableView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0].currentBackgroundId;
    var __currentTheme = arguments[0].currentTheme;
    var __onBackgroundSelected = arguments[0].onBackgroundSelected;
    var TiParse = require("tiparse");
    var TiParse = new TiParse();
    var themes = [];
    var backgroundsRetrievedByTheme = {};
    var BG_RETRIEVE_LIMIT = 30;
    var IMG_HEIGHT = 93;
    var IMG_WIDTH = 93;
    var COLUMN_COUNT = 3;
    var PAGE_TOP_PADDING = 30;
    var PAGE_LEFT_PADDING = 0;
    var TOP_PADDING = 10;
    var LEFT_PADDING = 10;
    $.scrollableView.addEventListener("scrollend", function() {
        var theme = themes[$.scrollableView.getCurrentPage()];
        0 == backgroundsRetrievedByTheme[theme].count && loadMoreBackgroundOptions($.scrollableView.getCurrentPage());
    });
    retrieveThemes(function(err) {
        err || loadBackgroundSelector();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;