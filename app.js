// ==================== State ====================
var state = {
    direction: '',
    keywords: [],
    expandedKeywords: [],
    queries: [],
    allPapers: [],
    filteredPapers: [],
    coreKeywordsEn: [],
    coreKeywordsCn: []
};

// ==================== Top Venues ====================
var TOP_VENUES = {
    // AI/ML conferences
    'neurips': 100, 'neural information processing systems': 100,
    'icml': 100, 'international conference on machine learning': 100,
    'iclr': 100, 'international conference on learning representations': 100,
    'aaai': 95, 'association for the advancement of artificial intelligence': 95,
    'ijcai': 90, 'international joint conference on artificial intelligence': 90,
    'aistats': 85, 'artificial intelligence and statistics': 85,
    'uai': 85, 'uncertainty in artificial intelligence': 85,
    'colt': 85, 'conference on learning theory': 85,
    // NLP
    'acl': 100, 'association for computational linguistics': 100,
    'emnlp': 95, 'empirical methods in natural language processing': 95,
    'naacl': 90, 'north american chapter': 90,
    'coling': 85,
    // CV
    'cvpr': 100, 'computer vision and pattern recognition': 100,
    'iccv': 95, 'international conference on computer vision': 95,
    'eccv': 90, 'european conference on computer vision': 90,
    // Robotics
    'icra': 90, 'robotics and automation': 90,
    'iros': 85, 'intelligent robots and systems': 85,
    // Other top
    'kdd': 95, 'knowledge discovery and data mining': 95,
    'www': 90, 'world wide web': 90,
    'sigir': 90, 'information retrieval': 90,
    'wsdm': 85,
    'recsys': 85,
    // Top journals
    'nature': 100,
    'science': 100,
    'nature machine intelligence': 95,
    'nature methods': 90,
    'nature communications': 90,
    'jmlr': 95, 'journal of machine learning research': 95,
    'tmlr': 90, 'transactions on machine learning research': 90,
    'tpami': 95, 'transactions on pattern analysis': 95,
    'ijcv': 90, 'international journal of computer vision': 90,
    'acl findings': 80,
    'computational linguistics': 85,
    'ai open': 70,
    'artificial intelligence': 90,
    // arXiv is not a venue but common
    'arxiv': 30
};

function getVenueScore(venue) {
    if (!venue) return 0;
    var v = venue.toLowerCase();
    var best = 0;
    Object.keys(TOP_VENUES).forEach(function(key) {
        if (v.includes(key)) {
            best = Math.max(best, TOP_VENUES[key]);
        }
    });
    return best;
}

function isTopVenue(venue) {
    return getVenueScore(venue) >= 85;
}

