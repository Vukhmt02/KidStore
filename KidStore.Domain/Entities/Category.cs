using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
// Navigation
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
