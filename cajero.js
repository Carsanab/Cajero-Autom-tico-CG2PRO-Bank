// -------------------------------
// --- Reiniciar usuarios (solo para desarrollo o pruebas) ---
localStorage.removeItem("usuarios");

// Datos iniciales
// -------------------------------
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  { nombre: "Carlos", pin: "1234", saldo: 50000 },
  { nombre: "Lucía", pin: "4321", saldo: 30000 },
  { nombre: "Gabriela", pin: "1202", saldo: 250000 },
  { nombre: "Georgia", pin: "1710", saldo: 500000 },
  { nombre: "Juan", pin: "1111", saldo: 20000 }
];



let usuarioActual = null;

// -------------------------------
// Elementos del DOM
// -------------------------------
const usuarioInput = document.getElementById("usuarioInput");
const pinInput = document.getElementById("pinInput");
const btnIngresar = document.getElementById("btnIngresar");
const mensajeLogin = document.getElementById("mensajeLogin");
const menu = document.getElementById("menu");
const login = document.getElementById("login");
const nombreUsuario = document.getElementById("nombreUsuario");
const saldoActual = document.getElementById("saldoActual");
const operacionDiv = document.getElementById("operacion");

const btnConsultar = document.getElementById("btnConsultar");
const btnDepositar = document.getElementById("btnDepositar");
const btnRetirar = document.getElementById("btnRetirar");
const btnSalir = document.getElementById("btnSalir");

// -------------------------------
// Eventos
// -------------------------------
btnIngresar.addEventListener("click", iniciarSesion);
btnConsultar.addEventListener("click", consultarSaldo);
btnDepositar.addEventListener("click", depositarDinero);
btnRetirar.addEventListener("click", retirarDinero);
btnSalir.addEventListener("click", salir);

// -------------------------------
// Funciones
// -------------------------------
function iniciarSesion() {
  const nombreIngresado = usuarioInput.value.trim().toLowerCase();
  const pinIngresado = pinInput.value.trim();

  // Buscar usuario por nombre
  usuarioActual = usuarios.find(
    u => u.nombre.toLowerCase() === nombreIngresado
  );

  if (!usuarioActual) {
    mensajeLogin.textContent = "El usuario no existe.";
    mensajeLogin.style.color = "red";
    return;
  }

  // Validar PIN
  if (usuarioActual.pin !== pinIngresado) {
    mensajeLogin.textContent = "PIN incorrecto.";
    mensajeLogin.style.color = "red";
    return;
  }

  // Si ambas validaciones pasan vamos a login correcto
  mensajeLogin.textContent = "";
  login.classList.add("oculto");
  menu.classList.remove("oculto");
  nombreUsuario.textContent = usuarioActual.nombre;
  saldoActual.textContent = usuarioActual.saldo.toFixed(2);
}


function consultarSaldo() {
  operacionDiv.textContent = `Su saldo actual es: $${usuarioActual.saldo.toFixed(2)}`;
}


// Función para depositar dinero
function depositarDinero() {
  Swal.fire({
    title: "Depositar dinero",
    input: "number",
    inputLabel: "Ingrese el monto a depositar",
    inputAttributes: {
      min: 1
    },
    inputPlaceholder: "Ej: 5000",
    showCancelButton: true,
    confirmButtonColor: "#0f4b00",
    cancelButtonColor: "#b4b4b4",
    confirmButtonText: "Depositar",
    cancelButtonText: "Cancelar"
  }).then(result => {

    if (result.isConfirmed) {
      const monto = parseFloat(result.value);

      if (isNaN(monto) || monto <= 0) {
        Swal.fire({
          title: "Monto no válido",
          text: "Debe ingresar un número mayor a 0",
          icon: "error",
          confirmButtonColor: "#0f4b00"
        });
        return;
      }

      usuarioActual.saldo += monto;
      actualizarDatos();
      saldoActual.textContent = usuarioActual.saldo.toFixed(2);

      Swal.fire({
        title: "Depósito exitoso",
        html: `Has depositado $${monto.toFixed(2)}.<br>Nuevo saldo: $${usuarioActual.saldo.toFixed(2)}`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0f4b00"   // Cambio de color al botón Ok para que tenga la misma paleta de colores usada
      });

      operacionDiv.textContent =
        `Depósito exitoso de $${monto.toFixed(2)}. Nuevo saldo: $${usuarioActual.saldo.toFixed(2)}`;
    }
  });
}


// Función para retirar dinero
function retirarDinero() {
  Swal.fire({
    title: "Retirar dinero",
    input: "number",
    inputLabel: "Ingrese el monto a retirar",
    inputAttributes: {
      min: 1
    },
    inputPlaceholder: "Ej: 2000",
    showCancelButton: true,
    confirmButtonColor: "#0f4b00",
    cancelButtonColor: "#b4b4b4",
    confirmButtonText: "Retirar",
    cancelButtonText: "Cancelar"
  }).then(result => {

    if (result.isConfirmed) {
      const monto = parseFloat(result.value);

      // Monto inválido
      if (isNaN(monto) || monto <= 0) {
        Swal.fire({
          title: "Monto no válido",
          text: "Ingrese un número mayor a 0",
          icon: "error",
          confirmButtonColor: "#0f4b00"
        });
        return;
      }

      // Fondos insuficientes
      if (monto > usuarioActual.saldo) {
        Swal.fire({
          title: "Fondos insuficientes",
          text: "No tiene saldo suficiente para esta operación",
          icon: "warning",
          confirmButtonColor: "#0f4b00"
        });
        return;
      }

      // ✔ Retiro exitoso
      usuarioActual.saldo -= monto;
      actualizarDatos();
      saldoActual.textContent = usuarioActual.saldo.toFixed(2);

      Swal.fire({
        title: "Retiro exitoso",
        html: `Has retirado $${monto.toFixed(2)}.<br>Nuevo saldo: $${usuarioActual.saldo.toFixed(2)}`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0f4b00"   // Cambio de color al botón Ok para que tenga la misma paleta de colores usada
      });

      operacionDiv.textContent =
        `Retiro exitoso de $${monto.toFixed(2)}. Nuevo saldo: $${usuarioActual.saldo.toFixed(2)}`;
    }
  });
}




function salir() {
  usuarioActual = null;
  login.classList.remove("oculto");
  menu.classList.add("oculto");
  pinInput.value = "";
  operacionDiv.textContent = "";
}

// Guarda los datos actualizados en localStorage
function actualizarDatos() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}
