public class CreateCategoryDto
{
    public string Name { get; set; }
    public string ParentId { get; set; } 
}

public class UpdateCategoryDto : CreateCategoryDto
{
    public Guid Id { get; set; }
    public bool IsActive { get; set; }
}