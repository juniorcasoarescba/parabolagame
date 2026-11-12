# PARÁBOLA — O Laboratório das Trajetórias

Jogo educativo de exploração matemática para introdução e aprofundamento de funções quadráticas.

## Conceito
O personagem Prof. Ápeiron não entrega a matemática pronta. Ele cria situações-problema e oferece pistas graduais. O estudante altera os coeficientes `a`, `b` e `c`, observa a parábola, formula hipóteses e testa trajetórias.

## Conteúdos trabalhados
- coeficientes `a`, `b`, `c`;
- concavidade e abertura;
- intercepto no eixo `y`;
- eixo de simetria;
- vértice;
- raízes;
- discriminante;
- forma fatorada e forma de vértice;
- reconstrução de funções;
- modelagem por condições geométricas.

## Estrutura
- `index.html`: interface e estrutura do jogo.
- `style.css`: visual responsivo.
- `game.js`: motor matemático, gráfico, missões, pontuação e progressão.
- `assets/`: imagens do Prof. Ápeiron recortadas do conjunto fornecido.

## Como executar
Não é necessário instalar bibliotecas.

1. Extraia a pasta.
2. Abra `index.html` em um navegador moderno.
3. Para uma experiência mais estável, você também pode servir a pasta com um servidor local simples, mas não é obrigatório.

Exemplo opcional com Python:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Observação
O jogo foi construído sem frameworks e sem dependências externas, portanto funciona offline depois que a pasta é extraída.


Atualização: a Missão 1 agora exibe visualmente o alvo no ponto (10, 5), com alvo circular/haste/bandeira, e a configuração inicial foi corrigida para satisfazer f(10)=5. Também foram adicionados marcadores visuais para os objetivos das missões 4–8.
