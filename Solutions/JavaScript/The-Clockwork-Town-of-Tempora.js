
// 🕐 Tempora Clock Synchronization System 🕐
// Grand Clock Tower Time: 15:00
//
// 이 프로그램은 대형 시계탑과 마을 시계들의 시간 차이를 분석합니다.
// 잘못된 시간 형식에 대한 오류 처리와 ASCII 시계 시각화가 포함되어 있습니다.

// --- 설정 ---
const grandClockTime = "15:00";
const townClockTimes = ["14:45", "15:05", "15:00", "14:40"];

// --- 유틸리티 함수 ---
/**
 * HH:MM 형식의 시간 문자열을 [hour, minute] 배열로 반환합니다.
 * 잘못된 형식이면 오류를 발생시킵니다.
 */
function parseTime(timeStr) {
    const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(timeStr);
    if (!match) throw new Error(`잘못된 시간 형식: ${timeStr}`);
    return [parseInt(match[1], 10), parseInt(match[2], 10)];
}

/**
 * 두 시간(HH:MM 문자열) 간의 분(minute) 차이를 반환합니다.
 * clockTime이 앞서면 양수, 뒤처지면 음수.
 */
function timeDifference(clockTime, grandTime) {
    const [ch, cm] = parseTime(clockTime);
    const [gh, gm] = parseTime(grandTime);
    return (ch - gh) * 60 + (cm - gm);
}

/**
 * 주어진 시간에 대한 ASCII 시계 시각화
 */
function asciiClock(hour, minute) {
    return `    ⏰ ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}\n     12\n   9  |  3\n     6\n  (${hour}:${minute.toString().padStart(2, "0")})`;
}

// --- 메인 로직 ---
console.log("🕐 Tempora Clock Synchronization System 🕐");
console.log(`Grand Clock Tower Time: ${grandClockTime}\n`);
console.log("Clock Analysis Results:");

let adjustmentCount = 0;
const results = [];

for (let i = 0; i < townClockTimes.length; i++) {
    const clockTime = townClockTimes[i];
    let diff;
    try {
        diff = timeDifference(clockTime, grandClockTime);
        results.push(diff);
        if (diff !== 0) adjustmentCount++;
        const status = diff > 0 ? `+${diff} minutes (ahead)` : diff < 0 ? `${diff} minutes (behind)` : "0 minutes (synchronized)";
        console.log(`Clock ${i + 1} (${clockTime}): ${status}`);
    } catch (err) {
        results.push(null);
        console.log(`Clock ${i + 1} (${clockTime}): 오류 - ${err.message}`);
    }
}

console.log(`\nSummary: ${adjustmentCount} clocks need adjustment\n`);

// --- 확장 출력: ASCII 시계 시각화 ---
console.log("🏛️ Enhanced Tempora Clock Analysis 🏛️\n");
console.log("🗼 Grand Clock Tower:");
const [gh, gm] = parseTime(grandClockTime);
console.log(asciiClock(gh, gm));
console.log("\n🏘️ Town Clocks:");
for (let i = 0; i < townClockTimes.length; i++) {
    const clockTime = townClockTimes[i];
    let hour, minute, diff;
    try {
        [hour, minute] = parseTime(clockTime);
        diff = results[i];
        console.log(`--- Clock ${i + 1} ---`);
        console.log(asciiClock(hour, minute));
        if (diff !== null) {
            const status = diff > 0 ? `⏰ ${diff} min AHEAD` : diff < 0 ? `⏰ ${-diff} min BEHIND` : "⏰ Synchronized";
            console.log(status);
        }
    } catch {
        console.log(`--- Clock ${i + 1} ---\n오류: 잘못된 시간 형식 (${clockTime})`);
    }
}

// --- 문서화 ---
/*
Tempora Clock Synchronization System
- 대형 시계탑과 마을 시계들의 분(minute) 차이를 계산
- 결과 및 ASCII 시계 시각화 출력
- 잘못된 시간 형식 오류 처리
- 확장 및 유지보수 용이
*/
