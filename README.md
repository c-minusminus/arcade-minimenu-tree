
> Open this page at [https://c-minusminus.github.io/arcade-minimenu-tree/](https://c-minusminus.github.io/arcade-minimenu-tree/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/c-minusminus/arcade-minimenu-tree** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/c-minusminus/arcade-minimenu-tree** and click import

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>


## New Array Functions

added functions in arrays:

**--stringAndImage(string, Image)--**

```javascript
function arrays.stringAndImage(s, i)
```

* **s** - String to input
* **i** - Image to input, optional
* **returns:** A [string, Image]



**--doubleNumbers(number, number)--**

```javascript
function arrays.doubleNumbers(x, y)
```

* **x** - Number to input
* **y** - Other number to input
* **returns:** A { x: number, y: number }

## New Mini Menu Functions

added functions in Mini Menu:

```javascript
function miniMenu.createMenuTree(title, any[], { x: number, y: number })
```

* **title** - [string, Image] to input, make it from function arrays.stringAndImage(s, i)
* **items** - any[], preferably an array of [string, Image], each item is an arrays.stringAndImage(s, i)
* **pos** - { x: number, y: number } to input, make it from arrays.doubleNumbers(x, y). Optional
* **returns:** A menuTree.MenuTree