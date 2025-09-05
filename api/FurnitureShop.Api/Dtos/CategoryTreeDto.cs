namespace FurnitureShop.Api.Dtos
{
    public class CategoryTreeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool IsActive { get; set; }
        public List<CategoryTreeDto> Children { get; set; } = new();
    }

}
