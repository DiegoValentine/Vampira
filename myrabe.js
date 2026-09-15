/* ============================================================
   MYRABE
   PLAYER + GALERIA + SEGREDOS
============================================================ */


/* ============================================================
   PLAYLIST
============================================================ */

const tracks = [

    {
        title: "Cowboy Fora da Lei",
        artist: "Raul Seixas",
        src: "cowboy-fora-da-lei.mp3",
        cover: "capa.jpg"
    },

    /*
    ADICIONE MAIS MÚSICAS ASSIM:

    {
        title: "Nome da música",
        artist: "Artista",
        src: "outra-musica.mp3",
        cover: "outra-capa.jpg"
    },

    */

];


/* ============================================================
   ELEMENTOS
============================================================ */

const audio =
    document.getElementById("audio");

const player =
    document.getElementById("player");

const cover =
    document.getElementById("cover");

const trackTitle =
    document.getElementById("trackTitle");

const trackArtist =
    document.getElementById("trackArtist");

const trackNumber =
    document.getElementById("trackNumber");

const trackCount =
    document.getElementById("trackCount");

const playerStatus =
    document.getElementById("playerStatus");

const playlist =
    document.getElementById("playlist");


const playBtn =
    document.getElementById("playBtn");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const shuffleBtn =
    document.getElementById("shuffleBtn");

const repeatBtn =
    document.getElementById("repeatBtn");


const progress =
    document.getElementById("progress");

const currentTimeEl =
    document.getElementById("currentTime");

const durationEl =
    document.getElementById("duration");


const volume =
    document.getElementById("volume");

const volumeValue =
    document.getElementById("volumeValue");

const muteBtn =
    document.getElementById("muteBtn");


/* ============================================================
   ESTADO
============================================================ */

let currentTrack = 0;

let shuffleMode = false;

let repeatMode = false;

let lastVolume = 0.8;


/* ============================================================
   LOCAL STORAGE
============================================================ */

function saveSettings() {

    try {

        localStorage.setItem(
            "myrabe-volume",
            audio.volume
        );

        localStorage.setItem(
            "myrabe-shuffle",
            String(shuffleMode)
        );

        localStorage.setItem(
            "myrabe-repeat",
            String(repeatMode)
        );

        localStorage.setItem(
            "myrabe-track",
            String(currentTrack)
        );

    }

    catch (error) {

        console.warn(
            "MYRABE: não foi possível salvar configurações.",
            error
        );

    }

}


function loadSettings() {

    try {

        const savedVolume =
            localStorage.getItem(
                "myrabe-volume"
            );

        const savedShuffle =
            localStorage.getItem(
                "myrabe-shuffle"
            );

        const savedRepeat =
            localStorage.getItem(
                "myrabe-repeat"
            );

        const savedTrack =
            localStorage.getItem(
                "myrabe-track"
            );


        if (savedVolume !== null) {

            const value =
                Number(savedVolume);

            if (
                Number.isFinite(value) &&
                value >= 0 &&
                value <= 1
            ) {

                lastVolume =
                    value;

                audio.volume =
                    value;

                if (volume) {

                    volume.value =
                        value;

                }

            }

        }


        if (savedShuffle !== null) {

            shuffleMode =
                savedShuffle === "true";

        }


        if (savedRepeat !== null) {

            repeatMode =
                savedRepeat === "true";

        }


        if (savedTrack !== null) {

            const value =
                Number(savedTrack);

            if (
                Number.isInteger(value) &&
                value >= 0 &&
                value < tracks.length
            ) {

                currentTrack =
                    value;

            }

        }

    }

    catch (error) {

        console.warn(
            "MYRABE: configurações locais indisponíveis.",
            error
        );

    }

}


/* ============================================================
   TEMPO
============================================================ */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "00:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secondsPart =
        Math.floor(
            seconds % 60
        );


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secondsPart).padStart(2, "0")
    );

}


/* ============================================================
   PLAYLIST
============================================================ */

