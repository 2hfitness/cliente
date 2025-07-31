// Estado global
let slideWidth = 0;
let isScrolling;
let planoSelecionado = "";
let tipoMatricula = "nova"; // ou "renovacao"

// --- UTILITÁRIOS ---

function copiarParaAreaDeTransferencia(texto, msgSucesso, msgErro, elementoMsg) {
  navigator.clipboard.writeText(texto).then(() => {
    if (elementoMsg) {
      elementoMsg.innerHTML = msgSucesso;
      clearTimeout(elementoMsg.timeout);
      elementoMsg.timeout = setTimeout(() => (elementoMsg.innerHTML = ""), 2500);
    } else {
      alert(msgSucesso);
    }
  }).catch(() => {
    if (elementoMsg) {
      elementoMsg.innerHTML = msgErro;
      clearTimeout(elementoMsg.timeout);
      elementoMsg.timeout = setTimeout(() => (elementoMsg.innerHTML = ""), 2500);
    } else {
      alert(msgErro);
    }
  });
}

// --- PIX ---

function copiarPix() {
  const numeroPix = document.getElementById("pixNumero").innerText;
  copiarParaAreaDeTransferencia(numeroPix, "Chave Pix copiada com sucesso!", "Erro ao copiar Pix");
}

function copiarCodigoPix() {
  const codigo65 = "00020126580014BR.GOV.BCB.PIX013690349174-bd4e-4791-9580-ef12d35f621d520400005303986540565.005802BR5925Huila Machado de Lima Rib6009SAO PAULO621405100xNtMFtNvR63043C49";
  const codigo80 = "00020126580014BR.GOV.BCB.PIX013690349174-bd4e-4791-9580-ef12d35f621d520400005303986540580.005802BR5925Huila Machado de Lima Rib6009SAO PAULO62140510kkrivfM7Cd6304551A";
  const codigo = planoSelecionado.includes("80") ? codigo80 : codigo65;
  copiarParaAreaDeTransferencia(codigo, "QR Code copiado com sucesso!", "Erro ao copiar o código Pix");
}

// --- MAPA ---

function toggleExibicao(id, textoExibir, textoOcultar, botaoId) {
  const el = document.getElementById(id);
  const botao = document.getElementById(botaoId);
  const visivel = el.style.display === "block";
  el.style.display = visivel ? "none" : "block";
  botao.innerText = visivel ? textoExibir : textoOcultar;
}

function toggleMapa() {
  toggleExibicao("meuMapa", "Localização", "Ocultar Localização", "botaoMapa");
}


// --- CARROSSEL ---

const carousel = document.querySelector('.carousel-images');
const dots = document.querySelectorAll('.carousel-dots span');
const slides = document.querySelectorAll('.carousel-images img');
const prevButton = document.querySelector('.arrow-left');
const nextButton = document.querySelector('.arrow-right');

function updateDots(index) {
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) dots[index].classList.add('active');
}

function getCurrentIndex() {
  return Math.round(carousel.scrollLeft / slideWidth);
}

function goToSlide(index) {
  carousel.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
  updateDots(index);
}

function configurarCarrossel() {
  slideWidth = carousel.clientWidth;

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToSlide(idx));
  });

  prevButton.addEventListener('click', () => {
    const index = getCurrentIndex();
    goToSlide(Math.max(index - 1, 0));
  });

  nextButton.addEventListener('click', () => {
    const index = getCurrentIndex();
    goToSlide(Math.min(index + 1, slides.length - 1));
  });

  carousel.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      updateDots(getCurrentIndex());
    }, 100);
  });

  window.addEventListener('resize', () => {
    slideWidth = carousel.clientWidth;
  });

  slideWidth = carousel.clientWidth;
}

configurarCarrossel();

// --- MATRÍCULA ---

function abrirMatricula() {
  tipoMatricula = "nova";
  document.getElementById("modalMatricula").style.display = "block";
}

