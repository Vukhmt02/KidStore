using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Application.DTO
{
    
        public class UpdateProductDTO
        {
            public string Name { get; set; } = string.Empty;

            public string? Description { get; set; }

            public decimal Price { get; set; }
            public bool IsActive { get; set; } 
            public int CategoryId { get; set; }
            public decimal? DiscountPrice { get; set; }

            public List<UpdateProductImageDTO> Images { get; set; } = new();

            public List<UpdateProductVariantDTO> Variants { get; set; } = new();
        }
    
}
