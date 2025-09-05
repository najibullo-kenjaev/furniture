using FluentValidation;


public class CreateCategoryDtoValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug).NotEmpty().Matches(@"^[a-z0-9\-]+$").WithMessage("Slug must be lowercase latin and dashes");
    }
}