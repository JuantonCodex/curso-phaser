var POSICION_INICIAL = 100,
	DX = 100,
	DY = 100;

var JuegoEstado = {
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.itemSeleccionado = null;
		this.mascotaMoviendose = false;
	},
	preload: function(){
		this.load.image("fondo", "img/fondo.png");
		this.load.image("dulce", "img/dulce.png");
		this.load.image("manzana", "img/manzana.png");
		this.load.image("pato", "img/pato.png");
		this.load.image("rotar", "img/rotar.png");

		this.load.spritesheet("mascota", "img/mascota.png", 97, 83, 5, 1, 1);
	},

	create: function(){
		this.fondo = this.game.add.sprite(0, 0, "fondo");
		this.fondo.inputEnabled = true;
		this.fondo.events.onInputDown.add(this.ubicando, this);

		this.mascota = this.game.add.sprite(120, 120, "mascota");
		this.mascota.anchor.setTo(0.5, 0.5);
		this.mascota.inputEnabled = true;
		this.mascota.input.enableDrag(true);

		this.dulce = this.game.add.sprite(POSICION_INICIAL, this.game.height-DY, "dulce");
		this.dulce.inputEnabled = true;
		this.dulce.events.onInputDown.add(this.seleccionar, this);

		this.manzana = this.game.add.sprite(POSICION_INICIAL+DX, this.game.height-DY, "manzana");
		this.manzana.inputEnabled = true;
		this.manzana.events.onInputDown.add(this.seleccionar, this);

		this.pato = this.game.add.sprite(POSICION_INICIAL+2*DX, this.game.height-DY, "pato");
		this.pato.inputEnabled = true;
		this.pato.events.onInputDown.add(this.seleccionar, this);

		this.rotar = this.game.add.sprite(POSICION_INICIAL+3*DX, this.game.height-DY, "rotar");
		this.rotar.inputEnabled = true;
		this.rotar.events.onInputDown.add(this.rotacion, this);

		this.botones = [this.dulce, this.manzana, this.pato, this.rotar];
	},
	rotacion: function(sprite, evento){
		if(this.itemSeleccionado || this.mascotaMoviendose) return;
		
		var animacionMascotaGirar = this.game.add.tween(this.mascota);
		animacionMascotaGirar.to({angle: "720"}, 1000);
		animacionMascotaGirar.start();
	},
	seleccionar: function(sprite, evento){
		if (this.itemSeleccionado) return;

		this.botones.forEach(function(item){
			item.alpha = 0.5;
		});
		sprite.alpha = 1;
		this.itemSeleccionado = sprite;
	},
	ubicando: function(sprite, evento){
		if(this.itemSeleccionado && this.mascotaMoviendose === false) {
			this.mascotaMoviendose = true;

			var elemento = this.game.add.sprite(evento.position.x, evento.position.y, this.itemSeleccionado.key);
			elemento.anchor.setTo(0.5, 0.5);

			var animacionMascotaDesp = this.game.add.tween(this.mascota);
			animacionMascotaDesp.to({x: evento.position.x, y: evento.position.y}, 500);
			animacionMascotaDesp.onComplete.add(function(){
					elemento.destroy();
					this.deseleccionar();
					this.mascotaMoviendose = false
			}, this);

			animacionMascotaDesp.start();
		}
	},
	deseleccionar: function(sprite, evento) {
		this.botones.forEach(function(item){
			item.alpha = 1;
		});
		this.itemSeleccionado = null;
	}
};

var game = new Phaser.Game(722, 642, Phaser.AUTO);
game.state.add("JuegoEstado", JuegoEstado);
game.state.start("JuegoEstado");
