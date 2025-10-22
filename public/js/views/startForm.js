import { serverCall } from "../api.js";
import { readFileAsBase64, showLoading, hideLoading, showError } from "../utils.js";

export function createStartFormView() {
    return `
        <form id="start-work-form" class="view card">
            <h2 class="view-title">บันทึกเวลาเริ่มงาน</h2>
            <div class="form-group">
                <label for="startTime">เวลาเริ่มงาน</label>
                <input type="time" id="startTime" required value="${new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false })}">
            </div>
            <div class="form-group">
                <label for="startMileage">เลขไมล์เริ่มงาน</label>
                <input type="number" id="startMileage" required>
            </div>
            <div class="form-group">
                <label for="startMileagePhoto">รูปถ่ายเลขไมล์เริ่มงาน</label>
                <input type="file" id="startMileagePhoto" accept="image/*">
            </div>
            <div class="form-group">
                <label for="startEmployeePhoto">รูปถ่ายพนักงานเริ่มงาน</label>
                <input type="file" id="startEmployeePhoto" accept="image/*">
            </div>
            <button type="submit" class="btn btn-start">บันทึกข้อมูลเริ่มงาน</button>
        </form>
    `;
}

export function addStartFormListeners(liffProfile, renderApp) {
    const form = document.getElementById("start-work-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = form.querySelector(".btn-start");
            btn.disabled = true;
            btn.textContent = "กำลังบันทึก...";
            showLoading("กำลังบันทึกเวลาเริ่มงาน...");

            try {
                const data = {
                    userId: liffProfile.userId,
                    startTime: form.querySelector("#startTime").value,
                    startMileage: form.querySelector("#startMileage").value,
                    startMileagePhoto: await readFileAsBase64(form.querySelector("#startMileagePhoto").files[0]),
                    startEmployeePhoto: await readFileAsBase64(form.querySelector("#startEmployeePhoto").files[0]),
                };

                const result = await serverCall("saveStartWork", data);
                alert(result.message || "บันทึกเวลาเริ่มงานสำเร็จ");
                // หลังจากบันทึกสำเร็จ ให้โหลดสถานะใหม่และ render UI ใหม่
                const initialState = await serverCall("getWorkStateForToday", liffProfile.userId);
                renderApp(initialState);
            } catch (err) {
                showError(`Error: ${err.message}`);
                console.error(err);
            } finally {
                btn.disabled = false;
                btn.textContent = "บันทึกข้อมูลเริ่มงาน";
                hideLoading();
            }
        });
    }
}

