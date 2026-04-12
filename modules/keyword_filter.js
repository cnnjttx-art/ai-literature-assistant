// AND keyword matching: (title OR abstract) contains ALL keywords
var KeywordFilter = {
    filterPapers: function(papers, keywordGroups) {
        return papers.filter(function(p) {
            var text = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();
            for (var i = 0; i < keywordGroups.length; i++) {
                var found = false;
                for (var j = 0; j < keywordGroups[i].length; j++) {
                    if (text.includes(keywordGroups[i][j].toLowerCase())) { found = true; break; }
                }
                if (!found) return false;
            }
            return true;
        });
    },
    hasCompleteMetadata: function(p) {
        return p.title && p.title.length > 5 && p.year > 0 && p.authors && p.authors.length > 0;
    }
};