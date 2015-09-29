
## Simple function plotter

Adjust the frequency, and see the plot update:

freq = ___(3.0) 

```{js output=markdown}
// comment
println("## Results")
```

```{js}
x = numeric.linspace(0,6.3,200)
y = numeric.cos(numeric.mul(x,freq))

series = _.zip(x,y)       // converts to [[x1,y1],[x2,y2],...]

plot([series])
```
