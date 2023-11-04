---
date: 2023-3-15
tags:
  - CSS
  - HTML
summary: Centrally aligning a div in HTML and CSS is a common task in the web design. A div can encapsulate any content you wish to center, such as text, images, or videos, so when creating a web page, it's often desirable ...
permalink: /en/blog/:slug
---

# How to center a div?

<social-share class="social-share--header" />

[Español](/blog/como-centrar-div/) | English

Centrally aligning a div in HTML and CSS is a common task in the web design. A div can encapsulate any content you wish to center, such as text, images, or videos, so when creating a web page, it's often desirable to position a div in the center of the page or another container element for the div. The container is the parent element of the div and is used to align the div in its center. The container can be any HTML element, but the _body_ element is the commonly employed. In this article, we will explore various methods for centering a div using HTML and CSS.

## 1. Utilizing the CSS Flexible Box Layout (flexbox) for axis alignment

The CSS property _display: flex_ is employed to create a flexible container that automatically adapts to the content's size. To center a div using flexbox, we merely need to apply the _display: flex_ property to the container, along with the axis alignment properties _justify-content: center;_ and _align-items: center;_. This obviates the necessity to explicitly define the child element's alignment, as the parent container itself takes charge of positioning the child element.

``` html
<div class="flexbox-align">
  <div class="flexbox-align__content">
    flexbox align
  </div>
</div>
```

``` css
.flexbox-align {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}
.flexbox-align__content {
}
```

<style>
.flexbox-align {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}
.flexbox-align__content {
}
</style>

<div class="flexbox-align">
  <div class="flexbox-align__content">
    flexbox align
  </div>
</div>

This technique enables us to explore all the alignment possibilities that flexbox provides regarding both the primary and secondary axes.

## 2. Applying CSS Flexible Box Layout (flexbox) with automatic content margin

The combination of the CSS properties _display: flex_ and _margin: auto_ allows the browser to adapt the child element to the container's size. To center a div using flexbox and automatic margins, we simply apply the _display: flex_ property to the container and, on the other hand, the _margin: auto_ property to the content. This will automatically center the div within the container.

``` html
<div class="flexbox-margin-auto">
  <div class="flexbox-margin-auto__content">
    flexbox margin auto
  </div>
</div>
```

``` css
.flexbox-margin-auto {
  display: flex;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}
.flexbox-margin-auto__content {
  margin: auto;
}
```

<style>
.flexbox-margin-auto {
  display: flex;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}
.flexbox-margin-auto__content {
  margin: auto;
}
</style>

<div class="flexbox-margin-auto">
  <div class="flexbox-margin-auto__content">
    flexbox margin
  </div>
</div>

## 3. Employing CSS Grid Layout (grid)

The CSS property _display: grid_ is used to create a two-dimensional grid for flexible content organization. To center a div using grid, you merely need to apply the _display: grid_ property to the container, along with the axis alignment property _place-items: center;_, and, on the other hand, apply the _margin: auto_ property to the div. This will automatically center the div within the container.

``` html
<div class="grid">
  <div class="grid__content">
    grid
  </div>
</div>
```

``` css
.grid {
  display: grid;
  place-items: center;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}
.grid__content {
  margin: auto;
}
```

<style>
.grid {
  display: grid;
  place-items: center;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}
.grid__content {
  margin: auto;
}
</style>

<div class="grid">
  <div class="grid__content">
    grid
  </div>
</div>

## 4. Utilizing transformations to alter the coordinate space.

The CSS property _transform: translate()_ is employed to rotate, scale, skew, or move an element in a specific direction. We will leverage this feature to center the div.

To center a div using transformation, we'll add the property _position: absolute_ to both the container and child elements, and apply the properties _left: 50%_ and _top: 50%_ to the child element to position the div in the center of the container. Then, we use the _transform: translate()_ property to adjust the top-left coordinates of the div, moving it left and upwards:

``` html
<div class="transform">
  <div class="transform__content">
    transform
  </div>
</div>
```

``` css
.transform {
  position: relative;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.transform__content {
  position: absolute;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);
}
```

