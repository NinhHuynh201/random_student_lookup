
const database = {
    "001": { name: "Nguyễn Văn A", group: "Yêu Thương" },
    "002": { name: "Trần Thị B", group: "Vui Mừng" },
    "003": { name: "Lê Văn C", group: "Nhịn Nhục" },
    "004": { name: "Phạm Thị D", group: "Hiền Lành" },
    "005": { name: "Võ Minh E", group: "Bình An" },
    "006": { name: "Đinh Thảo F", group: "Trung Tín" },
    "007": { name: "Ngô Huy G", group: "Nhân Từ" },
    "008": { name: "Huỳnh Nga H", group: "Mềm Mại" }
};

function lookupStudent() {
    const input = document.getElementById("manualInput").value.trim().padStart(3, "0");
    const result = document.getElementById("result");
    if (database[input]) {
        const student = database[input];
        result.innerText = `🎓 Mã số: ${input} | Họ tên: ${student.name} | Nhóm: ${student.group}`;
    } else {
        result.innerText = "⚠️ Không tìm thấy học viên!";
    }
}

function randomStudent() {
    const keys = Object.keys(database);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const student = database[randomKey];
    const result = document.getElementById("result");
    result.innerText = `🎲 Mã số: ${randomKey} | Họ tên: ${student.name} | Nhóm: ${student.group}`;
}
