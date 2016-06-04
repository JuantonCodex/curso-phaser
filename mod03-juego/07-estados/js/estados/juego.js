var POSICION_INICIAL = 100,
	DX = 100,
	DY = 100;

var JuegoEstado = {
	init: function(){
		this.itemSeleccionado = null;
		this.mascotaMoviendose = false;
	},
	create: function(){
		this.fondo = this.game.add.sprite(0, 0, "fondo");
		this.fondo.inputEnabled = true;
		this.fondo.events.onInputDown.add(this.ubicando, this);

		this.mascota = this.game.add.sprite(120, 120, "mascota");
		this.mascota.anchor.setTo(0.5, 0.5);
		this.mascota.inputEnabled = true;
		this.mascota.input.enableDrag(true);
		this.mascota.animations.add("divertido",[1,2,3,2,1,2,3,2,1], 8, false);
		this.mascota.customParams = {
			diversion: 100,
			salud: 100
		};


		this.dulce = this.game.add.sprite(POSICION_INICIAL, this.game.height-DY, "dulce");
		this.dulce.inputEnabled = true;
		this.dulce.events.onInputDown.add(this.seleccionar, this);
		this.dulce.customParams = {
			salud: -20,
			diversion: 15
		};

		this.manzana = this.game.add.sprite(POSICION_INICIAL+DX, this.game.height-DY, "manzana");
		this.manzana.inputEnabled = true;
		this.manzana.events.onInputDown.add(this.seleccionar, this);
		this.manzana.customParams = {
			salud: 20,
			diversion: -10
		};

		this.pato = this.game.add.sprite(POSICION_INICIAL+2*DX, this.game.height-DY, "pato");
		this.pato.inputEnabled = true;
		this.pato.events.onInputDown.add(this.seleccionar, this);
		this.pato.customParams = {
			diversion: 20
		};

		this.rotar = this.game.add.sprite(POSICION_INICIAL+3*DX, this.game.height-DY, "rotar");
		this.rotar.inputEnabled = true;
		this.rotar.events.onInputDown.add(this.rotacion, this);
		this.rotar.customParams = {
			diversion:10
		};

		this.botones = [this.dulce, this.manzana, this.pato, this.rotar];
		this.game.time.events.loop(Phaser.Timer.SECOND * 4, this.reducir, this);
	},
	rotacion: function(sprite, evento){
		if(this.itemSeleccionado || this.mascotaMoviendose) return;
		var animacionMascotaGirar = this.game.add.tween(this.mascota);
		animacionMascotaGirar.to({angle: "720"}, 1000);
		animacionMascotaGirar.start();

		this.mascota.customParams.diversion += this.rotar.customParams.diversion;

		console.log(this.mascota.customParams);


	},
	seleccionar: function(sprite, evento){
		if(this.itemSeleccionado) return;

		this.botones.forEach(function(item){
			item.alpha = 0.5;
		});
		sprite.alpha = 1;
		this.itemSeleccionado = sprite;
	},
	ubicando: function(sprite, evento){
		if(this.itemSeleccionado && !this.mascotaMoviendose) {
			this.mascotaMoviendose = true;

			var elemento = this.game.add.sprite(evento.position.x, evento.position.y, this.itemSeleccionado.key);
			elemento.anchor.setTo(0.5, 0.5);
			elemento.customParams = this.itemSeleccionado.customParams;

			var animacionMascotaDesp = this.game.add.tween(this.mascota);
			animacionMascotaDesp.to({x:evento.position.x, y:evento.position.y}, 1000);
			animacionMascotaDesp.onComplete.add(function(){

				Object.keys(elemento.customParams).forEach(function(prop){
					this.mascota.customParams[prop] += elemento.customParams[prop];
				}, this);

				console.log(this.mascota.customParams);


				elemento.destroy();
				this.deseleccionar();
				this.mascotaMoviendose = false;
				this.mascota.animations.play("divertido");
			}, this);

			animacionMascotaDesp.start();

		}
	},
	deseleccionar: function(){
		this.botones.forEach(function(item){
			item.alpha = 1;
		});

		this.itemSeleccionado = null;
	},
	update: function(){
		var diversion = this.mascota.customParams.diversion,
			salud = this.mascota.customParams.salud;

		if(diversion<=0 || salud<=0) {
			console.log("Mascota se murió");
			this.mascota.frame = 4;
		}
	},
	reducir: function(){
		this.mascota.customParams.diversion -= 20;
		this.mascota.customParams.salud -=20;
		console.log(this.mascota.customParams);
	}
};
