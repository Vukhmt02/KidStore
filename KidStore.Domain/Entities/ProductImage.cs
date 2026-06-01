using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Domain.Entities
{
    public class ProductImage
    {

        public int Id { get; set; }

        public int ProductId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public bool IsMain { get; set; }

        public int SortOrder { get; set; }

        public Product? Product { get; set; }
    }
}
