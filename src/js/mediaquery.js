;(function ($, Formstone, undefined) {

	"use strict";

	/**
	 * @method private
	 * @name initialize
	 * @description Initializes plugin.
	 * @param opts [object] "Plugin options"
	 */

	function initialize(options) {
		options = options || {};

		// Build Media Queries

		for (var i in MQStrings) {
			if (MQStrings.hasOwnProperty(i)) {
				Defaults[i] = (options[i]) ? $.merge(options[i], Defaults[i]) : Defaults[i];
			}
		}

		Defaults = $.extend(Defaults, options);

		// Sort

		Defaults.minWidth.sort( sortDesc );
		Defaults.maxWidth.sort( sortAsc );
		Defaults.minHeight.sort( sortDesc );
		Defaults.maxHeight.sort( sortAsc );

		// Bind Media Query Matches

		for (var j in MQStrings) {
			if (MQStrings.hasOwnProperty(j)) {
				MQMatches[j] = {};
				for (var k in Defaults[j]) {
					if (Defaults[j].hasOwnProperty(k)) {
						var mq = window.matchMedia( "(" + MQStrings[j] + ": " + (Defaults[j][k] === Infinity ? 100000 : Defaults[j][k]) + Defaults.unit + ")" );
						mq.addListener( onStateChange );
						MQMatches[j][ Defaults[j][k] ] = mq;
					}
				}
			}
		}

		// Initial Trigger

		onStateChange();
	}

	/**
	 * @method private
	 * @name setState
	 * @description Sets current media query match state.
	 */

	function setState() {
		State = {
			unit: Defaults.unit
		};

		for (var i in MQStrings) {
			if (MQStrings.hasOwnProperty(i)) {

				for (var j in MQMatches[i]) {
					if (MQMatches[i].hasOwnProperty(j) && MQMatches[i][j].matches) {

						var state = (j === "Infinity") ? Infinity : parseInt(j, 10);

						if (i.indexOf("max") > -1) {
							if (!State[i] || state < State[i]) {
								State[i] = state;
							}
						} else {
							if (!State[i] || state > State[i]) {
								State[i] = state;
							}
						}

					}
				}

			}
		}
	}

	/**
	 * @method private
	 * @name onStateChange
	 * @description Handles media query changes.
	 */

	function onStateChange() {
		setState();

		$Window.trigger(Events.mqChange, [ State ]);
	}

	/**
	 * @method private
	 * @name onBindingChange
	 * @description Handles a binding's media query change.
	 */

	function onBindingChange(mq) {
		var key        = createKey(mq.media),
			binding    = Bindings[ key ],
			event      = mq.matches ? Events.enter : Events.leave;

		if (binding.active || (!binding.active && mq.matches)) {
			for (var i in binding[ event ]) {
				if (binding[ event ].hasOwnProperty(i)) {
					binding[ event ][i].apply( binding.mq );
				}
			}

			binding.active = true;
		}
	}

	/**
	 * @method private
	 * @name sortAsc
	 * @description Sorts an array (ascending).
	 * @param a [mixed] "First value"
	 * @param b [mixed] "Second value"
	 * @return Difference between second and first values
	 */

	function sortAsc(a, b) {
		return (b - a);
	}

	/**
	 * @method private
	 * @name sortDesc
	 * @description Sorts an array (descending).
	 * @param a [mixed] "First value"
	 * @param b [mixed] "Second value"
	 * @return Difference between first and second values
	 */

	function sortDesc(a, b) {
		return (a - b);
	}

	/**
	 * @method private
	 * @name createKey
	 * @description Creates valid object key from string.
	 * @param text [String] "String to create key from"
	 * @return [string] Valid object key
	 */

	function createKey(text) {
		return text.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '');
	}

	/**
	 * @method
	 * @name state
	 * @description Returns the current state.
	 * @return [object] "Current state object"
	 * @example var state = $.mediaquery("state");
	 */

	function getState() {
		return State;
	}

	/**
	 * @method
	 * @name bind
	 * @description Binds callbacks to media query matching.
	 * @param media [string] "Media query to match"
	 * @param data [object] "Object containing 'enter' and 'leave' callbacks"
	 * @example $.mediaquery("bind", "(min-width: 500px)", { ... });
	 */

	function bind(media, data) {
		var key = createKey(media);

		if (!Bindings[ key ]) {
			Bindings[ key ] = {
				mq:        Window.matchMedia(media),
				active:    true,
				enter:     [],
				leave:     []
			};

			Bindings[ key ].mq.addListener( onBindingChange );
		}

		for (var i in data) {
			if (data.hasOwnProperty(i) && Bindings[ key ].hasOwnProperty(i)) {
				Bindings[ key ][i].push( data[i] );
			}
		}

		onBindingChange( Bindings[ key ].mq );
	}

	/**
	 * @method
	 * @name unbind
	 * @description Unbinds all callbacks from media query.
	 * @param media [string] "Media query to match"
	 * @example $.mediaquery("unbind", "(min-width: 500px)");
	 */

	function unbind(media) {
		var key = createKey(media);

		if (Bindings[ key ]) {
			Bindings[ key ].mq.removeListener( onBindingChange );
			Bindings = Bindings.splice(Bindings.indexOf( Bindings[ key ] ), 1);
		}
	}

	/**
	 * @plugin
	 * @name Media Query
	 * @description A jQuery plugin for responsive media query events.
	 * @type utility
	 * @dependency core.js
	 */

	var Plugin = Formstone.Plugin("mediaquery", {
			utilities: {
				_initialize    : initialize,
				state          : getState,
				bind           : bind,
				unbind         : unbind
			},

			/**
			 * @events
			 * @event mqchange.mediaquery "Change to a media query match; Triggered on window"
			 */

			events: {
				mqChange    : "mqchange"
			}
		}),

		/**
		 * @options
		 * @param minWidth [array] <[ 0 ]> "Array of min-widths"
		 * @param maxWidth [array] <[ Infinity ]> "Array of max-widths"
		 * @param minHeight [array] <[ 0 ]> "Array of min-heights"
		 * @param maxHeight [array] <[ Infinity ]> "Array of max-heights"
		 * @param unit [string] <'px'> "Unit to use when matching widths and heights"
		 */

		Defaults = {
			minWidth     : [ 0 ],
			maxWidth     : [ Infinity ],
			minHeight    : [ 0 ],
			maxHeight    : [ Infinity ],
			unit         : "px"
		},

		// Raw events for switch
		Events = $.extend(Plugin.events, {
			enter       : "enter",
			leave       : "leave"
		}),

		// Localize References

		$Window        = Formstone.$window,
		Window         = $Window[0],

		// Internal

		State          = null,
		Bindings       = [],
		MQMatches      = {},
		MQStrings      = {
			minWidth:     "min-width",
			maxWidth:     "max-width",
			minHeight:    "min-height",
			maxHeight:    "max-height"
		};

})(jQuery, Formstone);