<style>
.transform {
  position: relative;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.transform__content {
  left: 50%;
  position: absolute;
  top: 50%;

  transform: translate(-50%, -50%);
}
</style>

<div class="transform">
  <div class="transform__content">
    transform
  </div>
</div>

This technique should be applied with caution, as when using absolute positioning, we are removing the element from the page flow, which can lead to unintended element overlap.

## 5. Horizontal centering

If you solely desire to center a div horizontally, in addition to using variations of the techniques mentioned earlier, you can also utilize the CSS property _margin_ with the values _auto_ and _0_. To employ this method, you must specify a fixed width for the div. If the div's width is less than that of the container, the div will automatically center. In this example, I have set the _width_ property of the child element to 50% to make the div occupy half the width of the container. The _margin_ property sets the top and bottom margins to _0_ and the left and right margins to _auto_. This signifies that the browser will automatically compute the side margins to center the div horizontally.

``` html
<div class="horizontal">
  <div class="horizontal__content">
    horizontal horizontal horizontal horizontal
  </div>
</div>
```

``` css
.horizontal {
  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.horizontal__content {
  width: 50%;
  margin: 0 auto;
}
```

<style>
.horizontal {
  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.horizontal__content {
  width: 50%;
  margin: 0 auto;
}
</style>

<div class="horizontal">
  <div class="horizontal__content">
    horizontal
  </div>
</div>

## 6. Vertical centering using table layout

Vertical centering is slightly more intricate than horizontal centering, but there are various methods to achieve it. One common approach is to use the _display_ property with a value of _table-cell_ and then set the _vertical-align_ property to _middle_. In this example, we will set the _display_ property to _table_ for the container element. This instructs the browser to treat it as a table, enabling us to use the _table-cell_ property on the child div. The _vertical-align_ property is set to _middle_ to achieve vertical centering.

``` html
<div class="vertical-table">
  <div class="vertical-table__content">
    vertical table
  </div>
</div>
```

``` css
.vertical-table {
  display: table;

  height: 100px;
  width: 200px;
}

.vertical-table__content {
  display: table-cell;

  vertical-align: middle;

  background: #ffff99;
  color: #333;
}
```

<style>
.vertical-table {
  display: table;

  height: 100px;
  width: 200px;
}

.vertical-table__content {
  display: table-cell;

  vertical-align: middle;

  background: #ffff99;
  color: #333;
}
</style>

<div class="vertical-table">
  <div class="vertical-table__content">
    vertical table
  </div>
</div>

And by incorporating centered text alignment (using the _text-align_ property), we achieve complete content centering within the container:

``` css
.vertical-table-center {
  display: table;

  height: 100px;
  width: 200px;
}

.vertical-table-center__content {
  display: table-cell;

  vertical-align: middle;
  text-align: center;

  background: #ffff99;
  color: #333;
}
```

<style>
.vertical-table-center {
  display: table;

  height: 100px;
  width: 200px;
}

.vertical-table-center__content {
  display: table-cell;

  vertical-align: middle;
  text-align: center;

  background: #ffff99;
  color: #333;
}
</style>

<div class="vertical-table-center">
  <div class="vertical-table-center__content">
    vertical table center
  </div>
</div>

## 7. Absolute vertical centering

Another way to vertically center a div is by using the _position_ property with a value of _absolute_, setting margins to _auto_, and the properties _top_, _right_, _bottom_, and _left_ to 0. In this example, we will set the _position_ property to _relative_ for the container element, for which we must also define the _height_ property (if it were the _body_ element, you'd use the value _100vh_ to occupy the entire height of the browser window). By default, this will cause the content div to expand to the container's boundaries, so our content div should have a defined size smaller (or relative) to its container for complete centering. To ensure the text in this example also appears centered within the content div, we will add centered text alignment (the _text-align_ property).

``` html
<div class="vertical-absolute">
  <div class="vertical-absolute__content">
    vertical absolute
  </div>
</div>
```

``` css
.vertical-absolute {
  position: relative;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.vertical-absolute__content {
  margin: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  text-align: center;

  height: 50px;
  width: 100px;
}
```

<style>
.vertical-absolute {
  position: relative;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.vertical-absolute__content {
  margin: auto;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  text-align: center;

  height: 50px;
  width: 100px;
}
</style>

<div class="vertical-absolute">
  <div class="vertical-absolute__content">
    vertical absolute
  </div>
</div>

---
<social-share class="social-share--footer" />
