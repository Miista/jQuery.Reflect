String.prototype.format = function() {
	var args = arguments;
	return this.replace(/%(\d+)/g, function(match, number) { 
		return typeof args[number] != "undefined"
			? args[number]
			: match
		;
	});
};

(function($) {
	var options;
		
	$.fn.reflect = function(_options) {
		var textValue = this.html();
		options = _options;

		/* 
		 * Set default values if these are not already set.
		 */
		options = $.extend({
			classname: "jquery-ui-plugin-reflection",
			opacity: .5,
			top: "-.7em",
			left: "0em",
			right: "0em",
			paddingLeft: "0em",
			gradientHeight: "1em",
			gradientColor: $("body").css("backgroundColor")
		}, options);
		
		internals.normalizeOptions();
		
		/*
		 * Attach internal options...
		 */
		options = $.extend({
			internal: {
				textValue: textValue,
				sharedDisplay: "block",
				sharedPosition: "absolute",
				commonPosition: "relative",
				gradientAlpha: 0,
				foregroundColor: options.gradientColor,
				backgroundColor: options.gradientColor
			}
		}, options);
		
		
		$("head").append(internals.createStyle(options));
		this.addClass(options.classname);
	}
	
	var internals = {
		createStyle: function(options) {
			return ["<style>",
					internals.createCommon(options),
					internals.createShared(options),
					internals.createBefore(options),
					internals.createAfter(options),
					"</style>"].join("\n").format(options.classname);
		},
		createCommon: function(options) {
			return [".%0 {",
					"position: %1;",
					"}"].join("\n").format(	options.classname,
											options.internal.commonPosition);
		},
		createShared: function(options) {
			return [".%0:before, .%0:after {",
					"display: %1;",
					"position: %2;",
					"bottom: %3;",
					"left: %4;",
					"right: %5;",
					"padding-left: %6",
					"}"].join("\n").format(	options.classname,
											options.internal.sharedDisplay,
											options.internal.sharedPosition,
											options.top,
											options.left,
											options.right,
											options.paddingLeft);
		},
		createBefore: function(options) {
			return [".%0:before {",
					"content: '%1';",
					"opacity: %2;",
					"-webkit-transform: scaleY(-1);",
					"-moz-transform: scaleY(-1);",
					"-o-transform: scaleY(-1);",
					"}"].join("\n").format(	options.classname,
											options.internal.textValue,
											options.opacity);
		},
		createAfter: function(options) {
			return [".%0:after{",
					"background: -webkit-gradient(linear, left top, left center, from(rgba(%1, %2, %3, %4)), to(rgb(%5, %6, %7)));",
					"background: -moz-linear-gradient(top, rgba(%1, %2, %3, %4), rgb(%5, %6, %7));",
					"content: ' ';",
					"height: %8;",
					"}"].join("\n").format(	options.classname,
											options.internal.foregroundColor.red,
											options.internal.foregroundColor.green,
											options.internal.foregroundColor.blue,
											options.internal.gradientAlpha,
											options.internal.backgroundColor.red,
											options.internal.backgroundColor.green,
											options.internal.backgroundColor.blue,
											options.gradientHeight
											);
		},
		normalizeOptions: function() {
			var uniqueId = new Date().getTime();
			options.classname = options.classname + internals.generateUniqueId();
			if (options.gradientColor == "undefined") {
				options.gradientColor = internals.parseColor([255, 255, 255]);
			} else 
			/*
			 * If both red, green and blue is set on gradientColor, 
			 * it is safe to assume that gradientColor is an object
			 * that we can use.
			 */
			if (!isNaN(options.gradientColor.red)
				&& !isNaN(options.gradientColor.green)
				&& !isNaN(options.gradientColor.blue)) {
				return;
			} else {
				options.gradientColor = internals.parseColor(options.gradientColor);
			}
		},
		/**
		 * Parses the input as either a string with the format: "rgb(red, green, blue)"
		 * or as an array with 3 values where
		 * [0] = red
		 * [1] = green
		 * [2] = blue
		 * 
		 */
		parseColor: function(color) {
			if (color instanceof Array) {
				return {
					red: color[0],
					green: color[1],
					blue: color[2]
				};
			} else if (/^rgba?\((\d{0,3}(,\s)?){4}\)$/.test(color)) {
				color = color.replace(/rgb\((.+)\)/, "$1");
				var split = color.split(", ");
				return {
					red: parseInt(split[0]),
					green: parseInt(split[1]),
					blue: parseInt(split[2])
				};
			}
		},
		generateUniqueId: function() {
			return new Date().getTime();
		}
	}
})(jQuery);

/*
 * If no method with the name rgb exists, add it.
 */
if (window.rgb == "undefined") {
	function rgb(red, green, blue) {
		return {
			red: red,
			green: green,
			blue: blue
		};
	}
}