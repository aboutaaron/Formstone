# Media Query

A jQuery plugin for responsive media query events.

* [Use](#use)
* [Options](#options)
* [Events](#events)
* [Methods](#methods)

## Use 

#### Main

```markup
mediaquery.js
```

#### Dependencies

```markup
core.js
```

### Basic

Media Query can track global changes to screen size based on an existing grid system. This is useful when many elements need to be resized at any change to the target screen size. Start by configuring the dimensions to be tracked by passing arrays at initialization. These arrays should contain the target width and/or heights to react to:

```javascript
$.mediaquery({
	minWidth     : [ 320, 500, 740, 980, 1220 ],
	maxWidth     : [ 1220, 980, 740, 500, 320 ],
	minHeight    : [ 400, 800 ],
	maxHeight    : [ 800, 400 ]
});
```

### Events

After initializing, simply listen for the `mqchange.mediaquery` event:

```javascript
$(window).on("mqchange.mediaquery", function(e, state) {
	console.log(state.minWidth, state.maxWidth, state.minHeight, state.maxHeight);
});
```

Note: In the example above, the `mqchange.mediaquery` event will be fire twice for each breakpoint. This is because Mediaquery will respond to both the `min-width` and `max-width` changes.

### Binding

Media Query can also bind events to specific media query changes for more fine grain control:

```javascript
$.mediaquery("bind", "(min-width: 740px)", {
	enter: function() {
		...
	},
	leave: function() {
		...
	}
});
```

<!--
Note: The `leave` callback will only fire after the target media query has been matched at least once. If the media query never matches, neither callback will fire.
-->

#### IE Support

When supporting IE, a [HTML5 enabler](https://gist.github.com/benplum/8045366) and matchMedia polyfill ([IE 8](https://gist.github.com/benplum/8045336), [IE 9](https://gist.github.com/benplum/8045327)) are required.

## Options

Set instance options by passing a valid object at initialization, or to the public `defaults` method.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `minWidth` | ` 0 ` | &nbsp; | Array of min-widths |
| `maxWidth` | ` Infinity ` | &nbsp; | Array of max-widths |
| `minHeight` | ` 0 ` | &nbsp; | Array of min-heights |
| `maxHeight` | ` Infinity ` | &nbsp; | Array of max-heights |
| `unit` | `string` | `'px'` | Unit to use when matching widths and heights |

## Events

Events are triggered on the `window`, unless otherwise stated.

| Event | Description |
| --- | --- |
| `mqchange.mediaquery` | Change to a media query match; Triggered on window |

## Methods

Methods are publicly available, unless otherwise stated.

### bind

Binds callbacks to media query matching.

```javascript
$.mediaquery("bind", "(min-width: 500px)", { ... });
```

#### Parameters

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `media` | `string` | &nbsp; | Media query to match |
| `data` | `object` | &nbsp; | Object containing 'enter' and 'leave' callbacks |

### defaults

Extends plugin default settings; effects instances created hereafter.

```javascript
$.media query("defaults", { ... });
```

#### Parameters

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `object` | `{}` | New plugin defaults |

### state

Returns the current state.

```javascript
var state = $.mediaquery("state");
```

### unbind

Unbinds all callbacks from media query.

```javascript
$.mediaquery("unbind", "(min-width: 500px)");
```

#### Parameters

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `media` | `string` | &nbsp; | Media query to match |

