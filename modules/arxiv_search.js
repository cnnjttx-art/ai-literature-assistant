// paper_search/arxiv_search.js
var ArxivSearch = {
    name: 'arXiv',
    searchPapers: async function(query, maxResults) {
        maxResults = maxResults || 25;
        var papers = [];
        try {
            var url = 'https://export.arxiv.org/api/query?search_query=all:' + encodeURIComponent(query) + '&start=0&max_results=' + maxResults + '&sortBy=relevance';
            var res = await fetch(url);
            var text = await res.text();
            var xml = new DOMParser().parseFromString(text, 'text/xml');
            xml.querySelectorAll('entry').forEach(function(entry) {
                var tEl = entry.querySelector('title');
                var title = tEl ? tEl.textContent.replace(/\s+/g, ' ').trim() : '';
                if (!title) return;
                var authors = Array.from(entry.querySelectorAll('author name')).map(function(a) { return a.textContent; }).slice(0, 5);
                var sEl = entry.querySelector('summary');
                var pEl = entry.querySelector('published');
                var year = parseInt((pEl ? pEl.textContent : '').substring(0, 4)) || 0;
                var lEl = entry.querySelector('link[rel="alternate"]');
                papers.push(PaperFormat.create({
                    title: title, authors: authors, venue: 'arXiv',
                    year: year,
                    abstract: sEl ? sEl.textContent.replace(/\s+/g, ' ').trim() : '',
                    citations: 0, doi: '',
                    url: lEl ? lEl.getAttribute('href') : '',
                    source: 'arXiv', isOpenAccess: true
                }));
            });
        } catch (e) { console.error('arXiv:', e); }
        return papers;
    }
};
