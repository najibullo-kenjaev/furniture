using FurnitureShop.Api.Entities;

namespace FurnitureShop.Api.Dtos
{
    public class CreateProductDto
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public decimal? Price { get; set; }
        public string ShortDescription { get; set; }
        public string FullDescription { get; set; }
        public int? WidthCm { get; set; }
        public int? DepthCm { get; set; }
        public int? HeightCm { get; set; }
        public string Materials { get; set; }
        public Guid CategoryId { get; set; }
    }

    public class UpdateProductDto : CreateProductDto
    {
        public Guid Id { get; set; }
        public bool IsActive { get; set; }
    }
}
