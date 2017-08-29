# springload-analytics.js  [![npm](https://img.shields.io/npm/v/springload-analytics.js.svg?style=flat-square)](https://www.npmjs.com/package/springload-analytics.js)

> Google Analytics event tracking module with support for both classic and universal analytics code.

## Requirements

This requires the async version of the Google Analytics snippet to be loaded in the page. See the tracking code quickstart for more infomation: https://developers.google.com/analytics/devguides/collection/analyticsjs/

## Install

```sh
npm install --save springload-analytics.js
```

### Basic setup

Just add a `data-analytics` attribute to a container with links you want to track. Every link in that container will be tracked using the default category (uri), default action (click), default label (href), and default value (undefined).

```html
<div data-analytics>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about-us/">About us</a></li>
    <li><a href="/contact-us/">Contact us</a></li>
  </ul>
</div>
```

Initialise GA once the document is ready:

```javascript
import GA from 'springload-analytics.js';

GA.init();
```

### Override default options

You can override default options by passing an object to the init method:

```javascript
GA.init({
    default_category: 'Calculator',
    default_action: 'Interaction',
    default_separator: ':',
    default_trackable_attribute: 'aly',
    default_trackable_event: 'mouseenter',
    default_trackable_element: 'span',
    default_label_is_text_content: true
    categories: {
        buttons: 'Buttons'
    },
    actions: {
        slide_left: 'Slide left'
    }
});
```

### Custom tracking

For more targeted tracking you can specify a category, action or value by populating the `data-analytics` attribute with pipe (`|`) separated values.

```html
<!-- E.g. Use custom category, custom action, custom label and a custom value -->
<a data-analytics="Top navigation|Link click|Homepage link|1" href="/">Home</a>

<!-- E.g. Use custom label only -->
<a data-analytics="||Homepage link" href="/">Home</a>

<!-- E.g. Use custom action only -->
<a data-analytics="|Slide Next" href="#">Next</a>

<!-- E.g. Use custom value only -->
<a data-analytics="|||1" href="/">Home</a>

<!-- E.g. Use custom category and custom label only -->
<a data-analytics="UI Elements||Show data" href="#">Show</a>

<!-- E.g. Use custom category and custom value only -->
<a data-analytics="UI Elements|||1" href="#">Show</a>

<!-- E.g. Custom track a group of elements with custom category and action -->
<div data-analytics="Top navigation|Link click">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about-us/">About us</a></li>
    <li><a href="/contact-us/">Contact us</a></li>
  </ul>
</div>
```

### Tracking dynamically

You can track within a JavaScript file by calling the track method:

```javascript
// Specify a label, category and action.
GA.track(label, category, action);

// Specify only a label - will use default category and action.
GA.track(label);

// Specify a label, category, action and value.
GA.track(label, category, action, value);
```

### Setup additional trackable elements on the fly

You can set up additional/alternative trackable elements on the fly by calling `GA.setupTrackables`:

```javascript
/**
 * Setup additional trackable elements on the fly after initialisation
 * @param trackable_attribute data attribute
 * @param trackable_event event type. e.g. mouseenter
 * @param trackable_element - e.g. span
 * @param label_attribute - where the default label is ready from. e.g. data-label
 * @param label_is_text_content - whether the node's text content is used as label
 */
GA.setupTrackables('analytics', 'mouseenter', 'span', 'data-label');
```

The markup for this example would be:

```html
<div data-analytics>
    <span data-label="Viewed on hover">Read more</span>
</div>
```
