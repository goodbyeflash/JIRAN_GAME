import Phaser from 'phaser';
import ConfirmImg from '../assets/image/btn_confirm.png';
import PopupImg from '../assets/image/popup.png';

export class ItemPopup extends Phaser.Scene {
  constructor() {
    super({ key: 'itemPopup' });
    this.popupContainer;
    this.exitButton;
    this.centerX;
    this.centerY;
    this.itemNum;
    this.itemPopup;
    this.myGame;
  }
  init(data) {
    this.itemNum = data.itemNum;
    this.myGame = data.game;
  }
  preload() {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.load.spritesheet('popup', PopupImg, {
      frameWidth: 692,
      frameHeight: 596,
    });
    this.load.image('confirmBtn', ConfirmImg);
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
          this.myGame.scene.resume('game');
        },
        this
      );

    const keyObj = this.input.keyboard.addKey('Enter'); // Get key object
    keyObj.on(
      'down',
      function () {
        this.scene.stop();
        this.myGame.scene.resume('game');
      },
      this
    );
  }
}
