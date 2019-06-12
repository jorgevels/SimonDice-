/**
 * Juego
 * Proyecto Final - Simon dice
 */

(async function() {
  const btn = document.getElementById("btn");
  const $celeste = document.getElementById("celeste");
  const $violeta = document.getElementById("violeta");
  const $naranja = document.getElementById("naranja");
  const $verde = document.getElementById("verde");
  const $btn = document.getElementById("btn");
  const $btnRepeat = document.getElementById("repeat");
  const $name = document.getElementById("name");
  const $puntos = document.getElementById("pts");
  const $nivel = document.getElementById("lvl");
  const $sequence = document.getElementById("sequence");
  const $instructions = document.getElementById("instrucciones");

  const startEffect = document.getElementById("start-effect");
  const pointerEffect = document.getElementById("pointer-effect");
  const loseEffect = document.getElementById("lose-effect");
  const winEffect = document.getElementById("win-effect");

  const ULTIMO_NIVEL = 3;

  class Juego {
    constructor() {
      this.repeatCont = 0;
      this.puntos = 0;
      this.inicializar();
      this.generarSecuencia();
      setTimeout(this.siguienteNivel, 500);
    }

    inicializar() {
      startEffect.play();
      JuegoMusic.play();
      this.siguienteNivel = this.siguienteNivel.bind(this);
      this.elegirColor = this.elegirColor.bind(this);
      this.repeatSequenceColor = this.repeatSequenceColor.bind(this);
      $btn.removeEventListener("click", inicializarJuego);
      $btn.classList.add("btn--Juego");
      this.nivel = 1;
      this.colores = {
        celeste: $celeste,
        violeta: $violeta,
        naranja: $naranja,
        verde: $verde
      };
    }

    // ReStart
    restart() {
      this.eliminarEventosClick();
      btn.classList.remove("hide");
      if (JuegoMusic.paused) {
        JuegoMusic.play();
      }
    }

    generarSecuencia() {
      this.sequence = new Array(ULTIMO_NIVEL)
        .fill(0)
        .map(numero => Math.floor(Math.random() * 4));
    }

    siguienteNivel() {
      this.subnivel = 0;
      this.iluminarSecuencia();
      this.addEventClicks();
    }

    transformarNumeroAColor(numero) {
      switch (numero) {
        case 0:
          return "celeste";
        case 1:
          return "violeta";
        case 2:
          return "naranja";
        case 3:
          return "verde";
      }
    }

    transformarColorANumero(color) {
      switch (color) {
        case "celeste":
          return 0;
        case "violeta":
          return 1;
        case "naranja":
          return 2;
        case "verde":
          return 3;
      }
    }

    iluminarColor(color) {
      this.colores[color].classList.add("light");
      setTimeout(() => {
        this.colores[color].classList.remove("light");
      }, 350);
    }

    iluminarSecuencia() {
      for (let i = 0; i < this.nivel; i++) {
        const color = this.transformarNumeroAColor(this.sequence[i]);
        setTimeout(() => {
          this.iluminarColor(color);
        }, 1000 * i);
      }
    }

    stopMusic() {
      JuegoMusic.currentTime = 0;
      JuegoMusic.pause();
    }

    addEventClicks() {
      for (const element in this.colores) {
        this.colores[element].addEventListener("click", this.elegirColor);
      }

      $btnRepeat.addEventListener("click", this.repeatSequenceColor);
    }

    removeEventClicks() {
      for (const element in this.colores) {
        this.colores[element].removeEventListener("click", this.elegirColor);
      }

      $btnRepeat.addEventListener("click", this.repeatSequenceColor);
    }

    repeatSequenceColor() {
      this.repeatCont++;
      this.iluminarSecuencia();
      $sequence.textContent = this.repeatCont;
    }

    smssiguienteNivel() {
      startEffect.play();
      Swal.fire({
        type: "success",
        title: `Nivel ${this.nivel - 1} superado`
      }).then(this.siguienteNivel);
    }

    ganoJuego() {
      Swal.fire({
        title: "Felicidades Ganastes!",
        text: "¿Deseas jugar de nuevo?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",

        cancelButtonText: "No"
      }).then(result => {
        if (result.value) inicializarJuego();
        else $btn.addEventListener("click", inicializarJuego);
        JuegoMusic.play();
      });
    }

    perdioJuego() {
      loseEffect.play();
      Swal.fire({
        title: "Lo siento, perdistes!",
        text: "¿Deseas jugar de nuevo?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "No"
      }).then(result => {
        if (result.value) inicializarJuego();
        else $btn.addEventListener("click", inicializarJuego);
        JuegoMusic.play();
      });
    }

    elegirColor(event) {
      pointerEffect.play();
      const nombreColor = event.target.dataset.color;
      const numeroColor = this.transformarColorANumero(nombreColor);
      this.iluminarColor(nombreColor);
      if (numeroColor === this.sequence[this.subnivel]) {
        this.subnivel++;
        if (this.subnivel === this.nivel) {
          this.nivel++;
          if (this.repeatCont > 0) {
            this.puntos += this.subnivel * 2 - this.repeatCont;
          } else this.puntos = this.subnivel * 2;
          this.repeatCont = 0;
          $sequence.textContent = this.repeatCont;
          $puntos.textContent = this.puntos < 0 ? 0 : this.puntos;
          $nivel.textContent = this.nivel;
          this.removeEventClicks();
          if (this.nivel === ULTIMO_NIVEL + 1) {
            this.ganoJuego();
            this.stopMusic();
            winEffect.play();
          } else {
            this.smssiguienteNivel();
            //setTimeout(this.siguienteNivel, 1500);
          }
        }
      } else {
        this.perdioJuego();
        //perdio
      }
    }
  }

  const inicializarJuego = () => {
    const simonJuego = new Juego();
  };

  $btn.addEventListener("click", inicializarJuego);

  $instructions.addEventListener("click", () => {
    Swal.fire({
      type: "info",
      title: "¿Como Jugar?",
      html: `<div style="text-align: left;"><strong>1.-</strong> Cada acierto te suma 2 puntos.</div>
                 <div style="text-align: left;"><strong>2.-</strong> Acertar toda la secuencia de colores.</div>
                 <div style="text-align: left;"><strong>3.-</strong> Repetir la secuencia de colores de resta un punto.</div>
                 <div style="text-align: left;"><strong>4.-</strong> Completar los ${ULTIMO_NIVEL} Niveles.</div>
                 <br>
                 <div style="text-align: right;"><strong>Dev.</strong> Jorge Velasquez</div>
                 `
    });
  });

  const { value: name } = await Swal.fire({
    title: "Ingrese un nombre",
    input: "text",
    inputPlaceholder: "Ingrese un nombre",
    allowEscapeKey: false,
    allowOutsideClick: false,
    inputValidator: value => {
      if (!value) {
        return "Necesitas ingresar un nombre";
      }
    }
  });
  $name.textContent = name;
})();

const JuegoMusic = document.getElementById("Juego-music");

function controlAudio() {
  JuegoMusic.muted ? (JuegoMusic.muted = false) : (JuegoMusic.muted = true);
}

function music(action) {
  switch (action) {
    case "play":
      JuegoMusic.play();
      break;
    case "stop":
      JuegoMusic.pause();
      break;
  }
}
