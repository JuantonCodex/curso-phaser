var JuegoEstado = {
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;

		this.game.physics.startSystem(Phaser.ARCADE);
		this.game.physics.arcade.gravity.y = 1000;

		this.VELOCIDAD_JUGADOR = 200;
		this.VELOCIDAD_SALTO = 570;

		this.POSICIONY_BOTONES = 535;

		this.VELOCIDAD_BARRIL= 150;

		this.game.world.setBounds(0,0,360,700);
	},
	preload: function(){
		this.load.image("piso", "img/ground.png");
		this.load.image("plataforma", "img/platform.png");
		this.load.spritesheet("jugador", "img/player_spritesheet.png", 28, 30, 5, 0, 1);

		this.load.image("flecha", "img/arrowButton.png");
		this.load.image("salto", "img/actionButton.png");

		this.load.text("data", "data/niveles.json");

		this.load.image("meta", "img/gorilla3.png");
		this.load.spritesheet("fuego", "img/fire_spritesheet.png", 20, 21, 2, 1, 1);

		this.load.image("barril", "img/barrel.png");
	},
	create: function(){
		this.datos = JSON.parse(this.game.cache.getText("data"));

		this.piso = this.game.add.sprite(0, this.game.world.height-72, "piso");
		this.game.physics.arcade.enable(this.piso);
		this.piso.body.allowGravity = false;
		this.piso.body.immovable = true;

		this.grupoPlataformas = this.game.add.group();
		this.grupoPlataformas.enableBody = true;

		this.datos.plataformaData.forEach(function(elemento){
			this.grupoPlataformas.create(elemento.x, elemento.y, "plataforma");
		}, this);

		this.grupoPlataformas.setAll("body.allowGravity", false);
		this.grupoPlataformas.setAll("body.immovable", true);

		this.jugador = this.game.add.sprite(this.datos.posicionJugador.x, this.datos.posicionJugador.y, "jugador", 3);
		this.jugador.anchor.set(0.5);
		this.jugador.customParams = {};
		this.jugador.animations.add("correr", [0,1,2,1], 6, true);
		this.game.physics.arcade.enable(this.jugador);
		this.jugador.body.collideWorldBounds = true;

		this.meta = this.game.add.sprite(this.datos.posicionMeta.x, this.datos.posicionMeta.y, "meta");
		this.meta.anchor.set(0.5);
		this.game.physics.arcade.enable(this.meta);

		this.grupoFuegos = this.game.add.group();
		this.grupoFuegos.enableBody = true;

		this.datos.fuegoData.forEach(function(elemento) {
			var fuego = this.grupoFuegos.create(elemento.x, elemento.y, "fuego");
			fuego.animations.add("titilear", [0,1], 6, true);
			fuego.animations.play("titilear");
		}, this);

		this.grupoFuegos.setAll("body.allowGravity", false);
		this.grupoFuegos.setAll("body.immovable", true);

		this.grupoBarriles = this.game.add.group();
		this.grupoBarriles.enableBody = true;


		this.timer = this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.crearBarril, this);



		this.teclas = this.game.input.keyboard.addKeys({
			LEFT: Phaser.KeyCode.LEFT,
			RIGHT: Phaser.KeyCode.RIGHT,
			UP: Phaser.KeyCode.UP
		});

		this.cargarControles();

		this.game.camera.follow(this.jugador);
	},
	update: function(){
		this.game.physics.arcade.collide(this.jugador, this.grupoPlataformas);
		this.game.physics.arcade.collide(this.meta, this.grupoPlataformas);
		this.game.physics.arcade.collide(this.jugador, this.piso);
		this.game.physics.arcade.collide(this.grupoBarriles, this.piso);
		this.game.physics.arcade.collide(this.grupoBarriles, this.grupoPlataformas);


		this.game.physics.arcade.overlap(this.meta, this.jugador, this.hayGanador);
		this.game.physics.arcade.overlap(this.grupoFuegos, this.jugador, this.finJuego);

		this.jugador.body.velocity.x = 0;

		if(this.teclas.RIGHT.isDown || this.jugador.customParams.right){
			this.jugador.body.velocity.x = this.VELOCIDAD_JUGADOR;
			this.jugador.scale.setTo(-1, 1);
			this.jugador.animations.play("correr");
		} else if(this.teclas.LEFT.isDown || this.jugador.customParams.left) {
			this.jugador.body.velocity.x = -this.VELOCIDAD_JUGADOR;
			this.jugador.scale.setTo(1, 1);
			this.jugador.animations.play("correr");
		} else if((this.teclas.UP.isDown || this.jugador.customParams.up)){
			this.jugador.frame = 2;
		} else {
			this.jugador.frame = 3;
		}

		if((this.teclas.UP.isDown || this.jugador.customParams.up) && this.jugador.body.touching.down){
			this.jugador.body.velocity.y = -this.VELOCIDAD_SALTO;
		}

		this.grupoBarriles.forEach(function(elemento) {
			var estaFuera = (elemento.x < 10 & elemento.y > 600)? true : false;
			if (estaFuera) {
				elemento.kill();

			}
		});
	},
	cargarControles: function(){
		this.flechaIzq = this.game.add.sprite(20, this.POSICIONY_BOTONES, "flecha");
		this.flechaDer = this.game.add.sprite(110, this.POSICIONY_BOTONES, "flecha");
		this.saltar = this.game.add.sprite(280, this.POSICIONY_BOTONES, "salto");

		this.flechaIzq.inputEnabled = true;
		this.flechaDer.inputEnabled = true;
		this.saltar.inputEnabled = true;

		this.flechaIzq.customParams = {sentido: -1};
		this.flechaDer.customParams = {sentido: 1};

		this.flechaIzq.events.onInputDown.add(this.moverse, this);
		this.flechaDer.events.onInputDown.add(this.moverse, this);
		this.saltar.events.onInputDown.add(this.salto, this);

		this.flechaIzq.events.onInputUp.add(this.parar, this);
		this.flechaDer.events.onInputUp.add(this.parar, this);
		this.saltar.events.onInputUp.add(this.pararDeSaltar, this);

		this.flechaIzq.alpha = 0.5;
		this.flechaDer.alpha = 0.5;
		this.saltar.alpha = 0.5;

		this.flechaIzq.fixedToCamera=true;
		this.flechaDer.fixedToCamera=true;
		this.saltar.fixedToCamera=true;
	},
	moverse:function(sprite, evento){
		if(sprite.customParams.sentido==1) {
			this.jugador.customParams.right = true;
		} else {
			this.jugador.customParams.left = true;
		}

	},
	salto:function(sprite, evento){
		this.jugador.customParams.up = true;
	},
	parar: function(){
		this.jugador.customParams.right = false;
		this.jugador.customParams.left = false;
	},
	pararDeSaltar: function(){
		this.jugador.customParams.up = false;
	},
	hayGanador: function(){
		console.log("Hay ganador");
	},
	finJuego: function(){
		console.log("Fin juego");
		game.state.start("JuegoEstado");
	},
	crearBarril: function() {
		var barril = this.grupoBarriles.getFirstExists(false);
		console.log(barril);
		if (!barril) {
			barril = this.grupoBarriles.create(this.meta.width/2, this.meta.height/2, "barril");
		} else {
			barril.reset(this.meta.width/2, this.meta.height/2, "barril");
		}

		barril.body.velocity.x = this.VELOCIDAD_BARRIL;
		barril.body.collideWorldBounds = true;
		barril.body.bounce.setTo(1, 0.6);
	}

};

var game = new Phaser.Game(360, 592, Phaser.AUTO);
game.state.add("JuegoEstado", JuegoEstado);
game.state.start("JuegoEstado");
