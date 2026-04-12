// utils.js - Utility functions
var Utils = {
    escapeHtml: function(s) {
        if (!s) return '';
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    },

    sleep: function(ms) {
        return new Promise(function(r) { setTimeout(r, ms); });
    },

    deduplicate: function(papers) {
        var seen = new Set();
        return papers.filter(function(p) {
            var key = p.doi || p.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 80);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    },

    downloadFile: function(content, filename, type) {
        var blob = new Blob([content], { type: type + ';charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    }
};
