using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KidStore.Domain.Entities;

namespace KidStore.Application.DTO
{
    internal class PagedResult
    {
        public List<Product> Items { get; set; } = new();
        public int Page {  get; set; }
        public int PageSize {  get; set; }
        public int TotalItems { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);
    }
}
