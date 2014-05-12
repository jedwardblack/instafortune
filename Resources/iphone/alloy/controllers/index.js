function Controller() {
    function setFortuneBackground(background) {
        currentlySelectedBackground = background;
        $.fortuneBackground.image = background.image;
        backgroundModifier.setImage(background);
        if (backgroundSelectorView) {
            $.index.remove(backgroundSelectorView);
            showThemeScrollableView();
        }
    }
    function loadRandomThemeBackgroundAndFortune() {
        fetchRandomThemeBackgroundAndFortune(function(err, results) {
            if (err) Ti.API.error(err); else {
                setFortuneBackground(results.background);
                fortuneContainer.setFortune(results.fortune.text);
                fortuneContainer.setPaper(results.paper);
                $.activityIndicator.hide();
                animateDisplayOfModifiers({
                    backgroundModifier: {
                        center: {
                            x: .2 * SCREEN_WIDTH,
                            y: .2 * SCREEN_HEIGHT
                        },
                        duration: 400
                    },
                    emoticonModifier: {
                        center: {
                            x: .2 * SCREEN_WIDTH,
                            y: .8 * SCREEN_HEIGHT
                        },
                        duration: 600
                    },
                    paperModifier: {
                        center: {
                            x: .4 * SCREEN_WIDTH,
                            y: .8 * SCREEN_HEIGHT
                        },
                        duration: 800
                    },
                    styleModifier: {
                        center: {
                            x: .6 * SCREEN_WIDTH,
                            y: .8 * SCREEN_HEIGHT
                        },
                        duration: 600
                    }
                });
            }
        });
    }
    function animateDisplayOfModifiers(options) {
        backgroundModifier.animate(Ti.UI.createAnimation({
            center: options.backgroundModifier.center,
            duration: options.backgroundModifier.duration
        }));
        emoticonModifier.animate(Ti.UI.createAnimation({
            center: options.emoticonModifier.center,
            duration: options.paperModifier.duration
        }));
        paperModifier.animate(Ti.UI.createAnimation({
            center: options.paperModifier.center,
            duration: options.paperModifier.duration
        }));
        styleModifier.animate(Ti.UI.createAnimation({
            center: options.styleModifier.center,
            duration: options.styleModifier.duration
        }));
    }
    function clearScreen() {
        backgroundModifier.animate(Ti.UI.createAnimation({
            center: {
                x: backgroundModifier.rect.width / 2 + 80 + "dip",
                y: backgroundModifier.rect.height / 2 - 300 + "dip"
            },
            duration: 400
        }));
        emoticonModifier.animate(Ti.UI.createAnimation({
            center: {
                x: emoticonModifier.rect.width / 2 + 100 + "dip",
                y: emoticonModifier.rect.height / 2 + 1e3 + "dip"
            },
            duration: 400
        }));
        paperModifier.animate(Ti.UI.createAnimation({
            center: {
                x: paperModifier.rect.width / 2 + 200 + "dip",
                y: paperModifier.rect.height / 2 + 1e3 + "dip"
            },
            duration: 400
        }));
        styleModifier.animate(Ti.UI.createAnimation({
            center: {
                x: styleModifier.rect.width / 2 + 250 + "dip",
                y: styleModifier.rect.height / 2 + 1e3 + "dip"
            },
            duration: 400
        }));
    }
    function fetchRandomThemeBackgroundAndFortune(callback) {
        fetchRandomTheme(function(themeError, theme) {
            if (themeError) callback(themeError, null); else {
                currentlySelectedTheme = theme.name;
                showThemeScrollableView();
                async.parallel({
                    background: function(cb) {
                        fetchRandomBackgroundByTheme({
                            theme: theme.name,
                            callback: cb
                        });
                    },
                    fortune: function(cb) {
                        fetchRandomFortune({
                            theme: theme.name,
                            callback: cb
                        });
                    },
                    paper: function(cb) {
                        fetchRandomPaperByTheme({
                            theme: theme.name,
                            callback: cb
                        });
                    }
                }, function(parallelError, results) {
                    if (parallelError) callback(parallelError, null); else {
                        results.theme = theme;
                        callback(null, results);
                    }
                });
            }
        });
    }
    function fetchRandomTheme(callback) {
        var themes = TiParse.Object.extend("Theme");
        var query = new TiParse.Query(themes);
        query.exists("name");
        query.find({
            success: function(results) {
                var result = results[Math.floor(Math.random() * results.length)];
                var theme = {
                    name: result.get("name"),
                    icon: result.get("icon")._url,
                    iconBackgroundColor: result.get("iconBackgroundColor")
                };
                currentlySelectedTheme = theme.name;
                $.themeScrollableView.getViews().forEach(function(t) {
                    console.log(t);
                    t.getChildren()[0].text === theme.name && $.themeScrollableView.scrollToView(t);
                });
                callback(null, theme);
            },
            error: function(error) {
                callback(error, null);
            }
        });
    }
    function fetchRandomBackgroundByTheme(options) {
        var backgrounds = TiParse.Object.extend("Background");
        var query = new TiParse.Query(backgrounds);
        options.theme && query.equalTo("theme", options.theme);
        query.exists("imagePreview");
        query.descending("createdAt");
        query.count({
            success: function(count) {
                if (0 == count && options.theme) {
                    options.theme = null;
                    fetchRandomBackground(options);
                } else {
                    var randomNumber = Math.floor(Math.random() * count);
                    query.skip(randomNumber);
                    query.limit(1);
                    query.find({
                        success: function(result) {
                            options.callback(null, {
                                image: result[0].get("image")._url,
                                imagePreview: result[0].get("imagePreview")._url,
                                theme: result[0].get("theme"),
                                objectId: result[0].get("objectId")
                            });
                        },
                        error: function(error) {
                            options.callback(error, null);
                        }
                    });
                }
            }
        });
    }
    function fetchRandomFortune(options) {
        var fortunes = TiParse.Object.extend("Fortune");
        var query = new TiParse.Query(fortunes);
        options.theme && query.equalTo("theme", options.theme);
        query.exists("text");
        query.descending("createdAt");
        query.count({
            success: function(count) {
                if (0 == count && options.theme) {
                    options.theme = null;
                    fetchRandomFortune(options);
                } else {
                    var randomNumber = Math.floor(Math.random() * count);
                    query.skip(randomNumber);
                    query.limit(1);
                    query.find({
                        success: function(result) {
                            options.callback(null, {
                                text: result[0].get("text"),
                                theme: result[0].get("theme")
                            });
                        },
                        error: function(error) {
                            options.callback(error, null);
                        }
                    });
                }
            },
            error: function(error) {
                options.callback(error, null);
            }
        });
    }
    function fetchRandomPaperByTheme(options) {
        var backgrounds = TiParse.Object.extend("Paper");
        var query = new TiParse.Query(backgrounds);
        options.theme && query.equalTo("theme", options.theme);
        query.exists("image");
        query.descending("createdAt");
        query.count({
            success: function(count) {
                if (0 == count && options.theme) {
                    options.theme = null;
                    fetchRandomPaper(options);
                } else {
                    var randomNumber = Math.floor(Math.random() * count);
                    query.skip(randomNumber);
                    query.limit(1);
                    query.find({
                        success: function(result) {
                            options.callback(null, {
                                image: result[0].get("image")._url,
                                theme: result[0].get("theme"),
                                topPadding: result[0].get("topPadding"),
                                rightPadding: result[0].get("rightPadding"),
                                bottomPadding: result[0].get("bottomPadding"),
                                leftPadding: result[0].get("leftPadding"),
                                objectId: result[0].get("objectId")
                            });
                        },
                        error: function(error) {
                            options.callback(error, null);
                        }
                    });
                }
            }
        });
    }
    function showThemeScrollableView() {
        $.themeScrollableView.animate(Ti.UI.createAnimation({
            top: 0,
            left: 0,
            duration: 600
        }));
    }
    function hideThemeScrollableView() {
        $.themeScrollableView.animate(Ti.UI.createAnimation({
            top: "-300 dip",
            left: 0,
            duration: 600
        }));
    }
    function showBackgroundSelector() {
        hideThemeScrollableView();
        backgroundSelectorView = Alloy.createController("backgroundSelector", {
            currentBackgroundId: currentlySelectedBackground.objectId,
            currentTheme: currentlySelectedTheme,
            onBackgroundSelected: setFortuneBackground
        }).getView();
        $.index.add(backgroundSelectorView);
    }
    function showEmoticonSelector() {
        hideThemeScrollableView();
        emoticonSelectorView = Alloy.createController("emoticonSelector", {
            currentTheme: currentlySelectedTheme,
            onEmoticonSelected: function(emoticon) {
                var ecv = Draggable.createView({
                    width: Ti.UI.SIZE,
                    height: Ti.UI.SIZE
                });
                var ev = Ti.UI.createImageView({
                    image: emoticon.image,
                    width: "60 dip",
                    height: "60 dip",
                    top: 0,
                    left: 0,
                    right: 0
                });
                ecv.add(ev);
                ecv.addEventListener("move", function() {
                    ecv.animate({
                        top: ecv.rect.top,
                        left: ecv.rect.left,
                        duration: 1
                    });
                });
                ecv.addEventListener("end", function() {
                    orderWorkspaceObjectsZIndices(ecv);
                });
                ecv.addEventListener("singletap", function() {
                    ecv.animate({
                        top: ecv.rect.top,
                        left: ecv.rect.left,
                        duration: 1
                    });
                    if (emoticonViewBeingEdited) {
                        var children = emoticonViewBeingEdited.getChildren();
                        children.forEach(function(el) {
                            /^\/((close)|(minus)|(plus))\.png$/.test(el.image) && emoticonViewBeingEdited.remove(el);
                        });
                        ev.animate({
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            duration: 1
                        });
                        ecv.animate({
                            top: ecv.rect.y + 40,
                            left: ecv.rect.x + 40,
                            duration: 1
                        });
                    }
                    if (ecv == emoticonViewBeingEdited) {
                        emoticonViewBeingEdited = null;
                        return;
                    }
                    var emoticonRemoveButton = Ti.UI.createImageView({
                        image: "/close.png",
                        width: "32 dip",
                        height: "32 dip",
                        bubbleParent: false
                    });
                    var emoticonShrinkButton = Ti.UI.createImageView({
                        image: "/minus.png",
                        width: "32 dip",
                        height: "32 dip",
                        bubbleParent: false
                    });
                    var emoticonGrowButton = Ti.UI.createImageView({
                        image: "/plus.png",
                        width: "32 dip",
                        height: "32 dip",
                        bubbleParent: false
                    });
                    ev.animate({
                        top: 40,
                        right: 40,
                        bottom: 40,
                        left: 40,
                        duration: 1
                    });
                    ecv.animate({
                        top: ecv.rect.y - 40,
                        left: ecv.rect.x - 40,
                        duration: 1
                    });
                    showEmoticonEditor({
                        size: ev.width,
                        emoticonView: ev,
                        emoticonRemoveButton: emoticonRemoveButton,
                        emoticonShrinkButton: emoticonShrinkButton,
                        emoticonGrowButton: emoticonGrowButton
                    });
                    emoticonRemoveButton.addEventListener("click", function() {
                        $.workspace.remove(ecv);
                    });
                    emoticonShrinkButton.addEventListener("click", function() {
                        var emoticonSizeIndex = EMOTICON_SIZES.indexOf(ev.width);
                        if (emoticonSizeIndex === EMOTICON_SIZES.length - 1) return;
                        emoticonSizeIndex++;
                        showEmoticonEditor({
                            size: EMOTICON_SIZES[emoticonSizeIndex],
                            emoticonView: ev,
                            emoticonRemoveButton: emoticonRemoveButton,
                            emoticonShrinkButton: emoticonShrinkButton,
                            emoticonGrowButton: emoticonGrowButton
                        });
                    });
                    emoticonGrowButton.addEventListener("click", function() {
                        var emoticonSizeIndex = EMOTICON_SIZES.indexOf(ev.width);
                        if (0 === emoticonSizeIndex) return;
                        emoticonSizeIndex--;
                        showEmoticonEditor({
                            size: EMOTICON_SIZES[emoticonSizeIndex],
                            emoticonView: ev,
                            emoticonRemoveButton: emoticonRemoveButton,
                            emoticonShrinkButton: emoticonShrinkButton,
                            emoticonGrowButton: emoticonGrowButton
                        });
                    });
                    ecv.add(emoticonRemoveButton);
                    ecv.add(emoticonShrinkButton);
                    ecv.add(emoticonGrowButton);
                    emoticonViewBeingEdited = ecv;
                });
                $.workspace.add(ecv);
                $.index.remove(emoticonSelectorView);
                showThemeScrollableView();
            }
        }).getView();
        $.index.add(emoticonSelectorView);
    }
    function showEmoticonEditor(args) {
        console.log(args);
        var v = EMOTICON_EDITOR_VARIABLES[args.size];
        var cx = v.cx(args.emoticonView.rect.x);
        var cy = v.cy(args.emoticonView.rect.y);
        args.emoticonView.width = args.size;
        args.emoticonView.height = args.size;
        removeButtonPoint = {
            x: cx + v.radius * Math.cos(v.angles[0]),
            y: cy - v.radius * Math.sin(v.angles[0])
        };
        shrinkButtonPoint = {
            x: cx + v.radius * Math.cos(v.angles[1]),
            y: cy - v.radius * Math.sin(v.angles[1])
        };
        growButtonPoint = {
            x: cx + v.radius * Math.cos(v.angles[2]),
            y: cy - v.radius * Math.sin(v.angles[2])
        };
        args.emoticonRemoveButton.center = removeButtonPoint;
        args.emoticonShrinkButton.center = shrinkButtonPoint;
        args.emoticonGrowButton.center = growButtonPoint;
    }
    function showPaperSelector() {
        hideThemeScrollableView();
        paperSelectorView = Alloy.createController("paperSelector", {
            currentTheme: currentlySelectedTheme,
            onPaperSelected: function(paper) {
                fortuneContainer.setPaper(paper);
                $.index.remove(paperSelectorView);
                showThemeScrollableView();
            }
        }).getView();
        $.index.add(paperSelectorView);
    }
    function showFontSelector() {
        hideThemeScrollableView();
        fontSelectorView = Alloy.createController("fontSelector", {
            startingFontFamily: fortuneContainer.getFont().fontFamily,
            onFontFamilyChange: function(e) {
                var font = fortuneContainer.getFont().font;
                font.fontFamily = e.selectedFontFamily;
                fortuneContainer.setFont(font);
            },
            onFontColorChange: function(e) {
                fortuneContainer.setFortuneColor(e.selectedFontColor);
            },
            onFontSizeChange: function(e) {
                var fontSizeIndex = FONT_SIZES.indexOf(fortuneContainer.getFont().fontSize);
                if ("MINUS" === e && fontSizeIndex > 0) {
                    console.log("minus");
                    fontSizeIndex--;
                } else if ("PLUS" === e && FONT_SIZES.length - 1 > fontSizeIndex) {
                    console.log("plus");
                    fontSizeIndex++;
                }
                console.log(fontSizeIndex + "=" + FONT_SIZES[fontSizeIndex]);
                var font = fortuneContainer.getFont();
                font.fontSize = FONT_SIZES[fontSizeIndex];
                fortuneContainer.setFont(font);
            },
            onDone: function() {
                $.index.remove(fontSelectorView);
                showThemeScrollableView();
            }
        }).getView();
        $.index.add(fontSelectorView);
    }
    function fetchAllThemes(callback) {
        var themes = TiParse.Object.extend("Theme");
        var query = new TiParse.Query(themes);
        query.exists("name");
        query.find({
            success: function(results) {
                callback(results.map(function(element) {
                    return {
                        name: element.get("name"),
                        icon: element.get("icon")._url,
                        iconBackgroundColor: element.get("iconBackgroundColor")
                    };
                }));
            },
            error: function(error) {
                callback(error, null);
            }
        });
    }
    function shareOnInstagram() {
        var image = $.workspace.toImage(null, true);
        instagramUtil.isInstalled ? instagramUtil.openPhoto({
            media: image
        }) : alert("Instagram app is not installed!");
    }
    function shareOnTwitter() {
        var image = $.workspace.toImage(null, true);
        twitter.tweet({
            image: image,
            status: "test."
        });
    }
    function constructBackgroundModifier() {
        var bgm = Draggable.createView({
            width: "110 dip",
            height: "110 dip",
            center: {
                x: "80dip",
                y: "-300dip"
            },
            zIndex: 4e3
        });
        bgm.id = "backgroundModifier";
        var circleBorderImage = Ti.UI.createImageView({
            width: "110 dip",
            height: "110 dip",
            image: "/circle_border_with_shadow.png"
        });
        var modifierPreviewImage = Ti.UI.createImageView({
            width: "100 dip",
            height: "100 dip",
            borderRadius: "android" == Ti.Platform.osname ? 100 : 50
        });
        bgm.add(modifierPreviewImage);
        bgm.add(circleBorderImage);
        bgm.setImage = function(params) {
            modifierPreviewImage.image = params.imagePreview;
        };
        bgm.addEventListener("start", function() {
            orderModifierZIndices(bgm);
        });
        bgm.addEventListener("move", function() {
            bgm.animate({
                top: bgm.rect.top,
                left: bgm.rect.left,
                duration: 1
            });
        });
        bgm.addEventListener("end", function() {
            orderModifierZIndices(bgm);
        });
        bgm.addEventListener("singletap", function() {
            bgm.animate({
                top: bgm.rect.top,
                left: bgm.rect.left,
                duration: 1
            });
            bgm.addEventListener("start", function() {
                orderModifierZIndices(bgm);
            });
            showBackgroundSelector();
        });
        return bgm;
    }
    function constructModifier(args) {
        var mod = Draggable.createView({
            center: args.startingPoint,
            width: args.width,
            height: args.height,
            zIndex: 4e3,
            backgroundImage: args.image
        });
        mod.id = args.id;
        mod.addEventListener("start", function() {
            orderModifierZIndices(mod);
        });
        mod.addEventListener("move", function() {
            mod.animate({
                top: mod.rect.top,
                left: mod.rect.left,
                duration: 1
            });
        });
        mod.addEventListener("end", function() {
            orderModifierZIndices(mod);
        });
        mod.addEventListener("singletap", function() {
            mod.animate({
                top: mod.rect.top,
                left: mod.rect.left,
                duration: 1
            });
            args.onSingletap && args.onSingletap();
        });
        return mod;
    }
    function orderModifierZIndices(modifierToPutOnTop) {
        $.index.getChildren().forEach(function(c) {
            modifierToPutOnTop.id !== c.id && /.*Modifier.*/.test(c.id) && c.zIndex > 4e3 && (c.zIndex = c.zIndex - 1);
        });
        modifierToPutOnTop.zIndex = 4999;
    }
    function orderWorkspaceObjectsZIndices(objectToPutOnTop) {
        $.workspace.getChildren().forEach(function(c) {
            c.zIndex > 1 && (c.zIndex = c.zIndex - 1);
        });
        objectToPutOnTop.zIndex = 3999;
    }
    function constructEmoticonModifier() {
        return constructModifier({
            id: "emoticonModifier",
            image: "/modEmoticon.png",
            startingPoint: {
                x: "100 dip",
                y: "1000 dip"
            },
            height: "70 dip",
            width: "65 dip",
            onSingletap: function() {
                showEmoticonSelector();
            }
        });
    }
    function constructPaperModifier() {
        return constructModifier({
            id: "paperModifier",
            image: "/modPaper.png",
            startingPoint: {
                x: "200 dip",
                y: "1000 dip"
            },
            height: "65 dip",
            width: "70 dip",
            onSingletap: function() {
                showPaperSelector();
            }
        });
    }
    function constructStyleModifier() {
        return constructModifier({
            id: "styleModifier",
            image: "/modStyle.png",
            startingPoint: {
                x: "250 dip",
                y: "1000 dip"
            },
            height: "70 dip",
            width: "67 dip",
            onSingletap: function() {
                showFontSelector();
            }
        });
    }
    function constructFortuneContainer() {
        var fc = Draggable.createView({
            width: "80%",
            height: Ti.UI.SIZE,
            zIndex: 1
        });
        var f = Ti.UI.createLabel({
            width: Ti.UI.FILL,
            height: Ti.UI.SIZE,
            font: {
                fontFamily: "Helvetica",
                fontSize: "12 dip"
            },
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
        });
        fc.id = "fortuneContainer";
        f.id = "fortune";
        fc.add(f);
        fc.setFortuneColor = function(color) {
            f.color = color;
        };
        fc.getFortuneColor = function() {
            return f.color;
        };
        fc.setFortune = function(fortune) {
            f.text = fortune;
        };
        fc.setPaper = function(paper) {
            f.top = paper.topPadding ? paper.topPadding : "5 dip";
            f.right = paper.rightPadding ? paper.rightPadding : "10 dip";
            f.bottom = paper.bottomPadding ? paper.bottomPadding : "5 dip";
            f.left = paper.leftPadding ? paper.leftPadding : "10 dip";
            fc.backgroundImage = paper.image;
        };
        fc.getFont = function() {
            return f.font;
        };
        fc.setFont = function(font) {
            f.font = font;
        };
        fc.addEventListener("move", function() {
            fc.animate({
                top: fc.rect.top,
                left: fc.rect.left,
                duration: 1
            });
        });
        fc.addEventListener("end", function() {
            orderWorkspaceObjectsZIndices(fc);
        });
        fc.addEventListener("singletap", function() {
            fc.animate({
                top: fc.rect.top,
                left: fc.rect.left,
                duration: 1
            });
            $.activityIndicator.color = "white";
            $.activityIndicator.style = "iphone" == Ti.Platform.osname ? Ti.UI.iPhone.ActivityIndicatorStyle.LIGHT : Ti.UI.ActivityIndicatorStyle.DARK;
            $.activityIndicator.show();
            fetchRandomFortune({
                theme: currentlySelectedTheme,
                callback: function(error, fortune) {
                    error ? alert(error) : fortuneContainer.setFortune(fortune.text);
                    $.activityIndicator.hide();
                }
            });
        });
        return fc;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundImage: "/subtle_white_feathers.png",
        backgroundRepeat: true,
        statusBarStyle: Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT,
        top: 20,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.webview = Ti.UI.createWebView({
        visible: false,
        zIndex: 99999,
        id: "webview"
    });
    $.__views.index.add($.__views.webview);
    $.__views.previewBackground = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundColor: "rgb(0,0,0,0)",
        id: "previewBackground"
    });
    $.__views.index.add($.__views.previewBackground);
    var __alloyId2 = [];
    $.__views.themeScrollableView = Ti.UI.createScrollableView({
        top: "-300 dip",
        left: 0,
        height: "30 dip",
        width: "100 %",
        backgroundColor: "rgba(0,0,0,0.3)",
        zIndex: 1e4,
        views: __alloyId2,
        id: "themeScrollableView"
    });
    $.__views.index.add($.__views.themeScrollableView);
    $.__views.workspace = Ti.UI.createView({
        id: "workspace"
    });
    $.__views.index.add($.__views.workspace);
    $.__views.fortuneBackgroundContainer = Ti.UI.createView({
        width: "90%",
        height: Ti.UI.SIZE,
        id: "fortuneBackgroundContainer"
    });
    $.__views.workspace.add($.__views.fortuneBackgroundContainer);
    $.__views.fortuneBackground = Ti.UI.createImageView({
        id: "fortuneBackground"
    });
    $.__views.fortuneBackgroundContainer.add($.__views.fortuneBackground);
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        color: "gray",
        style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
        font: {
            fontFamily: "Helvetica Neue",
            fontSize: 26,
            fontWeight: "bold"
        },
        id: "activityIndicator",
        message: "Loading..."
    });
    $.__views.index.add($.__views.activityIndicator);
    $.__views.logo = Ti.UI.createImageView({
        image: "/IF_Logo.png",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        left: "10dp",
        bottom: "10dp",
        id: "logo"
    });
    $.__views.index.add($.__views.logo);
    $.__views.clearScreen = Ti.UI.createView({
        bottom: 0,
        right: 0,
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "clearScreen"
    });
    $.__views.index.add($.__views.clearScreen);
    $.__views.eyeballHover = Ti.UI.createImageView({
        image: "/IF_Eyeball_hover.png",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        opacity: "0.1",
        id: "eyeballHover"
    });
    $.__views.clearScreen.add($.__views.eyeballHover);
    $.__views.eyeball = Ti.UI.createImageView({
        image: "/IF_Eyeball.png",
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        id: "eyeball"
    });
    $.__views.clearScreen.add($.__views.eyeball);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var async = require("async");
    var TiParse = require("tiparse");
    if ("iphone" == Ti.Platform.osname) var instagramUtil = require("jp.msmc.tiinstagramutil");
    var twitter = require("twitter");
    var Draggable = require("ti.draggable");
    var pWidth = Ti.Platform.displayCaps.platformWidth;
    var pHeight = Ti.Platform.displayCaps.platformHeight;
    var SCREEN_WIDTH = pWidth > pHeight ? pHeight : pWidth;
    var SCREEN_HEIGHT = pWidth > pHeight ? pWidth : pHeight;
    twitter.configure({
        consumerKey: Alloy.CFG.twitterConsumerKey,
        consumerKeySecret: Alloy.CFG.twitterConsumerSecret
    });
    var TiParse = new TiParse();
    var currentlySelectedBackground = null;
    var currentlySelectedTheme = null;
    var backgroundSelectorView = null;
    var emoticonSelectorView = null;
    var fontSelectorView = null;
    var emoticonViewBeingEdited = null;
    var backgroundModifier = constructBackgroundModifier();
    var emoticonModifier = constructEmoticonModifier();
    var paperModifier = constructPaperModifier();
    var styleModifier = constructStyleModifier();
    var fortuneContainer = constructFortuneContainer();
    $.index.add(backgroundModifier);
    $.index.add(emoticonModifier);
    $.index.add(paperModifier);
    $.index.add(styleModifier);
    $.workspace.add(fortuneContainer);
    var defaultColors = [ "#F2EE0C", "#83F20C", "#10F20C", "#F27B0C", "F20C10", "#0C83F2", "0CF27B" ];
    var FONT_SIZES = [ "10 dip", "12 dip", "15 dip", "18 dip", "20 dip", "24 dip", "30 dip", "40 dip", "60 dip" ];
    var EMOTICON_SIZES = [ "125 dip", "100 dip", "75 dip", "60 dip", "45 dip", "30 dip", "25 dip" ];
    var EMOTICON_EDITOR_VARIABLES = {
        "125 dip": {
            angles: [ .2, .8, 1.4 ],
            radius: 75,
            cx: function(x) {
                return x + 62.5;
            },
            cy: function(y) {
                return y + 62.5;
            }
        },
        "100 dip": {
            angles: [ .2, .8, 1.4 ],
            radius: 65,
            cx: function(x) {
                return x + 50;
            },
            cy: function(y) {
                return y + 50;
            }
        },
        "75 dip": {
            angles: [ 0, .8, 1.6 ],
            radius: 52.5,
            cx: function(x) {
                return x + 37.5;
            },
            cy: function(y) {
                return y + 37.5;
            }
        },
        "60 dip": {
            angles: [ 0, .8, 1.6 ],
            radius: 45,
            cx: function(x) {
                return x + 30;
            },
            cy: function(y) {
                return y + 30;
            }
        },
        "45 dip": {
            angles: [ 6, .6, Math.PI / 2 ],
            radius: 36,
            cx: function(x) {
                return x + 22.5;
            },
            cy: function(y) {
                return y + 22.5;
            }
        },
        "30 dip": {
            angles: [ 6, .8, 2 ],
            radius: 30,
            cx: function(x) {
                return x + 15;
            },
            cy: function(y) {
                return y + 15;
            }
        },
        "25 dip": {
            angles: [ 6, .8, 2 ],
            radius: 32.5,
            cx: function(x) {
                return x + 12.5;
            },
            cy: function(y) {
                return y + 12.5;
            }
        }
    };
    fortuneContainer.setFortuneColor(defaultColors[Math.floor(Math.random() * defaultColors.length)]);
    $.themeScrollableView.addEventListener("scrollend", function(e) {
        currentlySelectedTheme = e.view.children[0].text;
    });
    $.clearScreen.addEventListener("touchstart", function() {
        var rect = backgroundModifier.rect;
        backgroundModifierContainerCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        };
        rect = emoticonModifier.rect;
        emoticonModifierContainerCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        };
        rect = paperModifier.rect;
        paperModifierContainerCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        };
        rect = styleModifier.rect;
        styleModifierContainerCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        };
        clearScreen();
        hideThemeScrollableView();
        $.previewBackground.animate(Ti.UI.createAnimation({
            backgroundColor: fortuneContainer.getFortuneColor(),
            duration: 600
        }));
    });
    $.clearScreen.addEventListener("touchend", function() {
        $.previewBackground.animate(Ti.UI.createAnimation({
            backgroundColor: "rgb(0,0,0,0)",
            duration: 600
        }));
        animateDisplayOfModifiers({
            backgroundModifier: {
                center: backgroundModifierContainerCenter,
                duration: 400
            },
            emoticonModifier: {
                center: emoticonModifierContainerCenter,
                duration: 400
            },
            paperModifier: {
                center: paperModifierContainerCenter,
                duration: 400
            },
            styleModifier: {
                center: styleModifierContainerCenter,
                duration: 400
            }
        });
        showThemeScrollableView();
    });
    var twitterTestButton = Ti.UI.createView({
        width: 50,
        height: 50,
        backgroundColor: "blue",
        top: 0,
        left: 0
    });
    var ifTestButton = Ti.UI.createView({
        width: 50,
        height: 50,
        backgroundColor: "orange",
        top: 50,
        left: 0
    });
    twitterTestButton.addEventListener("click", function() {
        shareOnTwitter();
    });
    ifTestButton.addEventListener("click", function() {
        shareOnInstagram();
    });
    $.index.add(twitterTestButton);
    $.activityIndicator.show();
    fetchAllThemes(function(themes) {
        themes.forEach(function(element) {
            var view = Ti.UI.createView();
            view.add(Ti.UI.createLabel({
                text: element.name
            }));
            $.themeScrollableView.addView(view);
        });
        loadRandomThemeBackgroundAndFortune();
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;