// ==================== Translation Dictionary ====================
var dict = {
    '多智能体': ['Multi-Agent', 'Multiagent'],
    '智能体': ['Agent', 'Intelligent Agent'],
    '大模型': ['Large Language Model', 'LLM'],
    '大语言模型': ['Large Language Model', 'LLM'],
    '深度学习': ['Deep Learning'],
    '机器学习': ['Machine Learning'],
    '强化学习': ['Reinforcement Learning'],
    '自然语言处理': ['Natural Language Processing', 'NLP'],
    '计算机视觉': ['Computer Vision'],
    '神经网络': ['Neural Network'],
    '注意力机制': ['Attention Mechanism'],
    '变换器': ['Transformer'],
    '预训练': ['Pre-training', 'Pretraining'],
    '微调': ['Fine-tuning', 'Finetuning'],
    '迁移学习': ['Transfer Learning'],
    '知识蒸馏': ['Knowledge Distillation'],
    '扩散模型': ['Diffusion Model'],
    '检索增强': ['Retrieval-Augmented', 'RAG'],
    '知识图谱': ['Knowledge Graph'],
    '图神经网络': ['Graph Neural Network', 'GNN'],
    '推荐系统': ['Recommendation System'],
    '情感分析': ['Sentiment Analysis'],
    '文本分类': ['Text Classification'],
    '目标检测': ['Object Detection'],
    '语音识别': ['Speech Recognition'],
    '自动驾驶': ['Autonomous Driving'],
    '联邦学习': ['Federated Learning'],
    '元学习': ['Meta-Learning'],
    '少样本学习': ['Few-Shot Learning'],
    '零样本': ['Zero-Shot'],
    '链式思维': ['Chain-of-Thought', 'CoT'],
    '思维链': ['Chain-of-Thought', 'CoT'],
    '提示工程': ['Prompt Engineering'],
    '指令微调': ['Instruction Tuning'],
    '对齐': ['Alignment'],
    '推理': ['Reasoning'],
    '规划': ['Planning'],
    '协作': ['Collaboration', 'Cooperation'],
    '通信': ['Communication'],
    '编排': ['Orchestration'],
    '工具使用': ['Tool Use'],
    '代码生成': ['Code Generation'],
    '问答': ['Question Answering', 'QA'],
    '摘要': ['Summarization'],
    '对话系统': ['Dialogue System', 'Conversational AI'],
    '机器人': ['Robot', 'Robotics'],
    '具身智能': ['Embodied Intelligence', 'Embodied AI'],
    '多模态': ['Multimodal'],
    '视觉语言模型': ['Vision-Language Model', 'VLM'],
    '基准测试': ['Benchmark'],
    '评估': ['Evaluation'],
    '可解释性': ['Interpretability', 'Explainability'],
    '鲁棒性': ['Robustness'],
    '泛化': ['Generalization'],
    '数据增强': ['Data Augmentation'],
    '对比学习': ['Contrastive Learning'],
    '自监督学习': ['Self-Supervised Learning'],
    '生成模型': ['Generative Model'],
    '序列到序列': ['Sequence-to-Sequence', 'Seq2Seq'],
    '编码器': ['Encoder'],
    '解码器': ['Decoder'],
    '嵌入': ['Embedding'],
    '量子计算': ['Quantum Computing'],
    '边缘计算': ['Edge Computing'],
    '区块链': ['Blockchain'],
    '物联网': ['Internet of Things', 'IoT'],
    '数字孪生': ['Digital Twin'],
    '催化剂': ['Catalyst', 'Catalysis'],
    '电化学': ['Electrochemistry'],
    '电池': ['Battery'],
    '纳米材料': ['Nanomaterial', 'Nanomaterials'],
    '复合材料': ['Composite Material', 'Composites'],
    '聚合物': ['Polymer'],
    '蛋白质': ['Protein'],
    '基因组学': ['Genomics'],
    '药物发现': ['Drug Discovery'],
    '基因编辑': ['Gene Editing', 'CRISPR'],
    '合成生物学': ['Synthetic Biology'],
    '气候模型': ['Climate Model'],
    '遥感': ['Remote Sensing'],
    '金融': ['Finance', 'Financial'],
    '经济学': ['Economics'],
    '博弈论': ['Game Theory'],
    '供应链': ['Supply Chain'],
    '社会网络': ['Social Network'],
    '认知科学': ['Cognitive Science'],
    '公共卫生': ['Public Health'],
    '涌现能力': ['Emergent Ability'],
    '人类反馈强化学习': ['RLHF', 'Reinforcement Learning from Human Feedback']
};

var dictReverse = {};
Object.keys(dict).forEach(function(cn) {
    dict[cn].forEach(function(en) {
        var key = en.toLowerCase();
        if (!dictReverse[key]) dictReverse[key] = [];
        dictReverse[key].push(cn);
    });
});

// ==================== Utility ====================
function detectLang(text) {
    var cn = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    var total = text.replace(/\s/g, '').length;
    return total === 0 ? 'en' : (cn / total > 0.3 ? 'cn' : 'en');
}

function translateCnToEn(text) {
    var results = [];
    Object.keys(dict).sort(function(a, b) { return b.length - a.length; }).forEach(function(cn) {
        if (text.includes(cn)) {
            dict[cn].forEach(function(en) {
                if (results.indexOf(en) === -1) results.push(en);
            });
        }
    });
    return results.length > 0 ? results : [text];
}

function translateEnToCn(text) {
    var results = [];
    var lower = text.toLowerCase();
    Object.keys(dictReverse).forEach(function(key) {
        if (lower.includes(key)) {
            dictReverse[key].forEach(function(cn) {
                if (results.indexOf(cn) === -1) results.push(cn);
            });
        }
    });
    return results.length > 0 ? results : [text];
}

