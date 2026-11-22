/* =========================================================
   CURTO-CIRCUITO · lógica do jogo
   Cruzadinha de Arquitetura Computacional
   ========================================================= */

/* ---------- 1. Dados do jogo ----------
   Cada palavra tem:
   - resposta: como vai nas casas (maiúscula, sem acento, sem espaço)
   - linha e coluna: onde a primeira letra começa (contando do 0)
   - direcao: "H" (horizontal) ou "V" (vertical)
   - pista: a dica que o jogador lê
   O número de cada pista é calculado sozinho pelo código. */

const LINHAS = 14;
const COLUNAS = 16;

const PALAVRAS = [
  { resposta: "ROM", linha: 0, coluna: 13, direcao: "H",
    pista: "Memória gravada de fábrica: não apaga ao desligar e não pode ser alterada." },
  { resposta: "DUALCORE", linha: 1, coluna: 3, direcao: "H",
    pista: "Processador com duas unidades de processamento completas trabalhando em paralelo." },
  { resposta: "MICROCONTROLADOR", linha: 4, coluna: 0, direcao: "H",
    pista: "Computador inteiro num único chip, com processador, memória e portas; o coração do Arduino." },
  { resposta: "QUADCORE", linha: 7, coluna: 6, direcao: "H",
    pista: "Processador com quatro unidades de processamento completas trabalhando em paralelo." },
  { resposta: "CACHE", linha: 8, coluna: 0, direcao: "H",
    pista: "Memória veloz entre o processador e a principal, com os dados mais usados." },
  { resposta: "FLASH", linha: 9, coluna: 9, direcao: "H",
    pista: "Memória permanente regravável em blocos, a tecnologia dos pendrives e cartões SD." },
  { resposta: "DATABUS", linha: 12, coluna: 7, direcao: "H",
    pista: "Vias de mão dupla por onde as informações lidas e gravadas viajam." },

  { resposta: "ULA", linha: 0, coluna: 6, direcao: "V",
    pista: "Bloco do processador que soma, subtrai e compara valores (verdadeiro ou falso)." },
  { resposta: "EEPROM", linha: 0, coluna: 10, direcao: "V",
    pista: "Memória permanente regravável de byte em byte, usada para guardar configurações pequenas." },
  { resposta: "MEMORIADEMASSA", linha: 0, coluna: 15, direcao: "V",
    pista: "Onde arquivos e programas ficam guardados de vez, como HD e SSD." },
  { resposta: "REGISTRADORES", linha: 1, coluna: 1, direcao: "V",
    pista: "Gavetinhas dentro do processador: as mais rápidas, guardam os valores em uso." },
  { resposta: "UC", linha: 1, coluna: 4, direcao: "V",
    pista: "O \"maestro\" do processador: decodifica cada comando e coordena as outras partes." },
  { resposta: "RAM", linha: 4, coluna: 3, direcao: "V",
    pista: "Memória principal e volátil: guarda o que está aberto e apaga tudo ao desligar." },
  { resposta: "CPU", linha: 4, coluna: 5, direcao: "V",
    pista: "O cérebro do computador: busca, interpreta e executa as instruções dos programas." },
  { resposta: "ADDRESSBUS", linha: 4, coluna: 12, direcao: "V",
    pista: "Vias de mão única que indicam qual posição da memória o processador quer acessar." },
  { resposta: "DMA", linha: 10, coluna: 8, direcao: "V",
    pista: "Recurso que deixa periféricos trocarem dados com a memória sem ocupar o processador." },
];


/* ---------- 2. Estado do jogo ----------
   "casas" guarda todas as casas com letra.
   A chave é "linha-coluna", por exemplo "4-0". */

const casas = {};
let palavraAtiva = null;   // palavra selecionada agora
let casaAtiva = null;      // casa onde está o cursor
let direcaoAtual = "H";    // direção em que o cursor anda


/* ---------- 3. Pegando os elementos da página ---------- */

const tabuleiro = document.getElementById("tabuleiro");
const pistaAtiva = document.getElementById("pistaAtiva");
const listaH = document.getElementById("pistasHorizontais");
const listaV = document.getElementById("pistasVerticais");
const contador = document.getElementById("contador");
const barraEnergia = document.getElementById("barraEnergia");
const mensagem = document.getElementById("mensagem");
const telaBoot = document.getElementById("telaBoot");
const bootTexto = document.getElementById("bootTexto");


