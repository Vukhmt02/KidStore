using KidStore.Application.DTO;
using KidStore.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers.Admin;
[ApiController]
[Route("api/admin/categories")]
[Authorize(Roles = "1")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(categories);

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryDTO dto)
    {
        await _categoryService.CreateAsync(dto);

        return Ok(new
        {
            message = "Tạo danh mục thành công"
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCategoryDTO dto)
    {
        await _categoryService.UpdateAsync(id, dto);

        return Ok(new
        {
            message = "Cập nhật danh mục thành công"
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _categoryService.DeleteAsync(id);

        return Ok(new
        {
            message = "Xóa danh mục thành công"
        });
    }
}
