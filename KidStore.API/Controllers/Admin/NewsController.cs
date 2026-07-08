using KidStore.Application.DTO;
using KidStore.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers.Admin;

[ApiController]
[Route("api/admin/news")]
[Authorize(Roles = "1")]
public class AdminNewsController : ControllerBase
{
    private readonly NewsService _newsService;

    public AdminNewsController(NewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _newsService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var article = await _newsService.GetByIdAsync(id);

        return article == null ? NotFound() : Ok(article);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateNewsArticleDTO dto)
    {
        var article = await _newsService.CreateAsync(dto);

        return Ok(article);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateNewsArticleDTO dto)
    {
        var article = await _newsService.UpdateAsync(id, dto);

        return Ok(article);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _newsService.DeleteAsync(id);

        return Ok(new
        {
            message = "Xóa tin tức thành công"
        });
    }
}
