// ==================== State ====================
var state = {
    direction: '',
    keywords: [],
    queries: [],
    allPapers: [],
    filteredPapers: [],
    strategies: ['top-venue', 'high-cite', 'recent']
};

// ==================== Academic Translation Dictionary ====================
var dict_cn_to_en = {
    '多智能体': ['Multi-Agent', 'Multiagent'],
    '智能体': ['Agent', 'Intelligent Agent'],
    '大模型': ['Large Language Model', 'LLM'],
    '大语言模型': ['Large Language Model', 'LLM'],
    '深度学习': ['Deep Learning'],
    '机器学习': ['Machine Learning'],
    '强化学习': ['Reinforcement Learning'],
    '自然语言处理': ['Natural Language Processing', 'NLP'],
    '计算机视觉': ['Computer Vision', 'CV'],
    '神经网络': ['Neural Network'],
    '卷积神经网络': ['Convolutional Neural Network', 'CNN'],
    '循环神经网络': ['Recurrent Neural Network', 'RNN'],
    '注意力机制': ['Attention Mechanism'],
    '自注意力': ['Self-Attention'],
    '变换器': ['Transformer'],
    '预训练': ['Pre-training', 'Pretraining'],
    '微调': ['Fine-tuning', 'Finetuning'],
    '迁移学习': ['Transfer Learning'],
    '知识蒸馏': ['Knowledge Distillation'],
    '对抗生成网络': ['Generative Adversarial Network', 'GAN'],
    '扩散模型': ['Diffusion Model'],
    '检索增强': ['Retrieval-Augmented', 'RAG'],
    '向量数据库': ['Vector Database', 'Vector DB'],
    '知识图谱': ['Knowledge Graph'],
    '图神经网络': ['Graph Neural Network', 'GNN'],
    '推荐系统': ['Recommendation System'],
    '情感分析': ['Sentiment Analysis'],
    '文本分类': ['Text Classification'],
    '语义分割': ['Semantic Segmentation'],
    '目标检测': ['Object Detection'],
    '图像识别': ['Image Recognition'],
    '语音识别': ['Speech Recognition', 'ASR'],
    '自动驾驶': ['Autonomous Driving', 'Self-Driving'],
    '联邦学习': ['Federated Learning'],
    '元学习': ['Meta-Learning'],
    '少样本学习': ['Few-Shot Learning'],
    '零样本': ['Zero-Shot'],
    '链式思维': ['Chain-of-Thought', 'CoT'],
    '思维链': ['Chain-of-Thought', 'CoT'],
    '提示工程': ['Prompt Engineering'],
    '指令微调': ['Instruction Tuning', 'Instruction Fine-Tuning'],
    '人类反馈强化学习': ['Reinforcement Learning from Human Feedback', 'RLHF'],
    '对齐': ['Alignment'],
    '涌现能力': ['Emergent Ability', 'Emergent Capabilities'],
    '推理': ['Reasoning'],
    '规划': ['Planning'],
    '协作': ['Collaboration', 'Cooperation'],
    '通信': ['Communication'],
    '编排': ['Orchestration'],
    '工具使用': ['Tool Use', 'Tool-Using'],
    '代码生成': ['Code Generation'],
    '问答': ['Question Answering', 'QA'],
    '摘要': ['Summarization'],
    '翻译': ['Translation'],
    '对话系统': ['Dialogue System', 'Conversational AI'],
    '机器人': ['Robot', 'Robotics'],
    '具身智能': ['Embodied Intelligence', 'Embodied AI'],
    '多模态': ['Multimodal', 'Multi-Modal'],
    '视觉语言模型': ['Vision-Language Model', 'VLM'],
    '基准测试': ['Benchmark'],
    '评估': ['Evaluation', 'Assessment'],
    '可解释性': ['Interpretability', 'Explainability'],
    '鲁棒性': ['Robustness'],
    '泛化': ['Generalization'],
    '过拟合': ['Overfitting'],
    '数据增强': ['Data Augmentation'],
    '迁移学习': ['Transfer Learning'],
    '对比学习': ['Contrastive Learning'],
    '自监督学习': ['Self-Supervised Learning'],
    '生成模型': ['Generative Model'],
    '判别模型': ['Discriminative Model'],
    '序列到序列': ['Sequence-to-Sequence', 'Seq2Seq'],
    '编码器': ['Encoder'],
    '解码器': ['Decoder'],
    '嵌入': ['Embedding'],
    '损失函数': ['Loss Function'],
    '优化器': ['Optimizer'],
    '梯度下降': ['Gradient Descent'],
    '反向传播': ['Backpropagation'],
    '批归一化': ['Batch Normalization'],
    '残差连接': ['Residual Connection'],
    '正则化': ['Regularization'],
    '量子计算': ['Quantum Computing'],
    '边缘计算': ['Edge Computing'],
    '云计算': ['Cloud Computing'],
    '区块链': ['Blockchain'],
    '物联网': ['Internet of Things', 'IoT'],
    '数字孪生': ['Digital Twin'],
    '智慧城市': ['Smart City'],
    '可持续发展': ['Sustainable Development'],
    '碳中和': ['Carbon Neutrality'],
    '催化剂': ['Catalyst', 'Catalysis'],
    '电化学': ['Electrochemistry'],
    '电池': ['Battery'],
    '超级电容器': ['Supercapacitor'],
    '纳米材料': ['Nanomaterial', 'Nanomaterials'],
    '复合材料': ['Composite Material', 'Composites'],
    '聚合物': ['Polymer'],
    '蛋白质': ['Protein'],
    '基因组学': ['Genomics'],
    '蛋白质组学': ['Proteomics'],
    '代谢组学': ['Metabolomics'],
    '药物发现': ['Drug Discovery'],
    '临床试验': ['Clinical Trial'],
    '基因编辑': ['Gene Editing', 'CRISPR'],
    '合成生物学': ['Synthetic Biology'],
    '气候模型': ['Climate Model'],
    '遥感': ['Remote Sensing'],
    '天体物理': ['Astrophysics'],
    '粒子物理': ['Particle Physics'],
    '凝聚态物理': ['Condensed Matter Physics'],
    '金融': ['Finance', 'Financial'],
    '经济学': ['Economics', 'Economy'],
    '博弈论': ['Game Theory'],
    '运筹学': ['Operations Research'],
    '供应链': ['Supply Chain'],
    '社会网络': ['Social Network'],
    '舆情分析': ['Public Opinion Analysis'],
    '教育': ['Education'],
    '心理学': ['Psychology'],
    '认知科学': ['Cognitive Science'],
    '公共卫生': ['Public Health'],
    '流行病学': ['Epidemiology']
};

