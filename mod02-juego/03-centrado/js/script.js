var JuegoEstado = {
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;
	},
	preload: function(){
		this.load.image("fondo", "img/fondo_prueba.png");
		this.load.image("flecha", "img/flecha.png");
		this.load.image("mama01", "img/personaje_prueba.png");
		this.load.image("mama02", "img/personaje02.png");
		this.load.image("mama03", "img/personaje03.png");
		this.load.image("mama04", "img/personaje04.png");
		this.load.image("mama05", "img/personaje05.png");
		this.load.image("mama06", "img/personaje06.png");
		this.load.image("mama07", "img/personaje07.png");
	},
	create: function(){
		this.fondo = this.game.add.sprite(0, 0, "fondo");
		this.mama01 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "mama01");
		this.mama01.anchor.setTo(0.5, 0.5);
	},
	update: function(){}
};

var game = new Phaser.Game(722, 642, Phaser.AUTO);

game.state.add("juegoEstado", JuegoEstado);
game.state.start("juegoEstado");