using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<ActivityPosts, ActivityPosts>();
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(x => x.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(d => d.isMain).Url));
            CreateMap<ChatAppComment, CommentDto>()
               .ForMember(x => x.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
               .ForMember(x => x.Username, o => o.MapFrom(s => s.Author.UserName))
               .ForMember(x => x.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(p => p.isMain).Url ?? "empty"));
        }
    }
}