function renderPlaylist() {

    if (!playlist) {
        return;
    }


    playlist.innerHTML = "";


    if (trackCount) {

        trackCount.textContent =
            tracks.length;

    }


    if (!tracks.length) {

        playlist.innerHTML = `

            <div class="track">

                <span class="track-number">
                    —
                </span>

                <span class="track-name">
                    Nenhuma música adicionada.
                </span>

            </div>

        `;

        return;

    }


    tracks.forEach(
        (track, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "track";


            button.innerHTML = `

                <span class="track-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="track-name">
                    ${track.title}
                </span>

                <span class="track-artist">
                    ${track.artist}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    loadTrack(index);

                    playTrack();

                }
            );


            playlist.appendChild(
                button
            );

        }
    );

}


/* ============================================================
   FAIXA ATIVA
============================================================ */

function updateActiveTrack() {

    if (!playlist) {
        return;
    }


    const items =
        playlist.querySelectorAll(
            ".track"
        );


    items.forEach(
        (element, index) => {

            element.classList.toggle(
                "active",
                index === currentTrack
            );

        }
    );

}


/* ============================================================
   CARREGAR FAIXA
============================================================ */

function loadTrack(index) {

    if (
        !tracks.length ||
        !audio
    ) {

        return;

    }


    currentTrack =
        (
            index + tracks.length
        ) % tracks.length;


    const track =
        tracks[currentTrack];


    audio.src =
        track.src;


    if (trackTitle) {

        trackTitle.textContent =
            track.title;

    }


    if (trackArtist) {

        trackArtist.textContent =
            track.artist;

    }


    if (trackNumber) {

        trackNumber.textContent =
            `TRACK ${String(currentTrack + 1).padStart(2, "0")}`;

    }


    if (cover) {

        cover.src =
            track.cover ||
            "capa.jpg";

        cover.alt =
            `Capa de ${track.title}`;

    }


    if (progress) {

        progress.value =
            0;

    }


    if (currentTimeEl) {

        currentTimeEl.textContent =
            "00:00";

    }


    if (durationEl) {

        durationEl.textContent =
            "00:00";

    }


    updateActiveTrack();

    saveSettings();

}


/* ============================================================
   PLAY
============================================================ */

async function playTrack() {

    if (
        !tracks.length ||
        !audio
    ) {

        return;

    }


    if (!audio.src) {

        loadTrack(
            currentTrack
        );

    }


    try {

        await audio.play();

    }

    catch (error) {

        console.error(
            "MYRABE PLAYER:",
            error
        );

    }

}


/* ============================================================
   PAUSE
============================================================ */

function pauseTrack() {

    if (!audio) {
        return;
    }


    audio.pause();

}


/* ============================================================
   PLAY / PAUSE
============================================================ */

function togglePlay() {

    if (
        !tracks.length ||
        !audio
    ) {

        return;

    }


    if (audio.paused) {

        playTrack();

    }

    else {

        pauseTrack();

    }

}


/* ============================================================
   PRÓXIMA
============================================================ */

function nextTrack() {

    if (!tracks.length) {
        return;
    }


    if (shuffleMode) {

        if (tracks.length === 1) {

            loadTrack(
                currentTrack
            );

        }

        else {

            let next;

            do {

                next =
                    Math.floor(
                        Math.random() *
                        tracks.length
                    );

            }
            while (
                next === currentTrack
            );


            loadTrack(next);

        }

    }

    else {

        loadTrack(
            currentTrack + 1
        );

    }


    playTrack();

}


/* ============================================================
   ANTERIOR
============================================================ */

function previousTrack() {

    if (!tracks.length) {
        return;
    }


    if (
        audio.currentTime > 4
    ) {

        audio.currentTime =
            0;

        return;

    }


    loadTrack(
        currentTrack - 1
    );


    playTrack();

}


/* ============================================================
   SHUFFLE
============================================================ */

function toggleShuffle() {

    shuffleMode =
        !shuffleMode;


    if (shuffleBtn) {

        shuffleBtn.classList.toggle(
            "active",
            shuffleMode
        );

        shuffleBtn.setAttribute(
            "aria-label",
            shuffleMode
                ? "Desativar reprodução aleatória"
                : "Ativar reprodução aleatória"
        );

    }


    saveSettings();

}


/* ============================================================
   REPETIR
============================================================ */

function toggleRepeat() {

    repeatMode =
        !repeatMode;


    if (repeatBtn) {

        repeatBtn.classList.toggle(
            "active",
            repeatMode
        );

        repeatBtn.setAttribute(
            "aria-label",
            repeatMode
                ? "Desativar repetição"
                : "Repetir música"
        );

    }


    saveSettings();

}


/* ============================================================
   BOTÕES DO PLAYER
============================================================ */

if (playBtn) {

    playBtn.addEventListener(
        "click",
        togglePlay
    );

}


if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        nextTrack
    );

}


if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        previousTrack
    );

}


if (shuffleBtn) {

    shuffleBtn.addEventListener(
        "click",
        toggleShuffle
    );

}


if (repeatBtn) {

    repeatBtn.addEventListener(
        "click",
        toggleRepeat
    );

}


/* ============================================================
   EVENTO PLAY
============================================================ */

if (audio) {

    audio.addEventListener(
        "play",
        () => {

            if (playBtn) {

                playBtn.textContent =
                    "Ⅱ";

                playBtn.setAttribute(
                    "aria-label",
                    "Pausar"
                );

                playBtn.setAttribute(
                    "title",
                    "Pausar"
                );

            }


            if (player) {

                player.classList.add(
                    "is-playing"
                );

            }


            if (playerStatus) {

                playerStatus.textContent =
                    "PLAYING";

            }

        }
    );


}


/* ============================================================
   EVENTO PAUSE
============================================================ */

if (audio) {

    audio.addEventListener(
        "pause",
        () => {

            if (playBtn) {

                playBtn.textContent =
                    "▶";

                playBtn.setAttribute(
                    "aria-label",
                    "Reproduzir"
                );

                playBtn.setAttribute(
                    "title",
                    "Reproduzir"
                );

            }


            if (player) {

                player.classList.remove(
                    "is-playing"
                );

            }


            if (playerStatus) {

                playerStatus.textContent =
                    "PAUSED";

            }

        }
    );

}


/* ============================================================
   CARREGAMENTO DA DURAÇÃO
============================================================ */

if (audio) {

    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (durationEl) {

                durationEl.textContent =
                    formatTime(
                        audio.duration
                    );

            }

        }
    );

}


/* ============================================================
   ATUALIZAR PROGRESSO
============================================================ */

if (audio) {

    audio.addEventListener(
        "timeupdate",
        () => {

            if (!audio.duration) {
                return;
            }


            const percentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            if (progress) {

                progress.value =
                    percentage;

            }


            if (currentTimeEl) {

                currentTimeEl.textContent =
                    formatTime(
                        audio.currentTime
                    );

            }


            if (durationEl) {

                durationEl.textContent =
                    formatTime(
                        audio.duration
                    );

            }

        }
    );

}


/* ============================================================
   BARRA DE PROGRESSO
============================================================ */

if (progress) {

    progress.addEventListener(
        "input",
        () => {

            if (
                !audio ||
                !audio.duration
            ) {

                return;

            }


            audio.currentTime =
                (
                    Number(progress.value) /
                    100
                ) *
                audio.duration;

        }
    );

}


/* ============================================================
   MÚSICA TERMINOU
============================================================ */

if (audio) {

    audio.addEventListener(
        "ended",
        () => {

            if (repeatMode) {

                audio.currentTime =
                    0;

                playTrack();

                return;

            }


            nextTrack();

        }
    );

}


/* ============================================================
   VOLUME
============================================================ */

if (volume) {

    volume.addEventListener(
        "input",
        () => {

            if (!audio) {
                return;
            }


            const value =
                Number(volume.value);


            audio.volume =
                Math.max(
                    0,
                    Math.min(
                        1,
                        value
                    )
                );


            if (
                value > 0
            ) {

                lastVolume =
                    value;

            }


            if (volumeValue) {

                volumeValue.textContent =
                    Math.round(
                        value * 100
                    );

            }


            updateMuteButton();

            saveSettings();

        }
    );

}


/* ============================================================
   MUTE
============================================================ */

function updateMuteButton() {

    if (!muteBtn) {
        return;
    }


    if (
        audio.muted ||
        audio.volume === 0
    ) {

        muteBtn.textContent =
            "MUTE";

        muteBtn.setAttribute(
            "aria-label",
            "Ativar som"
        );

    }

    else {

        muteBtn.textContent =
            "VOL";

        muteBtn.setAttribute(
            "aria-label",
            "Silenciar"
        );

    }

}


if (muteBtn) {

    muteBtn.addEventListener(
        "click",
        () => {

            if (audio.muted) {

                audio.muted =
                    false;

                audio.volume =
                    lastVolume ||
                    0.8;

                if (volume) {

                    volume.value =
                        audio.volume;

                }

            }

            else {

                if (
                    audio.volume > 0
                ) {

                    lastVolume =
                        audio.volume;

                }

                audio.muted =
                    true;

            }


            if (volumeValue) {

                volumeValue.textContent =
                    audio.muted
                        ? "0"
                        : Math.round(
                            audio.volume * 100
                        );

            }


            updateMuteButton();

        }
    );

}


/* ============================================================
   VOLUME INICIAL
============================================================ */

if (audio && volume) {

    const initialVolume =
        Number(volume.value);


    audio.volume =
        Math.max(
            0,
            Math.min(
                1,
                initialVolume
            )
        );


    if (volumeValue) {

        volumeValue.textContent =
            Math.round(
                initialVolume * 100
            );

    }


    updateMuteButton();

}


/* ============================================================
   ACCORDIONS
============================================================ */

document
    .querySelectorAll(
        ".accordion-header"
    )
    .forEach(
        (header) => {

            header.addEventListener(
                "click",
                () => {

                    const content =
                        header.nextElementSibling;


                    if (!content) {
                        return;
                    }


                    const willOpen =
                        header.getAttribute(
                            "aria-expanded"
                        ) !== "true";


                    header.setAttribute(
                        "aria-expanded",
                        String(willOpen)
                    );


                    content.classList.toggle(
                        "open",
                        willOpen
                    );

                }
            );

        }
    );


/* ============================================================
   GALERIA
============================================================ */

const galleryItems =
    Array.from(
        document.querySelectorAll(
            ".gallery-item"
        )
    );


const lightbox =
    document.getElementById(
        "lightbox"
    );


const lightboxImg =
    document.getElementById(
        "lightboxImg"
    );


const lightboxCaption =
    document.getElementById(
        "lightboxCaption"
    );


const closeLightbox =
    document.getElementById(
        "closeLightbox"
    );


const lightboxPrev =
    document.getElementById(
        "lightboxPrev"
    );


const lightboxNext =
    document.getElementById(
        "lightboxNext"
    );


let currentGalleryIndex = 0;


/* ============================================================
   ABRIR LIGHTBOX
============================================================ */

function openGallery(index) {

    if (
        !galleryItems.length ||
        !lightbox ||
        !lightboxImg
    ) {

        return;

    }


    currentGalleryIndex =
        (
            index +
            galleryItems.length
        ) %
        galleryItems.length;


    const item =
        galleryItems[
            currentGalleryIndex
        ];


    const src =
        item.dataset.full;


    if (!src) {
        return;
    }


    lightboxImg.src =
        src;


    lightboxImg.alt =
        item.dataset.alt ||
        "Imagem";


    if (lightboxCaption) {

        lightboxCaption.textContent =
            item.dataset.caption ||
            "";

    }


    lightbox.classList.add(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* ============================================================
   CLIQUES NAS FOTOS
============================================================ */

galleryItems.forEach(
    (item, index) => {

        item.addEventListener(
            "click",
            () => {

                openGallery(
                    index
                );

            }
        );

    }
);


/* ============================================================
   FOTO ANTERIOR
============================================================ */

function previousGallery() {

    openGallery(
        currentGalleryIndex - 1
    );

}


/* ============================================================
   FOTO PRÓXIMA
============================================================ */

function nextGallery() {

    openGallery(
        currentGalleryIndex + 1
    );

}


/* ============================================================
   BOTÕES DO LIGHTBOX
============================================================ */

if (lightboxPrev) {

    lightboxPrev.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            previousGallery();

        }
    );

}


if (lightboxNext) {

    lightboxNext.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            nextGallery();

        }
    );

}


/* ============================================================
   FECHAR LIGHTBOX
============================================================ */

function closeGallery() {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    if (lightboxImg) {

        lightboxImg.src =
            "";

    }


    if (lightboxCaption) {

        lightboxCaption.textContent =
            "";

    }


    document.body.style.overflow =
        "";

}


/* ============================================================
   BOTÃO FECHAR
============================================================ */

if (closeLightbox) {

    closeLightbox.addEventListener(
        "click",
        closeGallery
    );

}


/* ============================================================
   CLICAR FORA
============================================================ */

if (lightbox) {

    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                lightbox
            ) {

                closeGallery();

            }

        }
    );

}


/* ============================================================
   TECLADO
============================================================ */

document.addEventListener(
    "keydown",
    (event) => {

        /* ESC */

        if (
            event.key === "Escape"
        ) {

            closeGallery();

        }


        /* SETAS DA GALERIA */

        if (
            lightbox &&
            lightbox.classList.contains(
                "open"
            )
        ) {

            if (
                event.key === "ArrowLeft"
            ) {

                previousGallery();

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextGallery();

            }

            return;

        }


        /* PLAYER */

        if (
            event.code === "Space"
        ) {

            const tag =
                document.activeElement.tagName;


            if (
                tag !== "INPUT" &&
                tag !== "TEXTAREA" &&
                tag !== "BUTTON"
            ) {

                event.preventDefault();

                togglePlay();

            }

        }


        if (
            event.key === "ArrowRight"
        ) {

            const tag =
                document.activeElement.tagName;


            if (
                tag !== "INPUT" &&
                tag !== "TEXTAREA"
            ) {

                nextTrack();

            }

        }


        if (
            event.key === "ArrowLeft"
        ) {

            const tag =
                document.activeElement.tagName;


            if (
                tag !== "INPUT" &&
                tag !== "TEXTAREA"
            ) {

                previousTrack();

            }

        }

    }
);


/* ============================================================
   SEGREDO
============================================================ */

const secretBtn =
    document.getElementById(
        "secretBtn"
    );


const secretMessage =
    document.getElementById(
        "secretMessage"
    );


if (
    secretBtn &&
    secretMessage
) {

    secretBtn.addEventListener(
        "click",
        () => {

            const isOpen =
                secretMessage.classList.toggle(
                    "open"
                );


            secretBtn.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            if (isOpen) {

                secretBtn.innerHTML = `

                    <span class="secret-symbol">
                        ✦
                    </span>

                    arquivo encontrado.

                `;

            }

            else {

                secretBtn.innerHTML = `

                    <span class="secret-symbol">
                        ✦
                    </span>

                    ainda tem alguma coisa aqui...

                `;

            }

        }
    );

}


/* ============================================================
   INICIALIZAÇÃO
============================================================ */

if (audio) {

    loadSettings();

}


renderPlaylist();


if (tracks.length) {

    loadTrack(
        currentTrack
    );

}


if (shuffleBtn) {

    shuffleBtn.classList.toggle(
        "active",
        shuffleMode
    );

}


if (repeatBtn) {

    repeatBtn.classList.toggle(
        "active",
        repeatMode
    );

}


updateMuteButton();
