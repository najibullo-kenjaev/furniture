import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCategories, deleteCategory } from '../../api/categories';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiX, FiPlus } from 'react-icons/fi';
import type { Category } from '../../api/categories';

export default function CategoriesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  /* modal */
  const [selected, setSelected] = useState<Category | null>(null);

  /* delete parent or child */
  const { mutate: remove, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Удалено');
    },
    onError: () => toast.error('Не удалось удалить'),
  });

  /* keyboard & overlay */
  useEffect(() => {
    const down = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="max-w-5xl mx-auto">
          {/* header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              Категории
            </h1>
            <Link to="new" className="btn inline-flex items-center gap-2">
              <FiPlus />
              <span>Добавить</span>
            </Link>
          </div>

          {/* table */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-black/5 overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="p-3 md:p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Название</th>
                  <th className="p-3 md:p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Slug</th>
                  <th className="p-3 md:p-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Детей</th>
                  <th className="p-3 md:p-4" />
                </tr>
              </thead>
              <tbody>
                {data?.data.map((cat) => (
                  <tr
                    key={cat.id}
                    onClick={() => setSelected(cat)}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/40 dark:hover:bg-gray-800/40 transition cursor-pointer"
                  >
                    <td className="p-3 md:p-4 text-gray-800 dark:text-gray-100">{cat.name}</td>
                    <td className="p-3 md:p-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{cat.slug}</td>
                    <td className="p-3 md:p-4 text-gray-500 dark:text-gray-400">{cat.children?.length || 0}</td>
                    <td className="p-3 md:p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`${cat.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                          aria-label="Edit"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(cat.id);
                          }}
                          disabled={isPending}
                          className="p-2 rounded-lg bg-rose-100/70 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-800 transition disabled:opacity-50"
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

      {/* ======  CHILDREN MODAL  ====== */}
      <Modal
        show={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || ''}
      >
        {selected?.children?.length ? (
          <div className="space-y-3">
            {selected.children.map((child: Category) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 ring-1 ring-black/5"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{child.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{child.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`${child.id}`}
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                    aria-label="Edit"
                  >
                    <FiEdit2 />
                  </Link>
                  <button
                    onClick={() => {
                      remove(child.id);
                      setSelected({ ...selected, children: selected.children?.filter((c) => c.id !== child.id) });
                    }}
                    disabled={isPending}
                    className="p-2 rounded-lg bg-rose-100/70 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-800 transition disabled:opacity-50"
                    aria-label="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Нет подкатегорий</p>
        )}
      </Modal>
    </>
  );
}

/* ==========  RE-USABLE SLIDE-OVER MODAL  ========== */
function Modal({
  show,
  onClose,
  title,
  children,
}: {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black/30" />

      {/* panel */}
      <div className="relative ml-auto w-full max-w-sm h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/20 transition"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>

        <div className="pt-4 flex justify-end">
          <button onClick={onClose} className="btn">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}