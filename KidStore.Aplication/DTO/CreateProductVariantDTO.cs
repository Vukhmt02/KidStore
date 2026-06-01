using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Application.DTO
{
    public  class CreateProductVariantDTO
    {
        public int SizeId { get; set; }

        public int ColorId { get; set; }
        public decimal ExtraPrice {  get; set; }

        public int StockQuantity { get; set; }
    }
}
