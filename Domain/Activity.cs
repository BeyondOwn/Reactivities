
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class Activity
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public string CreatorDisplayName { get; set; }
        public string CreatorId { get; set; }
        public AppUser? Users { get; set; }

        public ICollection<ActivityPosts>? ActivityPosts { get; set; }

        public ICollection<UserActivity>? UserActivities { get; set; } = new List<UserActivity>();

    }
}