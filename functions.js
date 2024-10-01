import { Aereo, Terrestre } from "./classes.js";

export const jsonData = JSON.parse(`[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},
{"id":51, "modelo":"Dodge Viper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},
{"id":67, "modelo":"Boeing CH-47 Chinook", "anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},
{"id":666, "modelo":"Aprilia RSV 1000 R", "anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},
{"id":872, "modelo":"Boeing 747-400", "anoFab":1989, "velMax":988, "altMax":13, "autonomia":13450},
{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953, "velMax":174, "altMax":3, "autonomia":870}]`);

const checkboxes = {
    'col-id': 0,
    'col-modelo': 1,
    'col-anoFab': 2,
    'col-velMax': 3,
    'col-altMax': 4,
    'col-autonomia': 5,
    'col-cantPue': 6,
    'col-cantRue': 7
};

const headers = {
    'id': 0,
    'modelo': 1,
    'anoFab': 2,
    'velMax': 3,
    'altMax': 4,
    'autonomia': 5,
    'cantPue': 6,
    'cantRue': 7
};

export let vehiculos = [];
export let vehiculoSeleccionado = null;
export let ordenAscendente = true;

export function inicializarVehiculos() {
    jsonData.forEach(vehiculo => {
        if (vehiculo.altMax && vehiculo.autonomia) {
            vehiculos.push(new Aereo(vehiculo.id, vehiculo.modelo, vehiculo.anoFab, vehiculo.velMax, vehiculo.altMax, vehiculo.autonomia));
        } else if (vehiculo.cantPue !== undefined && vehiculo.cantRue) {
            vehiculos.push(new Terrestre(vehiculo.id, vehiculo.modelo, vehiculo.anoFab, vehiculo.velMax, vehiculo.cantPue, vehiculo.cantRue));
        }
    });
}

