using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.Entity<Activity>()
            //     .HasOne(e => e.Users)
            //     .WithMany(u => u.Activities)
            //     .HasForeignKey(e => e.UserDisplayName)
            //     .HasPrincipalKey(u => u.DisplayName);

            // modelBuilder.Entity<Activity>()
            //     .HasOne(e => e.Users)
            //     .WithMany(u => u.Activities)
            //     .HasForeignKey(e => e.UsersId)
            //     .HasPrincipalKey(u => u.Id);

            modelBuilder.Entity<AppUser>()
           .HasMany(u => u.Activities)
           .WithMany(a => a.Users)
           .UsingEntity<UserActivity>(
               j => j
                   .HasOne(ua => ua.Activity)
                   .WithMany(a => a.UserActivities)
                   .HasForeignKey(ua => ua.ActivityId),
               j => j
                   .HasOne(ua => ua.User)
                   .WithMany(u => u.UserActivities)
                   .HasForeignKey(ua => ua.UserId),
               j =>
               {
                   j.HasKey(t => new { t.UserId, t.ActivityId });  // Composite key
                   j.ToTable("UserActivities");  // Specify the join table name
               });

        }

    }
}