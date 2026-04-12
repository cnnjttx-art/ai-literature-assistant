var TrendAnalysis = {
    yearDist: function(papers) {
        var c = {};
        papers.forEach(function(p) { if (p.year>0) c[p.year]=(c[p.year]||0)+1; });
        return { years: Object.keys(c).map(Number).sort(), counts: c };
    },
    venueDist: function(papers) {
        var c = {};
        papers.forEach(function(p) { if (p.venue) c[p.venue]=(c[p.venue]||0)+1; });
        return Object.entries(c).sort(function(a,b){return b[1]-a[1]});
    },
    keywordFreq: function(papers, n) {
        n = n || 15;
        var stop = new Set('the a an of in for and or to with on from by is are was were be as at this that it we our can based using via through new approach model models method methods system systems paper study data results analysis learning research framework towards between into about over not but has have had do does did will would could should may used use its their more most than when where how what which who all each every both few some such no nor only own same so too very just because if then there these those while after before also been being get got like make many much other put see still take well work first one two three'.split(' '));
        var freq = {};
        papers.forEach(function(p) {
            (p.title||'').toLowerCase().replace(/[^a-z0-9\\s-]/g,'').split(/\\s+/).forEach(function(w) {
                if (w.length>2 && !stop.has(w) && !/^\\d+$/.test(w)) freq[w]=(freq[w]||0)+1;
            });
        });
        return Object.entries(freq).sort(function(a,b){return b[1]-a[1]}).slice(0,n);
    },
    citeStats: function(papers) {
        var t = papers.reduce(function(s,p){return s+p.citations},0);
        var sorted = [...papers].sort(function(a,b){return b.citations-a.citations});
        return { total:t, avg: papers.length>0?Math.round(t/papers.length):0, top5: sorted.slice(0,5) };
    },
    sourceDist: function(papers) {
        var c = {};
        papers.forEach(function(p) { c[p.source]=(c[p.source]||0)+1; });
        return Object.entries(c).sort(function(a,b){return b[1]-a[1]});
    },
    topStats: function(papers) {
        var tp = papers.filter(function(p){return p.isTop});
        var vc = {};
        tp.forEach(function(p){vc[p.venue]=(vc[p.venue]||0)+1});
        return { count:tp.length, pct: papers.length>0?Math.round(tp.length/papers.length*100):0, venues:Object.entries(vc).sort(function(a,b){return b[1]-a[1]}) };
    },
    summary: function(papers, onlyTop) {
        var p = onlyTop ? papers.filter(function(x){return x.isTop}) : papers;
        if (!p.length && onlyTop) p = papers; // fallback if no top papers
        var yd = this.yearDist(p), vd = this.venueDist(p), kf = this.keywordFreq(p,10), cs = this.citeStats(p), sd = this.sourceDist(p), ts = this.topStats(papers), yrs = yd.years;
        var label = onlyTop ? '（仅顶刊论文）' : '';
        var lines = [];
        if (onlyTop) lines.push('分析范围: 仅顶刊论文 ('+p.length+'/'+papers.length+'篇)');
        lines.push('年份分布: ' + yrs.map(function(y){return y+': '+yd.counts[y]+'篇'}).join(' | '));
        if (yrs.length>=2) {
            var my=yrs[yrs.length-1], rc=yd.counts[my]||0, pc=yd.counts[my-1]||0;
            if (rc>pc && pc>0) lines.push(my+'年论文数增长 ('+pc+' -> '+rc+')');
            else if (rc<pc && rc>0) lines.push(my+'年论文数下降 ('+pc+' -> '+rc+')');
        }
        if (!onlyTop) {
            lines.push('顶刊论文: '+ts.count+'/'+papers.length+' ('+ts.pct+'%)');
            if (ts.venues.length>0) lines.push('顶刊来源: '+ts.venues.slice(0,5).map(function(v){return v[0]+'('+v[1]+')'}).join(', '));
        }
        lines.push('高频词: '+kf.map(function(w){return w[0]+'('+w[1]+')'}).join(', '));
        lines.push('期刊/会议Top5: '+vd.slice(0,5).map(function(v){return v[0]+'('+v[1]+')'}).join(', '));
        lines.push('平均引用: '+cs.avg+', 总引用: '+cs.total);
        if (!onlyTop) lines.push('数据来源: '+sd.map(function(s){return s[0]+': '+s[1]}).join(', '));
        return lines;
    }
};