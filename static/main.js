var jsonData = ''
var condition = 'LLL'
var tutorialMsgs = []
var triggerEnterKeyEvent = true
$(document).ready(function () {
    $('#conditionSetupModal').modal('show');
    conditionSelectButton();
    

    function onloadSetup() {
        if (!$.trim($('#chatDiv').html()).length) {
            
            $('#topic').val('Introduction');
            $('#index').val('0');
            $('#sessionId').val('');
            $.ajax({
                url: '/getResponse',
                data: {
                    'sessionId': $('#sessionId').val(),
                    'condition': $('#condition').val(),
                    'topic': $('#topic').val(),
                    'index': $('#index').val(),
                    'response': '',
                    'timeTaken': '',
                    'gridAction': '',
                },
                type: 'GET',
                success: function (response) {
                    $('#topic').val(response["topic"]);
                    $('#index').val(response["index"]);
                    $('#condition').val(response["condition"]);
                    $('#sessionId').val(response["sessionId"]);
                    addThinking('bot', response["condition"])
                    var message = response["botResponse"];
                    if (response['condition'][1] == 'H' && response['topic'] == 'Introduction' && response['index'] == "1") {
                        message = message + "<br/>For the next steps, please take your time to read the information I provide you. When you are done, press enter key or click on 'next' button, and I will move on"


                    }

                    $("#nextButton").attr("disabled", true);
                    setTimeout(function () {
                        $('#bot_thinking').remove();
                        addMessage('bot', response["condition"], message)
                    }, 1000);

                    $("#nextButton").attr("disabled", false);

                }
            });


            $("#nextButton").click(function (e) {
                triggerEnterKeyEvent = false;
                getDataEvent();
            });

            $(document).keypress(function (e) {
                if (e.key === 'Enter' && triggerEnterKeyEvent) {
                    triggerEnterKeyEvent = false;
                    
                    getDataEvent();
                    
                }
            });
            
        }
        
        $('#userMessage').keypress(function (e) {
            if (e.key != 'Enter') {
                if ($("#user_thinking").length < 1) {
                    addThinking('user')
                }
            }
        })
        gridClick();
        gridSubmit();

    }

    function conditionSelectButton() {
        $("#conditionSelectButton").click(function () {
            var radioValue1 = $("input[name='autonomyOption']:checked").val();
            var radioValue2 = $("input[name='relatednessOption']:checked").val();
            var radioValue3 = $("input[name='competencyOption']:checked").val();
            
            $('#condition').val(radioValue1 + radioValue2 + radioValue3);
            onloadSetup();
        });
    }
    
    function getDataEvent() {
        istriggerEnterKeyEventActive = true
        isTaskCompleted = false
        $("#nextButton").attr("disabled", true);
        $('#user_thinking').remove();
        var timeTaken = 0.0
        if ($('#topic').val() == 'Clue') {
            var seconds = new Date().getTime() / 1000;
            timeTaken = seconds - parseInt($('#timeTaken').val());
        }
        $.ajax({
            url: '/getResponse',
            data: {
                'sessionId': $('#sessionId').val(),
                'condition': $('#condition').val(),
                'topic': $('#topic').val(),
                'index': $('#index').val(),
                'response': '',
                'timeTaken': timeTaken,
                'gridAction': $('#gridAction').val(),
            },
            type: 'GET',
            success: function (response) {
                $('#sessionId').val(response["sessionId"]),
                    $('#condition').val(response["condition"]);
                $('#topic').val(response["topic"]);
                $('#index').val(response["index"]);
                $('#gridAction').val("");
                addThinking('bot', response["condition"])
                //$("#nextButton").attr("disabled", true);
                setTimeout(function () {
                    $('#bot_thinking').remove();
                    var message = '';
                    if (response['topic'] == 'Clue') {
                        response_dict = response["botResponse"][0]
                        var clues = []
                        var explanations = []
                        for (var key in response_dict) {
                            message += '<b>Clue ' + key.toString() + '</b><br/>';
                            message += '<b>Clue: </b>' + response_dict[key]['clue'] + '<br/>';
                            if (response['condition'][2] == 'H') {
                                message += '<b>Explanation: </b>' + response_dict[key]['explanation'] + '<br/>';
                            }
                            message+='<br/>'
                            clues.push(response_dict[key]['clue']);
                            explanations.push(response_dict[key]['explanation']);
                        }
                    }
                    else if (response['topic'] == 'Redundant') {
                        
                        response_dict = response["botResponse"][0]
                        var clues = []
                        var explanations = []
                        for (var key in response_dict) {
                            
                            clues.push(response_dict[key]['clue']);
                            explanations.push(response_dict[key]['explanation']);
                        }

                        message = '';
                        for (var i = 0; i < 5; i++) {
                            message += '<b>Clue ' + (i+1).toString() + '</b><br/>';
                            message += '<b>Clue: </b>' + clues[i] + '<br/>';
                            if (response['condition'][2] == 'H') {
                                message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                            }
                            message += '<br/>'
                        }
                        addMessage('bot', response["condition"], message);

                        message = '';
                        for (var i = 5; i < 10; i++) {
                            message += '<b>Clue ' + (i+1).toString() + '</b><br/>';
                            message += '<b>Clue: </b>' + clues[i] + '<br/>';
                            if (response['condition'][2] == 'H') {
                                message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                            }
                            message += '<br/>'
                        }
                        addMessage('bot', response["condition"], message);

                        message = '';
                        for (var i = 10; i < 15; i++) {
                            message += '<b>Clue ' + (i+1).toString() + '</b><br/>';
                            message += '<b>Clue: </b>' + clues[i] + '<br/>';
                            if (response['condition'][2] == 'H') {
                                message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                            }
                            message += '<br/>'
                        }
                        addMessage('bot', response["condition"], message);

                        message = '';
                        for (var i = 15; i < 20; i++) {
                            message += '<b>Clue ' + (i+1).toString() + '</b><br/>';
                            message += '<b>Clue: </b>' + clues[i] + '<br/>';
                            if (response['condition'][2] == 'H') {
                                message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                            }
                            message += '<br/>'
                        }
                        addMessage('bot', response["condition"], message);


                        message = '';
                        for (var i = 20; i < 22; i++) {
                            message += '<b>Clue ' + (i+1).toString() + '</b><br/>';
                            message += '<b>Clue: </b>' + clues[i] + '<br/>';
                            if (response['condition'][2] == 'H') {
                                message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                            }
                            message += '<br/>'
                        }
                        addMessage('bot', response["condition"], message);

                        message = '';
                    }
                    else {
                        message = response["botResponse"][0];
                    }
                    
                    //console.log(message)
                    if (response['topic'] == 'Clue') {
                        var seconds = new Date().getTime() / 1000;
                        $('#timeTaken').val(seconds);
                    }

                    if (response['topic'] == 'Submit' && response['index'] == "2") {
                        message = message + '<br/><br/>'
                        message += `<div id="matrixResult" class="table-responsive-sm" style="width:130%">
                                      <table class="table table-sm" >
                                        <thead>
                                        <tr style="font-size: 10px;font-weight:bold;">
                                            <th scope="col">Team Member</th>
                                            <th scope="col">Role</th>
                                            <th scope="col"># Project hours/week</th>
                                            <th scope="col">Office Location</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                            <tr>
                                                <td style="font-size: 14px;font-weight:bold;">Alex</td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">Network Architect</option>
                                                        <option value="2">Quality Assurance Engineer</option>
                                                        <option value="3">Systems Analyst</option>
                                                        <option value="4">Cyber Security Specalist</option>
                                                        <option value="5">Database Administrator</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">4</option>
                                                        <option value="2">6</option>
                                                        <option value="3">8</option>
                                                        <option value="4">10</option>
                                                        <option value="5">12</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">New York</option>
                                                        <option value="2">Boston</option>
                                                        <option value="3">Chicago</option>
                                                        <option value="4">Seattle</option>
                                                        <option value="5">Los Angeles</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px;font-weight:bold;">Leon</td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">Network Architect</option>
                                                        <option value="2">Quality Assurance Engineer</option>
                                                        <option value="3">Systems Analyst</option>
                                                        <option value="4">Cyber Security Specalist</option>
                                                        <option value="5">Database Administrator</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">4</option>
                                                        <option value="2">6</option>
                                                        <option value="3">8</option>
                                                        <option value="4">10</option>
                                                        <option value="5">12</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">New York</option>
                                                        <option value="2">Boston</option>
                                                        <option value="3">Chicago</option>
                                                        <option value="4">Seattle</option>
                                                        <option value="5">Los Angeles</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px;font-weight:bold;">Michael</td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">Network Architect</option>
                                                        <option value="2">Quality Assurance Engineer</option>
                                                        <option value="3">Systems Analyst</option>
                                                        <option value="4">Cyber Security Specalist</option>
                                                        <option value="5">Database Administrator</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">4</option>
                                                        <option value="2">6</option>
                                                        <option value="3">8</option>
                                                        <option value="4">10</option>
                                                        <option value="5">12</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">New York</option>
                                                        <option value="2">Boston</option>
                                                        <option value="3">Chicago</option>
                                                        <option value="4">Seattle</option>
                                                        <option value="5">Los Angeles</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px;font-weight:bold;">Rachel</td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">Network Architect</option>
                                                        <option value="2">Quality Assurance Engineer</option>
                                                        <option value="3">Systems Analyst</option>
                                                        <option value="4">Cyber Security Specalist</option>
                                                        <option value="5">Database Administrator</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">4</option>
                                                        <option value="2">6</option>
                                                        <option value="3">8</option>
                                                        <option value="4">10</option>
                                                        <option value="5">12</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">New York</option>
                                                        <option value="2">Boston</option>
                                                        <option value="3">Chicago</option>
                                                        <option value="4">Seattle</option>
                                                        <option value="5">Los Angeles</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px;font-weight:bold;">Tina</td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">Network Architect</option>
                                                        <option value="2">Quality Assurance Engineer</option>
                                                        <option value="3">Systems Analyst</option>
                                                        <option value="4">Cyber Security Specalist</option>
                                                        <option value="5">Database Administrator</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">4</option>
                                                        <option value="2">6</option>
                                                        <option value="3">8</option>
                                                        <option value="4">10</option>
                                                        <option value="5">12</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="form-control form-control-sm">
                                                        <option value="1">New York</option>
                                                        <option value="2">Boston</option>
                                                        <option value="3">Chicago</option>
                                                        <option value="4">Seattle</option>
                                                        <option value="5">Los Angeles</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                            </table ></div>`
                    }

                    if (response['topic'] == 'Submit' && response['index'] == "3") {
                        $("#submitButton").show();
                        $("#nextButton").hide();
                        $("#nextButton").attr("disabled", true);
                        istriggerEnterKeyEventActive = false
                        
                    }

                    if ((response['topic'] == 'Conclusion' && response['index'] == "3" && response['condition'][1] == 'H')
                        || (response['topic'] == 'Conclusion' && response['index'] == "2" && response['condition'][1] == 'L')) {
                        $("#submitButton").hide();
                        $("#nextButton").hide();
                        $("#nextButton").attr("disabled", true);
                        istriggerEnterKeyEventActive = false;
                        isTaskCompleted = true;
                    }
                    
                    

                    if (($('#condition').val() == 'LHL' || $('#condition').val() == 'LHH') && response["topic"] == 'Introduction' && response["index"] == "2") {
                        $("#userMessage").show();
                        $('#userMessage').focus()
                        $('#userInputType').val("name")

                    }
                    else if ($('#userInputType').val() == 'name') {
                        message = message + ' ' + $('#userMessage').val();
                        $('#userName').val($('#userMessage').val())
                        addMessage('user',response["condition"], $('#userName').val())
                        $("#userMessage").hide();
                        $('#userInputType').val("");
                    }
                    else if (($('#condition').val() == 'LHL') && response["topic"] == 'Tutorial' && response["index"] == "12"
                        || ($('#condition').val() == 'LHH') && response["topic"] == 'Tutorial' && response["index"] == "33"
                        || ($('#condition').val() == 'LHL') && response["topic"] == 'Conclusion' && response["index"] == "1"
                        || ($('#condition').val() == 'LHH') && response["topic"] == 'Conclusion' && response["index"] == "1") {
                        var msgs = message.split("[Name]");

                        message = msgs[0] + $('#userName').val() + msgs[1];

                    }
                    if (response['topic'] != 'Redundant') {
                        addMessage('bot', response["condition"], message);
                        
                    }
                    $("#nextButton").attr("disabled", false);
                    if (istriggerEnterKeyEventActive) {
                        triggerEnterKeyEvent = true;
                    }
                    else {
                        triggerEnterKeyEvent = false;
                    }
                    if (isTaskCompleted) {

                        alert("Task Completed. Click OK. Page will refresh in 3 seconds")
                        window.setTimeout(function () { location.reload() }, 3000)
                    }
                }, 1000);
                //console.log("outside timeout")
                //$("#nextButton").attr("disabled", false);


                
            }
        });
    }

    function addThinking(type,condition) {
        var html = '';
        if (type == 'user') {
            html = "<div id='user_thinking' class='user_msg_div'><div class='user_msg_img' ><img src='../static/images/user.png' alt='Avatar' style='width:100%;'></div><div class='user_msg_main_div'><div class='ticontainer'><div class='tiblock'><div class='tidot'></div><div class='tidot'></div><div class='tidot'></div></div></div></div></div > "
        }
        else {
            if (condition[1] == 'H') {
                html = "<div id='bot_thinking' class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/man.png' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='bot_msg_inner_div'><div class='ticontainer'><div class='tiblock'><div class='tidot'></div><div class='tidot'></div><div class='tidot'></div></div></div></div></div></div>"
            }
            else {
                html = "<div id='bot_thinking' class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/bot3.jpg' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='bot_msg_inner_div'><div class='ticontainer'><div class='tiblock'><div class='tidot'></div><div class='tidot'></div><div class='tidot'></div></div></div></div></div></div>"
            }
            
        }
        $('#chatDiv').append(html)
        var element = document.getElementById("chatDiv");
        element.scrollTop = element.scrollHeight;
    }

    function addMessage(type,condition,message) {
        var html = '';
        if (type == 'user') {
            html = "<div class='user_msg_div'><div class='user_msg_img'><img src='../static/images/user.png' alt='Avatar' style='width:100%;'></div><div class='user_msg_main_div'><p style='word-wrap: break-word'>"+message+"</p></div></div>"
        }
        else {
            if (condition[1] == 'H') {
                html = "<div class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/man.png' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='bot_msg_inner_div'><p style='word-wrap: break-word'>" + message + "</p></div></div></div>"
            }
            else {
                html = "<div class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/bot3.jpg' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='bot_msg_inner_div'><p style='word-wrap: break-word'>" + message + "</p></div></div></div>"
            }
            
        }
        $('#chatDiv').append(html)
        var element = document.getElementById("chatDiv");
        element.scrollTop = element.scrollHeight;
    }

    function gridSubmit() {
        $('#submitButton').click(function () {
            var rows = document.querySelector('#matrixResult').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            var result = {}
            for (var row = 0; row < rows.length; row++) {
                var role = rows[row].getElementsByTagName('td')[1].getElementsByTagName('select')[0].value
                var projectHours = rows[row].getElementsByTagName('td')[2].getElementsByTagName('select')[0].value
                var location = rows[row].getElementsByTagName('td')[3].getElementsByTagName('select')[0].value
                result[row+1] = {
                    "role": role,
                    "projectHours": projectHours,
                    "location": location
                }

            }
            //console.log(JSON.stringify(result))
            var ajaxData = {
                'sessionId': $('#sessionId').val(),
                'condition': $('#condition').val(),
                'matrixDict': JSON.stringify(result)
            }
            $.ajax({
                url: '/storeMatrixResult',
                data: ajaxData,
                type: 'GET',
                success: function (response) {
                    //console.log(response)
                }
            });
            //console.log(result)
            $("#submitButton").hide();
            $("#nextButton").show();
            $("#nextButton").attr("disabled", false);
            triggerEnterKeyEvent = true;
        });
    }

    function gridClick() {
        $('td').click(function () {
            var col = $(this).parent().children().index($(this));
            var row = $(this).parent().parent().children().index($(this).parent());
            var className = "empty";
            
            //if((col > 1 && row > 1)){
            if ($(this).hasClass('click')) {
                if ($(this).hasClass('cross')) {

                    $(this).removeClass('cross')
                    $(this).addClass('circle')
                    className = $(this).attr("class");

                }
                else {
                    if ($(this).hasClass('circle')) {

                        $(this).removeClass('circle')
                        $(this).addClass('empty')
                        className = $(this).attr("class");

                    }
                    else {
                        if ($(this).hasClass('empty')) {
                            $(this).removeClass('empty')
                            $(this).addClass('cross')
                            className = $(this).attr("class");

                        }
                        else {
                            $(this).addClass('cross')
                            className = $(this).attr("class");

                        }
                    }
                }
                $("#gridAction").val('(' + row.toString() + ',' + col.toString() +')')




                //}
            }
            //console.log(col, row, className)
            
        });
    }
});


