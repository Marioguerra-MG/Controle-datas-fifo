const nomeItem = document.querySelector("#nomeItem");
const dataItem = document.querySelector("#dataItem");
const quantidadeItem = document.querySelector("#quantidadeItem");

const tbody = document.querySelector("tbody");
const add = document.querySelector("#add");
const pesquisar = document.querySelector("#pesquisar");
const modal = document.querySelector(".modalConteiner");
const procurar = document.querySelector("#procurar");
const modalTbody = document.getElementById("modalTbody");

const getDatasBD = () => JSON.parse(localStorage.getItem("bdDatas")) ?? [];
const setDatasBD = (datas) => localStorage.setItem("bdDatas", JSON.stringify(datas));

let bdDatas = getDatasBD();
let id = undefined;

// Função para abrir o modal
pesquisar.addEventListener("click", function () {
    modal.style.display = "flex";
});

// Função para fechar o modal
document.getElementById("fecharModal").addEventListener("click", function () {
    modal.style.display = "none";
    modalTbody.innerHTML = "";
});

// Função para converter data do formato YYYY-MM-DD para DD/MM/YYYY
function formatarDataParaBr(data) {
    if (!data) return "";
    let [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Função para formatar entrada do usuário (DDMMAAAA → DD/MM/AAAA)
function formatarEntradaData(valor) {
    valor = valor.replace(/\D/g, ""); // Remove tudo que não for número

    if (valor.length > 2) valor = valor.substring(0, 2) + "/" + valor.substring(2);
    if (valor.length > 5) valor = valor.substring(0, 5) + "/" + valor.substring(5);

    return valor;
}

// Aplicar a formatação e atualizar o placeholder dinâmico no campo de pesquisa
procurar.addEventListener("input", function () {
    let valorFormatado = formatarEntradaData(this.value);
    this.value = valorFormatado;

    // Definir placeholder dinâmico (mostra onde digitar)
    let basePlaceholder = "00/00/0000";
    let placeholderAtual = basePlaceholder.split("");

    for (let i = 0; i < valorFormatado.length; i++) {
        placeholderAtual[i] = valorFormatado[i];
    }

    this.placeholder = placeholderAtual.join("");
    
});

// Função para inserir dados na tabela principal
function inserirDadosTabela(item, index) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
        <td data-label="Nome-Item">${item.nomeItem}</td>
        <td data-label="Data-Item">${formatarDataParaBr(item.dataItem)}</td>
        <td data-label="Quantidade">${item.quantidadeItem}</td>
        <td class="acao">
            <button id="deletar" onclick="deleteItem(${index})"><i class="fa fa-trash"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

// Função para adicionar ou editar um item
add.addEventListener("click", (e) => {
    e.preventDefault();

    if (!nomeItem.value || !dataItem.value || !quantidadeItem.value) {
        alert("Por favor, preencha todos os campos");
        return;
    }

    if (id !== undefined) {
        bdDatas[id] = {
            nomeItem: nomeItem.value,
            dataItem: dataItem.value, // Armazena no formato YYYY-MM-DD
            quantidadeItem: quantidadeItem.value
        };
    } else {
        bdDatas.push({
            nomeItem: nomeItem.value,
            dataItem: dataItem.value, // Armazena no formato YYYY-MM-DD
            quantidadeItem: quantidadeItem.value
        });
    }

    setDatasBD(bdDatas);

    // Limpar campos
    nomeItem.value = "";
    dataItem.value = "";
    quantidadeItem.value = "";
    id = undefined;

    atualizarTabela();
});

// Atualizar tabela principal
function atualizarTabela() {
    tbody.innerHTML = "";
    bdDatas.sort((a, b) => new Date(a.dataItem) - new Date(b.dataItem));

    bdDatas.forEach((item, index) => inserirDadosTabela(item, index));
}

// Função para deletar um item
function deleteItem(index) {
    bdDatas.splice(index, 1);
    setDatasBD(bdDatas);
    atualizarTabela();
}

// Carregar dados na tabela principal ao iniciar
atualizarTabela();

// Função de pesquisa para o modal
procurar.addEventListener("input", function () {
    const searchValue = this.value.trim();
    modalTbody.innerHTML = "";

    if (searchValue === "") return;

    // Verifica se a data digitada está no formato DD/MM/YYYY
    function isValidDate(dateString) {
        const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
        return regexData.test(dateString);
    }

    const dataFiltradas = bdDatas.filter(item => {
        let dataFormatadaBr = formatarDataParaBr(item.dataItem);
        return isValidDate(searchValue) && dataFormatadaBr === searchValue;
    });

    if (dataFiltradas.length === 0) {
        modalTbody.innerHTML = `<tr><td colspan="3">Nenhum item encontrado.</td></tr>`;
    } else {
        dataFiltradas.forEach(item => {
            let tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${item.nomeItem}</td>
                <td>${formatarDataParaBr(item.dataItem)}</td>
                <td>${item.quantidadeItem}</td>
            `;

            modalTbody.appendChild(tr);
        });

        procurar.value = '';
}

/* Evento para gerar o PDF
document.getElementById("btnImprimirPDF").addEventListener("click", function () {
    gerarPDF();
});*/





// Função para gerar o PDF
/*function gerarPDF() {
    if (!window.jspdf) {
        console.error("jsPDF não está carregado.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título do relatório
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório de Itens Filtrados", 10, 10);

    let linhaAtual = 20;

    // Adiciona os cabeçalhos da tabela
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Nome do Item", 10, linhaAtual);
    doc.text("Data", 90, linhaAtual);
    doc.text("Quantidade", 150, linhaAtual);
    linhaAtual += 10;
    doc.setFont("helvetica", "normal");

    // Captura os dados filtrados do modal
    const linhasTabela = [];
    document.querySelectorAll("#modalTbody tr").forEach((tr) => {
        const colunas = tr.querySelectorAll("td");
        if (colunas.length === 3) { // Garante que há 3 colunas antes de adicionar
            const nomeItem = colunas[0].innerText.trim();
            const dataItem = colunas[1].innerText.trim();
            const quantidade = colunas[2].innerText.trim();

            // Evita duplicações verificando se já existe na lista
            if (!linhasTabela.some(item => item[0] === nomeItem && item[1] === dataItem && item[2] === quantidade)) {
                linhasTabela.push([nomeItem, dataItem, quantidade]);
            }
        }
    });

    // Adiciona os dados ao PDF
    linhasTabela.forEach((linha) => {
        doc.text(linha[0], 10, linhaAtual);
        doc.text(linha[1], 90, linhaAtual);
        doc.text(linha[2], 150, linhaAtual);
        linhaAtual += 10;
    });

    if (linhasTabela.length === 0) {
        doc.text("Nenhum item encontrado.", 10, linhaAtual);
    }

    // Baixa o arquivo PDF
    doc.save("relatorio_itens_filtrados.pdf");
}*/

});


