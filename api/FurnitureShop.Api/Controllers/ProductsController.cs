using FurnitureShop.Api.Dtos;
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

        public ProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products.ToListAsync();

            var result = products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Slug,
                p.Price,
                p.ShortDescription,
                p.FullDescription,
                p.WidthCm,
                p.DepthCm,
                p.HeightCm,
                p.Materials,
                p.IsActive,
                p.CreatedAt,
                p.CategoryId,
                Images = GetProductImages(p.Id)
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            var result = new
            {
                product.Id,
                product.Name,
                product.Slug,
                product.Price,
                product.ShortDescription,
                product.FullDescription,
                product.WidthCm,
                product.DepthCm,
                product.HeightCm,
                product.Materials,
                product.IsActive,
                product.CreatedAt,
                product.CategoryId,
                Images = GetProductImages(product.Id)
            };

            return Ok(result);
        }

        private List<string> GetProductImages(Guid productId)
        {
            var root = Path.Combine(_env.ContentRootPath, "uploads", "products", productId.ToString());
            if (!Directory.Exists(root)) return new List<string>();

            var files = Directory.GetFiles(root);
            var baseUrl = $"{Request.Scheme}://{Request.Host}/uploads/products/{productId}/";

            return files
                .Select(f => baseUrl + Path.GetFileName(f))
                .ToList();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateProductDto createProductDto, List<IFormFile> images)
        {
            var product = new Product
            {
                Name = createProductDto.Name,
                Slug = createProductDto.Slug,
                Price = createProductDto.Price,
                ShortDescription = createProductDto.ShortDescription,
                FullDescription = createProductDto.FullDescription,
                WidthCm = createProductDto.WidthCm,
                DepthCm = createProductDto.DepthCm,
                HeightCm = createProductDto.HeightCm,
                Materials = createProductDto.Materials,
                CategoryId = createProductDto.CategoryId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
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

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, createProductDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDto updateProductDto, List<IFormFile>? images)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = updateProductDto.Name;
            existing.Slug = updateProductDto.Slug;
            existing.Price = updateProductDto.Price;
            existing.ShortDescription = updateProductDto.ShortDescription;
            existing.FullDescription = updateProductDto.FullDescription;
            existing.WidthCm = updateProductDto.WidthCm;
            existing.DepthCm = updateProductDto.DepthCm;
            existing.HeightCm = updateProductDto.HeightCm;
            existing.Materials = updateProductDto.Materials;
            existing.CategoryId = updateProductDto.CategoryId;

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