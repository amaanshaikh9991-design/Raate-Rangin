// // --- DOM Binding Engine ---
// const audioPlayer = document.getElementById('main-audio-player');
// const dropzone = document.getElementById('dropzone');
// const fileInput = document.getElementById('file-input');
// const playlistTracks = document.getElementById('playlist-tracks');
// const trackCountEl = document.getElementById('track-count');

// const trackTitleEl = document.getElementById('track-title');
// const trackArtistEl = document.getElementById('track-artist');
// const artworkDisc = document.getElementById('artwork-disc');

// const btnPlay = document.getElementById('btn-play');
// const iconPlay = document.querySelector('.icon-play');
// const iconPause = document.querySelector('.icon-pause');
// const btnPrev = document.getElementById('btn-prev');
// const btnNext = document.getElementById('btn-next');
// const btnShuffle = document.getElementById('btn-shuffle');
// const btnRepeat = document.getElementById('btn-repeat');
// const btnClearQueue = document.getElementById('btn-clear-queue');

// const timeCurrentEl = document.getElementById('time-current');
// const timeTotalEl = document.getElementById('time-total');
// const progressArea = document.getElementById('progress-area');
// const progressBar = document.getElementById('progress-bar');
// const progressThumb = document.getElementById('progress-thumb');
// const volumeSlider = document.getElementById('volume-slider');

// const canvas = document.getElementById('visualizer');
// const ctx = canvas.getContext('2d');

// // --- Global Core Variable Declarations ---
// let playlistArray = [];
// let currentTrackIndex = -1;
// let isPlaying = false;
// let isShuffling = false;
// let repeatMode = 0; // 0: None, 1: Loop Array, 2: Repeat Track Single

// // --- Core Web Audio Context System Variables ---
// let audioCtx;
// let analyser;
// let mediaSourceNode;
// let dataArray;
// let isAudioContextInitialized = false;

// // --- Initialize Native System Audio Logic Engine ---
// function initWebAudioAPI() {
//     if (isAudioContextInitialized) return;
    
//     // Instantiates standard compatible Audio Context bindings
//     audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     analyser = audioCtx.createAnalyser();
    
//     // Wire main hardware hook to analysis loop
//     mediaSourceNode = audioCtx.createMediaElementSource(audioPlayer);
//     mediaSourceNode.connect(analyser);
//     analyser.connect(audioCtx.destination);
    
//     // Optimize performance specs (Fast Fourier Transform settings)
//     analyser.fftSize = 128;
//     const bufferLength = analyser.frequencyBinCount;
//     dataArray = new Uint8Array(bufferLength);
    
//     isAudioContextInitialized = true;
//     renderVisualizer();
// }

// // --- Dynamic Visualizer Paint Cycle Logic ---
// function renderVisualizer() {
//     requestAnimationFrame(renderVisualizer);
    
//     // Normalize target frame scaling parameters
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;
    
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     if (!isPlaying || !isAudioContextInitialized) return;
    
//     analyser.getByteFrequencyData(dataArray);
    
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;
//     const radius = 102; // Aligns perfectly around the spinning vinyl wrapper
//     const totalBars = dataArray.length;
    
//     // Draw raw mapped polar frequency array segments
//     for (let i = 0; i < totalBars; i++) {
//         // Compute circular mapping logic
//         const angle = (i / totalBars) * Math.PI * 2;
//         // Transform amplitude bounds cleanly
//         const amplitude = (dataArray[i] / 255) * 45; 
        
//         const startX = centerX + Math.cos(angle) * radius;
//         const startY = centerY + Math.sin(angle) * radius;
//         const endX = centerX + Math.cos(angle) * (radius + amplitude);
//         const endY = centerY + Math.sin(angle) * (radius + amplitude);
        
//         // Dynamic vibrant color map gradients
//         const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
//         gradient.addColorStop(0, '#7c3aed');
//         gradient.addColorStop(1, '#00f0ff');
        
//         ctx.beginPath();
//         ctx.moveTo(startX, startY);
//         ctx.lineTo(endX, endY);
//         ctx.strokeStyle = gradient;
//         ctx.lineWidth = 4;
//         ctx.lineCap = 'round';
//         ctx.stroke();
//     }
// }

// // --- Import Utility Handling Functions ---
// function processSelectedFiles(files) {
//     if (!files || files.length === 0) return;
    
//     const validAudioFormats = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/mp4', 'audio/x-m4a'];
    
//     Array.from(files).forEach(file => {
//         // Strip direct track identifiers
//         const rawFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
//         const splitParts = rawFileName.split('-').map(str => str.trim());
        
//         // Provide standard fallback parser matching standard local title styling
//         let artist = "Unknown Artist";
//         let title = rawFileName;
        
//         if (splitParts.length > 1) {
//             artist = splitParts[0];
//             title = splitParts.slice(1).join(' ');
//         }
        
