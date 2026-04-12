var ResearchGap = {
    findEmerging: function(papers) {
        var yd = TrendAnalysis.yearDist(papers), yrs = yd.years;
        if (yrs.length < 2) return [];
        var my = yrs[yrs.length-1], rp = papers.filter(function(p){return p.year>=my-1}), op = papers.filter(function(p){return p.year<my-1});
        if (!rp.length || !op.length) return [];
        var stop = new Set('the a an of in for and or to with on from by is are was were be as at this that it we our can based using via through new approach model models method methods system systems paper study data results analysis learning research framework between into about over not but has have had do does did will would could should may used use its their more most than when where how what which who all each every both few some such no nor only own same so too very just because if then there these those while after before also been being get got like make many much other put see still take well work first one two three'.split(' '));
        function wf(pl){var f={};pl.forEach(function(p){(p.title||'').toLowerCase().replace(/[^a-z0-9\s-]/g,'').split(/\s+/).forEach(function(w){if(w.length>2&&!stop.has(w))f[w]=(f[w]||0)+1})});return f}
        var rw=wf(rp), ow=wf(op), em=[];
        Object.keys(rw).forEach(function(w){if(rw[w]/rp.length>((ow[w]||0)/op.length)*1.5&&rw[w]>=2) em.push({word:w,recent:rw[w]})});
        return em.sort(function(a,b){return b.recent-a.recent}).slice(0,5);
    },
    findGaps: function(papers, kwGroups) {
        var dirs = [];
        var em = this.findEmerging(papers);
        if (em.length) dirs.push('新兴趋势: "'+em.map(function(e){return e.word}).join('", "') + '" 在近期论文中频率上升');
        var vd = TrendAnalysis.venueDist(papers);
        if (vd.length && vd[0][1]>papers.length*0.25) dirs.push(vd[0][1]+'篇('+Math.round(vd[0][1]/papers.length*100)+'%)集中在'+vd[0][0]+'，建议跨领域拓展');
        var my = Math.max.apply(null,papers.map(function(p){return p.year}));
        var uc = papers.filter(function(p){return p.citations===0 && p.year<=my-2});
        if (uc.length>3) dirs.push(uc.length+'篇2年以上论文零引用，可能代表被忽视方向');
        if (kwGroups && kwGroups.length>=2) {
            var pair=0;
            papers.forEach(function(p){var t=((p.title||'')+' '+(p.abstract||'')).toLowerCase();var all=true;kwGroups.forEach(function(g){var f=false;for(var i=0;i<g.length;i++){if(t.includes(g[i].toLowerCase())){f=true;break}}if(!f)all=false});if(all)pair++});
            if (pair<papers.length*0.5) dirs.push('仅'+pair+'/'+papers.length+'篇同时覆盖所有关键词，该交叉方向研究不充分');
        }
        var tc = [...papers].sort(function(a,b){return b.citations-a.citations});
        if (tc.length) { var t=tc[0].title; if(t.length>50)t=t.substring(0,50)+'...'; dirs.push('最高引: "'+t+'" ('+tc[0].citations+'次, '+tc[0].venue+', '+tc[0].year+')'); }
        return dirs.length ? dirs : ['检索覆盖充分，建议进一步细化子方向'];
    }
};