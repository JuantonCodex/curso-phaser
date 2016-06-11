var JuegoEstado = {
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;

	},
	preload: function(){
		this.load.image("piso", "img/ground.png");
		this.load.image("plataforma", "img/platform.png");
		this.load.spritesheet("jugador", "img/player_spritesheet.png", 28, 30, 5, 1, 1);
	}
};

var game = new Phaser.Game(360, 592, Phaser.AUTO);
game.state.add("JuegoEstado", JuegoEstado);
game.state.start("JuegoEstado");
