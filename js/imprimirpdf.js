// Garantir que o evento seja registrado apenas uma vez
const btnImprimirPDF = document.getElementById("btnImprimirPDF");
if (btnImprimirPDF) {
    btnImprimirPDF.removeEventListener("click", gerarPDF); // Remove qualquer evento anterior
    btnImprimirPDF.addEventListener("click", gerarPDF); // Adiciona o evento uma vez
}

// Função para gerar o PDF
function gerarPDF() {
    if (!window.jspdf) {
        console.error("jsPDF não está carregado.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtém a data atual
    const dataAtual = new Date().toLocaleDateString("pt-BR");

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

    // Verifica se há dados para gerar o PDF
    if (linhasTabela.length === 0) {
        alert("Nenhum item filtrado encontrado. O PDF não será gerado.");
        return; // Não gera o PDF se não houver dados
    }

    // Título do relatório
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório de Itens Filtrados", 10, 10);
    
    // Adiciona a data no cabeçalho
    doc.setFontSize(12);
    doc.text(`Data de Impressão: ${dataAtual}`, 10, 20);
    
    // Linha divisória
    doc.line(10, 25, 200, 25);

    let linhaAtual = 30;

    // Adiciona os cabeçalhos da tabela
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Nome do Item", 10, linhaAtual);
    doc.text("Data", 90, linhaAtual);
    doc.text("Quantidade", 150, linhaAtual);
    linhaAtual += 10;

    // Adiciona os dados ao PDF
    doc.setFont("helvetica", "normal");
    linhasTabela.forEach((linha) => {
        doc.text(linha[0], 10, linhaAtual);
        doc.text(linha[1], 90, linhaAtual);
        doc.text(linha[2], 150, linhaAtual);
        linhaAtual += 10;
    });

    // Baixa o arquivo PDF
    doc.save("relatorio_itens_filtrados.pdf");
}
