using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<Activity> Activities { get; set; }

        public ICollection<ActivityPosts> ActivityPosts { get; set; }
        public ICollection<UserActivity> UserActivities { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<ChatAppComment> chatAppComments { get; set; }

    }
}