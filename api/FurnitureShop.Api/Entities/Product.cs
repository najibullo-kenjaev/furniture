using System;
using System.Collections.Generic;


namespace FurnitureShop.Api.Entities
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public decimal? Price { get; set; }
        public string ShortDescription { get; set; }
        public string FullDescription { get; set; }
        public int? WidthCm { get; set; }
        public int? DepthCm { get; set; }
        public int? HeightCm { get; set; }
        public string Materials { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
    }
}