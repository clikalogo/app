////////////////////////////////////
//script.js
//v0.1.2 - v06082025_0910
////////////////////////////////////

let userId = null; // ID do usuário após login
let uId = null; // UUID do usuário após login
let uKey = null; // Chave de acesso temporária do usuário após login
let lojaAtual = null; // Armazena a loja selecionada atualmente

// Função para gerenciar o foco entre os campos do PIN code
function focusNextInput(el, prevId, nextId) {
  if (el.value.length === 0) {
    if (prevId) {
      document.getElementById(prevId).focus();
    }
  } else {
    if (nextId) {
      document.getElementById(nextId).focus();
    }
  }
}

// Inicializar os campos do PIN code
document.querySelectorAll('[data-focus-input-init]').forEach(function(element) {
  element.addEventListener('keyup', function() {
    const prevId = this.getAttribute('data-focus-input-prev');
    const nextId = this.getAttribute('data-focus-input-next');
    focusNextInput(this, prevId, nextId);
  });
  
  // Tratar evento de colar para dividir o código colado em cada input
  element.addEventListener('paste', function(event) {
    event.preventDefault();
    const pasteData = (event.clipboardData || window.clipboardData).getData('text');
    const digits = pasteData.replace(/\D/g, ''); // Apenas números do texto colado

    // Obter todos os campos de entrada
    const inputs = document.querySelectorAll('[data-focus-input-init]');
    
    // Iterar sobre os inputs e atribuir valores da string colada
    inputs.forEach((input, index) => {
      if (digits[index]) {
        input.value = digits[index];
        // Focar no próximo input após preencher o atual
        const nextId = input.getAttribute('data-focus-input-next');
        if (nextId) {
          document.getElementById(nextId).focus();
        }
      }
    });
  });
});

// Pop-up de Login
document.getElementById('loginButton').addEventListener('click', async () => {
  const loginButton = document.getElementById('loginButton');
  
  // Obter o código PIN completo dos 6 campos
  const code1 = document.getElementById('code-1').value;
  const code2 = document.getElementById('code-2').value;
  const code3 = document.getElementById('code-3').value;
  const code4 = document.getElementById('code-4').value;
  const code5 = document.getElementById('code-5').value;
  const code6 = document.getElementById('code-6').value;
  
  // Combinar os dígitos em uma única chave
  const key = code1 + code2 + code3 + code4 + code5 + code6;
  
  if (!key || key.length !== 6) {
    showToast('Por favor, insira o código de 6 dígitos completo.', 'error');
    return;
  }

  loginButton.disabled = true;
  loginButton.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Entrando...';

  try {
    const response = await fetch('https://webhook.clikalogo.com/webhook/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key })
    });

    const data = await response.json();

    if (data.success) {
      userId = data.userId;
      uId = data.uId; // UUID do usuário após login
      uKey = data.uKey; // Chave de acesso temporária do usuário após login
      document.getElementById('loginPopup').classList.add('hidden');
      
      // Mostrar a tela de seleção de loja ao invés da página principal
      document.getElementById('mercadoLivrePage').classList.add('hidden');
      document.getElementById('selecaoLoja').classList.remove('hidden');
      
      showToast(data.message || 'Login realizado com sucesso!', 'success');
    } else {
      showToast(data.message || 'Chave de acesso inválida.', 'error');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    showToast('Erro ao fazer login. Tente novamente.', 'error');
  } finally {
    loginButton.disabled = false;
    loginButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg"><path d="M416 160L480 160C497.7 160 512 174.3 512 192L512 448C512 465.7 497.7 480 480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L480 544C533 544 576 501 576 448L576 192C576 139 533 96 480 96L416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160zM406.6 342.6C419.1 330.1 419.1 309.8 406.6 297.3L278.6 169.3C266.1 156.8 245.8 156.8 233.3 169.3C220.8 181.8 220.8 202.1 233.3 214.6L306.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L306.7 352L233.3 425.4C220.8 437.9 220.8 458.2 233.3 470.7C245.8 483.2 266.1 483.2 278.6 470.7L406.6 342.7z"/></svg> Entrar';
  }
});

