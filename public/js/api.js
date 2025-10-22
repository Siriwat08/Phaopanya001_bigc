import { GAS_WEB_APP_URL } from '../main.js';

/**
 * ฟังก์ชันสำหรับเรียก Google Apps Script Web App
 * @param {string} action - ชื่อฟังก์ชันใน Google Apps Script ที่ต้องการเรียก
 * @param {...any} args - อาร์กิวเมนต์ที่จะส่งไปยังฟังก์ชันใน Google Apps Script
 * @returns {Promise<any>} - Promise ที่จะ Resolve ด้วยข้อมูลที่ได้จาก GAS หรือ Reject ด้วย Error
 */
export async function serverCall(action, ...args) {
    const url = GAS_WEB_APP_URL;
    const payload = { action: action, args: args };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // สำคัญ: ต้องใช้ text/plain เพื่อหลีกเลี่ยง CORS preflight request
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        return data.response;
    } catch (error) {
        console.error('Error in serverCall:', error);
        throw error; // ส่ง Error ต่อไปเพื่อให้ผู้เรียกสามารถจัดการได้
    }
}

