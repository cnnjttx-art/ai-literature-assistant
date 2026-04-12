var OpenAlexSearch = {
    name: 'OpenAlex',
    search: async function(query) {
        var papers = [];
        console.log('[OpenAlex] 查询:', query);
        try {
            var url = 'https://api.openalex.org/works?search=' + encodeURIComponent(query) + '&per_page=30&sort=cited_by_count:desc';
            var yr = document.getElementById('yr').value;
            if (yr) url += '&filter=publication_year:>' + (new Date().getFullYear() - parseInt(yr));
            console.log('[OpenAlex] URL:', url);
            var res = await fetch(url);
            var data = await res.json();
            console.log('[OpenAlex] 返回 ' + (data.results ? data.results.length : 0) + ' 条');
            if (data.results) data.results.forEach(function(p) {
                if (!p.title) return;
                var a = (p.authorships||[]).slice(0,5).map(function(x){return x.author&&x.author.display_name||''}).filter(Boolean);
                var v = '';
                if (p.primary_location&&p.primary_location.source) v = p.primary_location.source.display_name||'';
                else if (p.host_venue) v = p.host_venue.display_name||'';
                var ab = '';
                if (p.abstract_inverted_index) { var w=[]; Object.entries(p.abstract_inverted_index).forEach(function(e){e[1].forEach(function(pos){w[pos]=e[0]})}); ab=w.join(' '); }
                papers.push(PaperFormat.create({title:p.title,authors:a,venue:v,year:p.publication_year||0,abstract:ab,citations:p.cited_by_count||0,doi:p.doi||'',url:(p.primary_location&&p.primary_location.landing_page_url)||p.doi||'',source:'OpenAlex',isOpenAccess:(p.open_access&&p.open_access.is_oa)||false}));
            });
        } catch(e) { console.error('[OpenAlex] 错误:', e); }
        console.log('[OpenAlex] 解析后 ' + papers.length + ' 篇');
        return papers;
    }
};