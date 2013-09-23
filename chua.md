```yaml script=scriptloader
- chua.js
```

```yaml script=dataloader
xml: chua.xml 
```


# OpenModelica simulation example
## Modelica.Electrical.Analog.Examples.ChuaCircuit

<img src=chua.svg class="pull-right" style="width:540px; background-color:#ffffff; border:2px solid gray" />


```yaml js=jsonForm class="form-horizontal" name=frm 
schema: 
  stopTime:
    type: string
    title: Stop time, sec
    default: 10000.0
  intervals:
    type: string
    title: Output intervals
    default: 500
  tolerance:
    type: string
    title: Tolerance
    default: 0.0001
  solver: 
    type: string
    title: Solver
    enum: 
      - dassl
      - euler
      - rungekutta
      - dasslwort
      - dassltest
  L: 
    type: string
    title: L, henries
    default: 18.0
  C1: 
    type: string
    title: C1, farads
    default: 10.0
  C2: 
    type: string
    title: C2, farads
    default: 100.0
form: 
  - "*"
params:
  fieldHtmlClass: input-medium
```

```js
$xml = $(xml)

// Set the default simulation parameters
defex = $xml.find("DefaultExperiment")
defex.attr("stopTime", stopTime)
defex.attr("stepSize", +stopTime / intervals)
defex.attr("tolerance", tolerance)
defex.attr("solver", solver)

// Set some model parameters
$xml.find("ScalarVariable[name = 'L.L']").find("Real").attr("start", L)
$xml.find("ScalarVariable[name = 'C1.C']").find("Real").attr("start", C1)
$xml.find("ScalarVariable[name = 'C2.C']").find("Real").attr("start", C2)

// Write out the initialization file
xmlstring = new XMLSerializer().serializeToString(xml)
Module['FS_createDataFile']('/', 'Modelica.Electrical.Analog.Examples.ChuaCircuit_init.xml', xmlstring, true, true)

// Run the simulation!
run()

// delete the input file
FS.unlink('/Modelica.Electrical.Analog.Examples.ChuaCircuit_init.xml')
```

## Results

```js
// read the csv file with the simulation results
csv = intArrayToString(FS.findObject("Modelica.Electrical.Analog.Examples.ChuaCircuit_res.csv").contents)
x = $.csv.toArrays(csv, {onParseValue: $.csv.hooks.castToScalar})

// `header` has the column names. The first is the time, and the rest
// of the columns are the variables.
header = x.slice(0,1)[0].slice(1)

// Select graph variables with a select box based on the header values
if (typeof(graphvar) == "undefined") graphvar = header[0];

var jsonform = {
  schema: {
    graphvar: {
      type: "string",
      title: "Plot variable",
      default: graphvar,
      enum: header
    }
  },
  form: [
    {
      key: "graphvar",
      onChange: function (evt) {
        calculate_forms();
        $("#plotdiv").calculate();
      }
    }
  ]
};

$active_element.jsonForm(jsonform);
```

```js id=plotdiv
idx = header.indexOf(graphvar) + 1;

// pick out the column to plot
series = x.slice(1).map(function(x) {return [x[0], x[idx]];});

plot([series]);
```

## Comments

This simulation model is from a [Modelica](http://modelica.org) model.
Modelica is a language for simulating electrical, thermal, and
mechanical, systems. [OpenModelica](http://openmodelica.org) was used
to compile this model to C. Then, [Emscripten](http://emscripten.org/)
was used to compile the C code to JavaScript.

The JavaScript code for the model is almost 2 MB, so that's why the
page loading takes so long. Once loaded, the simulation runs pretty
quickly.

For more information on compiling OpenModelica to JavaScript, see
[here](https://github.com/tshort/openmodelica-javascript).

The user interface was created in
[mdpad](http://tshort.github.io/mdpad/). See
[chua.md](http://tshort.github.io/mdpad/chua.md) for the Markdown code
for this page.

This should work in both Firefox and Chrome. It doesn't work in
Internet Explorer. Sometimes, the simulation fails with "out of
memory" in Firefox 23 in Windows. I haven't seen that with Firefox 20
on Linux.
