using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Application.DTO
{
    public class CreateProductDTO
    {
        public int CategoryId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public decimal? DiscountPrice { get; set; }

        public List<CreateProductVariantDTO> Variants { get; set; }
            = new();

        public List<CreateProductImageDTO> Images { get; set; }
            = new();

    }
}
