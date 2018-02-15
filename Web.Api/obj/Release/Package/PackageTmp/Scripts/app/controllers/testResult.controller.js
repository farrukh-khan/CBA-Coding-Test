(function () {
    'use strict';

    angular
    .module('naut')
    .controller('testResultController', testResultController);

    testResultController.$inject = ['$scope', '$rootScope', '$filter', 'sharedService'];

    function testResultController($scope, $rootScope, $filter, sharedService) {
        $scope.model = {
            companyId:-1
        };
        
        $scope.init = function (invoiceId) {
            if (invoiceId > 0) {
                $scope.getDataList(invoiceId);
                $scope.activeView = 'invoiceList';
            }
            else {
                $scope.activeView = 'scanner';
            }
        }

        $scope.goBack = function () {
            if ($scope.activeView == 'report') {
                $scope.activeView = 'invoiceList';
            }
            else if ($scope.activeView == 'invoiceList') {
                $scope.activeView = 'scanner';
                setTimeout(function () {
                    JsQRScannerReady();
                }, 100);
            }
        }

        $scope.codeScanned = function (scannedValue) {
            if (scannedValue.indexOf("inv:") != -1) {
                var id = scannedValue.replace("inv:", "");
                //alert(id);
                $scope.getDataList(id);
            }
            else {
                $.toaster({ title: 'Invalid QR', priority: 'warning', message: 'Can not open report.' });
            }
        }

        $scope.getDataList = function (id) {
            var searchObj = {};
            searchObj.id = id;
            $rootScope.isLoading = true;
            sharedService.getShareds(searchObj, '/api/TestResult/GetQRTestResults').then(function (response) {
                $rootScope.isLoading = false;
                var patients = response.data.table0;
                var sections = response.data.table1;
                var products = response.data.table2;
                if (products.length == 0) {
                    if (jbScanner != null) {
                        jbScanner.resumeScanning();
                    }
                    return $.toaster({ title: '', priority: 'warning', message: 'Test is in progress, please try latter.' });
                }
                patients[0].products = products;
                //angular.forEach(patients, function (patient, key) {
                //    patient.sections = getSectionAndProducts(products, sections, patient, $scope.activeDetailId);
                //    if (patient.sections.length > 0) {
                //        patient.sections[0].isOpen = true;
                //    }
                //});

                //$scope.testResultPatients = patients;
                $scope.patient = patients[0];
                //toggle view to show invoice list
                $scope.activeView = 'invoiceList';
                if ($scope.patient != null) {
                    $scope.model.companyId = $scope.patient.companyId;
                }
                if (patients.length > 0) {
                    //patients[0].isOpen = true;
                }
                else {
                    $.toaster({ title: 'Empty', priority: 'warning', message: 'No test result found !' });
                }

                //$scope.search.totalPage = parseInt(response.data.table3[0].totalRecord);
                //$scope.system.total = parseInt(response.data.table3[0].totalRecord);
                $scope.search_loading = false;
                $scope.disablePageAction = false;
            },
             function (err) {
                 $scope.search_loading = false;
                 $scope.disablePageAction = false;
                 $.toaster({ title: 'Error', priority: 'danger', message: err.data });
             });
        };
        
        function getSectionAndProducts(products, sections, patient, activeDetailId) {
            var patientProducts = $filter('filter')(products, { patientId: patient.patientId, invoiceId: patient.invoiceId }, true);
            var sectionsWithProducts = [];
            angular.forEach(patientProducts, function (product, key) {
                var sect = $filter('filter')(sections, function (section) {
                    return (section.sectionId == product.sectionId);
                }, true)[0];

                if (sect != null) {

                    var exists = $filter('filter')(sectionsWithProducts, function (existingElement) {
                        return (existingElement.sectionId == sect.sectionId);
                    }, true)[0];

                    if (exists == null) {
                        exists = angular.copy(sect);
                        exists.products = [];
                        sectionsWithProducts.push(exists);
                    }
                    if (!exists.isOpen) {
                        exists.isOpen = (product.invoiceDetailId == activeDetailId);
                        if (exists.isOpen && product.testResultId > 0) {
                            patient.isOpen = true;
                        }
                    }


                    if ($scope.activeDetailId == product.invoiceDetailId) {
                        $scope.printReport(product)
                    }

                    product.sectionName = sect.sectionName;
                    product.patient = patient;
                    exists.products.push(angular.copy(product));
                }

            });
            return sectionsWithProducts;
        }


        //print report
        $scope.printReport = function (obj, bulkPrint) {
            //disable click on test whose result is in progress
            if (obj.testResultId <= 0) {
                return false;
            }


            //if ($scope.selectedSection != null && obj.patientId != $scope.selectedSection.patientId) {
            //    $scope.checkedReports[$scope.selectedSection.patientId] = {};
            //    $scope.testResultToPrint = [];
            //    $scope.selectedSection = {};
            //}

            //if ($scope.checkedReports[obj.patientId] == null) {
            //    $scope.checkedReports[obj.patientId] = {};
            //}


            //$scope.qrCodeValue = "inv:" + obj.invoiceId;
            $scope.selectedId = obj.testResultId;

            $scope.selectedSection = obj;

            getResultDetails(obj.invoiceId, obj.invoiceDetailId, bulkPrint);
        }

        $scope.fieldsPriority = {};
        function getResultDetails(id, invoiceDetailId, addToBulkPrint) {
            
            var tsdetail = {};
            tsdetail.id = id;
            tsdetail.invoiceDetailId = invoiceDetailId;
            tsdetail.companyId = $scope.patient.companyId;
            $rootScope.isLoading = true;
            sharedService.getShareds(tsdetail, '/api/TestResult/GetQRTestResultDetails').then(function (response) {
                $rootScope.isLoading = false;
                var productsTestResult = response.data.table0[0];

                var mainProductId = productsTestResult.productId;

                $scope.testResult = {};
                if (productsTestResult != null) {
                    $scope.testResult.patientId = productsTestResult.patientId;
                    $scope.testResult.invoiceId = productsTestResult.invoiceId;
                    $scope.testResult.companyId = $scope.model.companyId;
                }

                //sections in tests
                //$scope.testResult.sections = response.data.table1;

                $scope.testResult = productsTestResult;
                $scope.testResult.invoiceDetailId = invoiceDetailId;

                $scope.testResult.isGroup = ($scope.testResult.productGroupId > 0);
                //rangeResult
                var rangeResult = response.data.table2;
                rangeResult = $filter('orderBy')(rangeResult, 'ageType');
                //Property results
                var PropertyResult = response.data.table3;


                var totalFormations = rangeResult.concat(PropertyResult);

                var groups = totalFormations.reduce(function (obj, item) {
                    obj[item.childTestId] = obj[item.childTestId] || [];
                    if (item.resultType == 'range') {
                        //some parameter matches multiple ranges, we shall consider one and ignore others.
                        var duplicate = $filter('filter')(obj[item.childTestId], { productId: item.productId, parameterId: item.parameterId }, true)[0];
                        if (duplicate == null) {
                            obj[item.childTestId].push(item);
                        }
                    }
                    return obj;
                }, {});

                groups = $filter('orderBy')(groups, 'priority');

                var formations = Object.keys(groups).map(function (key) {
                    var testName = '';
                    var testId = 0;
                    var resultType = false;
                    var formationId = -1;
                    if (groups[key].length == 0) {
                        //testId=
                    }

                    if (groups[key].length > 0) {
                        testName = groups[key][0].childTestName;
                        testId = groups[key][0].productId;
                        resultType = groups[key][0].resultType;

                    }

                    return { childTestId: key, childTestName: testName, productId: mainProductId, details: groups[key], resultType: resultType };
                });

                //product remarks
                var PropertyRemarks = response.data.table4;

                //saved testResult
                var createdResults = response.data.table5;
                var previousCreatedResults = response.data.table10;

                //saved testResultDetail
                var createdResultDetails = response.data.table6;
                var previousCreatedResultDetails = response.data.table11;

                if (createdResults.length > 0 && formations.length > 0) {

                    $scope.testResult.id = createdResults[0].id;

                    var testObj = $filter('filter')(createdResults, { productId: formations[0].productId }, true)[0];
                    if (testObj == null) {
                        testObj = createdResults[0];
                    }
                    $scope.testResult.remarks = testObj.remarks;
                    $scope.testResult.interpretation = testObj.interpretation;

                }

                //saved testResultProperty
                var createdResultProperties = response.data.table7;
                var previousCreatedResultProperties = response.data.table12;

                //saved testResultRemarks
                var createResultRemarks = response.data.table8;

                var productFormationPriorities = response.data.table9;

                angular.forEach(productFormationPriorities, function (value, key) {
                    $scope.fieldsPriority[value.formationId] = value.priority;
                });


                $scope.testResult.showRangeColumn = false;
                angular.forEach(formations, function (product, key) {

                    if (product.resultType == 'range') {
                        setTestResultRangeReadings(product.details, createdResultDetails, previousCreatedResultDetails);
                    }
                    else {
                        product.details = [];
                    }

                    var properties = getProductProperties(PropertyResult, product, createdResultProperties, previousCreatedResultProperties);
                    product.properties = properties;


                    if (product.details.length > 0) {
                        product.productGroupPriority = product.details[0].productGroupPriority;
                        $scope.testResult.showRangeColumn = true;

                    }
                    else if (product.properties.length > 0) {
                        product.productGroupPriority = product.properties[0].productGroupPriority;
                    }
                    else {
                        product.productGroupPriority = 1;
                    }

                    if (product.childTestName == '' && product.properties.length > 0) {
                        product.childTestName = product.properties[0].childTestName;
                    }


                    product.details = product.details.concat(properties);


                    product.details = product.details.filter(function (obj) {
                        if (obj.resultType == 'range') {
                            return obj.lis != "";
                        }
                        else {
                            return (obj.reading != null || obj.selectedValue.productParameterPropertyId != null);
                        }
                    });

                    //var interpretations = product.details.filter(function (obj) {
                    //    if (obj.resultType == 'range') {
                    //        return obj.interpretation != null && obj.interpretation != '';
                    //    }
                    //});

                    //$scope.interpretations = $scope.interpretations.concat(interpretations);

                    delete product.properties;

                });

                $scope.testResult.products = formations;
                if (formations.length > 0) {
                    //toggle view to show invoice list
                    $scope.activeView = 'report';
                }
                
                if (addToBulkPrint == true) {
                    if ($scope.checkedReports[$scope.testResult.patientId] == null) {
                        $scope.checkedReports[$scope.testResult.patientId] = {};
                    }
                    $scope.testResultToPrint.push($scope.testResult);
                }
                else {
                    $scope.testResultToPrint = [];
                    $scope.testResultToPrint.push($scope.testResult);

                    $scope.checkedReports = {};
                    $scope.checkedReports[$scope.testResult.patientId] = {};
                    $scope.checkedReports[$scope.testResult.patientId][$scope.testResult.testResultId] = true;
                }

            },
             function (err) {
                 $.toaster({ title: 'Error', priority: 'danger', message: err.data });
             });
        }

        function setTestResultRangeReadings(testResultDetails, testResultDetailsCreated, previousCreatedResultDetails) {
            angular.forEach(testResultDetails, function (test, key) {
                var det = $filter('filter')(testResultDetailsCreated, { productId: test.childTestId, formationId: test.formationId }, true);
                var previousDet = $filter('filter')(previousCreatedResultDetails, { productId: test.childTestId, formationId: test.formationId }, true);

                test.lis = (det.length == 0 ? '' : det[0].lis);
                test.previousLis = (previousDet.length == 0 ? '' : previousDet[0].lis);
                //if (det.length > 0) {
                //    test.interpretation = (det.length == 0 ? '' : det[0].interpretation);
                //}
            });
        }

        function getProductProperties(PropertyResult, product, createdResultProperties, previousCreatedResultProperties) {
            var properties = [];
            var propertyDefaultOption = { "productParameterPropertyId": -1, "propertyValue": "-- Select --" };
            angular.forEach(PropertyResult, function (Property) {
                if (Property.productId == product.childTestId) {
                    Property.resultType = 'Property';
                    var propExists = $filter('filter')(properties, { productParameterId: Property.productParameterId, productId: Property.productId, formationId: Property.productFormationId }, true)[0];
                    if (propExists == undefined) {
                        var defaultOptionOb = angular.copy(propertyDefaultOption);
                        defaultOptionOb.productFormationId = Property.productFormationId;
                        var newProp = {
                            productGroupPriority: Property.productGroupPriority,
                            productId: Property.productId,
                            productParameterId: Property.productParameterId,
                            name: Property.parameterName,
                            reading: Property.reading,
                            options: [defaultOptionOb],
                            childTestName: Property.childTestName,
                            formationId: Property.productFormationId,
                            priority: Property.priority,
                            selectedValue: {}
                        };

                        angular.forEach(createdResultProperties, function (value) {
                            if (value.productFormationId == Property.productFormationId) {
                                newProp.reading = value.reading;
                            }
                            if (value.productParameterPropertyId == Property.productParameterPropertyId && value.productFormationId == Property.productFormationId) {
                                newProp.selectedValue = Property;
                            }
                        });
                        //previous results
                        angular.forEach(previousCreatedResultProperties, function (value) {
                            if (value.productFormationId == Property.productFormationId) {
                                newProp.previousReading = value.reading;
                            }
                            if (value.productParameterPropertyId == Property.productParameterPropertyId && value.productFormationId == Property.productFormationId) {
                                newProp.previousSelectedValue = Property;
                            }
                        });

                        newProp.options.push(angular.copy(Property));

                        properties.push(newProp);
                    }
                    else {

                        angular.forEach(createdResultProperties, function (value) {
                            if (value.productParameterPropertyId == Property.productParameterPropertyId && value.productFormationId == Property.productFormationId) {
                                propExists.selectedValue = Property;
                            }
                        });

                        //previous results
                        angular.forEach(previousCreatedResultProperties, function (value) {
                            if (value.productParameterPropertyId == Property.productParameterPropertyId && value.productFormationId == Property.productFormationId) {
                                propExists.previousSelectedValue = Property;
                            }
                        });

                        if (propExists.selectedValue.productParameterPropertyId == null && $location.path() == "/app/testresult-edit") {
                            //propertyDefaultOption.productFormationId = Property.productFormationId;
                            var defaultOptionOb = angular.copy(propertyDefaultOption);
                            defaultOptionOb.productFormationId = Property.productFormationId;

                            propExists.selectedValue = defaultOptionOb;
                        }
                        propExists.options.push(angular.copy(Property));
                    }
                }
            });
            return properties;
        }


    }


})();