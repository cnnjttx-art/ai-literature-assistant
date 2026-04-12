var SemanticSearch = {
    name: 'Semantic Scholar',
    search: async function(query) {
        var papers = [];
        console.log('[S2] 查询:', query);
        try {
            var url = 'https://api.semanticscholar.org/graph/v1/paper/search?query=' + encodeURIComponent(query) + '&limit=30&fields=title,authors,venue,year,abstract,citationCount,externalIds,openAccessPdf';
            var yr = document.getElementById('yr').value;
            if (yr) url += '&year=' + (new Date().getFullYear()-parseInt(yr)) + '-';
            console.log('[S2] URL:', url);
            var res = await fetch(url);
            console.log('[S2] 状态:', res.status);
            var data = await res.json();
            console.log('[S2] 返回:', data.total || 0, '条');
            if (data.data) data.data.forEach(function(p) {
                if (!p.title) return;
                papers.push(PaperFormat.create({title:p.title,authors:(p.authors||[]).slice(0,5).map(function(a){return a.name}),venue:p.venue||'',year:p.year||0,abstract:p.abstract||'',citations:p.citationCount||0,doi:(p.externalIds&&p.externalIds.DOI)||'',url:(p.openAccessPdf&&p.openAccessPdf.url)||((p.externalIds&&p.externalIds.DOI)?'https://doi.org/'+p.externalIds.DOI:''),source:'Semantic Scholar',isOpenAccess:!!p.openAccessPdf}));
            });
        } catch(e) { console.error('[S2] 错误:', e); }
        console.log('[S2] 解析后 ' + papers.length + ' 篇');
        return papers;
    }
};