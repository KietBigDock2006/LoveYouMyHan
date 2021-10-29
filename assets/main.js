const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const  cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {   
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'song 1',
            singer: 'nghe si 1',
            path: './assets/music/thoundsand years song.m4a',
            image: './assets/img/unnamed.png',
        },
        {
            name: 'song 2',
            singer: 'nghe si 2',
            path: './assets/music/21 guns song.m4a',
            image: './assets/img/unnamed.png',
        },
        {
            name: 'song 3',
            singer: 'nghe si 3',
            path: './assets/music/sunflowers song.m4a',
            image: './assets/img/unnamed.png',
        },
        {
            name: 'song 4',
            singer: 'nghe si 4',
            path: './assets/music/dai lo tuyet vong song.m4a',
            image: './assets/img/unnamed.png',
        },
        {
            name: 'song 5',
            singer: 'nghe si 5',
            path: './assets/music/thac mac song.m4a',
            image: './assets/img/unnamed.png',
        },
        {
            name: 'song 6',
            singer: 'nghe si 6',
            path: './assets/music/noi nay co anh song.m4a',
            image: './assets/img/unnamed.png',
        },
        {
            name: 'song 7',
            singer: 'nghe si 7',
            path: './assets/music/mien tay song.m4a',
            image: './assets/img/unnamed.png',
        }
    ],
    render: function() {
       const htmls = this.songs.map((song, index) => {
           return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
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
    definePropertypies: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const  cdWidth = cd.offsetWidth
        const _this = this
        // Handle CD spins and stop
        const cdThumbAnimate =  cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ],
        {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()
        // Handle zoom in / zoom out CD
        document.onscroll = function () {
            const scrollTop =  window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop 
            console.log(scrollTop)

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Handle when click play button
        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Handle when song is playing  
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Handle when song is pausing
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // When process of the song changes
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent =  Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // Handle when adjust song
        progress.onchange = function (e) {
            const seekTime = audio.duration * e.target.value / 100 // so giay hien tai
            audio.currentTime = seekTime
        }
        // when next song
        nextBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //when prev song
        prevBtn.onclick = function () {
            if(_this.isRandom) {
                this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // handle turn on/ turn off random button
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //  handle when the song was end
        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play()
            } else(nextBtn.click())
        }
        //  handle when repeat the song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // listening when click into playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)') 
            if(songNode || e.target.closest('.option')) {
                // hanle when click into song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    console.log(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
                // hanle when click into option button 
                if(e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 100)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Define properties for object
        this.definePropertypies()

        // Listening / Handle DOM events
        this.handleEvent()

        // Loading current song's information into UI when run app
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}

app.start()