var dict_en_to_cn = {};
Object.keys(dict_cn_to_en).forEach(function(cn) {
    dict_cn_to_en[cn].forEach(function(en) {
        var enLower = en.toLowerCase();
        if (!dict_en_to_cn[enLower]) dict_en_to_cn[enLower] = [];
        dict_en_to_cn[enLower].push(cn);
    });
});

// ==================== Language Detection ====================
function detectLanguage(text) {
    var cnChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    var total = text.replace(/\s/g, '').length;
    if (total === 0) return 'en';
    return (cnChars / total > 0.3) ? 'cn' : 'en';
}

// ==================== Translation ====================
function translateCnToEn(cnText) {
    var results = [];
    var sortedKeys = Object.keys(dict_cn_to_en).sort(function(a, b) { return b.length - a.length; });
    var matched = false;
    sortedKeys.forEach(function(cn) {
        if (cnText.includes(cn)) {
            dict_cn_to_en[cn].forEach(function(en) {
                if (results.indexOf(en) === -1) results.push(en);
            });
            matched = true;
        }
    });
    if (!matched) {
        results.push(cnText);
    }
    return results;
}

function translateEnToCn(enText) {
    var results = [];
    var enLower = enText.toLowerCase();
    Object.keys(dict_en_to_cn).forEach(function(key) {
        if (enLower.includes(key)) {
            dict_en_to_cn[key].forEach(function(cn) {
                if (results.indexOf(cn) === -1) results.push(cn);
            });
        }
    });
    if (results.length === 0) {
        results.push(enText);
    }
    return results;
}

