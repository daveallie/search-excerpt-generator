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
          this.start = index - tmpIndex + (include.start ? 1 : 0);
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
