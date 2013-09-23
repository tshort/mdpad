# *mdpad* example

The basic idea of these *mdpad* pages is that they are written in
Markdown and have embedded JavaScript sections and YAML sections
embedded. JavaScript is used to add interactivity, and YAML is used
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
rac: [3.551, 2.232, 1.402, 1.114, 0.882, 0.7, 0.556, 0.441, 0.373, 0.35, 0.311, 0.278, 0.267, 0.235, 0.208, 0.197, 0.188, 0.169, 0.135, 0.133, 0.127, 0.12, 0.109, 0.106, 0.101, 0.0963]
gmr: [0.0055611962035177, 0.00700459393067038, 0.00882262274842038, 0.00990159326021141, 0.0111125174323268, 0.0124715326552536, 0.0139967498560307, 0.0157084948536593, 0.0171990576740366, 0.0177754680514267, 0.0197856043349646, 0.0209605660328388, 0.0214852445181602, 0.0227611387971986, 0.0243123406199979, 0.0249209197027924, 0.0255447325512619, 0.0270616982108416, 0.0308759703782212, 0.0311314761296609, 0.0319107497292355, 0.0327095298674806, 0.0343675751093677, 0.0349387277474913, 0.0361096666226405, 0.0367097709735484]
conductors: [6, 4, 2, 1, 1/0, 2/0, 3/0, 4/0, 250, 266.8, 300, 336.4, 350, 397.5, 450, 477, 500, 556.5, 700, 715.5, 750, 795, 874.5, 900, 954, 1000]
```

```yaml name=rac
[3.551, 2.232, 1.402, 1.114, 0.882, 0.7, 0.556, 0.441, 0.373, 0.35, 0.311, 0.278, 0.267, 0.235, 0.208, 0.197, 0.188, 0.169, 0.135, 0.133, 0.127, 0.12, 0.109, 0.106, 0.101, 0.0963]
```
Now, here's some of that data spit back:

```js
println("d.rac.slice(0,3) = " + d.rac.slice(0,3))
println("rac.slice(1,4) = " + rac.slice(1,4))
```

# Forms

Here's a simple form entry shortcut for text input boxes:

z = ___(99)

```js
println("z = " + z)
```

You can also enter form elements directly as HTML, or you can use YAML
to generate them. Here's an example using
[jsonform](https://github.com/joshfire/jsonform). Everytime a form
element changes, the document re-runs.

```yaml js=jsonForm class="form-horizontal"
schema: 
  choice: 
    type: string
    title: Choice
    enum: 
      - "choice-1"
      - "Second choice"
      - "This is third"
  name:
    type: string
    title: Name
    default: Tim
  age:
    type: number
    title: Age
    default: 34
form:
  - "*"
```

```js
println("choice = " + choice)
println("name = " + name)
println("age = " + age)
```

Here's another example of a form, this time using [jQuery.dForm](http://daffl.github.io/jquery.dform/).

```yaml js=dform
action : index.html
method : get
html :
    - type : p
      html : You must login
    - name : username
      id : txt-username
      caption : Username
      type : text
      placeholder : E.g. user@example.com
    - type : br
    - name : password
      caption : Password
      type : password
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

```yaml js=dform
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

# jQuery form elements

Here's a form entry with autocomplete added. Type characters to enter
a US state.

```yaml js=dform
name : state
caption : State
type : text
autocomplete: 
    source: [Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, District Of Columbia, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, PALAU, Pennsylvania, PUERTO RICO, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming]
```

Here's a custom date entry form using jQuery-UI and DForm:

```yaml js=dform
html:
  - name : date
    caption : Date
    type : text
    value : 06/01/2013
    datepicker:
```

```js 
println("state = " + state)
println("date = " + date)
```


# Generate markdown


So far, scripts have all generated plain text. It is also possible to
generate fancier output by using a header as follows: 

````js output=markdown`

Here is an example:

```js output=markdown
println("## generated heading")
println("some *italic* and **bold** text")
```

[mdpad main page](https://github.com/tshort/mdpad/tree/gh-pages)
