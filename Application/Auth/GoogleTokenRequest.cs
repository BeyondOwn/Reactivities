using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class GoogleTokenRequest
    {
        public string Credential { get; set; }
        public string ClientId { get; set; }

        public string Select_By { get; set; }
    }
}