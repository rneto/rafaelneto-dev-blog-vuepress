---
date: 2023-3-15
tags:
  - CSS
  - HTML
summary: Cómo centrar un div en HTML y CSS es una tarea común en el diseño web. Un div puede envolver cualquier contenido que desees centrar, como texto, imágenes o vídeos, así que cuando creamos una página web, a menudo queremos ...
permalink: /blog/:slug
---

# ¿Cómo centrar un div?

<social-share class="social-share--header" />

Español | [English](/en/blog/how-center-div/)

Cómo centrar un div en HTML y CSS es una tarea común en el diseño web. Un div puede envolver cualquier contenido que desees centrar, como texto, imágenes o vídeos, así que cuando creamos una página web, a menudo queremos que un div se coloque en el centro de la página o de otro elemento contenedor para el div. El contenedor es el elemento padre del div y se utiliza para alinear el div en el centro del mismo. El contenedor puede ser cualquier elemento HTML, pero el elemento _body_ suele ser el más comúnmente utilizado. En este artículo, exploraremos algunas formas de centrar un div usando HTML y CSS.

## 1. Utilizando CSS Flexible Box Layout (flexbox) alineando ejes

La propiedad CSS _display: flex_ se utiliza para crear un contenedor flexible que se ajusta automáticamente al tamaño del contenido. Para centrar un div utilizando flexbox, simplemente debemos agregar al contenedor la propiedad _display: flex_ junto con las propiedades de alineación de ejes _justify-content: center;_ y _align-items: center;_, lo que nos permite no tener que establecer la alineación del elemento hijo de forma explícita ya que es el propio contenedor padre quien se encarga de orientar la ubicación del elemento hijo.

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

Esta técnica nos permite explorar todas las posibilidades de alineación que nos ofrece flexbox en cuanto a la alineación de los ejes primario y secundario.

## 2. Utilizando CSS Flexible Box Layout (flexbox) con el margen automático del contenido

La combinación de las propiedad CSS _display: flex_ y _margin: auto_ permiten al navegador adaptar el elemento hijo al tamaño del contenedor. Para centrar un div utilizando flexbox y margen automático, simplemente debemos agregar al contenedor la propiedad _display: flex_ y por otro lado la propiedad _margin: auto_ al contenido. Esto centrará automáticamente el div en el centro del contenedor.

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

## 3. Utilizando CSS Grid Layout (grid)

La propiedad CSS _display: grid_ se utiliza para crear una cuadrícula bidimensional para organizar el contenido de forma flexible. Para centrar un div utilizando grid, simplemente debemos agregar al contenedor la propiedad _display: grid_ junto con la propiedad de alineación de ejes _place-items: center;_, y por otro lado la propiedad _margin: auto_ al div. Esto centrará automáticamente el div en el centro del contenedor.

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

## 4. Utilizando transformaciones para modificar el espacio de coordenadas

La propiedad CSS _transform: translate()_ se utiliza para rotar, escalar, sesgar o mover un elemento en una dirección específica, por lo que aprovecharemos dicha característica para centrar el div.

Para centrar un div utilizando transformación, agregaremos la propiedad _position: absolute_ a los elementos contenedor e hijo y las propiedades _left: 50%_ y _top: 50%_ al elemento hijo para posicionar el div en el centro del contenedor. Luego, utilizamos la propiedad _transform: translate()_ para mover las coordenadas superior izquierda del div hacia izquierda y hacia arriba:

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

Esta técnica debe aplicarse con cuidado ya que al usar posiciones absolutas, estamos eliminando el elemento del flujo de la página lo que puede provocar la sobreposición de elementos de manera no deseada.

## 5. Centrado horizontal

Si deseamos exclusivamente centrar un div horizontalmente, además de usar alguna variante de las técnicas anteriores, también podemos usar la propiedad CSS _margin_ con los valores _auto_ y _0_.  Para utilizar este método, debemos definir un ancho fijo para el div. Si el ancho del div es menor que el ancho del contenedor, el div se centrará automáticamente. En este ejemplo he establecido la propiedad _width_ del element hijo en 50% para que el div ocupe la mitad del ancho del contenedor. La propiedad _margin_ establece los márgenes superior e inferior en _0_ y el margen izquierdo y derecho en _auto_. Esto significa que el navegador calculará automáticamente los márgenes laterales para centrar el div horizontalmente.

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

## 6. Centrado vertical en modo tabla

El centrado vertical es un poco más complicado que el centrado horizontal, pero hay algunas formas de hacerlo. Una forma común es usar la propiedad _display_ con un valor de _table-cell_ y luego establecer la propiedad _vertical-align_ en _middle_. En este ejemplo, vamos a establecer la propiedad _display_ en _table_ para el elemento contenedor. Esto le dice al navegador que el debe actúa como una tabla, lo que nos permite utilizar la propiedad _table-cell_ en el div hijo. La propiedad _vertical-align_ se establece en _middle_ para centrar el div verticalmente.

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

Y si le añadimos la alineación centrada del texto (propiedad _text-align_), tendríamos el contenido completamente centrado en el contenedor:

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

## 7. Centrado vertical absoluto

Otra forma de centrar un div verticalmente es usando la propiedad _position_ con un valor de _absolute_, estableciendo los márgenes en _auto_ y las roiedades _top_, _right_, _bottom_ y _left_ a 0. En este ejemplo, vamos a establecer la propiedad _position_ en _relative_ para el elemento contenedor, para el que también debemos establecer la propiedad _height_ (si habláramos del elemento _body_ usaríamos el valor _100vh_ para que ocupara toda la altura de la ventana del navegador). Por defecto, esto hará que el div contenido se extienda hasta los límites del contenedor, por lo que nuestro div contenido debería tener un tamaño definido menor (o relativo) a su contenedor para centrarse completamente. Para que el texto de este ejemplo también aparezca centrado dentro del div contenido, añadiremos la alineación centrada del texto (propiedad _text-align_).

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
