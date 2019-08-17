
$(document).ready(function () {


    $("#participantFullName").keyup(function (e) {
        if ($('#participantFullName').val().length > 0) {
            $("#nameError").hide()
        }
        else {
            $("#nameError").show()
        }
        
    });

    $("#participantUid").keyup(function (e) {
        var uid = $('#participantUid').val()
        if (uid.length > 0) {
            $("#uidError").hide()
            for (var i = 0; i < uid.length; i++) {
                if (uid.charCodeAt(i) >= 48 && uid.charCodeAt(i) <= 57) {
                    $("#uidValidError").hide()
                }
                else {
                    $("#uidValidError").show()
                    break;
                }
            }
        }
        else {
            $("#uidError").show()
        }
        
        

    });

    $('#consentNext').click(function (e) {

        var name = $('#participantFullName').val()
        var uid = $('#participantUid').val();
        var isUidValid = true
        var isAllValid = false

        if (!isAllValid) {
            var isnameAvailable = false
            var isuidAvailable = false
            if (uid.length > 0) {
                for (var i = 0; i < uid.length; i++) {
                    if (uid.charCodeAt(i) >= 48 && uid.charCodeAt(i) <= 57) {
                        isUidValid = true
                    }
                    else {
                        isUidValid = false;
                        break;
                    }
                }
            }

            if (name.length == 0) {
                $("#nameError").show()
                isnameAvailable = false
            }
            else {
                isnameAvailable = true
            }
            if (uid.length == 0) {
                $("#uidError").show()
                isuidAvailable = false
            }
            else {
                isuidAvailable = true
            }
            if (!isUidValid) {
                $("#uidValidError").show()
            }
            else {
                $("#uidValidError").hide()
            }

            if (isnameAvailable && isuidAvailable && isUidValid) {
                isAllValid = true
            }

        }

        if (isAllValid) {
            var option = $("input[name='optradio']:checked").val()

            if (option == 'yes') {

                $.ajax({
                    url: '/getSession',
                    data: {
                        'name': name,
                        'uid': uid
                    },
                    type: 'GET',
                    success: function (response) {
                        console.log(response)
                        if (response['condition'] == 0) {
                            alert("Contact Administrator. Resetting the limit is required")
                        }
                        else {
                            window.location.replace(window.location.href + response['condition'])
                            localStorage.setItem("sessionId", response['sessionId']);
                        }
                    },
                    error: function (response) {

                    }
                });
            }
            else {
                alert("Thank you")
            }

        }

    });
});