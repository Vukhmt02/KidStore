using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Application.DTO
{
    
        public class UpdateProductImageDTO
        {
            public int? Id { get; set; }
            

            public string ImageUrl { get; set; } = string.Empty;
            public int SortOrder { get; set; }
            public bool IsMain { get; set; }
        }
    
}
