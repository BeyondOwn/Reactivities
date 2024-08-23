using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using FluentValidation;

namespace Application.Activities
{
    public class PostsValidator : AbstractValidator<ActivityPosts>
    {
        public PostsValidator()
        {
            RuleFor(x => x.ActivityId).NotEmpty();
            RuleFor(x => x.CreatorId).NotEmpty();
            RuleFor(x => x.CreatorDisplayName).NotEmpty();
            RuleFor(x => x.Content).NotEmpty();
        }
    }
}