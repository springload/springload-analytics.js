Analytics.js
============

Google analytics event tracking module

### Basic setup

Just add a data-analytics attribute to a container containing links you want to track. Every link in that container will be tracked using the default category (uri), default action (click), and default label (href).

```html
<div data-analytics>
  <ul>
    <li><a href='/'>Home</a></li>
    <li><a href='/about-us/'>About us</a></li>
    <li><a href='/contact-us/'>Contact us</a></li>
  </ul>
</div>
```

Initialise GA once jQuery is ready.

```javascript
$(document).ready(function() {
    GA.init();
});
```

### Custom tracking

For more targeted tracking you can specify a category, action or value by populating the data-analytics attribute with pipe separated values.

E.g. Use custom category, custom action and a custom label
```html
<a data-analytics='Top navigation|Link click|Homepage link' href='/'>Home</a>
```

E.g. Use custom label only
```html
<a data-analytics='||Homepage link' href='/'>Home</a>
```

E.g. Use custom action only
```html
<a data-analytics='|Slide Next' href='#'>Next</a>
```

E.g. User custom category and custom value only
```html
<a data-analytics='UI Elements||Show data' href='#'>Show</a>
```

E.g. Custom track a group of elements with custom category and action
```html
<div data-analytics='Top navigation|Link click'>
  <ul>
    <li><a href='/'>Home</a></li>
    <li><a href='/about-us/'>About us</a></li>
    <li><a href='/contact-us/'>Contact us</a></li>
  </ul>
</div>
```



