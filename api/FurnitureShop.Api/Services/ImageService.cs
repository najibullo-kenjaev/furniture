using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;


public class ImageService
{
    public async Task SaveResizedAsync(Stream input, string outPath, int width)
    {
        input.Position = 0;
        using var image = await Image.LoadAsync(input);
        var ratio = (double)width / image.Width;
        var height = (int)(image.Height * ratio);
        image.Mutate(x => x.Resize(width, height));
        await image.SaveAsync(outPath, new WebpEncoder());
    }
}