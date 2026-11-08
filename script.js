// 1. 스탑워치 타이머 상태 관리
let seconds = 0;
let timerInterval = null;
let isTimerRunning = false;
let finalSolveTime = "00:00";

function startTimer() {
    if (!isTimerRunning) {
        timerInterval = setInterval(() => {
            seconds++;
            const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            finalSolveTime = `${mins}:${secs}`;
            document.getElementById('timer').innerText = finalSolveTime;
        }, 1000);
        isTimerRunning = true;
        document.getElementById('timerIcon').className = 'fa-solid fa-pause';
    }
}

function stopTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        document.getElementById('timerIcon').className = 'fa-solid fa-play';
    }
}

function toggleTimer() {
    if (isTimerRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

// 페이지 로드 시 타이머 자동으로 시작
startTimer();

// 2. 지문 형광펜 및 밑줄 기능
function highlightSelection(color) {
    const userSelection = window.getSelection();
    if (!userSelection.rangeCount || userSelection.isCollapsed) return;

    const range = userSelection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = color === 'yellow' ? 'highlight-yellow' : 'highlight-green';
    
    try {
        range.surroundContents(span);
    } catch (e) {
        console.log("선택 영역 래핑 제외");
    }
}

function clearHighlights() {
    const highlights = document.querySelectorAll('.highlight-yellow, .highlight-green');
    highlights.forEach(el => {
        const parent = el.parentNode;
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
    });
}

// 3. 문제 제출 및 Step 1 -> Step 2 화면 전환 Logic
const CORRECT_ANSWER = "2";

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="question31"]:checked');
    
    if (!selectedOption) {
        alert('정답 선지(①~⑤)를 먼저 선택해 주세요!');
        return;
    }

    // 답 제출 시 타이머 일시정지
    stopTimer();

    const userChoice = selectedOption.value;
    const isCorrect = userChoice === CORRECT_ANSWER;

    // Step 2 결과 배너 업데이트
    const resultBanner = document.getElementById('resultBanner');
    const resultIconBox = document.getElementById('resultIconBox');
    const resultTitle = document.getElementById('resultTitle');
    const userChoiceTag = document.getElementById('userChoiceTag');
    const resultDesc = document.getElementById('resultDesc');
    document.getElementById('resultTime').innerText = finalSolveTime;

    if (isCorrect) {
        resultBanner.className = 'p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm bg-emerald-50/80 border-emerald-200 text-emerald-900';
        resultIconBox.className = 'w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold bg-emerald-500 text-white shadow-md';
        resultIconBox.innerHTML = '<i class="fa-solid fa-check"></i>';
        resultTitle.innerText = '정답입니다!';
        userChoiceTag.className = 'text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-200 text-emerald-800';
        userChoiceTag.innerText = `내가 찍은 답: ${userChoice}번`;
        resultDesc.innerText = '명확한 근거로 정답을 맞추셨습니다! 다른 사람들의 실전 단축 팁도 확인해 보세요.';
    } else {
        resultBanner.className = 'p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm bg-red-50/80 border-red-200 text-red-900';
        resultIconBox.className = 'w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold bg-red-500 text-white shadow-md';
        resultIconBox.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        resultTitle.innerText = '아쉽게 틀렸습니다.';
        userChoiceTag.className = 'text-xs px-2.5 py-0.5 rounded-full font-bold bg-red-200 text-red-800';
        userChoiceTag.innerText = `내가 찍은 답: ${userChoice}번 (정답: 2번)`;
        resultDesc.innerText = '어떤 부분에서 함정에 빠졌는지 아래에 오답 원인을 기록하고 실전 팁을 참고하세요.';
    }

    // Step 1 숨기고 Step 2 표시
    document.getElementById('step1View').classList.add('hidden');
    document.getElementById('step2View').classList.remove('hidden');

    // 상단 인디케이터 강조 위치 변경
    document.getElementById('step1Indicator').className = 'px-3 py-1 text-slate-400 flex items-center gap-1.5';
    document.getElementById('step1Indicator').querySelector('span:first-child').className = 'w-4 h-4 rounded-full bg-slate-300 text-slate-600 text-[10px] flex items-center justify-center';

    document.getElementById('step2Indicator').className = 'px-3 py-1 bg-white text-brand-700 rounded-md shadow-sm flex items-center gap-1.5 font-bold';
    document.getElementById('step2Indicator').querySelector('span:first-child').className = 'w-4 h-4 rounded-full bg-brand-700 text-white text-[10px] flex items-center justify-center';
}

// 재도전 / 다시 풀기 기능
function resetToStep1() {
    seconds = 0;
    document.getElementById('timer').innerText = "00:00";
    startTimer();

    const selectedOption = document.querySelector('input[name="question31"]:checked');
    if (selectedOption) selectedOption.checked = false;

    document.getElementById('step2View').classList.add('hidden');
    document.getElementById('step1View').classList.remove('hidden');

    document.getElementById('step1Indicator').className = 'px-3 py-1 bg-white text-brand-700 rounded-md shadow-sm flex items-center gap-1.5 font-bold';
    document.getElementById('step1Indicator').querySelector('span:first-child').className = 'w-4 h-4 rounded-full bg-brand-700 text-white text-[10px] flex items-center justify-center';

    document.getElementById('step2Indicator').className = 'px-3 py-1 text-slate-400 flex items-center gap-1.5';
    document.getElementById('step2Indicator').querySelector('span:first-child').className = 'w-4 h-4 rounded-full bg-slate-300 text-slate-600 text-[10px] flex items-center justify-center';
}

// 4. 태그 선택 및 노트 저장 이벤트
function toggleTag(btn) {
    btn.classList.toggle('bg-brand-600');
    btn.classList.toggle('text-white');
    btn.classList.toggle('border-brand-600');
    btn.classList.toggle('text-slate-600');
}

function saveMyNote() {
    const comment = document.getElementById('myCommentText').value;
    if (!comment.trim()) {
        alert('복습 코멘트를 입력해 주세요!');
        return;
    }
    alert('오답노트가 정상적으로 저장되었습니다!');
}

function likeSolution(btn) {
    const countSpan = btn.querySelector('.count');
    let count = parseInt(countSpan.innerText);
    
    if (!btn.classList.contains('liked')) {
        countSpan.innerText = count + 1;
        btn.classList.add('liked', 'text-brand-600');
    } else {
        countSpan.innerText = count - 1;
        btn.classList.remove('liked', 'text-brand-600');
    }
}
