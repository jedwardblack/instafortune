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
                    emoticonsRetrievedByTheme[themeName] = {
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
    function loadEmoticonSelector() {
        $.activityIndicator.show();
        themes.forEach(function(theme) {
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
        loadMoreEmoticonOptions($.scrollableView.getCurrentPage());
    }
    function loadMoreEmoticonOptions(pageNumber) {
        var theme = themes[pageNumber];
        if (true == emoticonsRetrievedByTheme[theme].allRetrieved || true == emoticonsRetrievedByTheme[theme].currentlyRetrieving) return;
        Ti.API.info("Loading more emoticons for " + theme);
        var row = emoticonsRetrievedByTheme[theme].count / COLUMN_COUNT;
        var col = 0;
        retrieveMoreEmoticonOptions(theme, function(err, emoticons) {
            err ? Ti.API.error(err) : emoticons.forEach(function(emoticon) {
                var top = TOP_PADDING * (row + 1) + IMG_HEIGHT * row + PAGE_TOP_PADDING + "dip";
                var left = LEFT_PADDING * (col + 1) + IMG_WIDTH * col + PAGE_LEFT_PADDING + "dip";
                var emoticonView = Ti.UI.createImageView({
                    top: top,
                    left: left,
                    image: emoticon.image,
                    width: IMG_WIDTH,
                    height: IMG_HEIGHT
                });
                emoticonView.addEventListener("click", function() {
                    __onEmoticonSelected(emoticon);
                });
                $.scrollableView.views[pageNumber].children[0].add(emoticonView);
                if (col == COLUMN_COUNT - 1) {
                    col = 0;
                    row++;
                } else col++;
            });
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
                emoticonsRetrievedByTheme[theme].count += results.length;
                RETRIEVE_LIMIT > results.length && (emoticonsRetrievedByTheme[theme].allRetrieved = true);
                emoticonsRetrievedByTheme[theme].currentlyRetrieving = false;
                var emoticons = [];
                results.forEach(function(emoticon) {
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
                emoticonsRetrievedByTheme[theme].currentlyRetrieving = false;
                $.activityIndicator.hide();
                callback(error, null);
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "emoticonSelector";
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
    var __alloyId1 = [];
    $.__views.scrollableView = Ti.UI.createScrollableView({
        showPagingControl: true,
        views: __alloyId1,
        id: "scrollableView"
    });
    $.__views.container.add($.__views.scrollableView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var __currentTheme = arguments[0].currentTheme;
    var __onEmoticonSelected = arguments[0].onEmoticonSelected;
    var TiParse = require("tiparse");
    var TiParse = new TiParse();
    var themes = [];
    var emoticonsRetrievedByTheme = {};
    var RETRIEVE_LIMIT = 30;
    var IMG_HEIGHT = 93;
    var IMG_WIDTH = 93;
    var COLUMN_COUNT = 3;
    var PAGE_TOP_PADDING = 30;
    var PAGE_LEFT_PADDING = 0;
    var TOP_PADDING = 10;
    var LEFT_PADDING = 10;
    $.scrollableView.addEventListener("scrollend", function() {
        var theme = themes[$.scrollableView.getCurrentPage()];
        0 == emoticonsRetrievedByTheme[theme].count && loadMoreEmoticonOptions($.scrollableView.getCurrentPage());
    });
    retrieveThemes(function(err) {
        err || loadEmoticonSelector();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;