export function mostrarDatos(tabla) {
    tabla.innerHTML = ''; 

    const tipoSeleccionado = document.getElementById('filtro-tipo-vehiculo').value;

    let vehiculosFiltrados = vehiculos;

    if (tipoSeleccionado === 'Aereo') {
        vehiculosFiltrados = vehiculos.filter(v => v instanceof Aereo);
    } else if (tipoSeleccionado === 'Terrestre') {
        vehiculosFiltrados = vehiculos.filter(v => v instanceof Terrestre);
    }

    vehiculosFiltrados.forEach(vehiculo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${vehiculo.id}</td>
            <td>${vehiculo.modelo}</td>
            <td>${vehiculo.anoFab}</td>
            <td>${vehiculo.velMax}</td>
            <td>${vehiculo.altMax || ''}</td>
            <td>${vehiculo.autonomia || ''}</td>
            <td>${vehiculo.cantPue !== undefined ? vehiculo.cantPue : ''}</td>
            <td>${vehiculo.cantRue !== undefined ? vehiculo.cantRue : ''}</td>
        `;
        fila.addEventListener('dblclick', () => editarVehiculo(vehiculo));
        tabla.appendChild(fila);
    });

    actualizarColumnasSeleccionadas();
}

export function alternarModoForm(mostrarFormulario) {
    document.getElementById('form-abm').style.display = mostrarFormulario ? 'block' : 'none';
    document.getElementById('form-datos').style.display = mostrarFormulario ? 'none' : 'block';
}

export function mostrarCamposSegunTipo(tipo) {
    const esAereo = tipo === 'Aereo';
    document.getElementById('aereo-fields').style.display = esAereo ? 'block' : 'none';
    document.getElementById('terrestre-fields').style.display = esAereo ? 'none' : 'block';
}

export function editarVehiculo(vehiculo) {
    vehiculoSeleccionado = vehiculo;
    document.getElementById('id').value = vehiculo.id;
    document.getElementById('modelo').value = vehiculo.modelo;
    document.getElementById('anoFab').value = vehiculo.anoFab;
    document.getElementById('velMax').value = vehiculo.velMax;

    const tipoVehiculoSelect = document.getElementById('tipo-vehiculo');
    tipoVehiculoSelect.disabled = true;

    if (vehiculo instanceof Aereo) {
        tipoVehiculoSelect.value = 'Aereo';
        document.getElementById('altMax').value = vehiculo.altMax;
        document.getElementById('autonomia').value = vehiculo.autonomia;
    } else if (vehiculo instanceof Terrestre) {
        tipoVehiculoSelect.value = 'Terrestre';
        document.getElementById('cantPue').value = vehiculo.cantPue;
        document.getElementById('cantRue').value = vehiculo.cantRue;
    }

    document.getElementById('guardar').textContent = 'Modificar';
    document.getElementById('eliminar').style.display = 'inline';

    mostrarCamposSegunTipo(tipoVehiculoSelect.value);
    alternarModoForm(true);
}

export function calcularVelocidadMaximaPromedio(tabla, velocidadPromedioSpan) {
    const filas = tabla.querySelectorAll('tr');
    let totalVelMax = 0;
    let cantidadVehiculos = 0;

    filas.forEach(fila => {
        const velMax = parseFloat(fila.children[3].textContent);
        if (!isNaN(velMax)) {
            totalVelMax += velMax;
            cantidadVehiculos++;
        }
    });

    const promedio = cantidadVehiculos > 0 ? totalVelMax / cantidadVehiculos : 0;
    velocidadPromedioSpan.textContent = promedio.toFixed(2);
}


function validarVehiculo(tipoVehiculo, modelo, anoFab, velMax, altMax, autonomia, cantPue, cantRue) {
    const errores = [];

    if (!modelo || modelo.trim() === "") {
        errores.push("Modelo es requerido.");
    }
    if (isNaN(anoFab) || anoFab <= 1885) {
        errores.push("Año de fabricación debe ser mayor a 1885.");
    }
    if (isNaN(velMax) || velMax <= 0) {
        errores.push("Velocidad máxima debe ser mayor a 0.");
    }

    if (tipoVehiculo === 'Aereo') {
        if (isNaN(altMax) || altMax <= 0) {
            errores.push("Altitud máxima debe ser mayor a 0 para un vehículo aéreo.");
        }
        if (isNaN(autonomia) || autonomia <= 0) {
            errores.push("Autonomía debe ser mayor a 0 para un vehículo aéreo.");
        }
    }

    else if (tipoVehiculo === 'Terrestre') {
        if (isNaN(cantPue) || cantPue < -1) {
            errores.push("Cantidad de puertas debe ser mayor o igual a -1 para un vehículo terrestre.");
        }
        if (isNaN(cantRue) || cantRue <= 0) {
            errores.push("Cantidad de ruedas debe ser mayor a 0 para un vehículo terrestre.");
        }
    }

    if (errores.length > 0) {
        return { valido: false, mensaje: errores.join("\n") };
    }

    return { valido: true, mensaje: "" };
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-mensaje');
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
}


function ocultarError() {
    const errorDiv = document.getElementById('error-mensaje');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
}

export function grabarVehiculo(event) {
    event.preventDefault();

    const tipoVehiculo = document.getElementById('tipo-vehiculo').value;
    const modelo = document.getElementById('modelo').value;
    const anoFab = parseInt(document.getElementById('anoFab').value);
    const velMax = parseFloat(document.getElementById('velMax').value);
    const altMax = parseFloat(document.getElementById('altMax').value);
    const autonomia = parseFloat(document.getElementById('autonomia').value);
    const cantPue = parseInt(document.getElementById('cantPue').value);
    const cantRue = parseInt(document.getElementById('cantRue').value);

    const validacion = validarVehiculo(tipoVehiculo, modelo, anoFab, velMax, altMax, autonomia, cantPue, cantRue);
    
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return; 
    }
    
    ocultarError();  

    if (vehiculoSeleccionado) {
    
        vehiculoSeleccionado.modelo = modelo;
        vehiculoSeleccionado.anoFab = anoFab;
        vehiculoSeleccionado.velMax = velMax;

        if (tipoVehiculo === 'Aereo') {
            vehiculoSeleccionado.altMax = altMax;
            vehiculoSeleccionado.autonomia = autonomia;
        } else if (tipoVehiculo === 'Terrestre') {
            vehiculoSeleccionado.cantPue = cantPue;
            vehiculoSeleccionado.cantRue = cantRue;
        }
    } else {

        const nuevoId = generarIdUnico(); 
        let nuevoVehiculo;
        if (tipoVehiculo === 'Aereo') {
            nuevoVehiculo = new Aereo(nuevoId, modelo, anoFab, velMax, altMax, autonomia);
        } else if (tipoVehiculo === 'Terrestre') {
            nuevoVehiculo = new Terrestre(nuevoId, modelo, anoFab, velMax, cantPue, cantRue);
        }
        vehiculos.push(nuevoVehiculo);
    }

    mostrarDatos(document.querySelector('#tabla-datos tbody'));  

    alternarModoForm(false);
}


function generarIdUnico() {
    const idsExistentes = vehiculos.map(p => p.id).sort((a, b) => a - b);
    let nuevoId = 1;
    for (let i = 0; i < idsExistentes.length; i++) {
        if (idsExistentes[i] !== nuevoId) {
            break;
        }
        nuevoId++;
    }
    return nuevoId;
}


export function agregarNuevoVehiculo() {
    vehiculoSeleccionado = null; 

    document.getElementById('id').value = ''; 
    document.getElementById('modelo').value = '';
    document.getElementById('anoFab').value = '';
    document.getElementById('velMax').value = '';
    document.getElementById('altMax').value = '';
    document.getElementById('autonomia').value = '';
    document.getElementById('cantPue').value = '';
    document.getElementById('cantRue').value = '';


    const tipoVehiculoSelect = document.getElementById('tipo-vehiculo');
    tipoVehiculoSelect.disabled = false; 
    tipoVehiculoSelect.value = 'Terrestre'; 

    tipoVehiculoSelect.addEventListener('change', (e) => {
        mostrarCamposSegunTipo(e.target.value); 
    });

    document.getElementById('guardar').textContent = 'Agregar';
    document.getElementById('eliminar').style.display = 'none';

    mostrarCamposSegunTipo(tipoVehiculoSelect.value);

    alternarModoForm(true);
}

export function inicializarCheckboxes() {
    Object.keys(checkboxes).forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        checkbox.addEventListener('change', () => {
            volverColumnaVisible(checkbox, checkboxes[checkboxId]);
        });
    });
}

function volverColumnaVisible(checkbox, indiceColumna) {
    const tabla = document.querySelector('#tabla-datos');
    const esVisible = checkbox.checked;

    const filas = tabla.querySelectorAll('tr');
    filas.forEach(fila => {
        const celda = fila.children[indiceColumna];
        if (celda) {
            celda.style.display = esVisible ? 'table-cell' : 'none';
        }
    });
}

function actualizarColumnasSeleccionadas() {
    Object.keys(checkboxes).forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        volverColumnaVisible(checkbox, checkboxes[checkboxId]);
    });
}

export function inicializarOrdenHeaders() {
    Object.keys(headers).forEach(headerId => {
        const header = document.querySelector(`#tabla-datos th:nth-child(${headers[headerId] + 1})`);
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            ordenarPorColumna(headers[headerId]);
        });
    });
}