// ==================== Keyword Expansion ====================
function expandKeywords(keywords, lang) {
    var expanded = new Set();
    keywords.forEach(function(kw) {
        expanded.add(kw.trim());
        if (lang === 'cn' || detectLanguage(kw) === 'cn') {
            var enTranslations = translateCnToEn(kw);
            enTranslations.forEach(function(t) { expanded.add(t); });
        }
        if (lang === 'en' || detectLanguage(kw) === 'en') {
            var cnTranslations = translateEnToCn(kw);
            cnTranslations.forEach(function(t) { expanded.add(t); });
            // English expansions
            var kwLower = kw.toLowerCase();
            if (kwLower === 'llm' || kwLower === 'large language model') {
                ['Large Language Model', 'LLM', 'GPT', 'BERT', 'Language Model', 'Foundation Model'].forEach(function(x) { expanded.add(x); });
            }
            if (kwLower === 'multi-agent' || kwLower === 'multiagent') {
                ['Multi-Agent', 'Multiagent', 'Multi-Agent System', 'Multi-Agent Collaboration', 'Agent-Based'].forEach(function(x) { expanded.add(x); });
            }
            if (kwLower === 'rag' || kwLower === 'retrieval-augmented') {
                ['Retrieval-Augmented Generation', 'RAG', 'Retrieval Augmented'].forEach(function(x) { expanded.add(x); });
            }
            if (kwLower === 'reasoning') {
                ['Reasoning', 'Chain-of-Thought', 'Logical Reasoning', 'Mathematical Reasoning'].forEach(function(x) { expanded.add(x); });
            }
            if (kwLower === 'transformer') {
                ['Transformer', 'Attention Mechanism', 'Self-Attention', 'BERT', 'GPT'].forEach(function(x) { expanded.add(x); });
            }
            if (kwLower === 'diffusion') {
                ['Diffusion Model', 'Diffusion', 'Stable Diffusion', 'Denoising Diffusion'].forEach(function(x) { expanded.add(x); });
            }
            if (kwLower === 'reinforcement learning' || kwLower === 'rl') {
                ['Reinforcement Learning', 'RL', 'Deep Reinforcement Learning', 'Policy Gradient'].forEach(function(x) { expanded.add(x); });
            }
            if (kwLower === 'nlp' || kwLower === 'natural language processing') {
                ['Natural Language Processing', 'NLP', 'Text Mining', 'Computational Linguistics'].forEach(function(x) { expanded.add(x); });
            }
            if (kwLower === 'computer vision' || kwLower === 'cv') {
                ['Computer Vision', 'CV', 'Image Processing', 'Visual Recognition'].forEach(function(x) { expanded.add(x); });
            }
        }
    });
    return Array.from(expanded);
}

