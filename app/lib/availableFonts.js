exports.getAvailableFonts = function() {
	return [
	/*
	{name: "Academy Engraved", styles:{
		normal: "AcademyEngravedLetPlain"
	}},
	*/
	{name: "American Typewriter", styles:{
		normal: "AmericanTypewriter", 
		bold:"AmericanTypewriter-Bold", 
		light: "AmericanTypewriter-Light"
	}},
	
	{name: "American Typewriter Condensed", styles:{
		normal: "AmericanTypewriter-Condensed", 
		bold: "AmericanTypewriter-CondensedBold", 
		light: "AmericanTypewriter-CondensedLight"
	}},
	/*
	{name: "Apple Color Emoji", styles:{
		normal: "AppleColorEmoji"
	}},
	
	{name: "Apple SD Gothic Neo", styles:{
		normal: "AppleSDGothicNeo-Medium", 
		bold: "AppleSDGothicNeo-Bold"
	}},
	
	{name: "Arial", styles:{
		normal: "ArialMT", 
		bold: "Arial-BoldMT", 
		italic: "Arial-ItalicMT", 
		boldItalic:"Arial-BoldItalicMT"
	}},
	
	{name: "Arial Rounded", styles:{
		normal: "ArialRoundedMTBold"}},
	
	{name: "Avenir", styles:{
		normal: "Avenir-Roman", 
		italic: "Avenir-Oblique",
		extraBold:"Avenir-Black", 
		extraBoldItalic:"Avenir-BlackOblique", 
		bold: "Avenir-Heavy",
		boldItalic: "Avenir-HeavyOblique",
		mediumBold: "Avenir-Medium",
		mediumBoldItalic: "Avenir-MediumOblique",
		mediumLight:"Avenir-Book", 
		mediumLightItalic: "Avenir-BookOblique",
		light: "Avenir-Light", 
		lightItalic: "Avenir-LightOblique" 
	}},
	*/
	{name: "Avenir Next", styles:{
		normal: "AvenirNext-Regular",
		italic: "AvenirNext-Italic",
		extraBold: "AvenirNext-Heavy",
		extraBoldItalic: "AvenirNext-HeavyItalic",
		bold: "AvenirNext-Bold",
		boldItalic: "AvenirNext-BoldItalic",
		demiBold:"AvenirNext-DemiBold",
		demiBoldItalic: "AvenirNext-DemiBoldItalic",
		mediumBold:"AvenirNext-Medium",
		mediumBoldItalic: "AvenirNext-MediumItalic",
		light: "AvenirNext-UltraLight",
		lightItalic: "AvenirNext-UltraLightItalic"
	}},
	/*
	{name: "Avenir Next Condensed", styles:{
		normal: "AvenirNextCondensed-Regular",
		italic: "AvenirNextCondensed-Italic",
		extraBold: "AvenirNextCondensed-Heavy",
		extraBoldItalic: "AvenirNextCondensed-HeavyItalic",
		bold: "AvenirNextCondensed-Bold",
		boldItalic: "AvenirNextCondensed-BoldItalic",
		demiBold:"AvenirNextCondensed-DemiBold",
		demiBoldItalic: "AvenirNextCondensed-DemiBoldItalic",
		mediumBold:"AvenirNextCondensed-Medium",
		mediumBoldItalic: "AvenirNextCondensed-MediumItalic",
		light: "AvenirNextCondensed-UltraLight",
		lightItalic: "AvenirNextCondensed-UltraLightItalic"
	}},
	
	{name: "Bangla Sangam", styles:{
		normal: "BanglaSangamMN",
		bold: "BanglaSangamMN-Bold" 
	}},
		
	{name: "Baskerville", styles:{
		normal: "Baskerville",
		italic: "Baskerville-Italic",
		bold: "Baskerville-Bold",
		boldItalic: "Baskerville-BoldItalic",
		demiBold: "Baskerville-SemiBold",
		demiBoldItalic: "Baskerville-SemiBoldItalic"
	}},
		
	{name: "Bodoni 72", styles:{
		normal: "BodoniSvtyTwoITCTT-Book",
		italic: "BodoniSvtyTwoITCTT-BookIta",
		bold: "BodoniSvtyTwoITCTT-Bold"
	}},
		
	{name: "Bodoni 72 Oldstyle", styles:{
		normal: "BodoniSvtyTwoOSITCTT-Book",
		italic: "BodoniSvtyTwoOSITCTT-BookIt",
		bold: "BodoniSvtyTwoOSITCTT-Bold"
	}},

	{name: "Bodoni 72 Smallcaps", styles:{
		normal: "BodoniSvtyTwoSCITCTT-Book"
	}},
		
	{name: "Bodoni Ornaments", styles:{
		normal: "BodoniOrnamentsITCTT"
	}},
		
	{name: "Bradley Hand", styles:{
		normal: "BradleyHandITCTT-Bold"
	}},
	*/
	{name: "Chalkboard", styles:{
		normal: "ChalkboardSE-Regular",
		bold: "ChalkboardSE-Bold",
		light: "ChalkboardSE-Light"
	}},
		
	{name: "Chalkduster", styles:{
		normal: "Chalkduster"
	}},
		
	{name: "Cochin", styles:{
		normal: "Cochin",
		italic: "Cochin-Italic",
		bold: "Cochin-Bold",
		boldItalic: "Cochin-BoldItalic"
	}},
	
	{name: "Copperplate", styles:{
		normal: "Copperplate",
		bold: "Copperplate-Bold",
		light: "Copperplate-Light"
	}},
	/*
	{name: "Courier", styles: {
		normal: "Courier",
		italic: "Courier-Oblique",
		bold: "Courier-Bold",
		boldItalic: "Courier-BoldOblique"
	}},
	*/
	{name: "Courier New", styles: {
		normal: "CourierNewPSMT",
		italic: "CourierNewPS-ItalicMT",
		bold: "CourierNewPS-BoldMT",
		boldItalic: "CourierNewPS-BoldItalicMT"
	}},
	/*
	{name: "Devanagari Sangam", styles:{
		normal: "DevanagariSangamMN",
		bold: "DevanagariSangamMN-Bold"
	}},
	
	{name: "Didot", styles:{
		normal: "Didot",
		italic: "Didot-Italic",
		bold: "Didot-Bold"
	}},
	
	{name: "Euphemia", styles:{
		normal: "EuphemiaUCAS",
		italic: "EuphemiaUCAS-Italic",
		bold: "EuphemiaUCAS-Bold"	
	}},
	*/
	{name: "Futura", styles:{
		normal: "Futura-Medium",
		italic: "Futura-MediumItalic"
	}},
	
	{name: "Futura Condensed", styles: {
		normal: "Futura-CondensedMedium",
		bold: "Futura-CondensedExtraBold"
	}},
	/*
	{name: "Geeza Pro", styles:{
		normal: "GeezaPro",
		bold: "GeezaPro-Bold"
	}},
	
	{name: "Georgia", styles:{
		normal: "Georgia",
		italic: "Georgia-Italic",
		bold: "Georgia-Bold",
		boldItalic: "Georgia-BoldItalic"
	}},
	
	{name: "Gill Sans", styles: {
		normal: "GillSans",
		italic: "GillSans-Italic",
		bold: "GillSans-Bold",
		boldItalic: "GillSans-BoldItalic",
		light: "GillSans-Light",
		lightItalic: "GillSans-LightItalic"
	}},
	
	{name: "Gujarati Sangam", styles:{
		normal: "GujaratiSangamMN",
		bold: "GujaratiSangamMN-Bold"
	}},
	
	{name: "Gurmukhi", styles:{
		normal: "GurmukhiMN",
		bold: "GurmukhiMN-Bold"
	}},
	
	{name: "Heiti SC", styles:{
		normal: "STHeitiSC-Light",
		bold: "STHeitiSC-Medium"
	}},
	
	{name: "Heiti TC", styles:{
		normal: "STHeitiTC-Light",
		bold: "STHeitiTC-Medium"
	}},
	*/
	{name: "Helvetica", styles:{
		normal: "Helvetica",
		italic: "Helvetica-Oblique",
		bold: "Helvetica-Bold",
		boldItalic: "Helvetica-BoldOblique",
		light: "Helvetica-Light",
		lightItalic: "Helvetica-LightOblique"
	}},
	
	{name: "Helvetica Neue", styles:{
		normal: "HelveticaNeue",
		italic: "HelveticaNeue-Italic",
		bold: "HelveticaNeue-Bold",
		boldItalic: "HelveticaNeue-BoldItalic",
		mediumBold: "HelveticaNeue-Medium",
		mediumLight: "HelveticaNeue-Light",
		mediumLightItalic: "HelveticaNeue-LightItalic",
		light: "HelveticaNeue-UltraLight",
		lightItalic: "HelveticaNeue-UltraLightItalic"
	}},
	
	{name: "Helvetica Neue Condensed", styles:{
		normal: "HelveticaNeue-CondensedBold",
		bold: "HelveticaNeue-CondensedBlack"
	}},
	/*
	{name: "Hiragino Kaku Gothic", styles:{
		normal: "HiraKakuProN-W3",
		bold: "HiraKakuProN-W6"
	}},
	
	{name: "Hiragino Mincho", styles:{
		normal: "HiraMinProN-W3",
		bold: "HiraMinProN-W6"
	}},
	*/
	{name: "Hoefler Text", styles:{
		normal: "HoeflerText-Regular",
		italic: "HoeflerText-Italic",
		bold: "HoeflerText-Black",
		boldItalic: "HoeflerText-BlackItalic"
	}},
	
	{name: "Kannada Sangam", styles:{
		normal: "KannadaSangamMN",
		bold: "KannadaSangamMN-Bold"
	}},
	/*
	{name: "Malayalam Sangam", styles:{
		normal: "MalayalamSangamMN",
		bold: "MalayalamSangamMN-Bold"
	}},
	
	{name: "Marion", styles:{
		normal: "Marion-Regular",
		italic: "Marion-Italic",
		bold: "Marion-Bold"
	}},
	*/
	{name: "Marker Felt", styles:{
		normal: "MarkerFelt-Thin",
		bold: "MarkerFelt-Wide"
	}},
	
	{name: "Noteworthy", styles:{
		normal: "Noteworthy-Light",
		bold: "Noteworthy-Bold"
	}},
	/*
	{name: "Optima", styles:{
		normal: "Optima-Regular",
		italic: "Optima-Italic",
		extraBold: "Optima-ExtraBlack",
		bold: "Optima-Bold",
		boldItalic: "Optima-BoldItalic"
	}},
	
	{name: "Oriya Sangam", styles:{
		normal: "OriyaSangamMN",
		bold: "OriyaSangamMN-Bold"
	}},
	
	{name: "Palatino", styles:{
		normal: "Palatino-Roman",
		italic: "Palatino-Italic",
		bold: "Palatino-Bold",
		boldItalic: "Palatino-BoldItalic"
	}},
	*/
	{name: "Papyrus", styles:{
		normal: "Papyrus"
	}},
	
	{name: "Papyrus Condensed", styles:{
		normal: "Papyrus-Condensed"
	}},
	/*
	{name: "Party", styles:{
		normal: "PartyLetPlain"
	}},
	
	{name: "Sinhala Sangam", styles:{
		normal: "SinhalaSangamMN",
		bold: "SinhalaSangamMN-Bold"
	}},
	*/
	{name: "Snell Roundhand", styles:{
		normal: "SnellRoundhand",
		extraBold: "SnellRoundhand-Black",
		bold: "SnellRoundhand-Bold"
	}},
	/*
	{name: "Tamil Sangam", styles:{
		normal: "TamilSangamMN",
		bold: "TamilSangamMN-Bold"
	}},
	
	{name: "Telugu Sangam", styles:{
		normal: "TeluguSangamMN",
		bold: "TeluguSangamMN-Bold"
	}},
	
	{name: "Thonburi", styles:{
		normal: "Thonburi",
		bold: "Thonburi-Bold"
	}},
	
	{name: "Times New Roman", styles:{
		normal: "TimesNewRomanPSMT",
		italic: "TimesNewRomanPS-ItalicMT",
		bold: "TimesNewRomanPS-BoldMT",
		boldItalic: "TimesNewRomanPS-BoldItalicMT"
	}},
	*/
	{name: "Trebuchet", styles:{
		normal: "TrebuchetMS",
		italic: "TrebuchetMS-Italic",
		bold: "TrebuchetMS-Bold",
		boldItalic: "TrebuchetMS-BoldItalic"
	}},
	
	{name: "Verdana", styles:{
		normal: "Verdana",
		italic: "Verdana-Italic",
		bold: "Verdana-Bold",
		boldItalic: "Verdana-BoldItalic"
	}},
	
	{name: "Zapfino", styles:{
		normal: "Zapfino"
	}}];
};
