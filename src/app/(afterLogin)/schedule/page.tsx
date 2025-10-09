import Calendar from "./_components/calendar";
import SideSection from "./_components/sideSection";

export default function SchedulePage() {
    return (
      <div className="flex flex-row gap-5 h-full mt-16 pb-14"> 
        <div className="flex-2/3"> 
          <Calendar />
        </div>
        <SideSection />
      </div>
    );
  }
  