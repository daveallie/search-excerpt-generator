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
