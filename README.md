Get the lastest node:

```
npm install -g n
n latest
```

Run with `async` enabled:

```
node --harmony index.js
```

Move project directory and reparse:

```
cp -R raw/* ../2017-02-02-arrival-data/raw/by-day/raw-religon
node ../2017-02-02-arrival-data/raw/by-day/parse.js
```