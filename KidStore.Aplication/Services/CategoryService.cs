using KidStore.Application.DTO;
using KidStore.Application.Interfaces;
using KidStore.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using KidStore.Domain.Exceptions;

namespace KidStore.Application.Services
{
    public class CategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _categoryRepository.GetAllAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _categoryRepository.GetByIdAsync(id);
        }

        public async Task CreateAsync(CreateCategoryDTO dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                
                IsActive = true
            };

            await _categoryRepository.CreateAsync(category);
        }

        public async Task UpdateAsync(int id, UpdateCategoryDTO dto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new NotFoundException("Danh mục", id);

            category.Name = dto.Name;
            
            category.IsActive = dto.IsActive;

            await _categoryRepository.UpdateAsync(category);
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                throw new NotFoundException("Danh mục", id);

            await _categoryRepository.DeleteAsync(category);
        }
    }
}
