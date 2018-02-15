
$('#closeReport').click(function () {
    showScanner();
});

$('#downloadReport').click(function () {
    downloadPdf();
});

function downloadPdf() {

}

function showScanner() {
    $("#reportContainer").hide();
    $("#scanContainer").show();
}

function showReport() {
    $("#reportContainer").show();
    $("#scanContainer").hide();
}

function init(id) {
    $.toaster({ settings: { 'timeout': 5000 } });

    if (id == 0) {
        showScanner();
    }
    else {
        showReport();
        getReport(id);
    }
}

function getReport(id) {
    var url = '/PatientReport/GetInvoiceReport';
    var _data = {
        Id: id
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(_data),
        contentType: "application/json;",
        success: function (resultData) {
            var response = {};
            response.data = JSON.parse(resultData);
            furnishInvoiceReport(response);
        }
    });
}

function furnishInvoiceReport(reponse){

}



/////////////////////////////
function furnishReport(response) {
    var productsTestResult = response.data.table0[0];
    if (response.data.table0.length == 0) {
        showScanner();
        $.toaster('Not found, please contact lab assistant.', '', 'danger');
        //$.toaster('Not found, please contact lab assistant.', '', 'danger');
        return false;
    }

    showReport();
    var testResult = {};
    if (response.data.table5.length == 0) {
        $.toaster('Test result is in progress.', '', 'info');
    }

    var mainProductId = productsTestResult.productId;

    if (productsTestResult != null) {
        testResult.patientId = productsTestResult.patientId;
        testResult.invoiceId = productsTestResult.invoiceId;
    }

    testResult = productsTestResult;
    //testResult.invoiceDetailId = invoiceDetailId;

    testResult.isGroup = (testResult.productGroupId > 0);
    //rangeResult
    var rangeResult = response.data.table2;
    //rangeResult = $filter('orderBy')(rangeResult, 'ageType');

    //Property results
    var PropertyResult = response.data.table3;


    var totalFormations = rangeResult.concat(PropertyResult);

    var groups = totalFormations.reduce(function (obj, item) {
        obj[item.childTestId] = obj[item.childTestId] || [];
        if (item.resultType == 'range') {
            //some parameter matches multiple ranges, we shall consider one and ignore others.
            var duplicate = $.grep(obj[item.childTestId], function (e) { return e.productId == item.productId, e.parameterId == item.parameterId; })[0];
            //var duplicate = $filter('filter')(obj[item.childTestId], { productId: item.productId, parameterId: item.parameterId }, true)[0];


            if (duplicate == null) {
                obj[item.childTestId].push(item);
            }
        }
        return obj;
    }, {});


    for (var prop in groups) {
        groups[prop] = groups[prop].sort(function (a, b) {
            return a.ageType=='u'
        });
    }

    //groups = $filter('orderBy')(groups, 'priority');
    

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

    //saved testResultDetail
    var createdResultDetails = response.data.table6;

    if (createdResults.length > 0 && formations.length > 0) {

        testResult.id = createdResults[0].id;
        var testObj = $.grep(createdResults, function (e) { return e.productId == formations[0].productId; })[0];

        //var testObj = $filter('filter')(createdResults, { productId: formations[0].productId }, true)[0];

        if (testObj == null) {
            testObj = createdResults[0];
        }
        testResult.remarks = testObj.remarks;
        testResult.interpretation = testObj.interpretation;
    }

    //saved testResultProperty
    var createdResultProperties = response.data.table7;

    //saved testResultRemarks
    var createResultRemarks = response.data.table8;

    var productFormationPriorities = response.data.table9;

    var fieldsPriority = {};
    if (productFormationPriorities != null && productFormationPriorities.length > 0) {
        //angular.forEach
        $.each(productFormationPriorities, function (index, value) {
            fieldsPriority[value.formationId] = value.priority;
        });
    }
    

    var interpretations = [];

    testResult.showRangeColumn = false;
    //angular.forEach
    $.each(formations, function (index, product) {
        product.showRangeColumn = false;
        if (product.resultType == 'range') {
            setTestResultRangeReadings(product.details, createdResultDetails);
        }
        else {
            product.details = [];
        }

        var properties = getProductProperties(PropertyResult, product, createdResultProperties);
        product.properties = properties;


        if (product.details.length > 0) {
            product.productGroupPriority = product.details[0].productGroupPriority;
            testResult.showRangeColumn = true;
            product.showRangeColumn = true;
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

        var interpretations = product.details.filter(function (obj) {
            if (obj.resultType == 'range') {
                return obj.interpretation != null && obj.interpretation != '';
            }
        });

        //interpretations = $scope.interpretations.concat(interpretations);

        delete product.properties;

    });

    testResult.products = formations;

    var testResultToPrint = [];
    testResultToPrint.push(testResult);

    testResult.relationship = (testResult.relationship == 'W/O' ? 'Husband' : testResult.relationship == 'D/O' || testResult.relationship == 'S/O' ? 'Father' : testResult.relationship == 'M/O' ? 'Mother' : testResult.relationship == 'B/O' ? 'Brother' : 'Father/Husband');
    var model = {
        testResultToPrint: testResultToPrint,
        userSubCompanyName: "",
        qrCodeValue: "",
        testResult: testResult,
        patientName: "Ayaz",

    }
    $("#reportContent").html('');
    $("#reportTmpl").tmpl(model).appendTo("#reportContent");
}

function getProductProperties(PropertyResult, product, createdResultProperties) {
    var properties = [];
    var propertyDefaultOption = { "productParameterPropertyId": -1, "propertyValue": "-- Select --" };
    $.each(PropertyResult, function (index, Property) {
        if (Property.productId == product.childTestId) {
            Property.resultType = 'Property';
            //var propExists = $filter('filter')(properties, { productParameterId: Property.productParameterId, productId: Property.productId }, true)[0];
            var propExists = $.grep(properties, function (e)
            { return e.productParameterId == Property.productParameterId, e.productId == Property.productId, e.formationId == Property.productFormationId; })[0];

            if (propExists == undefined) {
                var defaultOptionOb = jQuery.extend(true, {}, propertyDefaultOption); //angular.copy(propertyDefaultOption);
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

                $.each(createdResultProperties, function (index, value) {
                    if (value.productFormationId == Property.productFormationId) {
                        newProp.reading = value.reading;
                    }
                    if (value.productParameterPropertyId == Property.productParameterPropertyId && value.productFormationId == Property.productFormationId) {
                        newProp.selectedValue = Property;
                    }
                });
                //angular.copy(Property)
                newProp.options.push(jQuery.extend(true, {}, Property));

                properties.push(newProp);
            }
            else {

                $.each(createdResultProperties, function (index,value) {
                    if (value.productParameterPropertyId == Property.productParameterPropertyId && value.productFormationId == Property.productFormationId) {
                        propExists.selectedValue = Property;
                    }
                });
                
                propExists.options.push(jQuery.extend(true, {}, Property));
            }
        }
    });
    return properties;
}

function setTestResultRangeReadings(testResultDetails, testResultDetailsCreated) {
    $.each(testResultDetails, function (key, test) {
        var det = $.grep(testResultDetailsCreated, function (e) { return e.productId == test.childTestId, e.formationId == test.formationId; });
        //var det = $filter('filter')(testResultDetailsCreated, { productId: test.childTestId, formationId: test.formationId }, true);
        test.lis = (det.length == 0 ? '' : det[0].lis);
        if (det.length > 0) {
            test.interpretation = (det.length == 0 ? '' : det[0].interpretation);
        }
    });
}


function decodeString(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
