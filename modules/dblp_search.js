var DBLPSearch = {
    name: 'DBLP',
    search: async function(query) {
        var papers = [];
        try {
            var url = 'https://dblp.org/search/publ/api?q=' + encodeURIComponent(query) + '&format=json&h=25';
            var res = await fetch(url);
            var data = await res.json();
            if (data.result&&data.result.hits&&data.result.hits.hit) data.result.hits.hit.forEach(function(hit) {
                var i=hit.info; if(!i||!i.title) return;
                var t=(typeof i.title==='string')?i.title:(i.title.text||i.title['#text']||'');
                t=t.replace(/\s+/g,' ').trim(); if(!t) return;
                var a=[];
                if(i.authors&&i.authors.author){var l=Array.isArray(i.authors.author)?i.authors.author:[i.authors.author];a=l.slice(0,5).map(function(x){return(typeof x==='string')?x:(x.text||x['#text']||'')})}
                var v=''; if(i.venue) v=(typeof i.venue==='string')?i.venue:(i.venue.text||'');
                var y=parseInt(i.year)||0, d=i.doi||'', u=i.ee||i.url||(d?'https://doi.org/'+d:'');
                papers.push(PaperFormat.create({title:t,authors:a,venue:v,year:y,abstract:'',citations:0,doi:d,url:typeof u==='string'?u:(u&&u['#text']||''),source:'DBLP'}));
            });
        } catch(e) { console.error('DBLP:', e); }
        return papers;
    }
};