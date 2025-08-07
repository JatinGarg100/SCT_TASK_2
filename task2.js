document.addEventListener('DOMContentLoaded', () => {
    const displayHours = document.getElementById('hours');
    const displayMinutes = document.getElementById('minutes');
    const displaySeconds = document.getElementById('seconds');
    const displayMilliseconds = document.getElementById('milliseconds');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const lapTimesContainer = document.getElementById('lapTimes');
    const particlesContainer = document.getElementById('particles');

    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapCount = 1;
    let lastLapTime = 0;

    function createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            const duration = Math.random() * 20 + 10;
            particle.style.animation = `float ${duration}s linear infinite`;
            
            particlesContainer.appendChild(particle);
        }
    }

    const formatTime = (time) => time.toString().padStart(2, '0');
    const formatMs = (ms) => Math.floor(ms).toString().padStart(2, '0').slice(0, 2);

    const getCurrentTime = () => {
        return {
            hours: displayHours.textContent,
            minutes: displayMinutes.textContent,
            seconds: displaySeconds.textContent,
            milliseconds: displayMilliseconds.textContent,
            totalMs: elapsedTime
        };
    };

    const updateDisplay = () => {
        const now = Date.now();
        elapsedTime = now - startTime;

        const milliseconds = elapsedTime % 1000;
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);

        displayMilliseconds.textContent = formatMs(milliseconds / 10);
        displaySeconds.textContent = formatTime(seconds);
        displayMinutes.textContent = formatTime(minutes);
        displayHours.textContent = formatTime(hours);
    };

    const startStopwatch = () => {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(updateDisplay, 10);
            isRunning = true;
            updateButtonStates();
            document.querySelector('.neon-circle').style.animation = 'pulse 1s infinite alternate';
        }
    };

    const pauseStopwatch = () => {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            updateButtonStates();
            document.querySelector('.neon-circle').style.animation = 'pulse 2s infinite alternate';
        }
    };

    const resetStopwatch = () => {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedTime = 0;
        lapCount = 1;
        lastLapTime = 0;
        
        displayHours.textContent = '00';
        displayMinutes.textContent = '00';
        displaySeconds.textContent = '00';
        displayMilliseconds.textContent = '00';
        
        lapTimesContainer.innerHTML = '';
        updateButtonStates();
        document.querySelector('.neon-circle').style.animation = 'pulse 2s infinite alternate';
    };

    const recordLap = () => {
        if (isRunning) {
            const currentTime = getCurrentTime();
            const lapDuration = currentTime.totalMs - lastLapTime;
            lastLapTime = currentTime.totalMs;
            
            const lapMs = lapDuration % 1000;
            const lapSeconds = Math.floor(lapDuration / 1000) % 60;
            const lapMinutes = Math.floor(lapDuration / (1000 * 60)) % 60;
            const lapHours = Math.floor(lapDuration / (1000 * 60 * 60));
            
            const formattedLapTime = 
                `${formatTime(lapHours)}:${formatTime(lapMinutes)}:${formatTime(lapSeconds)}.${formatMs(lapMs/10)}`;
            
            const formattedTotalTime = 
                `${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}.${currentTime.milliseconds}`;
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Lap ${lapCount}`;
            
            const lapTimeDisplay = document.createElement('span');
            lapTimeDisplay.className = 'lap-time';
            lapTimeDisplay.textContent = formattedLapTime;
            
            const totalTimeDisplay = document.createElement('span');
            totalTimeDisplay.className = 'total-time';
            totalTimeDisplay.textContent = formattedTotalTime;
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTimeDisplay);
            lapItem.appendChild(totalTimeDisplay);
            
            lapItem.style.animation = 'fadeIn 0.5s ease-out';
            lapTimesContainer.prepend(lapItem);
            lapCount++;
            
            lapTimesContainer.scrollTop = 0;
        }
    };

    const updateButtonStates = () => {
        startBtn.disabled = isRunning;
        pauseBtn.disabled = !isRunning;
    };

    const addParticleAnimations = () => {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            particle.style.animation = `float ${duration}s ${delay}s linear infinite`;
        });
    };

    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 100}px);
                opacity: 0;
            }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    createParticles();
    addParticleAnimations();

    startBtn.addEventListener('click', startStopwatch);
    pauseBtn.addEventListener('click', pauseStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);
});
