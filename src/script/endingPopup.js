import Phaser from 'phaser';
import TitleImg from '../assets/image/title_record.png';
import TitleFinishImg from '../assets/image/title_record_finish.png';
import TitleFinishImg2 from '../assets/image/title_message_finish.png';
import TitleFormImg from '../assets/image/title_form.png';
import TryImg from '../assets/image/btn_try.png';
import RegisterImg from '../assets/image/btn_record.png';
import CloseImg from '../assets/image/btn_close.png';
import GiftImg from '../assets/image/btn_gifticon.png';
import CheckBoxImg from '../assets/image/checkbox.png';
import SpoqaHanSansNeoRegularFont from '../assets/font/SpoqaHanSansNeo-Regular.ttf';
import Rexinputtextplugin from '../lib/rexinputtextplugin.min.js';
import Api from '../lib/api';

export class EndingPopup extends Phaser.Scene {
  constructor() {
    super({ key: 'endingPopup' });
    this.centerX;
    this.centerY;
    this.popupContainer;
    this.formContainer;
    this.finishContainer;
    this.titleImg;
    this.titleFormImg;
    this.titlefinishImg;
    this.titlefinishImg2;
    this.registerButton;
    this.sendButton;
    this.retryButton;
    this.closeButton;
    this.score;
    this.nameInputText;
    this.hpInputText;
    this.emailInputText;
    this.checkBoxButton1;
    this.checkBoxButton2;
  }

  init(data) {
    this.score = data.score;
    this.myGame = data.game;
  }

  preload() {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.load.plugin('rexinputtextplugin', Rexinputtextplugin, true);
    this.load.image('title', TitleImg);
    this.load.image('titleFinish', TitleFinishImg);
    this.load.image('titleFinish2', TitleFinishImg2);
    this.load.image('titleForm', TitleFormImg);
    this.load.image('retryBtn', TryImg);
    this.load.image('sendBtn', GiftImg);
    this.load.image('registerBtn', RegisterImg);
    this.load.image('closeBtn', CloseImg);
    this.load.spritesheet('checkbox', CheckBoxImg, {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  create() {
    this.popupContainer = this.add.container(0, 0);
    this.formContainer = this.add.container(0, 0);
    this.finishContainer = this.add.container(0, 0);

    // 기륵을 등록 하겠습니까?
    this.titleImg = this.add.image(this.centerX, this.centerY, 'title');

    // 기록 등록
    this.registerButton = this.add.image(
      this.centerX - 120,
      this.centerY + 100,
      'registerBtn'
    );

    // 다시 도전
    this.retryButton = this.add.image(
      this.centerX + 120,
      this.centerY + 100,
      'retryBtn'
    );

    // 닉네임을 입력 해주세요.
    this.nameInputText = this.add
      .rexInputText(this.centerX, this.centerY - 100, 500, 50, {
        type: 'text',
        text: '',
        color: 'black',
        maxLength: 20,
        fontFamily: 'SpoqaHanSansNeoRegularFont',
        fontSize: '20px',
        placeholder: '닉네임을 입력해주세요.',
        backgroundColor: 'white',
        borderRadius: '7px',
      })
      .setOrigin(0.5, 0.5);

    // 연락처를 입력 해주세요.
    this.hpInputText = this.add
      .rexInputText(this.centerX, this.centerY - 25, 500, 50, {
        type: 'tel',
        text: '',
        color: 'black',
        maxLength: 13,
        fontFamily: 'SpoqaHanSansNeoRegularFont',
        fontSize: '20px',
        placeholder: '기프티콘 수령 연락처를 입력해주세요.',
        backgroundColor: 'white',
        borderRadius: '7px',
      })
      .setOrigin(0.5, 0.5);

    this.hpInputText.on(
      'textchange',
      (inputText, e) => {
        // const regex = /^[0-9\b -]{0,13}$/;
        // if (!regex.test(e.target.value)) {
        //   e.preventDefault();
        // }

        inputText.setText(
          e.target.value
            .replace(/[^0-9]/g, '') // 숫자를 제외한 모든 문자 제거
            .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
        );
      },
      this
    );

    // 메일주소를 입력 해주세요.
    this.emailInputText = this.add
      .rexInputText(this.centerX, this.centerY + 50, 500, 50, {
        type: 'text',
        text: '',
        color: 'black',
        maxLength: 30,
        fontFamily: 'SpoqaHanSansNeoRegularFont',
        fontSize: '20px',
        placeholder: '메일주소를 입력해주세요.',
        backgroundColor: 'white',
        borderRadius: '7px',
      })
      .setOrigin(0.5, 0.5);

    // [필수] 체크박스
    this.checkBoxButton1 = this.add.sprite(
      this.centerX - 230,
      this.centerY + 115,
      'checkbox',
      0
    );

    // [선택] 체크박스
    this.checkBoxButton2 = this.add.sprite(
      this.centerX - 230,
      this.centerY + 190,
      'checkbox',
      0
    );

    // 폼 텍스트
    this.titleFormImg = this.add.image(
      this.centerX + 60,
      this.centerY + 180,
      'titleForm'
    );

    // 기프티콘 받기 버튼
    this.sendButton = this.add.image(
      this.centerX,
      this.centerY + 320,
      'sendBtn'
    );

    // 기록 등록이 완료되었습니다.
    this.titlefinishImg = this.add.image(
      this.centerX,
      this.centerY - 100,
      'titleFinish'
    );

    // 추첨 안내 메시지
    this.titlefinishImg2 = this.add.image(
      this.centerX,
      this.centerY,
      'titleFinish2'
    );

    // 닫기 버튼
    this.closeButton = this.add.image(
      this.centerX,
      this.centerY + 100,
      'closeBtn'
    );

    // 기록 등록 컨테이너
    this.popupContainer.add([
      this.titleImg,
      this.registerButton,
      this.retryButton,
    ]);

    // 입력 폼 컨테이너
    this.formContainer.add([
      this.nameInputText,
      this.hpInputText,
      this.emailInputText,
      this.checkBoxButton1,
      this.checkBoxButton2,
      this.titleFormImg,
      this.sendButton,
    ]);
    this.formContainer.setVisible(false);

    // 완료 폼 컨테이너
    this.finishContainer.add([
      this.titlefinishImg,
      this.titlefinishImg2,
      this.closeButton,
    ]);
    this.finishContainer.setVisible(false);

    // 기록 등록 클릭 이벤트
    this.registerButton
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

    // 다시 도전 클릭 이벤트
    this.retryButton
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          this.scene.stop();
          this.myGame.scene.start('game');
        },
        this
      );

    // [필수] 체크 박스 클릭 이벤트
    this.checkBoxButton1
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerdown', () => {
        if (this.checkBoxButton1.state == 0) {
          this.checkBoxButton1.state = 1;
        } else {
          this.checkBoxButton1.state = 0;
        }
        this.checkBoxButton1.setTexture('checkbox', this.checkBoxButton1.state);
      });

