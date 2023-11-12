// ==UserScript==
// @name         Lab4-Cripto
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Laboratorio N°4 de Criptografía y Seguridad en Redes
// @author       Philip Magna
// @match        *
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @icon         https://cdn.iconscout.com/icon/free/png-256/free-monkey-67-450339.png
// @grant        none
// @run-at       document-end
// ==/UserScript==


(function() {
    'use strict';

    // La URL de la librería CryptoJS
    const cryptoJsUrl = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js';
    const sriHash = 'sha384-0DrKBsfUuJe/vqjia1HviapRn4mR1BYfCpQ9gT7qjSKu8TrzTe2tlbK3cI9i9EwV';

    // Función para cargar CryptoJS con SRI
    function cargarCryptoJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.setAttribute('src', cryptoJsUrl);
            script.setAttribute('integrity', sriHash);
            script.setAttribute('crossorigin', 'anonymous');
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Ejecutar el resto del código una vez que CryptoJS se haya cargado
    cargarCryptoJS().then(() => {
        const extraerInicialesMayusculas = () => {
        const textoCompleto = document.body.innerText;
        return textoCompleto.split('.')
            .map(frase => frase.trim().charAt(0))
            .filter(caracterInicial => caracterInicial !== '')
            .join('');
    };

    const buscarDivsConFormatoEspecifico = (clave) => {
        const divs = [...document.getElementsByTagName('div')];
        const patronFormato = /^M\d+$/;

        return divs.reduce((resultados, divActual) => {
            if (patronFormato.test(divActual.classList[0])) {
                const mensajeDescifrado = descifrarMensaje(divActual.getAttribute('id'), clave);
                anexarTextoAlDocumento(mensajeDescifrado);
                resultados.push(divActual.getAttribute('id') + ' ' + mensajeDescifrado);
            }
            return resultados;
        }, []);
    };

    const descifrarMensaje = (mensajeEncriptado, claveSeguridad) => {
        const claveFormateada = CryptoJS.enc.Utf8.parse(claveSeguridad);
        const opcionesDescifrado = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
        const textoCifrado = CryptoJS.enc.Base64.parse(mensajeEncriptado);
        const descifrado = CryptoJS.TripleDES.decrypt({ ciphertext: textoCifrado }, claveFormateada, opcionesDescifrado);
        return descifrado.toString(CryptoJS.enc.Utf8);
    };

    const anexarTextoAlDocumento = (texto) => {
        const nuevoDiv = document.createElement("div");
        nuevoDiv.textContent = texto;
        document.body.appendChild(nuevoDiv);
    };

    const mostrarResultados = () => {
        const claveObtenida = extraerInicialesMayusculas();
        const divsEncontrados = buscarDivsConFormatoEspecifico(claveObtenida);
        console.log(`La llave es: ${claveObtenida}`);
        console.log(`Los mensajes cifrados son: ${divsEncontrados.length}`);
        divsEncontrados.forEach(elemento => console.log(elemento));
    };

    window.addEventListener('load', mostrarResultados);

    }).catch(error => {
        console.error('Error al cargar CryptoJS:', error);
    });
})();
