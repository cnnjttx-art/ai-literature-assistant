var OpenAlexSearch = {
    name: 'OpenAlex',
    search: async function(query) {
        var papers = [];
        console.log('[OpenAlex] 搜索:', query);
        try {
            // 使用 filter=default.search 做 AND 匹配（比 search= 参数更精确）
            var url = 'https://api.openalex.org/works?filter=default.search:' + encodeURIComponent(query) + '&per_page=50&sort=cited_by_count:desc';
            var yr = document.getElementById('yr').value;
            if (yr) url += ',publication_year:>' + (new Date().getFullYear() - parseInt(yr));
            console.log('[OpenAlex] URL:', url);
            var res = await fetch(url);
            var data = await res.json();
            var count = data.results ? data.results.length : 0;
            console.log('[OpenAlex] 返回 ' + count + ' 条');
            if (data.results) data.results.forEach(function(p) {
                if (!p.title) return;
                var a = (p.authorships||[]).slice(0,5).map(function(x){return x.author&&x.author.display_name||''}).filter(Boolean);
                var v = '';
                if (p.primary_location && p.primary_location.source) v = p.primary_location.source.display_name||'';
                else if (p.host_venue) v = p.host_venue.display_name||'';
                var ab = '';
                if (p.abstract_inverted_index) { var w=[]; Object.entries(p.abstract_inverted_index).forEach(function(e){e[1].forEach(function(pos){w[pos]=e[0]})}); ab=w.join(' '); }
                papers.push(PaperFormat.create({title:p.title,authors:a,venue:v,year:p.publication_year||0,abstract:ab,citations:p.cited_by_count||0,doi:p.doi||'',url:(p.primary_location&&p.primary_location.landing_page_url)||p.doi||'',source:'OpenAlex',isOpenAccess:(p.open_access&&p.open_access.is_oa)||false}));
            });
        } catch(e) { console.error('[OpenAlex] 错误:', e); }
        console.log('[OpenAlex] 解析后 ' + papers.length + ' 篇');
        return papers;
    },

    // 顶刊专项搜索：搜索领域词 + 顶会名
    searchVenue: async function(direction, venueNames) {
        var papers = [];
        // 用领域 + 会议名称组合搜索
        var q = direction + ' ' + venueNames[0];
        console.log('[OpenAlex-Venue] 搜索:', q);
        try {
            var url = 'https://api.openalex.org/works?search=' + encodeURIComponent(q) + '&per_page=30&sort=cited_by_count:desc';
            var yr = document.getElementById('yr').value;
            if (yr) url += '&filter=publication_year:>' + (new Date().getFullYear() - parseInt(yr));
            var res = await fetch(url);
            var data = await res.json();
            if (data.results) data.results.forEach(function(p) {
                if (!p.title) return;
                var a = (p.authorships||[]).slice(0,5).map(function(x){return x.author&&x.author.display_name||''}).filter(Boolean);
                var v = '';
                if (p.primary_location && p.primary_location.source) v = p.primary_location.source.display_name||'';
                else if (p.host_venue) v = p.host_venue.display_name||'';
                // 只保留venue匹配的
                var venueLow = v.toLowerCase();
                var match = venueNames.some(function(vn) { return venueLow.includes(vn.toLowerCase()); });
                if (!match) return;
                var ab = '';
                if (p.abstract_inverted_index) { var w=[]; Object.entries(p.abstract_inverted_index).forEach(function(e){e[1].forEach(function(pos){w[pos]=e[0]})}); ab=w.join(' '); }
                papers.push(PaperFormat.create({title:p.title,authors:a,venue:v,year:p.publication_year||0,abstract:ab,citations:p.cited_by_count||0,doi:p.doi||'',url:(p.primary_location&&p.primary_location.landing_page_url)||p.doi||'',source:'OpenAlex',isOpenAccess:(p.open_access&&p.open_access.is_oa)||false}));
            });
        } catch(e) { console.error('[OpenAlex-Venue] 错误:', e); }
        console.log('[OpenAlex-Venue] ' + venueNames[0] + ': ' + papers.length + ' 篇');
        return papers;
    }
};