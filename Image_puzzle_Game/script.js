document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements (same as your working version)
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const difficultySelect = document.getElementById('difficulty-select');
    const startGameButton = document.getElementById('start-game-button');
    const samplePuzzlesGrid = document.getElementById('sample-puzzles-grid');
    
    const fullImageForBreakup = document.getElementById('full-image-for-breakup');
    const puzzleGridContainer = document.getElementById('puzzle-grid-container');
    const movesCountDisplay = document.getElementById('moves-count');
    const timerDisplay = document.getElementById('timer');
    const quitToMenuButton = document.getElementById('quit-to-menu-button');

    const congratsModal = document.getElementById('congrats-modal');
    const finalDifficultyDisplay = document.getElementById('final-difficulty');
    const finalMovesDisplay = document.getElementById('final-moves');
    const finalTimeDisplay = document.getElementById('final-time');
    const playAnotherButton = document.getElementById('play-another-button');
    const modalCloseButton = document.querySelector('.modal-close-button');
    const modalSampleGrid = document.getElementById('modal-sample-grid');

    // Game State Variables
    let gridSize = parseInt(difficultySelect.value);
    let currentPuzzleImageSrc = null;
    let originalImageWidth, originalImageHeight;
    let tilesData = []; 
    let moves = 0;
    let timerInterval;
    let secondsElapsed = 0;
    let isTimerRunning = false;
    let draggedTileInfo = null; 

    const sampleImageURLs = [ // Using your last working set
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80", 
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80", 
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80", 
        "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    ];

    // --- INITIALIZATION ---
    function initializeGame() {
        populateSamplePuzzles(samplePuzzlesGrid, sampleImageURLs);
        populateSamplePuzzles(modalSampleGrid, sampleImageURLs.slice(0,3));
        setupScreen.classList.add('active');
        gameScreen.classList.remove('active');
    }

    // --- EVENT LISTENERS ---
    imageUpload.addEventListener('change', handleImageUpload);
    difficultySelect.addEventListener('change', () => gridSize = parseInt(difficultySelect.value));
    startGameButton.addEventListener('click', startGame);
    quitToMenuButton.addEventListener('click', resetToSetup);
    playAnotherButton.addEventListener('click', () => {
        congratsModal.classList.add('hidden');
        resetToSetup();
    });
    modalCloseButton.addEventListener('click', () => congratsModal.classList.add('hidden'));

    // --- IMAGE HANDLING ---
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentPuzzleImageSrc = e.target.result;
                imagePreview.src = currentPuzzleImageSrc;
                imagePreview.classList.remove('hidden');
                
                const img = new Image();
                img.onload = () => {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        originalImageWidth = img.naturalWidth;
                        originalImageHeight = img.naturalHeight;
                        startGameButton.classList.remove('hidden');
                    } else {
                        alert("Uploaded image has invalid dimensions.");
                        resetUploadedImageState();
                    }
                };
                img.onerror = () => {
                    alert("Failed to process uploaded image.");
                    resetUploadedImageState();
                }
                img.src = currentPuzzleImageSrc;
            };
            reader.readAsDataURL(file);
        } else {
            resetUploadedImageState();
        }
    }
    function resetUploadedImageState() {
        currentPuzzleImageSrc = null;
        originalImageWidth = undefined;
        originalImageHeight = undefined;
        imagePreview.src = "#";
        imagePreview.classList.add('hidden');
        startGameButton.classList.add('hidden');
        imageUpload.value = ''; // Clear the file input
    }

    function loadSampleImage(src) {
        const img = new Image();
        img.crossOrigin = "Anonymous"; 
        img.onload = () => {
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                originalImageWidth = img.naturalWidth;
                originalImageHeight = img.naturalHeight;
                currentPuzzleImageSrc = src;
                startGame(); // Start game directly after dimensions are known
            } else {
                alert("Sample image has invalid dimensions.");
            }
        };
        img.onerror = () => alert("Failed to load sample image.");
        img.src = src;
    }

    function populateSamplePuzzles(gridElement, urls) {
        gridElement.innerHTML = '';
        urls.forEach(url => {
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.alt = "Sample Puzzle";
            imgElement.addEventListener('click', () => loadSampleImage(url));
            gridElement.appendChild(imgElement);
        });
    }

    // --- GAME LOGIC ---
    function startGame() {
        if (!currentPuzzleImageSrc || !originalImageWidth || !originalImageHeight) {
            alert("Please upload or select an image, and wait for it to load completely.");
            return;
        }

        setupScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        moves = 0; secondsElapsed = 0; isTimerRunning = false;
        movesCountDisplay.textContent = moves;
        timerDisplay.textContent = formatTime(secondsElapsed);
        clearInterval(timerInterval);

        fullImageForBreakup.src = currentPuzzleImageSrc;
        fullImageForBreakup.classList.remove('hidden');
        fullImageForBreakup.classList.remove('breaking-up');

        setTimeout(() => {
            fullImageForBreakup.classList.add('breaking-up');
            setTimeout(createAndDisplayTiles, 500); 
        }, 1000); 
    }

    function createAndDisplayTiles() {
        fullImageForBreakup.classList.add('hidden'); 
        puzzleGridContainer.innerHTML = ''; 
        tilesData = [];

        // It's crucial that puzzleGridContainer is visible and has its dimensions calculated by the browser
        // Calling this inside requestAnimationFrame helps ensure layout is stable.
        requestAnimationFrame(() => {
            const puzzleContainerActualWidth = puzzleGridContainer.clientWidth;
            const puzzleContainerActualHeight = puzzleGridContainer.clientHeight; // Should be equal to width for square grid

            if (puzzleContainerActualWidth <= 0 || !originalImageWidth || !originalImageHeight) {
                console.error("Cannot create tiles. Invalid dimensions:", 
                    "Container W:", puzzleContainerActualWidth, 
                    "Image W:", originalImageWidth, "Image H:", originalImageHeight);
                alert("Error creating puzzle: Area or image dimensions are invalid. Please try again.");
                resetToSetup();
                return;
            }

            puzzleGridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
            puzzleGridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

            // --- Start of "Cover" Logic ---
            let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
            const imgAspectRatio = originalImageWidth / originalImageHeight;
            // Our puzzle grid is square, so its aspect ratio is 1
            const containerAspectRatio = puzzleContainerActualWidth / puzzleContainerActualHeight; // Should be 1

            if (imgAspectRatio > containerAspectRatio) {
                // Image is wider than the container: fit height, crop width
                displayHeight = puzzleContainerActualHeight;
                displayWidth = displayHeight * imgAspectRatio;
                offsetX = (displayWidth - puzzleContainerActualWidth) / 2;
            } else {
                // Image is taller or same aspect as container: fit width, crop height
                displayWidth = puzzleContainerActualWidth;
                displayHeight = displayWidth / imgAspectRatio;
                offsetY = (displayHeight - puzzleContainerActualHeight) / 2;
            }
            // --- End of "Cover" Logic ---

            const pieceActualWidthOnScreen = puzzleContainerActualWidth / gridSize; // How wide each tile is on screen
            const pieceActualHeightOnScreen = puzzleContainerActualHeight / gridSize; // How tall each tile is on screen

            // The background-size for each tile will be the full dimensions of the *scaled* source image.
            const bgSizeForTile = `${displayWidth.toFixed(3)}px ${displayHeight.toFixed(3)}px`;

            let solvedTilesInfo = [];
            for (let i = 0; i < gridSize * gridSize; i++) {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;

                // Calculate the top-left corner of the segment in the *scaled, centered* source image
                const segmentX_in_scaled_image = (col * pieceActualWidthOnScreen) + offsetX;
                const segmentY_in_scaled_image = (row * pieceActualHeightOnScreen) + offsetY;
                
                // CSS background-position is the negative of these values
                const bgPosForTile = `-${segmentX_in_scaled_image.toFixed(3)}px -${segmentY_in_scaled_image.toFixed(3)}px`;

                solvedTilesInfo.push({
                    correctId: i,
                    bgPos: bgPosForTile,
                    bgSize: bgSizeForTile 
                });
            }
            
            let shuffledPieceInfo = [...solvedTilesInfo].sort(() => Math.random() - 0.5);

            for (let i = 0; i < gridSize * gridSize; i++) {
                const tileElement = document.createElement('div');
                tileElement.classList.add('puzzle-tile');
                // CSS grid handles the tile element's size, no need for explicit width/height here
                // if using percentages on the tile. But for safety with grid:
                // tileElement.style.width = `${pieceActualWidthOnScreen}px`; // Or 100/gridSize %
                // tileElement.style.height = `${pieceActualHeightOnScreen}px`;

                const pieceToPlace = shuffledPieceInfo[i]; 

                tileElement.style.backgroundImage = `url('${currentPuzzleImageSrc}')`;
                tileElement.style.backgroundSize = pieceToPlace.bgSize;
                tileElement.style.backgroundPosition = pieceToPlace.bgPos;
                
                tileElement.draggable = true;
                tileElement.dataset.currentPieceId = pieceToPlace.correctId; 
                tileElement.dataset.domSlotId = i; 

                tilesData.push({
                    element: tileElement,
                    correctSlotId: i, 
                    currentPieceId: pieceToPlace.correctId
                });
                puzzleGridContainer.appendChild(tileElement);

                const randomDelay = Math.random() * 0.5; 
                const randomTranslateX = (Math.random() - 0.5) * 200; 
                const randomTranslateY = (Math.random() - 0.5) * 200;
                tileElement.style.setProperty('--animation-delay', `${randomDelay}s`);
                tileElement.style.setProperty('--translateX', `${randomTranslateX}px`);
                tileElement.style.setProperty('--translateY', `${randomTranslateY}px`);
                
                requestAnimationFrame(() => {
                    tileElement.classList.add('breaking-in');
                });

                tileElement.addEventListener('dragstart', handleDragStart);
                tileElement.addEventListener('dragover', handleDragOver);
                tileElement.addEventListener('drop', handleDrop);
                tileElement.addEventListener('dragend', handleDragEnd);
            }
            if (checkWin()) { createAndDisplayTiles(); } // Reshuffle if solved by chance
        }); // End of requestAnimationFrame
    }


    // --- DRAG AND DROP (same as your working version, but ensure bgSize is swapped too) ---
    function handleDragStart(event) {
        if (!isTimerRunning && secondsElapsed === 0) { startTimer(); }
        draggedTileInfo = {
            element: event.target,
            currentPieceId: event.target.dataset.currentPieceId, // The piece it IS
            // domSlotId: event.target.dataset.domSlotId // The slot it's IN
        };
        event.dataTransfer.setData('text/plain', event.target.dataset.domSlotId); // Pass the slot ID
        setTimeout(() => event.target.classList.add('dragging'), 0); 
    }
    function handleDragOver(event) { event.preventDefault(); }

    function handleDrop(event) {
        event.preventDefault();
        const targetElement = event.target.closest('.puzzle-tile');
        if (!targetElement || !draggedTileInfo || targetElement === draggedTileInfo.element) {
            return; 
        }

        const targetPieceId = targetElement.dataset.currentPieceId;
        const targetBgPos = targetElement.style.backgroundPosition;
        const targetBgSize = targetElement.style.backgroundSize; // Crucial to swap this too

        const draggedPieceId = draggedTileInfo.element.dataset.currentPieceId;
        const draggedBgPos = draggedTileInfo.element.style.backgroundPosition;
        const draggedBgSize = draggedTileInfo.element.style.backgroundSize;

        // Swap target with dragged info
        targetElement.style.backgroundPosition = draggedBgPos;
        targetElement.style.backgroundSize = draggedBgSize;
        targetElement.dataset.currentPieceId = draggedPieceId;

        // Swap dragged with target info
        draggedTileInfo.element.style.backgroundPosition = targetBgPos;
        draggedTileInfo.element.style.backgroundSize = targetBgSize;
        draggedTileInfo.element.dataset.currentPieceId = targetPieceId;
        
        moves++;
        movesCountDisplay.textContent = moves;
        checkWin();
    }
    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
        draggedTileInfo = null;
    }

    // --- TIMER (same) ---
    function startTimer() {
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            secondsElapsed++;
            timerDisplay.textContent = formatTime(secondsElapsed);
        }, 1000);
    }
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // --- WIN CONDITION (same) ---
    function checkWin() {
        const tilesInGrid = puzzleGridContainer.querySelectorAll('.puzzle-tile');
        for (let i = 0; i < tilesInGrid.length; i++) {
            // A slot 'i' (domSlotId) should contain piece 'i' (currentPieceId)
            if (parseInt(tilesInGrid[i].dataset.currentPieceId) !== parseInt(tilesInGrid[i].dataset.domSlotId)) {
                return false; 
            }
        }
        clearInterval(timerInterval); isTimerRunning = false;
        finalDifficultyDisplay.textContent = `${gridSize}x${gridSize}`;
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = formatTime(secondsElapsed);
        congratsModal.classList.remove('hidden');
        return true;
    }

    // --- RESET (same) ---
    function resetToSetup() {
        gameScreen.classList.remove('active');
        setupScreen.classList.add('active');
        clearInterval(timerInterval);
        isTimerRunning = false;
        resetUploadedImageState();
        currentPuzzleImageSrc = null; // Ensure this is reset too for samples
        originalImageWidth = undefined;
        originalImageHeight = undefined;
    }

    initializeGame();
});