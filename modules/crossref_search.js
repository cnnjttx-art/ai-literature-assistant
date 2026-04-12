// paper_search/crossref_search.js
var CrossrefSearch = {
    name: 'Crossref',
    searchPapers: async function(query, maxResults) {
        maxResults = maxResults || 25;
        var papers = [];
        try {
            var url = 'https://api.crossref.org/works?query=' + encodeURIComponent(query) + '&rows=' + maxResults + '&sort=relevance';
            var yr = document.getElementById('yearRange').value;
            if (yr) url += '&filter=from-pub-date:' + (new Date().getFullYear() - parseInt(yr));
            var res = await fetch(url, { headers: { 'User-Agent': 'LitAssistant/1.0 (mailto:research@example.com)' } });
            var data = await res.json();
            if (data.message && data.message.items) {
                data.message.items.forEach(function(p) {
                    var title = (p.title && p.title[0]) || '';
                    if (!title) return;
                    var authors = (p.author || []).slice(0, 5).map(function(a) { return ((a.given || '') + ' ' + (a.family || '')).trim(); });
                    var venue = (p['container-title'] && p['container-title'][0]) || '';
                    var year = 0;
                    if (p['published-print'] && p['published-print']['date-parts'] && p['published-print']['date-parts'][0]) year = p['published-print']['date-parts'][0][0] || 0;
                    else if (p['published-online'] && p['published-online']['date-parts'] && p['published-online']['date-parts'][0]) year = p['published-online']['date-parts'][0][0] || 0;
                    else if (p.created && p.created['date-parts'] && p.created['date-parts'][0]) year = p.created['date-parts'][0][0] || 0;
                    papers.push(PaperFormat.create({
                        title: title, authors: authors, venue: venue,
                        year: year,
                        abstract: (p.abstract || '').replace(/<[^>]*>/g, '').trim(),
                        citations: p['is-referenced-by-count'] || 0,
                        doi: p.DOI || '',
                        url: p.URL || (p.DOI ? 'https://doi.org/' + p.DOI : ''),
                        source: 'Crossref', isOpenAccess: false
                    }));
                });
            }
        } catch (e) { console.error('Crossref:', e); }
        return papers;
    }
};
