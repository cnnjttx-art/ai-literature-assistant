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
    '涌现能力': ['Emergent Ability', 'Emergent Capabilities'],
    '人类反馈强化学习': ['Reinforcement Learning from Human Feedback', 'RLHF']
};

// Build reverse dict
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
    var keys = Object.keys(dict).sort(function(a, b) { return b.length - a.length; });
    keys.forEach(function(cn) {
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

    // For each keyword, get English and Chinese variants
    state.coreKeywordsEn = [];
    state.coreKeywordsCn = [];
    var allVariants = []; // array of arrays: each keyword's variants

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

    // Generate AND queries: for each keyword group, pick the best variant
    // Strategy: use primary variant for each keyword, combine with AND
    var queries = [];

    // Primary: all English keywords combined
    var enPrimary = allVariants.map(function(group) {
        // pick the first English variant, or the first one
        for (var i = 0; i < group.length; i++) {
            if (detectLang(group[i]) === 'en') return group[i];
        }
        return group[0];
    });
    queries.push(enPrimary.join(' '));

    // Chinese combined
    var cnPrimary = allVariants.map(function(group) {
        for (var i = 0; i < group.length; i++) {
            if (detectLang(group[i]) === 'cn') return group[i];
        }
        return null;
    }).filter(Boolean);
    if (cnPrimary.length > 0) queries.push(cnPrimary.join(' '));

    // Mixed: try different combinations
    for (var i = 0; i < allVariants.length; i++) {
        for (var j = 0; j < allVariants[i].length; j++) {
            var parts = [];
            for (var k = 0; k < allVariants.length; k++) {
                if (k === i) {
                    parts.push(allVariants[k][j]);
                } else {
                    // pick first of each
                    parts.push(allVariants[k][0]);
                }
            }
            var q = parts.join(' ');
            if (queries.indexOf(q) === -1) queries.push(q);
        }
    }

    // Also add direction + keyword combos
    allVariants.forEach(function(group) {
        group.forEach(function(v) {
            var q = dir + ' ' + v;
            if (queries.indexOf(q) === -1) queries.push(q);
        });
    });

    // Limit
    state.queries = queries.slice(0, 15);
    state.keywords = rawKw;

    // Display
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
    var title = (paper.title || '').toLowerCase();
    var abstract = (paper.abstract || '').toLowerCase();
    var combined = title + ' ' + abstract;

    // For each user keyword, at least one variant must appear
    for (var i = 0; i < state.expandedKeywords.length; i++) {
        var variants = state.expandedKeywords[i];
        var found = false;
        for (var j = 0; j < variants.length; j++) {
            if (combined.includes(variants[j].toLowerCase())) {
                found = true;
                break;
            }
        }
        if (!found) return false;
    }
    return true;
}

// ==================== Multi-Source Search ====================
async function startSearch() {
    document.getElementById('btn-search').disabled = true;
    document.getElementById('progress-section').classList.remove('hidden');
    document.getElementById('progress-section').scrollIntoView({ behavior: 'smooth' });
    state.allPapers = [];
    var progress = document.getElementById('progress-fill');
    var status = document.getElementById('search-status');

    var sources = [
        { name: 'OpenAlex', fn: searchOpenAlex, weight: 40 },
        { name: 'Semantic Scholar', fn: searchSemanticScholar, weight: 35 },
        { name: 'arXiv', fn: searchArxiv, weight: 25 }
    ];

    var totalProgress = 0;
    for (var si = 0; si < sources.length; si++) {
        var src = sources[si];
        status.textContent = '正在检索 ' + src.name + '...';
        try {
            var papers = await src.fn();
            status.textContent = src.name + ': 找到 ' + papers.length + ' 篇（AND过滤中...）';
            // AND filter
            var filtered = papers.filter(mustContainAllKeywords);
            state.allPapers.push(...filtered);
            status.textContent = src.name + ': ' + papers.length + ' 篇中 ' + filtered.length + ' 篇满足全部关键词';
        } catch (e) {
            status.textContent = src.name + ': 检索失败 (' + e.message + ')';
        }
        totalProgress += src.weight;
        progress.style.width = totalProgress + '%';
        await sleep(500);
    }

    // Deduplicate
    status.textContent = '去重处理中...';
    progress.style.width = '95%';
    state.allPapers = deduplicate(state.allPapers);

    // Remove papers without essential metadata
    state.allPapers = state.allPapers.filter(function(p) {
        return p.title && p.title.length > 5 && p.year > 0;
    });

    progress.style.width = '100%';
    status.textContent = '检索完成！共 ' + state.allPapers.length + ' 篇论文同时包含所有关键词';
    await sleep(800);

    if (state.allPapers.length > 0) {
        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('analysis-section').classList.remove('hidden');
        document.getElementById('export-section').classList.remove('hidden');
        filterResults();
        generateAnalysis();
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    } else {
        status.textContent = '未找到同时包含所有关键词的论文，请尝试减少关键词数量或调整表述';
    }
    document.getElementById('btn-search').disabled = false;
}

// ==================== OpenAlex ====================
async function searchOpenAlex() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 6); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://api.openalex.org/works?search=' + encodeURIComponent(q) + '&per_page=50&sort=cited_by_count:desc';
            var yr = document.getElementById('yearRange').value;
            if (yr) {
                var from = new Date().getFullYear() - parseInt(yr);
                url += '&filter=publication_year:>' + from;
            }
            var res = await fetch(url);
            var data = await res.json();
            if (data.results) {
                data.results.forEach(function(p) {
                    if (!p.title) return;
                    var authors = (p.authorships || []).slice(0, 5).map(function(a) {
                        return a.author && a.author.display_name || '';
                    }).filter(Boolean);
                    var venue = '';
                    if (p.primary_location && p.primary_location.source) {
                        venue = p.primary_location.source.display_name || '';
                    } else if (p.host_venue) {
                        venue = p.host_venue.display_name || '';
                    }
                    papers.push({
                        title: p.title,
                        authors: authors,
                        venue: venue,
                        year: p.publication_year || 0,
                        abstract: reconstructAbstract(p.abstract_inverted_index),
                        citations: p.cited_by_count || 0,
                        doi: p.doi || '',
                        url: (p.primary_location && p.primary_location.landing_page_url) || p.doi || '',
                        source: 'OpenAlex',
                        isOpenAccess: (p.open_access && p.open_access.is_oa) || false,
                        concepts: (p.concepts || []).map(function(c) { return c.display_name; }).slice(0, 5)
                    });
                });
            }
        } catch (e) { console.error('OpenAlex:', e); }
        await sleep(300);
    }
    return papers;
}

