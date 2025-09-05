using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/files")]
public class FilesController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    public FilesController(IWebHostEnvironment env) { _env = env; }

    [HttpPost("product/{productId}")]
    public async Task<IActionResult> UploadProductImages(Guid productId, List<IFormFile> files)
    {
        if (files == null || files.Count == 0) return BadRequest("no_files");
        long maxSize = 20 * 1024 * 1024; // 20MB per file limit in code
        var root = Path.Combine(_env.ContentRootPath, "uploads", "products", productId.ToString());
        Directory.CreateDirectory(root);
        var saved = new List<object>();
        foreach (var f in files)
        {
            if (f.Length == 0 || f.Length > maxSize) continue;
            var id = Guid.NewGuid();
            var fname = id + ".webp";
            var fullLarge = Path.Combine(root, "large_" + fname);
            var fullMedium = Path.Combine(root, "med_" + fname);
            var fullThumb = Path.Combine(root, "thumb_" + fname);


            using var ms = new MemoryStream();
            await f.CopyToAsync(ms);
            ms.Position = 0;

            saved.Add(new { file = fname });
        }
        return Ok(saved);
    }
}