function mostrarPlano() {
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const celular = document.getElementById("celular").value.trim();
  const dataNascimento = document.getElementById("dataNascimento").value.trim();
  const email = document.getElementById("email").value.trim();
  const genero = document.getElementById("genero").value.trim();

  if (!nome || !cpf || !celular || !dataNascimento || !email || !genero) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!validarCPF(cpf)) {
    alert("CPF inválido.");
    return;
  }

  document.getElementById("modalMatricula").style.display = "none";
  document.getElementById("modalPlano").style.display = "block";
}

function mostrarQRCode(valor) {
  const qrImg = document.getElementById("qrCodeImagem");
  planoSelecionado = valor === "80" ? "Plano Mensal - R$80,00" : "Plano (3x por semana) - R$65,00";
  qrImg.src = valor === "80" ? "qr_code/qrcode 80.png" : "qr_code/qrcode 65.png";
  document.getElementById("qrcodeContainer").style.display = "block";
}

function fecharModais() {
  document.getElementById("modalPlano").style.display = "none";
  document.getElementById("modalMatricula").style.display = "block";
}

function abrirRenovacao() {
  tipoMatricula = "renovacao";
  document.getElementById("modalRenovacao").style.display = "block";
}

function mostrarPlanoRenovacao() {
  const nome = document.getElementById("nomeRenovacao").value.trim();
  if (!nome) {
    alert("Por favor, informe seu nome.");
    return;
  }
  document.getElementById("modalRenovacao").style.display = "none";
  document.getElementById("modalPlano").style.display = "block";
}

// --- WHATSAPP ---

function enviarPlanoWhatsApp() {
  enviarWhatsApp(planoSelecionado);
}

function enviarWhatsApp(plano) {
  const telefone = "5524999522320";
  let mensagem = "";

  if (tipoMatricula === "renovacao") {
    const nome = document.getElementById("nomeRenovacao").value.trim();
    mensagem = `*Renovação 2H.Fitness*\n👤 Nome: ${nome}\n🏋️ Plano Escolhido: ${plano}\n\n📎 Após o pagamento, envie o comprovante nesta conversa do WhatsApp.`;
  } else {
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value.trim();
    const email = document.getElementById("email").value.trim();
    const genero = document.getElementById("genero").value.trim();

    const [ano, mes, dia] = dataNascimento.split('-');

    mensagem = `*Matrícula 2H.Fitness*\n👤 Nome: ${nome}\n📄 CPF: ${cpf}\n📱 Celular: ${celular}\n🎂 Data de Nascimento: ${dia}/${mes}/${ano}\n✉️ Email: ${email}\n⚧️ Gênero: ${genero}\n🏋️ Plano Escolhido: ${plano}\n\n📎 Após o pagamento, envie o comprovante nesta conversa do WhatsApp.`;
  }

  const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, '_blank');

  // Fechar modais e limpar campos
  document.getElementById("modalPlano").style.display = "none";
  document.getElementById("modalMatricula").style.display = "none";
  document.getElementById("modalRenovacao").style.display = "none";

  if (tipoMatricula === "renovacao") {
    document.getElementById("nomeRenovacao").value = "";
  } else {
    ["nome", "cpf", "celular", "dataNascimento", "email", "genero"].forEach(id => {
      document.getElementById(id).value = "";
    });
  }
}

// --- FORMATADORES ---

