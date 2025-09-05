using System;
using System.Collections.Generic;


namespace FurnitureShop.Api.Entities
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid? ParentId { get; set; }
    }
}