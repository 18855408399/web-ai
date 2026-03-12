export default function CreditInfo({ credit }: { credit: string }) {
  return (
    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
      {credit && credit !== "" ? (
        <p className="text-xs text-white/80 flex items-center gap-1.5">
          <span className="font-bold text-white">{credit}</span>
          <span>credits</span>
        </p>
      ) : (
        <p className="text-xs text-white/50">Sign in to start</p>
      )}
    </div>
  );
}