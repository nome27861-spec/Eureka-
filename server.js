const http = require('http');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Suas chaves do Firebase salvas
const firebaseConfig = {
  apiKey: "AIzaSyBSgm4PB9FffpqUVEoNU4QgtCxnWCUUBL4",
  authDomain: "eureka-database-68b47.firebaseapp.com",
  projectId: "eureka-database-68b47",
  storageBucket: "eureka-database-68b47.firebasestorage.app",
  messagingSenderId: "829004419233",
  appId: "1:829004419233:web:620e6ec09b7bf93638a0e0",
  measurementId: "G-2DYC4LBT6H"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const server = http.createServer(async (req, res) => {
    // Configura os cabeçalhos para aceitar conexões de qualquer lugar (CORS)
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    
    if (req.url === '/status') {
        try {
            // Envia os dados direto para o seu banco de dados Firebase
            await setDoc(doc(db, "rede", "status_global"), {
                nosConectados: 1,
                processamentoGlobal: "0.5 Petaflops",
                status: "Operando em modo economico (Batata Mode)",
                ultimaConexao: new Date().toISOString()
            });

            res.end(JSON.stringify({
                status_servidor: "Online",
                firebase: "Dados gravados no Cloud Firestore com sucesso!",
                projeto: "Eureka"
            }));
        } catch (erro) {
            res.end(JSON.stringify({ 
                status_servidor: "Online",
                firebase: "Erro ao salvar no banco: " + erro.message 
            }));
        }
    } else {
        res.end(JSON.stringify({ 
            mensagem: "Bem-vindo a rede Eureka! Acesse o link adicionando /status no final para testar o Firebase." 
        }));
    }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT}`);
});
