import { selectedConnections } from './plugboardHandler.js';

export function setupSaveConfig() {
    const saveButton = document.getElementById("save");

    if (!saveButton) {
        console.error("El botón de guardar no se encuentra en el DOM.");
        return;
    }

    saveButton.addEventListener("click", () => {
        const encryptedOutput = document.getElementById("encrypted-output");
        const rotor1 = document.getElementById("rotor1");
        const rotor2 = document.getElementById("rotor2");
        const rotor3 = document.getElementById("rotor3");

        if (!encryptedOutput || !rotor1 || !rotor2 || !rotor3) {
            console.error("Elementos necesarios no encontrados en el DOM.");
            return;
        }

        const encryptedText = encryptedOutput.textContent || "No encrypted text";
        const plugboardConnections =
            selectedConnections.map((conn) => conn.connection).join(", ") || "No connections";

        const fileContent = `
        === Enigma Configuration ===
        Encrypted Text: ${encryptedText}

        Rotor Positions:
        - Rotor 1: ${rotor1.textContent}
        - Rotor 2: ${rotor2.textContent}
        - Rotor 3: ${rotor3.textContent}

        Plugboard Connections:
        ${plugboardConnections}
        `;

        Swal.fire({
            title: "Descargar configuración",
            text: "Estás a punto de descargar un archivo .txt con el mensaje encriptado y la configuración actual de la máquina Enigma. ¿Deseas continuar?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Sí, descargar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const blob = new Blob([fileContent], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "enigma_configuration.txt";
                link.click();
                URL.revokeObjectURL(link.href);

                Swal.fire("¡Archivo descargado!", "El archivo .txt ha sido descargado con éxito.", "success");
            } else {
                Swal.fire("Operación cancelada", "No se descargó ningún archivo.", "error");
            }
        });
    });
}