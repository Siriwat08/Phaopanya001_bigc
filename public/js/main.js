import { serverCall } from "./api.js";
import { showLoading, hideLoading, showError, renderHeader, renderInfoBox } from "./utils.js";
import { renderView } from "./router.js";
import { renderHistory } from "./views/history.js";

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★★★  กรุณาใส่ LIFF ID และ WEB APP URL ของคุณที่นี่  ★★★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
export const LIFF_ID = "2008326721-bmkWomzv"; // ใช้ LIFF ID เดิมของผู้ใช้
export const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzDI78tUezqDWqN_NVojQZaioS5w2kZdOWernJDK0e0G-v7Ff0fYbS7G58ZjSdTdT_mcw/exec"; // ใช้ GAS WEB APP URL เดิมของผู้ใช้

let liffProfile = {};

// ฟังก์ชันหลักสำหรับ Render UI ทั้งหมด
async function renderApp(initialState) {
    const { status, employeeData, workData } = initialState;

    renderHeader(liffProfile);
    renderInfoBox(status, employeeData);

    // กำหนด View ที่จะแสดงตามสถานะ
    let currentView = "home";
    if (status === "NOT_STARTED") {
        // ตรวจสอบว่ามีข้อมูลพนักงานหรือไม่ ถ้าไม่มีให้ไปหน้าลงทะเบียน
        if (!employeeData || !employeeData["userId"]) {
            currentView = "registration";
        } else {
            currentView = "home";
        }
    } else if (status === "STARTED_NOT_ENDED") {
        currentView = "home"; // หรืออาจจะให้ไปหน้าสรุปข้อมูลเริ่มงานและฟอร์มเลิกงานโดยตรง
    } else if (status === "COMPLETED") {
        currentView = "summary";
    }

    renderView(currentView, liffProfile, initialState, renderApp); // ส่ง renderApp เข้าไปเพื่อให้ View ต่างๆ เรียกใช้เพื่ออัปเดต UI ได้
    renderHistory(liffProfile, status);
}

// Main Logic
window.addEventListener("DOMContentLoaded", async () => {
    showLoading("กำลังเริ่มต้น...");
    try {
        await liff.init({ liffId: LIFF_ID });

        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }

        showLoading("กำลังดึงข้อมูล...");
        liffProfile = await liff.getProfile();

        const initialState = await serverCall("getWorkStateForToday", liffProfile.userId);
        
        renderApp(initialState);
        hideLoading();

    } catch (error) {
        showError(`เกิดข้อผิดพลาด: ${error.message}`);
        console.error(error);
    }
});

