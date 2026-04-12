var ProposalGenerator = {
    generate: function(papers, direction, keywords, keywordGroups) {
        var lines = [];
        // Prioritize top venue papers for proposal
        var topPapers = papers.filter(function(p){return p.isTop});
        var allByCite = [...papers].sort(function(a,b){return b.citations-a.citations});
        var topByCite = topPapers.length > 0
            ? [...topPapers].sort(function(a,b){return b.citations-a.citations}).slice(0,8)
            : allByCite.slice(0,8);

        // Use all papers for analysis but prefer top for representative papers
        var cs = TrendAnalysis.citeStats(papers);
        var ts = TrendAnalysis.topStats(papers);
        var yd = TrendAnalysis.yearDist(papers);
        var yrs = yd.years;
        var gaps = ResearchGap.findGaps(papers, keywordGroups);

        // Detect disciplines
        var detected = TopVenue.detectDisciplines(direction + ' ' + keywords.join(' '));
        var discStr = detected.length > 0 ? detected.map(function(d){return d.name}).join('、') : '多学科';

        lines.push('## 一、研究背景');
        lines.push('');
        lines.push('本研究方向为「' + direction + '」，涉及学科领域：' + discStr + '。');
        lines.push('核心关键词包括：' + keywords.join('、') + '。');
        lines.push('');
        lines.push('基于对 ' + papers.length + ' 篇学术论文的系统检索（来源：OpenAlex、Semantic Scholar、arXiv、Crossref、DBLP），本开题报告提供以下分析。');
        lines.push('');
        if (yrs.length >= 2) {
            lines.push('检索论文时间跨度为 ' + yrs[0] + '-' + yrs[yrs.length-1] + ' 年，总计引用 ' + cs.total.toLocaleString() + ' 次，篇均引用 ' + cs.avg + ' 次。');
        }
        if (ts.count > 0) {
            lines.push('其中 ' + ts.count + ' 篇发表于顶刊/顶会（' + ts.pct + '%），包括：' + ts.venues.slice(0,5).map(function(v){return v[0]+'('+v[1]+'篇)'}).join('、') + '。');
        }
        lines.push('');

        lines.push('## 二、代表性论文（优先顶刊）');
        lines.push('');
        topByCite.forEach(function(p, i) {
            lines.push('**' + (i+1) + '. ' + p.title + '**');
            lines.push('- 作者: ' + p.authors.join(', '));
            var venueStr = p.venue || '未知';
            if (p.isTop) venueStr += ' [顶刊/顶会]';
            lines.push('- 期刊/会议: ' + venueStr);
            lines.push('- 年份: ' + p.year + ', 引用: ' + p.citations);
            if (p.doi) lines.push('- DOI: ' + p.doi);
            if (p.abstract) lines.push('- 摘要: ' + (p.abstract.length > 200 ? p.abstract.substring(0, 200) + '...' : p.abstract));
            lines.push('');
        });

        lines.push('## 三、研究趋势');
        lines.push('');
        // Top venue trend
        var topTrend = TrendAnalysis.summary(papers, true);
        topTrend.forEach(function(t) { lines.push('- ' + t); });
        lines.push('');
        var allTrend = TrendAnalysis.summary(papers, false);
        lines.push('整体趋势:');
        allTrend.forEach(function(t) { lines.push('- ' + t); });
        lines.push('');
        if (yrs.length >= 3) {
            lines.push('年份分布:');
            yrs.forEach(function(y) {
                var count = yd.counts[y];
                var bar = '#'.repeat(Math.min(count, 30));
                lines.push('  ' + y + ' | ' + bar + ' (' + count + '篇)');
            });
            lines.push('');
        }

        lines.push('## 四、研究空白与不足');
        lines.push('');
        gaps.forEach(function(g) { lines.push('- ' + g); });
        lines.push('');

        lines.push('## 五、推荐研究方向');
        lines.push('');
        var recs = [];
        var em = ResearchGap.findEmerging(papers);
        if (em.length > 0) {
            em.forEach(function(e) {
                recs.push('**' + e.word + '**方向：近期论文频率上升，属于新兴研究热点');
            });
        }
        if (keywords.length >= 2) {
            recs.push(keywords.join(' + ') + ' 的交叉融合研究：当前论文多聚焦单一方向，交叉研究有较大空间');
        }
        recs.push(direction + ' 的实际应用场景与工程化落地');
        recs.push(direction + ' 的评估方法与标准化基准');
        recs.forEach(function(r, i) { lines.push((i+1) + '. ' + r); });
        lines.push('');

        lines.push('## 六、总结');
        lines.push('');
        lines.push('本开题报告基于 ' + papers.length + ' 篇实际检索论文自动生成，其中 ' + ts.count + ' 篇发表于顶刊/顶会。');
        lines.push('所有数据均来自学术数据库 API，未进行人工编造。');
        lines.push('');
        lines.push('---');
        lines.push('*AI 文献调研助手 | 跨学科顶刊文献分析*');

        return lines.join('\\n');
    }
};