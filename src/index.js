import Phaser from 'phaser';
import EightDirectionPlugin from 'phaser3-rex-plugins/plugins/eightdirection-plugin.js';
import startImg from './assets/image/btn_start.png';
import confirmImg from './assets/image/btn_confirm.png';
import enemyBulletImg from './assets/image/enemy.png';
import playerImg from './assets/image/player.png';
import itemImg from './assets/image/item.png';
import bgImg from './assets/image/bg.png';
import scoreImg from './assets/image/bg_score.png';
import popupImg from './assets/image/popup.png';
import SpoqaHanSansNeoRegularFont from './assets/font/SpoqaHanSansNeo-Regular.ttf';
import api from './lib/api';

class endingPopup extends Phaser.Scene {
  constructor() {
    super({ key: 'endingPopup' });
    this.popupContainer;
    this.formContainer;
    this.formButton;
    this.sendButton;
    this.retryButton;
    this.retryButton2;
    this.centerX;
    this.centerY;
    this.score;
    this.nameInputText;
    this.checkBox;
  }

  init(data) {
    this.score = data.score;
  }

  preload() {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.load.plugin(
      'rexinputtextplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js',
      true
    );
  }
  create() {
    this.popupContainer = this.add.container(0, 0);
    this.formContainer = this.add.container(0, 0);
    const test = this.add.graphics();
    test.fillStyle(0xffffff, 1);
    test.fillRect(this.centerX - 150, this.centerY - 100, 300, 200);
    const test2 = this.add
      .text(this.centerX, this.centerY - 50, '기록을 등록 하시겠습니까?', {
        color: 'black',
        fontFamily: 'Open Sans',
      })
      .setOrigin(0.5, 0.5);

    const test3 = this.add.graphics();
    test3.fillStyle(0xffffff, 1);
    test3.fillRect(this.centerX - 150, this.centerY - 100, 300, 200);

    const test4 = this.add
      .text(this.centerX, this.centerY - 50, '점수 등록', {
        color: 'black',
        fontFamily: 'Open Sans',
      })
      .setOrigin(0.5, 0.5);

    this.formButton = this.add
      .text(this.centerX + -50, this.centerY + 50, '기록 등록', {
        color: 'blue',
        fontFamily: 'Open Sans',
      })
      .setOrigin(0.5, 0.5);

    this.retryButton = this.add
      .text(this.centerX + 50, this.centerY + 50, '다시 도전', {
        color: 'red',
        fontFamily: 'Open Sans',
      })
      .setOrigin(0.5, 0.5);

    this.nameInputText = this.add
      .rexInputText(this.centerX, this.centerY, 300, 100, {
        type: 'text',
        text: '',
        fontSize: '12px',
        color: 'black',
        maxLength: 20,
        fontFamily: 'Open Sans',
        fontSize: '20px',
      })
      .setOrigin(0.5, 0.5);

    this.checkBox = this.add
      .rexInputText(this.centerX, this.centerY + 50, 25, 25, {
        type: 'checkbox',
      })
      .setOrigin(0.5, 0.5);

    this.sendButton = this.add
      .text(this.centerX + -50, this.centerY + 80, '등록하기', {
        color: 'blue',
        fontFamily: 'Open Sans',
      })
      .setOrigin(0.5, 0.5);

    this.retryButton2 = this.add
      .text(this.centerX + 50, this.centerY + 80, '다시 도전', {
        color: 'red',
        fontFamily: 'Open Sans',
      })
      .setOrigin(0.5, 0.5);

    this.popupContainer.add([test, test2, this.formButton, this.retryButton]);
    this.formContainer.add([
      this.nameInputText,
      this.checkBox,
      test3,
      test4,
      this.sendButton,
      this.retryButton2,
    ]);
    this.formContainer.setVisible(false);

    this.formButton
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          this.popupContainer.setVisible(false);
          this.formContainer.setVisible(true);
        },
        this
      );

    this.retryButton
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          this.scene.stop();
          game.scene.start('game');
        },
        this
      );

    this.sendButton
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          const sendData = {
            name: 'TEST',
            score: this.score,
            hp: '11111111111',
            publishedDate: new Date(),
          };
          api('post', 'users', sendData, (res) => {
            if (res.msg == 'OK') {
              // 이미 hp가 등록되어 있음
              if (res.result.data.exist) {
                // 점수가 낮아 갱신 할 필요가 없음
                if (res.result.data == 'NOT UPDATE') {
                  console.log('업데이트 할 필요가 없음');
                }
                // 데이터 갱신 완료
                else {
                  api(
                    'patch',
                    `users/${res.result.data.exist._id}`,
                    sendData,
                    (res) => {
                      this.formContainer.setVisible(false);
                    }
                  );
                }
              }
              // 데이터 정상적으로 등록 완료
              else {
                this.formContainer.setVisible(false);
              }
            }
          });
        },
        this
      );

    this.retryButton2
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          this.scene.stop();
          game.scene.start('game');
        },
        this
      );
  }
}