//         // Store direct local reference pointers globally
//         const trackObject = {
//             id: Date.now() + Math.random().toString(36).substring(2, 9),
//             file: file,
//             title: title,
//             artist: artist,
//             objectUrl: URL.createObjectURL(file)
//         };
        
//         playlistArray.push(trackObject);
//     });
    
//     refreshPlaylistUI();
    
//     // Auto-launch execution sequence if initial load occurs
//     if (currentTrackIndex === -1 && playlistArray.length > 0) {
//         loadTrackIndex(0);
//     }
// }

// // --- Interface Dynamic State Rendering ---
// function refreshPlaylistUI() {
//     trackCountEl.textContent = `(${playlistArray.length})`;
//     playlistTracks.innerHTML = '';
    
//     if (playlistArray.length === 0) {
//         playlistTracks.innerHTML = `
//             <div class="empty-state">
//                 <p>Your queue is empty.</p>
//                 <span>Upload your tracks above to start building your mix.</span>
//             </div>
//         `;
//         return;
//     }
    
//     playlistArray.forEach((track, index) => {
//         const rowItem = document.createElement('div');
//         rowItem.className = `track-item ${index === currentTrackIndex ? 'playing' : ''}`;
//         rowItem.innerHTML = `
//             <div class="track-info-left">
//                 <span class="track-index">${index + 1}</span>
//                 <div class="track-titles">
//                     <h4>${track.title}</h4>
//                     <p>${track.artist}</p>
//                 </div>
//             </div>
//             <button class="btn-remove-track" data-index="${index}" title="Remove Track">✕</button>
//         `;
        
//         // Direct click event hooks setup
//         rowItem.addEventListener('click', (e) => {
//             if (!e.target.classList.contains('btn-remove-track')) {
//                 loadTrackIndex(index);
//                 executeAudioPlayback();
//             }
//         });
        
//         const deleteHook = rowItem.querySelector('.btn-remove-track');
//         deleteHook.addEventListener('click', (e) => {
//             e.stopPropagation();
//             removeTrackFromQueue(index);
//         });
        
//         playlistTracks.appendChild(rowItem);
//     });
// }

// // --- Player State Manipulation Handling Engine ---
// function loadTrackIndex(index) {
//     if (index < 0 || index >= playlistArray.length) return;
    
//     currentTrackIndex = index;
//     const targetedTrack = playlistArray[index];
    
//     // Bind binary playback URL mapping securely
//     audioPlayer.src = targetedTrack.objectUrl;
//     audioPlayer.load();
    
//     // Update textual indicators
//     trackTitleEl.textContent = targetedTrack.title;
//     trackArtistEl.textContent = targetedTrack.artist;
    
//     refreshPlaylistUI();
// }

// function executeAudioPlayback() {
//     if (playlistArray.length === 0) return;
    
//     // Initialize Hardware audio parsing contexts securely via user gesture interactions
//     initWebAudioAPI();
//     if (audioCtx.state === 'suspended') {
//         audioCtx.resume();
//     }
    
//     audioPlayer.play().then(() => {
//         isPlaying = true;
//         iconPlay.classList.add('hidden');
//         iconPause.classList.remove('hidden');
//         artworkDisc.classList.add('spinning');
//     }).catch(err => console.log("Playback interrupted/rejected securely:", err));
// }

// function pauseAudioPlayback() {
//     audioPlayer.pause();
//     isPlaying = false;
//     iconPlay.classList.remove('hidden');
//     iconPause.classList.add('hidden');
//     artworkDisc.classList.remove('spinning');
// }

// function skipToNextTrack() {
//     if (playlistArray.length === 0) return;
    
//     if (isShuffling) {
//         let randomSlot = Math.floor(Math.random() * playlistArray.length);
//         // Fallback prevent instantly resolving exact match again
//         if (randomSlot === currentTrackIndex && playlistArray.length > 1) {
//             randomSlot = (randomSlot + 1) % playlistArray.length;
//         }
//         loadTrackIndex(randomSlot);
//     } else {
//         if (currentTrackIndex >= playlistArray.length - 1) {
//             // Verify structural repeat behavior states
//             if (repeatMode === 1) {
//                 loadTrackIndex(0);
//             } else {
//                 pauseAudioPlayback();
//                 return;
//             }
//         } else {
//             loadTrackIndex(currentTrackIndex + 1);
//         }
//     }
//     executeAudioPlayback();
// }

// function skipToPrevTrack() {
//     if (playlistArray.length === 0) return;
    
//     // If audio elapsed parameter > 3s simply scrub back tracking index point cleanly
//     if (audioPlayer.currentTime > 3) {
//         audioPlayer.currentTime = 0;
//         return;
//     }
    
//     if (currentTrackIndex > 0) {
//         loadTrackIndex(currentTrackIndex - 1);
//     } else {
//         loadTrackIndex(playlistArray.length - 1);
//     }
//     executeAudioPlayback();
// }

// function removeTrackFromQueue(index) {
//     // Revoke memory URLs cleanup securely to free RAM allocations dynamically
//     URL.revokeObjectURL(playlistArray[index].objectUrl);
    
