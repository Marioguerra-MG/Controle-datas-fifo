document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modalExplicacao");
    const btnExplicacao = document.getElementById("sobre");
    const closeBtn = modal.querySelector(".close");

    // Abre o modal quando o botão "Sobre" é clicado
    btnExplicacao.addEventListener("click", function () {
        modal.style.display = "flex";
        modal.setAttribute("tabindex", "0"); 
        modal.focus(); // Foca no modal para navegação via teclado
    });

    // Fecha o modal ao clicar no botão de fechar
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Fecha o modal se clicar fora dele
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Fechar modal com a tecla "Esc"
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
});


// contatos

document.addEventListener("DOMContentLoaded", function () {
    const modalContato = document.getElementById("modalContato");
    const btnContato = document.getElementById("contatos");
    const closeButtons = document.querySelectorAll(".close");

    // Abrir modal ao clicar em "Contato"
    btnContato.addEventListener("click", function (event) {
        event.preventDefault();
        modalContato.style.display = "flex";
    });

    // Fechar modal ao clicar no botão de fechar
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            modalContato.style.display = "none";
        });
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener("click", function (event) {
        if (event.target === modalContato) {
            modalContato.style.display = "none";
        }
    });
});

