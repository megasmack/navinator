Navinator
=========

Creates a "mobile" style nav from your "desktop" style nav.

#### Requires

jQuery 1.11.0 or higher

#### Example

Add the Navinator JavaScript file before the closing body tag. Add the Navinator CSS file in the head tag. The CSS is purposely minimal to make styling easy without needing to override a bunch of attributes.

Make sure your HTML page content is wrapped in a `div` ...

```html
<body>
  <div id="page-container">
    _(html content)_
  </div>
</body>
```

... also be sure have a triggering element.

```html
<button id="navinator-button">Menu</button>
```

Finally you just need a nav to "navinate."

```html
<nav id="my-main-nav">
  <a href="#">Some Links</a>
</nav>
```

Then just initialize with:

```javascript
$('#my-main-nav').navinator();
 ```

Enjoy your navinated Nav!

You can also set different options like so:

```javascript
$('#my-main-nav').navinator({
  direction: 'right',
  minWidth: 768,
  pageElement: '.my-page-wrapper',
  buttonElement: '.my-button',
  subNavElement: '.my-sub-nav'
});
```

In which your HTML might look like this:

```html
<nav class="main-nav">
<ul>
  <li>
    <a href="#">Navinator</a>
    <ul class="sub-nav">
      <li><a href="http://www.penny-arcade.com/" target="_blank">More links</a></li>
      <li><a href="http://www.tabletitans.com/" target="_blank">And more links</a></li>
    </ul>
  </li>
  <li><a href="https://gsdesign.com" target="_blank">GS</a></li>
  <li><a href="https://github.com/gsmke" target="_blank">GS on GitHub</a></li>
  <li><a href="https://twitter.com/GS_Design" target="_blank">GS on Twitter</a></li>
  <li><a href="https://www.facebook.com/GSonFB" target="_blank">GS on Facebook</a></li>
</ul>
</nav>
```

#### Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
buttonElement | string | '#navinator-button' | Defines which element to use as the toggle menu button
debug | boolean | false | Turn debugging information on in the console
direction | string | 'left' | Change the side of the screen the menu opens on. 'right' or 'left'
minWidth | integer | 0 | The minimum browser width to show Navinator. If it's larger, it switches back to your initially defined Nav. By default, there is no minimum width and Navinator is always shown.
pageElement | string | '#page-container' | Defines which element to use as the page wrapper
subNavElement | string | false | Defines an optional class for sub navigation

#### TODO

- reset or resize open nav on window resize
- add touch/swipe support
