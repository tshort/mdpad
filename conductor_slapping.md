```yaml script=scriptloader
- //dl.dropboxusercontent.com/u/17098152/mdpad/FICM.js
```

# Conductor Slapping App

This app models slapping between two conductors for a line-to-line
fault involving these conductors. Enter the conductor and line
characteristics, the fault information, and the relative conductor
positions. The critical clearing time is the fault duration at which
conductors swing enough to (nearly) touch.

```yaml name=d
conductors: [6 AAC, 4 AAC, 2 AAC, 1 AAC, 1/0 AAC, 2/0 AAC, 3/0 AAC, 4/0 AAC, 250 AAC, 266.8 AAC, 300 AAC, 336.4 AAC, 350 AAC, 397.5 AAC, 450 AAC, 477 AAC, 500 AAC, 556.5 AAC, 700 AAC, 715.5 AAC, 750 AAC, 795 AAC, 874.5 AAC, 900 AAC, 954 AAC, 1000 AAC]
area: [0.0206, 0.0328, 0.0522, 0.0657, 0.0829, 0.1045, 0.1317, 0.1663, 0.1964, 0.2097, 0.2358, 0.2644, 0.2748, 0.3124, 0.3534, 0.3744, 0.3926, 0.4369, 0.5494, 0.5622, 0.5892, 0.6245, 0.6874, 0.7072, 0.7495, 0.7854]
wc: [0.0246, 0.0392, 0.0623, 0.0785, 0.0991, 0.1249, 0.1575, 0.1987, 0.2347, 0.2506, 0.2818, 0.316, 0.3284, 0.3734, 0.4224, 0.4475, 0.4692, 0.5221, 0.6566, 0.672, 0.7043, 0.7464, 0.821, 0.8452, 0.8958, 0.9387]
```

<div id="graph" style='width:300px; height:300px; float: right;'></div>

```yaml jquery=jsonForm
schema: 
  flti:
    type: number
    title: "Fault current, A"
    default: 5000
  fltt:
    type: number
    title: "Fault duration, cycles (60 Hz)"
    default: 20
  conductors: 
    type: string
    title: "Conductors"
    default: 336.4 AAC
    enum: [6 AAC, 4 AAC, 2 AAC, 1 AAC, 1/0 AAC, 2/0 AAC, 3/0 AAC, 4/0 AAC, 250 AAC, 266.8 AAC, 300 AAC, 336.4 AAC, 350 AAC, 397.5 AAC, 450 AAC, 477 AAC, 500 AAC, 556.5 AAC, 700 AAC, 715.5 AAC, 750 AAC, 795 AAC, 874.5 AAC, 900 AAC, 954 AAC, 1000 AAC]
  h0:
    type: number
    title: "Span length, feet"
    default: 300
  y0:
    type: number
    title: "Conductor sag, feet"
    default: 5.75
  x1:
    type: number
    title: "Horizontal conductor separation, feet"
    default: 3.67
  y1:
    type: number
    title: "Vertical conductor separation, feet"
    default: 0.0
form: 
  - "*"
```

