// paper_format.js - Unified paper data structure
var PaperFormat = {
    create: function(data) {
        return {
            title: data.title || '',
            authors: data.authors || [],
            venue: data.venue || '',
            year: data.year || 0,
            abstract: data.abstract || '',
            citations: data.citations || 0,
            doi: data.doi || '',
            url: data.url || '',
            source: data.source || '',
            isOpenAccess: data.isOpenAccess || false,
            isTop: false,
            venueScore: 0
        };
    }
};
