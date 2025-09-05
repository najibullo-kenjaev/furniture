using System;
using System.Collections.Generic;


namespace FurnitureShop.Api.Entities
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid? ParentId { get; set; }
    }
}