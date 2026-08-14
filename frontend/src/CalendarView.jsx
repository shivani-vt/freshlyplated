import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CalendarView.css";

function CalendarView() {
  const [contentItems, setContentItems] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/content-items")
      .then((res) => res.json())
      .then((data) => {
        setContentItems(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        setLoading(false);
      });
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to format date string as YYYY-MM-DD
  const formatDayString = (dayNum) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(dayNum).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Find events matching a specific day
  const getEventsForDay = (dayNum) => {
    const dateStr = formatDayString(dayNum);
    const events = [];

    contentItems.forEach((item) => {
      if (item.cook_date && item.cook_date.startsWith(dateStr)) {
        events.push({ type: "cook", title: `🍳 Cook: ${item.recipe_name}`, item });
      }
      if (item.edit_deadline && item.edit_deadline.startsWith(dateStr)) {
        events.push({ type: "edit", title: `🎬 Edit: ${item.recipe_name}`, item });
      }
      if (item.upload_date && item.upload_date.startsWith(dateStr)) {
        events.push({ type: "upload", title: `📤 Upload: ${item.recipe_name}`, item });
      }
    });

    return events;
  };

  const calendarCells = [];
  // Empty slots before the 1st day of month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="calendar-day empty" />);
  }

  // Days of the month
  const todayStr = new Date().toISOString().split("T")[0];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDayString(day);
    const dayEvents = getEventsForDay(day);
    const isToday = dateStr === todayStr;

    calendarCells.push(
      <div key={day} className={`calendar-day ${isToday ? "today" : ""}`}>
        <div className="day-number">{day}</div>
        <div className="day-events">
          {dayEvents.map((ev, index) => (
            <Link
              key={index}
              to={`/content-items/${ev.item.id}/edit`}
              className={`event-badge ${ev.type}`}
              title={`${ev.title} (${ev.item.platform})`}
            >
              {ev.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-view-container">
      <div className="calendar-header">
        <div>
          <h1>Content Schedule</h1>
          <p>Plan filming sessions, editing deadlines, and platform uploads.</p>
        </div>

        <div className="calendar-controls">
          <button onClick={prevMonth} className="btn-cal-nav">←</button>
          <button onClick={todayMonth} className="btn-cal-today">Today</button>
          <button onClick={nextMonth} className="btn-cal-nav">→</button>
          <h2>{monthNames[month]} {year}</h2>
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <span className="legend-item"><span className="dot cook"></span> Cook Day</span>
        <span className="legend-item"><span className="dot edit"></span> Edit Deadline</span>
        <span className="legend-item"><span className="dot upload"></span> Upload Day</span>
      </div>

      {/* Weekday Names */}
      <div className="weekdays-grid">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      {/* Month Days Grid */}
      <div className="days-grid">
        {calendarCells}
      </div>
    </div>
  );
}

export default CalendarView;