function reconstructAbstract(invIndex) {
    if (!invIndex) return '';
    var words = [];
    Object.entries(invIndex).forEach(function(e) {
        e[1].forEach(function(pos) { words[pos] = e[0]; });
    });
    return words.join(' ');
}

// ==================== Semantic Scholar ====================
async function searchSemanticScholar() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 5); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://api.semanticscholar.org/graph/v1/paper/search?query=' + encodeURIComponent(q) + '&limit=40&fields=title,authors,venue,year,abstract,citationCount,externalIds,openAccessPdf';
            var yr = document.getElementById('yearRange').value;
            if (yr) {
                var from = new Date().getFullYear() - parseInt(yr);
                url += '&year=' + from + '-';
            }
            var res = await fetch(url);
            var data = await res.json();
            if (data.data) {
                data.data.forEach(function(p) {
                    if (!p.title) return;
                    papers.push({
                        title: p.title,
                        authors: (p.authors || []).slice(0, 5).map(function(a) { return a.name; }),
                        venue: p.venue || '',
                        year: p.year || 0,
                        abstract: p.abstract || '',
                        citations: p.citationCount || 0,
                        doi: (p.externalIds && p.externalIds.DOI) || '',
                        url: (p.openAccessPdf && p.openAccessPdf.url) || ((p.externalIds && p.externalIds.DOI) ? 'https://doi.org/' + p.externalIds.DOI : ''),
                        source: 'Semantic Scholar',
                        isOpenAccess: !!p.openAccessPdf,
                        concepts: []
                    });
                });
            }
        } catch (e) { console.error('Semantic Scholar:', e); }
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
            var url = 'https://export.arxiv.org/api/query?search_query=all:' + encodeURIComponent(q) + '&start=0&max_results=30&sortBy=relevance';
            var res = await fetch(url);
            var text = await res.text();
            var parser = new DOMParser();
            var xml = parser.parseFromString(text, 'text/xml');
            var entries = xml.querySelectorAll('entry');
            entries.forEach(function(entry) {
                var titleEl = entry.querySelector('title');
                var title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
                if (!title) return;
                var authors = Array.from(entry.querySelectorAll('author name')).map(function(a) { return a.textContent; }).slice(0, 5);
                var summaryEl = entry.querySelector('summary');
                var summary = summaryEl ? summaryEl.textContent.replace(/\s+/g, ' ').trim() : '';
                var publishedEl = entry.querySelector('published');
                var published = publishedEl ? publishedEl.textContent : '';
                var year = parseInt(published.substring(0, 4)) || 0;
                var linkEl = entry.querySelector('link[rel="alternate"]');
                var link = linkEl ? linkEl.getAttribute('href') : '';
                papers.push({
                    title: title,
                    authors: authors,
                    venue: 'arXiv',
                    year: year,
                    abstract: summary,
                    citations: 0,
                    doi: '',
                    url: link,
                    source: 'arXiv',
                    isOpenAccess: true,
                    concepts: []
                });
            });
        } catch (e) { console.error('arXiv:', e); }
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
    if (yearThreshold > 0) {
        papers = papers.filter(function(p) { return p.year >= yearThreshold; });
    }
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
                var scoreA = a.citations * 0.5 + (a.year >= 2024 ? 10 : a.year >= 2022 ? 5 : 0) + (a.venue ? 3 : 0);
                var scoreB = b.citations * 0.5 + (b.year >= 2024 ? 10 : b.year >= 2022 ? 5 : 0) + (b.venue ? 3 : 0);
                return scoreB - scoreA;
            });
            break;
    }
    renderPapers(papers.slice(0, 50));
    document.getElementById('results-count').textContent = '共 ' + papers.length + ' 篇（显示前 ' + Math.min(50, papers.length) + ' 篇），全部同时包含所有关键词';
}

