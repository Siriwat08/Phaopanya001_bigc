import { serverCall } from "../api.js";
import { readFileAsBase64, showLoading, hideLoading, showError, formatDateForDisplay, formatTimeForDisplay } from "../utils.js";

export function createStartWorkSummaryView(workData) {
    if (!workData) return 
    return `
        <div class="card">
            <h2 class="view-title">ข้อมูลการเริ่มงาน</h2>
            <p><b>วันที่:</b> ${formatDateForDisplay(workData["ข้อมูลงานวันที่"])}</p>
            <p><b>เวลาเริ่ม:</b> ${formatTimeForDisplay(workData["เวลาเริ่มงาน"])}</p>
            <p><b>เลขไมล์เริ่ม:</b> ${workData["เลขไมล์เริ่มงาน"]}</p>
        </div>`;
}

export function createEndFormView(workData) {
    return `
        <form id="end-work-form" class="view card">
            <h2 class="view-title">บันทึกเวลาเลิกงาน</h2>
            <div class="form-group"><label for="endTime">เวลาเลิกงาน</label><input type="time" id="endTime" required value="${new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false })}"></div>
            <div class="form-group"><label for="endMileage">เลขไมล์เลิกงาน</label><input type="number" id="endMileage" required></div>
            <div class="form-group"><label for="workTrips">จำนวนรอบงาน</label><input type="number" id="workTrips" required></div>
            <div class="form-group"><label for="totalDeliveryPoints">จุดส่งทั้งหมด</label><input type="number" id="totalDeliveryPoints" required></div>
            <div class="form-group"><label for="successfulDeliveries">ส่งสำเร็จ</label><input type="number" id="successfulDeliveries" required></div>
            <div class="form-group"><label for="notes">หมายเหตุ</label><textarea id="notes" rows="3"></textarea></div>
            <div class="form-group"><label for="endMileagePhoto">รูปถ่ายเลขไมล์เลิกงาน</label><input type="file" id="endMileagePhoto" accept="image/*"></div>
            <div class="form-group"><label for="endEmployeePhoto">รูปถ่ายพนักงานเลิกงาน</label><input type="file" id="endEmployeePhoto" accept="image/*"></div>
            <button type="submit" class="btn btn-end">บันทึกข้อมูลเลิกงาน</button>
        </form>`;
}

export function addEndFormListeners(liffProfile, workData, renderApp) {
    const form = document.getElementById("end-work-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = form.querySelector(".btn-end");
            btn.disabled = true;
            btn.textContent = "กำลังบันทึก...";
            showLoading("กำลังบันทึกเวลาเลิกงาน...");

            try {
                const data = {
                    userId: liffProfile.userId,
                    endTime: form.querySelector("#endTime").value,
                    endMileage: form.querySelector("#endMileage").value,
                    trips: form.querySelector("#workTrips").value,
                    totalDeliveries: form.querySelector("#totalDeliveryPoints").value,
                    successfulDeliveries: form.querySelector("#successfulDeliveries").value,
                    notes: form.querySelector("#notes").value,
                    endMileagePhoto: await readFileAsBase64(form.querySelector("#endMileagePhoto").files[0]),
                    endEmployeePhoto: await readFileAsBase64(form.querySelector("#endEmployeePhoto").files[0]),
                };

                const result = await serverCall("saveEndWork", data);
                alert(result.message || "บันทึกเวลาเลิกงานสำเร็จ");
                const initialState = await serverCall("getWorkStateForToday", liffProfile.userId);
                renderApp(initialState);
            } catch (err) {
                showError(`Error: ${err.message}`);
                console.error(err);
            } finally {
                btn.disabled = false;
                btn.textContent = "บันทึกข้อมูลเลิกงาน";
                hideLoading();
            }
        });
    }
}