/* ---------- 4. Funções auxiliares ---------- */

// Junta linha e coluna numa chave de texto, ex.: chave(4, 0) -> "4-0"
function chave(linha, coluna) {
  return linha + "-" + coluna;
}

// Tira acentos e tudo que não for letra, e deixa maiúsculo.
// Ex.: "ç" vira "C", "á" vira "A", "3" vira "".
function limparLetra(texto) {
  return texto
    .normalize("NFD")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}


/* ---------- 5. Montar o tabuleiro ---------- */

function montarTabuleiro() {
  // 5a. Descobre quais casas cada palavra ocupa
  PALAVRAS.forEach(function (palavra) {
    palavra.casas = [];

    for (let i = 0; i < palavra.resposta.length; i++) {
      let linha = palavra.linha;
      let coluna = palavra.coluna;

      if (palavra.direcao === "H") {
        coluna = coluna + i;   // horizontal: anda para a direita
      } else {
        linha = linha + i;     // vertical: anda para baixo
      }

      const k = chave(linha, coluna);

      // Se a casa ainda não existe, cria. Se já existe, é um cruzamento.
      if (!casas[k]) {
        casas[k] = { letraCerta: palavra.resposta[i], palavras: [] };
      }
      casas[k].palavras.push(palavra);
      palavra.casas.push(k);
    }
  });

  // 5b. Numera as pistas lendo o tabuleiro da esquerda para a direita, de cima para baixo
  let numero = 1;
  for (let linha = 0; linha < LINHAS; linha++) {
    for (let coluna = 0; coluna < COLUNAS; coluna++) {
      const comecaAqui = PALAVRAS.filter(function (p) {
        return p.linha === linha && p.coluna === coluna;
      });

      if (comecaAqui.length > 0) {
        comecaAqui.forEach(function (p) { p.numero = numero; });
        casas[chave(linha, coluna)].numero = numero;
        numero++;
      }
    }
  }

  // 5c. Cria as casas na tela
  tabuleiro.style.gridTemplateColumns = "repeat(" + COLUNAS + ", var(--casa))";

  for (let linha = 0; linha < LINHAS; linha++) {
    for (let coluna = 0; coluna < COLUNAS; coluna++) {
      const k = chave(linha, coluna);
      const div = document.createElement("div");
      div.classList.add("casa");

      if (!casas[k]) {
        div.classList.add("vazia");   // casa sem letra
      } else {
        if (casas[k].numero) {
          const span = document.createElement("span");
          span.className = "numero";
          span.textContent = casas[k].numero;
          div.appendChild(span);
        }

        const input = document.createElement("input");
        input.type = "text";
        input.autocomplete = "off";
        input.setAttribute("autocapitalize", "characters");
        input.setAttribute("spellcheck", "false");
        input.setAttribute("aria-label", "Linha " + (linha + 1) + ", coluna " + (coluna + 1));
        div.appendChild(input);

        casas[k].elemento = div;
        casas[k].input = input;
        casas[k].linha = linha;
        casas[k].coluna = coluna;

        ligarEventosDaCasa(k);
      }

      tabuleiro.appendChild(div);
    }
  }
}


/* ---------- 6. Montar a lista de pistas ---------- */

function montarPistas() {
  // Ordena pelo número para a lista ficar 1, 2, 3...
  const ordenadas = PALAVRAS.slice().sort(function (a, b) {
    return a.numero - b.numero;
  });

  ordenadas.forEach(function (palavra) {
    const li = document.createElement("li");
    li.innerHTML =
      '<span class="led"></span>' +
      '<span class="num">' + palavra.numero + '</span>' +
      '<span class="texto">' + palavra.pista +
      ' <small>(' + palavra.resposta.length + ')</small></span>';

    // Clicar na pista leva o cursor para a primeira casa da palavra
    li.addEventListener("click", function () {
      const primeira = palavra.casas[0];
      direcaoAtual = palavra.direcao;
      if (casaAtiva === primeira) {
        selecionarCasa(primeira);   // já estava aqui: só troca a palavra
      }
      casas[primeira].input.focus();
    });

    palavra.itemDaLista = li;

    if (palavra.direcao === "H") {
      listaH.appendChild(li);
    } else {
      listaV.appendChild(li);
    }
  });
}


/* ---------- 7. Selecionar casa e palavra ---------- */

