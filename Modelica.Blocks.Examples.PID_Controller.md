```yaml script=scriptloader
- lib/tinytimer.js
```

```yaml script=dataloader
xml: Modelica.Blocks.Examples.PID_Controller_init.xml 
```

<style media="screen" type="text/css">
label {font-weight:normal; size: 0.9em}
</style>




# OpenModelica simulation example
## Modelica.Blocks.Examples.PID_Controller

<br/>
<br/>

<div id="status" style="text-align:center"><span id="statustext">
Simulation loading</span>. &nbsp Time: <span id="statustimer"> </span></div>

<br/>

<div class = "row">
<div class = "col-md-5">

<br/>
<br/>


```yaml jquery=dform
html: 
  - name: stopTime
    type: number
    title: Stop time, sec
    default: 4.0
  - name: intervals
    type: number
    title: Output intervals
    default: 500
  - name: tolerance
    type: number
    title: Tolerance
    default: 0.0000001
  - name: k 
    type: number
    title: Controller gain
    default: 100
  - name: Ti 
    type: number
    title: Time constant of integrator block, sec
    default: 0.1
  - name: Td 
    type: number
    title: Time constant of derivative block, sec
    default: 0.1
```

```js
if (typeof(isRunning) == "undefined") isRunning = false

if (typeof(timer) != "undefined") {clearInterval(timer.interval); timer = null};
$xml = $(xml)

// Set the default simulation parameters
defex = $xml.find("DefaultExperiment")
defex.attr("stopTime", stopTime)
defex.attr("stepSize", +stopTime / intervals)
defex.attr("tolerance", tolerance)

// Set some model parameters
$xml.find("ScalarVariable[name = 'PI.k']").find("Real").attr("start", k)
$xml.find("ScalarVariable[name = 'PI.Ti']").find("Real").attr("start", Ti)
$xml.find("ScalarVariable[name = 'PI.Td']").find("Real").attr("start", Td)

// Write out the initialization file
xmlstring = new XMLSerializer().serializeToString(xml)

$("#statustext").html('Simulation running')
$("#statustimer").html("");
$('#statustimer').tinyTimer({ from: Date.now() });

timer = $("#statustimer").data("tinyTimer")

// Start the simulation!
basename = "Modelica.Blocks.Examples.PID_Controller"

if (typeof(wworker) != "undefined" && isRunning) wworker.terminate() 
if (typeof(wworker) == "undefined" || isRunning) wworker = new Worker(basename + ".js")
isRunning = true

wworker.postMessage({basename: basename, xmlstring: xmlstring})
wworker.addEventListener('error', function(event) {
});


```

<div id="status" style="text-align:center"><span id="statustext">
Simulation loading</span>. &nbsp Time: <span id="statustimer"> </span></div>

## Results



```js
// read the csv file with the simulation results

wworker.addEventListener("message", function(e) {
    $("#statustext").html(e.data.status)
    timer.stop();
    isRunning = false
    x = $.csv.toArrays(e.data.csv, {onParseValue: $.csv.hooks.castToScalar})
    
    // `header` has the column names. The first is the time, and the rest
    // of the columns are the variables.
    header = x.slice(0,1)[0]
    
    // Select graph variables with a select box based on the header values
    if (typeof(graphvar) == "undefined") graphvar = header[1];
    if (typeof(graphvarX) == "undefined") graphvarX = header[0];
    
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
    var jsonformX = {
      schema: {
        graphvarX: {
          type: "string",
          default: graphvarX,
          enum: x.slice(0,1)[0]
        }
      },
      form: [
        {
          key: "graphvarX",
          onChange: function (evt) {
            calculate_forms();
            $("#plotdiv").calculate();
          }
        }
      ]
    };
    
    $("#yaxisform").html("");
    $("#yaxisform").jsonForm(jsonform);
    $("#xaxisform").html("");
    $("#xaxisform").jsonForm(jsonformX);
    $("#plotdiv").calculate();
    
}, false);

```

</div>



<div class = "col-md-7">

<!-- Nav tabs -->
<ul class="nav nav-tabs" id="mytab">
  <li class="active"><a href="#model" data-toggle="tab">Model</a></li>
  <li><a href="#results" data-toggle="tab">Results</a></li>
</ul>

<!-- Tab panes -->
<div class="tab-content">
  <!-- Model pane -->
  <div class="tab-pane active" id="model">

<img src="Modelica.Blocks.Examples.PID_Controller" style="width:100%; background-color:#ffffff; border:2px solid gray" />

  </div>

  <!-- Results pane -->
  <div class="tab-pane" id="results">

</br>

<div id="yaxisform"> </div>

```js id=plotdiv
if (typeof(header) != "undefined") {
    yidx = header.indexOf(graphvar);
    xidx = header.indexOf(graphvarX);
    // pick out the column to plot
    series = x.slice(1).map(function(x) {return [x[xidx], x[yidx]];});
    plot([series]);
}
```

<div id="xaxisform" style="left:200px; width:300px; position:relative"> </div>


  </div>
</div>

</div>
</div>

## Demonstrates the usage of a Continuous.LimPID controller

This is a simple drive train controlled by a PID controller:

- The two blocks "kinematic_PTP" and "integrator" are used to generate the reference speed (= constant acceleration phase, constant speed phase, constant deceleration phase until inertia is at rest). To check whether the system starts in steady state, the reference speed is zero until time = 0.5 s and then follows the sketched trajectory.
- The block "PI" is an instance of "Blocks.Continuous.LimPID" which is a PID controller where several practical important aspects, such as anti-windup-compensation has been added. In this case, the control block is used as PI controller.
- The output of the controller is a torque that drives a motor inertia "inertia1". Via a compliant spring/damper component, the load inertia "inertia2" is attached. A constant external torque of 10 Nm is acting on the load inertia.

The PI controller settings included "limitAtInit=false", in order that the controller output limits of 12 Nm are removed from the initialization problem.

The PI controller is initialized in steady state (initType=SteadyState) and the drive shall also be initialized in steady state. However, it is not possible to initialize "inertia1" in SteadyState, because "der(inertia1.phi)=inertia1.w=0" is an input to the PI controller that defines that the derivative of the integrator state is zero (= the same condition that was already defined by option SteadyState of the PI controller). Furthermore, one initial condition is missing, because the absolute position of inertia1 or inertia2 is not defined. The solution shown in this examples is to initialize the angle and the angular acceleration of "inertia1".


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
[Modelica.Blocks.Examples.PID_Controller.md](Modelica.Blocks.Examples.PID_Controller.md) for the Markdown code
for this page.

This should work in both Firefox and Chrome. It doesn't work in
Internet Explorer. 