function escapeHtml(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

// ==================== Generate Queries ====================
function generateQueries() {
    var dir = document.getElementById('direction').value.trim();
    var kw = document.getElementById('keywords').value.trim();
    if (!dir || !kw) { alert('请填写研究方向和关键词'); return; }

    state.direction = dir;
    var rawKw = kw.split(/[,，]/).map(function(k) { return k.trim(); }).filter(Boolean);

    state.coreKeywordsEn = [];
    state.coreKeywordsCn = [];
    var allVariants = [];

    rawKw.forEach(function(k) {
        var lang = detectLang(k);
        var variants = new Set();
        variants.add(k);
        if (lang === 'cn') {
            state.coreKeywordsCn.push(k);
            translateCnToEn(k).forEach(function(t) { variants.add(t); state.coreKeywordsEn.push(t); });
        } else {
            state.coreKeywordsEn.push(k);
            translateEnToCn(k).forEach(function(t) { variants.add(t); state.coreKeywordsCn.push(t); });
        }
        allVariants.push(Array.from(variants));
    });

    state.expandedKeywords = allVariants;

    var queries = [];
    // English primary
    var enPrimary = allVariants.map(function(g) {
        for (var i = 0; i < g.length; i++) { if (detectLang(g[i]) === 'en') return g[i]; }
        return g[0];
    });
    queries.push(enPrimary.join(' '));
    // Chinese primary
    var cnParts = [];
    allVariants.forEach(function(g) {
        for (var i = 0; i < g.length; i++) {
            if (detectLang(g[i]) === 'cn') { cnParts.push(g[i]); break; }
        }
    });
    if (cnParts.length > 0) queries.push(cnParts.join(' '));
    // Variants
    allVariants.forEach(function(g, idx) {
        g.forEach(function(v) {
            var parts = [];
            for (var k = 0; k < allVariants.length; k++) {
                parts.push(k === idx ? v : allVariants[k][0]);
            }
            var q = parts.join(' ');
            if (queries.indexOf(q) === -1) queries.push(q);
        });
    });
    // Direction combos
    allVariants.forEach(function(g) {
        g.forEach(function(v) {
            var q = dir + ' ' + v;
            if (queries.indexOf(q) === -1) queries.push(q);
        });
    });

    state.queries = queries.slice(0, 15);
    state.keywords = rawKw;

    var list = document.getElementById('query-list');
    var html = '<div style="margin-bottom:12px">';
    html += '<p style="color:var(--success);font-size:.85em">检测语言: ' + (state.coreKeywordsCn.length > 0 ? '中英混合' : '英文') + '</p>';
    html += '<p style="color:var(--text-dim);font-size:.82em">核心关键词(AND): <strong>' + rawKw.join(' AND ') + '</strong></p>';
    html += '<p style="color:var(--text-dim);font-size:.82em">英文扩展: ' + state.coreKeywordsEn.join(', ') + '</p>';
    if (state.coreKeywordsCn.length > 0) {
        html += '<p style="color:var(--text-dim);font-size:.82em">中文扩展: ' + state.coreKeywordsCn.join(', ') + '</p>';
    }
    html += '</div>';
    html += '<p style="color:var(--text-dim);font-size:.82em;margin-bottom:8px">生成 ' + state.queries.length + ' 个检索查询:</p>';
    state.queries.forEach(function(q, i) {
        html += '<span class="query-chip">' + (i + 1) + '. ' + escapeHtml(q) + '</span>';
    });
    list.innerHTML = html;
    document.getElementById('query-section').classList.remove('hidden');
    document.getElementById('query-section').scrollIntoView({ behavior: 'smooth' });
}

// ==================== AND Filter ====================
function mustContainAllKeywords(paper) {
    var combined = ((paper.title || '') + ' ' + (paper.abstract || '')).toLowerCase();
    for (var i = 0; i < state.expandedKeywords.length; i++) {
        var found = false;
        for (var j = 0; j < state.expandedKeywords[i].length; j++) {
            if (combined.includes(state.expandedKeywords[i][j].toLowerCase())) { found = true; break; }
        }
        if (!found) return false;
    }
    return true;
}

// ==================== 6-Source Search ====================
async function startSearch() {
    document.getElementById('btn-search').disabled = true;
    document.getElementById('progress-section').classList.remove('hidden');
    document.getElementById('progress-section').scrollIntoView({ behavior: 'smooth' });
    state.allPapers = [];
    var progress = document.getElementById('progress-fill');
    var status = document.getElementById('search-status');

    var sources = [
        { name: 'OpenAlex', fn: searchOpenAlex, weight: 20 },
        { name: 'Semantic Scholar', fn: searchSemanticScholar, weight: 20 },
        { name: 'arXiv', fn: searchArxiv, weight: 15 },
        { name: 'Crossref', fn: searchCrossref, weight: 15 },
        { name: 'DBLP', fn: searchDBLP, weight: 15 },
        { name: 'PubMed', fn: searchPubMed, weight: 15 }
    ];

    var totalProgress = 0;
    for (var si = 0; si < sources.length; si++) {
        var src = sources[si];
        status.textContent = '正在检索 ' + src.name + '...';
        try {
            var papers = await src.fn();
            var filtered = papers.filter(mustContainAllKeywords);
            state.allPapers.push(...filtered);
            status.textContent = src.name + ': 获取 ' + papers.length + ' 篇 -> AND过滤后 ' + filtered.length + ' 篇';
        } catch (e) {
            status.textContent = src.name + ': 检索失败 (' + e.message + ')';
        }
        totalProgress += src.weight;
        progress.style.width = totalProgress + '%';
        await sleep(400);
    }

    status.textContent = '去重 + 排序中...';
    progress.style.width = '95%';
    state.allPapers = deduplicate(state.allPapers);
    state.allPapers = state.allPapers.filter(function(p) {
        return p.title && p.title.length > 5 && p.year > 0;
    });
    // Score and sort
    state.allPapers.forEach(scoreVenue);
    state.allPapers.sort(function(a, b) { return (b.venueScore + b.citations * 0.5 + b.year * 0.1) - (a.venueScore + a.citations * 0.5 + a.year * 0.1); });

    progress.style.width = '100%';
    status.textContent = '完成！共 ' + state.allPapers.length + ' 篇同时包含所有关键词（6个数据库）';
    await sleep(800);

    if (state.allPapers.length > 0) {
        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('analysis-section').classList.remove('hidden');
        document.getElementById('export-section').classList.remove('hidden');
        filterResults();
        generateAnalysis();
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    } else {
        status.textContent = '未找到同时包含所有关键词的论文，请尝试减少关键词数量';
    }
    document.getElementById('btn-search').disabled = false;
}

function scoreVenue(paper) {
    paper.venueScore = getVenueScore(paper.venue);
    paper.isTop = isTopVenue(paper.venue);
}

// ==================== OpenAlex ====================
async function searchOpenAlex() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 5); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://api.openalex.org/works?search=' + encodeURIComponent(q) + '&per_page=30&sort=cited_by_count:desc';
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
                    papers.push({
                        title: p.title, authors: authors, venue: venue,
                        year: p.publication_year || 0,
                        abstract: reconstructAbstract(p.abstract_inverted_index),
                        citations: p.cited_by_count || 0,
                        doi: p.doi || '',
                        url: (p.primary_location && p.primary_location.landing_page_url) || p.doi || '',
                        source: 'OpenAlex',
                        isOpenAccess: (p.open_access && p.open_access.is_oa) || false
                    });
                });
            }
        } catch (e) { console.error('OpenAlex:', e); }
        await sleep(300);
    }
    return papers;
}

