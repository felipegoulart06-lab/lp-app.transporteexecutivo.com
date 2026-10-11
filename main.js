(function travarZoomNoCelular() {
  var ua = navigator.userAgent || "";
  var ipad = /iPad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var celular = /iPhone|iPod|Windows Phone|IEMobile|Android.+Mobile|webOS|BlackBerry|Opera Mini/i.test(ua);
  if (!celular || ipad) return;

  var meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute(
      "content",
      "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
    );
  }
  document.documentElement.classList.add("so-celular");

  var bloquearPinça = function (evento) {
    if (evento.touches && evento.touches.length > 1) evento.preventDefault();
  };
  document.addEventListener("touchmove", bloquearPinça, { passive: false });
  ["gesturestart", "gesturechange", "gestureend"].forEach(function (nome) {
    document.addEventListener(nome, function (evento) { evento.preventDefault(); }, { passive: false });
  });
})();

const modulos = [
  {
    id: "transfer",
    nome: "Transfer",
    kicker: "Pedido, reserva e contrato",
    texto:
      "O transfer começa numa solicitação: origem, destino, horário e passageiros. Confirmada, vira reserva com motorista e veículo. O contrato do produto fica no mesmo fluxo, com o cabeçalho da empresa.",
    pontos: ["Solicitações", "Reservas", "Contrato"],
  },
  {
    id: "grupos",
    nome: "Grupos",
    kicker: "Ida, volta e vários passageiros",
    texto:
      "Viagem de grupo tem solicitação, reserva e contrato próprios. Ida e volta podem nascer juntas, ligadas, sem duplicar o cadastro à mão. A agenda trata esse serviço junto com o transfer.",
    pontos: ["Solicitações de grupo", "Reservas vinculadas", "Contrato de grupos"],
  },
  {
    id: "motoristas",
    nome: "Motoristas",
    kicker: "Ficha e agenda no celular",
    texto:
      "Cada motorista tem cadastro e documentos da frota. No app, a agenda do dia mostra o serviço que é dele. O acesso da viagem também pode chegar por link, sem espalhar a senha do painel.",
    pontos: ["Cadastros", "Documentos", "Agenda da frota"],
  },
  {
    id: "veiculos",
    nome: "Veículos",
    kicker: "A frota com nome e foto",
    texto:
      "O veículo deixa de ser uma observação no pedido. Fica cadastrado, com imagem, e entra na reserva que vai usar aquele carro.",
    pontos: ["Cadastro da frota", "Imagens", "Uso na reserva"],
  },
  {
    id: "clientes",
    nome: "Clientes",
    kicker: "Quem pede a viagem",
    texto:
      "O cliente da operação tem ficha própria, com os documentos do cadastro. A reserva aponta para essa pessoa em vez de repetir os dados em cada serviço.",
    pontos: ["Cadastro", "Documentos", "Histórico na operação"],
  },
  {
    id: "financeiro",
    nome: "Financeiro",
    kicker: "O que a viagem gerou",
    texto:
      "O mês aparece em faturado, recebido, pendente e lucro estimado. Lançamentos manuais convivem com as receitas que saem das reservas de transfer e de grupos. Faturado é a cobrança depois do serviço. Relatórios separam o período e as viagens que mais rendem.",
    pontos: ["Dashboard", "A receber", "Faturado", "A pagar", "Relatórios"],
  },
  {
    id: "mapa",
    nome: "Mapa e agenda",
    kicker: "Onde e quando",
    texto:
      "A abrangência marca um ponto por viagem, no embarque da primeira partida. A agenda mostra o mês das reservas de transfer e de grupos. Métricas acompanham desempenho, canais e destinos.",
    pontos: ["Abrangência", "Agenda", "Métricas"],
  },
  {
    id: "rastreio",
    nome: "Rastreio",
    kicker: "O cliente vê a posição",
    texto:
      "A geolocalização envia a posição da viagem. O cliente abre um link público de rastreio e acompanha o carro sem receber acesso ao painel da empresa.",
    pontos: ["Geolocalização", "Link do cliente"],
  },
  {
    id: "comunicacao",
    nome: "Comunicação",
    kicker: "WhatsApp, e-mail e captação",
    texto:
      "O comunicador liga o WhatsApp da operação por QR Code, e os envios saem dessa conta. O e-mail conecta o Gmail. Campanhas, site, domínios, receptivos e QR Codes ficam no mesmo painel de quem já opera a viagem.",
    pontos: ["WhatsApp", "Gmail", "Campanhas", "Site", "QR Code"],
  },
  {
    id: "sistema",
    nome: "Casa da operação",
    kicker: "Configuração e rotina",
    texto:
      "A empresa guarda os dados do perfil, as automações por webhook e as anotações do dia. Chamados de suporte ficam dentro do sistema. Uma conta autenticada permanece em um aparelho por vez.",
    pontos: ["Configurações", "Automações", "Anotações", "Um login"],
  },
];

const lista = document.querySelector("#modulos");
const painel = document.querySelector("#modulo-painel");

function desenhar(id) {
  const item = modulos.find((m) => m.id === id) || modulos[0];
  lista.querySelectorAll(".mod").forEach((botao) => {
    botao.setAttribute("aria-selected", String(botao.dataset.id === item.id));
  });
  painel.innerHTML = `
    <p class="kicker">${item.kicker}</p>
    <h3>${item.nome}</h3>
    <p class="body">${item.texto}</p>
    <ul class="points">${item.pontos.map((p) => `<li>${p}</li>`).join("")}</ul>
  `;
}

modulos.forEach((item) => {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "mod";
  botao.dataset.id = item.id;
  botao.setAttribute("role", "tab");
  botao.setAttribute("aria-selected", "false");
  botao.textContent = item.nome;
  botao.addEventListener("click", () => desenhar(item.id));
  lista.appendChild(botao);
});
desenhar(modulos[0].id);

const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector("#menu-mobile");
menuBtn.addEventListener("click", () => {
  const aberto = menu.hasAttribute("hidden");
  menu.toggleAttribute("hidden", !aberto);
  menuBtn.setAttribute("aria-expanded", String(aberto));
  menuBtn.textContent = aberto ? "Fechar" : "Menu";
});
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "Menu";
  });
});

const nav = document.querySelector(".nav");
const marcarNav = () => nav.classList.toggle("is-stuck", window.scrollY > 8);
marcarNav();
window.addEventListener("scroll", marcarNav, { passive: true });

const fecharMenu = () => {
  menu.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.textContent = "Menu";
};
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) fecharMenu();
});

const aviso = document.querySelector("#aviso-apk");
let apkDisponivel = null;

async function temApk() {
  if (apkDisponivel !== null) return apkDisponivel;
  if (location.protocol === "file:") return true;
  try {
    const resposta = await fetch("./downloads/E-TRANSPORTE-Frota.apk", { method: "HEAD" });
    apkDisponivel = resposta.ok || resposta.status === 405;
  } catch {
    apkDisponivel = true;
  }
  return apkDisponivel;
}

document.querySelectorAll("[data-download]").forEach((link) => {
  link.addEventListener("click", async (evento) => {
    const existe = await temApk();
    if (existe) return;
    evento.preventDefault();
    aviso.showModal();
  });
});