// Função para navegar entre as telas
function navegarParaTela(tela) {
  // Ocultar todas as telas
  document.getElementById('selecaoLoja').classList.add('hidden');
  document.getElementById('mercadoLivrePage').classList.add('hidden');
  document.getElementById('shopeePage').classList.add('hidden');
  document.getElementById('magaluPage').classList.add('hidden');
  
  // Mostrar a tela selecionada
  document.getElementById(tela).classList.remove('hidden');
}

// Event listeners para os cards de seleção de loja
document.getElementById('cardMercadoLivre').addEventListener('click', function() {
  lojaAtual = 'mercadolivre';
  navegarParaTela('mercadoLivrePage');
});

document.getElementById('cardShopee').addEventListener('click', function() {
  lojaAtual = 'shopee';
  navegarParaTela('shopeePage');
});

document.getElementById('cardMagalu').addEventListener('click', function() {
  lojaAtual = 'magalu';
  navegarParaTela('magaluPage');
});

// Event listeners para os botões de voltar
document.getElementById('voltarMercadoLivre').addEventListener('click', function() {
  navegarParaTela('selecaoLoja');
});

document.getElementById('voltarShopee').addEventListener('click', function() {
  navegarParaTela('selecaoLoja');
});

document.getElementById('voltarMagalu').addEventListener('click', function() {
  navegarParaTela('selecaoLoja');
});

// Mostrar/ocultar campos com base na seleção do destino - Mercado Livre
document.getElementById('destino').addEventListener('change', function() {
  const numeroWhatsappContainer = document.getElementById('numero_whatsapp_container');
  const usuarioTelegramContainer = document.getElementById('usuario_telegram_container');
  
  // Esconder todos os containers primeiro
  numeroWhatsappContainer.classList.add('hidden');
  usuarioTelegramContainer.classList.add('hidden');
  
  // Mostrar o container apropriado com base na seleção
  if (this.value === 'numero_whatsapp') {
    numeroWhatsappContainer.classList.remove('hidden');
  } else if (this.value === 'usuario_telegram') {
    usuarioTelegramContainer.classList.remove('hidden');
  }
});

// Mostrar/ocultar campos com base na seleção do destino - Shopee
document.getElementById('destino_shopee').addEventListener('change', function() {
  const numeroWhatsappContainer = document.getElementById('numero_whatsapp_container_shopee');
  const usuarioTelegramContainer = document.getElementById('usuario_telegram_container_shopee');
  
  // Esconder todos os containers primeiro
  numeroWhatsappContainer.classList.add('hidden');
  usuarioTelegramContainer.classList.add('hidden');
  
  // Mostrar o container apropriado com base na seleção
  if (this.value === 'numero_whatsapp') {
    numeroWhatsappContainer.classList.remove('hidden');
  } else if (this.value === 'usuario_telegram') {
    usuarioTelegramContainer.classList.remove('hidden');
  }
});

// Mostrar/ocultar campos com base na seleção do destino - Magalu
document.getElementById('destino_magalu').addEventListener('change', function() {
  const numeroWhatsappContainer = document.getElementById('numero_whatsapp_container_magalu');
  const usuarioTelegramContainer = document.getElementById('usuario_telegram_container_magalu');
  
  // Esconder todos os containers primeiro
  numeroWhatsappContainer.classList.add('hidden');
  usuarioTelegramContainer.classList.add('hidden');
  
  // Mostrar o container apropriado com base na seleção
  if (this.value === 'numero_whatsapp') {
    numeroWhatsappContainer.classList.remove('hidden');
  } else if (this.value === 'usuario_telegram') {
    usuarioTelegramContainer.classList.remove('hidden');
  }
});

