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
        
        const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Eureka Core</title>
            <style>
                body { margin: 0; padding: 0; background-color: #0b0b14; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; min-height: 100vh; justify-content: center; overflow-x: hidden; }
                
                /* Menu Hambúrguer Escondido */
                .menu-buger { position: absolute; top: 20px; left: 20px; cursor: pointer; z-index: 10; padding: 10px; }
                .menu-buger div { width: 25px; height: 3px; background-color: #6c5ce7; margin: 5px 0; transition: 0.3s; }
                
                .sidebar { position: fixed; top: 0; left: -280px; width: 280px; height: 100%; background: #0f0f1f; border-right: 1px solid #23233c; transition: 0.3s; z-index: 9; padding-top: 80px; box-sizing: border-box; }
                .sidebar.open { left: 0; box-shadow: 10px 0 30px rgba(0,0,0,0.5); }
                .menu-item { padding: 15px 25px; color: #8f8fa8; cursor: pointer; font-weight: 500; display: flex; align-items: center; transition: 0.2s; border-left: 4px solid transparent; }
                .menu-item:hover, .menu-item.active { background: #1a1a30; color: #fff; border-left-color: #6c5ce7; }

                /* Card Principal */
                .card { background: #131324; padding: 25px; border-radius: 20px; width: 90%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #23233c; text-align: center; box-sizing: border-box; display: block; }
                h1 { color: #6c5ce7; font-size: 2.2rem; margin: 0 0 5px 0; letter-spacing: 3px; }
                .subtitle { color: #8f8fa8; font-size: 0.85rem; margin-bottom: 25px; }
                
                .power-btn { width: 100px; height: 100px; border-radius: 50%; border: none; background: #ff7675; color: white; font-weight: bold; font-size: 1.1rem; cursor: pointer; box-shadow: 0 0 20px rgba(255, 118, 117, 0.4); transition: 0.3s; margin-bottom: 25px; }
                .power-btn.active { background: #00b894; box-shadow: 0 0 20px rgba(0, 184, 148, 0.5); }
                
                .status-box { background: #1a1a30; padding: 12px; border-radius: 12px; font-size: 0.9rem; border-left: 4px solid #ff7675; text-align: left; margin-bottom: 20px; }
                .status-box.active { border-left-color: #00b894; }
                
                .toggle-container { background: #1a1a30; padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; text-align: left; }
                .toggle-label { font-size: 0.95rem; font-weight: 500; }
                .toggle-desc { font-size: 0.75rem; color: #8f8fa8; display: block; margin-top: 2px; }
                
                .switch { position: relative; display: inline-block; width: 46px; height: 24px; min-width: 46px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3f3f5f; transition: .3s; border-radius: 24px; }
                .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
                input:checked + .slider { background-color: #6c5ce7; }
                input:checked + .slider:before { transform: translateX(22px); }
                
                .beta-warning { background: rgba(225, 112, 85, 0.1); border: 1px solid rgba(225, 112, 85, 0.3); padding: 12px; border-radius: 10px; font-size: 0.75rem; color: #fab1a0; text-align: left; line-height: 1.4; margin-top: 15px; display: none; }
                .beta-warning.show { display: block; }

                /* Telas das Abas Ocultas */
                .sub-panel { background: #131324; padding: 25px; border-radius: 20px; width: 90%; max-width: 420px; border: 1px solid #23233c; box-sizing: border-box; display: none; }
                .panel-title { color: #6c5ce7; font-size: 1.5rem; font-weight: bold; margin-bottom: 15px; text-align: center; }
                
                /* Estilos das ferramentas */
                .btn-action { background: #6c5ce7; border: none; color: white; padding: 12px; width: 100%; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 10px; }
                .terminal { background: #000; font-family: monospace; padding: 12px; border-radius: 8px; font-size: 0.8rem; color: #00ff00; height: 100px; overflow-y: auto; text-align: left; margin-top: 15px; }
                .drop-zone { border: 2px dashed #3f3f5f; padding: 30px 10px; border-radius: 10px; text-align: center; color: #8f8fa8; font-size: 0.9rem; }
                .chat-box { background: #1a1a30; height: 180px; overflow-y: auto; border-radius: 10px; padding: 10px; font-size: 0.9rem; text-align: left; display: flex; flex-direction: column; gap: 8px; }
                .msg { padding: 8px 12px; border-radius: 10px; max-width: 80%; }
                .msg.user { background: #6c5ce7; align-self: flex-end; }
                .msg.ia { background: #23233c; align-self: flex-start; color: #a29bfe; }
                .chat-input-container { display: flex; margin-top: 10px; gap: 5px; }
                .chat-input-container input { flex: 1; background: #1a1a30; border: 1px solid #3f3f5f; border-radius: 8px; padding: 10px; color: white; outline: none; }
                .chat-input-container button { background: #6c5ce7; border: none; color: white; padding: 0 15px; border-radius: 8px; cursor: pointer; font-weight: bold; }
            </style>
        </head>
        <body>

            <div class="menu-buger" onclick="toggleMenu()">
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div id="sidebar" class="sidebar">
                <div class="menu-item active" onclick="verTela('home')">🛡️ Conexão Principal</div>
                <div class="menu-item" onclick="verTela('otimizar')">⚡ Otimizador P2P</div>
                <div class="menu-item" onclick="verTela('arquivos')">📁 Processar Arquivos</div>
                <div class="menu-item" onclick="verTela('chat')">🤖 IA Descentralizada</div>
            </div>

            <div id="tela-home" class="card">
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
                    Esta função tenta criar um "mini Wi-Fi" usando o Bluetooth do seu celular. Ela depende 100% da densidade de usuários ao seu redor para funcionar.
                </div>
            </div>

            <div id="tela-otimizar" class="sub-panel">
                <div class="panel-title">⚡ Otimizador de CPU</div>
                <p style="font-size:0.85rem; color:#8f8fa8; text-align:center; margin-top:0;">Descarregue o estresse do seu processador jogando as tarefas na rede Mesh.</p>
                <button class="btn-action" onclick="rodarOtimizador()">Otimizar Aparelho Agora</button>
                <div id="termOtimizar" class="terminal">> Aguardando comando...</div>
            </div>

            <div id="tela-arquivos" class="sub-panel">
                <div class="panel-title">📁 Supercomputador Mesh</div>
                <div class="drop-zone">
                    📥<br>Toque para selecionar arquivo<br>
                    <span style="font-size:0.7rem; color:#636e72;">(Vídeos, Imagens ou Códigos)</span>
                </div>
                <button class="btn-action" onclick="simularProcessamento()">Fragmentar e Processar na Rede</button>
                <div id="termArquivos" class="terminal">> Nenhum arquivo na fila...</div>
            </div>

            <div id="tela-chat" class="sub-panel">
                <div class="panel-title">🤖 Eureka IA (P2P)</div>
                <div id="chatBox" class="chat-box">
                    <div class="msg ia">Olá! Eu sou a IA do Eureka. Minha inteligência está sendo processada de forma dividida pela CPU de todos os nós ativos. Como posso te ajudar hoje?</div>
                </div>
                <div class="chat-input-container">
                    <input type="text" id="chatInput" placeholder="Pergunte algo privado...">
                    <button onclick="enviarMensagem()">></button>
                </div>
            </div>

            <script>
                let ativo = false;

                function toggleMenu() {
                    document.getElementById('sidebar').classList.toggle('open');
                }

                function verTela(idTela) {
                    // Esconde todas as telas
                    document.getElementById('tela-home').style.display = 'none';
                    document.getElementById('tela-otimizar').style.display = 'none';
                    document.getElementById('tela-arquivos').style.display = 'none';
                    document.getElementById('tela-chat').style.display = 'none';
                    
                    // Mostra a tela selecionada
                    document.getElementById('tela-' + idTela).style.display = 'block';
                    
                    // Atualiza classe ativa no menu
                    const items = document.querySelectorAll('.menu-item');
                    items.forEach(item => item.classList.remove('active'));
                    event.currentTarget.classList.add('active');
                    
                    toggleMenu(); // fecha menu
                }

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
                    betaBox.style.display = meshCheck.checked ? 'block' : 'none';
                    atualizarConfig();
                }

                async function atualizarConfig() {
                    const statusRede = ativo ? "Online" : "Offline";
                    const compartilhaCPU = document.getElementById('cpuCheck').checked;
                    const modoMeshPlus = document.getElementById('meshCheck').checked;
                    fetch(\`/atualizar-no?status=\${statusRede}&cpu=\${compartilhaCPU}&mesh=\${modoMeshPlus}\`);
                }

                // Lógica Visual do Otimizador
                function rodarOtimizador() {
                    const term = document.getElementById('termOtimizar');
                    term.innerHTML = "> Analisando processos nativos do celular...<br>";
                    setTimeout(() => { term.innerHTML += "> Encontrado: 4 tarefas pesadas em segundo plano.<br>"; }, 1000);
                    setTimeout(() => { term.innerHTML += "> [MOCK-P2P] Fragmentando processos e distribuindo na rede Eureka...<br>"; }, 2200);
                    setTimeout(() => { term.innerHTML += "> 🎉 SUCESSO: Processadores da malha Mesh resolveram os cálculos! Celular aliviado e otimizado.<br>"; }, 4000);
                }

                // Lógica Visual do Processador de Arquivos
                function simularProcessamento() {
                    const term = document.getElementById('termArquivos');
                    term.innerHTML = "> [!] Simulando Upload: arquivo_usuario.mp4 recebido.<br>";
                    setTimeout(() => { term.innerHTML += "> Criptografando e dividindo em 256 micro-partes...<br>"; }, 1200);
                    setTimeout(() => { term.innerHTML += "> Espalhando fragmentos para nós ativos...<br>"; }, 2500);
                    setTimeout(() => { term.innerHTML += "> 🟢 14 nós processando em paralelo.<br>"; }, 3300);
                    setTimeout(() => { term.innerHTML += "> Processamento concluído! Créditos Mesh computados no Firebase.<br>"; }, 5000);
                }

                // Lógica do Chat de IA
                function enviarMensagem() {
                    const input = document.getElementById('chatInput');
                    const box = document.getElementById('chatBox');
                    if(!input.value.trim()) return;

                    // Mensagem do Usuário
                    box.innerHTML += \`<div class="msg user">\${input.value}</div>\`;
                    const userMsg = input.value;
                    input.value = '';
                    box.scrollTop = box.scrollHeight;

                    // Resposta simulada computada em Rede
                    setTimeout(() => {
                        box.innerHTML += \`<div class="msg ia"><em>[Processando via malha Mesh...]</em></div>\`;
                        box.scrollTop = box.scrollHeight;
                    }, 800);

                    setTimeout(() => {
                        // Remove o indicador de processando
                        const ems = box.getElementsByTagName('em');
                        if (ems.length > 0) ems[ems.length - 1].parentElement.remove();

                        box.innerHTML += \`<div class="msg ia">Recebi sua dúvida: "\${userMsg}". Esta resposta foi quebrada em cálculos matemáticos e processada de forma 100% privada usando 5% da CPU de outros nós da rede Eureka!</div>\`;
                        box.scrollTop = box.scrollHeight;
                    }, 3000);
                }
            </script>
        </body>
        </html>
        `;
        res.end(html);

    } else if (req.url.startsWith('/atualizar-no')) {
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
            res.end(JSON.stringify({ firebase: "Sucesso" }));
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
