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

        public async Task<List<ProductResponseDTO>> GetAllAsync()
        {
            var products = await _productRepository.GetAllAsync();

            return products.Select(MapProduct).ToList();
        }

        public async Task<ProductResponseDTO?> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            return product == null ? null : MapProduct(product);
        }

        public async Task<List<ProductResponseDTO>> GetPublicProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();

            return products
                .Where(product => product.IsActive && product.Category?.IsActive != false)
                .Select(MapProduct)
                .ToList();
        }

        public async Task<PagedResultDTO<ProductResponseDTO>> GetPublicProductsAsync(ProductQueryDTO query)
        {
            var page = Math.Max(query.Page, 1);
            var pageSize = Math.Clamp(query.PageSize, 1, 60);
            query.Page = page;
            query.PageSize = pageSize;

            var (items, totalItems) = await _productRepository.GetPublicPagedAsync(query);

            return new PagedResultDTO<ProductResponseDTO>
            {
                Items = items.Select(MapProduct).ToList(),
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };
        }

        public async Task<ProductResponseDTO?> GetPublicProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            return product == null || !product.IsActive || product.Category?.IsActive == false
                ? null
                : MapProduct(product);
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
                    ExtraPrice = x.ExtraPrice
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

        private static ProductResponseDTO MapProduct(Product product)
        {
            return new ProductResponseDTO
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                Variants = product.Variants.Select(variant => new ProductVariantResponseDTO
                {
                    Id = variant.Id,
                    SizeId = variant.SizeId,
                    SizeName = variant.Size?.Name,
                    ColorId = variant.ColorId,
                    ColorName = variant.Color?.Name,
                    StockQuantity = variant.StockQuantity,
                    ExtraPrice = variant.ExtraPrice
                }).ToList(),
                Images = product.Images.Select(image => new ProductImageResponseDTO
                {
                    Id = image.Id,
                    ImageUrl = image.ImageUrl,
                    IsMain = image.IsMain,
                    SortOrder = image.SortOrder
                }).ToList()
            };
        }

    }
}
