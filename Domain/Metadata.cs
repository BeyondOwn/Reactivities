using Domain;

public class Metadata
{
    public int chatAppCommentId { get; set; }
    public bool Success { get; set; }
    public string Href { get; set; }
    public string SiteName { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public ChatAppComment? chatAppComment { get; set; }
}


