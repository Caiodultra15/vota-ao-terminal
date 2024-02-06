const { read } = require("fs");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    readline.question(query, (resposta) => {
      resolve(resposta);
    });
  });
}
const candidatos = [];
const votos = {};

async function main() {
  console.log("-- Bem Vindo ao sistema eleitoral online --");
  console.log("\nEscolha o numero das opções a seguir\n");
  let continuar = true;
  do {
    console.log("1 - Cadastrar Candidato");
    console.log("2 - Iniciar Eleição");
    console.log("3 - Imprimir Candidatos");
    const opcao = await question("Escolha uma das opções");

    switch (opcao) {
      case "1":
        await cadastrarCandidato();
        break;
      case "2":
        if (candidatos.length > 1) {
          await iniciarEleicao();
          continuar = false;
        } else {
          console.error(
            "\nEm uma eleição precisa ter no minimo dois candidatos\n"
          );
        }
        break;
      case "3":
        console.log("\n Os candidatos são:");
        candidatos.forEach((candidato) => {
          console.log(`Nome: ${candidato.nome}, Numero: ${candidato.numero}`);
        });
        console.log("\n");
        break;
      default:
        console.error("\n Escolha uma opção valida");
    }
  } while (continuar);
  readline.close();
}

async function cadastrarCandidato() {
  const numero = await question("\n Digite o numero do candidato\n");
  if (isNaN(numero)) {
    console.error("\nO candidato deve receber um numero \n");
    return;
  }
  const candidatoRepetido = candidatos.find((candidato) => {
    return candidato.numero === numero;
  });
  if (candidatoRepetido) {
    console.error("\n Já existe um candidato com esse numero \n");
    return;
  }
  const nome = await question("\n Digite o nome do candidato\n");
  const novoCandidato = { numero: numero, nome: nome };
  candidatos.push(novoCandidato);

  votos[novoCandidato.numero] = 0;

  console.log(`\n${novoCandidato.nome} cadastrado com sucesso\n`);
}
async function iniciarEleicao() {
  console.log("\n Eleição Inicializada");
  console.log("Digite 'fim' para finalizar a eleição");
  let continuarLoop = true;
  do {
    const numero = await question(
      "Digite o numero do candidato que deseja votar "
    );
    if (numero === "fim") {
      continuarLoop = false;
      console.log("\n Fim da eleição \n");
      resultadodaEleicao();
      return;
    }
    if (votos[numero] === undefined) {
      console.error("\n Numero de candidato invalido");
    } else {
      votos[numero]++;
      console.log(`Você votou no candidato ${numero}`);
    }
  } while (continuarLoop);
}
function resultadodaEleicao() {
  const resultado = candidatos.map((candidato) => {
    return {
      nome: candidato.nome,
      numero: candidato.numero,
      votos: votos[candidato.numero],
    };
  });
  resultado.sort((a, b) => {
    return b.votos - a.votos;
  });
  const candidatoVencedor = resultado[0];
  const totalVotos = Object.values(votos).reduce(function (antes, depois) {
    return antes + depois;
  }, 0);
  console.log("\n Resultado da eleição\n");
  console.log(
    `O vencedor da eleicao é ${candidatoVencedor.nome} com ${
      votos[candidatoVencedor.numero]
    } votos`
  );
  console.log(`Total de votos : ${totalVotos}`);
  console.log(`Lista de candidatos e votos : `);
  resultado.forEach((candidato) => {
    console.log(
      `Nome : ${candidato.nome}, Numero: ${candidato.numero}, Votos ${candidato.votos}`
    );
  });
}
main();
