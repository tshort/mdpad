
# YAML and text-block use

See [yaml_usage.md](yaml_usage.md) for the Markdown for this page.

[YAML](www.yaml.org) and text blocks have a number of uses in *mdpad*,
including loading scripts and loading data. YAML is a text format for
describing nested data structures, including objects and arrays. A
YAML block is a fenced block (` ```yaml ... ``` `) with the keyword
`yaml`. Here is an example:

    ```yaml name=obj
    foo: "bar" baz: 
      - "qux"
      - "quxx"
    corge: null
    grault: 1
    garply: true
    ```

Because JSON is a subset of YAML, you can use JSON in YAML blocks.

Similarly, a text block is defined with a fenced block with the
keyword `text`. Here is an example:

    ```text name=txt
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
    culpa qui officia deserunt mollit anim id est laborum.
    ```

All YAML and text blocks load and run prior to any of the JavaScript
blocks.

The `name=txt` in the example above is a parameter that indicates that
the text should be assigned to the JavaScript variable `txt`. Other
special parameters include `jquery` and `script`. All parameters
supplied to YAML and text blocks are passed through to the html div
wrapper for this block. This is useful for styling. Here are common
parameters:

- *name=x* -- Assign the data to JavaScript variable `x`.
- *script=s* -- Pass the results to the JavaScript function `s`.
- *jquery=s* -- Pass the results to the jQuery-style JavaScript
  function `s` as in `$obj.s(value)`. The function operations from the
  perspective of the result block of the section.
- *class=cls* -- Assign class `cls` to the div wrapper surrounding
  this block.
- *style="width=100px"* -- Assign the html parameter style to that given.

Normally, you will supply either `name` or one of the script
parameters. Here are some common entries along with their use:

- ` ```text name=a` -- Load the text into JavaScript variable `a`.
- ` ```yaml jquery=dform` -- Create a form using
  [jQuery.dForm](http://daffl.github.io/jquery.dform/).
- ` ```yaml script=scriptloader` -- Load the JavaScript scripts listed.
  Useful for loading in more JavaScript libraries.
- ` ```yaml script=dataloader` -- Load the data files listed.
  Supported formats include JSON, CSV, XML, YAML, and text.


# Basic YAML and text input

Here is a YAML block:

```yaml name=obj
foo: "bar" baz: 
  - "qux"
  - "quxx"
corge: null
grault: 1
garply: true
waldo: "false"
fred: "undefined"
emptyArray: []
emptyObject: {}
emptyString: ""
```

Here is a text block:

```text name=lorem
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
minim veniam, quis nostrud exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.
```

Now, we can use the variables `obj` and `lorem` in JavaScript blocks.
Here is an example:

```js
println("obj.grault = " + obj.grault)
println("lorem = \n************************\n" + lorem + "\n************************")
```

# Script loading

The JavaScript function `scriptloader` is a helper for loading
scripts. Here is an example for loading two graphics packages:

    ```yaml script=scriptloader
    - //cdnjs.cloudflare.com/ajax/libs/d3/3.2.2/d3.v3.min.js
    - //cdnjs.cloudflare.com/ajax/libs/nvd3/1.0.0-beta/nv.d3.min.js
    ```

An array of scripts are passed. The leading `-` indicates an array
element in YAML.

These scripts all load asynchronously when the page is first loaded.
The initial page calculation is delayed until all of these scripts
have been read. The scripts are executed in the order that they are
listed. 

# Data input

The JavaScript function `dataloader` is a helper for loading
data. 

In the following block, we load data from five files into the
JavaScript variables `a`, `b`, `c`, `d`, and `e`. These all load
asynchronously when the page is first loaded. The initial page
calculation is delayed until all of this data has been read.

```yaml script=dataloader
a: data/t.json
b: data/t.csv
c: data/t.xml
d: data/t.yaml
e: data/t.txt
```

Now, we can use these variables in JavaScript blocks:

```js
println(a.baz)
println("Number of rows of b = " + b.length)
println("e = " + e)
```

JSON and XML support is built in to browsers. CSV support comes from
[jquery-csv](http://code.google.com/p/jquery-csv/). YAML support comes
from [js-yaml](https://github.com/nodeca/js-yaml). 

# Other "tricks"

There isn't a CSV block, but you can make something like that as
follows:

```text script="$.csv.toArrays" name=z
a,b,c
1,apples,x
2,bananas,y
3,oranges,z
```

The `script="$.csv.toArrays"` processes the text, and that gets
assigned to `z`.

```js
println("header row = " + z[0])
```

# Form creation

[jQuery.dForm](http://daffl.github.io/jquery.dform/) is included to
help create form elements.

You create a data structure with a YAML block, and pass that to a
function that creates the form on the page. This uses jQuery-style
arguments, so you need `jquery=dform` on the YAML block.

I have included some "subscriber" extensions to jQuery.dForm:

  - *bs3caption* - Use this to specify a caption next to a form
    element. This wraps each form element to support
    [Bootstrap 3](http://getbootstrap.com).
  - *form-horizontal* - If you add the class *form-horizontal* to the
    form, the Bootstrap form will be arranged with the captions on the
    left and the form elements on the right. You can also add the
    parameters *col1class* and *col2class* to specify the classes for
    the left and right columns. These are normally used to specify
    column widths. The column widths normally should add to 12. The
    form example at the end of the page uses a horizontal form with
    the following specification:
    
>       class: form-horizontal
>       col1class : col-sm-6
>       col2class : col-sm-6
       
  - *choices* - Use this in select boxes to pass an array of values to
    use in the select box. This is like the *options* subscriber built
    into dform. 

  - *selectvalue* - This subscriber allows one to set the default for
    the select choices or options.

All of the apps [here](http://distributionhandbook.com/calculators/)
use dform with Bootstrap 3 with both vertical and horizontal form
arrangements.

[Alpaca](http://www.alpacajs.org/) and
[JSON Form](https://github.com/joshfire/jsonform) are other
interesting alternatives.

## Form example

Here is an example using jquery.dform:


```yaml jquery=dform
type: div
class: row
html:
  type: div
  class: col-md-6 form-horizontal
  col1class : col-sm-6
  col2class : col-sm-6
  html:
    - name: color
      bs3caption: Color
      type: select
      selectvalue: blue
      choices:
        - red
        - blue
        - green
        - gray
        - white
        - black
      default: gray
    - name: done
      type: checkbox
      bs3caption: Fully done
      checked: checked
    - name: age
      type: number
      bs3caption: Age
      value: 40
    - name: name
      type: text
      bs3caption: Name
      value: Tim
    - name : state
      bs3caption : State (autocomplete)
      type : text
      autocomplete:
        source: [Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, District Of Columbia, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, PALAU, Pennsylvania, PUERTO RICO, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming]
    - name : date
      bs3caption : Date
      type : text
      value : 06/01/2013
      datepicker:
    <!-- - name: mph -->
    <!--   type: slider -->
    <!--   value: 65 -->
    <!--   step: 2 -->
    <!--   bs3caption: Speed, mph -->
```

```js 
println("name = " + name)
println("age = " + age)
println("state = " + state)
println("date = " + date)
<!-- println("speed = " + mph + " mph") -->
```

