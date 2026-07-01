function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

async function carregarCapitais() {
  const resposta = await fetch("/capitais");
  const capitais = await resposta.json();

  const origem = document.getElementById("origem");
  const destino = document.getElementById("destino");

  capitais.forEach(capital => {
    origem.innerHTML += `<option value="${capital}">${capital}</option>`;
    destino.innerHTML += `<option value="${capital}">${capital}</option>`;
  });
}

async function buscarCaminho() {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const precoCombustivel = document.getElementById("preco").value;
  const autonomia = document.getElementById("autonomia").value;
  const resultado = document.getElementById("resultado");

  const resposta = await fetch("/buscar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      origem,
      destino,
      precoCombustivel,
      autonomia
    })
  });

  const dados = await resposta.json();

  if (!dados.encontrado) {
    resultado.className = "resultado erro";
    resultado.innerHTML = dados.mensagem;
    return;
  }

  resultado.className = "resultado sucesso";
  resultado.innerHTML = `
    <strong>Rota mais barata:</strong><br>
    ${dados.caminho.join(" → ")}
    <br><br>
    <strong>Custo total:</strong> ${formatarMoeda(dados.custoTotal)}
  `;
}

carregarCapitais();