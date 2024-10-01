import { inicializarVehiculos, mostrarDatos, agregarNuevoVehiculo, calcularVelocidadMaximaPromedio, grabarVehiculo, inicializarCheckboxes, inicializarOrdenHeaders, eliminarVehiculo, cancelarEdicion} from './functions.js';

const tabla = document.querySelector('#tabla-datos tbody');
const filtroSelect = document.getElementById('filtro-tipo-vehiculo');
const agregarBtn = document.getElementById('agregar-vehiculo');
const calcularBtn = document.getElementById('calcular-promedio');
const velocidadPromedio = document.querySelector('#vel-promedio');
const formEditable = document.getElementById('form-abm');
const btnEliminar = document.getElementById('eliminar');
const btnCancelar = document.getElementById('cancelar');


inicializarVehiculos();
inicializarCheckboxes();
inicializarOrdenHeaders();
mostrarDatos(tabla);


filtroSelect.addEventListener('change', (e) => mostrarDatos(tabla, e.target.value));
calcularBtn.addEventListener('click', () => calcularVelocidadMaximaPromedio(tabla, velocidadPromedio));
agregarBtn.addEventListener('click', agregarNuevoVehiculo);
formEditable.addEventListener('submit', (event) => {
    event.preventDefault();
    grabarVehiculo(event);
});
btnEliminar.addEventListener('click', eliminarVehiculo);
btnCancelar.addEventListener('click', cancelarEdicion);