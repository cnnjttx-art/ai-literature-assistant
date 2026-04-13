var CrossrefSearch = {
    name: 'Crossref',
    search: async function(query) {
        var papers = [];
        console.log('[Crossref] 查询:', query);
        try {
            var url = 'https://api.crossref.org/works?query=' + encodeURIComponent(query) + '&rows=30&sort=relevance';
            var yr = document.getElementById('yr').value;
            if (yr) url += '&filter=from-pub-date:' + (new Date().getFullYear()-parseInt(yr));
            console.log('[Crossref] URL:', url);
            var res = await fetch(url, {headers:{'User-Agent':'LitAssistant/1.0 (mailto:test@test.com)'}});
            console.log('[Crossref] 状态:', res.status);
            var data = await res.json();
            var count = (data.message&&data.message.items) ? data.message.items.length : 0;
            console.log('[Crossref] 返回:', count, '条');
            if (data.message&&data.message.items) data.message.items.forEach(function(p) {
                var t=(p.title&&p.title[0])||''; if(!t) return;
                var a=(p.author||[]).slice(0,5).map(function(x){return ((x.given||'')+' '+(x.family||'')).trim()});
                var v=(p['container-title']&&p['container-title'][0])||'';
                var y=0;
                if(p['published-print']&&p['published-print']['date-parts']&&p['published-print']['date-parts'][0]) y=p['published-print']['date-parts'][0][0]||0;
                else if(p['published-online']&&p['published-online']['date-parts']&&p['published-online']['date-parts'][0]) y=p['published-online']['date-parts'][0][0]||0;
                else if(p.created&&p.created['date-parts']&&p.created['date-parts'][0]) y=p.created['date-parts'][0][0]||0;
                papers.push(PaperFormat.create({title:t,authors:a,venue:v,year:y,abstract:(p.abstract||'').replace(/<[^>]*>/g,'').trim(),citations:p['is-referenced-by-count']||0,doi:p.DOI||'',url:p.URL||(p.DOI?'https://doi.org/'+p.DOI:''),source:'Crossref'}));
            });
        } catch(e) { console.error('[Crossref] 错误:', e); }
        console.log('[Crossref] 解析后 ' + papers.length + ' 篇');
        return papers;
    }
};