import Phaser from 'phaser';
import EightDirectionPlugin from 'phaser3-rex-plugins/plugins/eightdirection-plugin.js';
import StartImg from './assets/image/btn_start.png';
import EnemyBulletImg from './assets/image/enemy.png';
import PlayerImg from './assets/image/player.png';
import ItemImg from './assets/image/item.png';
import BgImg from './assets/image/bg.png';
import ScoreImg from './assets/image/bg_score.png';
import SpoqaHanSansNeoRegularFont from './assets/font/SpoqaHanSansNeo-Regular.ttf';
import Api from './lib/api';
import { EndingPopup } from './script/endingPopup';
import { ItemPopup } from './script/itemPopup';
import Rexeightdirectionplugin from './lib/rexeightdirectionplugin.min';
import Rexvirtualjoystickplugin from './lib/rexvirtualjoystickplugin.min';

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: 'game' });
    this.centerX = null;
    this.centerY = null;
    this.player;
    this.playerInputKey = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
    this.playerDir;
    this.cursors;
    this.bg;
    this.enemyBullet;
    this.enemyBulletCount = 40;
    this.enemyCount = this.enemyBulletCount;
    this.enemyCountText;
    this.timerText;
    this.timer = '000';
    this.gameStartBtn;
    this.gameOverText;
    this.gameStartFlag = false;
    this.gameOverFlag = false;
    this.scoreContainer;
    this.scorePopup;
    this.joyStick;
    this.invincibility = false;
    this.dim;
    this.startArea = [
      {
        index: 0,
        startX: {
          min: 0,
          max: 900,
        },
        startY: {
          min: -100,
          max: -50,
        },
      },
      {
        index: 1,
        startX: {
          min: 1000,
          max: 1100,
        },
        startY: {
          min: 0,
          max: 900,
        },
      },
      {
        index: 2,
        startX: {
          min: 0,
          max: 900,
        },
        startY: {
          min: 900,
          max: 950,
        },
      },
      {
        index: 3,
        startX: {
          min: -100,
          max: -50,
        },
        startY: {
          min: 0,
          max: 700,
        },
      },
    ];
  }

  preload() {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.load.image('startBtn', StartImg);
    this.load.spritesheet('enemyBullet', EnemyBulletImg, {
      frameWidth: 52,
      frameHeight: 25,
    });
    this.load.spritesheet('player', PlayerImg, {
      frameWidth: 93,
      frameHeight: 63,
    });
    this.load.spritesheet('itemBullet', ItemImg, {
      frameWidth: 115,
      frameHeight: 100,
    });
    this.load.image('bg', BgImg);
    this.load.image('score', ScoreImg);
    this.load.plugin('rexeightdirectionplugin', Rexeightdirectionplugin, true);
    this.load.plugin(
      'rexvirtualjoystickplugin',
      Rexvirtualjoystickplugin,
      true
    );
  }

  create() {
    // 게임 토큰 저장
    Api('get', 'users/load', {}, (res) => {
      if (res.msg == 'ERROR') {
        this.scene.stop();
      }
    });

    // 배경
    this.bg = this.add.tileSprite(this.centerX, this.centerY, 1000, 800, 'bg');

    // dim 배경
    this.dim = this.add
      .graphics()
      .fillStyle(0x4771fa, 0.6)
      .fillRect(0, 0, 1000, 800);
    this.dim.setVisible(false);

    // 적 총알 셋팅
    this.enemyBullet = this.add.group();
    this.enemyBullet.createMultiple({
      key: 'enemyBullet',
      repeat: this.enemyBulletCount,
    });
    this.physics.world.enable(this.enemyBullet);
    this.enemyBullet.setVisible(false);

    // 플레이어
    this.player = this.add.sprite(this.centerX, this.centerY, 'player');
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(0.6);
    this.physics.world.enable(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setCircle(30, 15);
    this.player.body.debugBodyColor = 0xffff00;
    this.player.setVisible(false);

    // 게임 시작 버튼
    this.gameStartBtn = this.add.image(this.centerX, this.centerY, 'startBtn');
    this.gameStartBtn.setOrigin(0.5, 0.5);
    this.gameStartBtn
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          this.gameStart();
        },
        this
      );

    // 모바일 조이스틱 추가
    if (!this.sys.game.device.os.desktop) {
      this.joyStick = this.plugins
        .get('rexvirtualjoystickplugin')
        .add(this, {
          enable: false,
          x: 150,
          y: 660,
          radius: 100,
          base: this.add.circle(0, 0, 120, 0x888888, 0.5),
          thumb: this.add.circle(0, 0, 60, 0xcccccc),
        })
        .on('update', this.dumpJoyStickState, this);

      this.plugins.get('rexeightdirectionplugin').add(this.player, {
        speed: 200,
        dir: '8dir',
        rotateToDirection: false,
        cursorKeys: this.joyStick.createCursorKeys(),
      });
    }

    // 상단 팝업
    this.scorePopup = this.add.image(this.centerX, 150, 'score');

    // 스코어판 컨테이너
    this.scoreContainer = this.add.container(0, 0);
    this.timerText = this.add.text(this.centerX, 170, `${this.timer}초`, {
      fontSize: '30px',
      color: 'orange',
      fontFamily: 'SpoqaHanSansNeo-Regular',
    });
    this.timerText.setOrigin(0.5, 0.5);
    this.scoreContainer.add(this.scorePopup);
    this.scoreContainer.add(this.timerText);

    // scene start callback 이벤트
    this.events.on('start', () => {
      this.gameRestart();
    });

    // scene resume callback 이벤트
    this.events.on('resume', () => {
      this.gameResume();
    });

    // 키보드 이벤트 추가
    this.cursors = this.input.keyboard.createCursorKeys();

    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowLeft') {
        this.playerInputKey.left = true;
      } else if (e.key == 'ArrowRight') {
        this.playerInputKey.right = true;
      } else if (e.key == 'ArrowUp') {
        this.playerInputKey.up = true;
      } else if (e.key == 'ArrowDown') {
        this.playerInputKey.down = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key == 'ArrowLeft') {
        this.playerInputKey.left = false;
      } else if (e.key == 'ArrowRight') {
        this.playerInputKey.right = false;
      } else if (e.key == 'ArrowUp') {
        this.playerInputKey.up = false;
      } else if (e.key == 'ArrowDown') {
        this.playerInputKey.down = false;
      }
    });
  }

  update() {
    if (!this.gameStartFlag) {
      return;
    }

    if (this.sys.game.device.os.desktop) {
      this.player.body.velocity.setTo(0, 0);

      if (this.playerInputKey.left) {
        this.player.body.velocity.x = -200;
        this.player.setTexture('player', 0);
        this.playerDir = 'left';
      }
      if (this.playerInputKey.right) {
        this.player.body.velocity.x = +200;
        this.player.setTexture('player', 2);
        this.playerDir = 'right';
      }
      if (this.playerInputKey.up) {
        this.player.body.velocity.y = -200;
      }
      if (this.playerInputKey.down) {
        this.player.body.velocity.y = +200;
      }

      if (this.playerInputKey.left && this.playerInputKey.down) {
        this.player.body.velocity.x = -150;
        this.player.body.velocity.y = +150;
      }
      if (this.playerInputKey.left && this.playerInputKey.up) {
        this.player.body.velocity.x = -150;
        this.player.body.velocity.y = -150;
      }
      if (this.playerInputKey.right && this.playerInputKey.up) {
        this.player.body.velocity.x = +150;
        this.player.body.velocity.y = -150;
      }
      if (this.playerInputKey.right && this.playerInputKey.down) {
        this.player.body.velocity.x = +150;
        this.player.body.velocity.y = +150;
      }
    }

    this.enemyBullet.children.each((bullet) => {
      if (
        bullet.x < -100 ||
        bullet.x > 1050 ||
        bullet.y < -100 ||
        bullet.y > 950
      ) {
        this.startBullet(bullet);
      }
    });

    this.physics.overlap(
      this.enemyBullet,
      this.player,
      this.enemyHitsPlayer,
      null,
      this
    );

    this.scoreContainer.setDepth(1);
  }

  dumpJoyStickState() {
    if (this.joyStick.left) {
      this.player.setTexture('player', 0);
      this.playerDir = 'left';
    } else if (this.joyStick.right) {
      this.player.setTexture('player', 2);
      this.playerDir = 'right';
    }
  }

  gameStart() {
    if (!this.sys.game.device.os.desktop) {
      this.joyStick.enable = true;
    }
    this.enemyBullet.setVisible(true);
    this.player.setVisible(true);
    this.gameStartBtn.setVisible(false);
    this.gameStartFlag = true;
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        let enemyBullet;
        this.enemyCount++;
        if (this.enemyCount % 5 == 0) {
          let itemNum = Phaser.Math.Between(0, 5);
          enemyBullet = this.add.image(0, 0, 'itemBullet', itemNum);
          enemyBullet.setName('item_' + itemNum);
        } else {
          enemyBullet = this.add.image(0, 0, 'enemyBullet');
          enemyBullet.setName('enemy');
        }
        this.enemyBullet.add(enemyBullet);
        this.startBullet(enemyBullet);
      },
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 10,
      callback: () => {
        this.timer = parseInt(this.timer) + 10;
        this.timerText.setText(
          `${Math.floor(this.timer * 0.001)
            .toString()
            .padStart(3, 0)}초`
        );
      },
      callbackScope: this,
      loop: true,
    });

    this.enemyBullet.children.each((bullet) => {
      this.startBullet(bullet);
    });
  }

  gameResume() {
    this.player.alpha = 0.5;
    setTimeout(() => {
      this.player.alpha = 1;
      this.invincibility = false;
    }, 3000);
  }

  gameRestart() {
    this.gameStartFlag = false;
    this.enemyCount = this.enemyBulletCount;
    this.timer = '000';
  }

  enemyHitsPlayer(bullet, player) {
    if (this.invincibility) {
      return;
    }
    this.scene.pause();
    // 아이템 먹었을 경우
    if (bullet.name.indexOf('item_') > -1) {
      bullet.setVisible(false);
      this.invincibility = true;
      this.physics.world.disable(bullet);
      this.scene.launch('itemPopup', {
        itemNum: bullet.name.split('_')[1],
        game: game,
      });
    }
    // 총알 맞았을 경우
    else {
      if (this.playerDir == 'right') {
        this.player.setTexture('player', 3);
      } else {
        this.player.setTexture('player', 1);
      }
      this.gameOverFlag = true;
      this.dim.setDepth(1);
      this.dim.setVisible(true);
      this.scene.launch('endingPopup', {
        score: (this.timer * 0.001).toFixed(2),
        game: game,
      });
    }
  }

  startBullet(bullet) {
    var startArea = Phaser.Math.RND.pick(this.startArea);
    var startX = startArea.startX;
    var startY = startArea.startY;

    bullet.x = Phaser.Math.Between(startX.min, startX.max);
    bullet.y = Phaser.Math.Between(startY.min, startY.max);

    bullet.setScale(0.7);

    this.physics.world.enable(bullet);

    if (startArea.index == 0) {
      bullet.body.setVelocity(
        Phaser.Math.Between(-50, 50),
        Phaser.Math.Between(100, 200)
      );
    } else if (startArea.index == 1) {
      bullet.body.setVelocity(
        Phaser.Math.Between(-100, -200),
        Phaser.Math.Between(0, 100)
      );
    } else if (startArea.index == 2) {
      bullet.body.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-100, -200)
      );
    } else if (startArea.index == 3) {
      bullet.body.setVelocity(
        Phaser.Math.Between(100, 100),
        Phaser.Math.Between(-100, 100)
      );
    }
    if (bullet.name.indexOf('item_') == -1) {
      if (bullet.body.velocity.x < 0) {
        bullet.setTexture('enemyBullet', 0);
      } else {
        bullet.setTexture('enemyBullet', 1);
      }
    }
  }
}

const loadFont = (name, url) => {
  let newFont = new FontFace(name, `url(${url})`);
  newFont
    .load()
    .then(function (loaded) {
      document.fonts.add(loaded);
    })
    .catch(function (error) {
      return error;
    });
};

loadFont('SpoqaHanSansNeo-Regular', SpoqaHanSansNeoRegularFont);

const config = {
  type: Phaser.AUTO,
  scene: [MyGame, EndingPopup, ItemPopup],
  parent: 'phaser-game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 800,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  plugins: {
    scene: [
      {
        key: 'rexEightDirection',
        plugin: EightDirectionPlugin,
        start: true,
      },
    ],
  },
  dom: {
    createContainer: true,
  },
};

const game = new Phaser.Game(config);