// Função genérica para validar formulários
function validarFormulario(produtoUrl, destino, numeroWhatsapp, usuarioTelegramId, tipoLoja) {
  // Validar se a URL foi informada
  if (!produtoUrl) {
    showToast(`Por favor, informe a URL do produto ${tipoLoja}.`, 'error');
    return false;
  }
  
  // Validar URL conforme a loja
  if (tipoLoja === 'do Mercado Livre') {
    if (!produtoUrl.includes('mercadolivre.com.br') && !produtoUrl.includes('mercadolibre.com')) {
      showToast('Por favor, informe uma URL válida do Mercado Livre.', 'error');
      return false;
    }
  } else if (tipoLoja === 'da Shopee') {
    if (!produtoUrl.includes('shopee.com.br')) {
      showToast('Por favor, informe uma URL válida da Shopee.', 'error');
      return false;
    }
  } else if (tipoLoja === 'do Magalu') {
    if (!produtoUrl.includes('magazineluiza.com.br') && !produtoUrl.includes('magalu.com')) {
      showToast('Por favor, informe uma URL válida do Magalu.', 'error');
      return false;
    }
  }
  
  // Validar se o destino foi selecionado
  if (!destino) {
    showToast('Por favor, selecione o destino.', 'error');
    return false;
  }
  
  // Validar número de WhatsApp se for o destino selecionado
  if (destino === 'numero_whatsapp') {
    if (!numeroWhatsapp) {
      showToast('Por favor, informe o número de WhatsApp.', 'error');
      return false;
    }
    
    // Validação básica do formato do número
    if (!/^\d{10,11}$/.test(numeroWhatsapp)) {
      showToast('Por favor, informe um número de WhatsApp válido com DDD (ex.: 11999999999).', 'error');
      return false;
    }
  }
  
  // Validar ID do usuário Telegram se for o destino selecionado
  if (destino === 'usuario_telegram') {
    if (!usuarioTelegramId) {
      showToast('Por favor, informe o ID do usuário Telegram.', 'error');
      return false;
    }
    
    // Validação básica do formato do ID Telegram (apenas números)
    if (!/^\d+$/.test(usuarioTelegramId)) {
      showToast('Por favor, informe um ID de usuário Telegram válido (apenas números).', 'error');
      return false;
    }
  }
  
  return true;
}

// Função para limpar formulários
function limparFormulario(urlId, destinoId, numeroWhatsappId, numeroWhatsappContainerId, usuarioTelegramId, usuarioTelegramContainerId) {
  document.getElementById(urlId).value = '';
  document.getElementById(destinoId).selectedIndex = 0;
  
  // Resetar o toggle "Gerar template" para desmarcado
  if (document.getElementById('gerarTemplate')) {
    document.getElementById('gerarTemplate').checked = false;
  }
  
  // Limpar e ocultar campo de WhatsApp
  if (numeroWhatsappId) {
    document.getElementById(numeroWhatsappId).value = '';
  }
  if (numeroWhatsappContainerId) {
    document.getElementById(numeroWhatsappContainerId).classList.add('hidden');
  }
  
  // Limpar e ocultar campo de Telegram
  if (usuarioTelegramId) {
    document.getElementById(usuarioTelegramId).value = '';
  }
  if (usuarioTelegramContainerId) {
    document.getElementById(usuarioTelegramContainerId).classList.add('hidden');
  }
}

