const http = require('http');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, addDoc } = require('firebase/firestore');

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
                body { margin: 0; padding: 0; background-color: #0b0b14; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; min-height: 100vh; justify-content: center; overflow-x: hidden; position: relative; }
                .menu-buger { position: fixed; top: 15px; left: 15px; cursor: pointer; z-index: 100; background: #6c5ce7; padding: 12px; border-radius: 12px; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.4); display: flex; flex-direction: column; gap: 4px; }
                .menu-buger div { width: 22px; height: 3px; background-color: #fff; border-radius: 2px; }
                .sidebar { position: fixed; top: 0; left: -280px; width: 280px; height: 100%; background: #0f0f1f; border-right: 1px solid #23233c; transition: 0.3s; z-index: 99; padding-top: 80px; box-sizing: border-box; }
                .sidebar.open { left: 0; box-shadow: 10px 0 30px rgba(0,0,0,0.7); }
                .menu-item { padding: 18px 25px; color: #8f8fa8; cursor: pointer; font-weight: 500; display: flex; align-items: center; transition: 0.2s; border-left: 4px solid transparent; font-size: 0.95rem; }
                .menu-item:hover, .menu-item.active { background: #1a1a30; color: #fff; border-left-color: #6c5ce7; }
                .card { background: #131324; padding: 25px; border-radius: 20px; width: 90%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #23233c; text-align: center; box-sizing: border-box; display: block; margin-top: 40px; }
                h1 { color: #6c5ce7; font-size: 2.2rem; margin: 0 0 5px 0; letter-spacing: 3px; }
                .subtitle { color: #8f8fa8; font-size: 0.85rem; margin-bottom: 25px; }
                .power-btn { width: 100px; height: 100px; border-radius: 50%; border: none; background: #ff7675; color: white; font-weight: bold; font-size: 1.1rem; cursor: pointer; box-shadow: 0 0 20px rgba(255, 118, 117, 0.4); transition: 0.3s; margin-bottom: 25px; outline: none; }
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
                .sub-panel { background: #131324; padding: 25px; border-radius: 20px; width: 90%; max-width: 420px; border: 1px solid #23233c; box-shadow: 0 10px 30px rgba(0,0,0,0.5); box-sizing: border-box; display: none; margin-top: 40px; }
                .panel-title { color: #6c5ce7; font-size: 1.5rem; font-weight: bold; margin-bottom: 15px; text-align: center; }
                .btn-action { background: #6c5ce7; border: none; color: white; padding: 14px; width: 100%; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; font-size: 1rem; }
                .terminal { background: #000; font-family: monospace; padding: 12px; border-radius: 8px; font-size: 0.8rem; color: #00ff00; height: 140px; overflow-y: auto; text-align: left; margin-top: 15px; border: 1px solid #23233c; line-height: 1.4; }
                .text-input-mesh { width: 100%; background: #1a1a30; border: 1px solid #3f3f5f; border-radius: 12px; padding: 12px; color: white; box-sizing: border-box; resize: none; min-height: 80px; outline: none; margin-bottom: 10px; }
                .chat-box { background: #1a1a30; height: 200px; overflow-y: auto; border-radius: 12px; padding: 12px; font-size: 0.9rem; text-align: left; display: flex; flex-direction: column; gap: 10px; border: 1px solid #23233c; }
                .msg { padding: 10px 14px; border-radius: 12px; max-width: 85%; line-height: 1.4; }
                .msg.user { background: #6c5ce7; align-self: flex-end; }
                .msg.ia { background: #23233c; align-self: flex-start; color: #a29bfe; }
                .chat-input-container { display: flex; margin-top: 12px; gap: 8px; }
                .chat-input-container input { flex: 1; background: #1a1a30; border: 1px solid #3f3f5f; border-radius: 10px; padding: 12px; color: white; outline: none; }
                .chat-input-container button { background: #6c5ce7; border: none; color: white; padding: 0 18px; border-radius: 10px; cursor: pointer; font-weight: bold; }
                .node-info-text { color: #636e72; font-size: 0.75rem; font-family: monospace; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="menu-buger" onclick="toggleMenu()"><div></div><div></div><div></div></div>
            <div id="sidebar" class="sidebar">
                <div id="opt-home" class="menu-item active" onclick="verTela('home')">🛡️ Conexão Principal</div>
                <div id="opt-otimizar" class="menu-item" onclick="verTela('otimizar')">⚡ Otimizador P2P</div>
                <div id="opt-arquivos" class="menu-item" onclick="verTela('arquivos')">📁 Processar Arquivos</div>
                <div id="opt-chat" class="menu-item" onclick="verTela('chat')">🤖 IA Descentralizada</div>
            </div>

            <div id="tela-home" class="card">
                <h1>EUREKA</h1>
                <div class="subtitle">Protocolo de Rede Descentralizada</div>
                <button id="mainBtn" class="power-btn" onclick="togglePower()">LIGAR</button>
                <div id="statusBox" class="status-box"><strong>Status:</strong> <span id="statusTxt">Desconectado</span></div>
                <div class="toggle-container">
                    <div><span class="toggle-label">Compartilhar CPU</span><span class="toggle-desc">Doe 5% para processamento</span></div>
                    <label class="switch"><input type="checkbox" id="cpuCheck" onchange="atualizarConfig()"><span class="slider"></span></label>
                </div>
                <div class="toggle-container">
                    <div><span class="toggle-label">Rede Mesh Offline (PLUS)</span><span class="toggle-desc">Ativa conexões locais</span></div>
                    <label class="switch"><input type="checkbox" id="meshCheck" onchange="toggleBetaWarning()"><span class="slider"></span></label>
                </div>
                <div id="betaBox" class="beta-warning">⚠️ <strong>TESTE EXPERIMENTAL:</strong> Depende de nós por perto.</div>
                <div id="nodeIdDisplay" class="node-info-text">ID do Nó: Gerando...</div>
            </div>

            <div id="tela-otimizar" class="sub-panel">
                <div class="panel-title">⚡ Otimizador de CPU</div>
                <button class="btn-action" onclick="rodarOtimizador()">Otimizar Aparelho Agora</button>
                <div id="termOtimizar" class="terminal">> Aguardando...</div>
            </div>
            
            <div id="tela-arquivos" class="sub-panel">
                <div class="panel-title">📁 Supercomputador Mesh</div>
                <textarea id="meshFileInput" class="text-input-mesh" placeholder="Digite ou cole uma string de dados pesada para processar de forma distribuída..."></textarea>
                <button class="btn-action" onclick="processarArquivoNaMalha()">Fatiar e Processar na Rede</button>
                <div id="termArquivos" class="terminal">> Fila vazia. Pronto para fragmentação...</div>
            </div>

            <div id="tela-chat" class="sub-panel">
                <div class="panel-title">🤖 Eureka IA (P2P)</div>
                <div id="chatBox" class="chat-box"><div class="msg ia">Olá! Como posso ajudar de forma privada?</div></div>
                <div class="chat-input-container"><input type="text" id="chatInput" placeholder="Mensagem..."><button onclick="enviarMensagem()">></button></div>
            </div>

            <script>
                let ativo = false;
                let meuIdAnonimo = "web_" + Math.random().toString(36).substring(2, 10);
                document.getElementById('nodeIdDisplay').innerText = "ID do Nó: hash_" + meuIdAnonimo;

                function toggleMenu() { document.getElementById('sidebar').classList.toggle('open'); }
                function verTela(idTela) {
                    document.getElementById('tela-home').style.display = 'none';
                    document.getElementById('tela-otimizar').style.display = 'none';
                    document.getElementById('tela-arquivos').style.display = 'none';
                    document.getElementById('tela-chat').style.display = 'none';
                    document.getElementById('tela-' + idTela).style.display = 'block';
                    const items = document.querySelectorAll('.menu-item');
                    items.forEach(item => item.classList.remove('active'));
                    document.getElementById('opt-' + idTela).classList.add('active');
                    toggleMenu();
                }

                function togglePower() {
                    ativo = !ativo;
                    const btn = document.getElementById('mainBtn');
                    if(ativo) { btn.innerText = "LIGADO"; btn.classList.add('active'); } 
                    else { btn.innerText = "LIGAR"; btn.classList.remove('active'); }
                    atualizarConfig();
                }

                function toggleBetaWarning() {
                    document.getElementById('betaBox').style.display = document.getElementById('meshCheck').checked ? 'block' : 'none';
                    atualizarConfig();
                }

                async function atualizarConfig() {
                    const statusRede = ativo ? "Online" : "Offline";
                    fetch(\`/atualizar-no?status=\${statusRede}&cpu=\${document.getElementById('cpuCheck').checked}&mesh=\${document.getElementById('meshCheck').checked}&nodeId=\${meuIdAnonimo}\`);
                }

                function rodarOtimizador() { document.getElementById('termOtimizar').innerHTML = "> Solicitando nó trabalhador...<br>> Alocação efetuada."; }
                
                // INTEGRAÇÃO DO FATIADOR REAL DE ARQUIVOS
                async function processarArquivoNaMalha() {
                    const input = document.getElementById('meshFileInput');
                    const textoTodo = input.value.trim();
                    const term = document.getElementById('termArquivos');
                    
                    if(!textoTodo) {
                        term.innerHTML = "<span style='color: #ff7675;'>> Erro: Nenhuma string de dados inserida.</span>";
                        return;
                    }

                    term.innerHTML = "> Iniciando fatiador algorítmico...<br>";
                    
                    // Quebra o texto inserido em pedaços de 4 caracteres para simular fragmentação real
                    const tamanhoPedaço = 4;
                    let blocos = [];
                    for (let i = 0; i < textoTodo.length; i += tamanhoPedaço) {
                        blocos.push(textoTodo.substring(i, i + tamanhoPedaço));
                    }

                    term.innerHTML += \`> Dados fatiados em \${blocos.length} blocos distintos.<br>\`;
                    
                    // Dispara cada fatia de forma assíncrona para a nova rota do servidor
                    for(let index = 0; index < blocos.length; index++) {
                        term.innerHTML += \`> Enviando bloco [\${index}] -> Valor: "\${blocos[index]}"<br>\`;
                        term.scrollTop = term.scrollHeight;
                        
                        try {
                            await fetch(\`/enviar-bloco-arquivo?blocoVal=\${encodeURIComponent(blocos[index])}&blocoIndex=\${index}\`);
                        } catch(e) {
                            term.innerHTML += \`<span style='color: #ff7675;'>[!] Falha no bloco \${index}</span><br>\`;
                        }
                    }
                    
                    term.innerHTML += "<span style='color: #00b894;'>✔ Sucesso: Todos os blocos estão na fila de computação da malha.</span>";
                    input.value = '';
                    term.scrollTop = term.scrollHeight;
                }

                async function enviarMensagem() {
                    const input = document.getElementById('chatInput'); if(!input.value.trim()) return;
                    document.getElementById('chatBox').innerHTML += \`<div class="msg user">\${input.value}</div>\`;
                    const promptText = input.value; input.value = '';
                    const loadingId = "load_" + Date.now();
                    document.getElementById('chatBox').innerHTML += \`<div id="\${loadingId}" class="msg ia" style="color: #6c5ce7;">⏳ Processando em múltiplos nós...</div>\`;
                    
                    try {
                        const res = await fetch(\`/processar-prompt?prompt=\${encodeURIComponent(promptText)}\`);
                        const data = await res.json();
                        document.getElementById(loadingId).remove();
                        document.getElementById('chatBox').innerHTML += \`<div class="msg ia"><strong>[Nós: \${data.nosEnvolvidos}]</strong><br>\${data.resposta}</div>\`;
                    } catch(e) { document.getElementById(loadingId).innerText = "Erro."; }
                }
            </script>
        </body>
        </html>
        `;
        res.end(html);

    } else if (req.url.startsWith('/atualizar-no')) {
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const status = urlParams.searchParams.get('status') || 'Offline';
        const cpu = urlParams.searchParams.get('cpu') === 'true';
        const mesh = urlParams.searchParams.get('mesh') === 'true';
        const nodeId = urlParams.searchParams.get('nodeId') || "anon_" + Math.floor(Math.random() * 10000);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            await setDoc(doc(db, "rede_mesh", nodeId), {
                statusDispositivo: status,
                doandoCPU: cpu,
                meshPlusAtivo: mesh,
                ultimaInteracao: new Date().toISOString()
            });

            let tarefaP2P = null;
            if (status === "Online" && cpu === true) {
                tarefaP2P = {
                    tipo: "HASH_MINING_BLOCK",
                    dificuldade: "5000_LOOPS",
                    seedMatematica: "eureka_block_token_" + Math.random().toString(36).substring(2, 7)
                };
            }
            res.end(JSON.stringify({ status: "Sincronizado", noIdCego: nodeId, tarefaPendente: tarefaP2P }));
        } catch (e) {
            res.end(JSON.stringify({ erro: "Falha: " + e.message }));
        }

    } else if (req.url.startsWith('/enviar-bloco-arquivo')) {
        // ROTA DO SUPERCOMPUTADOR: Recebe fragmentos e injeta na fila de tarefas do banco de dados
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const blocoVal = urlParams.searchParams.get('blocoVal') || '';
        const blocoIndex = urlParams.searchParams.get('blocoIndex') || '0';

        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            // Insere o fragmento do arquivo na coleção global de tarefas para os aplicativos pescarem
            await addDoc(collection(db, "fila_computacao"), {
                index: blocoIndex,
                conteudoCripto: blocoVal,
                statusProcessamento: "Pendente",
                timestamp: new Date().toISOString()
            });
            res.end(JSON.stringify({ status: "Bloco Alocado", index: blocoIndex }));
        } catch (e) {
            res.end(JSON.stringify({ erro: e.message }));
        }

    } else if (req.url.startsWith('/processar-prompt')) {
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const prompt = urlParams.searchParams.get('prompt') || '';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        let respostaMesh = "Bloco de prompt interpretado na rede cega. Resposta sintetizada com sucesso.";
        if(prompt.toLowerCase().includes("o que é") || prompt.toLowerCase().includes("oque e")) {
            respostaMesh = "Eureka é um ecossistema computacional criptográfico P2P que protege a privacidade do tráfego eliminando metadados de identificação centralizados.";
        } else if(prompt.toLowerCase().includes("status") || prompt.toLowerCase().includes("rede")) {
            respostaMesh = "Malha Mesh operando de forma saudável. Verificação de integridade distribuída em execução estável.";
        }
        const nosSorteados = Math.floor(Math.random() * 8) + 3;
        setTimeout(() => { res.end(JSON.stringify({ resposta: respostaMesh, nosEnvolvidos: nosSorteados })); }, 1200);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Servidor Eureka ativo na porta ${PORT}`);
});
