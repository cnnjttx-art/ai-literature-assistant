// 跨学科顶刊顶会数据库
var TopVenue = {
    // 学科 -> 顶刊映射
    disciplines: {
        'cv': {
            name: '计算机视觉',
            keywords: ['vision','image','detection','segmentation','recognition','visual','object detection','图像','视觉','目标检测','语义分割','图像识别'],
            venues: {
                'cvpr':100,'computer vision and pattern recognition':100,
                'iccv':95,'international conference on computer vision':95,
                'eccv':90,'european conference on computer vision':90,
                'tpami':95,'transactions on pattern analysis':95,
                'ijcv':90,'international journal of computer vision':90
            }
        },
        'ml': {
            name: '机器学习',
            keywords: ['machine learning','deep learning','neural network','reinforcement learning','training','optimization','generative','diffusion','机器学习','深度学习','神经网络','强化学习','训练','优化','生成','扩散'],
            venues: {
                'neurips':100,'neural information processing systems':100,
                'icml':100,'international conference on machine learning':100,
                'iclr':100,'international conference on learning representations':100,
                'aaai':95,'ijcai':90,'aistats':85,'uai':85,'colt':85
            }
        },
        'nlp': {
            name: '自然语言处理',
            keywords: ['language','nlp','text','translation','sentiment','question answering','summarization','dialogue','chat','自然语言','文本','翻译','情感','问答','摘要','对话','语言模型'],
            venues: {
                'acl':100,'association for computational linguistics':100,
                'emnlp':95,'empirical methods in natural language processing':95,
                'naacl':90,'north american chapter':90,
                'coling':85,'computational linguistics':85
            }
        },
        'dm': {
            name: '数据挖掘',
            keywords: ['data mining','knowledge discovery','recommendation','graph','network embedding','information retrieval','数据挖掘','知识发现','推荐','图','网络嵌入','信息检索'],
            venues: {
                'kdd':95,'knowledge discovery and data mining':95,
                'www':90,'world wide web':90,
                'sigir':90,'information retrieval':90,
                'wsdm':85,'recsys':85,'icde':85,'vldb':85,'sigmod':85
            }
        },
        'robotics': {
            name: '机器人',
            keywords: ['robot','autonomous','navigation','manipulator','control','planning','embodied','机器人','自主','导航','机械臂','控制','规划','具身'],
            venues: {
                'icra':90,'robotics and automation':90,
                'iros':85,'intelligent robots and systems':85,
                'rss':90,'robotics science and systems':90,
                'corl':85,'conference on robot learning':85
            }
        },
        'medicine': {
            name: '医学',
            keywords: ['medical','clinical','patient','disease','drug','treatment','diagnosis','health','epidemiology','医学','临床','患者','疾病','药物','治疗','诊断','健康','流行病'],
            venues: {
                'lancet':95,'jama':95,'nejm':95,'new england journal':95,
                'bmj':90,'nature medicine':90,'nature medicine':90,
                'cell':90,'plos medicine':85
            }
        },
        'physics': {
            name: '物理学',
            keywords: ['physics','quantum','particle','cosmology','gravitation','condensed matter','optics','物理','量子','粒子','宇宙','引力','凝聚态','光学'],
            venues: {
                'physical review letters':95,'prl':95,
                'nature physics':95,'science':100,'nature':100,
                'reviews of modern physics':90,'physics reports':85
            }
        },
        'materials': {
            name: '材料科学',
            keywords: ['material','nanomaterial','catalyst','polymer','composite','electrode','battery','supercapacitor','material','材料','纳米材料','催化剂','聚合物','复合材料','电极','电池','超级电容器'],
            venues: {
                'advanced materials':95,'nature materials':95,
                'nano letters':90,'acs nano':90,
                'advanced functional materials':85,'chemistry of materials':85,
                'nature chemistry':90,'jacs':90,'angewandte':85
            }
        },
        'economics': {
            name: '经济学',
            keywords: ['economics','economy','finance','market','trade','monetary','fiscal','economic','经济学','经济','金融','市场','贸易','货币','财政'],
            venues: {
                'american economic review':95,'econometrica':95,
                'journal of political economy':90,'quarterly journal of economics':90,
                'review of economic studies':90,'journal of finance':90
            }
        },
        'management': {
            name: '管理学',
            keywords: ['management','strategy','organization','leadership','marketing','entrepreneurship','管理','战略','组织','领导','营销','创业'],
            venues: {
                'academy of management journal':95,'strategic management journal':95,
                'management science':90,'administrative science quarterly':90,
                'journal of marketing':90,'organization science':85
            }
        },
        'psychology': {
            name: '心理学',
            keywords: ['psychology','cognitive','behavioral','neuroscience','mental','consciousness','心理学','认知','行为','神经科学','心理','意识'],
            venues: {
                'psychological review':95,'psychological science':90,
                'journal of experimental psychology':85,
                'nature neuroscience':90,'neuron':85
            }
        }
    },

    // Flat venue score map (built from all disciplines)
    _venueMap: null,
    getVenueMap: function() {
        if (this._venueMap) return this._venueMap;
        this._venueMap = {};
        var self = this;
        Object.keys(this.disciplines).forEach(function(disc) {
            Object.keys(self.disciplines[disc].venues).forEach(function(v) {
                var score = self.disciplines[disc].venues[v];
                if (!self._venueMap[v] || self._venueMap[v] < score) {
                    self._venueMap[v] = score;
                }
            });
        });
        return this._venueMap;
    },

    // Detect discipline from text
    detectDisciplines: function(text) {
        var low = (text || '').toLowerCase();
        var scores = {};
        var self = this;
        Object.keys(this.disciplines).forEach(function(disc) {
            var d = self.disciplines[disc];
            var score = 0;
            d.keywords.forEach(function(kw) {
                if (low.includes(kw.toLowerCase())) score++;
            });
            if (score > 0) scores[disc] = {score: score, name: d.name, disc: disc};
        });
        // Sort by score
        return Object.values(scores).sort(function(a, b) { return b.score - a.score; });
    },

    // Get venue names for detected disciplines
    getTopVenuesForDisciplines: function(disciplines) {
        var venues = [];
        var self = this;
        disciplines.forEach(function(d) {
            var disc = self.disciplines[d.disc];
            if (disc) {
                Object.keys(disc.venues).forEach(function(v) {
                    if (disc.venues[v] >= 85) venues.push(v);
                });
            }
        });
        return Array.from(new Set(venues));
    },

    getScore: function(venue) {
        if (!venue) return 0;
        var low = venue.toLowerCase();
        var map = this.getVenueMap();
        var best = 0;
        Object.keys(map).forEach(function(k) { if (low.includes(k)) best = Math.max(best, map[k]); });
        return best;
    },

    isTop: function(venue) { return this.getScore(venue) >= 85; },

    mark: function(p) {
        p.venueScore = this.getScore(p.venue);
        p.isTop = this.isTop(p.venue);
        p.disciplines = [];
        if (p.venue) {
            var self = this;
            Object.keys(this.disciplines).forEach(function(disc) {
                Object.keys(self.disciplines[disc].venues).forEach(function(v) {
                    if (p.venue.toLowerCase().includes(v)) p.disciplines.push(disc);
                });
            });
        }
        return p;
    },

    // Get venue badge text
    getBadge: function(p) {
        if (!p.isTop || !p.venue) return '';
        return p.venue + (p.year ? ' ' + p.year : '');
    }
};