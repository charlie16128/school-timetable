document.addEventListener("DOMContentLoaded", function() {
    const currentTimeDiv = document.querySelector(".current-time");
    const nextClassDiv = document.querySelector(".next-class");

    const timetable = [
        ["08:10", "09:00"],
        ["09:10", "10:00"],
        ["10:10", "11:00"],
        ["11:10", "12:00"],
        ["13:10", "14:00"],
        ["14:10", "15:00"],
        ["15:10", "16:00"],
        ["16:10", "17:00"],
        ["19:10", "20:00"],
        ["20:10", "21:00"]
    ];

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function updateCurrentTime() {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        currentTimeDiv.textContent = `現在時間：${getCurrentTime()}`;

        let nextClassFound = false;

        // Reset all cells
        document.querySelectorAll('tbody td').forEach(td => {
            td.classList.remove('past', 'current');
            td.innerHTML = td.innerHTML.replace(/<div class="progress">.*<\/div>/, '');
        });

        // Loop through today's classes
        for (let i = 0; i < timetable.length; i++) {
            const [start, end] = timetable[i];
            const [startHour, startMinute] = start.split(":").map(Number);
            const [endHour, endMinute] = end.split(":").map(Number);

            const startTime = new Date(now);
            startTime.setHours(startHour, startMinute, 0);

            const endTime = new Date(now);
            endTime.setHours(endHour, endMinute, 0);

            const cell = document.querySelector(`tbody tr:nth-child(${i + 1}) td:nth-child(${currentDay})`);

            if (now >= startTime && now <= endTime) {
                // Current class
                const elapsedMinutes = (hours * 60 + minutes) - (startHour * 60 + startMinute);
                const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                const progressHeight = (elapsedMinutes / totalMinutes) * 100;

                cell.classList.add("current");

                const progressDiv = document.createElement("div");
                progressDiv.classList.add("progress");
                progressDiv.style.height = `${progressHeight}%`;
                cell.appendChild(progressDiv);

                nextClassFound = true;
            } else if (now > endTime) {
                // Past class
                cell.classList.add("past");
            }
        }

        // Determine the next class
        if (!nextClassFound) {
            let nextClassTime = null;
            for (let i = 0; i < timetable.length; i++) {
                const [start] = timetable[i];
                const [startHour, startMinute] = start.split(":").map(Number);
                if (hours < startHour || (hours === startHour && minutes < startMinute)) {
                    nextClassTime = timetable[i];
                    break;
                }
            }
            nextClassDiv.textContent = nextClassTime ? `下一節課：${nextClassTime[0]}開始` : "今天沒有更多的課了";
        }
    }

    updateCurrentTime();
    setInterval(updateCurrentTime, 60000); // 每分鐘更新一次
});
