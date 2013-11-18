Analytics.js
============

Google analytics event tracking module

### Basic setup
Just add a data-analytics attribute to a container containing links you want to track, or to a specific element.

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

