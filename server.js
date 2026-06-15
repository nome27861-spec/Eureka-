const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
    if (req.url === '/status') {
        res.end(JSON.stringify({
            nosConectados: 1,
            processamentoGlobal: "0.5 Petaflops",
            status: "Operando em modo economico (Batata Mode)"
        }));
    } else {
        res.end(JSON.stringify({ 
            mensagem: "Conectado ao servidor base do Eureka com sucesso!" 
        }));
    }
});

// O Render exige que o app use a porta que eles enviarem na variavel process.env.PORT
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Servidor Eureka ativo na porta ${PORT}`);
});
