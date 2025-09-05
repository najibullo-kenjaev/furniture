using System;


namespace FurnitureShop.Api.Entities
{
    public class Lead
    {
        public Guid Id { get; set; }= Guid.NewGuid();
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? SubcategoryId { get; set; }
        public Guid? ProductId { get; set; }
        public string Comment { get; set; }
        public string Status { get; set; } = "New"; // New, InProgress, Done
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}