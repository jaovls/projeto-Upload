// npm install express
// npm install ejs
// npm install nodemon

const express = require("express");
const path = require("path");
const mysql2 = require("mysql2/promise");
const multer = require("multer");
const WordExtractor = require("word-extractor");
const { error } = require("console");
const IA = require("./IA");

const app = express(); // <-- DECLARADO ANTES DE USAR

// Configurações do Express
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "mvc/views")); // Corrija para sua pasta
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuração do Word Extractor e Multer
const extractor = new WordExtractor();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const timestamp = Date.now(); // Corrigido: era "Data.now()"
        cb(null, `${baseName}-${timestamp}${ext}`); // Corrigido: `${ext}` já inclui o ponto
    }
});
const upload = multer({ storage });

// Rotas
app.get('/', async (req, res) => {
    res.render('index', { chat: '' });
});

app.post('/', upload.single('doc'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    const filePath = path.join(__dirname, req.file.path);

    extractor.extract(filePath)
        .then(async doc => {
            let saida = await IA.executar(doc.getBody());
            let chatComBold = saida.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            res.render('index', { chat: chatComBold });
        })
        .catch(err => {
            console.error('Erro ao extrair o documento:', err);
            res.render('index', { chat: 'Erro ao extrair o documento! :(' });
        });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log("Aplicação no ar em http://localhost:3000");
});