function reconstructAbstract(inv) {
    if (!inv) return '';
    var w = [];
    Object.entries(inv).forEach(function(e) { e[1].forEach(function(p) { w[p] = e[0]; }); });
    return w.join(' ');
}

// ==================== Semantic Scholar ====================
async function searchSemanticScholar() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 5); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://api.semanticscholar.org/graph/v1/paper/search?query=' + encodeURIComponent(q) + '&limit=30&fields=title,authors,venue,year,abstract,citationCount,externalIds,openAccessPdf';
            var yr = document.getElementById('yearRange').value;
            if (yr) url += '&year=' + (new Date().getFullYear() - parseInt(yr)) + '-';
            var res = await fetch(url);
            var data = await res.json();
            if (data.data) {
                data.data.forEach(function(p) {
                    if (!p.title) return;
                    papers.push({
                        title: p.title,
                        authors: (p.authors || []).slice(0, 5).map(function(a) { return a.name; }),
                        venue: p.venue || '', year: p.year || 0,
                        abstract: p.abstract || '',
                        citations: p.citationCount || 0,
                        doi: (p.externalIds && p.externalIds.DOI) || '',
                        url: (p.openAccessPdf && p.openAccessPdf.url) || ((p.externalIds && p.externalIds.DOI) ? 'https://doi.org/' + p.externalIds.DOI : ''),
                        source: 'Semantic Scholar',
                        isOpenAccess: !!p.openAccessPdf
                    });
                });
            }
        } catch (e) { console.error('S2:', e); }
        await sleep(1200);
    }
    return papers;
}

