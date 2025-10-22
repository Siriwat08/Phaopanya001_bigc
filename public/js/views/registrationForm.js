import { serverCall } from "../api.js";
import { showLoading, hideLoading, showError } from "../utils.js";

export function createRegistrationFormView() {
    return `
        <form id="registration-form" class="view card">
            <h2 class="view-title">ลงทะเบียนพนักงาน</h2>
            <p>กรุณากรอกข้อมูลเพื่อลงทะเบียนใช้งานระบบ</p>
            <div class="form-group">
                <label for="employeeName">ชื่อ - นามสกุล</label>
                <input type="text" id="employeeName" required>
            </div>
            <div class="form-group">
                <label for="carLicense">ทะเบียนรถ</label>
                <input type="text" id="carLicense" required>
            </div>
            <div class="form-group">
                <label for="contactNumber">เบอร์ติดต่อ</label>
                <input type="tel" id="contactNumber" required>
            </div>
            <div class="form-group">
                <label for="branch">สาขา</label>
                <input type="text" id="branch" required>
            </div>
            <button type="submit" class="btn btn-submit">ลงทะเบียน</button>
        </form>
    `;
}

export function addRegistrationFormListeners(liffProfile, renderApp) {
    const form = document.getElementById("registration-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = form.querySelector(".btn-submit");
            btn.disabled = true;
            btn.textContent = "กำลังลงทะเบียน...";
            showLoading("กำลังลงทะเบียนพนักงาน...");

            try {
                const data = {
                    userId: liffProfile.userId,
                    employeeName: form.querySelector("#employeeName").value,
                    carLicense: form.querySelector("#carLicense").value,
                    contactNumber: form.querySelector("#contactNumber").value,
                    branch: form.querySelector("#branch").value,
                };

                const result = await serverCall("registerEmployee", data);
                alert(result.message || "ลงทะเบียนสำเร็จ");
                // หลังจากลงทะเบียนสำเร็จ ให้โหลดสถานะใหม่และ render UI ใหม่
                const initialState = await serverCall("getWorkStateForToday", liffProfile.userId);
                renderApp(initialState);
            } catch (err) {
                showError(`Error: ${err.message}`);
                console.error(err);
            } finally {
                btn.disabled = false;
                btn.textContent = "ลงทะเบียน";
                hideLoading();
            }
        });
    }
}