// ==================== Generate Queries ====================
function generateQueries() {
    var dir = document.getElementById('direction').value.trim();
    var kw = document.getElementById('keywords').value.trim();
    if (!dir || !kw) {
        alert('请填写研究方向和关键词');
        return;
    }
    state.direction = dir;
    var rawKeywords = kw.split(/[,，]/).map(function(k) { return k.trim(); }).filter(Boolean);

    // Detect language
    var dirLang = detectLanguage(dir);
    var kwLang = detectLanguage(rawKeywords.join(' '));
    var lang = (dirLang === 'cn' || kwLang === 'cn') ? 'cn' : 'en';

    // Translate direction
    var dirTerms = new Set();
    dirTerms.add(dir);
    if (dirLang === 'cn') {
        translateCnToEn(dir).forEach(function(t) { dirTerms.add(t); });
    } else {
        translateEnToCn(dir).forEach(function(t) { dirTerms.add(t); });
    }

    // Expand keywords
    var expandedKw = expandKeywords(rawKeywords, lang);
    state.keywords = expandedKw;

    // Generate query combinations (10-20)
    var queries = new Set();
    var dirArr = Array.from(dirTerms);
    var kwGroups = groupSimilarKeywords(expandedKw);

    // Direction alone
    dirArr.forEach(function(d) { queries.add(d); });

    // Each keyword group with direction
    kwGroups.forEach(function(group) {
        group.forEach(function(k) {
            dirArr.forEach(function(d) {
                queries.add(d + ' ' + k);
            });
        });
    });

    // Keyword pairs
    for (var i = 0; i < Math.min(kwGroups.length, 4); i++) {
        for (var j = i + 1; j < Math.min(kwGroups.length, 4); j++) {
            queries.add(kwGroups[i][0] + ' ' + kwGroups[j][0]);
        }
    }

    // Top individual keywords
    expandedKw.slice(0, 6).forEach(function(k) { queries.add(k); });

    // Limit to 20
    state.queries = Array.from(queries).slice(0, 20);

    // Display
    var list = document.getElementById('query-list');
    var langBadge = lang === 'cn' ? '检测到中文输入，已自动翻译扩展' : 'English input detected, expanded keywords';
    var html = '<p style="color:var(--success);font-size:.85em;margin-bottom:10px">' + langBadge + '</p>';
    html += '<p style="color:var(--text-dim);font-size:.8em;margin-bottom:8px">扩展关键词: ' + expandedKw.slice(0, 8).join(', ') + (expandedKw.length > 8 ? '...' : '') + '</p>';
    html += '<p style="color:var(--text-dim);font-size:.8em;margin-bottom:12px">生成 ' + state.queries.length + ' 个检索查询:</p>';
    state.queries.forEach(function(q, i) {
        html += '<span class="query-chip">' + (i + 1) + '. ' + escapeHtml(q) + '</span>';
    });
    list.innerHTML = html;

    document.getElementById('query-section').classList.remove('hidden');
    document.getElementById('query-section').scrollIntoView({ behavior: 'smooth' });
}

function groupSimilarKeywords(keywords) {
    var groups = [];
    var used = new Set();
    keywords.forEach(function(kw) {
        if (used.has(kw)) return;
        var group = [kw];
        used.add(kw);
        keywords.forEach(function(other) {
            if (used.has(other)) return;
            if (kw.toLowerCase().includes(other.toLowerCase()) || other.toLowerCase().includes(kw.toLowerCase())) {
                group.push(other);
                used.add(other);
            }
        });
        groups.push(group);
    });
    return groups;
}

function regenerateQueries() {
    generateQueries();
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
        { name: 'OpenAlex', fn: searchOpenAlex, weight: 30 },
        { name: 'Semantic Scholar', fn: searchSemanticScholar, weight: 30 },
        { name: 'arXiv', fn: searchArxiv, weight: 20 },
        { name: 'Crossref', fn: searchCrossref, weight: 20 }
    ];
    var totalProgress = 0;
    for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        status.textContent = '正在检索 ' + source.name + '...';
        try {
            var papers = await source.fn();
            state.allPapers.push(...papers);
            status.textContent = source.name + ': 找到 ' + papers.length + ' 篇';
        } catch (e) {
            status.textContent = source.name + ': 检索失败 (' + e.message + ')';
        }
        totalProgress += source.weight;
        progress.style.width = totalProgress + '%';
        await sleep(500);
    }
    status.textContent = '去重 + 精准筛选中...';
    progress.style.width = '95%';
    state.allPapers = deduplicate(state.allPapers);
    state.allPapers = relevanceFilter(state.allPapers);
    progress.style.width = '100%';
    status.textContent = '检索完成！共找到 ' + state.allPapers.length + ' 篇论文';
    await sleep(800);
    if (state.allPapers.length > 0) {
        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('analysis-section').classList.remove('hidden');
        document.getElementById('export-section').classList.remove('hidden');
        filterResults();
        generateAnalysis();
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    } else {
        status.textContent = '未找到相关论文，请尝试调整关键词';
    }
    document.getElementById('btn-search').disabled = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ==================== Relevance Filter ====================
