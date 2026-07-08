using KidStore.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly NewsService _newsService;

    public NewsController(NewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPublished()
    {
        return Ok(await _newsService.GetPublishedAsync());
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _newsService.GetPublishedBySlugAsync(slug);

        return article == null ? NotFound() : Ok(article);
    }
}
