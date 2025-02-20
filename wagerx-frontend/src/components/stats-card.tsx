interface StatsCardProps {
  title: string;
  value: string;
  subValue?: string;
}

export function StatsCard({ title, value, subValue }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-white/5 p-6 backdrop-blur-lg flex flex-col justify-center items-center">
      <div className="text-center">
        <div
          className={`text-3xl font-oxanium text-white ${!subValue &&
            "border-[#F81DFB] border-4 rounded-full p-5 w-[100px]"}`}
        >
          {value}
        </div>
        {subValue &&
          <div className="mt-1 text-sm font-oxanium text-white">
            {subValue}
          </div>}
        <div className="mt-2 text-sm font-oxanium text-white">
          {title}
        </div>
      </div>
    </div>
  );
}