function relevanceFilter(papers) {
    var dirLower = state.direction.toLowerCase();
    var coreKeywords = state.keywords.map(function(k) { return k.toLowerCase(); });

    return papers.map(function(p) {
        var score = 0;
        var titleLower = (p.title || '').toLowerCase();
        var abstractLower = (p.abstract || '').toLowerCase();
        var combined = titleLower + ' ' + abstractLower;

        // Title contains direction
        if (titleLower.includes(dirLower) || dirLower.includes(titleLower.split(' ').slice(0, 3).join(' '))) {
            score += 10;
        }

        // Keyword matches
        coreKeywords.forEach(function(kw) {
            if (titleLower.includes(kw)) score += 5;
            if (abstractLower.includes(kw)) score += 2;
        });

        // Citation bonus
        score += Math.min(p.citations / 10, 5);

        // Recency bonus
        if (p.year >= 2024) score += 2;
        else if (p.year >= 2022) score += 1;

        p.relevanceScore = score;
        return p;
    }).filter(function(p) {
        return p.relevanceScore > 0;
    });
}

// ==================== OpenAlex API ====================
async function searchOpenAlex() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 6); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://api.openalex.org/works?search=' + encodeURIComponent(q) + '&per_page=20&sort=cited_by_count:desc';
            var field = document.getElementById('field').value;
            if (field) url += '&filter=concepts.display_name:' + field;
            var yr = document.getElementById('yearRange').value;
            if (yr) {
                var from = new Date().getFullYear() - parseInt(yr);
                url += '&filter=publication_year:>' + from;
            }
            var res = await fetch(url);
            var data = await res.json();
            if (data.results) {
                data.results.forEach(function(p) {
                    var authors = (p.authorships || []).slice(0, 5).map(function(a) { return a.author && a.author.display_name || ''; }).filter(Boolean);
                    var venue = (p.primary_location && p.primary_location.source && p.primary_location.source.display_name) || (p.host_venue && p.host_venue.display_name) || '';
                    papers.push({
                        title: p.title || '',
                        authors: authors,
                        venue: venue,
                        year: p.publication_year || 0,
                        abstract: reconstructAbstract(p.abstract_inverted_index),
                        citations: p.cited_by_count || 0,
                        doi: p.doi || '',
                        url: (p.primary_location && p.primary_location.landing_page_url) || p.doi || '',
                        source: 'OpenAlex',
                        query: q,
                        isOpenAccess: (p.open_access && p.open_access.is_oa) || false
                    });
                });
            }
        } catch (e) { console.error('OpenAlex error:', e); }
        await sleep(300);
    }
    return papers;
}

function reconstructAbstract(invIndex) {
    if (!invIndex) return '';
    var words = [];
    Object.entries(invIndex).forEach(function(entry) {
        var word = entry[0];
        var positions = entry[1];
        positions.forEach(function(pos) { words[pos] = word; });
    });
    return words.join(' ');
}

