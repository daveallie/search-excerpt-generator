var SearchExcerptGenerator = (function() {
  var excerptFromArr = function(body, indicies, maxLength) {
    if (indicies.length === 0) {
      return getWholeWordsWithMaxChars(body, maxLength - 3) + "...";
    }

    var words = body.match(/\S+/g) || [],
        section = new Section(indicies[0], 4, words),
        newSection;

    for (var i = 1, max = indicies.length; i < max; i++) {
      newSection = section.join(new Section(indicies[i], 4, words));
      if (newSection.length() > maxLength) {
        break;
      }
      section = newSection;
    }

    return section.toHTML();
  };

  var SearchExcerptGenerator = function(query, maxLength) {
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

    return excerptFromArr(body, indicies, this.maxLength);
  };

  return SearchExcerptGenerator;
})();

window.SearchExcerptGenerator = SearchExcerptGenerator;
