using KidStore.API.Extensions;
using KidStore.Application.DTO;
using KidStore.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<CartResponseDTO>> Get()
        {
            return Ok(await _cartService.GetAsync(User.GetUserId()));
        }

        [HttpPost("items")]
        public async Task<ActionResult<CartResponseDTO>> AddItem(AddCartItemDTO dto)
        {
            return Ok(await _cartService.AddItemAsync(User.GetUserId(), dto));
        }

        [HttpPut("items/{cartItemId:int}")]
        public async Task<ActionResult<CartResponseDTO>> UpdateItem(int cartItemId, UpdateCartItemDTO dto)
        {
            return Ok(await _cartService.UpdateItemAsync(User.GetUserId(), cartItemId, dto));
        }

        [HttpDelete("items/{cartItemId:int}")]
        public async Task<ActionResult<CartResponseDTO>> RemoveItem(int cartItemId)
        {
            return Ok(await _cartService.RemoveItemAsync(User.GetUserId(), cartItemId));
        }
    }
}
