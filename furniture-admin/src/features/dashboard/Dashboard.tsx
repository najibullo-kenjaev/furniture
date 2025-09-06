import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/products';
import { getCategories } from '../../api/categories';
// import { getLeads } from '../../api/leads';

export default function Dashboard() {
  const { data: prod }  = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const { data: cat }   = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  // const { data: leads } = useQuery({ queryKey: ['leads'], queryFn: getLeads });

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-8">
          Дашборд
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Товары" value={prod?.data.length ?? 0} />
          <StatCard title="Категории" value={cat?.data.length ?? 0} />
          {/* <StatCard title="Заявки" value={leads?.data.length ?? 0} /> */}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="relative group bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg ring-1 ring-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mt-2">
        {value}
      </div>
    </div>
  );
}