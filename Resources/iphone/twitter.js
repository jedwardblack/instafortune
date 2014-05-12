(function() {
    function buildAuthorizationHeader(parameters, method, url) {
        parameters.push({
            name: "oauth_consumer_key",
            value: twitter.consumerKey
        });
        twitter.accessToken ? parameters.push({
            name: "oauth_token",
            value: twitter.accessToken
        }) : twitter.requestToken && parameters.push({
            name: "oauth_token",
            value: twitter.requestToken
        });
        parameters.push({
            name: "oauth_nonce",
            value: CryptoJS.lib.WordArray.random(16).toString()
        });
        parameters.push({
            name: "oauth_timestamp",
            value: Math.floor(new Date().getTime() / 1e3)
        });
        parameters.push({
            name: "oauth_signature_method",
            value: "HMAC-SHA1"
        });
        parameters.push({
            name: "oauth_version",
            value: "1.0"
        });
        var signature = buildSignature(parameters, method, url);
        parameters.push({
            name: "oauth_signature",
            value: signature
        });
        var oauthParameters = parameters.filter(function(p) {
            return /^oauth_.*/.test(p.name);
        });
        var oauthHeaderValuesArray = [];
        oauthParameters.forEach(function(p) {
            oauthHeaderValuesArray.push(encodeURIComponent(p.name) + "=" + '"' + encodeURIComponent(p.value) + '"');
        });
        return "OAuth " + oauthHeaderValuesArray.join(", ");
    }
    function buildSignature(parameters, method, url) {
        var parameterString = buildParameterString(parameters);
        var signatureBaseString = buildSignatureBaseString({
            method: method,
            url: url,
            parameterString: parameterString
        });
        console.log(JSON.stringify(twitter));
        var signingKey = encodeURIComponent(twitter.consumerKeySecret) + "&";
        twitter.accessTokenSecret ? signingKey += encodeURIComponent(twitter.accessTokenSecret) : twitter.requestTokenSecret && (signingKey += encodeURIComponent(twitter.requestTokenSecret));
        console.log(signatureBaseString + ":::::::" + signingKey);
        var signature = CryptoJS.HmacSHA1(signatureBaseString, signingKey);
        return signature.toString(CryptoJS.enc.Base64);
    }
    function buildParameterString(parameters) {
        var parameterStringArray = [];
        encodedParameters = parameters.map(function(p) {
            p.name = encodeURIComponent(p.name);
            p.value = encodeURIComponent(p.value);
            return p;
        });
        encodedParameters.sort(function(a, b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        });
        encodedParameters.forEach(function(p) {
            parameterStringArray.push(p.name + "=" + p.value);
        });
        return parameterStringArray.join("&");
    }
    function buildSignatureBaseString(args) {
        var signatureBaseString = args.method.toUpperCase() + "&";
        signatureBaseString += encodeURIComponent(args.url) + "&";
        signatureBaseString += encodeURIComponent(args.parameterString);
        return signatureBaseString;
    }
    function request_token(callback) {
        twitter.requestToken = null;
        twitter.requestTokenSecret = null;
        twitter.accessToken = null;
        twitter.accessTokenSecret = null;
        var httpMethod = "POST";
        var url = "https://api.twitter.com/oauth/request_token";
        var authorizationHeader = buildAuthorizationHeader([], httpMethod, url);
        var client = Ti.Network.createHTTPClient({
            onload: function() {
                console.log(this.responseText);
                this.responseText.split("&").forEach(function(kvp) {
                    var splitKvp = kvp.split("=");
                    "oauth_token" === splitKvp[0] ? twitter.requestToken = splitKvp[1] : "oauth_token_secret" === splitKvp[0] && (twitter.requestTokenSecret = splitKvp[1]);
                });
                callback(null, null);
            },
            onerror: function(e) {
                callback(e, null);
            },
            timeout: 5e3
        });
        client.open(httpMethod, url);
        client.setRequestHeader("Authorization", authorizationHeader);
        client.send();
    }
    function authorize(callback) {
        var webview = Titanium.UI.createWebView({
            url: "https://api.twitter.com/oauth/authenticate?oauth_token=" + twitter.requestToken
        });
        var window = Titanium.UI.createWindow();
        webview.addEventListener("beforeload", function(e) {
            console.log(e);
            if (/^https:\/\/instafortune\.com\/oauth\/callback\?oauth_token=.*/.test(e.url)) {
                e.url.replace("https://instafortune.com/oauth/callback?", "").split("&").forEach(function(kvp) {
                    var splitKvp = kvp.split("=");
                    "oauth_verifier" === splitKvp[0] && (twitter.oauthVerifier = splitKvp[1]);
                });
                window.close();
                callback(null, null);
            }
        });
        window.add(webview);
        window.open({
            modal: true
        });
    }
    function access_token(callback) {
        var httpMethod = "POST";
        var url = "https://api.twitter.com/oauth/access_token";
        var authorizationHeader = buildAuthorizationHeader([], httpMethod, url);
        var client = Ti.Network.createHTTPClient({
            onload: function(e) {
                this.responseText.split("&").forEach(function(kvp) {
                    var splitKvp = kvp.split("=");
                    "oauth_token" === splitKvp[0] ? twitter.accessToken = splitKvp[1] : "oauth_token_secret" === splitKvp[0] && (twitter.accessTokenSecret = splitKvp[1]);
                });
                console.log("derp" + e);
                callback(null, null);
            },
            onerror: function(e) {
                callback(e, null);
            },
            timeout: 5e3
        });
        client.open(httpMethod, url);
        client.setRequestHeader("Authorization", authorizationHeader);
        client.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        client.send({
            oauth_verifier: twitter.oauthVerifier
        });
    }
    var CryptoJS = require("hmac-sha1");
    var async = require("async");
    var twitter = {};
    twitter.configure = function(configs) {
        twitter.consumerKey = configs.consumerKey;
        twitter.consumerKeySecret = configs.consumerKeySecret;
        console.log(JSON.stringify(twitter));
    };
    twitter.tweet = function(msg) {
        twitter.isAuthenticated() || twitter.authenticate(function(error) {
            if (error) return null;
            twitter.tweet(msg);
        });
        var httpMethod = "POST";
        var url = "https://api.twitter.com/1.1/statuses/update_with_media.json";
        var authorizationHeader = buildAuthorizationHeader([], httpMethod, url);
        var client = Ti.Network.createHTTPClient({
            onload: function() {
                console.log(this.responseText);
            },
            onerror: function(e) {
                console.log(e);
            },
            timeout: 5e3
        });
        client.open(httpMethod, url);
        client.setRequestHeader("Authorization", authorizationHeader);
        client.setRequestHeader("Content-Type", "multipart/form-data");
        client.send({
            status: msg.status,
            "media[]": msg.image
        });
    };
    twitter.isAuthenticated = function() {
        return twitter.accessToken && twitter.accessTokenSecret;
    };
    twitter.authenticate = function(callback) {
        async.series([ request_token, authorize, access_token ], function(error, results) {
            callback(error, results);
        });
    };
    module.exports = twitter;
})();