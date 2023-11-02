const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $(".playlist")

const app = {
    currenIndex: 0,
    isPlaying: false,
    isRandome: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Dung Chuc Em Hanh Phuc",
          singer: "Thanh Ha",
          path:
            "../Music-Player/assets/music/DungChucEmHanhPhuc-ThanhHa-4850022.mp3",
          image: "../Music-Player/assets/image/ThanhHa.png"
        },
        {
          name: "Lau Lau Nhac Lai",
          singer: "Ha Nhi",
          path: "../Music-Player/assets/music/LauLauNhacLaiLiveAtISeeYouConcert-HaNhi-9790842.mp3",
          image:
            "../Music-Player/assets/image/hanhi.png"
        },
        {
          name: "Neu Em Duoc LuanChon",
          singer: "Le Quyen",
          path: "../Music-Player/assets/music/NeuEmDuocLuaChon-LamTrang_3cqhf.mp3",
          image:
            "../Music-Player/assets/image/lequyen.jpeg"
        },
        {
          name: "Cha Va Con Gai",
          singer: "Thuy Chi",
          path: "../Music-Player/assets/music/ChaVaConGaiBaVoCuoiVoBaOst-ThuyChi-4720098.mp3",
          image:
            "../Music-Player/assets/image/thuychi.jpeg"
        },
        {
          name: "Con Tuoi Nao Cho Em",
          singer: "Miu Le",
          path:
            "../Music-Player/assets/music/ConTuoiNaoChoEmEmLaBaNoiCuaAnhOST-MiuLe-4269659.mp3",
          image: "../Music-Player/assets/image/muile.jpeg"
        },
        {
          name: "Cat Bui",
          singer: "Khanh Ly",
          path: "../Music-Player/assets/music/CatBui-KhanhLy-3667568.mp3",
          image:
            "../Music-Player/assets/image/khanhly.jpeg"
        },
        {
          name: "O Tro",
          singer: "Quynh Anh",
          path: "../Music-Player/assets/music/OTro-QuynhAnh-KimAnh_5jd.mp3",
          image:
            "../Music-Player/assets/image/quynhanh.png"
        }
    ],
    setConfig: function(key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })

        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
      Object.defineProperty(this, 'currentSong', {
        get: function() {
          return this.songs[this.currenIndex]
        }
      })
    },
    handleEvents: function() {
      const _this = this;
      const cdWidth = cd.offsetWidth;

      const cdThubAni = cdThumb.animate([
        { transform: 'rotate(360deg)' }],
        {
          duration: 10000,
          iterations: Infinity,
        })
      cdThubAni.pause()

      document.onscroll = function(e) {
        const scrollTop = window.screenY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop


        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth
      }

      playBtn.onclick = function() {
        if( _this.isPlaying){
          audio.pause()
        }
        else{
          audio.play()
        }
      }

      audio.onplay = function() {
        _this.isPlaying = true;
        player.classList.add('playing');
        cdThubAni.play()
      }

      audio.onpause = function() {
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdThubAni.pause()
      }

      audio.ontimeupdate = function() {
        if(audio.duration){
          const progressPercent = Math.floor(audio.currentTime/audio.duration * 100)
          progress.value = progressPercent
        }
      }

      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
      };

      nextBtn.onclick = function() {
        if(_this.isRandome){
          _this.playRandomSong()
        }
        else{
          _this.nextSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
      }

      prevBtn.onclick = function() {
        if(_this.isRandome){
          _this.playRandomSong()
        }
        else{
        _this.prevSong();
        }
        audio.play();
      }

      randomBtn.onclick = function(e) {
          _this.isRandome = !_this.isRandome
          _this.setConfig('isRandome', _this.isRandome)
        randomBtn.classList.toggle('active', _this.isRandome);

      }

      repeatBtn.onclick = function(e) {
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat', _this.isRepeat)
        repeatBtn.classList.toggle('active', _this.isRepeat);
      }

      audio.onended = function() {
        if(_this.isRepeat){
          audio.play();
        }
        else{
          nextBtn.click();
        }
      }
      
      playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active')
        if(songNode || !e.target.closest('.option'))
        {
          if(songNode) {
            _this.currenIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong();
            _this.render();
            audio.play();
          }

          if(!e.target.closest('.option')) {

          }
        }
      }
    },
    loadCurrentSong: function() {
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
    },

    loadConfig: function() {
      this.isRandome = this.config.isRandome;
      this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
      this.currenIndex++
      if(this.currenIndex >= this.songs.length){
        this.currenIndex = 0
      }
      this.loadCurrentSong()
    },

    prevSong: function() {
      this.currenIndex--
      if(this.currenIndex < 0){
        this.currenIndex = this.songs.length -1
      }
      this.loadCurrentSong()
    },

    playRandomSong: function() {
      let newIndex
      do{
        newIndex = Math.floor(Math.random() * this.songs.length);
      }
      while(newIndex === this.currenIndex)

      this.currenIndex = newIndex
      this.loadCurrentSong()
    },

    scrollToActiveSong: function() {
      setTimeout(() => {
        $('.song .active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 300)
    },

    start: function() {
      this.loadConfig();
      this.defineProperties();
      this.handleEvents();

      this.loadCurrentSong();
      this.render();

      randomBtn.classList.toggle("active", this.isRandom);
      repeatBtn.classList.toggle("active", this.isRepeat);
    }
}

app.start()
