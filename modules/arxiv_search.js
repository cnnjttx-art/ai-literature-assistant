var ArxivSearch = {
    name: 'arXiv',
    search: async function(query) {
        var papers = [];
        console.log('[arXiv] 查询:', query);
        try {
            // arXiv 支持 AND 逻辑
            // 将查询拆分并用 AND 连接
            var terms = query.split(/\s+/).filter(Boolean);
            var searchTerms = terms.map(function(t) { return 'all:' + t; }).join('+AND+');
            var url = 'https://export.arxiv.org/api/query?search_query=' + searchTerms + '&start=0&max_results=30&sortBy=relevance';
            console.log('[arXiv] URL:', url);
            var res = await fetch(url);
            var text = await res.text();
            var xml = new DOMParser().parseFromString(text, 'text/xml');
            var entries = xml.querySelectorAll('entry');
            console.log('[arXiv] 返回 ' + entries.length + ' 条');
            entries.forEach(function(e) {
                var t=e.querySelector('title'), title=t?t.textContent.replace(/\s+/g,' ').trim():'';
                if(!title) return;
                var a=Array.from(e.querySelectorAll('author name')).map(function(x){return x.textContent}).slice(0,5);
                var s=e.querySelector('summary'), p=e.querySelector('published');
                var y=parseInt((p?p.textContent:'').substring(0,4))||0;
                var l=e.querySelector('link[rel="alternate"]');
                papers.push(PaperFormat.create({title:title,authors:a,venue:'arXiv',year:y,abstract:s?s.textContent.replace(/\s+/g,' ').trim():'',citations:0,doi:'',url:l?l.getAttribute('href'):'',source:'arXiv',isOpenAccess:true}));
            });
        } catch(e) { console.error('[arXiv] 错误:', e); }
        console.log('[arXiv] 解析后 ' + papers.length + ' 篇');
        return papers;
    }
};