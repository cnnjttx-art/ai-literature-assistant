// 统一论文数据格式
var PaperFormat = {
    create: function(d) {
        return {
            title: d.title || '',
            authors: d.authors || [],
            venue: d.venue || '',
            year: d.year || 0,
            abstract: d.abstract || '',
            citations: d.citations || 0,
            doi: d.doi || '',
            url: d.url || '',
            source: d.source || '',
            isOpenAccess: d.isOpenAccess || false,
            isTop: false,
            venueScore: 0
        };
    }
};