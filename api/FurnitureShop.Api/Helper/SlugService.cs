using Slugify;
using Unidecode.NET;

namespace FurnitureShop.Api.Helper
{
    public static class SlugService
    {
        private static readonly SlugHelper _slugHelper = new SlugHelper();

        public static string GenerateSlug(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;

            // Сначала транслитерация кириллицы в латиницу
            var translit = text.Unidecode();

            // Потом Slugify для нормализации
            return _slugHelper.GenerateSlug(translit);
        }
    }
}