```js output=markdown
flti = Number(flti)
fltt = Number(fltt)
h0 = Number(h0)
y0 = Number(y0)
x1 = Number(x1)
y1 = Number(y1)
idx = _.map(d.conductors, String).indexOf(conductors)
wc = d.wc[idx] 
area = d.area[idx] 

t = ficm(flti, fltt, h0, y0, x1, y1, wc, area, 0)
wirelocs = ficm(flti, fltt, h0, y0, x1, y1, wc, area, 1)
console.log(wirelocs)
// animate the conductor movement
var nstep = 0
var z = wirelocs[nstep]
console.log([[z[1], z[2]], [z[3], z[4]]])
plot = $.plot($('#graph'), 
              [{ data: [[0.0, y0], [x1, y0 + y1], [z[1], z[2]], [z[3], z[4]]], 
                 points: { show: true } }], 
              { xaxis: { min: -y0 - 1, max: x1 + y0 + 1},
                yaxis: { min: -2, max: Math.max(2*y0 + x1) }});
$('#graph').animate( {tabIndex: 0}, {
   duration: 5000,
   step: function ( now, fx ) {
      //console.log(now)
      nstep = nstep + 1
      console.log(nstep)
      var z = wirelocs[nstep]
      plot.setData( [{ data: [[0.0, y0], [x1, y0 + y1], [z[1], z[2]], [z[3], z[4]]], points: {show: true} }] );
      plot.draw();
   }
});

if (t == 0.0)
    println("### No slapping")
else
    println("### Conductors slap at t = " + t.toFixed(2) + " secs for fault duration = " + fltt.toFixed(1) + " cycles.")

function bisect(flti) {
    hi = 2.0*60
    hiorig = hi
    lo = 0.0 
    do {
        delta = (hi - lo)/2.0
        t = ficm(flti, lo + delta, h0, y0, x1, y1, wc, area, 0)
        if (t == 0.0) { // no slapping 
            lo = lo + delta
            console.log("lo =", lo)
        } else {
            hi = hi - delta 
            console.log("hi =", hi)
        }
    } while ((hi - lo) > 0.01)    
    if (hi != hiorig)
        return lo
    else
        return -hi
}
critt = bisect(flti)

if (critt > 0.0)
    println("### Critical fault clearing time = " + critt.toFixed(2) + " cycles.")
else
    println("### Critical fault clearing time > " + -critt.toFixed(2) + " cycles.")

currents = [1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000]    
durations = _.map(currents, bisect)
series = _.zip(currents,durations)
series = _.filter(series,function(x) {return x[1] > 0.0})
```

```yaml name=plotinfo
chart:
    type: line
    width: 500
    height: 500
    spacingRight: 20
yAxis:
    type: 'logarithmic'
    title:
        text: "Time, cycles"
xAxis:
    type: 'logarithmic'
    title:
        text: "Current, A"
title:
    text: Time-current curve
legend:
    enabled: false
```

```js
plotinfo.series = [{data: series}]
$active_element.highcharts(plotinfo)
```

## Credits

This app was adapted from C++ code by D. J. Ward [1] which in turn was
adapted from FORTRAN code by J. R. Stewart [2].

[1] Ward, D. J., "Overhead distribution conductor motion due to
short-circuit forces," *IEEE Transactions on Power Delivery*, vol. 18,
no. 4, pp. 1534-1538, 2003.

[2] EPRI, *Transmission Line Reference Book: 115 - 138 kV Compact Line
Design*, Second ed, Electric Power Research Institute, Palo Alto,
California, 1978.

## Notes

The magnetic field from fault current produces forces between
conductors all along the circuit from the substation to the initial
fault location. These forces can cause conductors to swing. If they
swing together, a second fault can occur upstream of the initial
fault. The main scenario that causes the most issues is where the
initial fault is downstream of a recloser, and a follow-on fault
occurs upstream of the recloser and trips the circuit breaker.

The animation at the right is a view along the length of the line. The
two stationary conductor positions at the pole are shown. The two dots
that move are the conductor positions at the center of the span.

Conductor motion is a function of fault current, fault duration, phase
spacings, span lengths, and conductor sag. A line-to-line fault causes
the most force between two conductors. This app only models
line-to-line faults. The force from fault current pushes conductors
away from each other. Once the fault is cleared, the conductors can
swing into each other.

You can get some crazy answers with large forces (high fault
currents and/or long durations), especially for smaller conductors.
The conductor animations should show this.

This model is likely to be most accurate with horizontal spacings.
Vertical clearance definitely helps as you will see from the
animations and the critical clearing curves. However, there are some
cases with vertical spacing that show no slapping that probably would
touch in real life. Again, use your judgement, and review the
animations.

To see the code that does the majority of the calculations, see
[here](//dl.dropboxusercontent.com/u/17098152/mdpad/FICM.js). To see
the user interface, page calculation code, see
[here](conductor_slapping.md).

This code is free and open source, available under the
[MIT license](LICENSE).