function selecionarCasa(k) {
  // Remove o destaque da casa anterior
  if (casaAtiva && casas[casaAtiva]) {
    casas[casaAtiva].elemento.classList.remove("atual");
  }

  casaAtiva = k;
  casas[k].elemento.classList.add("atual");

  // Escolhe a palavra: a da direção atual, ou a única que passa aqui
  const opcoes = casas[k].palavras;
  let escolhida = opcoes.find(function (p) { return p.direcao === direcaoAtual; });
  if (!escolhida) {
    escolhida = opcoes[0];
  }

  direcaoAtual = escolhida.direcao;
  ativarPalavra(escolhida);

  casas[k].input.select();
}

function ativarPalavra(palavra) {
  // Tira o destaque da palavra antiga
  if (palavraAtiva) {
    palavraAtiva.casas.forEach(function (k) {
      casas[k].elemento.classList.remove("destaque");
    });
    palavraAtiva.itemDaLista.classList.remove("ativa");
  }

  palavraAtiva = palavra;

  palavra.casas.forEach(function (k) {
    casas[k].elemento.classList.add("destaque");
  });
  palavra.itemDaLista.classList.add("ativa");

  const nomeDirecao = palavra.direcao === "H" ? "Horizontal" : "Vertical";
  pistaAtiva.innerHTML =
    "<strong>" + palavra.numero + " " + nomeDirecao + "</strong> · " + palavra.pista;
}

// Clicar de novo na casa onde o cursor já está troca a direção
function trocarDirecao(k) {
  if (casas[k].palavras.length > 1) {
    direcaoAtual = direcaoAtual === "H" ? "V" : "H";
    selecionarCasa(k);
  }
}


/* ---------- 8. Andar pelo tabuleiro ---------- */

// Vai para a próxima (passo = 1) ou anterior (passo = -1) casa da palavra ativa
function andarNaPalavra(passo) {
  const posicao = palavraAtiva.casas.indexOf(casaAtiva);
  const destino = palavraAtiva.casas[posicao + passo];

  if (destino) {
    casas[destino].input.focus();
    return destino;
  }
  return null;
}

// Usado pelas setas: procura a próxima casa com letra naquela direção
function andarComSeta(dLinha, dColuna) {
  let linha = casas[casaAtiva].linha + dLinha;
  let coluna = casas[casaAtiva].coluna + dColuna;

  while (linha >= 0 && linha < LINHAS && coluna >= 0 && coluna < COLUNAS) {
    const k = chave(linha, coluna);
    if (casas[k]) {
      casas[k].input.focus();
      return;
    }
    linha += dLinha;
    coluna += dColuna;
  }
}


/* ---------- 9. Eventos de cada casa ---------- */

function ligarEventosDaCasa(k) {
  const input = casas[k].input;

  // pointerdown acontece ANTES do foco: se a casa já era a ativa, troca a direção
  input.addEventListener("pointerdown", function () {
    if (casaAtiva === k && document.activeElement === input) {
      trocarDirecao(k);
    }
  });

  input.addEventListener("focus", function () {
    selecionarCasa(k);
  });

  // Quando o jogador digita uma letra
  input.addEventListener("input", function () {
    const letra = limparLetra(input.value).slice(-1); // fica só com a última letra
    input.value = letra;
    apagarResultado(k);

    if (letra !== "") {
      andarNaPalavra(1);
    }
  });

  // Teclas especiais
  input.addEventListener("keydown", function (evento) {
    const tecla = evento.key;

    if (tecla === "Backspace" && input.value === "") {
      // Casa já vazia: volta uma casa e apaga a letra de lá
      evento.preventDefault();
      const anterior = andarNaPalavra(-1);
      if (anterior) {
        casas[anterior].input.value = "";
        apagarResultado(anterior);
      }
    } else if (tecla === "ArrowRight") {
      evento.preventDefault();
      direcaoAtual = "H";
      andarComSeta(0, 1);
    } else if (tecla === "ArrowLeft") {
      evento.preventDefault();
      direcaoAtual = "H";
      andarComSeta(0, -1);
    } else if (tecla === "ArrowDown") {
      evento.preventDefault();
      direcaoAtual = "V";
      andarComSeta(1, 0);
    } else if (tecla === "ArrowUp") {
      evento.preventDefault();
      direcaoAtual = "V";
      andarComSeta(-1, 0);
    } else if (tecla === "Enter") {
      evento.preventDefault();
      conferir();
    }
  });
}

