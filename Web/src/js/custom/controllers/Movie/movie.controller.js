'use strict';
angular.module('naut').
    controller('movieController',
    ['$scope', '$location', '$modal', '$window', 'localStorageService', 'ngAuthSettings', 'modalService', '$timeout', 'sharedService',

        function ($scope, $location, $modal, $window, localStorageService, ngAuthSettings, modalService, $timeout, sharedService) {

            // system setting start
            $scope.model = {
                movieId: 0,
                title: '',
                genre: '',
                classification: '',
                releaseDate: '',
                rating: '',
                castInput: '',
                cast: [],
            };

            $scope.search = {
                movieId: '',
                title: '',
                genre: '',
                classification: '',
                releaseDate: '',
                rating: '',
                page: 1,
                pageSize: 10,
                totalPage: 0,
                orderbyCol: 0,
                sortIcon: 'fa-sort-desc',
                orderBy: '1',
                search: '',
            };


            $scope.system = {
                alertMsg: '',
                startRowNumber: 1,
                endRowNumber: 10,
                total: 0
            };


            if ($location.path() == "/app/movie-list") {

                $scope.queryString = encodeString('0');


                $scope.getDataList = function (page) {
                    $scope.search_loading = true;
                    $scope.disablePageAction = true;
                    $scope.search.page = page;
                    sharedService.getShareds($scope.search, 'Movie/GetAllData').then(function (response) {
                        $scope.movieList = response.data[0];
                        $scope.search.totalPage = parseInt(response.data[1]);
                        $scope.system.total = parseInt(response.data[1]);


                        $scope.search_loading = false;
                        $scope.disablePageAction = false;
                    },
                        function (err) {
                            $scope.search_loading = false;
                            $scope.disablePageAction = false;
                            $.toaster({ title: 'Error', priority: 'danger', message: err.data });
                        });

                };

                $scope.pagingAction = function (page) {

                    $scope.system.startRowNumber = parseInt(((page - 1) * $scope.search.pageSize) + 1),
                        $scope.system.endRowNumber = parseInt((page - 1) * $scope.search.pageSize) + parseInt($scope.search.pageSize);
                    $scope.getDataList(page);
                };

                $scope.edit = function (id) {

                    var encode = encodeString(id);
                    window.location.href = '#/app/movie-edit?id=' + encode;
                };



                $scope.new = function (id) {
                    window.location.href = '#/app/movie-new';
                };

                $scope.detail = function (id) {
                    var encode = encodeString(id);
                    window.location.href = '#/app/movie-detail?id=' + encode;

                };

                $scope.refresh = function (id) {

                    $scope.getDataList(1);

                };


                $scope.sort = function (id) {

                    if ($scope.search.sortIcon == "fa-sort-desc") {
                        $scope.search.sortIcon = 'fa-sort-asc';
                        $scope.search.orderBy = "0";
                    }
                    else if ($scope.search.sortIcon == "fa-sort-desc") {
                        $scope.search.sortIcon = 'fa-sort-asc';
                        $scope.search.orderBy = "1";
                    }
                    else {
                        $scope.search.sortIcon = 'fa-sort-desc';
                        $scope.search.orderBy = "1";
                    }

                    $scope.getDataList($scope.search.page);
                };

                $scope.searchFunc = function () {
                    $scope.search_loading = true;
                    $scope.getDataList(1);
                };

                // page load
                $scope.getDataList(1);


            }






            if ($location.path() == "/app/movie-detail" || $location.path() == "/app/movie-new" || $location.path() == "/app/movie-edit") {

                $scope.getmovie = function () {



                    if ($location.path() == "/app/movie-edit" || $location.path() == "/app/movie-detail") {

                        var id = decodeString($location.search().id);
                        sharedService.getSharedWithUrl('movie/GetMovie?id=' + id).then(function (response) {
                            $scope.model = response.data;
                        },
                            function (err) {
                                $.toaster({ title: 'Error', priority: 'danger', message: err.data });
                            });

                    }
                };
                $scope.cancel = function () {

                    window.location.href = '#/app/movie-list';
                };
                $scope.back = function () {

                    window.location.href = '#/app/movie-list';
                };


                $scope.movieSubmit = function (isValid) {


                    if (!isValid) {
                        return false;
                    }

                    $scope.sb_loading = true;
                    sharedService.SharedSubmit($scope.model, 'movie/movieSubmit/').then(function (response) {
                        $scope.sb_loading = false;
                        window.location.href = '#/app/movie-list';
                    },
                        function (err) {
                            $.toaster({ title: 'Error', priority: 'danger', message: err.data });
                        });

                };

                $scope.removeCast = function (element) {

                    const index = $scope.model.cast.indexOf(element);
                    $scope.model.cast.splice(index, 1);

                };

                $scope.addCast = function () {

                    $scope.model.cast.push($scope.model.castInput);
                    $scope.model.castInput = '';

                };


                $scope.getmovie();


            }


        }
    ]);




