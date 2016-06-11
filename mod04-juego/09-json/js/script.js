var JuegoEstado = {
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;

		this.game.physics.startSystem(Phaser.ARCADE);
		this.game.physics.arcade.gravity.y = 1000; // Existe graverdad horizontal y vertical

		this.VELOCIDAD_JUGADOR = 150;
		this.VELOCIDAD_SALTO = 600;
		this.POSICIONY_BOTONES = 535;

		this.game.world.setBounds(0, 0, 360, 700);

	},
	preload: function(){
		this.load.image("piso", "img/ground.png");
		this.load.image("plataforma", "img/platform.png");
		this.load.spritesheet("jugador", "img/player_spritesheet.png", 28, 30, 5, 1, 1);

		this.load.image("flecha", "img/arrowButton.png");
		this.load.image("salto", "img/actionButton.png");

		this.load.text("data", "data/niveles.json");

	},
	create: function() {
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



		this.jugador = this.game.add.sprite(this.datos.posicionJugador.x, this.datos.posicionJugador.y, "jugador", 5);
		this.jugador.anchor.set(0.5);
		this.jugador.customParams = {};
		this.jugador.animations.add("correr", [0,1,2,1], 6, true);
		this.game.physics.arcade.enable(this.jugador);
		this.jugador.body.collideWorldBounds = true;

		this.teclas = this.game.input.keyboard.addKeys({
			LEFT: Phaser.KeyCode.LEFT,
			RIGHT: Phaser.KeyCode.RIGHT,
			UP: Phaser.KeyCode.UP
		});

		this.cargarControles();

		this.game.camera.follow(this.jugador);
	},
	update : function() {
		this.game.physics.arcade.collide(this.jugador, this.grupoPlataformas);
		this.game.physics.arcade.collide(this.jugador, this.piso);
		this.jugador.body.velocity.x = 0;


		if (this.teclas.RIGHT.isDown || this.jugador.customParams.right) {
			this.jugador.body.velocity.x = this.VELOCIDAD_JUGADOR;
			this.jugador.scale.setTo(-1, 1);
			this.jugador.animations.play("correr");


		} else if (this.teclas.LEFT.isDown || this.jugador.customParams.left) {
			this.jugador.body.velocity.x = -this.VELOCIDAD_JUGADOR;
			this.jugador.scale.setTo(1, 1);

			this.jugador.animations.play("correr");


		} else if (this.teclas.UP.isDown || this.jugador.customParams.up) {
			this.jugador.frame = 2;
		} else {

			this.jugador.frame = 3;
		}

		if ((this.teclas.UP.isDown || this.jugador.customParams.up) && this.jugador.body.touching.down) {
			this.jugador.body.velocity.y = -this.VELOCIDAD_SALTO;
		}
	},
	cargarControles: function() {
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
		this.saltar.events.onInputUp.add(this.pararSaltar, this);

		this.flechaIzq.alpha = 0.5;
		this.flechaDer.alpha = 0.5;
		this.saltar.alpha = 0.5;

		this.flechaIzq.fixedToCamera = true;
		this.flechaDer.fixedToCamera = true;
		this.saltar.fixedToCamera = true;
	},
	moverse: function(sprite, evento) {

		if (sprite.customParams.sentido === 1) {
			this.jugador.customParams.right = true;

		} else {
			this.jugador.customParams.left = true;

		}
	},
	parar: function(sprite, evento) {
		this.jugador.customParams.right = false;
		this.jugador.customParams.left = false;
	},
	pararSaltar: function() {
		this.jugador.customParams.up = false;
	},
	salto: function() {
		this.jugador.customParams.up = true;
	}
};

var game = new Phaser.Game(360, 550, Phaser.AUTO);
game.state.add("JuegoEstado", JuegoEstado);
game.state.start("JuegoEstado");