// ==================== arXiv ====================
async function searchArxiv() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 4); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://export.arxiv.org/api/query?search_query=all:' + encodeURIComponent(q) + '&start=0&max_results=25&sortBy=relevance';
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
                papers.push({
                    title: title, authors: authors, venue: 'arXiv',
                    year: year,
                    abstract: sEl ? sEl.textContent.replace(/\s+/g, ' ').trim() : '',
                    citations: 0, doi: '',
                    url: lEl ? lEl.getAttribute('href') : '',
                    source: 'arXiv', isOpenAccess: true
                });
            });
        } catch (e) { console.error('arXiv:', e); }
        await sleep(500);
    }
    return papers;
}

// ==================== Crossref ====================
async function searchCrossref() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 4); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://api.crossref.org/works?query=' + encodeURIComponent(q) + '&rows=25&sort=relevance';
            var yr = document.getElementById('yearRange').value;
            if (yr) url += '&filter=from-pub-date:' + (new Date().getFullYear() - parseInt(yr));
            var res = await fetch(url, { headers: { 'User-Agent': 'LitAssistant/1.0 (mailto:research@example.com)' } });
            var data = await res.json();
            if (data.message && data.message.items) {
                data.message.items.forEach(function(p) {
                    var authors = (p.author || []).slice(0, 5).map(function(a) { return ((a.given || '') + ' ' + (a.family || '')).trim(); });
                    var venue = (p['container-title'] && p['container-title'][0]) || '';
                    var year = 0;
                    if (p['published-print'] && p['published-print']['date-parts'] && p['published-print']['date-parts'][0]) year = p['published-print']['date-parts'][0][0] || 0;
                    else if (p['published-online'] && p['published-online']['date-parts'] && p['published-online']['date-parts'][0]) year = p['published-online']['date-parts'][0][0] || 0;
                    else if (p.created && p.created['date-parts'] && p.created['date-parts'][0]) year = p.created['date-parts'][0][0] || 0;
                    var title = (p.title && p.title[0]) || '';
                    if (!title) return;
                    var abstract = (p.abstract || '').replace(/<[^>]*>/g, '').trim();
                    papers.push({
                        title: title, authors: authors, venue: venue,
                        year: year, abstract: abstract,
                        citations: p['is-referenced-by-count'] || 0,
                        doi: p.DOI || '',
                        url: p.URL || (p.DOI ? 'https://doi.org/' + p.DOI : ''),
                        source: 'Crossref', isOpenAccess: false
                    });
                });
            }
        } catch (e) { console.error('Crossref:', e); }
        await sleep(500);
    }
    return papers;
}

// ==================== DBLP ====================
async function searchDBLP() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 4); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://dblp.org/search/publ/api?q=' + encodeURIComponent(q) + '&format=json&h=25';
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
                    papers.push({
                        title: title, authors: authors, venue: venue,
                        year: year, abstract: '',
                        citations: 0, doi: doi,
                        url: typeof url2 === 'string' ? url2 : (url2 && url2['#text'] || ''),
                        source: 'DBLP', isOpenAccess: false
                    });
                });
            }
        } catch (e) { console.error('DBLP:', e); }
        await sleep(500);
    }
    return papers;
}

// ==================== PubMed ====================
async function searchPubMed() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 3); qi++) {
        var q = state.queries[qi];
        try {
            // Step 1: search
            var searchUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=' + encodeURIComponent(q) + '&retmax=25&sort=relevance&retmode=json';
            var searchRes = await fetch(searchUrl);
            var searchData = await searchRes.json();
            var ids = searchData.esearchresult && searchData.esearchresult.idlist;
            if (!ids || ids.length === 0) continue;
            // Step 2: fetch details
            var fetchUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=' + ids.join(',') + '&retmode=json';
            var fetchRes = await fetch(fetchUrl);
            var fetchData = await fetchRes.json();
            if (fetchData.result) {
                ids.forEach(function(id) {
                    var p = fetchData.result[id];
                    if (!p || !p.title) return;
                    var authors = (p.authors || []).slice(0, 5).map(function(a) { return a.name; });
                    var venue = p.fulljournalname || p.source || '';
                    var year = 0;
                    if (p.pubdate) {
                        var m = p.pubdate.match(/(\d{4})/);
                        if (m) year = parseInt(m[1]);
                    }
                    papers.push({
                        title: p.title, authors: authors, venue: venue,
                        year: year, abstract: '',
                        citations: 0, doi: p.elocationid || '',
                        url: 'https://pubmed.ncbi.nlm.nih.gov/' + id + '/',
                        source: 'PubMed', isOpenAccess: false
                    });
                });
            }
        } catch (e) { console.error('PubMed:', e); }
        await sleep(500);
    }
    return papers;
}

