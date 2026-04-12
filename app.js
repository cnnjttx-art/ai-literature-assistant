// ==================== State ====================
let state = {
    direction: '',
    keywords: [],
    queries: [],
    allPapers: [],
    filteredPapers: [],
    strategies: ['top-venue', 'high-cite', 'recent']
};

// ==================== Strategy Tags ====================
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        state.strategies = [...document.querySelectorAll('.tag.active')].map(t => t.dataset.val);
    });
});

// ==================== Generate Queries ====================
function generateQueries() {
    const dir = document.getElementById('direction').value.trim();
    const kw = document.getElementById('keywords').value.trim();
    if (!dir || !kw) {
        alert('请填写研究方向和关键词');
        return;
    }
    state.direction = dir;
    state.keywords = kw.split(/[,，]/).map(k => k.trim()).filter(Boolean);
    const queries = new Set();
    queries.add(state.direction);
    for (let i = 0; i < state.keywords.length; i++) {
        queries.add(state.keywords[i]);
        for (let j = i + 1; j < state.keywords.length; j++) {
            queries.add(state.keywords[i] + ' ' + state.keywords[j]);
        }
    }
    state.keywords.forEach(k => {
        queries.add(state.direction + ' ' + k);
    });
    state.queries = [...queries].slice(0, 8);
    const list = document.getElementById('query-list');
    list.innerHTML = state.queries.map(q => '<span class="query-chip">' + escapeHtml(q) + '</span>').join('');
    document.getElementById('query-section').classList.remove('hidden');
    document.getElementById('query-section').scrollIntoView({ behavior: 'smooth' });
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
    const progress = document.getElementById('progress-fill');
    const status = document.getElementById('search-status');
    const sources = [
        { name: 'OpenAlex', fn: searchOpenAlex, weight: 40 },
        { name: 'Semantic Scholar', fn: searchSemanticScholar, weight: 35 },
        { name: 'arXiv', fn: searchArxiv, weight: 25 }
    ];
    let totalProgress = 0;
    for (const source of sources) {
        status.textContent = '正在检索 ' + source.name + '...';
        try {
            const papers = await source.fn();
            state.allPapers.push(...papers);
            status.textContent = source.name + ': 找到 ' + papers.length + ' 篇';
        } catch (e) {
            status.textContent = source.name + ': 检索失败 (' + e.message + ')';
        }
        totalProgress += source.weight;
        progress.style.width = totalProgress + '%';
        await sleep(500);
    }
    status.textContent = '去重处理中...';
    progress.style.width = '95%';
    state.allPapers = deduplicate(state.allPapers);
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

// ==================== OpenAlex API ====================
async function searchOpenAlex() {
    const papers = [];
    for (const q of state.queries.slice(0, 4)) {
        try {
            let url = 'https://api.openalex.org/works?search=' + encodeURIComponent(q) + '&per_page=25&sort=cited_by_count:desc';
            const field = document.getElementById('field').value;
            if (field) url += '&filter=concepts.display_name:' + field;
            const yr = document.getElementById('yearRange').value;
            if (yr) {
                const from = new Date().getFullYear() - parseInt(yr);
                url += '&filter=publication_year:>' + from;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (data.results) {
                data.results.forEach(p => {
                    const authors = (p.authorships || []).slice(0, 5).map(a => a.author && a.author.display_name || '').filter(Boolean);
                    const venue = (p.primary_location && p.primary_location.source && p.primary_location.source.display_name) || (p.host_venue && p.host_venue.display_name) || '';
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
                        isOpenAccess: p.open_access && p.open_access.is_oa || false
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
    const words = [];
    for (const [word, positions] of Object.entries(invIndex)) {
        positions.forEach(pos => words[pos] = word);
    }
    return words.join(' ');
}

// ==================== Semantic Scholar API ====================
async function searchSemanticScholar() {
    const papers = [];
    for (const q of state.queries.slice(0, 4)) {
        try {
            let url = 'https://api.semanticscholar.org/graph/v1/paper/search?query=' + encodeURIComponent(q) + '&limit=25&fields=title,authors,venue,year,abstract,citationCount,externalIds,openAccessPdf';
            const yr = document.getElementById('yearRange').value;
            if (yr) {
                const from = new Date().getFullYear() - parseInt(yr);
                url += '&year=' + from + '-';
            }
            const res = await fetch(url);
            const data = await res.json();
            if (data.data) {
                data.data.forEach(p => {
                    papers.push({
                        title: p.title || '',
                        authors: (p.authors || []).slice(0, 5).map(a => a.name),
                        venue: p.venue || '',
                        year: p.year || 0,
                        abstract: p.abstract || '',
                        citations: p.citationCount || 0,
                        doi: p.externalIds && p.externalIds.DOI || '',
                        url: (p.openAccessPdf && p.openAccessPdf.url) || (p.externalIds && p.externalIds.DOI ? 'https://doi.org/' + p.externalIds.DOI : ''),
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
    const papers = [];
    for (const q of state.queries.slice(0, 3)) {
        try {
            const url = 'https://export.arxiv.org/api/query?search_query=all:' + encodeURIComponent(q) + '&start=0&max_results=20&sortBy=relevance';
            const res = await fetch(url);
            const text = await res.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');
            const entries = xml.querySelectorAll('entry');
            entries.forEach(entry => {
                const titleEl = entry.querySelector('title');
                const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
                const authors = Array.from(entry.querySelectorAll('author name')).map(a => a.textContent).slice(0, 5);
                const summaryEl = entry.querySelector('summary');
                const summary = summaryEl ? summaryEl.textContent.replace(/\s+/g, ' ').trim() : '';
                const publishedEl = entry.querySelector('published');
                const published = publishedEl ? publishedEl.textContent : '';
                const year = parseInt(published.substring(0, 4)) || 0;
                const linkEl = entry.querySelector('link[rel="alternate"]');
                const link = linkEl ? linkEl.getAttribute('href') : '';
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

// ==================== Deduplication ====================
function deduplicate(papers) {
    const seen = new Set();
    return papers.filter(p => {
        const key = p.doi || p.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 80);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ==================== Filter & Sort ====================
function filterResults() {
    let papers = [...state.allPapers];
    const minCite = parseInt(document.getElementById('cite-filter').value);
    document.getElementById('cite-label').textContent = minCite;
    papers = papers.filter(p => p.citations >= minCite);
    const yearThreshold = parseInt(document.getElementById('year-filter').value);
    if (yearThreshold > 0) {
        papers = papers.filter(p => p.year >= yearThreshold);
    }
    state.filteredPapers = papers;
    sortResults();
}

function sortResults() {
    const sortBy = document.getElementById('sort-by').value;
    const papers = [...state.filteredPapers];
    switch (sortBy) {
        case 'citations':
            papers.sort((a, b) => b.citations - a.citations);
            break;
        case 'year':
            papers.sort((a, b) => b.year - a.year);
            break;
        case 'relevance':
            papers.sort((a, b) => {
                const scoreA = a.citations * 0.4 + (a.year - 2020) * 10 + (a.isOpenAccess ? 5 : 0);
                const scoreB = b.citations * 0.4 + (b.year - 2020) * 10 + (b.isOpenAccess ? 5 : 0);
                return scoreB - scoreA;
            });
            break;
    }
    renderPapers(papers.slice(0, 50));
    document.getElementById('results-count').textContent = '共 ' + papers.length + ' 篇论文（显示前 ' + Math.min(50, papers.length) + ' 篇）';
}

function renderPapers(papers) {
    const list = document.getElementById('paper-list');
    list.innerHTML = papers.map((p, i) => {
        const authorsStr = p.authors.slice(0, 3).join(', ') + (p.authors.length > 3 ? ' et al.' : '');
        const oaStr = p.isOpenAccess ? '<span style="color:var(--success)">OA</span>' : '';
        const urlStr = p.url ? '<a href="' + p.url + '" target="_blank" onclick="event.stopPropagation()">查看论文</a>' : '';
        const doiStr = p.doi ? '<a href="https://doi.org/' + p.doi + '" target="_blank" onclick="event.stopPropagation()">DOI</a>' : '';
        return '<div class="paper-card" onclick="this.classList.toggle(\'expanded\')">'
            + '<h3>' + (i + 1) + '. ' + escapeHtml(p.title) + '</h3>'
            + '<div class="paper-meta">'
            + '<span>' + escapeHtml(authorsStr) + '</span>'
            + '<span class="badge">' + escapeHtml(p.venue) + '</span>'
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

function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==================== Analysis ====================
function generateAnalysis() {
    const papers = state.filteredPapers.length > 5 ? state.filteredPapers : state.allPapers;
    const totalPapers = papers.length;
    const totalCitations = papers.reduce((s, p) => s + p.citations, 0);
    const avgCitations = totalPapers > 0 ? Math.round(totalCitations / totalPapers) : 0;
    const yearCounts = {};
    papers.forEach(p => { yearCounts[p.year] = (yearCounts[p.year] || 0) + 1; });
    const years = Object.keys(yearCounts).filter(y => y > 0).sort();
    const maxYear = years.length > 0 ? years[years.length - 1] : 'N/A';
    const venueCounts = {};
    papers.forEach(p => { if (p.venue) venueCounts[p.venue] = (venueCounts[p.venue] || 0) + 1; });
    const topVenues = Object.entries(venueCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topCited = [...papers].sort((a, b) => b.citations - a.citations).slice(0, 5);

    document.getElementById('stats-grid').innerHTML = '<div class="stat-card"><div class="num">' + totalPapers + '</div><div class="label">论文总数</div></div>'
        + '<div class="stat-card"><div class="num">' + totalCitations.toLocaleString() + '</div><div class="label">总引用数</div></div>'
        + '<div class="stat-card"><div class="num">' + avgCitations + '</div><div class="label">平均引用</div></div>'
        + '<div class="stat-card"><div class="num">' + maxYear + '</div><div class="label">最新年份</div></div>';

    const trends = [];
    if (years.length >= 2) {
        const recent = yearCounts[maxYear] || 0;
        const prev = yearCounts[String(parseInt(maxYear) - 1)] || 0;
        if (recent > prev) trends.push(maxYear + '年论文数量较前一年增长，研究热度上升');
        else if (recent < prev) trends.push(maxYear + '年论文数量有所下降，可能进入稳定期');
        else trends.push('研究产出保持稳定');
    }
    if (topVenues.length > 0) trends.push('主要发表在 ' + topVenues.map(v => v[0]).slice(0, 3).join('、') + ' 等期刊/会议');
    trends.push('高引论文集中在 "' + state.keywords.slice(0, 2).join('" 和 "') + '" 相关方向');
    if (avgCitations > 20) trends.push('整体引用水平较高（均' + avgCitations + '次），表明研究领域活跃');
    trends.push('共涉及 ' + Object.keys(venueCounts).length + ' 个不同期刊/会议来源');
    const oaCount = papers.filter(p => p.isOpenAccess).length;
    const oaRate = totalPapers > 0 ? Math.round(oaCount / totalPapers * 100) : 0;
    trends.push('开放获取比例 ' + oaRate + '%');

    document.getElementById('trend-list').innerHTML = trends.map(t => '<li>' + t + '</li>').join('');

    const directions = [];
    directions.push(state.keywords[0] || state.direction + ' 与新兴领域的交叉研究');
    directions.push(state.direction + ' 的实际应用落地研究');
    if (topCited.length > 0) directions.push('基于高引论文 "' + topCited[0].title.substring(0, 30) + '..." 的后续改进');
    directions.push(state.direction + ' 的评估方法与基准测试');
    directions.push(state.keywords.join(' + ') + ' 的融合方法探索');

    document.getElementById('direction-list').innerHTML = directions.map(d => '<li>' + d + '</li>').join('');
}

// ==================== Export ====================
function exportReport() {
    const papers = state.filteredPapers.length > 0 ? state.filteredPapers : state.allPapers;
    const topPapers = [...papers].sort((a, b) => b.citations - a.citations).slice(0, 15);
    var lines = [];
    lines.push('# 文献调研报告');
    lines.push('');
    lines.push('## 研究方向');
    lines.push(state.direction);
    lines.push('');
    lines.push('## 关键词');
    lines.push(state.keywords.join(', '));
    lines.push('');
    lines.push('## 检索策略');
    state.queries.forEach(q => lines.push('- ' + q));
    lines.push('');
    lines.push('## 检索结果概览');
    lines.push('- 总论文数: ' + papers.length);
    lines.push('- 总引用数: ' + papers.reduce((s, p) => s + p.citations, 0));
    lines.push('');
    lines.push('## 代表性论文 (' + topPapers.length + ' 篇)');
    lines.push('');
    topPapers.forEach((p, i) => {
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
    document.querySelectorAll('#trend-list li').forEach(li => lines.push('- ' + li.textContent));
    lines.push('');
    lines.push('## 推荐研究方向');
    document.querySelectorAll('#direction-list li').forEach(li => lines.push('- ' + li.textContent));
    lines.push('');
    lines.push('---');
    lines.push('*由 AI 文献调研助手生成*');
    downloadFile(lines.join('\n'), '文献调研报告.md', 'text/markdown');
}

function exportJSON() {
    const papers = state.filteredPapers.length > 0 ? state.filteredPapers : state.allPapers;
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
