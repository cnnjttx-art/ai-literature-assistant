// translator.js - Academic term translation and keyword expansion
var Translator = {
    dict: {
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
        '人类反馈强化学习': ['RLHF']
    },

    _reverse: null,
    getReverse: function() {
        if (this._reverse) return this._reverse;
        this._reverse = {};
        var self = this;
        Object.keys(self.dict).forEach(function(cn) {
            self.dict[cn].forEach(function(en) {
                var key = en.toLowerCase();
                if (!self._reverse[key]) self._reverse[key] = [];
                self._reverse[key].push(cn);
            });
        });
        return this._reverse;
    },

    detectLanguage: function(text) {
        var cn = (text.match(/[\u4e00-\u9fff]/g) || []).length;
        var total = text.replace(/\s/g, '').length;
        return total === 0 ? 'en' : (cn / total > 0.3 ? 'cn' : 'en');
    },

    cnToEn: function(text) {
        var results = [];
        Object.keys(this.dict).sort(function(a, b) { return b.length - a.length; }).forEach(function(cn) {
            if (text.includes(cn)) {
                Translator.dict[cn].forEach(function(en) {
                    if (results.indexOf(en) === -1) results.push(en);
                });
            }
        });
        return results.length > 0 ? results : [text];
    },

    enToCn: function(text) {
        var results = [];
        var lower = text.toLowerCase();
        var rev = this.getReverse();
        Object.keys(rev).forEach(function(key) {
            if (lower.includes(key)) {
                rev[key].forEach(function(cn) {
                    if (results.indexOf(cn) === -1) results.push(cn);
                });
            }
        });
        return results.length > 0 ? results : [text];
    },

    // Get all variants (original + translations) for a keyword
    getVariants: function(keyword) {
        var lang = this.detectLanguage(keyword);
        var variants = new Set();
        variants.add(keyword);
        if (lang === 'cn') {
            this.cnToEn(keyword).forEach(function(t) { variants.add(t); });
        } else {
            this.enToCn(keyword).forEach(function(t) { variants.add(t); });
        }
        return Array.from(variants);
    }
};
