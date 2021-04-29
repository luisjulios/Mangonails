let pagina = 1;
const cita = {
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  fecha: '',
  hora: '',
  servicios: []
}
document.addEventListener('DOMContentLoaded', function(){
  mostrarServicios();
  //Resalta el DIV atual segun el tab
  mostrarSeccion();

  eventListeners();
});
function eventListeners() {
  //Oculta o muestra una seccion segun al tab al que se presiona
  cambiarSeccion();
  //Paginacion siguiente y anterior:
  paginaSiguiente();
  paginaAnterior();
  //Comprueba la pagina actual para ocultar o mostrar la paginacion
  botonesPaginador();
  //Muestra el resumen de la cita o mensaje de error en caso de no pasar la validacion
  mostrarResumen();
  //Almacena nombre de la cita
  nombreCita();
  apellidoCita();
  telefonoCita();
  emailCita();
  //Almacena la fecha de la cita en el objeto
  fechaCita();
  //Almacena la hora de la cita
  horaCita();
}
function mostrarSeccion() {
  //Eliminar mostrar-seccion de la seccion anterior
  const seccionAnterior = document.querySelector('.mostrar-seccion');
  if(seccionAnterior) {
    seccionAnterior.classList.remove('mostrar-seccion');
  }
  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add('mostrar-seccion');

  //Eliminar la clase de actual en el tab anterior
  const tabAnterior =  document.querySelector('.tabs button.actual');
  if(tabAnterior){
    tabAnterior.classList.remove('actual');
  }

  //Resaltar seccion actual
  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add('actual');
}
function cambiarSeccion() {
  const enlaces = document.querySelectorAll('.tabs button');
  enlaces.forEach(enlace => {
    enlace.addEventListener('click', e => {
      e.preventDefault();
      pagina = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      botonesPaginador();
    })
  })
}
async function mostrarServicios() {
  try {
    const resultado = await fetch('./servicios.json');
    const db = await resultado.json();
    const {servicios} = db;
    //Generar HTML
    servicios.forEach( servicio => {
      const { id, nombre, precio } = servicio;
      //DOM Scripting
      ///Nombre
      const nombreServicio = document.createElement('P');
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add('nombre-servicio');
      //Precio
      const precioServicio = document.createElement('P');
      precioServicio.textContent = `$${precio}`;
      precioServicio.classList.add('precio-servicio');

      //Generar DIV
      const servicioDiv = document.createElement('DIV');
      servicioDiv.classList.add('servicio');
      servicioDiv.dataset.idServicio = id;
      
      //Selecciona un servicio
      servicioDiv.onclick = seleccionarServicio;

      //Inyectar precio y nombre al div de servicio
      servicioDiv.appendChild(nombreServicio);
      servicioDiv.appendChild(precioServicio);
      //Inyectar al HTML
      document.querySelector('#servicios').appendChild(servicioDiv);
    })
  } catch (e) {
    console.log(e);
  }
}
function seleccionarServicio(e) {
  let elemento;
  //Forzar que el elemento al cual le damos click sea el DIV
  if(e.target.tagName === 'P'){
    elemento = e.target.parentElement;
  } else {
    elemento = e.target;
  }
  if(elemento.classList.contains('seleccionado')){
    elemento.classList.remove('seleccionado');
    const id = parseInt(elemento.dataset.idServicio);
    eliminarServicio(id);
  } else {
    elemento.classList.add('seleccionado');
    const servicioObj = {
      id:parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent
    }
    agregarServicio(servicioObj);
  }
}
function eliminarServicio(id) {
  const {servicios} = cita;
  cita.servicios = servicios.filter(servicio => servicio.id !== id);
}
function agregarServicio(servicioObj) {
  const {servicios} = cita;
  cita.servicios = [...servicios, servicioObj];
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector('#siguiente');
  paginaSiguiente.addEventListener('click', () => {
    pagina++;
    botonesPaginador();
  });
}
function paginaAnterior() {
  const paginaAnterior = document.querySelector('#anterior');
  paginaAnterior.addEventListener('click', () => {
    pagina--;
    botonesPaginador();
});
}
function botonesPaginador() {
  const paginaSiguiente = document.querySelector('#siguiente');
  const paginaAnterior = document.querySelector('#anterior');
  if(pagina === 1){
    paginaAnterior.classList.add('ocultar');
  } else if (pagina === 3){
    paginaSiguiente.classList.add('ocultar');
    paginaAnterior.classList.remove('ocultar');
    mostrarResumen(); //Estamos en la pagina 3, carga el resumen de la cita
  } else {
    paginaAnterior.classList.remove('ocultar');
    paginaSiguiente.classList.remove('ocultar');
  }
  mostrarSeccion(); //Cambia la seccion que se muestra por la de la pagina
}
function mostrarResumen() {
  //Destructuring
  const {nombre, apellido, telefono, email, fecha, hora, servicios} = cita;
  //Seleccionar resumen
  const resumenDiv = document.querySelector('.contenido-resumen');
  //Limpia el HTML previo
  while(resumenDiv.firstChild){
    resumenDiv.removeChild(resumenDiv.firstChild);
  }
  //Validacion de objeto
  if(Object.values(cita).includes('')){
    const noServicios = document.createElement('P');
    noServicios.textContent = 'Faltan datos de servicios, nombre, fecha u hora.';

    noServicios.classList.add('invalidar-cita');

    //Agregar a resumenDiv
    resumenDiv.appendChild(noServicios);
    return;
  }
  //Heading
  const headingCita = document.createElement('H2');
  let cantidad = 0;
  headingCita.textContent = 'Resumen de cita';
  //Mostrar el resumen
  const nombreCita = document.createElement('P');
  nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;
  const apellidoCita = document.createElement('P');
  apellidoCita.innerHTML = `<span>Apellido: </span> ${apellido}`;
  const telefonoCita = document.createElement('P');
  telefonoCita.innerHTML = `<span>Teléfono: </span> +56${telefono}`;
  const emailCita = document.createElement('P');
  emailCita.innerHTML = `<span>Email: </span> ${email}`;
  const fechaCita = document.createElement('P');
  fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;
  const horaCita = document.createElement('P');
  horaCita.innerHTML = `<span>Hora: </span> ${hora}`;
  const serviciosCita = document.createElement('P');
  serviciosCita.innerHTML = `<span>Servicios: </span>`;
  serviciosCita.classList.add('resumen-servicios');

  //Iterar sobre el arreglo de servicios
  servicios.forEach(servicio => {
    const {nombre, precio} = servicio;
    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');
    const textoServicio = document.createElement('P');
    textoServicio.textContent = nombre;
    const precioServicio = document.createElement('P');
    precioServicio.textContent = precio;
    precioServicio.classList.add('precio');

    const totalServicio = precio.split('$');
    cantidad += parseInt(totalServicio[1].trim());
    //Colocar texto y recio en el DIV
    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    serviciosCita.appendChild(contenedorServicio);
  });
  resumenDiv.appendChild(headingCita);
  resumenDiv.appendChild(nombreCita);
  resumenDiv.appendChild(apellidoCita);
  resumenDiv.appendChild(telefonoCita);
  resumenDiv.appendChild(emailCita);
  resumenDiv.appendChild(fechaCita);
  resumenDiv.appendChild(horaCita);
  resumenDiv.appendChild(serviciosCita);

  const cantidadPagar = document.createElement('P');
  cantidadPagar.classList.add('total');
  cantidadPagar.innerHTML = `<span>Total a pagar: </span> $${cantidad} pesos`;
  resumenDiv.appendChild(cantidadPagar);

}
function nombreCita() {

  const nombreInput = document.querySelector('#nombre');
  nombreInput.addEventListener('input', e => {
    const nombreTexto = e.target.value.trim();
    //Validacion de que nombreTexto debe tener algo
    if(nombreTexto === '' || nombreTexto.length < 3) {
      mostrarAlerta('Nombre no válido', 'error')
    } else {
      const alerta = document.querySelector('.alerta');
      if(alerta){
        alerta.remove();
      }
      cita.nombre = nombreTexto;
    }
  });
}
function apellidoCita() {

  const apellidoInput = document.querySelector('#apellido');
  apellidoInput.addEventListener('input', e => {
    const apellidoTexto = e.target.value.trim();
    //Validacion de que apellidoTexto debe tener algo
    if(apellidoTexto === '' || apellidoTexto.length < 3) {
      mostrarAlerta('Apellido no válido', 'error')
    } else {
      const alerta = document.querySelector('.alerta');
      if(alerta){
        alerta.remove();
      }
      cita.apellido = apellidoTexto;
    }
  });
}
function telefonoCita() {

  const telefonoInput = document.querySelector('#telefono');
  telefonoInput.addEventListener('input', e => {
    const telefono = e.target.value.trim();
    //Validacion de que telefono debe tener algo
    if(telefono === '' || telefono.length < 9) {
      mostrarAlerta('Teléfono no válido', 'error')
    } else {
      const alerta = document.querySelector('.alerta');
      if(alerta){
        alerta.remove();
      }
      cita.telefono = telefono;
    }
  });
}
function emailCita() {
  const emailInput = document.querySelector('#email');
  emailInput.addEventListener('input', e => {
    const email = e.target.value.trim();
    //Validacion de que email debe tener algo
    if(email === '') {
      mostrarAlerta('Email no válido', 'error')
    } else {
      const alerta = document.querySelector('.alerta');
      if(alerta){
        alerta.remove();
      }
      cita.email = email;
    }
  });
}
function mostrarAlerta(mensaje, tipo) {
  //Mostrar solo un alerta
  const alertaPrevia = document.querySelector('.alerta');
  if(alertaPrevia) {
    return;
  }
  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje;
  alerta.classList.add('alerta');
  if(tipo === 'error'){
    alerta.classList.add('error');
  }
  //Insertar en el html
  const formulario = document.querySelector('.formulario');
  formulario.appendChild(alerta);
  //Eliminar alerta despues de 3 segundos
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
function fechaCita() {
  $("#fecha").change(function() {
    const fechaCita = $('#fecha').val();
    cita.fecha = fechaCita;
  });
}
function horaCita () {
  const selectHora = document.getElementById('hora');
selectHora.addEventListener('change',
  function(){
    const horaCita = this.options[selectHora.selectedIndex].text;
    cita.hora = horaCita;
  });
}
