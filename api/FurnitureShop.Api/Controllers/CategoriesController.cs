using FurnitureShop.Api.Dtos;
using FurnitureShop.Api.Entities;
using FurnitureShop.Api.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories.ToListAsync();

            // сначала берем только "корневые" (без ParentId)
            var rootCategories = categories
                .Where(c => c.ParentId == null)
                .Select(c => MapToTree(c, categories))
                .ToList();

            return Ok(rootCategories);
        }

        

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var categories = await _context.Categories.ToListAsync();

            var category = categories.FirstOrDefault(c => c.Id == id);
            if (category == null) return NotFound();

            var result = MapToTree(category, categories);

            return Ok(result);
        }
        private CategoryTreeDto MapToTree(Category category, List<Category> allCategories)
        {
            return new CategoryTreeDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                IsActive = category.IsActive,
                Children = allCategories
                    .Where(c => c.ParentId == category.Id)
                    .Select(c => MapToTree(c, allCategories))
                    .ToList()
            };
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name,
                Slug = SlugService.GenerateSlug(categoryDto.Name),
                ParentId = categoryDto.ParentId
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto categoryDto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = categoryDto.Name;
            category.Slug = SlugService.GenerateSlug(categoryDto.Name); 
            category.ParentId = categoryDto.ParentId;
            category.IsActive = categoryDto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(category);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}