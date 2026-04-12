// 开题报告生成 - 基于实际检索论文
var ProposalGenerator = {
    generate: function(papers, direction, keywords, keywordGroups) {
        var lines = [];
        var topPapers = [...papers].sort(function(a,b){return b.citations-a.citations}).slice(0,10);
        var recentPapers = [...papers].sort(function(a,b){return b.year-a.year}).slice(0,10);
        var topV = papers.filter(function(p){return p.isTop});
        var yd = TrendAnalysis.yearDist(papers);
        var yrs = yd.years;
        var cs = TrendAnalysis.citeStats(papers);
        var kf = TrendAnalysis.keywordFreq(papers, 8);
        var gaps = ResearchGap.findGaps(papers, keywordGroups);

        // 1. 研究背景
        lines.push('## 一、研究背景');
        lines.push('');
        lines.push('本研究方向为「' + direction + '」，核心关键词包括：' + keywords.join('、') + '。');
        lines.push('');
        lines.push('基于对 ' + papers.length + ' 篇学术论文的系统检索（来源：OpenAlex、Semantic Scholar、arXiv、Crossref、DBLP），本开题报告提供以下分析。');
        lines.push('');
        if (yrs.length >= 2) {
            var minY = yrs[0], maxY = yrs[yrs.length-1];
            lines.push('检索论文时间跨度为 ' + minY + '-' + maxY + ' 年，总计引用 ' + cs.total.toLocaleString() + ' 次，篇均引用 ' + cs.avg + ' 次。');
            if (topV.length > 0) {
                lines.push('其中 ' + topV.length + ' 篇发表于顶刊/顶会（' + Math.round(topV.length/papers.length*100) + '%）。');
            }
        }
        lines.push('');

        // 2. 代表性论文
        lines.push('## 二、代表性论文');
        lines.push('');
        topPapers.forEach(function(p, i) {
            lines.push('**' + (i+1) + '. ' + p.title + '**');
            lines.push('- 作者: ' + p.authors.join(', '));
            lines.push('- 期刊/会议: ' + (p.venue || '未知') + (p.isTop ? ' [顶刊]' : ''));
            lines.push('- 年份: ' + p.year + ', 引用: ' + p.citations);
            if (p.doi) lines.push('- DOI: ' + p.doi);
            if (p.abstract) lines.push('- 摘要: ' + (p.abstract.length > 200 ? p.abstract.substring(0, 200) + '...' : p.abstract));
            lines.push('');
        });

        // 3. 研究趋势
        lines.push('## 三、研究趋势');
        lines.push('');
        var trendLines = TrendAnalysis.summary(papers);
        trendLines.forEach(function(t) { lines.push('- ' + t); });
        lines.push('');
        if (yrs.length >= 3) {
            lines.push('从年份分布来看:');
            yrs.forEach(function(y) {
                var count = yd.counts[y];
                var bar = '#'.repeat(Math.min(count, 30));
                lines.push('  ' + y + ' | ' + bar + ' (' + count + '篇)');
            });
            lines.push('');
        }

        // 4. 研究空白
        lines.push('## 四、研究空白与不足');
        lines.push('');
        gaps.forEach(function(g) { lines.push('- ' + g); });
        lines.push('');

        // 5. 推荐研究方向
        lines.push('## 五、推荐研究方向');
        lines.push('');
        var recs = [];
        if (em = ResearchGap.findEmerging(papers), em.length > 0) {
            em.forEach(function(e) {
                recs.push('**' + e.word + '**方向：近期论文频率上升，属于新兴研究热点，可深入探索其与核心关键词的交叉应用');
            });
        }
        // Based on recent high-cited papers
        var recentTop = recentPapers.filter(function(p) { return p.citations > cs.avg; });
        if (recentTop.length > 0) {
            recs.push('基于高引最新论文「' + recentTop[0].title.substring(0,40) + '...」的后续改进方向');
        }
        // Keyword intersection
        if (keywords.length >= 2) {
            recs.push(keywords.join(' + ') + ' 的深度融合方法：当前论文多聚焦单一方向，交叉研究有较大空间');
        }
        recs.push(direction + ' 的实际应用场景与工程化落地');
        recs.push(direction + ' 的评估方法与标准化基准测试');
        recs.forEach(function(r, i) { lines.push((i+1) + '. ' + r); });
        lines.push('');

        // 6. 总结
        lines.push('## 六、总结');
        lines.push('');
        lines.push('本开题报告基于 ' + papers.length + ' 篇实际检索论文自动生成，所有数据均来自学术数据库 API。');
        lines.push('建议研究者在此基础上结合自身研究条件和实验室优势，进一步细化研究方案。');
        lines.push('');
        lines.push('---');
        lines.push('*由 AI 文献调研助手自动生成 | 数据来源: OpenAlex, Semantic Scholar, arXiv, Crossref, DBLP*');

        return lines.join('\n');
    }
};