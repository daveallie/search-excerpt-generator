var Section = (function() {
  var Section = function(index, padding, words) {
    if (typeof index !== 'undefined') {
      this.start = Math.max(index - padding, 0);
      this.finish = Math.min(index + padding + 1, words.length);
      this.words = words.slice(this.start, this.finish);
      this.indicies = [index - this.start];
    }
  };

  Section.prototype.join = function(other) {
    var newThis = this.deepCopy();

    if (newThis.finish >= other.start) {
      newThis.words = newThis.words.slice(0, newThis.words.length - (newThis.finish - other.start));
    } else {
      newThis.words.push('...');
    }

    for (var i = 0, max = other.indicies; i < max; i++) {
      newThis.indicies.push(other.indicies[i] + newThis.words.length);
    }
    newThis.words = newThis.words.concat(other.words);
    newThis.finish = other.finish;

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
