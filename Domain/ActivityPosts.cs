
using Domain;

public class ActivityPosts
{
    public int Id { get; set; }
    public string Content { get; set; }
    public Activity? Activity { get; set; }
    public DateTime? Date { get; set; }
    public int ActivityId { get; set; }

    public AppUser? Users { get; set; }

    public string CreatorId { get; set; }

    public string CreatorDisplayName { get; set; }

    //Properties for nested comments
    public int? ParentPostId { get; set; }  // Nullable to allow top-level comments
    public ActivityPosts? ParentPost { get; set; }

    //hold the replies (children)
    public ICollection<ActivityPosts> Replies { get; set; } = new List<ActivityPosts>();
}