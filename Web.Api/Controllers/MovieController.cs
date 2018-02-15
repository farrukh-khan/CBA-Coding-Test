using MoviesLibrary;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Web.Api.Enum;
using Web.Api.Models;

namespace Web.Api.Controllers
{
    public class MovieController : ApiController
    {
        #region Fields
        MovieDataSource _dataSource = null;
        #endregion

        #region Ctor
        public MovieController()
        {
            _dataSource = new MovieDataSource();
        }

        #endregion

        #region Api Controllers



        /// <summary>
        /// Movie section start
        /// </summary>
        /// <returns></returns>

        [HttpPost]
        [AllowAnonymous]
        [ActionName("GetAllData")]
        public IHttpActionResult GetAllData(MovieDataModel model)
        {
            try
            {
                int skip = (model.page * model.pageSize) - model.pageSize;
                int take = model.pageSize;

                IEnumerable<MovieData> data = _dataSource.GetAllData();

                if (!string.IsNullOrEmpty(model.Search))
                {
                    data = data.Where(x => x.MovieId.ToString() == model.Search

                    || x.Title.Contains(model.Search)

                    || x.Genre.Contains(model.Search)

                    || x.Classification.Contains(model.Search)


                    || x.ReleaseDate.ToString() == model.Search

                    || x.Rating.ToString() == model.Search

                    );
                }


                if (model.OrderBy == OrderBy.Asc)
                {
                    if (model.orderbyCol == SortType.MovieId)
                        data = data.OrderBy(x => x.MovieId);

                    if (model.orderbyCol == SortType.Title)
                        data = data.OrderBy(x => x.Title);

                    if (model.orderbyCol == SortType.Genre)
                        data = data.OrderBy(x => x.Genre);

                    if (model.orderbyCol == SortType.Classification)
                        data = data.OrderBy(x => x.Classification);


                    if (model.orderbyCol == SortType.ReleaseDate)
                        data = data.OrderBy(x => x.ReleaseDate);


                    if (model.orderbyCol == SortType.Rating)
                        data = data.OrderBy(x => x.Rating);
                }
                else
                {
                    if (model.orderbyCol == SortType.MovieId)
                        data = data.OrderByDescending(x => x.MovieId);

                    if (model.orderbyCol == SortType.Title)
                        data = data.OrderByDescending(x => x.Title);

                    if (model.orderbyCol == SortType.Genre)
                        data = data.OrderByDescending(x => x.Genre);

                    if (model.orderbyCol == SortType.Classification)
                        data = data.OrderByDescending(x => x.Classification);


                    if (model.orderbyCol == SortType.ReleaseDate)
                        data = data.OrderByDescending(x => x.ReleaseDate);


                    if (model.orderbyCol == SortType.Rating)
                        data = data.OrderByDescending(x => x.Rating);

                }


                var totalCount = data.Count();
                var retData = data.Skip(skip).Take(take);
                return Ok(new ArrayList { retData, totalCount });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }


        [HttpGet]
        [AllowAnonymous]
        [ActionName("GetMovie")]
        public IHttpActionResult GetMovie(int id)
        {
            try
            {
                var data = _dataSource.GetDataById(id);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }




        [HttpPost]
        [ActionName("MovieSubmit")]
        public IHttpActionResult MovieSubmit(MovieData model)
        {
            try
            {
                var currentDate = DateTime.Now;

                if (model.MovieId > 0)
                {
                    _dataSource.Update(model);

                }
                else
                {

                    var isExists = _dataSource.GetAllData().Any(x => x.Title.ToUpper() == model.Title.ToUpper());

                    if (isExists)
                    {
                        return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, "Movie title already exist."));
                    }

                    _dataSource.Create(model);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }




        #endregion
    }
}
