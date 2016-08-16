var Section = (function() {
  var Section = function(index, padding, words) {
    this.start = Math.max(index - padding, 0);
    this.finish = Math.min(index + padding + 1, words.length);
    this.words = words.slice(this.start, this.finish);
    this.indicies = [index - this.start];
  };

  Section.prototype.join = function(other) {
    if (this.finish >= other.start) {
      this.words.slice(0, this.words.length - (other.start - this.finish));
    } else {
      this.words.push('...');
    }

    for (var i = 0, max = other.indicies; i < max; i++) {
      this.indicies.push(other.indicies[i] + this.words.length);
    }
    this.words = this.words.concat(other.words);
    this.finish = other.finish;
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

  return Section;
})();