// Se o jogador mexe numa casa, o verde/vermelho dela some até conferir de novo
function apagarResultado(k) {
  casas[k].elemento.classList.remove("certa", "errada");
  casas[k].palavras.forEach(function (p) {
    p.itemDaLista.classList.remove("certa", "errada");
  });
}


/* ---------- 10. Botão Conferir ---------- */

function conferir() {
  let certas = 0;
  let erradas = 0;
  let incompletas = 0;

  // Limpa as cores antigas
  Object.keys(casas).forEach(function (k) {
    casas[k].elemento.classList.remove("certa", "errada");
  });

  // 1º passo: pinta de vermelho as palavras completas e erradas
  PALAVRAS.forEach(function (palavra) {
    // Junta as letras que o jogador digitou nessa palavra
    const tentativa = palavra.casas.map(function (k) {
      return casas[k].input.value;
    }).join("");

    palavra.itemDaLista.classList.remove("certa", "errada");

    if (tentativa === palavra.resposta) {
      palavra.acertou = true;
      palavra.itemDaLista.classList.add("certa");
      certas++;
    } else if (tentativa.length < palavra.resposta.length) {
      // Ainda tem casa vazia: não está certa nem errada, só incompleta
      palavra.acertou = false;
      incompletas++;
    } else {
      palavra.acertou = false;
      palavra.itemDaLista.classList.add("errada");
      palavra.casas.forEach(function (k) {
        casas[k].elemento.classList.add("errada");
      });
      erradas++;
    }
  });

  // 2º passo: pinta de verde as certas.
  // Vem depois porque uma letra que está numa palavra certa com certeza está certa,
  // mesmo que a outra palavra do cruzamento esteja errada.
  PALAVRAS.forEach(function (palavra) {
    if (palavra.acertou) {
      palavra.casas.forEach(function (k) {
        casas[k].elemento.classList.remove("errada");
        casas[k].elemento.classList.add("certa");
      });
    }
  });

  atualizarContador(certas);

  mensagem.textContent =
    certas + " certa(s) · " + erradas + " errada(s) · " + incompletas + " incompleta(s)";

  if (certas === PALAVRAS.length) {
    ligarComputador();
  }
}

function atualizarContador(certas) {
  contador.textContent = certas + " de " + PALAVRAS.length + " palavras";
  barraEnergia.style.width = (certas / PALAVRAS.length) * 100 + "%";
}


/* ---------- 11. Botão Reiniciar ---------- */

function reiniciar() {
  Object.keys(casas).forEach(function (k) {
    casas[k].input.value = "";
    casas[k].elemento.classList.remove("certa", "errada", "destaque", "atual");
  });

  PALAVRAS.forEach(function (palavra) {
    palavra.acertou = false;
    palavra.itemDaLista.classList.remove("certa", "errada", "ativa");
  });

  palavraAtiva = null;
  casaAtiva = null;
  direcaoAtual = "H";

  atualizarContador(0);
  mensagem.textContent = "";
  pistaAtiva.textContent = "Clique numa casa ou numa pista para começar.";
  telaBoot.hidden = true;
}


/* ---------- 12. Vitória: o computador liga ---------- */

function ligarComputador() {
  telaBoot.hidden = false;
  bootTexto.textContent = "";

  const linhas = ["CURTO-CIRCUITO BIOS v1.0", "Verificando componentes...", ""];

  PALAVRAS.forEach(function (palavra) {
    linhas.push("[ OK ] " + palavra.resposta);
  });

  linhas.push("", "Todos os 16 componentes encaixados.", "SISTEMA LIGADO. Parabéns! ⚡");

  // Mostra uma linha de cada vez, como se o computador estivesse ligando
  linhas.forEach(function (texto, i) {
    setTimeout(function () {
      bootTexto.textContent += texto + "\n";
      bootTexto.scrollTop = bootTexto.scrollHeight;
    }, i * 140);
  });
}


/* ---------- 13. Começa o jogo ---------- */

document.getElementById("btnConferir").addEventListener("click", conferir);
document.getElementById("btnReiniciar").addEventListener("click", reiniciar);
document.getElementById("btnJogarDeNovo").addEventListener("click", reiniciar);
document.getElementById("btnFecharBoot").addEventListener("click", function () {
  telaBoot.hidden = true;
});

montarTabuleiro();
montarPistas();
atualizarContador(0);