    // [선택] 체크 박스 클릭 이벤트
    this.checkBoxButton2
      .setInteractive({
        cursor: 'pointer',
      })
      .on('pointerdown', () => {
        if (this.checkBoxButton2.state == 0) {
          this.checkBoxButton2.state = 1;
        } else {
          this.checkBoxButton2.state = 0;
        }
        this.checkBoxButton2.setTexture('checkbox', this.checkBoxButton2.state);
      });

    // 기프티콘 받기 클릭 이벤트
    this.sendButton
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          this.onClickSendButton();
        },
        this
      );

    // 닫기 클릭 이벤트
    this.closeButton
      .setInteractive({
        cursor: 'pointer',
      })
      .on(
        'pointerdown',
        () => {
          this.scene.stop();
          this.myGame.scene.start('game');
        },
        this
      );
  }

  onClickSendButton() {
    if (this.nameInputText.text == '') {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (this.hpInputText.text == '') {
      alert('연락처를 입력해주세요.');
      return;
    }
    if (this.emailInputText.text == '') {
      alert('메일주소를 입력해주세요.');
      return;
    } else {
      if (!this.email_check(this.emailInputText.text)) {
        alert('메일주소 형식으로 입력해주세요.');
        return;
      }
    }
    if (this.checkBoxButton1.state == 0) {
      alert('개인정보수집 및 이용에 동의해주세요.');
      return;
    }
    const sendData = {
      name: this.nameInputText.text,
      score: this.score,
      hp: this.hpInputText.text,
      email: this.emailInputText.text,
      marketing: this.checkBoxButton2.state == 0 ? '미동의' : '동의',
      publishedDate: new Date(),
    };
    Api('post', 'users', sendData, (res) => {
      if (res.msg == 'OK') {
        // 이미 hp가 등록되어 있음
        if (res.result.data.exist) {
          // 점수가 낮아 갱신 할 필요가 없음
          if (res.result.data == 'NOT UPDATE') {
            this.formContainer.setVisible(false);
            this.finishContainer.setVisible(true);
          }
          // 데이터 갱신 완료
          else {
            Api(
              'patch',
              `users/${res.result.data.exist._id}`,
              sendData,
              (res) => {
                this.formContainer.setVisible(false);
                this.finishContainer.setVisible(true);
              }
            );
          }
        }
        // 데이터 정상적으로 등록 완료
        else {
          this.formContainer.setVisible(false);
          this.finishContainer.setVisible(true);
        }
      }
    });
  }

  email_check(email) {
    var regex =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return email != '' && email != 'undefined' && regex.test(email);
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
