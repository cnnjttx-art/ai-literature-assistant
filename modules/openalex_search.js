// paper_search/openalex_search.js
var OpenAlexSearch = {
    name: 'OpenAlex',
    searchPapers: async function(query, maxResults) {
        maxResults = maxResults || 30;
        var papers = [];
        try {
            var url = 'https://api.openalex.org/works?search=' + encodeURIComponent(query) + '&per_page=' + maxResults + '&sort=cited_by_count:desc';
            var yr = document.getElementById('yearRange').value;
            if (yr) url += '&filter=publication_year:>' + (new Date().getFullYear() - parseInt(yr));
            var res = await fetch(url);
            var data = await res.json();
            if (data.results) {
                data.results.forEach(function(p) {
                    if (!p.title) return;
                    var authors = (p.authorships || []).slice(0, 5).map(function(a) { return a.author && a.author.display_name || ''; }).filter(Boolean);
                    var venue = '';
                    if (p.primary_location && p.primary_location.source) venue = p.primary_location.source.display_name || '';
                    else if (p.host_venue) venue = p.host_venue.display_name || '';
                    var abstract = '';
                    if (p.abstract_inverted_index) {
                        var words = [];
                        Object.entries(p.abstract_inverted_index).forEach(function(e) { e[1].forEach(function(pos) { words[pos] = e[0]; }); });
                        abstract = words.join(' ');
                    }
                    papers.push(PaperFormat.create({
                        title: p.title, authors: authors, venue: venue,
                        year: p.publication_year || 0, abstract: abstract,
                        citations: p.cited_by_count || 0, doi: p.doi || '',
                        url: (p.primary_location && p.primary_location.landing_page_url) || p.doi || '',
                        source: 'OpenAlex',
                        isOpenAccess: (p.open_access && p.open_access.is_oa) || false
                    }));
                });
            }
        } catch (e) { console.error('OpenAlex:', e); }
        return papers;
    }
};
