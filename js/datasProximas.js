// Função para verificar se a data está dentro dos próximos 5 dias
function isVencendoEm5Dias(data) {
    const hoje = new Date();
    const dataVencimento = new Date(data);
    const diferencaDias = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));

    return diferencaDias >= 0 && diferencaDias <= 5;
}

// Atualizar tabela principal
function atualizarTabela() {
    tbody.innerHTML = "";
    bdDatas.sort((a, b) => new Date(a.dataItem) - new Date(b.dataItem));

    bdDatas.forEach((item, index) => {
        let tr = document.createElement("tr");

        // Destaca itens que vencem em até 5 dias
        let classeVencendo = isVencendoEm5Dias(item.dataItem) ? "vencendo" : "";

        tr.innerHTML = `
            <td data-label="Nome-Item" class="${classeVencendo}">${item.nomeItem}</td>
            <td data-label="Data-Item" class="${classeVencendo}">${formatarDataParaBr(item.dataItem)}</td>
            <td data-label="Quantidade" class="${classeVencendo}">${item.quantidadeItem}</td>
            <td class="acao">
                <button id="deletar" onclick="deleteItem(${index})"><i class="fa fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// CSS para destacar itens próximos do vencimento
const style = document.createElement("style");
style.innerHTML = `
    .vencendo {
        background-color: rgba(255, 0, 0, 0.3); /* Fundo vermelho claro */
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// Atualizar tabela ao iniciar
atualizarTabela();
