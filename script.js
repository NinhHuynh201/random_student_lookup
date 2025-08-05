let database = {};
let isRandomizing = false; // Biến để tránh spam click

async function loadExcelData() {
    const response = await fetch('data.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    json.forEach(row => {
        const id = row["Mã số học viên"].toString().padStart(3, '0');
        database[id] = {
            name: row["Họ và tên"],
            group: row["Nhóm nhỏ"]
        };
    });
}

function lookupStudent() {
    const input = document.getElementById("manualInput").value.trim().padStart(3, "0");
    const result = document.getElementById("result");

    if (database[input]) {
        const student = database[input];
        result.innerHTML = `
    <div class="result-line">🎲 Mã số: <strong>${input}</strong></div>
    <div class="result-line">👤  <span class="highlight-red">${student.name}</span></div>
    <div class="result-line">🌳  <span class="highlight-green">${student.group}</span></div>
`;
    } else {
        result.innerText = "⚠️ Không tìm thấy học viên!";
    }
}

function randomStudent() {
    if (isRandomizing) return; // Tránh spam click
    
    isRandomizing = true;
    const result = document.getElementById("result");
    const randomButton = document.querySelector('.random-section button');
    
    // Disable nút random
    randomButton.disabled = true;
    randomButton.style.opacity = '0.6';
    
    let countdown = 2; // Giảm từ 3 xuống 2
    let tickCount = 0; // Đếm số lần tick để hiển thị 6 học viên
    let selectedStudents = []; // Lưu trữ 6 học viên đã chọn
    
    // Hiệu ứng countdown với random names (6 lần trong 2 giây)
    const countdownInterval = setInterval(() => {
        // Random một học viên để tạo hiệu ứng "đang quay"
        const keys = Object.keys(database);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const tempStudent = database[randomKey];
        
        // Lưu học viên vào danh sách
        selectedStudents.push({
            id: randomKey,
            name: tempStudent.name,
            group: tempStudent.group
        });
        
        // Chỉ giữ 6 học viên gần nhất
        if (selectedStudents.length > 6) {
            selectedStudents.shift();
        }
        
        // Tạo HTML cho danh sách học viên bên phải
        const studentsListHTML = selectedStudents.map((student, index) => `
            <div class="student-item ${index === selectedStudents.length - 1 ? 'current-student' : 'previous-student'}">
                <span class="student-id">${student.id}</span>
                <span class="student-name">${student.name}</span>
                <span class="student-group">${student.group}</span>
            </div>
        `).join('');
        
        result.innerHTML = `
            <div class="countdown-layout">
                <div class="countdown-left">
                    <div class="countdown-number">${countdown}</div>
                    <div class="countdown-text">Đang chọn ngẫu nhiên...</div>
                </div>
                <div class="students-right">
                    <div class="students-title">🎯 Các học viên được chọn:</div>
                    <div class="students-list">
                        ${studentsListHTML}
                    </div>
                </div>
            </div>
        `;
        
        tickCount++;
        
        // Cứ 3 lần tick (333ms x 3 = 1s) thì giảm countdown
        if (tickCount % 3 === 0) {
            countdown--;
        }
        
        // Sau 6 lần tick (2 giây) thì dừng
        if (tickCount >= 6) {
            clearInterval(countdownInterval);
            showFinalResult();
        }
    }, 333); // 333ms x 6 = ~2 giây
}

function showFinalResult() {
    const result = document.getElementById("result");
    const randomButton = document.querySelector('.random-section button');
    
    // Chọn học viên cuối cùng
    const keys = Object.keys(database);
    const finalRandomKey = keys[Math.floor(Math.random() * keys.length)];
    const finalStudent = database[finalRandomKey];
    
    // Hiệu ứng "drumroll" trước khi hiện kết quả
    result.innerHTML = `
        <div class="drumroll">
            🥁 🥁 🥁
            <div class="drumroll-text">Và học viên được chọn là...</div>
        </div>
    `;
    
    // Sau 1s nữa mới hiện kết quả cuối cùng (giảm từ 1.5s xuống 1s)
    setTimeout(() => {
        result.innerHTML = `
            <div class="final-result">
                <div class="result-line tada-animation">🎲 Mã số: <strong>${finalRandomKey}</strong></div>
                <div class="result-line tada-animation">👤  <span class="highlight-red">${finalStudent.name}</span></div>
                <div class="result-line tada-animation">🌳  <span class="highlight-green">${finalStudent.group}</span></div>
            </div>
        `;
        
        // Enable lại nút random
        randomButton.disabled = false;
        randomButton.style.opacity = '1';
        isRandomizing = false;
    }, 1000);
}

window.onload = async () => {
    await loadExcelData();
};