class itemPopup extends Phaser.Scene {
  constructor() {
    super({ key: 'itemPopup' });
    this.popupContainer;
    this.exitButton;
    this.centerX;
    this.centerY;
    this.itemNum;
    this.itemPopup;
  }
  init(data) {
    this.itemNum = data.itemNum;
  }
  preload() {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.load.spritesheet('popup', popupImg, {
      frameWidth: 692,
      frameHeight: 596,
    });
    this.load.image('confirmBtn', confirmImg);
  }
  create() {
    this.add.image(this.centerX, this.centerY, 'popup', this.itemNum);

    this.exitButton = this.add.image(
      this.centerX,
      this.centerY + 180,
      'confirmBtn'
    );
    this.exitButton.setOrigin(0.5, 0.5);
    this.exitButton
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          this.scene.stop();
          game.scene.resume('game');
        },
        this
      );
  }
}

class MyGame extends Phaser.Scene {
  constructor() {
    super({ key: 'game' });
    this.centerX = null;
    this.centerY = null;
    this.player;
    this.playerDir;
    this.cursors;
    this.bg;
    this.enemyBullet;
    this.enemyBulletCount = 50;
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
    //this.topNavi;
    this.invincibility = false;
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
    this.load.image('startBtn', startImg);
    this.load.spritesheet('enemyBullet', enemyBulletImg, {
      frameWidth: 52,
      frameHeight: 25,
    });
    this.load.spritesheet('player', playerImg, {
      frameWidth: 93,
      frameHeight: 63,
    });
    this.load.spritesheet('itemBullet', itemImg, {
      frameWidth: 115,
      frameHeight: 100,
    });
    this.load.image('bg', bgImg);
    this.load.image('score', scoreImg);
    this.load.plugin(
      'rexeightdirectionplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexeightdirectionplugin.min.js',
      true
    );
    this.load.plugin(
      'rexvirtualjoystickplugin',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js',
      true
    );
  }

  create() {
    // 게임 토큰 저장
    api('get', 'users/load', {}, (res) => {
      if (res.msg == 'ERROR') {
        this.scene.stop();
      }
    });

    // 배경
    this.bg = this.add.tileSprite(this.centerX, this.centerY, 1000, 800, 'bg');

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
    this.physics.world.enable(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setCircle(30, 15);
    this.player.body.debugBodyColor = 0xffff00;
    this.player.setVisible(false);

    // 상단 충돌 영역
    // var zones = this.physics.add.staticGroup();
    // var zone = this.add.zone(this.centerX, 25, 1000, 50);
    // this.topNavi = this.add.graphics();
    // this.topNavi.fillStyle(0xffffff);
    // this.topNavi.fillRect(0, 0, 1000, 50);
    // zones.add(zone);
    // this.physics.add.collider(this.player, zones);

    // 키보드 이벤트 추가
    this.cursors = this.input.keyboard.createCursorKeys();

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
          x: 100,
          y: 700,
          radius: 80,
          base: this.add.circle(0, 0, 80, 0x888888, 0.5),
          thumb: this.add.circle(0, 0, 40, 0xcccccc),
        })
        .on('update', this.dumpJoyStickState, this);

      this.plugins.get('rexeightdirectionplugin').add(this.player, {
        speed: 150,
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

    this.events.on('start', () => {
      this.gameRestart();
    });

    // resume 이벤트
    this.events.on('resume', () => {
      this.gameResume();
    });
  }

  update() {
    if (!this.gameStartFlag) {
      return;
    }

    if (this.sys.game.device.os.desktop) {
      this.player.body.velocity.setTo(0, 0);

      if (this.cursors.left.isDown) {
        this.player.body.velocity.x = -150;
        this.player.setTexture('player', 0);
        this.playerDir = 'left';
      } else if (this.cursors.right.isDown) {
        this.player.body.velocity.x = +150;
        this.player.setTexture('player', 2);
        this.playerDir = 'right';
      } else if (this.cursors.up.isDown) {
        this.player.body.velocity.y = -150;
      } else if (this.cursors.down.isDown) {
        this.player.body.velocity.y = +150;
      }
      if (this.cursors.left.isDown && this.cursors.down.isDown) {
        this.player.body.velocity.x = -100;
        this.player.body.velocity.y = +100;
      } else if (this.cursors.left.isDown && this.cursors.up.isDown) {
        this.player.body.velocity.x = -100;
        this.player.body.velocity.y = -100;
      } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
        this.player.body.velocity.x = +100;
        this.player.body.velocity.y = -100;
      } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
        this.player.body.velocity.x = +100;
        this.player.body.velocity.y = +100;
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

    // this.topNavi.setDepth(1);
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
    this.invincibility = true;
    setTimeout(() => {
      this.player.alpha = 1;
      this.invincibility = false;
    }, 3000);
  }

  gameRestart() {
    this.gameStartFlag = false;
    this.enemyCount = this.enemyBulletCount;
    this.timer = '000';
    //this.scene.restart();
  }

  enemyHitsPlayer(bullet, player) {
    if (this.invincibility) {
      return;
    }
    this.scene.pause();
    // 아이템 먹었을 경우
    if (bullet.name.indexOf('item_') > -1) {
      bullet.setVisible(false);
      this.physics.world.disable(bullet);
      this.scene.launch('itemPopup', { itemNum: bullet.name.split('_')[1] });
    }
    // 총알 맞았을 경우
    else {
      if (this.playerDir == 'right') {
        this.player.setTexture('player', 3);
      } else {
        this.player.setTexture('player', 1);
      }
      this.gameOverFlag = true;
      this.scene.launch('endingPopup', {
        score: (this.timer * 0.001).toFixed(2),
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
  scene: [MyGame, endingPopup, itemPopup],
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
      debug: true,
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
