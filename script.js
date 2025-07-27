// 1. ดึงองค์ประกอบที่จำเป็นจาก HTML
const display = document.querySelector('.calculator-display');
const buttons = document.querySelector('.calculator-buttons');
const clickSound = document.getElementById('clickSound'); // เสียงคลิก

// 2. กำหนดตัวแปรสำหรับเก็บสถานะของเครื่องคิดเลข
let firstOperand = null; // เก็บตัวเลขตัวแรกของการคำนวณ
let secondOperand = null; // เพิ่มตัวแปรสำหรับตัวเลขตัวที่สอง
let operator = null;     // เก็บตัวดำเนินการ (+, -, *, /)
let shouldResetDisplay = false; // สถานะที่บอกว่าควรล้างช่องแสดงผลเมื่อป้อนตัวเลขใหม่หรือไม่
// ใช้ 'shouldResetDisplay' แทน 'waitingForSecondOperand' เพื่อความชัดเจน

// 3. ฟังก์ชันสำหรับอัปเดตช่องแสดงผล (ไม่ต้องแก้ไขมาก)
function updateDisplay() {
    display.value = display.value; // แค่อัปเดตค่าในช่องแสดงผล
}

// 4. ฟังก์ชันจัดการเมื่อคลิกตัวเลข หรือจุดทศนิยม
function inputDigit(digit) {
    if (shouldResetDisplay) { // ถ้าสถานะบอกให้ล้างหน้าจอ
        display.value = digit; // เริ่มต้นตัวเลขใหม่
        shouldResetDisplay = false; // รีเซ็ตสถานะ
    } else {
        // ถ้าช่องแสดงผลเป็น '0' และไม่ใช่จุดทศนิยม ให้แทนที่ด้วยตัวเลขใหม่
        // ไม่งั้นก็ให้ต่อท้ายตัวเลขเดิม
        display.value = display.value === '0' && digit !== '.' ? digit : display.value + digit;
    }
}

// 5. ฟังก์ชันสำหรับคำนวณค่าจริง
function calculate(first, op, second) {
    first = parseFloat(first);  // แปลงเป็นตัวเลข
    second = parseFloat(second); // แปลงเป็นตัวเลข

    if (isNaN(first) || isNaN(second)) return; // ถ้าไม่เป็นตัวเลข ให้หยุด

    switch (op) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '*':
            return first * second;
        case '/':
            return first / second;
        default:
            return second; // ถ้าไม่มีตัวดำเนินการ ให้คืนค่าตัวเลขที่สอง
    }
}

// 6. ฟังก์ชันจัดการเมื่อคลิกตัวดำเนินการ (+, -, *, /) และปุ่มเท่ากับ (=)
function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value); // ค่าปัจจุบันบนหน้าจอ

    // ตรวจสอบว่า firstOperand มีค่าหรือไม่
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) { // ถ้ามีตัวดำเนินการเดิมอยู่แล้ว (หมายถึงมีการกดตัวดำเนินการไปแล้วครั้งหนึ่ง)
        // ทำการคำนวณค่าก่อน
        secondOperand = inputValue; // ตัวเลขปัจจุบันคือตัวเลขตัวที่สอง
        const result = calculate(firstOperand, operator, secondOperand);

        display.value = String(result); // แสดงผลลัพธ์
        firstOperand = result; // ผลลัพธ์ที่ได้จะเป็นตัวเลขตัวแรกสำหรับการคำนวณถัดไป
        secondOperand = null; // ล้างตัวเลขตัวที่สอง
    }

    shouldResetDisplay = true; // หลังจากกดตัวดำเนินการ หรือ = ให้ล้างจอเมื่อป้อนตัวเลขถัดไป
    operator = nextOperator; // เก็บตัวดำเนินการใหม่
}


// 7. ฟังก์ชันสำหรับเคลียร์เครื่องคิดเลข
function resetCalculator() {
    display.value = '0';
    firstOperand = null;
    secondOperand = null;
    operator = null;
    shouldResetDisplay = false;
}

// 8. Event Listener สำหรับปุ่มทั้งหมด (ส่วนนี้มีการปรับปรุงเล็กน้อย)
buttons.addEventListener('click', (event) => {
    const { target } = event; // ปุ่มที่ถูกคลิก

    // ถ้าไม่ใช่ปุ่ม ให้ไม่ทำอะไร
    if (!target.matches('button')) {
        return;
    }

    // เล่นเสียงคลิก
    if (clickSound) {
        clickSound.currentTime = 0; // รีเซ็ตเสียง
        clickSound.play().catch(e => console.log("Error playing sound:", e)); // เพิ่ม .catch เพื่อจัดการ Error ที่อาจเกิดขึ้น
    }

    // จัดการการคลิกตามประเภทปุ่ม
    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        return;
    }

    if (target.classList.contains('clear')) {
        resetCalculator();
        return;
    }

    if (target.classList.contains('equal-sign')) {
        // เมื่อกดปุ่มเท่ากับ
        if (firstOperand !== null && operator !== null && !shouldResetDisplay) {
            secondOperand = parseFloat(display.value);
            const result = calculate(firstOperand, operator, secondOperand);
            display.value = String(result);
            firstOperand = null; // รีเซ็ตเพื่อเตรียมพร้อมสำหรับการคำนวณใหม่
            operator = null;
            secondOperand = null;
            shouldResetDisplay = true; // ล้างจอเมื่อเริ่มต้นคำนวณใหม่
        }
        return;
    }

    // ถ้าเป็นปุ่มตัวเลขหรือจุดทศนิยม
    if (target.classList.contains('decimal')) {
        if (!display.value.includes('.')) { // ถ้ายังไม่มีจุดทศนิยม
            inputDigit(target.value);
        }
    } else {
        inputDigit(target.value);
    }
});

// เริ่มต้นแสดงผล 0 เมื่อโหลดหน้า
resetCalculator(); // ใช้ฟังก์ชัน resetCalculator เพื่อให้เริ่มต้นได้ถูกต้อง