// ==================== Semantic Scholar API ====================
async function searchSemanticScholar() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 5); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://api.semanticscholar.org/graph/v1/paper/search?query=' + encodeURIComponent(q) + '&limit=20&fields=title,authors,venue,year,abstract,citationCount,externalIds,openAccessPdf';
            var yr = document.getElementById('yearRange').value;
            if (yr) {
                var from = new Date().getFullYear() - parseInt(yr);
                url += '&year=' + from + '-';
            }
            var res = await fetch(url);
            var data = await res.json();
            if (data.data) {
                data.data.forEach(function(p) {
                    papers.push({
                        title: p.title || '',
                        authors: (p.authors || []).slice(0, 5).map(function(a) { return a.name; }),
                        venue: p.venue || '',
                        year: p.year || 0,
                        abstract: p.abstract || '',
                        citations: p.citationCount || 0,
                        doi: (p.externalIds && p.externalIds.DOI) || '',
                        url: (p.openAccessPdf && p.openAccessPdf.url) || ((p.externalIds && p.externalIds.DOI) ? 'https://doi.org/' + p.externalIds.DOI : ''),
                        source: 'Semantic Scholar',
                        query: q,
                        isOpenAccess: !!p.openAccessPdf
                    });
                });
            }
        } catch (e) { console.error('Semantic Scholar error:', e); }
        await sleep(1000);
    }
    return papers;
}

// ==================== arXiv API ====================
async function searchArxiv() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 4); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://export.arxiv.org/api/query?search_query=all:' + encodeURIComponent(q) + '&start=0&max_results=15&sortBy=relevance';
            var res = await fetch(url);
            var text = await res.text();
            var parser = new DOMParser();
            var xml = parser.parseFromString(text, 'text/xml');
            var entries = xml.querySelectorAll('entry');
            entries.forEach(function(entry) {
                var titleEl = entry.querySelector('title');
                var title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
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
                    query: q,
                    isOpenAccess: true
                });
            });
        } catch (e) { console.error('arXiv error:', e); }
        await sleep(500);
    }
    return papers;
}

// ==================== Crossref API ====================
async function searchCrossref() {
    var papers = [];
    for (var qi = 0; qi < Math.min(state.queries.length, 4); qi++) {
        var q = state.queries[qi];
        try {
            var url = 'https://api.crossref.org/works?query=' + encodeURIComponent(q) + '&rows=15&sort=relevance';
            var yr = document.getElementById('yearRange').value;
            if (yr) {
                var from = new Date().getFullYear() - parseInt(yr);
                url += '&filter=from-pub-date:' + from;
            }
            var res = await fetch(url, { headers: { 'User-Agent': 'LiteratureAssistant/1.0 (mailto:research@example.com)' } });
            var data = await res.json();
            if (data.message && data.message.items) {
                data.message.items.forEach(function(p) {
                    var authors = (p.author || []).slice(0, 5).map(function(a) { return (a.given || '') + ' ' + (a.family || ''); }).map(function(s) { return s.trim(); });
                    var venue = (p['container-title'] && p['container-title'][0]) || '';
                    var year = 0;
                    if (p['published-print'] && p['published-print']['date-parts'] && p['published-print']['date-parts'][0]) {
                        year = p['published-print']['date-parts'][0][0] || 0;
                    } else if (p['published-online'] && p['published-online']['date-parts'] && p['published-online']['date-parts'][0]) {
                        year = p['published-online']['date-parts'][0][0] || 0;
                    } else if (p.created && p.created['date-parts'] && p.created['date-parts'][0]) {
                        year = p.created['date-parts'][0][0] || 0;
                    }
                    var title = (p.title && p.title[0]) || '';
                    var abstract = p.abstract || '';
                    // Clean HTML tags from abstract
                    abstract = abstract.replace(/<[^>]*>/g, '').trim();
                    papers.push({
                        title: title,
                        authors: authors,
                        venue: venue,
                        year: year,
                        abstract: abstract,
                        citations: p['is-referenced-by-count'] || 0,
                        doi: p.DOI || '',
                        url: p.URL || (p.DOI ? 'https://doi.org/' + p.DOI : ''),
                        source: 'Crossref',
                        query: q,
                        isOpenAccess: false
                    });
                });
            }
        } catch (e) { console.error('Crossref error:', e); }
        await sleep(500);
    }
    return papers;
}

