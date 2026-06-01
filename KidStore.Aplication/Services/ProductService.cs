using KidStore.Application.DTO;
using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KidStore.Application.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _productRepository.GetAllAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task CreateAsync(CreateProductDTO dto)
        {
            var product = new Product
            {
                CategoryId = dto.CategoryId,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                DiscountPrice = dto.DiscountPrice,
                CreatedAt = DateTime.Now,
                IsActive = true,

                Variants = dto.Variants.Select(x => new ProductVariant
                {
                    SizeId = x.SizeId,
                    ColorId = x.ColorId,
                    StockQuantity = x.StockQuantity,
                    
                }).ToList(),

                Images = dto.Images.Select(x => new ProductImage
                {
                    ImageUrl = x.ImageUrl,
                    IsMain = x.IsMain,
                    SortOrder = x.SortOrder
                }).ToList()
            };

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(int id, UpdateProductDTO dto)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
                return false;

            product.CategoryId = dto.CategoryId;
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.DiscountPrice = dto.DiscountPrice;
            product.IsActive = dto.IsActive;
            product.UpdatedAt = DateTime.Now;

            product.Variants.Clear();

            product.Variants = dto.Variants.Select(x => new ProductVariant
            {
                ProductId = product.Id,
                SizeId = x.SizeId,
                ColorId = x.ColorId,
                StockQuantity = x.StockQuantity,
                ExtraPrice = x.ExtraPrice
            }).ToList();

            product.Images.Clear();

            product.Images = dto.Images.Select(x => new ProductImage
            {
                ProductId = product.Id,
                ImageUrl = x.ImageUrl,
                IsMain = x.IsMain,
                SortOrder = x.SortOrder
            }).ToList();

            await _productRepository.UpdateAsync(product);
            await _productRepository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
                return false;

            await _productRepository.DeleteAsync(product);
            await _productRepository.SaveChangesAsync();

            return true;
        }


    }
}
