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

### Configuration

The `SearchExcerptGenerator` initialiser also takes a third, optional, context options argument. By default it will take **4** words of context on either side of the matched word. If you would like to change the number of words on either side of the matched word, then use the following configuration:

```javascript
var config = {
  words: 6
};

var seg = new SearchExcerptGenerator(query, maxLength, config);
```

---

Alternatively, it is also possible to match context using regex. The regex provided will be tested on each word as a standalone string, moving outward from the matched word. For example the following configuration which matches words that end with a full stop (most often the end of a sentence) would work as follows:

```javascript
var config = {
  regex: /\.$/
};

var seg = new SearchExcerptGenerator('word', maxLength, config);
seg.generateExcerpt("This is a sentence with 'word' in it. Sentence without it in it. Here's the word again.");
// "This is a sentence with <b>&#39;word&#39;</b> in it. ... it. Here&#39;s the <b>word</b> again. ..."
```

In the second section, 'it.' was matched because it ended with a '.', however we don't want to include that first word in the context as it is in the previous sentence. To remedy this, the following config can be used:

```javascript
var config = {
  regex: {
    start: {
      regex: /\.$/,
      include: false
    },
    finish: /\.$/
  }
};

var seg = new SearchExcerptGenerator('word', maxLength, config);
seg.generateExcerpt("This is a sentence with 'word' in it. Sentence without it in it. Here's the word again.");
// "This is a sentence with <b>&#39;word&#39;</b> in it. ... Here&#39;s the <b>word</b> again. ..."
```

Done!

> **Note:** As the examples show, the regex pattern can appear at either the top level (under the key `regex`), for both `start` and `finish` (under the keys `regex.start`, and `regex.finish`), and for both `start` and `finish` under the `regex` key (keys are `regex.start.regex`, and `regex.finish.regex`).

> **Note:** By default `include` is true.

## Contributing

Contributions are welcome, please don't change the version number or the files in the `dist` folder if you plan on submitting a PR.

### Building Locally

Clone the repo, navigate to the root, then run the following commands:

```
npm i -g grunt-cli
npm i
grunt
```