function renderPapers(papers) {
    var list = document.getElementById('paper-list');
    list.innerHTML = papers.map(function(p, i) {
        var aStr = p.authors.slice(0, 3).join(', ') + (p.authors.length > 3 ? ' et al.' : '');
        var oaStr = p.isOpenAccess ? '<span style="color:var(--success)">OA</span>' : '';
        var urlStr = p.url ? '<a href="' + p.url + '" target="_blank" onclick="event.stopPropagation()">查看论文</a>' : '';
        var doiStr = p.doi ? '<a href="https://doi.org/' + p.doi + '" target="_blank" onclick="event.stopPropagation()">DOI</a>' : '';
        return '<div class="paper-card" onclick="this.classList.toggle(\'expanded\')">'
            + '<h3>' + (i + 1) + '. ' + escapeHtml(p.title) + '</h3>'
            + '<div class="paper-meta">'
            + '<span>' + escapeHtml(aStr) + '</span>'
            + (p.venue ? '<span class="badge">' + escapeHtml(p.venue) + '</span>' : '<span style="color:var(--warning)">无期刊信息</span>')
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

    // --- Year distribution (real data) ---
    var yearCounts = {};
    papers.forEach(function(p) {
        if (p.year > 0) yearCounts[p.year] = (yearCounts[p.year] || 0) + 1;
    });
    var years = Object.keys(yearCounts).map(Number).sort();
    var yearStr = years.map(function(y) { return y + ': ' + yearCounts[y] + '篇'; }).join(' | ');

    // --- Venue distribution (real data) ---
    var venueCounts = {};
    papers.forEach(function(p) {
        if (p.venue) venueCounts[p.venue] = (venueCounts[p.venue] || 0) + 1;
    });
    var topVenues = Object.entries(venueCounts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 8);

    // --- Keyword frequency from titles (real data) ---
    var wordFreq = {};
    var stopWords = new Set(['the', 'a', 'an', 'of', 'in', 'for', 'and', 'or', 'to', 'with', 'on', 'from', 'by', 'is', 'are', 'was', 'were', 'be', 'as', 'at', 'this', 'that', 'it', 'we', 'our', 'can', 'based', 'using', 'via', 'through', 'new', 'approach', 'model', 'models', 'method', 'methods', 'system', 'systems', 'paper', 'study', 'data', 'results', 'analysis', 'learning', 'research', 'framework', 'towards', 'toward', 'between', 'from', 'into', 'about', 'over', 'under', 'not', 'but', 'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'use', 'using']);
    papers.forEach(function(p) {
        var words = (p.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/);
        words.forEach(function(w) {
            if (w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w)) {
                wordFreq[w] = (wordFreq[w] || 0) + 1;
            }
        });
    });
    var topWords = Object.entries(wordFreq).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 15);

    // --- Source distribution (real data) ---
    var sourceCounts = {};
    papers.forEach(function(p) { sourceCounts[p.source] = (sourceCounts[p.source] || 0) + 1; });

    // --- Citation stats (real data) ---
    var totalCitations = papers.reduce(function(s, p) { return s + p.citations; }, 0);
    var avgCitations = Math.round(totalCitations / papers.length);
    var topCited = [...papers].sort(function(a, b) { return b.citations - a.citations; }).slice(0, 5);
    var maxYear = years.length > 0 ? years[years.length - 1] : 0;
    var minYear = years.length > 0 ? years[0] : 0;

    // --- OA stats (real data) ---
    var oaCount = papers.filter(function(p) { return p.isOpenAccess; }).length;

    // Render stats
    document.getElementById('stats-grid').innerHTML = ''
        + '<div class="stat-card"><div class="num">' + papers.length + '</div><div class="label">论文总数(AND)</div></div>'
        + '<div class="stat-card"><div class="num">' + totalCitations.toLocaleString() + '</div><div class="label">总引用数</div></div>'
        + '<div class="stat-card"><div class="num">' + avgCitations + '</div><div class="label">平均引用</div></div>'
        + '<div class="stat-card"><div class="num">' + minYear + '-' + maxYear + '</div><div class="label">年份跨度</div></div>';

    // Trends - ONLY based on real data
    var trends = [];
    trends.push('年份分布: ' + yearStr);
    if (years.length >= 2) {
        var recentCount = yearCounts[maxYear] || 0;
        var prevCount = yearCounts[maxYear - 1] || 0;
        if (recentCount > prevCount && prevCount > 0) {
            trends.push(maxYear + '年论文数(' + recentCount + ')较' + (maxYear-1) + '年(' + prevCount + ')增长' + Math.round((recentCount - prevCount) / prevCount * 100) + '%');
        } else if (recentCount < prevCount && recentCount > 0) {
            trends.push(maxYear + '年论文数(' + recentCount + ')较' + (maxYear-1) + '年(' + prevCount + ')下降');
        }
    }
    trends.push('高频词汇(Top10): ' + topWords.slice(0, 10).map(function(w) { return w[0] + '(' + w[1] + ')'; }).join(', '));
    trends.push('主要期刊/会议: ' + topVenues.slice(0, 5).map(function(v) { return v[0] + '(' + v[1] + '篇)'; }).join(', '));
    trends.push('开放获取: ' + oaCount + '/' + papers.length + ' 篇 (' + Math.round(oaCount / papers.length * 100) + '%)');
    var srcStr = Object.entries(sourceCounts).map(function(e) { return e[0] + ': ' + e[1]; }).join(', ');
    trends.push('数据来源: ' + srcStr);

    document.getElementById('trend-list').innerHTML = trends.map(function(t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('');

    // Directions - based on actual paper analysis, identify gaps
    var directions = [];

    // Gap 1: Look at recent papers' topics vs older papers
    var recentPapers = papers.filter(function(p) { return p.year >= maxYear - 1; });
    var oldPapers = papers.filter(function(p) { return p.year < maxYear - 1; });
    if (recentPapers.length > 0 && oldPapers.length > 0) {
        var recentWords = {};
        recentPapers.forEach(function(p) {
            (p.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).forEach(function(w) {
                if (w.length > 2 && !stopWords.has(w)) recentWords[w] = (recentWords[w] || 0) + 1;
            });
        });
        var oldWords = {};
        oldPapers.forEach(function(p) {
            (p.title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).forEach(function(w) {
                if (w.length > 2 && !stopWords.has(w)) oldWords[w] = (oldWords[w] || 0) + 1;
            });
        });
        // Find emerging topics
        var emerging = [];
        Object.keys(recentWords).forEach(function(w) {
            var rf = recentWords[w] / recentPapers.length;
            var of2 = (oldWords[w] || 0) / oldPapers.length;
            if (rf > of2 * 1.5 && recentWords[w] >= 2) emerging.push(w);
        });
        if (emerging.length > 0) {
            directions.push('新兴趋势: "' + emerging.slice(0, 5).join('", "') + '" 在近2年论文中频率显著上升');
        }
    }

    // Gap 2: Low citation + recent = potential underexplored
    var lowCiteRecent = papers.filter(function(p) { return p.year >= maxYear - 2 && p.citations < avgCitations / 2; });
    if (lowCiteRecent.length > 3) {
        directions.push('有 ' + lowCiteRecent.length + ' 篇近2年论文引用较低，可能代表新兴或小众研究分支，值得关注');
    }

    // Gap 3: Venue gaps
    if (topVenues.length > 0) {
        var mainVenue = topVenues[0][0];
        var mainCount = topVenues[0][1];
        var otherCount = papers.length - mainCount;
        if (mainCount > papers.length * 0.3) {
            directions.push('超过' + Math.round(mainCount / papers.length * 100) + '%的论文发表在' + mainVenue + '，可考虑向其他领域期刊/会议拓展');
        }
    }

    // Gap 4: High-cited papers suggest proven directions
    if (topCited.length > 0) {
        var topTitle = topCited[0].title;
        if (topTitle.length > 50) topTitle = topTitle.substring(0, 50) + '...';
        directions.push('最高引论文: "' + topTitle + '" (' + topCited[0].citations + '次引用) — 可深入其后续工作方向');
    }

    // Gap 5: Keyword intersection analysis
    if (state.keywords.length >= 2) {
        var pairCount = 0;
        papers.forEach(function(p) {
            var combined = ((p.title || '') + ' ' + (p.abstract || '')).toLowerCase();
            var allFound = true;
            state.coreKeywordsEn.forEach(function(kw) {
                if (!combined.includes(kw.toLowerCase())) allFound = false;
            });
            if (allFound) pairCount++;
        });
        if (pairCount < papers.length * 0.5) {
            directions.push('仅有 ' + pairCount + '/' + papers.length + ' 篇论文在摘要中同时包含所有关键词，表明该交叉方向研究尚不充分');
        }
    }

    if (directions.length === 0) {
        directions.push('当前检索结果覆盖充分，建议结合具体子方向进一步细化检索');
    }

    document.getElementById('direction-list').innerHTML = directions.map(function(d) { return '<li>' + escapeHtml(d) + '</li>'; }).join('');
}

// ==================== Export ====================
function exportReport() {
    var papers = state.filteredPapers.length > 0 ? state.filteredPapers : state.allPapers;
    var topPapers = [...papers].sort(function(a, b) { return b.citations - a.citations; }).slice(0, 15);
    var lines = [];
    lines.push('# 文献调研报告');
    lines.push('');
    lines.push('## 研究方向');
    lines.push(state.direction);
    lines.push('');
    lines.push('## 关键词（AND 逻辑）');
    lines.push(state.keywords.join(' AND '));
    lines.push('');
    lines.push('## 检索策略');
    lines.push('共生成 ' + state.queries.length + ' 个检索查询:');
    state.queries.forEach(function(q) { lines.push('- ' + q); });
    lines.push('');
    lines.push('## 检索结果');
    lines.push('- 满足全部关键词的论文: ' + papers.length + ' 篇');
    lines.push('- 总引用数: ' + papers.reduce(function(s, p) { return s + p.citations; }, 0));
    lines.push('');
    lines.push('## 代表性论文');
    lines.push('');
    topPapers.forEach(function(p, i) {
        lines.push('### ' + (i + 1) + '. ' + p.title);
        lines.push('- 作者: ' + p.authors.join(', '));
        lines.push('- 期刊/会议: ' + (p.venue || '未知'));
        lines.push('- 年份: ' + p.year);
        lines.push('- 引用数: ' + p.citations);
        if (p.doi) lines.push('- DOI: ' + p.doi);
        if (p.url) lines.push('- 链接: ' + p.url);
        lines.push('- 摘要: ' + (p.abstract || '无'));
        lines.push('');
    });
    lines.push('## 研究趋势（基于检索论文实际数据）');
    document.querySelectorAll('#trend-list li').forEach(function(li) { lines.push('- ' + li.textContent); });
    lines.push('');
    lines.push('## 研究方向建议（基于论文分析）');
    document.querySelectorAll('#direction-list li').forEach(function(li) { lines.push('- ' + li.textContent); });
    lines.push('');
    lines.push('---');
    lines.push('*由 AI 文献调研助手生成 — 所有数据均基于实际检索结果*');
    downloadFile(lines.join('\n'), '文献调研报告.md', 'text/markdown');
}

function exportJSON() {
    var papers = state.filteredPapers.length > 0 ? state.filteredPapers : state.allPapers;
    var data = {
        direction: state.direction,
        keywords: state.keywords,
        queries: state.queries,
        totalResults: papers.length,
        papers: papers
    };
    downloadFile(JSON.stringify(data, null, 2), '文献调研数据.json', 'application/json');
}

function downloadFile(content, filename, type) {
    var blob = new Blob([content], { type: type + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
