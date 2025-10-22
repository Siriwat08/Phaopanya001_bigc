/**
 * ฟังก์ชัน Utility สำหรับจัดรูปแบบวันที่ให้แสดงผลในรูปแบบที่อ่านง่าย
 * @param {string} dateString - วันที่ในรูปแบบ ISO 8601 string (e.g., "2023-10-26T10:00:00.000Z")
 * @returns {string} - วันที่ในรูปแบบ "DD/MM/YYYY"
 */
export function formatDateForDisplay(dateString) {
    if (!dateString) return 
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * ฟังก์ชัน Utility สำหรับจัดรูปแบบเวลาให้แสดงผลในรูปแบบที่อ่านง่าย
 * @param {string} timeString - เวลาในรูปแบบ "HH:mm" หรือ "HH:mm:ss"
 * @returns {string} - เวลาในรูปแบบ "HH:mm"
 */
export function formatTimeForDisplay(timeString) {
    if (!timeString) return 
    // ถ้า timeString มีวินาทีด้วย ให้ตัดออก
    if (timeString.length > 5) {
        return timeString.substring(0, 5);
    }
    return timeString;
}

/**
 * แปลง File object ให้เป็น Base64 string
 * @param {File} file - File object จาก input type="file"
 * @returns {Promise<string>} - Promise ที่ Resolve ด้วย Base64 string หรือ Reject ด้วย Error
 */
export function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(""); // คืนค่าว่างถ้าไม่มีไฟล์
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// ฟังก์ชันสำหรับแสดง/ซ่อน Loading State
const dom = {
    app: document.getElementById("app-container"),
    loadingView: document.getElementById("loading-view"),
    loadingText: document.getElementById("loading-text"),
    header: {
        name: document.getElementById("employee-name"),

    },
    viewContainer: document.getElementById("view-container"),
    infoBox: document.getElementById("employee-info-box"),
    historyContainer: document.getElementById("history-container"),
};

export function showLoading(text = "กำลังโหลด...") {
    dom.loadingText.textContent = text;
    dom.app.classList.add("hidden");
    dom.loadingView.classList.remove("hidden");
}

export function hideLoading() {
    dom.app.classList.remove("hidden");
    dom.loadingView.classList.add("hidden");
}

export function showError(message) {
    dom.loadingText.innerHTML = `<span style="color:red; font-weight:bold;">เกิดข้อผิดพลาด:</span><br>${message}`;
    dom.app.classList.add("hidden");
    dom.loadingView.classList.remove("hidden");
}

export function renderHeader(profile) {
    dom.header.name.textContent = profile.displayName;
    // dom.header.picture.src = profile.pictureUrl; // ไม่ได้ใช้แล้วเพราะแสดงโลโก้คงที่
}

export function renderInfoBox(status, employeeData) {
    if (status !== 'NOT_STARTED' && employeeData) {
        dom.infoBox.innerHTML = `<p><b>ชื่อ:</b> ${employeeData['ชื่อ - นามสกุล']}</p><p><b>ทะเบียนรถ:</b> ${employeeData['ทะเบียนรถ']} | <b>สาขา:</b> ${employeeData['สาขา']}</p>`;
        dom.infoBox.classList.remove('hidden');
    } else {
        dom.infoBox.classList.add('hidden');
    }
}

export function updateViewContainer(htmlContent) {
    dom.viewContainer.innerHTML = htmlContent;
}

export function updateHistoryContainer(htmlContent) {
    dom.historyContainer.innerHTML = htmlContent;
}

export function showHistoryContainer() {
    dom.historyContainer.classList.remove('hidden');
}

export function hideHistoryContainer() {
    dom.historyContainer.classList.add('hidden');
}

