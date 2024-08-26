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

        public DbSet<ActivityPosts> ActivityPosts { get; set; }
        public DbSet<Photo> Photos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ActivityPosts>(x => x.HasKey(aa => aa.Id));

            // Optional: Create a unique index to enforce uniqueness on Id + ActivityId
            modelBuilder.Entity<ActivityPosts>(x => x.HasIndex(aa => new { aa.Id, aa.ActivityId }).IsUnique());

            modelBuilder.Entity<ActivityPosts>(x => x.Property(aa => aa.Id).ValueGeneratedOnAdd());

            modelBuilder.Entity<ActivityPosts>(x => x.Property(aa => aa.Content).HasColumnType("TEXT"));

            modelBuilder.Entity<ActivityPosts>()
               .HasOne(p => p.ParentPost)
               .WithMany(p => p.Replies)
               .HasForeignKey(p => p.ParentPostId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ActivityPosts>()
               .HasOne(e => e.Activity)
               .WithMany(u => u.ActivityPosts)
               .HasForeignKey(e => e.ActivityId)
               .HasPrincipalKey(u => u.Id)
               .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ActivityPosts>()
                .HasOne(e => e.Users)
                .WithMany(u => u.ActivityPosts)
                .HasForeignKey(e => e.CreatorId)
                .HasPrincipalKey(u => u.Id)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ActivityPosts>()
                .HasOne(e => e.Users)
                .WithMany(u => u.ActivityPosts)
                .HasForeignKey(e => e.CreatorDisplayName)
                .HasPrincipalKey(u => u.DisplayName)
                .OnDelete(DeleteBehavior.NoAction);

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
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<UserActivity>()
           .HasOne(u => u.User)
           .WithMany(a => a.UserActivities)
           .HasForeignKey(u => u.DisplayName)
           .HasPrincipalKey(u => u.DisplayName)
           .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<UserActivity>()
            .HasOne(u => u.Activity)
            .WithMany(a => a.UserActivities)
            .HasForeignKey(u => u.ActivityId)
            .OnDelete(DeleteBehavior.NoAction);

        }

    }
}