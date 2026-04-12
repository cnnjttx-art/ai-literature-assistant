// top_venue.js - Top journal/conference identification
var TopVenue = {
    venues: {
        // AI/ML
        'neurips': 100, 'neural information processing systems': 100,
        'icml': 100, 'international conference on machine learning': 100,
        'iclr': 100, 'international conference on learning representations': 100,
        'aaai': 95, 'ijcai': 90, 'aistats': 85, 'uai': 85, 'colt': 85,
        // NLP
        'acl': 100, 'association for computational linguistics': 100,
        'emnlp': 95, 'naacl': 90, 'coling': 85,
        // CV
        'cvpr': 100, 'computer vision and pattern recognition': 100,
        'iccv': 95, 'eccv': 90,
        // Data
        'kdd': 95, 'www': 90, 'sigir': 90, 'wsdm': 85, 'recsys': 85,
        // Robotics
        'icra': 90, 'iros': 85,
        // Journals
        'nature': 100, 'science': 100,
        'nature machine intelligence': 95, 'nature methods': 90, 'nature communications': 90,
        'jmlr': 95, 'journal of machine learning research': 95,
        'tpami': 95, 'ijcv': 90,
        'artificial intelligence': 90, 'computational linguistics': 85,
        // Medical
        'lancet': 95, 'jama': 95, 'new england journal': 95, 'nejm': 95,
        'bmj': 90, 'nature medicine': 90,
        // Engineering
        'ieee transactions': 80, 'acm transactions': 80
    },

    getVenueScore: function(venue) {
        if (!venue) return 0;
        var v = venue.toLowerCase();
        var best = 0;
        Object.keys(this.venues).forEach(function(key) {
            if (v.includes(key)) best = Math.max(best, TopVenue.venues[key]);
        });
        return best;
    },

    isTopVenue: function(venue) {
        return this.getVenueScore(venue) >= 85;
    },

    // Mark paper with venue info
    scoreAndMark: function(paper) {
        paper.venueScore = this.getVenueScore(paper.venue);
        paper.isTop = this.isTopVenue(paper.venue);
        return paper;
    }
};
