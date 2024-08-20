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

            modelBuilder.Entity<Activity>()
                .HasOne(e => e.Users)
                .WithMany(u => u.Activities)
                .HasForeignKey(e => e.CreatorDisplayName)
                .HasPrincipalKey(u => u.DisplayName);

            modelBuilder.Entity<Activity>()
                .HasOne(e => e.Users)
                .WithMany(u => u.Activities)
                .HasForeignKey(e => e.CreatorId)
                .HasPrincipalKey(u => u.Id);

            //Primary key of joint table
            modelBuilder.Entity<UserActivity>(x => x.HasKey(aa => new { aa.UserId, aa.ActivityId }));

            modelBuilder.Entity<UserActivity>()
            .HasOne(u => u.User)
            .WithMany(a => a.UserActivities)
            .HasForeignKey(aa => aa.UserId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<UserActivity>()
           .HasOne(u => u.User)
           .WithMany(a => a.UserActivities)
           .HasForeignKey(aa => aa.DisplayName)
           .HasPrincipalKey(u => u.DisplayName)
           .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<UserActivity>()
            .HasOne(u => u.Activity)
            .WithMany(a => a.UserActivities)
            .HasForeignKey(a => a.ActivityId)
            .OnDelete(DeleteBehavior.NoAction);

        }

    }
}