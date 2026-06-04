using Microsoft.EntityFrameworkCore;
using KidStore.Domain.Entities;

namespace KidStore.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(x => x.Price).HasPrecision(18, 2);
                entity.Property(x => x.DiscountPrice).HasPrecision(18, 2);
            });

            modelBuilder.Entity<ProductVariant>()
                .Property(x => x.ExtraPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(x => x.Subtotal).HasPrecision(18, 2);
                entity.Property(x => x.ShippingFee).HasPrecision(18, 2);
                entity.Property(x => x.TotalPrice).HasPrecision(18, 2);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.Property(x => x.UnitPrice).HasPrecision(18, 2);
                entity.Property(x => x.LineTotal).HasPrecision(18, 2);
            });

            modelBuilder.Entity<Cart>()
                .HasIndex(x => x.UserId)
                .IsUnique();

            modelBuilder.Entity<CartItem>()
                .HasIndex(x => new { x.CartId, x.ProductVariantId })
                .IsUnique();

            modelBuilder.Entity<CartItem>()
                .HasOne(x => x.ProductVariant)
                .WithMany(x => x.CartItems)
                .HasForeignKey(x => x.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne(x => x.ProductVariant)
                .WithMany(x => x.OrderItems)
                .HasForeignKey(x => x.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
