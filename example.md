# *mdpad* example

The basic idea of these *mdpad* pages is that they are written in
Markdown and have embedded JavaScript sections and embedded YAML
sections. JavaScript is used to add interactivity, and YAML is used
for data entry. The results (based on `println` or `plot`) of each
JavaScript block is shown directly below the location of that block.

See [here](example.md) for the Markdown code for this page.

Normally, I hide the JavaScript and YAML blocks, but here, you can use
the following button to toggle the visibility of these blocks.

<input type="button" value="Toggle block visibility" onclick="$('.jsinput').toggle();$('.yamlinput').toggle()">

Here's some basic data entry using YAML.

# Data

Here's some basic data entry using YAML.

```yaml name=d
rac: [3.551, 2.232, 1.402, 1.114, 0.882, 0.7]
gmr: [0.0055611962035177, 0.00700459393067038, 0.00882262274842038, 0.00990159326021141, 0.0111125174323268, 0.0124715326552536]
conductors: [6, 4, 2, 1, 1/0, 2/0]
```

```yaml name=rac
[3.551, 2.232, 1.402, 1.114, 0.882, 0.7]
```
Now, here's some of that data spit back:

```js
println("d.conductors.slice(0,3) = " + d.conductors.slice(0,3))
println("rac.slice(1,4) = " + rac.slice(1,4))
```

# Forms

Here's a simple form entry shortcut for text input boxes:

z = ___(99)

```js
println("z = " + z)
```

You can also enter form elements directly as HTML, or you can use YAML
to generate them. Here's an example using the
[jQuery.dForm package](http://daffl.github.io/jquery.dform/) to
generate the form inputs. Everytime a form element changes, the
document re-runs.

```yaml jquery=dform
type: div
class: row
html:
  type: div
  class: col-md-4
  html:
    - name: choice 
      type: select
      bs3caption: Choice
      choices: 
        - "Choice-1"
        - "Second choice"
        - "This is third"
    - name: myname
      type: text
      bs3caption: Name
      value: Tim
    - name: age
      type: number
      bs3caption: Age
      value: 34
```

Now, we should see these results update as we update the form elements:

```js
println("choice = " + choice)
println("name = " + myname)
println("age = " + age)
```

# Calculations

Here are examples of basic calculations and reports back to the user
using js blocks:

```js
print("10 * age = ");
println(10 * age);
```

# Plotting

Here's plotting with the 
[Flot package](http://www.flotcharts.org).

```yaml jquery=dform
name : k
caption : k
type : number
value : 1.0
```


```js
x = [1,2,3,4]
y = _.map([3,5,9,10], function(x){return x * k;})
series = _.zip(x,y)  // converts to [[x1,y1],[x2,y2],...]
plot([series], plotoptions)
```

Note that plot options are given using YAML for this example.

```yaml name=plotoptions
width: 800px 
series: 
    lines: 
        show: true
    points: 
        show: true 
xaxis: 
    min: 0
    max: 5
grid: 
    backgroundColor: 
        colors: ["#fff", "#eee"]
```


# Generate markdown


So far, scripts have all generated plain text. It is also possible to
generate fancier output by using a header as follows: 

` ```js output=markdown`

Here is an example:

```js output=markdown
println("## generated heading")
println("some *italic* and **bold** text")
```

[mdpad main page](https://github.com/tshort/mdpad/tree/gh-pages)
