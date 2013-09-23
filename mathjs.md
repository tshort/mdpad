```yaml script=scriptloader
- lib/math.min.js
```


# mathjs example

This example uses [mathjs](http://mathjs.org/). 

Here are some complex number manipulations:

```yaml jquery=jsonForm
schema:
  a_re:
    type: number
    title: a (real part)
    default: 2
  a_im:
    type: number
    title: a (imaginary part)
    default: 3
  b:
    type: string
    title: b as a string
    default: 3 - 7i
form: ["*"]
```

```js
console.log(typeof a_re)
console.log(typeof b)
a = math.complex(Number(a_re), Number(a_im))
print("a = ")
println(a)

b = math.complex(b)
print("b = ")
println(b)

print("a + b = ")
println(math.add(a, b)) 
print("a * b = ")
println(math.multiply(a, b)) 
```


See [here](mathjs.md) for the Markdown code for this page.

[mdpad main page](https://github.com/tshort/mdpad/tree/gh-pages)