//     playlistArray.splice(index, 1);
    
//     if (playlistArray.length === 0) {
//         pauseAudioPlayback();
//         currentTrackIndex = -1;
//         trackTitleEl.textContent = "No Track Loaded";
//         trackArtistEl.textContent = "Add your music to start listening";
//         audioPlayer.src = "";
//     } else {
//         if (index === currentTrackIndex) {
//             // Scrub execution logic instantly safely resolving track shifts logic
//             currentTrackIndex = -1;
//             loadTrackIndex(index < playlistArray.length ? index : 0);
//             if (isPlaying) executeAudioPlayback();
//         } else if (index < currentTrackIndex) {
//             currentTrackIndex--;
//         }
//     }
//     refreshPlaylistUI();
// }

// // --- Interface Dynamic Time Calculation Metrics ---
// function formatDurationParameters(secs) {
//     const min = Math.floor(secs / 60) || 0;
//     const remainingSecs = Math.floor(secs % 60) || 0;
//     return `${min}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
// }

// // --- Setup Event Subscriptions & Native Hooks ---
// btnPlay.addEventListener('click', () => {
//     if (isPlaying) {
//         pauseAudioPlayback();
//     } else {
//         executeAudioPlayback();
//     }
// });

// btnNext.addEventListener('click', skipToNextTrack);
// btnPrev.addEventListener('click', skipToPrevTrack);

// btnShuffle.addEventListener('click', () => {
//     isShuffling = !isShuffling;
//     btnShuffle.classList.toggle('active', isShuffling);
// });

// btnRepeat.addEventListener('click', () => {
//     repeatMode = (repeatMode + 1) % 3;
//     btnRepeat.classList.remove('active');
    
//     if (repeatMode === 1) {
//         btnRepeat.classList.add('active'); // Global repeat array structure
//         btnRepeat.setAttribute('title', 'Repeat Array Loop');
//     } else if (repeatMode === 2) {
//         btnRepeat.classList.add('active'); // Specific specific audio repeat block mapping
//         btnRepeat.setAttribute('title', 'Repeat Specific Item Hooked');
//         // Inject Custom Inline Sub-indicator state style updates
//         btnRepeat.style.color = 'var(--accent-glow)';
//     } else {
//         btnRepeat.style.color = '';
//         btnRepeat.setAttribute('title', 'Repeat Mode Disengaged');
//     }
// });

// btnClearQueue.addEventListener('click', () => {
//     playlistArray.forEach(track => URL.revokeObjectURL(track.objectUrl));
//     playlistArray = [];
//     removeTrackFromQueue(0);
// });

// // Structural timing sync checks
// audioPlayer.addEventListener('timeupdate', () => {
//     const absoluteLength = audioPlayer.duration;
//     const currentFrameTime = audioPlayer.currentTime;
    
//     if (absoluteLength) {
//         const fillMetric = (currentFrameTime / absoluteLength) * 100;
//         progressBar.style.width = `${fillMetric}%`;
//         progressThumb.style.left = `${fillMetric}%`;
        
//         timeCurrentEl.textContent = formatDurationParameters(currentFrameTime);
//         timeTotalEl.textContent = formatDurationParameters(absoluteLength);
//     }
// });

// audioPlayer.addEventListener('loadedmetadata', () => {
//     timeTotalEl.textContent = formatDurationParameters(audioPlayer.duration);
// });

// audioPlayer.addEventListener('ended', () => {
//     if (repeatMode === 2) {
//         audioPlayer.currentTime = 0;
//         executeAudioPlayback();
//     } else {
//         skipToNextTrack();
//     }
// });

// // Scrub functionality mappings hooks configuration
// progressArea.addEventListener('click', (e) => {
//     const widthSpecs = progressArea.clientWidth;
//     const currentClickPosition = e.offsetX;
//     const computedPercentage = (currentClickPosition / widthSpecs);
    
//     if (audioPlayer.duration) {
//         audioPlayer.currentTime = computedPercentage * audioPlayer.duration;
//     }
// });

// volumeSlider.addEventListener('input', (e) => {
//     audioPlayer.volume = e.target.value;
// });

// // --- File Selection Import Logic Configurations ---
// dropzone.addEventListener('click', () => fileInput.click());

// fileInput.addEventListener('change', (e) => {
//     processSelectedFiles(e.target.files);
//     fileInput.value = ''; // Instantly clean internal hook tracking states
// });

// dropzone.addEventListener('dragover', (e) => {
//     e.preventDefault();
//     dropzone.classList.add('dragover');
// });

// dropzone.addEventListener('dragleave', () => {
//     dropzone.classList.remove('dragover');
// });

// dropzone.addEventListener('drop', (e) => {
//     e.preventDefault();
//     dropzone.classList.remove('dragover');
//     processSelectedFiles(e.dataTransfer.files);
// });

// // Run volume initialize mapping checks cleanly
// audioPlayer.volume = volumeSlider.value;