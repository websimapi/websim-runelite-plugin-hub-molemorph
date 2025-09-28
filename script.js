document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-btn');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');

    const toggleSourceView = document.getElementById('toggle-source-view');
    const sourceCodeContainer = document.getElementById('source-code-container');
    const configCodeContainer = document.getElementById('config-code-container');

    const pluginCodeBlock = document.getElementById('plugin-code-block');
    const configCodeBlock = document.getElementById('config-code-block');

    let audioContext;
    let downloadSoundBuffer;
    let isDownloading = false;

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

    function createAndDownloadFile(filename, text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    downloadBtn.addEventListener('click', () => {
        if (isDownloading) return;
        
        isDownloading = true;
        initAudio();

        downloadBtn.disabled = true;
        statusText.textContent = 'Downloading...';
        progressBarContainer.classList.add('visible');
        progressBar.style.width = '0%';

        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 100);

        setTimeout(() => {
            createAndDownloadFile('MoleMorphPlugin.java', pluginCodeBlock.innerText);
            createAndDownloadFile('MoleMorphConfig.java', configCodeBlock.innerText);
            
            playSound(downloadSoundBuffer);
            statusText.textContent = 'Download complete!';
            downloadBtn.querySelector('span').textContent = 'Downloaded!';
            
            const mole = document.createElement('img');
            mole.src = 'mole-popup.png';
            mole.className = 'mole-popup';
            document.body.appendChild(mole);
            mole.addEventListener('animationend', () => {
                mole.remove();
            });

            setTimeout(() => {
                isDownloading = false;
                downloadBtn.disabled = false;
                downloadBtn.querySelector('span').textContent = 'Download Plugin';
                statusText.textContent = '';
                progressBarContainer.classList.remove('visible');
                progressBar.style.width = '0%';
            }, 4000);

        }, 2100);
    });

    toggleSourceView.addEventListener('click', () => {
        sourceCodeContainer.classList.toggle('hidden');
        configCodeContainer.classList.toggle('hidden');
        if (sourceCodeContainer.classList.contains('hidden')) {
            toggleSourceView.textContent = 'View Source Code';
        } else {
            toggleSourceView.textContent = 'Hide Source Code';
        }
    });
    
    document.querySelectorAll('.copy-code-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            initAudio(); // Ensure audio is ready
            const targetId = e.target.dataset.target;
            const codeBlock = document.getElementById(targetId);

            navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                button.textContent = 'Copied!';
                button.style.backgroundColor = 'var(--success-color)';
                playSound(downloadSoundBuffer);

                setTimeout(() => {
                    button.textContent = 'Copy Code';
                    button.style.backgroundColor = 'var(--accent-color)';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy code: ', err);
                button.textContent = 'Failed!';
                setTimeout(() => {
                    button.textContent = 'Copy Code';
                }, 2000);
            });
        });
    });
});