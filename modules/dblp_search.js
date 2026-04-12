// paper_search/dblp_search.js
var DBLPSearch = {
    name: 'DBLP',
    searchPapers: async function(query, maxResults) {
        maxResults = maxResults || 25;
        var papers = [];
        try {
            var url = 'https://dblp.org/search/publ/api?q=' + encodeURIComponent(query) + '&format=json&h=' + maxResults;
            var res = await fetch(url);
            var data = await res.json();
            if (data.result && data.result.hits && data.result.hits.hit) {
                data.result.hits.hit.forEach(function(hit) {
                    var info = hit.info;
                    if (!info || !info.title) return;
                    var title = (typeof info.title === 'string') ? info.title : (info.title.text || info.title['#text'] || '');
                    title = title.replace(/\s+/g, ' ').trim();
                    if (!title) return;
                    var authors = [];
                    if (info.authors && info.authors.author) {
                        var aList = Array.isArray(info.authors.author) ? info.authors.author : [info.authors.author];
                        authors = aList.slice(0, 5).map(function(a) { return (typeof a === 'string') ? a : (a.text || a['#text'] || ''); });
                    }
                    var venue = '';
                    if (info.venue) venue = (typeof info.venue === 'string') ? info.venue : (info.venue.text || '');
                    var year = parseInt(info.year) || 0;
                    var doi = info.doi || '';
                    var url2 = info.ee || info.url || (doi ? 'https://doi.org/' + doi : '');
                    papers.push(PaperFormat.create({
                        title: title, authors: authors, venue: venue,
                        year: year, abstract: '',
                        citations: 0, doi: doi,
                        url: typeof url2 === 'string' ? url2 : (url2 && url2['#text'] || ''),
                        source: 'DBLP', isOpenAccess: false
                    }));
                });
            }
        } catch (e) { console.error('DBLP:', e); }
        return papers;
    }
};
