var juegoEstado = {
  // Aquí se inicializan las variables
  init: function () {
    this.scale.pageAlignHorizontally = true;
  },
  // Aquí se cargas las imágenes, audios, etc.
  preload: function () {
    this.load.image("fondo", "img/fondo.png");
  },
  // Aquí se dibuja, se anima, etc.
  create: function () {
    this.game.add.sprite(0, 0, "fondo");
  },
  // Esta función se ejecuta muchas veces
  update: function () {
    console.log("función update");
  }
};

var game = new Phaser.Game(722, 642, Phaser.AUTO);

// El primer parámetro es sólo una etiqueta y el segundo es
// el objeto de estados.
game.state.add("JuegoEstado", juegoEstado);


game.state.start("JuegoEstado");
