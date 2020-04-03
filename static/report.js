$(document).ready(function () {
    $("#getData").click(function (e) {
        $("#demoTable").empty()
        $.ajax({
            url: '/getMatrixResult',
            data: {
                'recordId': $("#recordId").val()
            },
            type: 'GET',
            success: function (response) {
                response = JSON.parse(response)
                $("#demoTable").append(response["result"]["workGrid"])
                matrixResult = JSON.parse(response["result"]["matrixDict"])

                $("#1").val(matrixResult[1]["role"]);
                $("#2").val(matrixResult[1]["projectHours"]);
                $("#3").val(matrixResult[2]["role"]);
                $("#4").val(matrixResult[2]["projectHours"]);
                $("#5").val(matrixResult[3]["role"]);
                $("#6").val(matrixResult[3]["projectHours"]);
                $("#7").val(matrixResult[4]["role"]);
                $("#8").val(matrixResult[4]["projectHours"]);

            }
        });
    });
    
});