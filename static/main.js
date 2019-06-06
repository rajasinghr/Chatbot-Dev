var jsonData = ''
var condition = 'LLL'
var tutorialMsgs = []
$(document).ready(function () {
    if (!$.trim($('#chatDiv').html()).length) {

        $.ajax({
            url: '/getJson',
            type: 'GET',
            success: function (response) {
                jsonData = response['jsonContent']
                
                Object.entries(jsonData[condition]).forEach(([key, value]) => {
                    Object.entries(value).forEach(([key1, value1]) => {
                        tutorialMsgs.push(value1)
                        
                    });
                });

                for (var i = 0; i < tutorialMsgs.length; i++) {
                    (function (ind) {
                        
                        setTimeout(function () {
                                addThinking('bot')
                                $('#bot_thinking').remove();
                                addMessage('bot', tutorialMsgs[ind])
                                console.log(tutorialMsgs[ind]);
                            }, 1000 + (2000 * ind));
                    })(i);
                }
                
            }
        });

        //var bot_intro = "Hello, My name is Rocky. It's nice to meet you. I'm here to help by providing the information that you need to make the right decision!"
        //addThinking('bot')
        //setTimeout(function () {
        //    $('#bot_thinking').remove();
        //    addMessage('bot', bot_intro)
        //}, 2000);
    }
    $('#userMessage').focus()
    $('#userMessage').keypress(function (e) {
        if (e.key === 'Enter') {

            var userMessage = $('#userMessage').val();
            $("#user_thinking").remove();
            addMessage('user', userMessage)
            $('#userMessage').val('');

            $.ajax({
                url: '/getResponse',
                data: {
                    'userMessage': userMessage
                },
                type: 'GET',
                success: function (response) {
                    addThinking('bot')
                    setTimeout(function () {
                        $('#bot_thinking').remove();
                        addMessage('bot', response["botResponse"])
                    }, 2000);
                    

                }
            });
        }
        else {
            if ($("#user_thinking").length<1) {
                addThinking('user')
            }
            
        }
    });

    function addThinking(type) {
        var html = '';
        if (type == 'user') {
            html = "<div id='user_thinking' class='user_msg_div'><div class='user_msg_img' ><img src='../static/images/user.png' alt='Avatar' style='width:100%;'></div><div class='user_msg_main_div'><div class='ticontainer'><div class='tiblock'><div class='tidot'></div><div class='tidot'></div><div class='tidot'></div></div></div></div></div > "
        }
        else {
            html = "<div id='bot_thinking' class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/bot.png' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='bot_msg_inner_div'><div class='ticontainer'><div class='tiblock'><div class='tidot'></div><div class='tidot'></div><div class='tidot'></div></div></div></div></div></div>"
        }
        $('#chatDiv').append(html)
        var element = document.getElementById("chatDiv");
        element.scrollTop = element.scrollHeight;
    }

    function addMessage(type,message) {
        var html = '';
        if (type == 'user') {
            html = "<div class='user_msg_div'><div class='user_msg_img'><img src='../static/images/user.png' alt='Avatar' style='width:100%;'></div><div class='user_msg_main_div'><p style='word-wrap: break-word'>"+message+"</p></div></div>"
        }
        else {
            html = "<div class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/bot.png' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='bot_msg_inner_div'><p style='word-wrap: break-word'>"+message+"</p></div></div></div>"
        }
        $('#chatDiv').append(html)
        var element = document.getElementById("chatDiv");
        element.scrollTop = element.scrollHeight;
    }
});
