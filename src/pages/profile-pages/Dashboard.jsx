import { useAuthContext } from "../../authContext";
import Button from "../../components/Button";

export default function Dashboard() {
  const dateNow = new Date();
  const currentHour = dateNow.getHours();
  const { user } = useAuthContext();

  const displayName = user?.displayName?.split(" ")[0] || "there";

  function greeting(name) {
    if (currentHour > 5 && currentHour < 13) {
      return `Good morning, ${name}`;
    } else if (currentHour >= 13 && currentHour < 17) {
      return `Good afternoon, ${name}`;
    } else {
      return `Good evening, ${name}`;
    }
  }

  const stats = [
    { label: "Current streak", value: "7 days", detail: "You are on a roll" },
    { label: "Hours studied", value: "12.4h", detail: "This week" },
    { label: "Completed lessons", value: "18", detail: "Across your paths" },
  ];

  const focusAreas = [
    { title: "React fundamentals", progress: "82%" },
    { title: "UI design systems", progress: "64%" },
    { title: "JavaScript practice", progress: "91%" },
  ];

  return (
    <section className="flex-1 h-screen overflow-y-auto bg-background p-section">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-[2rem] border border-[#e8dfcf] bg-[#fffdf8] p-6 shadow-sm sm:p-8">
          <p className="detail text-xs uppercase tracking-[0.3em]">Learning dashboard</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text sm:text-4xl">
                {greeting(displayName)}
              </h1>
              <p className="description mt-3 max-w-2xl">
                You are making steady progress. A short study session today will keep your momentum strong.
              </p>
            </div>

            <div className="rounded-2xl bg-card-background p-4 sm:min-w-[220px]">
              <p className="detail text-sm">Next session</p>
              <p className="mt-1 text-xl font-semibold text-text">React fundamentals</p>
              <p className="detail mt-2">Starts in 45 minutes</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#ece7db] bg-white p-4 shadow-sm">
              <p className="detail text-sm">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-text">{stat.value}</p>
              <p className="detail mt-1">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#ece7db] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="detail">This week</p>
                <h2 className="mt-1">Your learning momentum</h2>
              </div>
              <Button primary classes="text-sm">
                View plan
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              {focusAreas.map((item) => (
                <div key={item.title}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-text">{item.title}</p>
                    <p className="detail text-sm">{item.progress}</p>
                  </div>
                  <div className="h-2 rounded-full bg-[#f0ebdf]">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: item.progress }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#ece7db] bg-[#fffdf8] p-6 shadow-sm">
            <p className="detail">Focus today</p>
            <h2 className="mt-1">Keep building</h2>
            <ul className="mt-5 space-y-3">
              <li className="rounded-xl bg-white p-3 shadow-sm">
                <p className="font-semibold text-text">Finish one lesson</p>
                <p className="detail mt-1">Small steps still count.</p>
              </li>
              <li className="rounded-xl bg-white p-3 shadow-sm">
                <p className="font-semibold text-text">Review your notes</p>
                <p className="detail mt-1">Refresh what you learned yesterday.</p>
              </li>
              <li className="rounded-xl bg-white p-3 shadow-sm">
                <p className="font-semibold text-text">Join a study session</p>
                <p className="detail mt-1">Stay accountable with your peers.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}