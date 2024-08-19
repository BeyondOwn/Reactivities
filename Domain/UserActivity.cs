using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class UserActivity
    {
        public string UserId { get; set; }
        public AppUser? User { get; set; }

        public int ActivityId { get; set; }
        public Activity? Activity { get; set; }
    }
}