/**
 * serializeToJson jQuery plugin
 * https://github.com/raphaelm22/jquery.serializeToJSON
 * @version: v1.0.0 (August, 2015)
 * @author: Raphael Nunes
 *
 * Created by Raphael Nunes on 2015-08-28.
 *
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 */


(function($) {
    "use strict";

    $.fn.serializeToJson = function(options) {

		var f = {
			settings: $.extend({}, $.fn.serializeToJson.defaults, options),

			getValue: function(input) {
				var value = input.value;

				if (this.settings.parseBooleans) {
					var boolValue = (value + "").toLowerCase();
					if (boolValue === "true" || boolValue === "false") {
						value = boolValue === "true";
					}
				}

				return value;
			},

			createProperty: function(o, value, names) {
				var navObj = o;

				for (var i = 0; i < names.length; i++) {
					var currentName = names[i];

					if (i === names.length - 1) {
						navObj[currentName] = value;
					} else {
						var arrayKey = /\[\w+\]/g.exec(currentName);
						var isArray = arrayKey != null && arrayKey.length > 0;

						if (isArray) {
							currentName = currentName.substr(0, currentName.indexOf("["));

							if (this.settings.associativeArrays) {
								if (!navObj.hasOwnProperty(currentName)) {
									navObj[currentName] = {};
								}
							} else {
								if (!Array.isArray(navObj[currentName])) {
									navObj[currentName] = new Array();
								}
							}

							navObj = navObj[currentName];

							var keyName = arrayKey[0].replace(/[\[\]]/g, "");
							currentName = keyName;
						}

						if (!navObj.hasOwnProperty(currentName)) {
							navObj[currentName] = {};
						}

						navObj = navObj[currentName];
					}
				}
			},

			serializer: function(formAsArray) {
				var self = this;

				var serializedObject = {}

				$.each(formAsArray, function(i, input) {
					var value = self.getValue(input);
					var names = input.name.split(".");

					self.createProperty(serializedObject, value, names);
				});

				return serializedObject;
			}
		};

		return f.serializer(this.serializeArray());
    };
	
	$.fn.serializeToJson.defaults = {
		associativeArrays: true,
		parseBooleans: true
	};

})(jQuery);