// Botão de geração - Mercado Livre
document.getElementById('gerarLink').addEventListener('click', async () => {
  const gerarLink = document.getElementById('gerarLink');
  const produtoUrl = document.getElementById('produto_url').value;
  const destino = document.getElementById('destino').value;
  const numeroWhatsapp = destino === 'numero_whatsapp' ? document.getElementById('numero_whatsapp').value : null;
  const usuarioTelegramId = destino === 'usuario_telegram' ? document.getElementById('usuario_telegram').value : null;
  // Verificar se o toggle de template está ativado
  const gerarTemplate = document.getElementById('gerarTemplate').checked;

  // Validar formulário
  if (!validarFormulario(produtoUrl, destino, numeroWhatsapp, usuarioTelegramId, 'do Mercado Livre')) {
    return;
  }

  // Não precisamos mais esconder resultado anterior, pois usaremos toast

  // Adicionar loading ao botão de análise
  gerarLink.disabled = true;
  const originalText = gerarLink.innerHTML;
  gerarLink.innerHTML = '<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>Gerando...';

  try {
    // Criar FormData para envio
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('uKey', uKey); // Chave de acesso temporária do usuário após login
    formData.append('produto_url', produtoUrl); // URL do produto
    formData.append('destino', destino); // Destino selecionado
    formData.append('gerar_template', gerarTemplate ? '1' : '0'); // Adicionar flag de template
    
    // Adicionar número de WhatsApp se for o destino selecionado
    if (destino === 'numero_whatsapp') {
      formData.append('numero_whatsapp', document.getElementById('numero_whatsapp').value);
    }
    
    // Adicionar ID do usuário Telegram se for o destino selecionado
    if (destino === 'usuario_telegram') {
      formData.append('usuario_telegram_id', document.getElementById('usuario_telegram').value);
    }

    // Enviar para o webhook de geração - Mercado Livre
    const response = await fetch('https://webhook.clikalogo.com/webhook/gerador_mercadolivre', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    // Analisar a resposta do servidor
    if (result.success) {
      // Limpar os campos do formulário para novas inserções
      limparFormulario('produto_url', 'destino', 'numero_whatsapp', 'numero_whatsapp_container', 'usuario_telegram', 'usuario_telegram_container');
      
      // Exibe o resultado da geração como toast de sucesso
      showToast(result.message, 'success');
      
      // Verifica se o template foi retornado e exibe o modal
      if (result.template) {
        const templateImage = document.getElementById('templateImage');
        templateImage.src = result.template.startsWith('data:')
          ? result.template
          : 'data:image/png;base64,' + result.template;

        // Preencher o campo de link de afiliado se existir na resposta
        if (result.linkAfiliado) {
          const linkAfiliadoInput = document.getElementById('linkAfiliado');
          linkAfiliadoInput.value = result.linkAfiliado;
          
          // Adicionar funcionalidade ao botão de copiar link
          const copyLinkBtn = document.getElementById('copyLinkBtn');
          copyLinkBtn.onclick = function() {
            linkAfiliadoInput.select();
            document.execCommand('copy');
            // Feedback visual de cópia
            const originalText = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Copiado!';
            copyLinkBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            copyLinkBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            
            setTimeout(function() {
              copyLinkBtn.innerHTML = originalText;
              copyLinkBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
              copyLinkBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }, 2000);
            
            // Exibir toast de confirmação
            showToast('Link de afiliado copiado para a área de transferência!', 'success');
          };
        }

        const modalEl = document.getElementById('templateModal');
        const modal = new Modal(modalEl);

        // Adiciona funcionalidade ao botão de download
        const downloadButton = document.getElementById('downloadTemplate');
        downloadButton.onclick = function () {
          const link = document.createElement('a');
          link.href = templateImage.src;
          link.download = 'template_mercadolivre_' + Date.now() + '.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        modal.show(); // <-- abre o modal automaticamente          
        showToast('Template gerado com sucesso!', 'success'); // <-- exibe toast de sucesso
        // Adiciona funcionalidade ao botão de fechar
        document.querySelectorAll('[data-modal-hide="templateModal"]').forEach((btn) => {
          btn.onclick = () => modal.hide();
        });

      }

    } else {
      // Exibe o erro ao usuário como toast de erro
      showToast(result.message || 'Erro ao processar sua solicitação.', 'error');
    }

  } catch (error) {
    showToast('Ocorreu um erro ao processar sua solicitação.', 'error');
  } finally {
    gerarLink.disabled = false;
    gerarLink.innerHTML = originalText;
  }
});

// Função para exibir toasts (notificações)
function showToast(message, type = 'info') {
  // Não remover toasts anteriores, apenas reposicionar os existentes
  const allToasts = document.querySelectorAll('.toast');
  
  // Criar novo toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} fixed flex items-center p-4 mb-4 text-gray-500 rounded-lg shadow z-50`;
  
  // Definir tamanho baseado no tipo
  if (type === 'success') {
    toast.classList.add('right-4', 'max-w-sm');
  } else {
    toast.classList.add('right-4', 'max-w-xs');
  }
  
  // Calcular a posição vertical para evitar sobreposição
  let topPosition = 16; // 4rem = 16px
  
  // Para cada toast existente, adicionar sua altura + margem
  allToasts.forEach(existingToast => {
    topPosition += existingToast.offsetHeight + 16; // altura + 1rem (16px) de margem
  });
  
  let bgColor = 'bg-white';
  let icon = '';
  let textColor = 'text-gray-500';
  let borderColor = 'border-gray-200';
  
  if (type === 'error') {
    bgColor = 'bg-red-900/90';
    textColor = 'text-red-300';
    borderColor = 'border-red-300';
    icon = `<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
              </svg>
              <span class="sr-only">Erro</span>
            </div>`;
  } else if (type === 'success') {
    bgColor = 'bg-green-900/90';
    textColor = 'text-green-300';
    borderColor = 'border-green-300';
    icon = `<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              <span class="sr-only">Sucesso</span>
            </div>`;
  } else {
    bgColor = 'bg-blue-900/90';
    textColor = 'text-blue-300';
    borderColor = 'border-blue-300';
    icon = `<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
              </svg>
              <span class="sr-only">Info</span>
            </div>`;
  }
  
  // Aplicar a posição vertical calculada
  toast.style.top = `${topPosition}px`;
  toast.className = `toast fixed right-4 flex items-center w-full p-4 mb-4 ${textColor} ${bgColor} ${borderColor} rounded-lg shadow z-50`;
  
  // Ajustar largura máxima baseada no tipo
  if (type === 'success') {
    toast.classList.add('max-w-sm');
  } else {
    toast.classList.add('max-w-xs');
  }
  
  toast.innerHTML = `
    ${icon}
    <div class="ml-3 text-sm font-normal">${message}</div>
    <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" data-dismiss-target="#toast-danger" aria-label="Close">
      <span class="sr-only">Fechar</span>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  `;
  
  document.body.appendChild(toast);
  
  // Adicionar evento de clique para fechar
  toast.querySelector('button').addEventListener('click', () => toast.remove());
  
  // Auto-remover após 10 segundos
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.remove();
    }
  }, 10000);
}