// ==================== Deduplication ====================
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
                var scoreA = (a.relevanceScore || 0) * 10 + a.citations * 0.4 + (a.year - 2020) * 5 + (a.isOpenAccess ? 3 : 0);
                var scoreB = (b.relevanceScore || 0) * 10 + b.citations * 0.4 + (b.year - 2020) * 5 + (b.isOpenAccess ? 3 : 0);
                return scoreB - scoreA;
            });
            break;
    }
    renderPapers(papers.slice(0, 50));
    document.getElementById('results-count').textContent = '共 ' + papers.length + ' 篇论文（显示前 ' + Math.min(50, papers.length) + ' 篇）';
}

function renderPapers(papers) {
    var list = document.getElementById('paper-list');
    list.innerHTML = papers.map(function(p, i) {
        var authorsStr = p.authors.slice(0, 3).join(', ') + (p.authors.length > 3 ? ' et al.' : '');
        var oaStr = p.isOpenAccess ? '<span style="color:var(--success)">OA</span>' : '';
        var urlStr = p.url ? '<a href="' + p.url + '" target="_blank" onclick="event.stopPropagation()">查看论文</a>' : '';
        var doiStr = p.doi ? '<a href="https://doi.org/' + p.doi + '" target="_blank" onclick="event.stopPropagation()">DOI</a>' : '';
        return '<div class="paper-card" onclick="this.classList.toggle(\'expanded\')">'
            + '<h3>' + (i + 1) + '. ' + escapeHtml(p.title) + '</h3>'
            + '<div class="paper-meta">'
            + '<span>' + escapeHtml(authorsStr) + '</span>'
            + '<span class="badge">' + escapeHtml(p.venue) + '</span>'
            + '<span>' + p.year + '</span>'
            + '<span class="citations">' + p.citations + ' 引用</span>'
            + '<span class="badge">' + p.source + '</span>'
            + (p.relevanceScore ? '<span class="badge" style="background:rgba(72,187,120,.2);color:var(--success)">相关度 ' + Math.round(p.relevanceScore) + '</span>' : '')
            + oaStr
            + '</div>'
            + '<div class="paper-abstract">' + escapeHtml(p.abstract || '无摘要') + '</div>'
            + '<div class="paper-actions">' + urlStr + doiStr + '</div>'
            + '</div>';
    }).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==================== Analysis ====================
function generateAnalysis() {
    var papers = state.filteredPapers.length > 5 ? state.filteredPapers : state.allPapers;
    var totalPapers = papers.length;
    var totalCitations = papers.reduce(function(s, p) { return s + p.citations; }, 0);
    var avgCitations = totalPapers > 0 ? Math.round(totalCitations / totalPapers) : 0;
    var yearCounts = {};
    papers.forEach(function(p) { yearCounts[p.year] = (yearCounts[p.year] || 0) + 1; });
    var years = Object.keys(yearCounts).filter(function(y) { return y > 0; }).sort();
    var maxYear = years.length > 0 ? years[years.length - 1] : 'N/A';
    var venueCounts = {};
    papers.forEach(function(p) { if (p.venue) venueCounts[p.venue] = (venueCounts[p.venue] || 0) + 1; });
    var topVenues = Object.entries(venueCounts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
    var topCited = [...papers].sort(function(a, b) { return b.citations - a.citations; }).slice(0, 5);
    var sourceCounts = {};
    papers.forEach(function(p) { sourceCounts[p.source] = (sourceCounts[p.source] || 0) + 1; });

    document.getElementById('stats-grid').innerHTML = '<div class="stat-card"><div class="num">' + totalPapers + '</div><div class="label">论文总数</div></div>'
        + '<div class="stat-card"><div class="num">' + totalCitations.toLocaleString() + '</div><div class="label">总引用数</div></div>'
        + '<div class="stat-card"><div class="num">' + avgCitations + '</div><div class="label">平均引用</div></div>'
        + '<div class="stat-card"><div class="num">' + maxYear + '</div><div class="label">最新年份</div></div>';

    var trends = [];
    if (years.length >= 2) {
        var recent = yearCounts[maxYear] || 0;
        var prev = yearCounts[String(parseInt(maxYear) - 1)] || 0;
        if (recent > prev) trends.push(maxYear + '年论文数量较前一年增长，研究热度上升');
        else if (recent < prev) trends.push(maxYear + '年论文数量有所下降，可能进入稳定期');
        else trends.push('研究产出保持稳定');
    }
    if (topVenues.length > 0) trends.push('主要发表在 ' + topVenues.map(function(v) { return v[0]; }).slice(0, 3).join('、') + ' 等期刊/会议');
    trends.push('高引论文集中在 "' + state.keywords.slice(0, 2).join('" 和 "') + '" 相关方向');
    if (avgCitations > 20) trends.push('整体引用水平较高（均' + avgCitations + '次），表明研究领域活跃');
    trends.push('共涉及 ' + Object.keys(venueCounts).length + ' 个不同期刊/会议来源');
    var oaCount = papers.filter(function(p) { return p.isOpenAccess; }).length;
    var oaRate = totalPapers > 0 ? Math.round(oaCount / totalPapers * 100) : 0;
    trends.push('开放获取比例 ' + oaRate + '%');
    var sourceStr = Object.entries(sourceCounts).map(function(e) { return e[0] + ': ' + e[1]; }).join(', ');
    trends.push('数据来源分布: ' + sourceStr);

    document.getElementById('trend-list').innerHTML = trends.map(function(t) { return '<li>' + t + '</li>'; }).join('');

    var directions = [];
    directions.push(state.keywords[0] || state.direction + ' 与新兴领域的交叉研究');
    directions.push(state.direction + ' 的实际应用落地研究');
    if (topCited.length > 0) directions.push('基于高引论文 "' + topCited[0].title.substring(0, 30) + '..." 的后续改进');
    directions.push(state.direction + ' 的评估方法与基准测试');
    directions.push(state.keywords.slice(0, 3).join(' + ') + ' 的融合方法探索');

    document.getElementById('direction-list').innerHTML = directions.map(function(d) { return '<li>' + d + '</li>'; }).join('');
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
    lines.push('## 关键词');
    lines.push(state.keywords.join(', '));
    lines.push('');
    lines.push('## 检索策略（共 ' + state.queries.length + ' 个查询）');
    state.queries.forEach(function(q) { lines.push('- ' + q); });
    lines.push('');
    lines.push('## 检索结果概览');
    lines.push('- 总论文数: ' + papers.length);
    lines.push('- 总引用数: ' + papers.reduce(function(s, p) { return s + p.citations; }, 0));
    lines.push('');
    lines.push('## 代表性论文 (' + topPapers.length + ' 篇)');
    lines.push('');
    topPapers.forEach(function(p, i) {
        lines.push('### ' + (i + 1) + '. ' + p.title);
        lines.push('- 作者: ' + p.authors.join(', '));
        lines.push('- 期刊/会议: ' + p.venue);
        lines.push('- 年份: ' + p.year);
        lines.push('- 引用数: ' + p.citations);
        if (p.doi) lines.push('- DOI: ' + p.doi);
        if (p.url) lines.push('- 链接: ' + p.url);
        lines.push('- 摘要: ' + (p.abstract || '无'));
        lines.push('');
    });
    lines.push('## 研究趋势');
    document.querySelectorAll('#trend-list li').forEach(function(li) { lines.push('- ' + li.textContent); });
    lines.push('');
    lines.push('## 推荐研究方向');
    document.querySelectorAll('#direction-list li').forEach(function(li) { lines.push('- ' + li.textContent); });
    lines.push('');
    lines.push('---');
    lines.push('*由 AI 文献调研助手生成*');
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
