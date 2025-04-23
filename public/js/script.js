    function lerArquivo() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
    
        if (!file) {
        alert("Selecione um arquivo primeiro.");
        return;
        }
    
        const reader = new FileReader();
    
        reader.onload = function(event) {
        const arrayBuffer = event.target.result;
    
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function(result) {
            document.getElementById('output').innerHTML = result.value;
            })
            .catch(function(err) {
            document.getElementById('output').textContent = "Erro ao ler o arquivo: " + err.message;
            });
        };
    
        reader.readAsArrayBuffer(file);
    }

    document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const customBtn = document.getElementById("customBtn");
    const fileName = document.getElementById("fileName");

    customBtn.addEventListener("click", () => {
        fileInput.click(); // dispara o input escondido
    });

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name; // mostra o nome do arquivo
        } else {
        fileName.textContent = "Nenhum arquivo selecionado";
        }
    });
    });