// ==================== Dedup ====================
function deduplicate(papers) {
    var seen = new Set();
    return papers.filter(function(p) {
        var key = p.doi || p.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 80);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ==================== Filter & Sort ====================
function filterResults() {
    var papers = [...state.allPapers];
    var minCite = parseInt(document.getElementById('cite-filter').value);
    document.getElementById('cite-label').textContent = minCite;
    papers = papers.filter(function(p) { return p.citations >= minCite; });
    var yearThreshold = parseInt(document.getElementById('year-filter').value);
    if (yearThreshold > 0) papers = papers.filter(function(p) { return p.year >= yearThreshold; });
    state.filteredPapers = papers;
    sortResults();
}

function sortResults() {
    var sortBy = document.getElementById('sort-by').value;
    var papers = [...state.filteredPapers];
    switch (sortBy) {
        case 'citations':
            papers.sort(function(a, b) { return b.citations - a.citations; });
            break;
        case 'year':
            papers.sort(function(a, b) { return b.year - a.year; });
            break;
        case 'relevance':
            papers.sort(function(a, b) {
                return (b.venueScore + b.citations * 0.5 + b.year * 0.2) - (a.venueScore + a.citations * 0.5 + a.year * 0.2);
            });
            break;
    }
    renderPapers(papers.slice(0, 50));
    var topCount = papers.filter(function(p) { return p.isTop; }).length;
    document.getElementById('results-count').textContent = '共 ' + papers.length + ' 篇（含 ' + topCount + ' 篇顶刊），显示前 ' + Math.min(50, papers.length) + ' 篇';
}

function renderPapers(papers) {
    var list = document.getElementById('paper-list');
    list.innerHTML = papers.map(function(p, i) {
        var aStr = p.authors.slice(0, 3).join(', ') + (p.authors.length > 3 ? ' et al.' : '');
        var venueBadge = p.isTop
            ? '<span class="badge" style="background:rgba(237,137,54,.25);color:var(--warning)">' + escapeHtml(p.venue) + ' [顶刊]</span>'
            : (p.venue ? '<span class="badge">' + escapeHtml(p.venue) + '</span>' : '<span style="color:var(--text-dim)">无期刊信息</span>');
        var oaStr = p.isOpenAccess ? '<span style="color:var(--success)">OA</span>' : '';
        var urlStr = p.url ? '<a href="' + p.url + '" target="_blank" onclick="event.stopPropagation()">查看论文</a>' : '';
        var doiStr = p.doi ? '<a href="https://doi.org/' + p.doi + '" target="_blank" onclick="event.stopPropagation()">DOI</a>' : '';
        return '<div class="paper-card" onclick="this.classList.toggle(\'expanded\')">'
            + '<h3>' + (i + 1) + '. ' + escapeHtml(p.title) + '</h3>'
            + '<div class="paper-meta">'
            + '<span>' + escapeHtml(aStr) + '</span>'
            + venueBadge
            + '<span>' + p.year + '</span>'
            + '<span class="citations">' + p.citations + ' 引用</span>'
            + '<span class="badge">' + p.source + '</span>'
            + oaStr
            + '</div>'
            + '<div class="paper-abstract">' + escapeHtml(p.abstract || '无摘要') + '</div>'
            + '<div class="paper-actions">' + urlStr + doiStr + '</div>'
            + '</div>';
    }).join('');
}

// ==================== Data-Driven Analysis ====================
function generateAnalysis() {
    var papers = state.filteredPapers.length > 5 ? state.filteredPapers : state.allPapers;
    if (papers.length === 0) return;

    // Year distribution
    var yearCounts = {};
    papers.forEach(function(p) { if (p.year > 0) yearCounts[p.year] = (yearCounts[p.year] || 0) + 1; });
    var years = Object.keys(yearCounts).map(Number).sort();

    // Venue distribution
    var venueCounts = {};
    papers.forEach(function(p) { if (p.venue) venueCounts[p.venue] = (venueCounts[p.venue] || 0) + 1; });
    var topVenues = Object.entries(venueCounts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 8);

    // Top venue count
    var topVenuePapers = papers.filter(function(p) { return p.isTop; });

    // Citation stats
    var totalCitations = papers.reduce(function(s, p) { return s + p.citations; }, 0);
    var avgCitations = Math.round(totalCitations / papers.length);
    var topCited = [...papers].sort(function(a, b) { return b.citations - a.citations; }).slice(0, 5);

    // Keyword frequency from titles
    var stopWords = new Set(['the', 'a', 'an', 'of', 'in', 'for', 'and', 'or', 'to', 'with', 'on', 'from', 'by', 'is', 'are', 'was', 'were', 'be', 'as', 'at', 'this', 'that', 'it', 'we', 'our', 'can', 'based', 'using', 'via', 'through', 'new', 'approach', 'model', 'models', 'method', 'methods', 'system', 'systems', 'paper', 'study', 'data', 'results', 'analysis', 'learning', 'research', 'framework', 'towards', 'between', 'into', 'about', 'over', 'not', 'but', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'used', 'use', 'its', 'their', 'your', 'more', 'most', 'than', 'when', 'where', 'how', 'what', 'which', 'who', 'all', 'each', 'every', 'both', 'few', 'some', 'such', 'no', 'nor', 'only', 'own', 'same', 'so', 'too', 'very', 'just', 'because', 'if', 'then', 'there', 'these', 'those', 'while', 'after', 'before', 'above', 'below', 'up', 'down', 'out', 'off', 'again', 'further', 'once', 'here', 'also', 'been', 'being', 'get', 'got', 'like', 'make', 'many', 'much', 'other', 'put', 'see', 'still', 'take', 'two', 'well', 'work', 'first', 'new', 'one', 'two', 'three']);
    var wordFreq = {};
    papers.forEach(function(p) {
        (p.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).forEach(function(w) {
            if (w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
        });
    });
    var topWords = Object.entries(wordFreq).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 12);

    // Source distribution
    var sourceCounts = {};
    papers.forEach(function(p) { sourceCounts[p.source] = (sourceCounts[p.source] || 0) + 1; });

    // OA
    var oaCount = papers.filter(function(p) { return p.isOpenAccess; }).length;

    // Max/min year
    var maxYear = years.length > 0 ? years[years.length - 1] : 0;
    var minYear = years.length > 0 ? years[0] : 0;

    // Stats
    document.getElementById('stats-grid').innerHTML = ''
        + '<div class="stat-card"><div class="num">' + papers.length + '</div><div class="label">论文总数(AND)</div></div>'
        + '<div class="stat-card"><div class="num">' + totalCitations.toLocaleString() + '</div><div class="label">总引用数</div></div>'
        + '<div class="stat-card"><div class="num">' + avgCitations + '</div><div class="label">平均引用</div></div>'
        + '<div class="stat-card"><div class="num">' + topVenuePapers.length + '</div><div class="label">顶刊论文</div></div>';

    // Trends
    var trends = [];
    trends.push('年份分布: ' + years.map(function(y) { return y + ': ' + yearCounts[y] + '篇'; }).join(' | '));
    if (years.length >= 2) {
        var rC = yearCounts[maxYear] || 0, pC = yearCounts[maxYear - 1] || 0;
        if (rC > pC && pC > 0) trends.push(maxYear + '年论文数(' + rC + ')较' + (maxYear-1) + '年(' + pC + ')增长');
        else if (rC < pC && rC > 0) trends.push(maxYear + '年论文数下降');
    }
    trends.push('顶刊论文: ' + topVenuePapers.length + '/' + papers.length + ' 篇 (' + Math.round(topVenuePapers.length / papers.length * 100) + '%)');
    if (topVenuePapers.length > 0) {
        var tvVenues = {};
        topVenuePapers.forEach(function(p) { tvVenues[p.venue] = (tvVenues[p.venue] || 0) + 1; });
        trends.push('顶刊来源: ' + Object.entries(tvVenues).map(function(e) { return e[0] + '(' + e[1] + ')'; }).join(', '));
    }
    trends.push('高频词: ' + topWords.slice(0, 8).map(function(w) { return w[0] + '(' + w[1] + ')'; }).join(', '));
    trends.push('期刊分布(Top5): ' + topVenues.slice(0, 5).map(function(v) { return v[0] + '(' + v[1] + ')'; }).join(', '));
    trends.push('开放获取: ' + oaCount + '/' + papers.length + ' (' + Math.round(oaCount / papers.length * 100) + '%)');
    trends.push('数据来源: ' + Object.entries(sourceCounts).map(function(e) { return e[0] + ': ' + e[1]; }).join(', '));

    document.getElementById('trend-list').innerHTML = trends.map(function(t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('');

    // Research gaps - based on real data only
    var directions = [];
    // Gap 1: emerging topics
    var recentP = papers.filter(function(p) { return p.year >= maxYear - 1; });
    var oldP = papers.filter(function(p) { return p.year < maxYear - 1; });
    if (recentP.length > 0 && oldP.length > 0) {
        var rW = {}, oW = {};
        recentP.forEach(function(p) { (p.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).forEach(function(w) { if (w.length > 2 && !stopWords.has(w)) rW[w] = (rW[w] || 0) + 1; }); });
        oldP.forEach(function(p) { (p.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).forEach(function(w) { if (w.length > 2 && !stopWords.has(w)) oW[w] = (oW[w] || 0) + 1; }); });
        var emerging = [];
        Object.keys(rW).forEach(function(w) {
            if (rW[w] / recentP.length > ((oW[w] || 0) / oldP.length) * 1.5 && rW[w] >= 2) emerging.push(w);
        });
        if (emerging.length > 0) directions.push('新兴趋势词汇: "' + emerging.slice(0, 5).join('", "') + '" 在近2年频率上升');
    }
    // Gap 2: venue diversity
    if (topVenues.length > 0 && topVenues[0][1] > papers.length * 0.25) {
        directions.push('超过25%论文集中在' + topVenues[0][0] + '，可考虑跨领域投稿');
    }
    // Gap 3: citation-based
    var uncited = papers.filter(function(p) { return p.citations === 0 && p.year <= maxYear - 2; });
    if (uncited.length > 3) directions.push(uncited.length + ' 篇发表2年以上的论文零引用，可能代表被忽视的研究方向');
    // Gap 4: top cited direction
    if (topCited.length > 0) {
        var t = topCited[0].title;
        if (t.length > 50) t = t.substring(0, 50) + '...';
        directions.push('最高引: "' + t + '" (' + topCited[0].citations + '次, ' + topCited[0].venue + ', ' + topCited[0].year + ')');
    }
    if (directions.length === 0) directions.push('检索结果充分覆盖，建议进一步细化子方向');

    document.getElementById('direction-list').innerHTML = directions.map(function(d) { return '<li>' + escapeHtml(d) + '</li>'; }).join('');
}

// ==================== Export ====================
function exportReport() {
    var papers = state.filteredPapers.length > 0 ? state.filteredPapers : state.allPapers;
    var topPapers = [...papers].sort(function(a, b) { return b.citations - a.citations; }).slice(0, 15);
    var lines = [];
    lines.push('# 文献调研报告'); lines.push('');
    lines.push('## 研究方向: ' + state.direction); lines.push('');
    lines.push('## 关键词(AND): ' + state.keywords.join(' AND ')); lines.push('');
    lines.push('## 检索策略 (' + state.queries.length + ' 个查询, 6个数据库)');
    state.queries.forEach(function(q) { lines.push('- ' + q); });
    lines.push('');
    lines.push('## 检索结果: ' + papers.length + ' 篇论文');
    var topCount = papers.filter(function(p) { return p.isTop; }).length;
    lines.push('- 顶刊论文: ' + topCount + ' 篇');
    lines.push('- 总引用: ' + papers.reduce(function(s, p) { return s + p.citations; }, 0));
    lines.push('');
    lines.push('## 代表性论文');
    lines.push('');
    topPapers.forEach(function(p, i) {
        lines.push('### ' + (i + 1) + '. ' + p.title);
        lines.push('- 作者: ' + p.authors.join(', '));
        lines.push('- 期刊/会议: ' + (p.venue || '未知') + (p.isTop ? ' [顶刊]' : ''));
        lines.push('- 年份: ' + p.year + ', 引用: ' + p.citations + ', 来源: ' + p.source);
        if (p.doi) lines.push('- DOI: ' + p.doi);
        lines.push('- 摘要: ' + (p.abstract || '无'));
        lines.push('');
    });
    lines.push('## 研究趋势（基于实际数据）');
    document.querySelectorAll('#trend-list li').forEach(function(li) { lines.push('- ' + li.textContent); });
    lines.push('');
    lines.push('## 研究方向建议（基于论文分析）');
    document.querySelectorAll('#direction-list li').forEach(function(li) { lines.push('- ' + li.textContent); });
    lines.push(''); lines.push('---');
    lines.push('*AI 文献调研助手 - 所有数据基于实际检索*');
    downloadFile(lines.join('\n'), '文献调研报告.md', 'text/markdown');
}

function exportJSON() {
    var papers = state.filteredPapers.length > 0 ? state.filteredPapers : state.allPapers;
    downloadFile(JSON.stringify({ direction: state.direction, keywords: state.keywords, queries: state.queries, totalResults: papers.length, papers: papers }, null, 2), '文献调研数据.json', 'application/json');
}

function downloadFile(content, filename, type) {
    var blob = new Blob([content], { type: type + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}
