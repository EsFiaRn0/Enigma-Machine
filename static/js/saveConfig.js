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

        const calculateRotorPositions = (rotor1, rotor2, rotor3, textLength) => {
            const alphabetSize = 26;
            let shift = textLength;
        
            let r3 = rotor3.charCodeAt(0) - 65 - shift;
            let carry2 = Math.floor(r3 / alphabetSize);
            r3 = (r3 % alphabetSize + alphabetSize) % alphabetSize;
        
            let r2 = rotor2.charCodeAt(0) - 65 + carry2;
            let carry1 = Math.floor(r2 / alphabetSize);
            r2 = (r2 % alphabetSize + alphabetSize) % alphabetSize;
        
            let r1 = rotor1.charCodeAt(0) - 65 + carry1;
            r1 = (r1 % alphabetSize + alphabetSize) % alphabetSize;
        
            return {
                rotor1: String.fromCharCode(r1 + 65),
                rotor2: String.fromCharCode(r2 + 65),
                rotor3: String.fromCharCode(r3 + 65),
            };
        };
            

        const shift = encryptedText.length;

        const initialPositions = calculateRotorPositions(
            rotor1.textContent || "A",
            rotor2.textContent || "A",
            rotor3.textContent || "A",
            shift
        );

        const fileContent = `
        === Enigma Configuration ===
        Encrypted Text: ${encryptedText}
        
        Initial Rotor Positions (Before Encryption):
        - Rotor 1: ${initialPositions.rotor1}
        - Rotor 2: ${initialPositions.rotor2}
        - Rotor 3: ${initialPositions.rotor3}
        
        Final Rotor Positions (After Encryption):
        - Rotor 1: ${rotor1.textContent}
        - Rotor 2: ${rotor2.textContent}
        - Rotor 3: ${rotor3.textContent}
        
        Plugboard Connections:
        ${plugboardConnections}
        `.trim();

        Swal.fire({
            title: "Descargar configuración",
            text: "Estás a punto de descargar un archivo .txt con el mensaje encriptado y la configuración inicial y actual de los rotores. ¿Deseas continuar?",
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