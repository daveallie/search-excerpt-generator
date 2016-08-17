/*!
 * search-excerpt-generator v0.2.0
 * https://github.com/daveallie/search-excerpt-generator
 */

// jshint ignore: start
;(function(window){
'use strict';
// jshint ignore: end

var extend = function() {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
        arguments[0][key] = arguments[i][key];
      }
    }
  }
  return arguments[0];
};

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    'use strict';
    if (this === null || this === undefined) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

// http://tartarus.org/~martin/PorterStemmer/js.txt
var stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  return function (w) {
    var 	stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4,
      origword = w,
      fp;

    if (!w || w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = /^(.+?)(ss|i)es$/;
    re2 = /^(.+?)([^s])s$/;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) {	w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = /^(.+?)eed$/;
    re2 = /^(.+?)(ed|ing)$/;
    if (re.test(w)) {
      fp = re.exec(w);
      re = new RegExp(mgr0);
      if (re.test(fp[1])) {
        re = /.$/;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      fp = re2.exec(w);
      stem = fp[1];
      re2 = new RegExp(s_v);
      if (re2.test(stem)) {
        w = stem;
        re2 = /(at|bl|iz)$/;
        re3 = new RegExp("([^aeiouylsz])\\1$");
        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
        if (re2.test(w)) {	w = w + "e"; }
        else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c
    re = /^(.+?)y$/;
    if (re.test(w)) {
      fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(s_v);
      if (re.test(stem)) { w = stem + "i"; }
    }

    // Step 2
    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    if (re.test(w)) {
      fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    if (re.test(w)) {
      fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    re2 = /^(.+?)(s|t)(ion)$/;
    if (re.test(w)) {
      fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = new RegExp(mgr1);
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = /^(.+?)e$/;
    if (re.test(w)) {
      fp = re.exec(w);
      stem = fp[1];
      re = new RegExp(mgr1);
      re2 = new RegExp(meq1);
      re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = /ll$/;
    re2 = new RegExp(mgr1);
    if (re.test(w) && re2.test(w)) {
      re = /.$/;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };
})();

var stopWordFilter = (function() {
  var stopWords = "a able about across after all almost also am among an and any are as at be because been but by can cannot could dear did do does either else ever every for from get got had has have he her hers him his how however i if in into is it its just least let like likely may me might most must my neither no nor not of off often on only or other our own rather said say says she should since so some than that the their them then there these they this tis to too twas us wants was we were what when where which while who whom why will with would yet you your".split(" ");
  return function(word) {
    if (word && stopWords.indexOf(word) === -1) {
      return word;
    }
  };
})();

var escapeHtml = (function() {
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  return function(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };
})();

var stripTrailingLeadingPunctuation = function(string) {
  return (string.match(/[a-z].*[a-z]/) || [])[0];
};

var getWholeWordsWithMaxChars = function(string, maxLength) {
  var words = string.match(/\S+/g) || [],
      length = 0;

  if (words.length === 0) {
    return "No content";
  }

  for (var i = 0, max = words.length; i < max; i++) {
    if (words[i].length + length > maxLength) {
      return words.slice(0, i).join(' ');
    }

    length += words[i].length;
  }

  return words.join(' ');
};

var SearchExcerptGenerator = (function() {
  var excerptFromArr = function(body, indicies, maxLength, contextOptions) {
    if (indicies.length === 0) {
      return getWholeWordsWithMaxChars(body, maxLength - 3) + "...";
    }

    var words = body.match(/\S+/g) || [],
        section = new Section(indicies[0], words, contextOptions),
        newSection;

    for (var i = 1, max = indicies.length; i < max; i++) {
      newSection = section.join(new Section(indicies[i], words, contextOptions));
      if (newSection.length() > maxLength) {
        break;
      }
      section = newSection;
    }

    return section.toHTML();
  };

  var SearchExcerptGenerator = function(query, maxLength, contextOptions) {
    var tokens = query.toLowerCase().match(/\S+/g) || [];
    var newTokens = [], newToken, splitTokens;
    for (var i = 0, max = tokens.length; i < max; i++) {
      newToken = stripTrailingLeadingPunctuation(tokens[i]);
      if (!newToken) continue;
      splitTokens = newToken.match(/[a-z]+[:\-][a-z]+/) || [newToken];

      for (var j = 0, jMax = splitTokens.length; j < jMax; j++) {
        newToken = stopWordFilter(stemmer(splitTokens[j]));
        if (newToken) {
          newTokens.push(newToken);
        }
      }
    }

    this.contextOptions = extend({words: 4, regex: null}, contextOptions);
    this.tokens = newTokens;
    this.maxLength = maxLength;
  };

  SearchExcerptGenerator.prototype.generateExcerpt = function(body) {
    if (this.tokens.length === 0) {
      return excerptFromArr(body, [], this.maxLength);
    }

    var indicies = [], word, splitWords;
    var words = body.toLowerCase().match(/\S+/g) || [];
    for (var i = 0, max = words.length; i < max; i++) {
      // remove leading and trailing punctuation
      word = stripTrailingLeadingPunctuation(words[i]);
      if (!word) continue;
      splitWords = word.match(/[a-z]+[:\-][a-z]+/) || [word];

      // check each word part
      for (var j = 0, jMax = splitWords.length; j < jMax; j++) {
        // and stem word
        word = stemmer(splitWords[j]);
        if (word && this.tokens.indexOf(word) > -1) {
          indicies.push(i);
          break;
        }
      }
    }

    return excerptFromArr(body, indicies, this.maxLength, this.contextOptions);
  };

  return SearchExcerptGenerator;
})();

window.SearchExcerptGenerator = SearchExcerptGenerator;

var Section = (function() {
  var Section = function(index, words, contextOptions) {
    if (typeof index !== 'undefined') {
      if (contextOptions.regex) {
        var regex = {},
            include = {};

        if (contextOptions.regex.start && contextOptions.regex.finish) {
          ['start', 'finish'].forEach(function(el) {
            if (contextOptions.regex[el].hasOwnProperty('regex')) {
              regex[el] = contextOptions.regex[el].regex;
              include[el] = contextOptions.regex[el].include;
              include[el] = typeof include[el] === 'undefined' ? true : include[el];
            } else {
              regex[el] = contextOptions.regex[el];
              include[el] = true;
            }
          });
        } else if (contextOptions.regex.hasOwnProperty('regex')) {
          regex.start = regex.finish = contextOptions.regex.regex;
          include.start = contextOptions.regex.include;
          include.start = typeof include.start === 'undefined' ? true : include.start;
          include.finish = include.start;
        } else {
          regex.start = regex.finish = contextOptions.regex;
          include.start = include.finish = true;
        }

        var tmpIndex = words.slice(0, index).reverse().findIndex(function(el) {return el.match(regex.start);});
        if (tmpIndex > -1) {
          this.start = index - tmpIndex - (include.start ? 1 : 0);
        } else {
          this.start = 0;
        }

        tmpIndex = words.slice(index + 1).findIndex(function(el) {return el.match(regex.finish);});
        if (tmpIndex > -1) {
          this.finish = index + 1 + tmpIndex + (include.finish ? 1 : 0);
        } else {
          this.finish = words.length;
        }
      } else {
        this.start = Math.max(index - contextOptions.words, 0);
        this.finish = Math.min(index + contextOptions.words + 1, words.length);
      }

      this.words = words.slice(this.start, this.finish);
      this.indicies = [index - this.start];
    }
  };

  Section.prototype.append = function(other) {
    if (this.finish >= other.start) {
      this.words = this.words.slice(0, this.words.length - (this.finish - other.start));
    } else {
      this.words.push('...');
    }

    for (var i = 0, max = other.indicies; i < max; i++) {
      this.indicies.push(other.indicies[i] + this.words.length);
    }
    this.words = this.words.concat(other.words);
    this.finish = other.finish;
  };

  Section.prototype.join = function(other) {
    var newThis = this.deepCopy();
    newThis.append(other);
    return newThis;
  };

  Section.prototype.length = function() {
    var total = this.words.length - 1; // all the spaces
    for (var i = 0, max = this.words.length; i < max; i++) {
      total += this.words[i].length;
    }
    return total;
  };

  Section.prototype.toHTML = function() {
    var output = (this.start === 0 ? '' : '...');

    for (var i = 0, max = this.words.length; i < max; i++) {
      if (this.indicies.indexOf(i) > -1) {
        output += ' <b>' + escapeHtml(this.words[i]) + '</b>';
      } else {
        output += ' ' + escapeHtml(this.words[i]);
      }
    }

    return output.trim() + ' ...';
  };

  Section.prototype.deepCopy = function() {
    var newSection = new Section();
    newSection.start = this.start;
    newSection.finish = this.finish;
    newSection.words = this.words.slice(0);
    newSection.indicies = this.indicies.slice(0);
    return newSection;
  };

  return Section;
})();

// jshint ignore: start
}(window));
// jshint ignore: end
