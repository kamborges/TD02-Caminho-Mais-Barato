const express = require("express");
const path = require("path");
const capitais = require("./capitais.json");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

class MinHeap {
    constructor() {
        this.heap = [];
    }

    inserir(item) {
        this.heap.push(item);
        this.subir();
    }

    remover() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const menor = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.descer();

        return menor;
    }

    subir() {
        let indice = this.heap.length - 1;

        while (indice > 0) {
            let pai = Math.floor((indice - 1) / 2);

            if (this.heap[pai].custo <= this.heap[indice].custo) break;

            [this.heap[pai], this.heap[indice]] = [this.heap[indice], this.heap[pai]];
            indice = pai;
        }
    }

    descer() {
        let indice = 0;

        while (true) {
            let esquerda = 2 * indice + 1;
            let direita = 2 * indice + 2;
            let menor = indice;

            if (
                esquerda < this.heap.length &&
                this.heap[esquerda].custo < this.heap[menor].custo
            ) {
                menor = esquerda;
            }

            if (
                direita < this.heap.length &&
                this.heap[direita].custo < this.heap[menor].custo
            ) {
                menor = direita;
            }

            if (menor === indice) break;

            [this.heap[indice], this.heap[menor]] = [this.heap[menor], this.heap[indice]];
            indice = menor;
        }
    }

    estaVazio() {
        return this.heap.length === 0;
    }
}

class Grafo {
    constructor() {
        this.vertices = {};
    }

    adicionarVertice(capital, pedagio) {
        this.vertices[capital] = {
            toll: pedagio,
            neighbors: {}
        };
    }

    adicionarAresta(origem, destino, distancia) {
        this.vertices[origem].neighbors[destino] = distancia;
        this.vertices[destino].neighbors[origem] = distancia;
    }

    seed(dados) {
        for (const item of dados) {
            const capital = Object.keys(item)[0];
            const info = item[capital];

            this.adicionarVertice(capital, info.toll);
        }

        for (const item of dados) {
            const capital = Object.keys(item)[0];
            const info = item[capital];

            for (const vizinho in info.neighbors) {
                const distancia = info.neighbors[vizinho];

                if (this.vertices[vizinho]) {
                    this.adicionarAresta(capital, vizinho, distancia);
                }
            }
        }
    }

    show() {
        console.log("GRAFO - LISTA DE ADJACÊNCIAS");

        for (const capital in this.vertices) {
            console.log(`${capital}:`, this.vertices[capital].neighbors);
        }
    }

    dijkstraHeap(origem, destino, precoCombustivel, autonomia) {
        const custos = {};
        const anteriores = {};
        const heap = new MinHeap();

        for (const capital in this.vertices) {
            custos[capital] = Infinity;
            anteriores[capital] = null;
        }

        custos[origem] = this.vertices[origem].toll;
        heap.inserir({ capital: origem, custo: custos[origem] });

        while (!heap.estaVazio()) {
            const atual = heap.remover();
            const capitalAtual = atual.capital;

            if (capitalAtual === destino) break;

            const vizinhos = this.vertices[capitalAtual].neighbors;

            for (const vizinho in vizinhos) {
                const distancia = vizinhos[vizinho];

                const custoCombustivel = (distancia / autonomia) * precoCombustivel;
                const custoPedagio = this.vertices[vizinho].toll;
                const novoCusto = custos[capitalAtual] + custoCombustivel + custoPedagio;

                if (novoCusto < custos[vizinho]) {
                    custos[vizinho] = novoCusto;
                    anteriores[vizinho] = capitalAtual;
                    heap.inserir({ capital: vizinho, custo: novoCusto });
                }
            }
        }

        if (custos[destino] === Infinity) {
            return {
                encontrado: false,
                mensagem: "Rota inexistente entre as capitais selecionadas."
            };
        }

        const caminho = [];
        let atual = destino;

        while (atual !== null) {
            caminho.unshift(atual);
            atual = anteriores[atual];
        }

        return {
            encontrado: true,
            caminho,
            custoTotal: custos[destino].toFixed(2)
        };
    }
}

const grafo = new Grafo();
grafo.seed(capitais);
grafo.show();

app.get("/capitais", (req, res) => {
    res.json(Object.keys(grafo.vertices));
});

app.post("/buscar", (req, res) => {
    const { origem, destino, precoCombustivel, autonomia } = req.body;

    if (!origem || !destino || !precoCombustivel || !autonomia) {
        return res.json({
            encontrado: false,
            mensagem: "Preencha todos os campos."
        });
    }

        if (!grafo.vertices[origem] || !grafo.vertices[destino]) {
        return res.json({
            encontrado: false,
            mensagem: "Capital de origem ou destino inválida."
        });
    }

    const resultado = grafo.dijkstraHeap(
        origem,
        destino,
        Number(precoCombustivel),
        Number(autonomia)
    );

    res.json(resultado);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});