using Domain;

public class PaginatedResult<Activity>
{
    public List<Activity> Items { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }

    public bool HasMore { get; set; }
}