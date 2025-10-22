import { createStartFormView, addStartFormListeners } from "./views/startForm.js";
import { createEndFormView, createStartWorkSummaryView, addEndFormListeners } from "./views/endForm.js";
import { createSummaryView } from "./views/summary.js";
import { createRegistrationFormView, addRegistrationFormListeners } from "./views/registrationForm.js";
import { updateViewContainer } from "../utils.js";

/**
 * ฟังก์ชันสำหรับสร้างเมนูหลัก (Home View)
 * @param {string} status - สถานะปัจจุบันของงาน (NOT_STARTED, STARTED_NOT_ENDED, COMPLETED)
 * @returns {string} - HTML string ของเมนูหลัก
 */
function createMainMenuView(status) {
    const isNotStarted = status === 'NOT_STARTED';
    return `
        <div class="view card">
            <h2 class="view-title">สถานะ: ${isNotStarted ? 'ยังไม่เริ่มงาน' : 'กำลังปฏิบัติงาน'}</h2>
            <div class="main-view-buttons">
                <button id="show-start-form-btn" class="btn btn-start" ${!isNotStarted ? 'disabled' : ''}>ลงเวลาเริ่มงาน</button>
                <button id="show-end-form-btn" class="btn btn-end" ${isNotStarted || !status ? 'disabled' : ''}>ลงเวลาเลิกงาน</button>
            </div>
        </div>`;
}

/**
 * ฟังก์ชันสำหรับเพิ่ม Event Listeners ให้กับเมนูหลัก
 * @param {Function} navigate - ฟังก์ชัน navigate จาก router
 */
function addMainMenuListeners(navigate) {
    document.getElementById('show-start-form-btn')?.addEventListener('click', () => {
        navigate('startForm');
    });
    document.getElementById('show-end-form-btn')?.addEventListener('click', () => {
        navigate('endForm');
    });
}

/**
 * ฟังก์ชันหลักสำหรับ Render View ต่างๆ
 * @param {string} viewName - ชื่อของ View ที่ต้องการแสดง (e.g., 'home', 'startForm', 'endForm', 'summary', 'registration')
 * @param {object} liffProfile - ข้อมูลโปรไฟล์ LIFF ของผู้ใช้
 * @param {object} initialState - สถานะเริ่มต้นของแอปพลิเคชันจาก GAS
 * @param {Function} renderAppCallback - Callback function เพื่อเรียก renderApp ใน main.js อีกครั้ง
 */
export function renderView(viewName, liffProfile, initialState, renderAppCallback) {
    let htmlContent = '';
    const { status, workData } = initialState;

    switch (viewName) {
        case 'home':
            htmlContent = createMainMenuView(status);
            updateViewContainer(htmlContent);
            addMainMenuListeners((targetView) => renderView(targetView, liffProfile, initialState, renderAppCallback));
            break;
        case 'startForm':
            htmlContent = createStartFormView();
            updateViewContainer(htmlContent);
            addStartFormListeners(liffProfile, renderAppCallback);
            break;
        case 'endForm':
            // แสดงสรุปข้อมูลเริ่มงานก่อนฟอร์มเลิกงาน
            const summaryHtml = createStartWorkSummaryView(workData);
            const endFormHtml = createEndFormView(workData);
            htmlContent = summaryHtml + endFormHtml;
            updateViewContainer(htmlContent);
            addEndFormListeners(liffProfile, workData, renderAppCallback);
            break;
        case 'summary':
            htmlContent = createSummaryView(workData);
            updateViewContainer(htmlContent);
            break;
        case 'registration':
            htmlContent = createRegistrationFormView();
            updateViewContainer(htmlContent);
            addRegistrationFormListeners(liffProfile, renderAppCallback);
            break;
        default:
            htmlContent = `<div class="card"><p>ไม่พบ View ที่ระบุ: ${viewName}</p></div>`;
            updateViewContainer(htmlContent);
            break;
    }
}

