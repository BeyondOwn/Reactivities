using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Auth;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection Services, IConfiguration config)
        {
            Services.AddEndpointsApiExplorer();
            Services.AddSwaggerGen();
            Services.AddMediatR(typeof(List.Handler).Assembly);
            Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            Services.AddScoped<IUserAccesor, UserAccesor>();
            Services.AddSignalR();
            Services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            Services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            Services.AddScoped<IPhotoAccesor, PhotoAccesor>();
            return Services;
        }

    }

}