import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/products';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export default function ProductsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const { mutate: remove } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Удалено');
    },
    onError: () => toast.error('Ошибка удаления'),
  });

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            Товары
          </h1>
          <Link to="new" className="btn inline-flex items-center gap-2">
            <FiPlus />
            <span>Добавить</span>
          </Link>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-black/5 overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-3 md:p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Название</th>
                <th className="p-3 md:p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Цена</th>
                <th className="p-3 md:p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Категория</th>
                <th className="p-3 md:p-4" />
              </tr>
            </thead>
            <tbody>
              {data?.data.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/40 dark:hover:bg-gray-800/40 transition"
                >
                  <td className="p-3 md:p-4 text-gray-800 dark:text-gray-100">{p.name}</td>
                  <td className="p-3 md:p-4 text-gray-500 dark:text-gray-400">{p.price ?? '—'}</td>
                  <td className="p-3 md:p-4 text-gray-500 dark:text-gray-400">{p.categoryId}</td>
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`${p.id}`}
                        className="p-2 rounded-lg bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                        aria-label="Edit"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => remove(p.id)}
                        className="p-2 rounded-lg bg-rose-100/70 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-800 transition"
                        aria-label="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}