// Botão de geração - Shopee
document.getElementById('gerarLinkShopee').addEventListener('click', async () => {
  const gerarLinkShopee = document.getElementById('gerarLinkShopee');
  const produtoUrl = document.getElementById('produto_url_shopee').value;
  const destino = document.getElementById('destino_shopee').value;
  const numeroWhatsapp = destino === 'numero_whatsapp' ? document.getElementById('numero_whatsapp_shopee').value : null;
  const usuarioTelegramId = destino === 'usuario_telegram' ? document.getElementById('usuario_telegram_shopee').value : null;

  // Validar formulário
  if (!validarFormulario(produtoUrl, destino, numeroWhatsapp, usuarioTelegramId, 'da Shopee')) {
    return;
  }

  // Adicionar loading ao botão
  gerarLinkShopee.disabled = true;
  const originalText = gerarLinkShopee.innerHTML;
  gerarLinkShopee.innerHTML = '<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>Gerando...';

  try {
    // Criar FormData para envio
    const formData = new FormData();
    formData.append('userId', userId); // ID do usuário
    formData.append('uKey', uKey); // Chave de acesso temporária do usuário após login
    formData.append('produto_url', produtoUrl); // URL do produto
    formData.append('destino', destino); // Destino selecionado
    
    // Adicionar número de WhatsApp se for o destino selecionado
    if (destino === 'numero_whatsapp') {
      formData.append('numero_whatsapp', numeroWhatsapp);
    }
    
    // Adicionar ID do usuário Telegram se for o destino selecionado
    if (destino === 'usuario_telegram') {
      formData.append('usuario_telegram_id', usuarioTelegramId);
    }

    // Enviar para o webhook de geração - Shopee
    const response = await fetch('https://webhook.clikalogo.com/webhook/gerador_shopee', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    // Analisar a resposta do servidor
    if (result.success) {
      // Limpar os campos do formulário para novas inserções
      limparFormulario('produto_url_shopee', 'destino_shopee', 'numero_whatsapp_shopee', 'numero_whatsapp_container_shopee', 'usuario_telegram_shopee', 'usuario_telegram_container_shopee');
      
      // Exibe o resultado da geração como toast de sucesso
      showToast(result.message, 'success');
    } else {
      // Exibe o erro ao usuário como toast de erro
      showToast(result.message || 'Erro ao processar sua solicitação.', 'error');
    }

  } catch (error) {
    showToast('Ocorreu um erro ao processar sua solicitação.', 'error');
  } finally {
    gerarLinkShopee.disabled = false;
    gerarLinkShopee.innerHTML = originalText;
  }
});

// Botão de geração - Magalu
document.getElementById('gerarLinkMagalu').addEventListener('click', async () => {
  const gerarLinkMagalu = document.getElementById('gerarLinkMagalu');
  const produtoUrl = document.getElementById('produto_url_magalu').value;
  const destino = document.getElementById('destino_magalu').value;
  const numeroWhatsapp = destino === 'numero_whatsapp' ? document.getElementById('numero_whatsapp_magalu').value : null;
  const usuarioTelegramId = destino === 'usuario_telegram' ? document.getElementById('usuario_telegram_magalu').value : null;

  // Validar formulário
  if (!validarFormulario(produtoUrl, destino, numeroWhatsapp, usuarioTelegramId, 'do Magalu')) {
    return;
  }

  // Adicionar loading ao botão
  gerarLinkMagalu.disabled = true;
  const originalText = gerarLinkMagalu.innerHTML;
  gerarLinkMagalu.innerHTML = '<svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>Gerando...';

  try {
    // Criar FormData para envio
    const formData = new FormData();
    formData.append('userId', userId); // ID do usuário
    formData.append('uKey', uKey); // Chave de acesso temporária do usuário após login
    formData.append('produto_url', produtoUrl); // URL do produto
    formData.append('destino', destino); // Destino selecionado
    
    // Adicionar número de WhatsApp se for o destino selecionado
    if (destino === 'numero_whatsapp') {
      formData.append('numero_whatsapp', numeroWhatsapp);
    }
    
    // Adicionar ID do usuário Telegram se for o destino selecionado
    if (destino === 'usuario_telegram') {
      formData.append('usuario_telegram_id', usuarioTelegramId);
    }

    // Enviar para o webhook de geração - Magalu
    const response = await fetch('https://webhook.clikalogo.com/webhook/gerador_magalu', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    // Analisar a resposta do servidor
    if (result.success) {
      // Limpar os campos do formulário para novas inserções
      limparFormulario('produto_url_magalu', 'destino_magalu', 'numero_whatsapp_magalu', 'numero_whatsapp_container_magalu', 'usuario_telegram_magalu', 'usuario_telegram_container_magalu');
      
      // Exibe o resultado da geração como toast de sucesso
      showToast(result.message, 'success');
    } else {
      // Exibe o erro ao usuário como toast de erro
      showToast(result.message || 'Erro ao processar sua solicitação.', 'error');
    }

  } catch (error) {
    showToast('Ocorreu um erro ao processar sua solicitação.', 'error');
  } finally {
    gerarLinkMagalu.disabled = false;
    gerarLinkMagalu.innerHTML = originalText;
  }
});
