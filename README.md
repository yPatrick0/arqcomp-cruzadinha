# ⚡ Curto-Circuito

Cruzadinha de **Arquitetura Computacional** que roda no navegador.
O tabuleiro é uma placa de circuito: cada palavra certa acende um LED verde e enche a barra de energia. Quando as 16 peças estão certas, o computador **liga**.

🔗 **Jogue aqui:** https://ypatrick0.github.io/arqcomp-cruzadinha/

---

## Como jogar

1. Clique numa casa do tabuleiro ou numa pista da lista.
2. Digite as letras. O cursor anda sozinho para a próxima casa.
3. Clique de novo na mesma casa para trocar entre **horizontal** e **vertical**.
4. Use as **setas** para andar pelo tabuleiro e **Backspace** para apagar.
5. Aperte **Conferir** (ou Enter):
   - 🟢 LED verde: palavra certa
   - 🔴 LED vermelho: palavra errada
   - ⚫ LED apagado: palavra incompleta
6. O contador mostra quantas palavras estão certas (ex.: `8 de 16 palavras`).
7. **Reiniciar** limpa o tabuleiro para começar de novo.

Acentos são ignorados: se digitar "memória", o jogo entende "MEMORIA".

---

## Palavras e pistas

O tabuleiro usa as **16 palavras** da lista, e cada uma cruza com pelo menos uma outra.

### Horizontais

| Nº | Palavra | Pista |
|----|---------|-------|
| 3  | ROM | Memória gravada de fábrica: não apaga ao desligar e não pode ser alterada. |
| 6  | DUALCORE | Processador com duas unidades de processamento completas trabalhando em paralelo. |
| 8  | MICROCONTROLADOR | Computador inteiro num único chip, com processador, memória e portas; o coração do Arduino. |
| 12 | QUADCORE | Processador com quatro unidades de processamento completas trabalhando em paralelo. |
| 13 | CACHE | Memória veloz entre o processador e a principal, com os dados mais usados. |
| 14 | FLASH | Memória permanente regravável em blocos, a tecnologia dos pendrives e cartões SD. |
| 16 | DATABUS | Vias de mão dupla por onde as informações lidas e gravadas viajam. |

### Verticais

| Nº | Palavra | Pista |
|----|---------|-------|
| 1  | ULA | Bloco do processador que soma, subtrai e compara valores (verdadeiro ou falso). |
| 2  | EEPROM | Memória permanente regravável de byte em byte, usada para guardar configurações pequenas. |
| 4  | MEMORIADEMASSA | Onde arquivos e programas ficam guardados de vez, como HD e SSD. |
| 5  | REGISTRADORES | Gavetinhas dentro do processador: as mais rápidas, guardam os valores em uso. |
| 7  | UC | O "maestro" do processador: decodifica cada comando e coordena as outras partes. |
| 9  | RAM | Memória principal e volátil: guarda o que está aberto e apaga tudo ao desligar. |
| 10 | CPU | O cérebro do computador: busca, interpreta e executa as instruções dos programas. |
| 11 | ADDRESSBUS | Vias de mão única que indicam qual posição da memória o processador quer acessar. |
| 15 | DMA | Recurso que deixa periféricos trocarem dados com a memória sem ocupar o processador. |

---

## Tecnologias

- HTML, CSS e JavaScript puros (sem bibliotecas)
- Publicado com GitHub Pages

## Estrutura

```
arqcomp-cruzadinha/
├── index.html   → estrutura da página
├── style.css    → visual de placa de circuito
├── script.js    → palavras, pistas e regras do jogo
└── README.md    → este arquivo
```
