var TopVenue = {
    disciplines: {
        'cv': {
            name: '计算机视觉',
            keywords: ['vision','image','detection','segmentation','recognition','visual','object','图像','视觉','目标检测','语义分割','图像识别','convolutional','cnn'],
            venues: {
                // 缩写 -> 完整名称映射
                'cvpr':{score:100,names:['cvpr','computer vision and pattern recognition','ieee/cvf conference on computer vision']},
                'iccv':{score:95,names:['iccv','international conference on computer vision','ieee/cvf international conference on computer']},
                'eccv':{score:90,names:['eccv','european conference on computer vision']},
                'tpami':{score:95,names:['tpami','transactions on pattern analysis','ieee transactions on pattern analysis']},
                'ijcv':{score:90,names:['ijcv','international journal of computer vision']},
                'wacv':{score:80,names:['wacv','winter conference on applications']}
            }
        },
        'ml': {
            name: '机器学习',
            keywords: ['machine learning','deep learning','neural','reinforcement learning','training','optimization','generative','diffusion','机器学习','深度学习','神经网络','强化学习','梯度'],
            venues: {
                'neurips':{score:100,names:['neurips','nips','neural information processing systems','advances in neural']},
                'icml':{score:100,names:['icml','international conference on machine learning']},
                'iclr':{score:100,names:['iclr','international conference on learning representations']},
                'aaai':{score:95,names:['aaai','proceedings of the aaai','association for the advancement of artificial']},
                'ijcai':{score:90,names:['ijcai','international joint conference on artificial']},
                'aistats':{score:85,names:['aistats','artificial intelligence and statistics']},
                'uai':{score:85,names:['uai','uncertainty in artificial intelligence']},
                'colt':{score:85,names:['colt','conference on learning theory']}
            }
        },
        'nlp': {
            name: '自然语言处理',
            keywords: ['language','nlp','text','translation','sentiment','question answering','summarization','dialogue','chat','自然语言','文本','翻译','问答','摘要','对话','language model','llm','gpt','bert','transformer'],
            venues: {
                'acl':{score:100,names:['acl','association for computational linguistics','findings of the association']},
                'emnlp':{score:95,names:['emnlp','empirical methods in natural language']},
                'naacl':{score:90,names:['naacl','north american chapter of the association']},
                'coling':{score:85,names:['coling','computational linguistics']},
                'tacl':{score:85,names:['tacl','transactions of the association for computational']}
            }
        },
        'dm': {
            name: '数据挖掘',
            keywords: ['data mining','knowledge discovery','recommendation','graph','network embedding','information retrieval','数据挖掘','知识发现','推荐','图神经','信息检索'],
            venues: {
                'kdd':{score:95,names:['kdd','knowledge discovery and data mining','acm sigkdd']},
                'www':{score:90,names:['www','world wide web conference','the web conference']},
                'sigir':{score:90,names:['sigir','research and development in information retrieval']},
                'wsdm':{score:85,names:['wsdm','web search and data mining']},
                'recsys':{score:85,names:['recsys','recommender systems']}
            }
        },
        'robotics': {
            name: '机器人',
            keywords: ['robot','autonomous','navigation','manipulator','control','planning','embodied','机器人','自主','导航','具身'],
            venues: {
                'icra':{score:90,names:['icra','international conference on robotics and automation','robotics and automation']},
                'iros':{score:85,names:['iros','intelligent robots and systems']},
                'rss':{score:90,names:['rss','robotics science and systems']},
                'corl':{score:85,names:['corl','conference on robot learning']}
            }
        },
        'medicine': {
            name: '医学',
            keywords: ['medical','clinical','patient','disease','drug','treatment','diagnosis','health','epidemiology','医学','临床','患者','疾病','药物','治疗','诊断','健康'],
            venues: {
                'lancet':{score:95,names:['lancet','the lancet']},
                'jama':{score:95,names:['jama']},
                'nejm':{score:95,names:['nejm','new england journal of medicine']},
                'bmj':{score:90,names:['bmj','british medical journal']},
                'nature_medicine':{score:90,names:['nature medicine']},
                'cell':{score:90,names:['cell']}
            }
        },
        'physics': {
            name: '物理学',
            keywords: ['physics','quantum','particle','cosmology','gravitation','condensed matter','optics','物理','量子','粒子','凝聚态'],
            venues: {
                'prl':{score:95,names:['prl','physical review letters']},
                'nature_physics':{score:95,names:['nature physics']},
                'science':{score:100,names:['science']},
                'nature':{score:100,names:['nature']}
            }
        },
        'materials': {
            name: '材料科学',
            keywords: ['material','nanomaterial','catalyst','polymer','composite','electrode','battery','supercapacitor','材料','纳米材料','催化剂','电极','电池'],
            venues: {
                'adv_mater':{score:95,names:['advanced materials','adv. mater']},
                'nature_mater':{score:95,names:['nature materials']},
                'nano_letters':{score:90,names:['nano letters']},
                'acs_nano':{score:90,names:['acs nano']},
                'nature_chem':{score:90,names:['nature chemistry']},
                'jacs':{score:90,names:['jacs','journal of the american chemical']}
            }
        },
        'economics': {
            name: '经济学',
            keywords: ['economics','economy','finance','market','trade','monetary','fiscal','经济学','经济','金融','市场'],
            venues: {
                'aer':{score:95,names:['american economic review']},
                'econometrica':{score:95,names:['econometrica']},
                'jpe':{score:90,names:['journal of political economy']},
                'qje':{score:90,names:['quarterly journal of economics']}
            }
        }
    },

    // Match venue from paper's venue string
    matchVenue: function(venueStr) {
        if (!venueStr) return {score:0, isTop:false, shortName:''};
        var low = venueStr.toLowerCase();
        var best = {score:0, isTop:false, shortName:''};
        var self = this;
        Object.keys(this.disciplines).forEach(function(disc) {
            var d = self.disciplines[disc];
            Object.keys(d.venues).forEach(function(key) {
                var v = d.venues[key];
                v.names.forEach(function(name) {
                    if (low.includes(name.toLowerCase())) {
                        if (v.score > best.score) {
                            best = {score:v.score, isTop:v.score>=85, shortName:key.toUpperCase()};
                        }
                    }
                });
            });
        });
        return best;
    },

    detectDisciplines: function(text) {
        var low = (text || '').toLowerCase();
        var scores = {};
        var self = this;
        Object.keys(this.disciplines).forEach(function(disc) {
            var d = self.disciplines[disc];
            var score = 0;
            d.keywords.forEach(function(kw) { if (low.includes(kw.toLowerCase())) score++; });
            if (score > 0) scores[disc] = {score:score, name:d.name, disc:disc};
        });
        return Object.values(scores).sort(function(a,b){return b.score-a.score});
    },

    getVenueQueries: function(disciplines) {
        var queries = [];
        var self = this;
        disciplines.forEach(function(d) {
            var disc = self.disciplines[d.disc];
            if (disc) {
                Object.keys(disc.venues).forEach(function(key) {
                    var v = disc.venues[key];
                    if (v.score >= 85) {
                        // Use the shortest/common name for search
                        queries.push({key:key, name:v.names[0], fullNames:v.names, score:v.score});
                    }
                });
            }
        });
        return queries;
    },

    mark: function(p) {
        var m = this.matchVenue(p.venue);
        p.venueScore = m.score;
        p.isTop = m.isTop;
        p.venueShort = m.shortName;
        return p;
    },

    getBadge: function(p) {
        if (!p.isTop) return '';
        return (p.venueShort || p.venue) + (p.year ? ' '+p.year : '');
    }
};