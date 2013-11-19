# *mdpad*

## Live, interactive Markdown pages with embedded JavaScript and YAML

*mdpad* pages are meant to be an easy way to make simple web
interfaces or workbooks. These can be hosted as static pages.
Interactivity is provided by JavaScript. 

The target audience is someone who knows a bit of JavaScript and wants
to make simple web applications. The key feature of *mdpad* is easy
authoring of interactive web pages:

- Markdown for clean, easy page creation
- No complicated JavaScript toolkits
- No tangled callbacks
- Easy form creation
- Helpers to load more scripts
- Helpers to load CSV, JSON, and XML data
- Plotting built in

Markdown is an easy way to make web pages, and with a bit of glue,
JavaScript code blocks become "live". Data and form elements entered
using a Markdown extension for forms are also converted to JavaScript
variables.

Here is an example of a Javascript code input section. When the input
`freq` is updated, the page will recalculate, and the output of each
code section will appear below the input. Here's some example
Markdown:

    ## Simple function plotter

    Adjust the frequency, and see the plot update:
    
    freq = ___(3.0) 
    
    ```js output=markdown 
    println("## Results")
    ```

    ```js
    x = numeric.linspace(0,6.3,200)
    y = numeric.cos(numeric.mul(x,freq))
    
    series = _.zip(x,y)       // converts to [[x1,y1],[x2,y2],...]
    
    plot([series])
    ```
    
When run, it will look like this in a browser:

![mdpad screen capture](https://tshort.github.com/mdpad/mdpad_screenshot.png)

In the JavaScript block header, you can specify the result type as
`markdown` for Markdown output (also useful for HTML, since Markdown
files can contain HTML). `output` can also be `"none"` to suppress
output (not implemented, yet). 

In the example above, a text entry box is specified with `freq` =
`___(3.0)`. In JavaScript, `freq` is assigned to the value entered in the
text box (a string). The default value is "3.0". Any form elements
will be translated into JavaScript variables. 

Here are several examples:

* `example.md` [example.md](https://tshort.github.com/mdpad/mdpad.html?example.md)
  ([Markdown](https://tshort.github.com/mdpad/example.md))
  ([Live results](https://tshort.github.com/mdpad/mdpad.html?example.md))
  -- Covers forms, data input, and plotting.

* `yaml_usage.md`
  ([Markdown](https://tshort.github.com/mdpad/yaml_usage.md))
  ([Live results](https://tshort.github.com/mdpad/mdpad.html?yaml_usage.md))
  -- Covers YAML and text input blocks and uses for loading CSV, JSON,
  XML, and YAML data as well as loading scripts and creating forms.

* `numericjs.md`
  ([Markdown](https://tshort.github.com/mdpad/numericjs.md))
  ([Live results](https://tshort.github.com/mdpad/mdpad.html?numericjs.md))
  -- Example using the [Numeric Javascript](http://www.numericjs.com/)
     package.

* `d3.md`
  ([Markdown](https://tshort.github.com/mdpad/d3.md))
  ([Live results](https://tshort.github.com/mdpad/mdpad.html?d3.md))
  -- Graphical examples using [D3](http://d3js.org/),
     [NVD3](http://nvd3.org/), and [Vega](http://trifacta.github.io/vega/).

Here are several real-world example in my area of work:

* [http://distributionhandbook.com/calculators/](http://distributionhandbook.com/calculators/)


Here's an interface to a simulation compiled using
[Emscripten](http://emscripten.org/).

* `Modelica.Electrical.Analog.Examples.ChuaCircuit.md`
  ([Markdown](https://tshort.github.com/mdpad/Modelica.Electrical.Analog.Examples.ChuaCircuit.md))
  ([Live results](https://tshort.github.com/mdpad/mdpad.html?Modelica.Electrical.Analog.Examples.ChuaCircuit.md)) --
  OpenModelica simulation model of a Chua circuit.

## Features

*Plotting* -- There are several very good JavaScript libraries for plotting and
graphing. I've tried out and included Flot and HighCharts in
`mdpad.html`. I've also tried D3, NVD3, and Vega.

*YAML* -- Enter data into JavaScript using [YAML](www.yaml.org). YAML
is a plain text format for describing nested data structures. It is
easier to read and write than JSON or XML. Here is an example:

    ```yaml name=d
    fred: 27
    wilma: [1,2,3]
    ```

Now, in a JavaScript block, you can access `d.fred` (`27`) or
`d.wilma` (the array `[1,2,3]`).

*Form elements* -- Using the `freq` = `___(3.0)` notation described
above is one way to enter form elements. For more complicated form
arrangements, you can directly use HTML or use YAML. I like using the
[jQuery.dForm package](http://daffl.github.io/jquery.dform/) to create
form elements. You can specify form element characteristics as YAML or
JSON, and nice-looking forms are generated with the option of using
[Bootstrap 3](http://getbootstrap.com). When the user updates a form
element, the whole page recalculates.

## Installing / Using

Really, you just need to copy the files, or fork this github project.
You do need to view the page using a server. Here's a typical URL:

    http://localhost:2000/mdpad.html?example.md

Here, I'm running a server on my local computer on port 2000. The main
html file is `mdpad.html`. This loads the *mdpad* page `example.md`.
The base html file is used to load the appropriate libraries. You may
want to change this to include custom headers or footers for your
site. 

## Inspiration / Ideas

* [Julia Markdown](https://github.com/tshort/JuliaMarkdown)

* [Active Markdown](http://activemarkdown.org)

* [R Markdown](http://rstudio.org/docs/authoring/using_markdown),
  [Rpubs hosting](http://rpubs.com/)

* [IPython notebook](http://ipython.org/ipython-doc/dev/interactive/htmlnotebook.html)

## Infrastructure

Most of the infrastructure for this was already in place for the web
REPL. 

*Markdown conversion* -- The Markdown is converted to HTML using a
[Showdown](https://github.com/coreyti/showdown/) with extensions to
handle input blocks and form elements. 

*Form inputs* -- The modifications for form elements are adapted from 
[here](https://github.com/brikis98/wmd). Only one element is included
right now.

*Plotting* -- Plotting comes from the
[Flot](http://www.flotcharts.org/) package. 

*YAML* -- YAML conversion comes from the
[js-yaml](https://github.com/nodeca/js-yaml) package. 


## Current status

Everything's pretty much alpha stage right now. The main code is about
200 lines of code. Many of the libraries used (Flot, yaml-js, showdown,
etc.) are pretty mature.

MIT licensed.
