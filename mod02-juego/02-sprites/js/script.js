var JuegoEstado = {
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;
	},
	preload: function(){
		this.load.image("fondo", "img/fondo.png");
	},
	create: function(){
		this.fondo = this.game.add.sprite(0, 0, "fondo");
	},
	update: function(){}
};

var game = new Phaser.Game(722, 642, Phaser.AUTO);

game.state.add("juegoEstado", JuegoEstado);
game.state.start("juegoEstado");