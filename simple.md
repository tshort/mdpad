## Simple function plotter

Adjust the frequency, and see the plot update:

freq = ___(3.0)

```.js
        //: output=markdown
println("## Results")
```

```js
x = numeric.linspace(0,6.3,200)
y = numeric.cos(numeric.mul(x,freq))
plot(x,y)
```
