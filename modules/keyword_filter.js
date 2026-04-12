// 放宽关键词匹配: 方向必须匹配 + 关键词至少匹配一个
var KeywordFilter = {
    // direction must match, keywords: at least one must match
    filterPapers: function(papers, directionVariants, keywordGroups) {
        console.log('[Filter] 输入 ' + papers.length + ' 篇论文');
        console.log('[Filter] 方向变体:', directionVariants);
        console.log('[Filter] 关键词组:', keywordGroups);

        var result = papers.filter(function(p) {
            var text = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();

            // 1. 方向必须匹配（至少一个变体命中）
            if (directionVariants && directionVariants.length > 0) {
                var dirFound = false;
                for (var i = 0; i < directionVariants.length; i++) {
                    if (text.includes(directionVariants[i].toLowerCase())) {
                        dirFound = true;
                        break;
                    }
                }
                if (!dirFound) return false;
            }

            // 2. 关键词：至少匹配一个组
            if (keywordGroups && keywordGroups.length > 0) {
                var anyFound = false;
                for (var i = 0; i < keywordGroups.length; i++) {
                    var group = keywordGroups[i];
                    for (var j = 0; j < group.length; j++) {
                        if (text.includes(group[j].toLowerCase())) {
                            anyFound = true;
                            break;
                        }
                    }
                    if (anyFound) break;
                }
                if (!anyFound) return false;
            }

            return true;
        });

        console.log('[Filter] 过滤后: ' + result.length + ' 篇');
        return result;
    },

    // 宽松模式：只要标题或摘要包含任一关键词即可
    looseFilter: function(papers, allVariants) {
        console.log('[LooseFilter] 宽松过滤 ' + papers.length + ' 篇');
        return papers.filter(function(p) {
            var text = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();
            for (var i = 0; i < allVariants.length; i++) {
                if (text.includes(allVariants[i].toLowerCase())) return true;
            }
            return false;
        });
    },

    hasMetadata: function(p) {
        return p.title && p.title.length > 3;
    }
};