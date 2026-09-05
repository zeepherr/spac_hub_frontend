function CategoryStats({ stats }) {
  return (
    <div className="mb-5 grid max-w-162.5 grid-cols-3 gap-4">
      <StatCard number={stats.total} title="Total categories" />
      <StatCard number={stats.active} title="Active" />
      <StatCard number={stats.disabled} title="Disabled" />
    </div>
  );
}

function StatCard({ number, title }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-2xl font-bold text-gray-900">{number}</p>
      <p className="mt-1 text-xs text-gray-500">{title}</p>
    </div>
  );
}

export default CategoryStats;