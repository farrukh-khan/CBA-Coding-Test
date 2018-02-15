using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Web.Api.Enum;

namespace Web.Api.Models
{
    public class MovieDataModel
    {
        public int MovieId { get; set; }
        public string Title { get; set; }
        public string Genre { get; set; }
        public string Classification { get; set; }
        public int ReleaseDate { get; set; }
        public int Rating { get; set; }


        public string Search { get; set; }

        public SortType orderbyCol { get; set; }

        public OrderBy OrderBy { get; set; }
        public string sortIcon { get; set; }

        public int page { get; set; }
        public int pageSize { get; set; }


    }
}