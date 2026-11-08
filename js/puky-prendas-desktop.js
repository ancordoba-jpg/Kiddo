/* AJUSTES DE PRENDAS DE PUKY - SOLO COMPUTADORA */
/* x: derecha (+), izquierda (-) en pixeles */
/* y: abajo (+), arriba (-) en pixeles */
/* tamano: 1 normal, 1.10 agranda 10%, 0.90 reduce 10% */
/* ancho: 1 normal, 0.90 estrecha 10%, 1.10 ensancha 10% */

window.KIDDO_PRENDAS_DESKTOP = {
  "acc-boina-roja": { x: -15, y: -150, tamano: 1, ancho: 1 }, // Boina roja
  "acc-bufanda-blanca": { x: 0, y: 40, tamano: 1, ancho: 1 }, // Bufanda blanca
  "acc-bufanda-blanca-azul": { x: 0, y: 40, tamano: 1, ancho: 1 }, // Bufanda azul
  "acc-capa-roja": { x: 0, y: 100, tamano: 1, ancho: 1 }, // Capa roja
  "acc-gorra-negra-blanca": { x: 15, y: -150, tamano: 1, ancho: 1 }, // Gorra negra
  "acc-gorra-verde": { x: 15, y: -150, tamano: 1, ancho: 1 }, // Gorra verde
  "acc-gorro-azul": { x: 10, y: -150, tamano: 1, ancho: 1 }, // Gorro azul
  "acc-gorro-blanco": { x: 2, y: -150, tamano: 1, ancho: 1 }, // Gorro blanco
  "acc-gorro-nubes": { x: 45, y: -110, tamano: 1, ancho: 1 }, // Gorro nubes
  "acc-sombrero-aventura": { x: 8, y: -150, tamano: 1, ancho: 1 }, // Sombrero aventura
  "acc-sombrero-playa": { x: 8, y: -130, tamano: 1, ancho: 1 }, // Sombrero playa
  "pant-jean-verde": { x: 0, y: 170, tamano: 6/10, ancho: 9/5 }, // Jean verde
  "pant-pantalon-nubes": { x: -3, y: 160, tamano: 1, ancho: 11/10 }, // Pantalón nubes
  "pant-short-azul-oscuro": { x: 0, y: 140, tamano: 1, ancho: 6/5 }, // Short azul oscuro
  "pant-short-deportivo": { x: 0, y: 140, tamano: 1, ancho: 1 }, // Short deportivo
  "pant-short-jean": { x: 0, y: 140, tamano: 1, ancho: 11/10 }, // Short de jean
  "pant-short-jean-marron": { x: 0, y: 140, tamano: 1, ancho: 1 }, // Short jean marrón
  "pant-short-marron": { x: 0, y: 170, tamano: 1, ancho: 1 }, // Short marrón
  "pant-short-marron-claro": { x: 0, y: 155, tamano: 1, ancho: 6/5 }, // Short marrón claro
  "ropa-buzo-negro-koala": { x: 0, y: 76, tamano: 1, ancho: 1 }, // Buzo koala
  "ropa-campera-azul": { x: 0, y: 76, tamano: 1, ancho: 1 }, // Campera azul
  "ropa-chaleco-verde": { x: 0, y: 76, tamano: 1, ancho: 1 }, // Chaleco verde
  "ropa-impermeable-amarillo": { x: 0, y: 5, tamano: 1, ancho: 1 }, // Impermeable
  "ropa-pintor": { x: 0, y: 90, tamano: 1, ancho: 1 }, // Pintor
  "ropa-remera-aventura": { x: 3, y: 50, tamano: 1, ancho: 1 }, // Remera aventura
  "ropa-remera-futbol": { x: 0, y: 76, tamano: 1, ancho: 1 }, // Remera fútbol
  "ropa-remera-nubes": { x: 0, y: 76, tamano: 1, ancho: 1 }, // Remera nubes
  "ropa-saco-playa": { x: 0, y: 76, tamano: 1, ancho: 1 }, // Saco de playa
  "ropa-sueter-azul": { x: 0, y: 76, tamano: 1, ancho: 1 }, // Suéter azul
  "ropa-traje-dinosaurio": { x: 5, y: 5, tamano: 1, ancho: 1 }, // Traje dinosaurio
  "ropa-traje-superheroe": { x: 0, y: 92, tamano: 1, ancho: -2 }, // Traje superhéroe
  "zap-botas-amarillas": { x: 0, y: 170, tamano: 1, ancho: 11/10 }, // Botas amarillas
  "zap-botas-azules": { x: 0, y: 170, tamano: 1, ancho: 1 }, // Botas azules
  "zap-botas-marrones": { x: 0, y: 170, tamano: 1, ancho: 1 }, // Botas marrones
  "zap-pantuflas-koala": { x: 0, y: 180, tamano: 1, ancho: 1 }, // Pantuflas koala
  "zap-sandalias-azules": { x: 0, y: 180, tamano: 1, ancho: 1 }, // Sandalias azules
  "zap-zapatillas-azules": { x: 0, y: 170, tamano: 1, ancho: 1 }, // Zapatillas azules
  "zap-zapatillas-marrones": { x: 0, y: 180, tamano: 1, ancho: 1 }, // Zapatillas marrón
  "zap-zapatillas-negras": { x: 0, y: 170, tamano: 1, ancho: 1 }, // Zapatillas negras
  "zap-zapatillas-rojas": { x: 0, y: 175, tamano: 1, ancho: 1 }, // Zapatillas rojas
  "zap-zapatillas-rojas-blancas": { x: 0, y: 170, tamano: 1, ancho: 1 }, // Rojas y blancas
  "zap-zapatillas-verdes": { x: 0, y: 190, tamano: 1, ancho: 1 }, // Zapatillas verdes
};

/* MOTOR DE AJUSTES: NO MODIFICAR DEBAJO DE ESTA LINEA */
(function () {
    "use strict";

    function iniciar() {
        var vestidor = window.pukyWardrobe;

        if (!vestidor) {
            console.warn("Kiddo: no se encontro el vestidor.");
            return;
        }

        var prototipo = Object.getPrototypeOf(vestidor);

        if (!prototipo ||
            typeof prototipo._updateLayer !== "function" ||
            prototipo._kiddoDesktopAjustado) {
            return;
        }

        var original = prototipo._updateLayer;

        prototipo._updateLayer = function (categoria, item) {

            if (
                !window.matchMedia("(min-width: 1024px)").matches ||
                !item ||
                !item.imagePath
            ) {
                return original.call(this, categoria, item);
            }

            var ajustes = window.KIDDO_PRENDAS_DESKTOP || {};
            var ajuste = ajustes[item.id];

            if (!ajuste) {
                return original.call(this, categoria, item);
            }

            // Copia temporal: no modifica el catalogo original.
            var copia = Object.assign({}, item);

            var x = Number(ajuste.x);
            var y = Number(ajuste.y);
            var tamano = Number(ajuste.tamano);
            var ancho = Number(ajuste.ancho);

            if (!Number.isFinite(x)) x = 0;
            if (!Number.isFinite(y)) y = 0;
            if (!Number.isFinite(tamano) || tamano <= 0) tamano = 1;
            if (!Number.isFinite(ancho) || ancho <= 0) ancho = 1;

            copia.offsetX = (Number(item.offsetX) || 0) + x;
            copia.offsetY = (Number(item.offsetY) || 0) + y;
            copia.scale = (Number(item.scale) || 1) * tamano;
            copia.scaleX = (Number(item.scaleX) || 1) * ancho;

            return original.call(this, categoria, copia);
        };

        prototipo._kiddoDesktopAjustado = true;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();