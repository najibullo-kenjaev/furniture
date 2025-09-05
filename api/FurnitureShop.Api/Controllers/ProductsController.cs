using FurnitureShop.Api.Data;
using FurnitureShop.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FurnitureShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly ImageService _imageService;

        public ProductsController(AppDbContext context, IWebHostEnvironment env, ImageService imageService)
        {
            _context = context;
            _env = env;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Product product, List<IFormFile> images)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            if (images == null || images.Count == 0) return BadRequest("no_files");

            long maxSize = 20 * 1024 * 1024; // 20MB per file
            var root = Path.Combine(_env.ContentRootPath, "uploads", "products", product.Id.ToString());
            Directory.CreateDirectory(root);

            foreach (var f in images)
            {
                if (f.Length == 0 || f.Length > maxSize) continue;

                var id = Guid.NewGuid();
                var ext = Path.GetExtension(f.FileName); // например .jpg/.png
                if (string.IsNullOrWhiteSpace(ext)) ext = ".webp";

                var fname = id + ext;
                var fullPath = Path.Combine(root, fname);

                using var fs = new FileStream(fullPath, FileMode.Create);
                await f.CopyToAsync(fs);
            }

            return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Product productDto, List<IFormFile>? images)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound();

            // обновляем свойства продукта
            existing.Name = productDto.Name;
            existing.Slug = productDto.Slug;
            existing.Price = productDto.Price;
            existing.ShortDescription = productDto.ShortDescription;
            existing.FullDescription = productDto.FullDescription;
            existing.WidthCm = productDto.WidthCm;
            existing.DepthCm = productDto.DepthCm;
            existing.HeightCm = productDto.HeightCm;
            existing.Materials = productDto.Materials;
            existing.CategoryId = productDto.CategoryId;

            await _context.SaveChangesAsync();

            var root = Path.Combine(_env.ContentRootPath, "uploads", "products", existing.Id.ToString());
            Directory.CreateDirectory(root);
            var rootFull = Path.GetFullPath(root) + Path.DirectorySeparatorChar;

            // Удаляем картинки, если фронт прислал removeImages
            if (Request.Form.TryGetValue("removeImages", out var removeVals))
            {
                foreach (var val in removeVals.SelectMany(v => v.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)))
                {
                    var candidate = Path.GetFileName(val);
                    if (string.IsNullOrWhiteSpace(candidate)) continue;

                    var filePath = Path.GetFullPath(Path.Combine(root, candidate));
                    if (filePath.StartsWith(rootFull) && System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
            }

            // Добавляем новые изображения
            if (images != null && images.Count > 0)
            {
                long maxSize = 20 * 1024 * 1024;

                foreach (var f in images)
                {
                    if (f.Length == 0 || f.Length > maxSize) continue;

                    var idImg = Guid.NewGuid();
                    var ext = Path.GetExtension(f.FileName);
                    if (string.IsNullOrWhiteSpace(ext)) ext = ".webp";

                    var fname = idImg + ext;
                    var fullPath = Path.Combine(root, fname);

                    using var fs = new FileStream(fullPath, FileMode.Create);
                    await f.CopyToAsync(fs);
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}