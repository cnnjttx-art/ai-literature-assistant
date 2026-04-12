// keyword_filter.js - Strict AND keyword matching
var KeywordFilter = {
    // For each user keyword group, at least one variant must appear in title+abstract
    filterPapers: function(papers, keywordGroups) {
        return papers.filter(function(paper) {
            var paperText = ((paper.title || '') + ' ' + (paper.abstract || '')).toLowerCase();
            for (var i = 0; i < keywordGroups.length; i++) {
                var group = keywordGroups[i]; // array of variants for one keyword
                var found = false;
                for (var j = 0; j < group.length; j++) {
                    if (paperText.includes(group[j].toLowerCase())) {
                        found = true;
                        break;
                    }
                }
                if (!found) return false; // AND: all keyword groups must match
            }
            return true;
        });
    },

    // Check if paper has complete metadata
    hasCompleteMetadata: function(paper) {
        return paper.title && paper.title.length > 5
            && paper.year > 0
            && paper.authors && paper.authors.length > 0;
    }
};
