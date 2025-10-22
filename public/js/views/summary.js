import { formatDateForDisplay, formatTimeForDisplay } from "../utils.js";

export function createSummaryView(workData) {
    if (!workData) return 
    return `
        <div class="view card">
            <h2 class="view-title">สรุปข้อมูลประจำวัน</h2>
            <p><b>วันที่:</b> ${formatDateForDisplay(workData["ข้อมูลงานวันที่"])}</p>
            <p><b>เวลาทำงาน:</b> ${formatTimeForDisplay(workData["เวลาเริ่มงาน"])} - ${formatTimeForDisplay(workData["เวลาเลิกงาน"])} (${workData["จำนวนชั่วโมงการทำงาน"] || "N/A"} ชม.)</p>
            <p><b>ระยะทางรวม:</b> ${workData["ระยะทางรวม"] || "N/A"} กม.</p>
            <p><b>การส่งของ:</b> สำเร็จ ${workData["จำนวนจุดที่ส่งสำเร็จ"]}/${workData["จำนวนจุดที่นำออกส่งทั้งหมด"]} จุด</p>
            <p><b>หมายเหตุ:</b> ${workData["ระบุ/หมายเหตุ"] || "-"}</p>
        </div>`;
}

