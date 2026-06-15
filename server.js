const http = require('http');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBSgm4PB9FffpqUVEoNU4QgtCxnWCUUBL4",
  authDomain: "eureka-database-68b47.firebaseapp.com",
  projectId: "eureka-database-68b47",
  storageBucket: "eureka-database-68b47.firebasestorage.app",
  messagingSenderId: "829004419233",
  appId: "1:829004419233:web:620e6ec09b7bf93638a0e0",
  measurementId: "G-2DYC4LBT6H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const server = http.createServer(async (req, res) => {
    if (req.url === '/' || req.url === '') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        
        // Nova Interface Estilo Orbot com Função Plus Experimental
        const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Eureka Core</title>
            <style>
                body { margin: 0; padding: 0; background-color: #0b0b14; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; min-height: 100vh; justify-content: center; }
                .card { background: #131324; padding: 25px; border-radius: 20px; width: 90%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #23233c; text-align: center; box-sizing: border-box; }
                h1 { color: #6c5ce7; font-size: 2.2rem; margin: 0 0 5px 0; letter-spacing: 3px; }
                .subtitle { color: #8f8fa8; font-size: 0.85rem; margin-bottom: 25px; }
                
                .power-btn { width: 100px; height: 100px; border-radius: 50%; border: none; background: #ff7675; color: white; font-weight: bold; font-size: 1.1rem; cursor: pointer; box-shadow: 0 0 20px rgba(255, 118, 117, 0.4); transition: 0.3s; margin-bottom: 25px; }
                .power-btn.active { background: #00b894; box-shadow: 0 0 20px rgba(0, 184, 148, 0.5); }
                
                .status-box { background: #1a1a30; padding: 12px; border-radius: 12px; font-size: 0.9rem; border-left: 4px solid #ff7675; text-align: left; margin-bottom: 20px; }
                .status-box.active { border-left-color: #00b894; }
                
                .toggle-container { background: #1a1a30; padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; text-align: left; }
                .toggle-label { font-size: 0.95rem; font-weight: 500; }
                .toggle-desc { font-size: 0.75rem; color: #8f8fa8; display: block; margin-top: 2px; }
                
                /* Switch Estilizado */
                .switch { position: relative; display: inline-block; width: 46px; height: 24px; min-width: 46px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3f3f5f; transition: .3s; border-radius: 24px; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
                input:checked + .slider { background-color: #6c5ce7; }
                input:checked + .slider:before { transform: translateX(22px); }
                
                /* Caixa de Alerta do Experimento Beta */
                .beta-warning { background: rgba(225, 112, 85, 0.1); border: 1px solid rgba(225, 112, 85, 0.3); padding: 12px; border-radius: 10px; font-size: 0.75rem; color: #fab1a0; text-align: left; line-height: 1.4; margin-top: 15px; display: none; }
                .beta-warning.show { display: block; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>EUREKA</h1>
                <div class="subtitle">Protocolo de Rede Descentralizada</div>
                
                <button id="mainBtn" class="power-btn" onclick="togglePower()">LIGAR</button>
                
                <div id="statusBox" class="status-box">
                    <strong>Status:</strong> <span id="statusTxt">Desconectado</span>
                </div>
                
                <div class="toggle-container">
                    <div>
                        <span class="toggle-label">Compartilhar CPU</span>
                        <span class="toggle-desc">Doe 5% de processamento para a rede.</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="cpuCheck" onchange="atualizarConfig()">
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="toggle-container">
                    <div>
                        <span class="toggle-label">Rede Mesh Offline (PLUS)</span>
                        <span class="toggle-desc">Ativa tentativa de conexão Bluetooth P2P.</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="meshCheck" onchange="toggleBetaWarning()">
                        <span class="slider"></span>
                    </label>
                </div>

                <div id="betaBox" class="beta-warning">
                    ⚠️ <strong>AVISO DE TESTE EXPERIMENTAL:</strong><br>
                    Esta função tenta criar um "mini Wi-Fi" usando o Bluetooth do seu celular para mandar mensagens sem internet. 
                    <strong>Por que pode falhar?</strong> Esta tecnologia depende 100% da densidade de usuários. Se não houver outro celular com o Eureka ativo a menos de 10 metros de você, o sinal não terá para onde pular e a rede falhará. Use como um teste inicial!
                </div>
            </div>

            <script>
                let ativo = false;

                function togglePower() {
                    ativo = !ativo;
                    const btn = document.getElementById('mainBtn');
                    const statusBox = document.getElementById('statusBox');
                    const statusTxt = document.getElementById('statusTxt');
                    
                    if(ativo) {
                        btn.innerText = "LIGADO";
                        btn.classList.add('active');
                        statusBox.classList.add('active');
                        statusTxt.innerText = "Proxy VPN Eureka Ativo";
                    } else {
                        btn.innerText = "LIGAR";
                        btn.classList.remove('active');
                        statusBox.classList.remove('active');
                        statusTxt.innerText = "Desconectado";
                    }
                    atualizarConfig();
                }

                function toggleBetaWarning() {
                    const meshCheck = document.getElementById('meshCheck');
                    const betaBox = document.getElementById('betaBox');
                    if(meshCheck.checked) {
                        betaBox.classList.add('show');
                    } else {
                        betaBox.classList.remove('show');
                    }
                    atualizarConfig();
                }

                // Envia as escolhas do usuário em tempo real para o seu Firebase
                async function atualizarConfig() {
                    const statusRede = ativo ? "Online" : "Offline";
                    const compartilhaCPU = document.getElementById('cpuCheck').checked;
                    const modoMeshPlus = document.getElementById('meshCheck').checked;

                    // Envia para a rota de atualização do servidor
                    fetch(\`/atualizar-no?status=\${statusRede}&cpu=\${compartilhaCPU}&mesh=\${modoMeshPlus}\`);
                }
            </script>
        </body>
        </html>
        `;
        res.end(html);

    } else if (req.url.startsWith('/atualizar-no')) {
        // Rota interna que salva os dados e as chaves ligadas direto no Firebase
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const status = urlParams.searchParams.get('status');
        const cpu = urlParams.searchParams.get('cpu');
        const mesh = urlParams.searchParams.get('mesh');

        res.writeHead(200, { 'Content-Type': 'application/json' });

        try {
            await setDoc(doc(db, "rede", "no_usuario_teste"), {
                statusDispositivo: status,
                doandoCPU: cpu === 'true',
                meshPlusAtivo: mesh === 'true',
                ultimaInteracao: new Date().toISOString()
            });
            res.end(JSON.stringify({ firebase: "Configuração do nó salva com sucesso!" }));
        } catch (e) {
            res.end(JSON.stringify({ erro: e.message }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Servidor Eureka rodando na porta ${PORT}`);
});
