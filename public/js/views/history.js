import { serverCall } from "../api.js";
import { formatDateForDisplay, formatTimeForDisplay, showHistoryContainer, hideHistoryContainer, updateHistoryContainer } from "../utils.js";

export function createHistoryTableView(historyData) {
    if (!historyData || historyData.length === 0) {
        return 
    }

    const headers = ["วันที่", "เวลาเริ่มงาน", "เวลาเลิกงาน", "ระยะทางรวม", "จำนวนจุดที่ส่งสำเร็จ"];
    let th = "<tr>" + headers.map(col => `<th>${col}</th>`).join("") + "</tr>";

    let tb = historyData.map(record => {
        const dateDisplay = formatDateForDisplay(record["ข้อมูลงานวันที่"]);
        const startTimeDisplay = formatTimeForDisplay(record["เวลาเริ่มงาน"]);
        const endTimeDisplay = formatTimeForDisplay(record["เวลาเลิกงาน"]);
        const mileageDisplay = record["ระยะทางรวม"] || "-";
        const successDisplay = record["จำนวนจุดที่ส่งสำเร็จ"] || "-";
        return `<tr><td>${dateDisplay}</td><td>${startTimeDisplay}</td><td>${endTimeDisplay}</td><td>${mileageDisplay}</td><td>${successDisplay}</td></tr>`;
    }).join("");

    return `
        <div class="card">
            <h2 class="view-title">ประวัติ 5 วันล่าสุด</h2>
            <div id="history-table-wrapper">
                <table class="history-table">
                    <thead>${th}</thead>
                    <tbody>${tb}</tbody>
                </table>
            </div>
        </div>`;
}

export async function renderHistory(liffProfile, status) {
    if (status === "STARTED_NOT_ENDED" || status === "COMPLETED") {
        try {
            const history = await serverCall("getWorkHistory", liffProfile.userId);
            if (history && history.length > 0) {
                updateHistoryContainer(createHistoryTableView(history));
                showHistoryContainer();
            } else {
                hideHistoryContainer();
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            hideHistoryContainer(); // ซ่อนประวัติหากเกิดข้อผิดพลาด
        }
    } else {
        hideHistoryContainer();
    }
}

