// ============================================================
// MYRABE
// PLAYER DE ÁUDIO PERSONALIZADO
// ============================================================
//
// Todos os arquivos estão na mesma pasta:
//
// ├── Index1.html
// ├── style.css
// ├── script.js
// ├── capa.svg
// └── cowboy-fora-da-lei.mp3
//
// ============================================================


const tracks = [
    {
        title: "Cowboy Fora da Lei",
        artist: "Raul Seixas",
        src: "cowboy-fora-da-lei.mp3",
        cover: "capa.jpg"
    }
];



/* ============================================================
   ELEMENTOS
============================================================ */

const audio = document.getElementById("audio");
const player = document.getElementById("player");
const cover = document.getElementById("cover");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const playlist = document.getElementById("playlist");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");



/* ============================================================
   ESTADO
============================================================ */

let currentTrack = 0;



/* ============================================================
   FORMATAÇÃO DE TEMPO
============================================================ */

function formatTime(seconds) {

    if (!Number.isFinite(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);

    const secondsPart = Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secondsPart).padStart(2, "0")
    );
}



/* ============================================================
   CRIAR PLAYLIST
============================================================ */

function renderPlaylist() {

    if (!playlist) {
        console.warn(
            "MYRABE PLAYER: elemento #playlist não encontrado."
        );

        return;
    }

    playlist.innerHTML = "";



    if (!tracks.length) {

        playlist.innerHTML = `
            <div
                class="track"
                style="cursor: default;"
            >

                <span class="track-number">
                    —
                </span>

                <span class="track-name">
                    Nenhuma música adicionada ainda.
                </span>

                <span class="track-artist">
                    /music
                </span>

            </div>
        `;

        return;
    }



    tracks.forEach((track, index) => {

        const button =
            document.createElement("button");

        button.className =
            "track";

        button.type =
            "button";

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



        playlist.appendChild(button);

    });

}



/* ============================================================
   MÚSICA ATIVA
============================================================ */

function updateActiveTrack() {

    if (!playlist) {
        return;
    }



    const items =
        playlist.querySelectorAll(".track");



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
   CARREGAR MÚSICA
============================================================ */

function loadTrack(index) {

    if (!tracks.length || !audio) {
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



    if (cover) {

        cover.src =
            track.cover || "capa.svg";

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

}



/* ============================================================
   PLAY
============================================================ */

async function playTrack() {

    if (!tracks.length || !audio) {
        return;
    }



    if (!audio.src) {

        loadTrack(currentTrack);

    }



    try {

        await audio.play();

    }

    catch (error) {

        console.error(
            "MYRABE PLAYER: não foi possível reproduzir o áudio.",
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

    if (!tracks.length || !audio) {
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



    loadTrack(
        currentTrack + 1
    );



    playTrack();

}



/* ============================================================
   ANTERIOR
============================================================ */

function previousTrack() {

    if (!tracks.length) {
        return;
    }



    loadTrack(
        currentTrack - 1
    );



    playTrack();

}



/* ============================================================
   BOTÕES
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



/* ============================================================
   MÚSICA COMEÇOU
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

            }



            if (player) {

                player.classList.add(
                    "is-playing"
                );

            }

        }
    );

}



/* ============================================================
   MÚSICA PAUSOU
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

            }



            if (player) {

                player.classList.remove(
                    "is-playing"
                );

            }

        }
    );

}



/* ============================================================
   METADADOS CARREGADOS
============================================================ */

if (audio) {

    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (durationEl) {

                durationEl.textContent =
                    formatTime(audio.duration);

            }

        }
    );

}



/* ============================================================
   ATUALIZAÇÃO DO TEMPO
============================================================ */

if (audio) {

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !Number.isFinite(audio.duration) ||
                audio.duration <= 0
            ) {

                return;

            }



            if (progress) {

                progress.value =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;

            }



            if (currentTimeEl) {

                currentTimeEl.textContent =
                    formatTime(
                        audio.currentTime
                    );

            }

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

            nextTrack();

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
                !Number.isFinite(audio.duration) ||
                audio.duration <= 0
            ) {

                return;

            }



            audio.currentTime =
                (
                    Number(progress.value) /
                    100
                ) * audio.duration;

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
                    Math.min(1, value)
                );



            if (volumeValue) {

                volumeValue.textContent =
                    Math.round(
                        value * 100
                    );

            }

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
            Math.min(1, initialVolume)
        );



    if (volumeValue) {

        volumeValue.textContent =
            Math.round(
                initialVolume * 100
            );

    }

}



/* ============================================================
   INICIALIZAR PLAYER
============================================================ */

renderPlaylist();

loadTrack(currentTrack);



/* ============================================================
   CAIXAS EXPANSÍVEIS
============================================================ */

document
    .querySelectorAll(".accordion-header")
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

const lightbox =
    document.getElementById("lightbox");

const lightboxImg =
    document.getElementById("lightboxImg");

const closeLightbox =
    document.getElementById("closeLightbox");



if (lightbox && lightboxImg) {

    document
        .querySelectorAll(".gallery-item")
        .forEach(
            (item) => {

                item.addEventListener(
                    "click",
                    () => {

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



                        lightbox.classList.add(
                            "open"
                        );



                        lightbox.setAttribute(
                            "aria-hidden",
                            "false"
                        );

                    }
                );

            }
        );

}



/* ============================================================
   FECHAR GALERIA
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

}



/* ============================================================
   BOTÃO FECHAR GALERIA
============================================================ */

if (closeLightbox) {

    closeLightbox.addEventListener(
        "click",
        closeGallery
    );

}



/* ============================================================
   CLICAR FORA DA IMAGEM
============================================================ */

if (lightbox) {

    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target === lightbox
            ) {

                closeGallery();

            }

        }
    );

}



/* ============================================================
   ESC FECHA GALERIA
============================================================ */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeGallery();

        }

    }
);



/* ============================================================
   SEGREDO
============================================================ */

const secretBtn =
    document.getElementById("secretBtn");

const secretMessage =
    document.getElementById("secretMessage");



if (secretBtn && secretMessage) {

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

        }
    );

}
