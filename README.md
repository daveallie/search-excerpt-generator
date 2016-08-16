# Search Excerpt Generator

## How to use it

```javascript
var query = "software";
var maxLength = 300; // in characters
var body = 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:.';

var seg = new SearchExcerptGenerator(query, maxLength);
seg.generateExcerpt(body);
// "... a copy of this <b>software</b> and associated documentation files (the <b>&quot;Software&quot;),</b> to deal in the <b>Software</b> without restriction, including without ... sell copies of the <b>Software,</b> and to permit persons to whom the <b>Software</b> is furnished to do ..."
```

Which looks like:

... a copy of this <b>software</b> and associated documentation files (the <b>&quot;Software&quot;),</b> to deal in the <b>Software</b> without restriction, including without ... sell copies of the <b>Software,</b> and to permit persons to whom the <b>Software</b> is furnished to do ...

## Contributing

Contributions are welcome, please don't change the version number or the files in the `dist` folder if you plan on submitting a PR.

### Building Locally

Clone the repo, navigate to the root, then run the following commands:

```
npm i -g grunt-cli
npm i
grunt
```
