
let database = {};

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
    const keys = Object.keys(database);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const student = database[randomKey];
    const result = document.getElementById("result");

    result.innerHTML = `
    <div class="result-line">🎲 Mã số: <strong>${randomKey}</strong></div>
    <div class="result-line">👤  <span class="highlight-red">${student.name}</span></div>
    <div class="result-line">🌳  <span class="highlight-green">${student.group}</span></div>
`;

}

window.onload = async () => {
    await loadExcelData();
};
