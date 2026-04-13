import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CustomerCalendar({ customers }) {

  const getTileContent = ({ date }) => {
    const d = date.toISOString().split("T")[0];

    const match = customers.find(c => c.followup_date === d);

    if (match) {
      return <div className="text-xs text-red-500">🔔</div>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-5">
      <h2 className="font-bold mb-3">📅 Follow-up Calendar</h2>

      <Calendar tileContent={getTileContent} />
    </div>
  );
}