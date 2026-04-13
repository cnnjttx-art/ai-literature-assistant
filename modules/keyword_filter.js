var KeywordFilter = {
    // 标准过滤：方向必须匹配 + 关键词至少匹配一个
    filterPapers: function(papers, directionVariants, keywordGroups) {
        return papers.filter(function(p) {
            var text = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();
            // 方向必须匹配
            if (directionVariants && directionVariants.length > 0) {
                var dirFound = false;
                for (var i = 0; i < directionVariants.length; i++) {
                    if (text.includes(directionVariants[i].toLowerCase())) { dirFound = true; break; }
                }
                if (!dirFound) return false;
            }
            // 关键词至少匹配一个
            if (keywordGroups && keywordGroups.length > 0) {
                var anyFound = false;
                for (var i = 0; i < keywordGroups.length; i++) {
                    for (var j = 0; j < keywordGroups[i].length; j++) {
                        if (text.includes(keywordGroups[i][j].toLowerCase())) { anyFound = true; break; }
                    }
                    if (anyFound) break;
                }
                if (!anyFound) return false;
            }
            return true;
        });
    },

    // 宽松过滤：标题或摘要包含任一关键词变体即可
    looseFilter: function(papers, allVariants) {
        return papers.filter(function(p) {
            var text = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();
            for (var i = 0; i < allVariants.length; i++) {
                if (text.includes(allVariants[i].toLowerCase())) return true;
            }
            return false;
        });
    },

    // 顶刊宽松过滤：标题大致相关即可（不做关键词严格匹配）
    topVenueFilter: function(papers, directionVariants) {
        return papers.filter(function(p) {
            // 顶刊论文只要标题或摘要包含方向词即可
            if (!directionVariants || directionVariants.length === 0) return true;
            var text = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();
            for (var i = 0; i < directionVariants.length; i++) {
                if (text.includes(directionVariants[i].toLowerCase())) return true;
            }
            return false;
        });
    },

    hasMetadata: function(p) {
        return p.title && p.title.length > 3;
    }
};