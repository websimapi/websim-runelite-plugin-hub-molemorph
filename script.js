document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-btn');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');

    let audioContext;
    let downloadSoundBuffer;

    // Initialize Web Audio API
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            fetch('download-sound.mp3')
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(decodedBuffer => {
                    downloadSoundBuffer = decodedBuffer;
                })
                .catch(error => console.error('Error loading audio:', error));
        }
    }

    function playSound(buffer) {
        if (!audioContext || !buffer) return;
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
    }

    downloadBtn.addEventListener('click', () => {
        initAudio();
        
        downloadBtn.disabled = true;
        downloadBtn.querySelector('span').textContent = 'Downloading...';

        statusText.textContent = '';
        progressBar.style.width = '0%';
        progressBarContainer.classList.add('visible');
        
        // Force a reflow to ensure the transition starts from 0
        void progressBar.offsetWidth;

        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 100);

        setTimeout(() => {
            downloadBtn.querySelector('span').textContent = 'Installed!';
            downloadBtn.style.backgroundColor = 'var(--success-color)';
            statusText.textContent = 'Plugin successfully installed!';
            
            playSound(downloadSoundBuffer);
            showMolePopup();
        }, 2100);
    });

    function showMolePopup() {
        const existingPopup = document.querySelector('.mole-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const moleImg = document.createElement('img');
        moleImg.src = 'mole-popup.png';
        moleImg.alt = 'A cute mole';
        moleImg.className = 'mole-popup';
        document.body.appendChild(moleImg);

        moleImg.addEventListener('animationend', () => {
            moleImg.remove();
        });
    }
});

