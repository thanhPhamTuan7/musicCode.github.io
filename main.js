
const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)

const cd = $('.cd')
const heading = $('header h2')
const cdthumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const playlist = $('.playlist')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [



        {
            name: 'Angel Baby',
            singer: 'Troye Sivan',
            path: './access/music/song1.mp3',
            image: 'img/2.jpg'
        },
        {
            name: 'SummerTime',
            singer: 'K-391',
            path: './access/music/song2.mp3',
            image: 'img/3.jpg'
        },
        {
            name: 'MoNody',
            singer: 'TheFaRat',
            path: './access/music/song3.mp3',
            image: 'img/4.jpg'
        },
        {
            name: 'WhyNotMe',
            singer: 'Enrique lglesias',
            path: './access/music/song4.mp3',
            image: 'img/5.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            
            <div  class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
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

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function () {
        const _this = this

        const cdWidth = cd.offsetWidth

        // xử lý CD quay / dừng
        const cdthumbAnimate = cdthumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10 giây
            iterations: Infinity
        })

        cdthumbAnimate.pause()
        // xử lý phóng to , thu nhỏ Cd
        document.onscroll = function () {

            const scrollTop = window.scrolly || document.documentElement.scrollTop

            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lí khi click play

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }


        }

        //khi bài hát đc play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdthumbAnimate.play()
        }
        //khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdthumbAnimate.pause()
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {

                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)

                progress.value = progressPercent
            }


        }

        // xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            _this.nextSong()

            audio.play()
            _this.render()
            _this.scroltoActiveSong()

        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }

            audio.play()
            _this.render()
        }
        // xử lý bật tắt ramdom song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)

        }
        // xử lí phát lại một bài hát
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        //xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()

            } else {
                nextBtn.click()
            }



        }
        // Lang nghe hanh vi click vao playlist

    },

    scroltoActiveSong: function () {
        setTimeout(() => {

            $('.song.active').scrollIntoview({
                behavior: 'smooth',
                block: 'nearest',



            }
            )
        })
        playlist.onclick = function (e) {
            if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                if (e.target.closest('.song:not(.active)')) {

                }
                if (e.target.closest('.option')) {

                }
            }
        }
    },


    loadcurrentSong: function () {


        heading.textcontent = this.currentSong.name
        cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading, cdthumb, audio);


    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }

        this.loadcurrentSong()

    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }

        this.loadcurrentSong()

    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);

        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadcurrentSong()
    },


    start: function () {
        //định nghĩa các thuộc tính cho object
        this.defineProperties()
        // lắng nghe xử lý các sự kiênk
        this.handleEvent()
        // tải thông tin bài hát đầu tiên
        this.loadcurrentSong()
        // render playlist
        this.render()

    }
}

app.start()