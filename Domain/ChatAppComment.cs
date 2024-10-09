using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class ChatAppComment
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public string? ImageUrl { get; set; }
        public string[]? Link { get; set; }
        public Metadata? Metadata { get; set; }
        public AppUser Author { get; set; }
        public Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }


}