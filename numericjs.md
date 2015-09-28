

# Numeric Javascript example

```yaml
         #: script=scriptloader
- lib/numeric-1.2.6.min.js
```

This example uses [Numeric Javascript](http://www.numericjs.com/). 

We'll plot a sinusoidal wave at different frequencies.

```yaml
        #: jquery=dform
type: div
class: row
html:
  type: div
  class: col-md-3 
  html:
    name: freq
    type: number
    bs3caption: Frequency in per unit
    value: 3
```

Here's a plot based on the frequency above:

```js
x = numeric.linspace(0,6.3,200)
y = numeric.cos(numeric.mul(x,freq))

series = _.zip(x,y)       // converts to [[x1,y1],[x2,y2],...]

plot([series])
```

Here's an ODE solver demo from
[here](http://www.numericjs.com/workshop.php?link=fdd38094da018f6071cb2d51d47c7fb3de869cb5dd0b4f3b677b480ce7ffbd31)
for the Lorenz curve.

```js
f = function(t,x) {
  return [10*(x[1]-x[0]),
          x[0]*(28-x[2])-x[1],
          x[0]*x[1]-(8/3)*x[2]];
}
sol = numeric.dopri(0,20,[-1,3,4],f,1e-6,2000);

plot([sol.y])

```

See [here](numericjs.md) for the Markdown code for this page.

[mdpad main page](https://github.com/tshort/mdpad/tree/gh-pages)
