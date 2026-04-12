// trend_analysis.js - Research trend statistics from real paper data
var TrendAnalysis = {
    // Year distribution
    getYearDistribution: function(papers) {
        var counts = {};
        papers.forEach(function(p) {
            if (p.year > 0) counts[p.year] = (counts[p.year] || 0) + 1;
        });
        var years = Object.keys(counts).map(Number).sort();
        return { years: years, counts: counts };
    },

    // Venue distribution
    getVenueDistribution: function(papers) {
        var counts = {};
        papers.forEach(function(p) {
            if (p.venue) counts[p.venue] = (counts[p.venue] || 0) + 1;
        });
        return Object.entries(counts).sort(function(a, b) { return b[1] - a[1]; });
    },

    // Keyword frequency from titles
    getKeywordFrequency: function(papers, topN) {
        topN = topN || 15;
        var stopWords = new Set(['the','a','an','of','in','for','and','or','to','with','on','from','by','is','are','was','were','be','as','at','this','that','it','we','our','can','based','using','via','through','new','approach','model','models','method','methods','system','systems','paper','study','data','results','analysis','learning','research','framework','towards','between','into','about','over','not','but','has','have','had','do','does','did','will','would','could','should','may','might','used','use','its','their','more','most','than','when','where','how','what','which','who','all','each','every','both','few','some','such','no','nor','only','own','same','so','too','very','just','because','if','then','there','these','those','while','after','before','also','been','being','get','got','like','make','many','much','other','put','see','still','take','well','work','first','one','two','three']);
        var freq = {};
        papers.forEach(function(p) {
            (p.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).forEach(function(w) {
                if (w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w)) freq[w] = (freq[w] || 0) + 1;
            });
        });
        return Object.entries(freq).sort(function(a, b) { return b[1] - a[1]; }).slice(0, topN);
    },

    // Citation statistics
    getCitationStats: function(papers) {
        var total = papers.reduce(function(s, p) { return s + p.citations; }, 0);
        var sorted = [...papers].sort(function(a, b) { return b.citations - a.citations; });
        return {
            total: total,
            average: papers.length > 0 ? Math.round(total / papers.length) : 0,
            top5: sorted.slice(0, 5)
        };
    },

    // Source distribution
    getSourceDistribution: function(papers) {
        var counts = {};
        papers.forEach(function(p) { counts[p.source] = (counts[p.source] || 0) + 1; });
        return Object.entries(counts).sort(function(a, b) { return b[1] - a[1]; });
    },

    // Top venue count
    getTopVenueStats: function(papers) {
        var topPapers = papers.filter(function(p) { return p.isTop; });
        var venueCounts = {};
        topPapers.forEach(function(p) { venueCounts[p.venue] = (venueCounts[p.venue] || 0) + 1; });
        return {
            count: topPapers.length,
            percentage: papers.length > 0 ? Math.round(topPapers.length / papers.length * 100) : 0,
            venues: Object.entries(venueCounts).sort(function(a, b) { return b[1] - a[1]; })
        };
    },

    // Generate trend summary (only from real data)
    generateSummary: function(papers) {
        var yearDist = this.getYearDistribution(papers);
        var venueDist = this.getVenueDistribution(papers);
        var keywordFreq = this.getKeywordFrequency(papers, 10);
        var citeStats = this.getCitationStats(papers);
        var sourceDist = this.getSourceDistribution(papers);
        var topVenueStats = this.getTopVenueStats(papers);
        var years = yearDist.years;

        var lines = [];
        // Year distribution
        lines.push('年份分布: ' + years.map(function(y) { return y + ': ' + yearDist.counts[y] + '篇'; }).join(' | '));
        // Year trend
        if (years.length >= 2) {
            var maxYear = years[years.length - 1];
            var rC = yearDist.counts[maxYear] || 0;
            var pC = yearDist.counts[maxYear - 1] || 0;
            if (rC > pC && pC > 0) lines.push(maxYear + '年论文数增长 (' + pC + ' -> ' + rC + ')');
            else if (rC < pC && rC > 0) lines.push(maxYear + '年论文数下降 (' + pC + ' -> ' + rC + ')');
        }
        // Top venues
        lines.push('顶刊论文: ' + topVenueStats.count + '/' + papers.length + ' (' + topVenueStats.percentage + '%)');
        if (topVenueStats.venues.length > 0) {
            lines.push('顶刊来源: ' + topVenueStats.venues.map(function(v) { return v[0] + '(' + v[1] + ')'; }).join(', '));
        }
        // Keywords
        lines.push('高频词: ' + keywordFreq.map(function(w) { return w[0] + '(' + w[1] + ')'; }).join(', '));
        // Venues
        lines.push('期刊分布: ' + venueDist.slice(0, 5).map(function(v) { return v[0] + '(' + v[1] + ')'; }).join(', '));
        // Citations
        lines.push('平均引用: ' + citeStats.average + ', 总引用: ' + citeStats.total);
        // Sources
        lines.push('数据来源: ' + sourceDist.map(function(s) { return s[0] + ': ' + s[1]; }).join(', '));

        return lines;
    }
};
