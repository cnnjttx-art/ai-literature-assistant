var TopVenue = {
    venues: {
        'neurips':100,'neural information processing systems':100,
        'icml':100,'international conference on machine learning':100,
        'iclr':100,'international conference on learning representations':100,
        'aaai':95,'ijcai':90,'aistats':85,'uai':85,'colt':85,
        'acl':100,'association for computational linguistics':100,
        'emnlp':95,'naacl':90,'coling':85,
        'cvpr':100,'computer vision and pattern recognition':100,
        'iccv':95,'eccv':90,
        'kdd':95,'www':90,'sigir':90,'wsdm':85,'recsys':85,
        'icra':90,'iros':85,
        'nature':100,'science':100,
        'nature machine intelligence':95,'nature methods':90,'nature communications':90,
        'jmlr':95,'journal of machine learning research':95,
        'tpami':95,'ijcv':90,
        'artificial intelligence':90,'computational linguistics':85,
        'lancet':95,'jama':95,'nejm':95,'bmj':90,'nature medicine':90,
        'ieee transactions':80,'acm transactions':80
    },
    getScore: function(v) {
        if (!v) return 0;
        var low = v.toLowerCase(), best = 0;
        Object.keys(this.venues).forEach(function(k) { if (low.includes(k)) best = Math.max(best, TopVenue.venues[k]); });
        return best;
    },
    isTop: function(v) { return this.getScore(v) >= 85; },
    mark: function(p) { p.venueScore = this.getScore(p.venue); p.isTop = this.isTop(p.venue); return p; }
};