function ordenarPorColumna(columnIndex) {
    const tabla = document.querySelector('#tabla-datos tbody');
    let filas = Array.from(tabla.querySelectorAll('tr')); 

    const esNumerico = ['id', 'anoFab', 'velMax', 'altMax', 'autonomia', 'cantPue', 'cantRue'].includes(Object.keys(headers)[columnIndex]);

    filas.sort((a, b) => {
        const valorA = a.children[columnIndex].textContent.trim();
        const valorB = b.children[columnIndex].textContent.trim();

        if (esNumerico) {
            return ordenAscendente ? (parseFloat(valorA) - parseFloat(valorB)) : (parseFloat(valorB) - parseFloat(valorA));
        } else {
            return ordenAscendente ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
        }
    });

    ordenAscendente = !ordenAscendente;
    
    tabla.innerHTML = '';
    filas.forEach(fila => tabla.appendChild(fila));
}

export function cancelarEdicion() {
    alternarModoForm(false);  // Simplemente oculta el formulario
}

export function eliminarVehiculo() {
    if (vehiculoSeleccionado) {
        vehiculos = vehiculos.filter(v => v !== vehiculoSeleccionado);
        mostrarDatos(document.querySelector('#tabla-datos tbody'));
        alternarModoForm(false);
    }
}