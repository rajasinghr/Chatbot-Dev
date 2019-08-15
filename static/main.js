var jsonData = ''
var condition = 'LLL'
var tutorialMsgs = []
var triggerEnterKeyEvent = true
var sessionDictData = {}
var currentClue = {}
$(document).ready(function () {
    //alert(localStorage.getItem("sessionId"))
    

    console.log(window.location.href.split('/').pop())
    
    initialDataSetup();
    

    function onloadSetup() {
        if (!$.trim($('#chatDiv').html()).length) {
            
            $('#topic').val('Introduction');
            $('#index').val('0');
            $('#sessionId').val(localStorage.getItem("sessionId"));
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


                    $('#topic').val('Task Reminder')
                    $('#index').val("1")

                }
            });

         
            $("#nextButton").click(function (e) {
                triggerEnterKeyEvent = false;
                getDataEvent();
            });
            
            $(document.body).on("click", ".showNextClue", function () {
                var message = getButtonText('showNextClue')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                if ($('#topic').val() != 'Redundant') {
                    triggerEnterKeyEvent = false;
                    getDataEvent();
                }
                else {
                    if (sessionDictData['All'].length == 0) {
                        redundantMessage('Status: All available information has been provided',false);
                        
                    }
                    else {
                        redundantBlock($('#condition').val())
                    }
                }

                
                
            });
            
            $(document.body).on("click", '.showClueExplanation', function () {
                var message = getButtonText('showClueExplanation')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                
                addMessage('user', $("#condition").val(), message)

                redundantMessage(currentClue['explanation'], true, true)
            });

            $(document.body).on('click', '.showMatrixGrid', function (event) {
                var message = getButtonText('showMatrixGrid')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                $('#topic').val('Submit');
                $('#index').val("1");
                triggerEnterKeyEvent = false;
                getDataEvent();
                $("#nextButton").attr("disabled", false);
                $("#nextButton").show()
                
            });


            $(document.body).on('click', '.person', function (event) {
                var message = getButtonText('person')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                addMessage('bot', $("#condition").val(), 'Specific information for 4 personnel is available. Select the team member for which information is requested.');
                var navItems = []
                navItems = ["Alex", "Leon", "Rachel", "Tina"]
                userActionBlock = buildUserActionButtonGroup(navItems, condition, 'person')
                addActionBlock(userActionBlock)

            });

            $(document.body).on('click', '.alex', function (event) {
                var message = getButtonText('alex')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Alex'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific personnel.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Submit")
                //    $('#index').val("1")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();

                    
                //    $("#nextButton").attr("disabled", true);
                //    $("#nextButton").hide()
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });

                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Alex'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific personnel.',true,true);
                            }
                        }
                    }
                }
                
                
            });

            $(document.body).on('click', '.leon', function (event) {
                var message = getButtonText('leon')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Leon'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific personnel.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Leon'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific personnel.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.rachel', function (event) {
                var message = getButtonText('rachel')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Rachel'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific personnel.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Rachel'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific personnel.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.tina', function (event) {
                var message = getButtonText('tina')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Tina'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific personnel.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Tina'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific personnel.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.roles', function (event) {
                var message = getButtonText('roles')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                addMessage('bot', $("#condition").val(), 'Specific information for 4 of the project roles is available. Select the position for which information is requested.');
                var navItems = []
                navItems = ["Network <br /> Architect", "Systems <br /> Analyst", "Cybersecurity <br /> Specialist", "Database <br /> Administrator"]
                userActionBlock = buildUserActionButtonGroup(navItems, condition, 'roles')
                addActionBlock(userActionBlock)
            });

            $(document.body).on('click', '.networkArchitect', function (event) {
                var message = getButtonText('networkArchitect')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Network Architect'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific roles.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Network Architect'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific roles.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.systemsAnalyst', function (event) {
                var message = getButtonText('systemsAnalyst')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Systems Analyst'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific roles.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Systems Analyst'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific roles.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.cyberSpecialist', function (event) {
                var message = getButtonText('cyberSpecialist')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Cybersecurity Specialist'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific roles.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Cybersecurity Specialist'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific roles.',true,true);
                            }
                        }
                    }

                }
            });

            $(document.body).on('click', '.databaseAdmin', function (event) {
                var message = getButtonText('databaseAdmin')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Database Administrator'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific roles.',true,true);
                    
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Database Administrator'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific roles.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.locations', function (event) {
                var message = getButtonText('locations')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                addMessage('bot', $("#condition").val(), 'Specific information for 4 of the office locations is available. Select the branch for which information is requested.');
                var navItems = []
                navItems = ["Boston", "Chicago", "Seattle", "Los Angeles"]
                userActionBlock = buildUserActionButtonGroup(navItems, condition, 'locations')
                addActionBlock(userActionBlock)
            });

            $(document.body).on('click', '.boston', function (event) {
                var message = getButtonText('boston')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Boston'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific offices.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Boston'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific offices.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.chicago', function (event) {
                var message = getButtonText('chicago')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Chicago'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific offices.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Chicago'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific offices.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.seattle', function (event) {
                var message = getButtonText('seattle')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Seattle'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific offices.',true,true);
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {

                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Seattle'] = dataList
                            isUsed = true
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific offices.',true,true);
                            }
                        }
                    }
                }
            });

            $(document.body).on('click', '.losAngeles', function (event) {
                var message = getButtonText('losAngeles')
                var element = document.getElementById("chatDiv");
                element.removeChild(element.childNodes[element.childNodes.length - 1]);
                addMessage('user', $("#condition").val(), message)
                var dataList = sessionDictData['Los Angeles'];
                if (dataList.length == 0) {
                    redundantMessage('There is no more information available regarding specific offices.',true,true);
                    
                }
                //else if (sessionDictData['All'].length == 0) {
                //    redundantMessage('Status: All available information has been provided',true);
                //    $('#topic').val("Redundant")
                //    $('#index').val("22")
                //    triggerEnterKeyEvent = false;
                //    getDataEvent();
                //}
                else {
                    var allList = sessionDictData['All']
                    
                    var id = dataList.shift()
                    var isUsed = false
                    while (!isUsed) {
                        
                        if (allList.indexOf(id) > -1) {
                            $.ajax({
                                url: '/getRedundantClueById',
                                data: {
                                    'id': id
                                },
                                type: 'GET',
                                success: function (response) {

                                    var message = response["clue"];
                                    currentClue = message
                                    redundantMessage(message['clue'],true)
                                }
                            });
                            var allList = sessionDictData['All']
                            allList.splice(allList.indexOf(id), 1)
                            sessionDictData['All'] = allList
                            console.log(sessionDictData)
                            sessionDictData['Los Angeles'] = dataList
                            isUsed = true
                            
                        }
                        else {
                            if (dataList.length != 0) {
                                var id = dataList.shift()
                                isused = false
                            }
                            else {
                                isused = true
                                redundantMessage('There is no more information available regarding specific offices.',true,true);
                            }
                        }
                    }
                }
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

    function getButtonText(className) {
        var button = document.getElementsByClassName(className);
        var message = ''
        for (var i = 0; i < button[0].childNodes.length; i++) {
            if (button[0].childNodes[i].nodeName == '#text')
                message += button[0].childNodes[i].data
        }
        return message
    }

    function redundantMessage(message, isRepeat, explanationBlock = false) {
        addThinking('bot', $('#condition').val())
        $("#nextButton").attr("disabled", true);
        setTimeout(function () {
            $('#bot_thinking').remove();
            addMessage('bot', $('#condition').val(), message)
            if (isRepeat) {
                addMessage('bot', $('#condition').val(), 'Indicate if additional information is requested.')
                var navItems = []
                if ($('#condition').val()[2] != 'H' || explanationBlock) {
                    navItems = ["Yes, I would like <br /> to request specific information.", "No, I'm ready to make <br /> my final decisions."]
                }
                else {
                    navItems = ["Yes, I would like <br /> to request specific information.", "Explain the rationale <br /> for this information." ,"No, I'm ready to make <br /> my final decisions."]
                }
                userActionBlock = buildUserActionButtonGroup(navItems, $('#condition').val(), 'askRedundant')
                addActionBlock(userActionBlock)
            }
            else {
                $('#topic').val('Submit');
                $('#index').val("1");
                triggerEnterKeyEvent = false;
                getDataEvent();
                $("#nextButton").attr("disabled", false);
                $("#nextButton").show()
            }
        }, 1000);

        $("#nextButton").attr("disabled", false);

        
    }

    function initialDataSetup() {
        
        var conditionDict = {
            1:"LLL",
            2:"LLH",
            3:"LHL",
            4:"LHH",
            5:"HLL",
            6:"HLH",
            7:"HHL",
            8:"HHH"
        }
        console.log(window.location.href.split('/'))
        var condition = window.location.href.split('/').pop()
        console.log(conditionDict[condition])
        $('#condition').val(conditionDict[condition])
        onloadSetup();
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
                    if (response['condition'][0] == 'L') {
                        fillLowConditionContent(response, istriggerEnterKeyEventActive, isTaskCompleted);
                    }
                    else if (response['condition'][0] == 'H') {
                        
                        fillHighConditionContent(response, istriggerEnterKeyEventActive, isTaskCompleted);
                    }
                    
                }, 1000);
                //console.log("outside timeout")
                //$("#nextButton").attr("disabled", false);


                
            }
        });
    }

    function fillLowConditionContent(response, istriggerEnterKeyEventActive, isTaskCompleted) {
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
                message += '<br/>'
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
                message += '<b>Clue ' + (i + 1).toString() + '</b><br/>';
                message += '<b>Clue: </b>' + clues[i] + '<br/>';
                if (response['condition'][2] == 'H') {
                    message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                }
                message += '<br/>'
            }
            addMessage('bot', response["condition"], message);

            message = '';
            for (var i = 5; i < 10; i++) {
                message += '<b>Clue ' + (i + 1).toString() + '</b><br/>';
                message += '<b>Clue: </b>' + clues[i] + '<br/>';
                if (response['condition'][2] == 'H') {
                    message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                }
                message += '<br/>'
            }
            addMessage('bot', response["condition"], message);

            message = '';
            for (var i = 10; i < 15; i++) {
                message += '<b>Clue ' + (i + 1).toString() + '</b><br/>';
                message += '<b>Clue: </b>' + clues[i] + '<br/>';
                if (response['condition'][2] == 'H') {
                    message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                }
                message += '<br/>'
            }
            addMessage('bot', response["condition"], message);

            message = '';
            for (var i = 15; i < 20; i++) {
                message += '<b>Clue ' + (i + 1).toString() + '</b><br/>';
                message += '<b>Clue: </b>' + clues[i] + '<br/>';
                if (response['condition'][2] == 'H') {
                    message += '<b>Explanation: </b>' + explanations[i] + '<br/>';
                }
                message += '<br/>'
            }
            addMessage('bot', response["condition"], message);


            message = '';
            for (var i = 20; i < 22; i++) {
                message += '<b>Clue ' + (i + 1).toString() + '</b><br/>';
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

        //if (response['topic'] == 'Tutorial') {
        //    $('#clickableGrid').css('display', 'inline-block');
        //}

        //console.log(message)
        if (response['topic'] == 'Clue') {
            var seconds = new Date().getTime() / 1000;
            $('#timeTaken').val(seconds);
        }

        if (response['topic'] == 'Submit' && response['index'] == "2") {
            message = message + '<br/><br/>'
            addMessage('bot', response["condition"], message);
            message = getMatrixHtml()
            

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
            addMessage('user', response["condition"], $('#userName').val())
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
        if (response['topic'] == 'Submit' && response['index'] == "2" ) {
            addMessage('full', response["condition"], message);
        }
        else if ((response['topic'] != 'Redundant')){
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

            //alert("Task Completed. Click OK. Page will refresh in 3 seconds")
            //window.setTimeout(function () { location.reload() }, 3000)
            window.location.replace("https://usf.az1.qualtrics.com/jfe/form/SV_80LHjIFlXjQlfWl")
        }

        
    }

    function fillHighConditionContent(response, istriggerEnterKeyEventActive, isTaskCompleted) {
        $('#bot_thinking').remove();
        var message = '';
        var userActionBlock = ''
        if (response['topic'] == 'Clue') {
            var navItems = []

            triggerEnterKeyEvent = false
            $("#nextButton").attr("disabled", true);
            $("#nextButton").hide()
            if (response['condition'][2] == 'H') {
                navItems = ["Yes, I would <br /> like more information.", "Explanation this <br /> information.", "No, I'm ready to make <br /> my final decisions."]
            }
            else {
                navItems = ["Yes, I would <br /> like more information.", "No, I'm ready to make <br /> my final decisions."]
            }
            userActionBlock = buildUserActionButtonGroup(navItems, response['condition'], 'clueSelection')
            message = response["botResponse"][0]['clue'];
            currentClue = response["botResponse"][0]

        }
        else if (response['topic'] == 'Clue_End_Ins') {
            triggerEnterKeyEvent = true
            $("#nextButton").attr("disabled", false);
            $("#nextButton").show()
            message = response["botResponse"][0];
        }
        else if (response['topic'] == 'Redundant_Ins' && response['index'] == '4') {
            var navItems = []
            navItems = ["Yes, I would like <br /> to request specific information.", "No, I'm ready to make <br /> my final decisions."]            
            userActionBlock = buildUserActionButtonGroup(navItems, response['condition'], 'redundantConfirmation')
            message = response["botResponse"][0]
            triggerEnterKeyEvent = false
            $("#nextButton").attr("disabled", true);
            $("#nextButton").hide()
        }
        else if ((response['topic'] == 'Redundant_Ins' && response['index'] == '5') ) {
            sessionDictData = redundantDictData();
            message = response["botResponse"][0]
            triggerEnterKeyEvent = true
            $("#nextButton").attr("disabled", false);
            $("#nextButton").show()
        }
        else if (response['topic'] == 'Redundant') {
            //redundantBlock(response['condition'])
        }
        
        else {
            message = response["botResponse"][0];
        }
        if (response['topic'] == 'Clue') {
            var seconds = new Date().getTime() / 1000;
            $('#timeTaken').val(seconds);
        }

        if (response['topic'] == 'Submit' && response['index'] == "2") {
            message = message + '<br/><br/>'
            addMessage('bot', response["condition"], message);
            message = getMatrixHtml()
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



        if (($('#condition').val() == 'HHL' || $('#condition').val() == 'HHH') && response["topic"] == 'Introduction' && response["index"] == "2") {
            $("#userMessage").show();
            $('#userMessage').focus()
            $('#userInputType').val("name")

        }
        else if ($('#userInputType').val() == 'name') {
            message = message + ' ' + $('#userMessage').val();
            $('#userName').val($('#userMessage').val())
            addMessage('user', response["condition"], $('#userName').val())
            $("#userMessage").hide();
            $('#userInputType').val("");
        }
        else if (($('#condition').val() == 'HHL') && response["topic"] == 'Tutorial' && response["index"] == "12"
            || ($('#condition').val() == 'HHH') && response["topic"] == 'Tutorial' && response["index"] == "33"
            || ($('#condition').val() == 'HHL') && response["topic"] == 'Conclusion' && response["index"] == "1"
            || ($('#condition').val() == 'HHH') && response["topic"] == 'Conclusion' && response["index"] == "1") {
            var msgs = message.split("[Name]");

            message = msgs[0] + $('#userName').val() + msgs[1];

        }
        
        if (response['topic'] == 'Submit' && response['index'] == "2") {
            addMessage('full', response["condition"], message);
        }
        else if ((response['topic'] != 'Redundant')) {
            addMessage('bot', response["condition"], message);
        }
        

        if (response['condition'][0] == 'H') {
            addActionBlock(userActionBlock)
        }
        if ((response['topic'] == 'Redundant_Ins' && response['index'] == '5')) {
            
            redundantBlock(response['condition'])
            $('#topic').val('Redundant')
            triggerEnterKeyEvent = false
            $("#nextButton").attr("disabled", true);
            $("#nextButton").hide()
        }
        $("#nextButton").attr("disabled", false);
        if (response['topic'] == 'Clue' || response['topic'] == 'Redundant') {
            
        }
        else {
            if (istriggerEnterKeyEventActive) {
                triggerEnterKeyEvent = true;
            }
            else {
                triggerEnterKeyEvent = false;
            }
        }
        if (isTaskCompleted) {

            //alert("Task Completed. Click OK. Page will refresh in 3 seconds")
            //window.setTimeout(function () { location.reload() }, 3000)
            window.location.replace("https://usf.az1.qualtrics.com/jfe/form/SV_80LHjIFlXjQlfWl")
        }


    }

    function redundantBlock(condition) {
        addMessage('bot', condition, 'Select a category to obtain information.');
        var navItems = []
        navItems = ["Person", "Roles", "Locations"]
        userActionBlock = buildUserActionButtonGroup(navItems, condition, 'category')
        addActionBlock(userActionBlock)

    }


    function redundantDictData() {
        var data = {
            "All": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
            "Alex": [20, 21],
            "Leon": [14, 15],
            "Rachel": [7, 9, 11],
            "Tina": [1, 2, 3, 8],
            "Network Architect": [20, 22],
            "Systems Analyst": [2, 4, 5],
            "Cybersecurity Specialist": [17, 18],
            "Database Administrator": [9, 10, 13],
            "Boston": [17, 19],
            "Chicago": [14, 16],
            "Seattle": [1, 4, 6],
            "Los Angeles": [7, 8, 10, 12]
        }
        return data
    }

    function buildUserActionButtonGroup(content,condition,type) {
        var html = ''
        html += `<div class='actionBlock' style="margin: 26px 0 26px;overflow: hidden;">
                        <div style="display: inline-block;text-align: center;width: 100%;">
                            <div style="display: inline-block;">
                                <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">`
        for (var i = 0; i < content.length; i++) {
            html += `<div class="btn-group btn-group-sm mr-2" role="group" aria-label="First group">`
            if (type == 'clueSelection') {
                if (condition[2] == 'H') {
                    if (i == 0) {
                        html += `<button type="button" class="btn btn-secondary showNextClue" style="font-size:10px">`
                    }
                    else if (i == 1) {
                        html += `<button type="button" class="btn btn-secondary showClueExplanation" style="font-size:10px">`
                    }
                    else if (i == 2) {
                        html += `<button type="button" class="btn btn-secondary showMatrixGrid" style="font-size:10px">`
                    }
                }
                else {
                    if (i == 0) {
                        html += `<button type="button" class="btn btn-secondary showNextClue" style="font-size:10px">`
                    }
                    else if (i == 1) {
                        html += `<button type="button" class="btn btn-secondary showMatrixGrid" style="font-size:10px">`
                    }
                    
                }
                
            }
            else if (type == 'redundantConfirmation') {
                if (i == 0) {
                    html += `<button type="button" class="btn btn-secondary showNextClue" style="font-size:10px">`
                }
                else if (i == 1) {
                    html += `<button type="button" class="btn btn-secondary showMatrixGrid" style="font-size:10px">`
                }

            }
            else if (type == 'askRedundant') {
                if (condition[2] == 'H') {
                    if (i == 0) {
                        html += `<button type="button" class="btn btn-secondary showNextClue" style="font-size:10px">`
                    }
                    else if (i == 1) {
                        html += `<button type="button" class="btn btn-secondary showMatrixGrid" style="font-size:10px">`
                    }
                }
                

            }
            else if (type == 'category') {
                if (i == 0) {
                    html += `<button type="button" class="btn btn-secondary person" style="font-size:10px">`
                }
                else if (i == 1) {
                    html += `<button type="button" class="btn btn-secondary roles" style="font-size:10px">`
                }
                else if (i == 2) {
                    html += `<button type="button" class="btn btn-secondary locations" style="font-size:10px">`
                }
                
            }
            else if (type == 'person') {
                if (i == 0) {
                    html += `<button type="button" class="btn btn-secondary alex" style="font-size:10px">`
                }
                else if (i == 1) {
                    html += `<button type="button" class="btn btn-secondary leon" style="font-size:10px">`
                }
                else if (i == 2) {
                    html += `<button type="button" class="btn btn-secondary rachel" style="font-size:10px">`
                }
                else if (i == 3) {
                    html += `<button type="button" class="btn btn-secondary tina" style="font-size:10px">`
                } 
            }
            else if (type == 'roles') {
                if (i == 0) {
                    html += `<button type="button" class="btn btn-secondary networkArchitect" style="font-size:10px">`
                }
                else if (i == 1) {
                    html += `<button type="button" class="btn btn-secondary systemsAnalyst" style="font-size:10px">`
                }
                else if (i == 2) {
                    html += `<button type="button" class="btn btn-secondary cyberSpecialist" style="font-size:10px">`
                }
                else if (i == 3) {
                    html += `<button type="button" class="btn btn-secondary databaseAdmin" style="font-size:10px">`
                }
            }
            else if (type == 'locations') {
                if (i == 0) {
                    html += `<button type="button" class="btn btn-secondary boston" style="font-size:10px">`
                }
                else if (i == 1) {
                    html += `<button type="button" class="btn btn-secondary chicago" style="font-size:10px">`
                }
                else if (i == 2) {
                    html += `<button type="button" class="btn btn-secondary seattle" style="font-size:10px">`
                }
                else if (i == 3) {
                    html += `<button type="button" class="btn btn-secondary losAngeles" style="font-size:10px">`
                }
            }
            
            html += content[i]
            html += `</button></div>`
        }

        html += `</div></div></div></div>`

        return html;
    }

    

    function getMatrixHtml() {
        var html = ` <div id = 'matrixResult' class='table-responsive-sm' style = 'width:130%' >
            <table class='table table-sm' >
                <thead>
                    <tr style='font-size: 10px;font-weight:bold;'>
                        <th scope='col'>Team Member</th>
                        <th scope='col'>Role</th>
                        <th scope='col'>Pjt hrs/wk</th>
                        <th scope='col'>Location</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style='font-size: 14px;font-weight:bold;'>Alex</td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>Network Architect</option>
                                <option value='2'>Quality Assurance Engineer</option>
                                <option value='3'>Systems Analyst</option>
                                <option value='4'>Cyber Security Specalist</option>
                                <option value='5'>Database Administrator</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>4</option>
                                <option value='2'>6</option>
                                <option value='3'>8</option>
                                <option value='4'>10</option>
                                <option value='5'>12</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>New York</option>
                                <option value='2'>Boston</option>
                                <option value='3'>Chicago</option>
                                <option value='4'>Seattle</option>
                                <option value='5'>Los Angeles</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 14px;font-weight:bold;'>Leon</td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>Network Architect</option>
                                <option value='2'>Quality Assurance Engineer</option>
                                <option value='3'>Systems Analyst</option>
                                <option value='4'>Cyber Security Specalist</option>
                                <option value='5'>Database Administrator</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>4</option>
                                <option value='2'>6</option>
                                <option value='3'>8</option>
                                <option value='4'>10</option>
                                <option value='5'>12</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>New York</option>
                                <option value='2'>Boston</option>
                                <option value='3'>Chicago</option>
                                <option value='4'>Seattle</option>
                                <option value='5'>Los Angeles</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 14px;font-weight:bold;'>Michael</td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>Network Architect</option>
                                <option value='2'>Quality Assurance Engineer</option>
                                <option value='3'>Systems Analyst</option>
                                <option value='4'>Cyber Security Specalist</option>
                                <option value='5'>Database Administrator</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>4</option>
                                <option value='2'>6</option>
                                <option value='3'>8</option>
                                <option value='4'>10</option>
                                <option value='5'>12</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>New York</option>
                                <option value='2'>Boston</option>
                                <option value='3'>Chicago</option>
                                <option value='4'>Seattle</option>
                                <option value='5'>Los Angeles</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 14px;font-weight:bold;'>Rachel</td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>Network Architect</option>
                                <option value='2'>Quality Assurance Engineer</option>
                                <option value='3'>Systems Analyst</option>
                                <option value='4'>Cyber Security Specalist</option>
                                <option value='5'>Database Administrator</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>4</option>
                                <option value='2'>6</option>
                                <option value='3'>8</option>
                                <option value='4'>10</option>
                                <option value='5'>12</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>New York</option>
                                <option value='2'>Boston</option>
                                <option value='3'>Chicago</option>
                                <option value='4'>Seattle</option>
                                <option value='5'>Los Angeles</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td style='font-size: 14px;font-weight:bold;'>Tina</td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>Network Architect</option>
                                <option value='2'>Quality Assurance Engineer</option>
                                <option value='3'>Systems Analyst</option>
                                <option value='4'>Cyber Security Specalist</option>
                                <option value='5'>Database Administrator</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>4</option>
                                <option value='2'>6</option>
                                <option value='3'>8</option>
                                <option value='4'>10</option>
                                <option value='5'>12</option>
                            </select>
                        </td>
                        <td>
                            <select class='form-control form-control-sm'>
                                <option value='0'>Select</option>
                                <option value='1'>New York</option>
                                <option value='2'>Boston</option>
                                <option value='3'>Chicago</option>
                                <option value='4'>Seattle</option>
                                <option value='5'>Los Angeles</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table >
            <div><span style='display:none;color:red;font-size:9px'>* All the values should be selected.</span></div></div >`
        return html
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
            html = "<div class='user_msg_div'><div class='user_msg_img'><img src='../static/images/user.png' alt='Avatar' style='width:100%;'></div><div class='user_msg_main_div'><p style='word-wrap: break-word'>" + message + "</p></div></div>"
        }
        else if (type == 'bot') {
            if (condition[1] == 'H') {
                html = "<div class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/man.png' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='bot_msg_inner_div'><p style='word-wrap: break-word'>" + message + "</p></div></div></div>"
            }
            else {
                html = "<div class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/bot3.jpg' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='bot_msg_inner_div'><p style='word-wrap: break-word'>" + message + "</p></div></div></div>"
            }
            
        }
        else {
            if (condition[1] == 'H') {
                html = "<div class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/man.png' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='submit_msg_inner_div'><p style='word-wrap: break-word'>" + message + "</p></div></div></div>"
            }
            else {
                html = "<div class='bot_msg_div'><div class='bot_msg_img'><img src='../static/images/bot3.jpg' alt='Avatar' style='width:100%;'></div><div class='bot_msg_main_div'><div class='submit_msg_inner_div'><p style='word-wrap: break-word'>" + message + "</p></div></div></div>"
            }
        }
        $('#chatDiv').append(html)
        var element = document.getElementById("chatDiv");
        element.scrollTop = element.scrollHeight;
    }

    function addActionBlock(content) {
        $('#chatDiv').append(content)
        var element = document.getElementById("chatDiv");
        element.scrollTop = element.scrollHeight;

       
    }

    function gridSubmit() {
        $('#submitButton').click(function () {
            var rows = document.querySelector('#matrixResult').getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            var errorMsg = document.querySelector('#matrixResult').getElementsByTagName('span')[0]
            var isValid = true
            var result = {}
            for (var row = 0; row < rows.length; row++) {
                var role = rows[row].getElementsByTagName('td')[1].getElementsByTagName('select')[0].value
                var projectHours = rows[row].getElementsByTagName('td')[2].getElementsByTagName('select')[0].value
                var location = rows[row].getElementsByTagName('td')[3].getElementsByTagName('select')[0].value
                if (role == "0" || projectHours == "0" || location == "0") {
                    $('#matrixResult div span').css('display', 'inline-block');
                    isValid = false
                    break
                }
                result[row+1] = {
                    "role": role,
                    "projectHours": projectHours,
                    "location": location
                }
                
            }
            
            if (isValid) {
                console.log(JSON.stringify(result))
                $('#matrixResult div span').css('display', 'none');
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
                //triggerEnterKeyEvent = true;
                triggerEnterKeyEvent = false;
                getDataEvent();
            }
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


