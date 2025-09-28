document.addEventListener('DOMContentLoaded', () => {
    const sourceCodeBtn = document.getElementById('source-code-btn');
    const sourceCodeContainer = document.getElementById('source-code-container');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const codeBlock = document.getElementById('plugin-code-block');

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

    sourceCodeBtn.addEventListener('click', () => {
        sourceCodeContainer.classList.toggle('hidden');
        if (sourceCodeContainer.classList.contains('hidden')) {
            sourceCodeBtn.querySelector('span').textContent = 'View Source Code';
        } else {
            sourceCodeBtn.querySelector('span').textContent = 'Hide Source Code';
        }
    });
    
    copyCodeBtn.addEventListener('click', () => {
        initAudio(); // Ensure audio is ready

        navigator.clipboard.writeText(codeBlock.innerText).then(() => {
            copyCodeBtn.textContent = 'Copied!';
            copyCodeBtn.style.backgroundColor = 'var(--success-color)';
            playSound(downloadSoundBuffer);

            setTimeout(() => {
                copyCodeBtn.textContent = 'Copy Code';
                copyCodeBtn.style.backgroundColor = 'var(--accent-color)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy code: ', err);
            copyCodeBtn.textContent = 'Failed!';
            setTimeout(() => {
                copyCodeBtn.textContent = 'Copy Code';
            }, 2000);
        });
    });
});