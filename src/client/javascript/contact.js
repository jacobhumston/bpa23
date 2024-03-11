window.addEventListener('DOMContentLoaded', async function () {
    /**
     * Represents a reservation time.
     * @typedef {Object} ReservationTime
     * @property {string} timeStart The start time of the reservation.
     * @property {string} timeEnd The end time of the reservation.
     */

    /**
     * Represents reservation data.
     * @typedef {Object} Reservation
     * @property {number} year The year of the reservation.
     * @property {number} month The month of the reservation.
     * @property {number} day The day of the reservation.
     * @property {Array<ReservationTime>} times Array of reservation times.
     */

    /**
     * An array containing reservation data.
     * @type {Array<Reservation>}
     */
    const reservations = await (await fetch('/data/reservations.json')).json();
    const calender = document.getElementById('calender');
    const mobileCalender = document.getElementById('mobileCalender');
    const dayWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    /**
     * Get the week name of the current day.
     * @param {number} year
     * @param {number} month
     * @param {number} day
     * @returns {string}
     */
    function getDaysWeekName(year, month, day) {
        return new Date(year, month, day).toLocaleDateString('us-en', { weekday: 'long' });
    }

    /**
     * Update the calender.
     * @param {number} [year] The full year.
     * @param {number} [month] The month.
     */
    function updateCalender(year, month) {
        year = year ?? new Date().getFullYear();
        month = month ?? new Date().getMonth() + 1;
        let days = new Date(year, month, 0).getDate();

        calender.innerHTML = '';
        mobileCalender.innerHTML = '';

        // Computer calender controls.
        const calenderControls = document.createElement('div');
        calenderControls.id = 'calenderControls';
        calender.insertAdjacentElement('afterbegin', calenderControls);

        // Mobile calender controls.
        const mobileCalenderControls = document.createElement('div');
        mobileCalenderControls.id = 'mobileCalenderControls';
        mobileCalender.insertAdjacentElement('afterbegin', mobileCalenderControls);

        // Computer previous month.
        const previousMonthButton = document.createElement('button');
        previousMonthButton.id = 'calenderControlsPreviousMonth';
        previousMonthButton.innerText = 'Previous';
        calenderControls.insertAdjacentElement('beforeend', previousMonthButton);

        // Mobile previous month.
        const mobilePreviousMonthButton = document.createElement('button');
        mobilePreviousMonthButton.id = 'mobileCalenderControlsPreviousMonth';
        mobilePreviousMonthButton.innerText = 'Previous';
        mobileCalenderControls.insertAdjacentElement('beforeend', mobilePreviousMonthButton);

        // Computer current month.
        const currentMonthText = document.createElement('p');
        currentMonthText.id = 'calenderControlsCurrentMonthText';
        calenderControls.insertAdjacentElement('beforeend', currentMonthText);

        // Mobile current month.
        const mobileCurrentMonthText = document.createElement('p');
        mobileCurrentMonthText.id = 'mobileCalenderControlsCurrentMonthText';
        mobileCalenderControls.insertAdjacentElement('beforeend', mobileCurrentMonthText);

        // Computer next month.
        const nextMonthButton = document.createElement('button');
        nextMonthButton.id = 'calenderControlsNextMonth';
        nextMonthButton.innerText = 'Next';
        calenderControls.insertAdjacentElement('beforeend', nextMonthButton);

        // Mobile next month.
        const mobileNextMonthButton = document.createElement('button');
        mobileNextMonthButton.id = 'mobileCalenderControlsNextMonth';
        mobileNextMonthButton.innerText = 'Next';
        mobileCalenderControls.insertAdjacentElement('beforeend', mobileNextMonthButton);

        currentMonthText.innerText = `${new Date(year, month - 1, 1).toLocaleDateString('us-en', { month: 'long' })} ${year}`;
        mobileCurrentMonthText.innerText = currentMonthText.innerText;

        const previousMonthFunction = function () {
            if (month - 1 === 0) {
                updateCalender(year - 1, 12);
            } else {
                updateCalender(year, month - 1);
            }
        };

        const nextMonthFunction = function () {
            if (month + 1 === 13) {
                updateCalender(year + 1, 1);
            } else {
                updateCalender(year, month + 1);
            }
        };

        previousMonthButton.addEventListener('click', previousMonthFunction);
        mobilePreviousMonthButton.addEventListener('click', previousMonthFunction);
        nextMonthButton.addEventListener('click', nextMonthFunction);
        mobileNextMonthButton.addEventListener('click', nextMonthFunction);

        for (const day of dayWeekNames) {
            const dayNameElement = document.createElement('p');
            dayNameElement.classList.add('calenderDayName');
            dayNameElement.innerText = day;
            calender.insertAdjacentElement('beforeend', dayNameElement);
        }

        if (getDaysWeekName(year, month - 1, 1) !== 'Sunday') {
            const currentIndex = dayWeekNames.findIndex((value) => value == getDaysWeekName(year, month - 1, 1));
            for (let index = currentIndex; index !== 0; index--) {
                const ghostDay = document.createElement('div');
                ghostDay.classList.add('calenderGhostDays');
                calender.insertAdjacentElement('beforeend', ghostDay);
            }
        }

        for (let day = 1; day <= days; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calenderDay');
            calender.insertAdjacentElement('beforeend', dayElement);

            const dayText = document.createElement('p');
            dayText.classList.add('calenderDayText');
            dayText.innerText = day;
            dayElement.insertAdjacentElement('afterbegin', dayText);

            const dayReservationsText = document.createElement('p');
            dayReservationsText.classList.add('calenderDayReservationsText');
            dayElement.insertAdjacentElement('beforeend', dayReservationsText);

            for (const reservation of reservations) {
                if (reservation.year === year && reservation.month === month && reservation.day === day) {
                    dayReservationsText.innerHTML = reservation.times
                        .map((time) => `${time.timeStart} - ${time.timeEnd}`)
                        .join('<br>');
                }
                mobileCalender.insertAdjacentText("beforeend", reservation)
            }

            if (dayReservationsText.innerText === '') {
                // dayReservationsText.innerText = '';
                dayReservationsText.classList.add('calenderDayReservationsTextNoReservations');
            }

            if (getDaysWeekName(year, month - 1, day) === 'Saturday') {
                const calenderBreak = document.createElement('div');
                calenderBreak.classList.add('calenderBreak');
                calender.insertAdjacentElement('beforeend', calenderBreak);
            }
        }
    }

    updateCalender();
});
