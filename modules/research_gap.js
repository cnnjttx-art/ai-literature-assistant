// research_gap.js - Identify research gaps from paper data
var ResearchGap = {
    findEmergingTopics: function(papers) {
        var yearDist = TrendAnalysis.getYearDistribution(papers);
        var years = yearDist.years;
        if (years.length < 2) return [];
        var maxYear = years[years.length - 1];
        var recentP = papers.filter(function(p) { return p.year >= maxYear - 1; });
        var oldP = papers.filter(function(p) { return p.year < maxYear - 1; });
        if (recentP.length === 0 || oldP.length === 0) return [];

        var stopWords = new Set(['the','a','an','of','in','for','and','or','to','with','on','from','by','is','are','was','were','be','as','at','this','that','it','we','our','can','based','using','via','through','new','approach','model','models','method','methods','system','systems','paper','study','data','results','analysis','learning','research','framework','towards','between','into','about','over','not','but','has','have','had','do','does','did','will','would','could','should','may','might','used','use','its','their','more','most','than','when','where','how','what','which','who','all','each','every','both','few','some','such','no','nor','only','own','same','so','too','very','just','because','if','then','there','these','those','while','after','before','also','been','being','get','got','like','make','many','much','other','put','see','still','take','well','work','first','one','two','three']);

        function countWords(paperList) {
            var freq = {};
            paperList.forEach(function(p) {
                (p.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).forEach(function(w) {
                    if (w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w)) freq[w] = (freq[w] || 0) + 1;
                });
            });
            return freq;
        }

        var rW = countWords(recentP);
        var oW = countWords(oldP);
        var emerging = [];
        Object.keys(rW).forEach(function(w) {
            var rf = rW[w] / recentP.length;
            var of2 = (oW[w] || 0) / oldP.length;
            if (rf > of2 * 1.5 && rW[w] >= 2) emerging.push({ word: w, recentCount: rW[w], growth: Math.round((rf - of2) * 100) });
        });
        return emerging.sort(function(a, b) { return b.growth - a.growth; }).slice(0, 5);
    },

    findUncitedDirections: function(papers) {
        var maxYear = Math.max.apply(null, papers.map(function(p) { return p.year; }));
        return papers.filter(function(p) { return p.citations === 0 && p.year <= maxYear - 2; });
    },

    findVenueGaps: function(papers) {
        var venueDist = TrendAnalysis.getVenueDistribution(papers);
        if (venueDist.length === 0) return null;
        var mainVenue = venueDist[0];
        if (mainVenue[1] > papers.length * 0.25) {
            return { mainVenue: mainVenue[0], count: mainVenue[1], percentage: Math.round(mainVenue[1] / papers.length * 100) };
        }
        return null;
    },

    generateRecommendations: function(papers, keywords) {
        var directions = [];

        // 1. Emerging topics
        var emerging = this.findEmergingTopics(papers);
        if (emerging.length > 0) {
            directions.push('新兴趋势: "' + emerging.map(function(e) { return e.word; }).join('", "') + '" 在近期论文中频率显著上升');
        }

        // 2. Venue concentration gap
        var venueGap = this.findVenueGaps(papers);
        if (venueGap) {
            directions.push('超过' + venueGap.percentage + '%论文集中在' + venueGap.mainVenue + '，建议向其他顶会/期刊拓展');
        }

        // 3. Uncited papers
        var uncited = this.findUncitedDirections(papers);
        if (uncited.length > 3) {
            directions.push(uncited.length + '篇发表2年以上的论文零引用，可能代表被忽视的研究方向');
        }

        // 4. Keyword coverage gap
        if (keywords && keywords.length >= 2) {
            var keywordGroups = keywords;
            var pairCount = 0;
            papers.forEach(function(p) {
                var combined = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();
                var allFound = true;
                keywordGroups.forEach(function(group) {
                    var found = false;
                    for (var i = 0; i < group.length; i++) {
                        if (combined.includes(group[i].toLowerCase())) { found = true; break; }
                    }
                    if (!found) allFound = false;
                });
                if (allFound) pairCount++;
            });
            if (pairCount < papers.length * 0.5) {
                directions.push('仅' + pairCount + '/' + papers.length + '篇论文在摘要中同时覆盖所有关键词，该交叉方向研究尚不充分');
            }
        }

        // 5. Most cited paper direction
        var topCited = [...papers].sort(function(a, b) { return b.citations - a.citations; });
        if (topCited.length > 0) {
            var t = topCited[0].title;
            if (t.length > 50) t = t.substring(0, 50) + '...';
            directions.push('最高引论文: "' + t + '" (' + topCited[0].citations + '次引用, ' + topCited[0].venue + ', ' + topCited[0].year + ')');
        }

        return directions.length > 0 ? directions : ['当前检索结果覆盖充分，建议结合具体子方向进一步细化'];
    }
};