function formatarCPF(input) {
  let valor = input.value.replace(/\D/g, "").slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2")
               .replace(/(\d{3})(\d)/, "$1.$2")
               .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  input.value = valor;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let dig1 = 11 - (soma % 11);
  if (dig1 >= 10) dig1 = 0;
  if (dig1 !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  let dig2 = 11 - (soma % 11);
  if (dig2 >= 10) dig2 = 0;
  return dig2 === parseInt(cpf[10]);
}

function formatarCelular(input) {
  let valor = input.value.replace(/\D/g, "").slice(0, 11);
  valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2")
               .replace(/(\d{5})(\d)/, "$1-$2");
  input.value = valor;
}

function abrirMapa() {
  document.getElementById("modalMapa").style.display = "block";
}

function fecharMapa() {
  document.getElementById("modalMapa").style.display = "none";
}

let sexoSelecionado = "";

function abrirModalIMC() {
  document.getElementById("modalIMC").style.display = "block";
}

function fecharModalIMC() {
  document.getElementById("modalIMC").style.display = "none";
}

function mostrarFormulario(sexo) {
  sexoSelecionado = sexo;
  document.getElementById("form-masculino").style.display = sexo === "masculino" ? "block" : "none";
  document.getElementById("form-feminino").style.display = sexo === "feminino" ? "block" : "none";
  document.getElementById("resultado-masc").innerHTML = "";
  document.getElementById("resultado-fem").innerHTML = "";

  // Limpa campos
  document.getElementById("altura-masc").value = "";
  document.getElementById("peso-masc").value = "";
  document.getElementById("altura-fem").value = "";
  document.getElementById("peso-fem").value = "";
}

function abrirMenu() {
  document.getElementById("menuLateral").style.left = "0";
  document.body.classList.add("menu-aberto");
}

function fecharMenu() {
  document.getElementById("menuLateral").style.left = "-260px";
  document.body.classList.remove("menu-aberto");
}


function fecharTodosModais() {
  const modais = document.querySelectorAll(".modal");
  modais.forEach(modal => {
    modal.style.display = "none";
  });
}


function calcularIMCePesoIdeal() {
  if (!sexoSelecionado) {
    alert("Selecione o sexo.");
    return;
  }

  const alturaId = sexoSelecionado === "masculino" ? "altura-masc" : "altura-fem";
  const pesoId = sexoSelecionado === "masculino" ? "peso-masc" : "peso-fem";
  const resultadoId = sexoSelecionado === "masculino" ? "resultado-masc" : "resultado-fem";

  const alturaCm = parseFloat(document.getElementById(alturaId).value);
  const peso = parseFloat(document.getElementById(pesoId).value);

  if (!alturaCm || alturaCm <= 0 || !peso || peso <= 0) {
    alert("Preencha altura e peso corretamente.");
    return;
  }

  const alturaM = alturaCm / 100;
  const imc = peso / (alturaM * alturaM);
  const fator = sexoSelecionado === "masculino" ? 22 : 21;
  const pesoIdeal = fator * alturaM * alturaM;

  let interpretacao = "";

  if (imc < 18.5) {
    interpretacao = "Baixo peso";
  } else if (imc < 25) {
    interpretacao = "Peso normal";
  } else if (imc < 30) {
    interpretacao = "Sobrepeso";
  } else if (imc < 40) {
    interpretacao = "Obesidade";
  } else {
    interpretacao = "Obesidade grave";
  }

  document.getElementById(resultadoId).innerHTML = `
    <p>🧮 Seu IMC é <b>${imc.toFixed(1)}</b> (${interpretacao})</p>
    <p>✅ Peso ideal estimado: <b>${pesoIdeal.toFixed(1)} kg</b></p>
  `;
}


// Fechar modais ao clicar fora
window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
}

document.addEventListener("click", function (event) {
  const menu = document.getElementById("menuLateral");
  const toggleBtn = document.querySelector(".menu-toggle");
  const estaAberto = menu.style.left === "0px";
  const clicouDentroDoMenu = menu.contains(event.target);
  const clicouNoBotaoMenu = toggleBtn.contains(event.target);

  // Se o menu estiver aberto e clicou fora dele (mas não no botão ☰)
  if (estaAberto && !clicouDentroDoMenu && !clicouNoBotaoMenu) {
    event.stopPropagation();      // Impede que o clique afete o restante da página
    event.preventDefault();       // Evita que links como o Instagram sejam abertos
    fecharMenu();
    return;
  }
});
