# Caminho Mais Barato 🛣️

Aplicação web que calcula a **rota de menor custo** entre capitais brasileiras, levando em conta distância, preço do combustível, autonomia do veículo e pedágios. Projeto desenvolvido para a disciplina de Teoria de Grafos.

## Como funciona

O backend modela as capitais e as estradas entre elas como um **grafo não direcionado**: cada capital é um vértice (com um custo de pedágio associado) e cada ligação entre capitais é uma aresta com a distância em km.

Para encontrar a rota mais barata entre origem e destino, é aplicado o **algoritmo de Dijkstra** (implementado com uma Min-Heap própria), onde o "custo" de cada trecho não é a distância pura, mas sim:

```
custo do trecho = (distância / autonomia) * preço do combustível + pedágio da capital de destino
```

O resultado é o caminho (sequência de capitais) com o menor custo total em reais.

### Endpoints da API

| Método | Rota        | Descrição                                                                 |
|--------|-------------|----------------------------------------------------------------------------|
| GET    | `/capitais` | Retorna a lista de capitais disponíveis no grafo.                        |
| POST   | `/buscar`   | Calcula a rota mais barata. Body JSON: `{ origem, destino, precoCombustivel, autonomia }` |

### Interface

A interface web (`public/index.html`) permite escolher a capital de origem e destino, informar o preço do combustível e a autonomia do veículo, e exibe o caminho calculado com o custo total estimado.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado v18 ou superior)
- npm (instalado junto com o Node.js)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/kamborges/TD02-Caminho-Mais-Barato.git
   cd TD02-Caminho-Mais-Barato
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Como iniciar

Para rodar o servidor normalmente:

```bash
npm start
```

Para rodar em modo de desenvolvimento (reinicia automaticamente a cada alteração, usando `nodemon`):

```bash
npm run dev
```

Por padrão, o servidor inicia em:

```
http://localhost:3000
```

Abra esse endereço no navegador para usar a aplicação.

## Estrutura do projeto

```
.
├── capitais.json     # Dados do grafo: capitais, pedágios e distâncias entre elas
├── server.js          # Servidor Express, classes Grafo/MinHeap e algoritmo de Dijkstra
└── public/            # Interface web (HTML, CSS e JS)
    ├── index.html
    ├── script.js
    └── style.css
```
