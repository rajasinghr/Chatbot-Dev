
$(document).ready(function () {
    $('#consentNext').click(function (e) {

        var option = $("input[name='optradio']:checked").val()
       
        if (option == 'yes') {
            
            $.ajax({
                url: '/getSession',
                data: {
                    'name': $('#participantFullName').val(),
                    'uid': $('#participantUid').val()
                },
                type: 'GET',
                success: function (response) {
                    console.log(response)
                    if (response['condition'] == 0) {
                        alert("Contact Administrator. Resetting the limit is required")
                    }
                    else {
                        window.location.replace(window.location.href + response['condition'] )
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
    });
});