const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// O limite de 50mb é necessário porque as imagens convertidas em Base64 podem ser grandes
app.use(express.json({ limit: '50mb' })); 

// Serve o teu HTML, CSS e JS contidos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'data.json');

// Rota GET: Envia os dados salvos para o Frontend
app.get('/api/data', (req, res) => {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, 'utf8');
        res.json(JSON.parse(data));
    } else {
        // Retorna um objeto vazio caso o ficheiro não exista na primeira inicialização
        res.json({}); 
    }
});

// Rota POST: Recebe as atualizações do Frontend e guarda no ficheiro json
app.post('/api/data', (req, res) => {
    const data = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT} (http://localhost:${PORT})`);
});