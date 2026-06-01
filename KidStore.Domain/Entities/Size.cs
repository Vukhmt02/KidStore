using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Domain.Entities
{
    public class Size
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
    }
}
