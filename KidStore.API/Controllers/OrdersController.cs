using KidStore.API.Extensions;
using KidStore.Application.DTO;
using KidStore.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KidStore.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<OrderResponseDTO>> Create(CreateOrderDTO dto)
        {
            var order = await _orderService.CreateFromCartAsync(User.GetUserId(), dto);

            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderResponseDTO>>> GetMine()
        {
            return Ok(await _orderService.GetMyOrdersAsync(User.GetUserId()));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<OrderResponseDTO>> GetById(int id)
        {
            return Ok(await _orderService.GetMyOrderByIdAsync(User.GetUserId(), id));
        }
    }
}
