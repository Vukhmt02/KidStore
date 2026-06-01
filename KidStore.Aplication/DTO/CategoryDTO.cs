using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Application.DTO
{
    public class CreateCategoryDTO
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateCategoryDTO
    {
        public string Name { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }

    public class CategoryResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

       

        public bool IsActive { get; set; }
    }
}
