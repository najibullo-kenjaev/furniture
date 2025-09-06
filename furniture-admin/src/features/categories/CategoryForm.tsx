import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories, getCategory, createCategory, updateCategory } from '../../api/categories';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

type Inputs = { name: string; parentId: string | null; isActive: boolean };

export default function CategoryForm() {
  const nav      = useNavigate();
  const { id }   = useParams();
  const qc       = useQueryClient();
  const isEdit   = !!id;

  const { data: cats } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: editCat } = useQuery({
    queryKey: ['category', id],
    queryFn:  () => getCategory(id!),
    enabled:  isEdit,
  });

  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    if (editCat) reset({ ...editCat.data, parentId: editCat.data.parentId ?? '' });
  }, [editCat, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (d: Inputs) => (isEdit ? updateCategory({ ...d, id: id! }) : createCategory(d)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success(isEdit ? 'Сохранено' : 'Создано');
      nav('/categories');
    },
  });

  const onSubmit = (d: Inputs) => mutate(d);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-6">
          {isEdit ? 'Редактировать категорию' : 'Новая категория'}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-black/5 p-6 space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Название</label>
            <input
              {...register('name', { required: true })}
              placeholder="Название"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Родитель</label>
            <select {...register('parentId')} className="input">
              <option value="">Без родителя</option>
              {cats?.data
                .filter((c) => c.id !== id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" {...register('isActive')} className="w-4 h-4" />
            Активна
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="btn w-full"
          >
            {isPending ? '…' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  );
}