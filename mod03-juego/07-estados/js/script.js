var game = new Phaser.Game(722, 642, Phaser.AUTO);

game.state.add("BootEstado", BootEstado);
game.state.add("CargadorEstado", CargadorEstado);
game.state.add("JuegoEstado", JuegoEstado);

game.state.start("BootEstado");
