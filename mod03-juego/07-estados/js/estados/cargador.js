var CargadorEstado = {
  preload: function(){

    //posx, poxy, nombre de la imagen
    this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
    this.logo.anchor.setTo(0.5, 0.5);

    //posx, poxy, nombre de la imagen
    this.barra = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY+140, "barra");
    this.barra.anchor.setTo(0.5, 0.5);

    this.load.image("fondo", "img/fondo.png");
    this.load.image("dulce", "img/dulce.png");
    this.load.image("manzana", "img/manzana.png");
    this.load.image("pato", "img/pato.png");
    this.load.image("rotar", "img/rotar.png");

    this.load.spritesheet("mascota", "img/mascota.png", 97, 83, 5, 1, 1);

    // Método de phaser para crear un cargador conun soprite
    this.load.setPreloadSprite(this.barra);
	},
  create: function() {
    console.log('listo');
    game.state.start("JuegoEstado");
  }
};
