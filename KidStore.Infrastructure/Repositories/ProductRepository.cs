
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KidStore.Domain.Entities;
using KidStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using KidStore.Application.Interfaces;
using KidStore.Application.DTO;

namespace KidStore.Infrastructure.Repositories;

    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(x => x.Category)
                .Include(x => x.Variants)
                    .ThenInclude(x => x.Size)
                .Include(x => x.Variants)
                    .ThenInclude(x => x.Color)
                .Include(x => x.Images)
                .ToListAsync();
        }

        public async Task<(List<Product> Items, int TotalItems)> GetPublicPagedAsync(ProductQueryDTO query)
        {
            var page = Math.Max(query.Page, 1);
            var pageSize = Math.Clamp(query.PageSize, 1, 60);
            var productsQuery = _context.Products
                .AsNoTracking()
                .Where(product => product.IsActive && product.Category != null && product.Category.IsActive);

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.Trim();
                productsQuery = productsQuery.Where(product =>
                    product.Name.Contains(search) ||
                    (product.Description != null && product.Description.Contains(search)));
            }

            if (query.CategoryId.HasValue && query.CategoryId.Value > 0)
            {
                productsQuery = productsQuery.Where(product => product.CategoryId == query.CategoryId.Value);
            }

            productsQuery = query.Sort switch
            {
                "price-asc" => productsQuery.OrderBy(product => product.Price),
                "price-desc" => productsQuery.OrderByDescending(product => product.Price),
                _ => productsQuery.OrderByDescending(product => product.CreatedAt).ThenByDescending(product => product.Id)
            };

            var totalItems = await productsQuery.CountAsync();
            var items = await productsQuery
                .Include(x => x.Category)
                .Include(x => x.Variants)
                    .ThenInclude(x => x.Size)
                .Include(x => x.Variants)
                    .ThenInclude(x => x.Color)
                .Include(x => x.Images)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalItems);
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(x => x.Category)
                .Include(x => x.Variants)
                    .ThenInclude(x => x.Size)
                .Include(x => x.Variants)
                    .ThenInclude(x => x.Color)
                .Include(x => x.Images)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);

            await Task.CompletedTask;
        }

        public async Task DeleteAsync(Product product)
        {
            _context.Products.Remove(product);

            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }


