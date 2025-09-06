/*  same imports as before  */
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, createProduct, updateProduct } from "../../api/products";
import { getCategories } from "../../api/categories";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { FiSave } from "react-icons/fi";

export default function ProductForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const qc = useQueryClient();
  const isEdit = !!id;

  const { data: cats } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: editP } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset } = useForm<any>();

  useEffect(() => {
    if (editP) reset({ ...editP.data, removeImages: [] });
  }, [editP, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (d: any) => {
      const fd = new FormData();
      Object.entries(d).forEach(([k, v]) => {
        if (k === "images" && v)
          (v as File[]).forEach((f) => fd.append("images", f));
        else if (k === "removeImages" && v)
          fd.append("removeImages", (v as string[]).join(","));
        else if (k !== "images" && k !== "removeImages") fd.append(k, v as any);
      });
      return isEdit ? updateProduct(id!, fd) : createProduct(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(isEdit ? "Сохранено" : "Создано");
      nav("/products");
    },
  });

  const onSubmit = (d: any) => mutate(d);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-6">
          {isEdit ? "Редактировать товар" : "Новый товар"}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg ring-1 ring-black/5 p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("name")}
              placeholder="Название"
              required
              className="input"
            />
            <input
              {...register("slug")}
              placeholder="Slug"
              required
              className="input"
            />
            <input
              {...register("price")}
              placeholder="Цена"
              type="number"
              step="0.01"
              className="input"
            />
            <select {...register("categoryId")} required className="input">
              <option value="">Выберите категорию</option>
              {cats?.data.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              {...register("widthCm")}
              type="number"
              placeholder="Ширина (см)"
              className="input"
            />
            <input
              {...register("depthCm")}
              type="number"
              placeholder="Глубина (см)"
              className="input"
            />
            <input
              {...register("heightCm")}
              type="number"
              placeholder="Высота (см)"
              className="input"
            />
            <input
              {...register("materials")}
              placeholder="Материалы"
              className="input"
            />
          </div>

          <textarea
            {...register("shortDescription")}
            placeholder="Краткое описание"
            rows={2}
            className="input"
          />
          <textarea
            {...register("fullDescription")}
            placeholder="Полное описание"
            rows={4}
            className="input"
          />

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              {...register("isActive")}
              defaultChecked
              className="w-4 h-4"
            />
            Активен
          </label>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Изображения
            </label>
            <input
              type="file"
              multiple
              {...register("images")}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn w-full inline-flex items-center justify-center gap-2"
          >
            <FiSave />
            {isPending ? "…" : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  );
}
