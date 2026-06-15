const http = require('http');

let redeEureka = {
    nosConectados: 1,
    processamentoGlobal: "0.5 Petaflops",
    status: "Operando em modo econômico (Batata Mode)"
};

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/status') {
        res.writeHead(200);
        res.end(JSON.stringify(redeEureka));
    } else {
        res.writeHead(200);
        res.end(JSON.stringify({ mensagem: "Conectado ao servidor base do Eureka!" }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Simulador Eureka rodando na porta ${PORT}`);
});
