---
date: 2021-09-13
tags:
  - CSS
  - HTML
summary: Here is a list of five techniques for centering text within a div using CSS.
permalink: /en/blog/:slug
---

# Five ways to center text within a div using CSS

<social-share class="social-share--header" />

[Español](/blog/cinco-formas-centrar-texto-div-css/) | English

Here is a list of five techniques for centering text within a div using CSS.

## 1. _flexbox_ method

Flexbox enables us to efficiently define the alignment and positioning of our elements. To do so, we'll employ the horizontal alignment (_justify-content_) and vertical alignment (_align-items_) features of flexbox when assuming the default value of _flex-direction: row_.

``` html
<div class="flexbox">
  flexbox
</div>
```

``` css
.flexbox {
  align-items: center;
  display: flex;
  height: 100px;
  justify-content: center;
  width: 200px;

  background: #ffff99;
  color: #333;
}
```

<style>
.flexbox {
  align-items: center;
  display: flex;
  height: 100px;
  justify-content: center;
  width: 200px;

  background: #ffff99;
  color: #333;
}
</style>

<div class="flexbox">
  flexbox
</div>

> We can simplify this example even further by using just _display: grid;_ and _place-items: center;_ instead of _display: flex;_, _align-items: center;_, and _justify-content: center;_.

## 2. _margin auto_ method

This technique relies on utilizing the _margin_ property of the element you wish to center, creating the desired centering effect by adjusting its distance from the edges of the container. When combined with the features of flexbox, it also allows achieving vertical text alignment.

``` html
<div class="margin-auto">
  <span class="margin-auto__content">
    margin auto
  </span>
</div>
```

``` css
.margin-auto {
  display: flex;
  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.margin-auto__content {
  margin: auto;
}
```

<style>
.margin-auto {
  display: flex;
  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.margin-auto__content {
  margin: auto;
}
</style>

<div class="margin-auto">
  <span class="margin-auto__content">
    margin auto
  </span>
</div>

## 3. _text align center_ method

This is the simplest classic technique, centered text alignment is achieved by using the _text-align_ property of the parent element.

It's also possible to vertically center the text by using the _vertical-align_ property in combination with the _line-height_ property (which should be set to the same height as the text container and is typically used in containers with a fixed height).

``` html
<div class="text-align-center">
  text align center
</div>
```

``` css
.text-align-center {
  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;

  line-height: 100px;
  text-align: center;
  vertical-align: middle;
}
```

<style>
.text-align-center {
  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;

  line-height: 100px;
  text-align: center;
  vertical-align: middle;
}
</style>

<div class="text-align-center">
  text align center
</div>

## 4. _position absolute_ method

This technique allows you to place the text anywhere within its container. In our case, as we wish to center it, we first position the top-left corner of our text in the center of the container using the _top_ and _left_ properties set to 50%. Finally, we adjust its position with the _transform_ property, shifting it 50% to the left and upwards to center it within its container.

By setting the position to absolute, we remove the element from the page flow. It's important to note that if not used correctly, this technique can lead to unintended element overlap.

``` html
<div class="position-absolute">
  <span class="position-absolute__content">
    position absolute
  </span>
</div>
```

``` css
.position-absolute {
  position: relative;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.position-absolute__content {
  left: 50%;
  position: absolute;
  top: 50%;

  transform: translate(-50%, -50%);
}
```

<style>
.position-absolute {
  position: relative;

  height: 100px;
  width: 200px;

  background: #ffff99;
  color: #333;
}

.position-absolute__content {
  position: absolute;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);
}
</style>

<div class="position-absolute">
  <span class="position-absolute__content">
    position absolute
  </span>
</div>

## 5. _table cell_ method

When our container element doesn't have fixed height or width but adapts to 100% of its parent element (commonly used, for example, when the _html_ or _body_ elements are set to 100%), we can use the _display: table-cell;_ property to expand our text's size to match that of its container. We also need to add the _display: table;_ property to the container. Once our element is extended, we can center the text as in method 3.

``` html
<div class="table-cell">
  <div class="table-cell__container">
    <span class="table-cell__content">
      table cell
    </span>
  </div>
</div>
```

``` css
.table-cell {
  height: 100px;
  width: 200px;
}

.table-cell__container {
  display: table;
  height: 100%;
  width: 100%;
}

.table-cell__content {
  display: table-cell;

  text-align: center;
  vertical-align: middle;

  background: #ffff99;
  color: #333;
}
```

<style>
.table-cell {
  height: 100px;
  width: 200px;
}

.table-cell__container {
  display: table;
  height: 100%;
  width: 100%;
}

.table-cell__content {
  display: table-cell;

  text-align: center;
  vertical-align: middle;

  background: #ffff99;
  color: #333;
}
</style>

<div class="table-cell">
  <div class="table-cell__container">
    <span class="table-cell__content">
      table cell
    </span>
  </div>
</div>

---
<social-share class="social-share--footer" />
