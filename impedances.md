# Overhead Distribution Line Impedances

```yaml name=d
rac: [3.551, 2.232, 1.402, 1.114, 0.882, 0.7, 0.556, 0.441, 0.373, 0.35, 0.311, 0.278, 0.267, 0.235, 0.208, 0.197, 0.188, 0.169, 0.135, 0.133, 0.127, 0.12, 0.109, 0.106, 0.101, 0.0963]
gmr: [0.0055611962035177, 0.00700459393067038, 0.00882262274842038, 0.00990159326021141, 0.0111125174323268, 0.0124715326552536, 0.0139967498560307, 0.0157084948536593, 0.0171990576740366, 0.0177754680514267, 0.0197856043349646, 0.0209605660328388, 0.0214852445181602, 0.0227611387971986, 0.0243123406199979, 0.0249209197027924, 0.0255447325512619, 0.0270616982108416, 0.0308759703782212, 0.0311314761296609, 0.0319107497292355, 0.0327095298674806, 0.0343675751093677, 0.0349387277474913, 0.0361096666226405, 0.0367097709735484]
conductors: [6, 4, 2, 1, 1/0, 2/0, 3/0, 4/0, 250, 266.8, 300, 336.4, 350, 397.5, 450, 477, 500, 556.5, 700, 715.5, 750, 795, 874.5, 900, 954, 1000]
```

## Phase conductors

```yaml js=jsonForm
schema: 
  phases: 
    type: string
    enum: [6, 4, 2, 1, 1/0, 2/0, 3/0, 4/0, 250, 266.8, 300, 336.4, 350, 397.5, 450, 477, 500, 556.5, 700, 715.5, 750, 795, 874.5, 900, 954, 1000]
form: 
  - "*"
```

Conductor positions

xA = ___(-4.)
yA = ___(30.)  in feet

xB = ___(0.)
yB = ___(30.)

xC = ___(4.)
yC = ___(30.)

## Neutral

```yaml js=jsonForm
schema: 
  neutral: 
    type: string
    enum: [6, 4, 2, 1, 1/0, 2/0, 3/0, 4/0, 250, 266.8, 300, 336.4, 350, 397.5, 450, 477, 500, 556.5, 700, 715.5, 750, 795, 874.5, 900, 954, 1000]
form: 
  - "*"
```

xN = ___(0.)
yN = ___(25.)  in feet

## Other inputs

Earth resistivity:

rho = ___(100.) in ohm-m

Conductor temperature:

condT = ___(25.) in degC


## Results

```js
xA = Number(xA); xB = Number(xB); xC = Number(xC); xN = Number(xN)
yA = Number(yA); yB = Number(yB); yC = Number(yC); yN = Number(yN)
rho = Number(rho)
condT = Number(condT)

sq= function(x) {
  return x * x;
}

pidx = _.map(d.conductors, String).indexOf(phases)
nidx = _.map(d.conductors, String).indexOf(neutral)

gmd = math.pow(math.sqrt(sq(xA - xB) + sq(yA - yB)) * math.sqrt(sq(xB - xC) + sq(yB - yC)) * math.sqrt(sq(xC - xA) + sq(yC - yA)), 0.33333333)

gmdpn = math.pow(math.sqrt(sq(xA - xN) + sq(yA - yN)) * math.sqrt(sq(xB - xN) + sq(yB - yN)) * math.sqrt(sq(xC - xN) + sq(yC - yN)), 0.33333333)


r = d.rac[pidx] * (1 + 0.00404 * (condT - 25))
rn = d.rac[nidx] * (1 + 0.00404 * (condT - 25))

z1 = math.complex(r / 5.28,
                  0.0529 * math.log10(gmd/d.gmr[pidx]))

znn = math.complex(rn / 5.28 + .01807,
                   0.0529 * math.log10(278.9 * Math.sqrt(rho) / d.gmr[nidx]))

zpn = math.complex(0.01807, 0.0529 * math.log10(278.9 * math.sqrt(rho) / gmdpn))

z0 = math.complex(r / 5.28 + 3 * .01807, 
                  3 * 0.0529 * math.log10(278.9 * math.sqrt(rho) / math.pow(d.gmr[pidx] * gmd * gmd, 1./3)))
zz = math.select(3).multiply(zpn).multiply(zpn).divide(znn).done()
z0 = math.subtract(z0,zz)

zg = math.select(2).multiply(z1).add(z0).divide(3).done()

println("Z1 = " + math.format(z1) + " ohms/1000ft");
println("Z0 = " + math.format(z0) + " ohms/1000ft");
println("Zg = " + math.format(zg) + " ohms/1000ft");


```


