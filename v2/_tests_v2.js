// var URL_API = "http://taxiapp3.orisma.alpha/v2/";
var URL_API_PRO = "https://203.151.165.162/v2/";
var URL_API_PRO = "https://203.151.165.162/v2/";
var URL_CURL = "http://taximail2015.orisma.alpha/ajaxtest/v2/curl.php";
var SessionID;
var LIST_NAME = "List eInvoice [2015-10-27 17:43:31]";

var now = new Date();
var rand_name = Math.floor((Math.random() * 100000) + 1);
var AJAX_MODE_REQUEST = 0;
var AJAX_ERROR_REQUEST = false;
var AB_ENABLE = false;
var LIST_STATE = 0;

QUnit.config.urlConfig.push({
    id: 'error_test',
    value: 'error_test',
    label: 'Show Error Test',
    tooltip: "Show with error test case."
},{
    id: 'mode',
    value: { list: 'List', campaign: 'Campaign' , transactional: 'Transactional' },
    label: 'Select Mode',
    tooltip: 'Select test case mode.'
});

var params = document.location.search.substr(1).split('&');

checkQueryString(params);

if(AJAX_MODE_REQUEST == 2){
    QUnit.config.urlConfig.push({
        id: 'ab_enable',
        value: 'ab_enable',
        label: 'AB enabled',
        tooltip: "Show only AB Split Testing"
    });

    var params2 = document.location.search.substr(1).split('&');

    $.each(params2,function(i,val){
        if(val === "ab_enable=ab_enable"){
            AB_ENABLE = true;
        }
    });
} else if(AJAX_MODE_REQUEST == 1){
    QUnit.config.urlConfig.push({
        id: 'state',
        value: { customfield: 'Customfield' , subscriber:'Subscribers', segment:'Segment' },
        label: 'List State',
        tooltip: 'Select test case list mode.'
    });

    var params2 = document.location.search.substr(1).split('&');

    $.each(params2,function(i,val){
        if(val === "state=customfield"){
            LIST_STATE = 1;
        } else if(val === "state=subscriber"){
            LIST_STATE = 2;
        } else if(val === "state=segment"){
            LIST_STATE = 3;
        }
    });
}

function checkQueryString(params){
    $.each(params,function(i,val){
        if(val === ""){
            AJAX_MODE_REQUEST = 0;
            AJAX_ERROR_REQUEST = false;
        } else if (val === "error_test=error_test"){
            AJAX_ERROR_REQUEST = true;

            if(val === "mode=list"){
                AJAX_MODE_REQUEST = 1;
            } else if(val === "mode=campaign") {
                AJAX_MODE_REQUEST = 2;
            } else if(val === "mode=transactional") {
                AJAX_MODE_REQUEST = 3;
            }
        } else if (val === "mode=list"){
            AJAX_MODE_REQUEST = 1;
            if(val === "error_test=error_test"){
               AJAX_ERROR_REQUEST = true;
            }
        } else if (val === "mode=campaign"){
            AJAX_MODE_REQUEST = 2;
            if(val === "error_test=error_test"){
                AJAX_ERROR_REQUEST = true;
            }
        } else if (val === "mode=transactional"){
            AJAX_MODE_REQUEST = 3;
            if(val === "error_test=error_test"){
                AJAX_ERROR_REQUEST = true;
            }
        }
    });
}

if(SessionID == "" || SessionID == null || SessionID == undefined ){
 
    QUnit.test("API v2.0 : User Login", function(assert){
        var done = assert.async();
        $.ajax({
            type: "POST",
            url: URL_API+"user/login",
            data:{
                "username": "wongsakorn@orisma.com",
                "password": "111111",
                "remember": "T"
            },
            dataType:"json",
            error:function(e){
                assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                done();
            },
            success:function(res,status,e){

                SessionID = e.responseJSON['data']['session_id'];
                assert.equal(res['status'],'success',"ajax status : "+res['status']);
                assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                done();
            },
            complete:function(){
                unitTestStart();
            }
        });
    });
} else {
    unitTestStart();
}

function unitTestStart(){

    if(AJAX_MODE_REQUEST == "1"){

        QUnit.module("List Test", function( hooks ) {

            unitAsyncTest('List Get','list','GET',
            {
                "session_id": SessionID,
                "page": "1",
                "limit" : "15",
                "order_field": "create_date",
                "order_type": "desc",
            });

            if(AJAX_ERROR_REQUEST){

                QUnit.module("List Error Test", function( hooks ) {
                    unitAsyncTest('List Get [ 400 ]','list','GET',
                    {
                        "sessiid": SessionID,
                        "page": "1",
                        "limit" : "",
                        "order_field": "create_date",
                        "order_type": "desc"
                    },"400");

                    unitAsyncTest('List Get [ 401 ]','list','GET',
                    {
                        "session_id": "XXXX",
                        "page": "1",
                        "limit" : "15",
                        "order_field": "create_date",
                        "order_type": "desc",
                    },"401");

                    unitAsyncTest('List Create [ 400 ]','list','POST',
                    {
                        "sessiid": SessionID,
                    },"400");

                    unitAsyncTest('List Create [ 401 ]','list','POST',
                    {
                        "session_id": "XXXX",
                    },"401");
                });
            }

            QUnit.test("API v.2.0 : List Create Draft", function(assert){
                var done = assert.async();
                $.ajax({
                    type: "post",
                    url: URL_API+"list",
                    data:{  "session_id": SessionID
                    
                    },
                    dataType:"json",
                    error:function(e){
                        assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                        assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                        assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                        assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                        done();
                    },
                    success:function(res,status,e){
                        assert.equal(res['status'],'success',"ajax status : "+res['status']);
                        assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                        assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                        assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                        done();
                    },
                    complete:function(e){
                        var data = eval('('+e.responseText+')');
                        list_id = data['data']['list_id'];
                        QUnit.module("List Test", function( hooks ) {
                            ListUnitTest(list_id);
                        });
                    }
                });
            });
        });
    }

    if(AJAX_MODE_REQUEST == "2"){

        QUnit.module("Campaign Test", function( hooks ) {

            unitAsyncTest('Campaign Get','campaign','GET',
            {
                "session_id": SessionID,
                "campaign_mode" : "Sent",
                "page": "1",
                "limit" : "15",
                "order_field": "create_date",
                "order_type": "desc"
            });

            if(AJAX_ERROR_REQUEST){
                QUnit.module("Campaign Error Test", function( hooks ) {
                                
                    unitAsyncTest('Campaign Get [ 400 ]','campaign','GET',
                    {
                        "seon_id": SessionID,
                        "campaign_mode" : "Sent",
                        "page": "1",
                        "limit" : "15",
                        "order_field": "create_date",
                        "order_type": "desc"
                    },"400");

                    unitAsyncTest('Campaign Get [ 401 ]','campaign','GET',
                    {
                        "session_id": "SessionID",
                        "campaign_mode" : "Sent",
                        "page": "1",
                        "limit" : "15",
                        "order_field": "create_date",
                        "order_type": "desc"
                    },"401");

                    unitAsyncTest('Campaign Create [ 400 ]','campaign','POST',
                    {
                        "sion_id": SessionID,
                        "split_testing": "enabled"
                    },"400");

                    unitAsyncTest('Campaign Create [ 401 ]','campaign','POST',
                    {
                        "session_id": "SessionID",
                        "split_testing": "enabled"
                    },"401");
                });
            }
            if(!AB_ENABLE){
                QUnit.test("API v.2.0 : Campaign Create", function(assert){
                    var done = assert.async();
                    $.ajax({
                        type: "POST",
                        url: URL_API+"campaign",
                        data:{  "session_id": SessionID,
                                "split_testing": "disable"
                        },
                        dataType:"json",
                        error:function(e,status){
                            assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                            assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                            assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                            assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                            done();
                        },
                        success:function(res,status,e){
                            assert.equal(res['status'],'success',"ajax status : "+res['status']);
                            assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                            assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                            assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                            done();
                        },
                        complete:function(e){
                            var data = eval('('+e.responseText+')');
                            var campaign_id = data['data']['campaign_id'];
                            var email_id = data['data']['email_id'];
                            QUnit.module("Campaign Test", function( hooks ) {
                                CampaignUnitTest(email_id,campaign_id);
                            });
                        }
                    });
                });
            } else {
                QUnit.module("AB Split Testing", function( hooks ) {
                    QUnit.test("API v.2.0 : Campaign Create", function(assert){
                        var done = assert.async();
                        $.ajax({
                            type: "POST",
                            url: URL_API+"campaign",
                            data:{  "session_id": SessionID,
                                    "split_testing": "enable"
                            },
                            dataType:"json",
                            error:function(e,status){
                                assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                                assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                                assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                                assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                                done();
                            },
                            success:function(res,status,e){
                                assert.equal(res['status'],'success',"ajax status : "+res['status']);
                                assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                                assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                                assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                                done();
                            },
                            complete:function(e){
                                var data = eval('('+e.responseText+')');
                                var campaign_id = data['data']['campaign_id'];
                                var email_id = data['data']['email_id'];
                                QUnit.module("Campaign Test", function( hooks ) {
                                    QUnit.module("AB Split Testing", function( hooks ) {
                                        CampaignUnitTest(email_id,campaign_id);
                                    });
                                });
                            }
                        });
                    });
                });
            }
        });
    }

    if(AJAX_MODE_REQUEST == "3"){
        QUnit.module("Transactional Test", function( hooks ) {

            unitAsyncTest('Transactional Get','transactional','GET',
                {
                    "session_id": SessionID,
                });

            if(AJAX_ERROR_REQUEST){
                QUnit.module("Transactional Error Test", function( hooks ) {

                    unitAsyncTest('Transactional Get [400]','transactional','GET',
                    {
                        "seon_id": SessionID,
                    },"400");

                    unitAsyncTest('Transactional Get [401]','transactional','GET',
                    {
                        "session_id": "SessionID",
                    },"401");
                });
            }

            QUnit.test("API v.2.0 : Transactional Send Transaction Email", function(assert){
                var done = assert.async();
                $.ajax({
                    type: "POST",
                    url: URL_API_PRO+"transactional",
                    data:{  "session_id": SessionID,
                            "message_id": "msg"+SessionID,
                            "transactional_group_name":"Welcome",
                            "subject": "New Member Welcome",
                            "to_name": "John Smith",
                            "to_email": "kritsada@orisma.com",
                            "from_name": "Customer Support",
                            "from_email": "support@example.com",
                            "reply_name": "Customer Support",
                            "reply_email": "support@example.com",
                            "template_key": "16567a52906fb2a",
                            "content_html": "",
                            "content_plain": "",
                            "report_type": "Full"
                    },
                    dataType:"json",
                    error:function(e,status){
                        assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                        assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                        assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                        assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                        done();
                    },
                    success:function(res,status,e){
                        assert.equal(res['status'],'success',"ajax status : "+res['status']);
                        assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                        assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                        assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                        done();
                    },
                    complete:function(e){
                        QUnit.module("Transactional Test", function( hooks ) {
                            TransactionalUnitTest("msg"+SessionID);
                        });
                    }
                });
            });

        });
    }
}

function TransactionalUnitTest(message_id){

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Transactional Error Test", function( hooks ) {

            unitAsyncTest('Transactional Send Transaction Email [400]','transactional','POST',
                {
                    "session_id": SessionID,
                    "mge_id": "msg"+SessionID,
                    "transactional_group_name":"Welcome",
                    "subject": "New Member Welcome",
                    "to_name": "John Smith",
                    "to_email": "kritsada@orisma.com",
                    "from_name": "Customer Support",
                    "from_email": "support@example.com",
                    "reply_name": "Customer Support",
                    "reply_email": "support@example.com",
                    "template_key": "16567a52906fb2a",
                    "content_html": "",
                    "content_plain": "",
                    "report_type": "Full"
                },"400","pro");

            unitAsyncTest('Transactional Send Transaction Email [401]','transactional','POST',
                {
                    "session_id": "SessionID",
                    "message_id": "msg"+SessionID,
                    "transactional_group_name":"Welcome",
                    "subject": "New Member Welcome",
                    "to_name": "John Smith",
                    "to_email": "kritsada@orisma.com",
                    "from_name": "Customer Support",
                    "from_email": "support@example.com",
                    "reply_name": "Customer Support",
                    "reply_email": "support@example.com",
                    "template_key": "16567a52906fb2a",
                    "content_html": "",
                    "content_plain": "",
                    "report_type": "Full"
                },"401","pro");

            unitAsyncTest('Transactional Send Transaction Email [403]','transactional','POST',
                {
                    "session_id": SessionID,
                    "message_id": "msg"+SessionID,
                    "transactional_group_name":"Welcome",
                    "subject": "New Member Welcome",
                    "to_name": "John Smith",
                    "to_email": "john@example.com",
                    "from_name": "Customer Support",
                    "from_email": "support@example.com",
                    "reply_name": "Customer Support",
                    "reply_email": "support@example.com",
                    "template_key": "16567a52906fb2a",
                    "content_html": "",
                    "content_plain": "",
                    "report_type": "Full"
                },"403","pro");

            unitAsyncTest('Transactional Send Transaction Email [409]','transactional','POST',
                {
                    "session_id": SessionID,
                    "message_id": "msg"+SessionID,
                    "transactional_group_name":"Welcome",
                    "subject": "New Member Welcome",
                    "to_name": "John Smith",
                    "to_email": "kritsada@orisma.com",
                    "from_name": "Customer Support",
                    "from_email": "support@example.com",
                    "reply_name": "Customer Support",
                    "reply_email": "support@example.com",
                    "template_key": "16567a52906fb2a",
                    "content_html": "",
                    "content_plain": "",
                    "report_type": "Full"
                },"409","pro");

            // unitAsyncTest('Transactional Send Transaction Email [503]','transactional','POST',
            //     {
            //         "session_id": SessionID,
            //         "message_id": "msg"+SessionID,
            //         "transactional_group_name":"Welcome",
            //         "subject": "New Member Welcome",
            //         "to_name": "John Smith",
            //         "to_email": "kritsada@orisma.com",
            //         "from_name": "Customer Support",
            //         "from_email": "support@example.com",
            //         "reply_name": "Customer Support",
            //         "reply_email": "support@example.com",
            //         "template_key": "16567a52906fb2a",
            //         "content_html": "",
            //         "content_plain": "",
            //         "report_type": "Full"
            //     },"503","pro");
        });
    }

    unitAsyncTest('Transactional Stat Message','transactional'+'/'+message_id,'GET',
        {
            "session_id": SessionID
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Transactional Error Test", function( hooks ) {
            unitAsyncTest('Transactional Stat Message [400]','transactional'+'/'+message_id,'GET',
            {
                "seion_id": SessionID
            },"400","pro");

            unitAsyncTest('Transactional Stat Message [401]','transactional'+'/'+message_id,'GET',
            {
                "session_id": "SessionID"
            },"401","pro");

            unitAsyncTest('Transactional Stat Message [404]','transactional'+'/'+(message_id+2),'GET',
            {
                "session_id": SessionID
            },"404","pro");
        });
    }
}

function CampaignUnitTest(email_id,campaign_id){

    unitAsyncTest('Campaign Detail','campaign'+'/'+campaign_id,'GET',
        {
            "session_id": SessionID
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Campaign Error Test", function( hooks ) {
            unitAsyncTest('Campaign Detail [ 400 ]','campaign'+'/'+campaign_id,'GET',
                {
                    "sen_id": SessionID
                },"400");

            unitAsyncTest('Campaign Detail [ 401 ]','campaign'+'/'+campaign_id,'GET',
                {
                    "session_id": "SessionID"
                },"401");

            unitAsyncTest('Campaign Detail [ 404 ]','campaign'+'/'+(campaign_id+1),'GET',
                {
                    "session_id": SessionID
                },"404");
        });
    }

    unitAsyncTestCurl('Campaign Update',
        {
            "session_id" : SessionID,
            "method": 'PUT',
            "url": URL_API+'campaign'+'/'+campaign_id,
            "campaign_name" : "Campaign Update "+now,
            "campaign_status" : "Ready",
            "high_priority" : false,
            "lists_and_segments" : "191:0",
            "schedule_type" : "Future",
            "send_date" : "2015-12-30",
            "send_time" : "13:00:00",
            "trigger_type" : "custom",
            "trigger_format" : "json",
            "trigger_open_click" : "unique",
            "trigger_url" : "https://my.webservice.com/callback_trigger",
            "campaign_ref_tag" : "my_campaign",
            "enable_google_analytics" : false
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Campaign Error Test", function( hooks ) {
            unitAsyncTestCurl('Campaign Update [ 400 ]',
                {
                    "sesn_id" : SessionID,
                    "method": 'PUT',
                    "url": URL_API+'campaign'+'/'+campaign_id,
                    "campaign_name" : "Campaign Update "+now,
                    "campaign_status" : "Draft",
                    "high_priority" : false,
                    "lists_and_segments" : "191:0",
                    "schedule_type" : "Future",
                    "send_date" : "2015-12-30",
                    "send_time" : "13:00:00",
                    "trigger_type" : "custom",
                    "trigger_format" : "json",
                    "trigger_open_click" : "unique",
                    "trigger_url" : "https://my.webservice.com/callback_trigger",
                    "campaign_ref_tag" : "my_campaign",
                    "enable_google_analytics" : false
                },"400");

            unitAsyncTestCurl('Campaign Update [ 401 ]',
                {
                    "session_id" : "SessionID",
                    "method": 'PUT',
                    "url": URL_API+'campaign'+'/'+campaign_id,
                    "campaign_name" : "Campaign Update "+now,
                    "campaign_status" : "Draft",
                    "high_priority" : false,
                    "lists_and_segments" : "191:0",
                    "schedule_type" : "Future",
                    "send_date" : "2015-12-30",
                    "send_time" : "13:00:00",
                    "trigger_type" : "custom",
                    "trigger_format" : "json",
                    "trigger_open_click" : "unique",
                    "trigger_url" : "https://my.webservice.com/callback_trigger",
                    "campaign_ref_tag" : "my_campaign",
                    "enable_google_analytics" : false
                },"401");

            unitAsyncTestCurl('Campaign Update [ 404 ]',
                {
                    "session_id" : SessionID,
                    "method": 'PUT',
                    "url": URL_API+'campaign'+'/'+(campaign_id+1),
                    "campaign_name" : "Campaign Update "+now,
                    "campaign_status" : "Draft",
                    "high_priority" : false,
                    "lists_and_segments" : "191:0",
                    "schedule_type" : "Future",
                    "send_date" : "2015-12-30",
                    "send_time" : "13:00:00",
                    "trigger_type" : "custom",
                    "trigger_format" : "json",
                    "trigger_open_click" : "unique",
                    "trigger_url" : "https://my.webservice.com/callback_trigger",
                    "campaign_ref_tag" : "my_campaign",
                    "enable_google_analytics" : false
                },"404");

            unitAsyncTest('Create Email [ 400 ]','campaign'+'/'+campaign_id+'/'+'email','POST',
                {
                    "sen_id": SessionID
                },"400");

            unitAsyncTest('Create Email [ 401 ]','campaign'+'/'+campaign_id+'/'+'email','POST',
                {
                    "session_id": "SessionID"
                },"401");

            unitAsyncTest('Create Email [ 404 ]','campaign'+'/'+(campaign_id+1)+'/'+'email','POST',
                {
                    "session_id": SessionID
                },"404");
        });
    }

    if(AB_ENABLE){
        QUnit.test("API v.2.0 : Create Email", function(assert){
            var done = assert.async();
            $.ajax({
                type: "POST",
                url: URL_API+'campaign'+'/'+campaign_id+'/'+'email',
                data:{  "session_id": SessionID
                },
                dataType:"json",
                error:function(e){
                    assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                    assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                    assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                    done();
                },
                success:function(res,status,e){
                    assert.equal(res['status'],'success',"ajax status : "+res['status']);
                    assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                    assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                    done();
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var email_id = data['data']['email_id'];
                    QUnit.module("Campaign Test", function( hooks ) {
                        QUnit.module("AB Split Testing", function( hooks ) {
                            CampaignEmailTest(email_id,campaign_id);
                        });
                    });
                }
            });
        });
    } else {
        CampaignEmailTest(email_id,campaign_id);
    }
}

function CampaignEmailTest(email_id,campaign_id){

    unitAsyncTest('Campaign Email Get','campaign'+'/'+campaign_id+'/'+'email','GET',
        {
            "session_id": SessionID
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Campaign Error Test", function( hooks ) {
            unitAsyncTest('Campaign Email Get [ 404 ]','campaign'+'/'+campaign_id+'/'+'email','GET',
                {
                    "ses_id": SessionID
                },"400");

            unitAsyncTest('Campaign Email Get [ 404 ]','campaign'+'/'+campaign_id+'/'+'email','GET',
                {
                    "session_id": "SessionID"
                },"401");

            unitAsyncTest('Campaign Email Get [ 404 ]','campaign'+'/'+(campaign_id+1)+'/'+'email','GET',
                {
                    "session_id": SessionID
                },"404");
        });
    }

    unitAsyncTest('Campaign Email Get Detail','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id,'GET',
        {
            "session_id": SessionID
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Campaign Error Test", function( hooks ) {
            unitAsyncTest('Campaign Email Get Detail [400]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id,'GET',
            {
                "son_id": SessionID
            },"400");

            unitAsyncTest('Campaign Email Get Detail [401]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id,'GET',
            {
                "session_id": "SessionID"
            },"401");

            unitAsyncTest('Campaign Email Get Detail [404','campaign'+'/'+campaign_id+'/'+'email'+'/'+(email_id+1),'GET',
            {
                "session_id": SessionID
            },"404");

            unitAsyncTest('Campaign Email Get Detail [404]','campaign'+'/'+(campaign_id+1)+'/'+'email'+'/'+email_id,'GET',
            {
                "session_id": SessionID
            },"404");
        });
    }

    unitAsyncTestCurl('Campaign Email Update',
            {
                "session_id": SessionID,
                "method": 'PUT',
                "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id,
                "subject": "This is subject",
                "from_name": "john",
                "from_email": "john@gmail.com",
                "reply_name": "sarah",
                "reply_email": "sarah@gmail.com",
                "template_key": "1655f9358c49468"
            });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Campaign Error Test", function( hooks ) {
            unitAsyncTestCurl('Campaign Email Update [400]',
                {
                    "sen_id": SessionID,
                    "method": 'PUT',
                    "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id,
                    "subject": "This is subject",
                    "from_name": "john",
                    "from_email": "john@gmail.com",
                    "reply_name": "sarah",
                    "reply_email": "sarah@gmail.com",
                    "template_key": "1655f9358c49468"
                },"400");

            unitAsyncTestCurl('Campaign Email Update [401]',
                {
                    "session_id": "SessionID",
                    "method": 'PUT',
                    "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id,
                    "subject": "This is subject",
                    "from_name": "john",
                    "from_email": "john@gmail.com",
                    "reply_name": "sarah",
                    "reply_email": "sarah@gmail.com",
                    "template_key": "1655f9358c49468"
                },"401");

            unitAsyncTestCurl('Campaign Email Update [404]',
                {
                    "session_id": SessionID,
                    "method": 'PUT',
                    "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+(email_id+1),
                    "subject": "This is subject",
                    "from_name": "john",
                    "from_email": "john@gmail.com",
                    "reply_name": "sarah",
                    "reply_email": "sarah@gmail.com",
                    "template_key": "1655f9358c49468"
                },"404");
        });
    }

    unitAsyncTest('Campaign Email Preview','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"preview",'POST',
        {
            "session_id": SessionID,
            "preview_email": "john@gmail.com"
        },"400");

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Campaign Error Test", function( hooks ) {
            unitAsyncTest('Campaign Email Preview [400]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"preview",'POST',
            {
                "session_id": SessionID,
                "preview_email": "johnl.com,john222.com"
            },"400");

            unitAsyncTest('Campaign Email Preview [401]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"preview",'POST',
            {
                "session_id": "SessionID",
                "preview_email": "john@gmail.com"
            },"401");

            unitAsyncTest('Campaign Email Preview [403]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"preview",'POST',
            {
                "session_id": SessionID,
                "preview_email": "john1@gmail.com,john2@gmail.com,john3@gmail.com,john4@gmail.com,john5@gmail.com,john6@gmail.com"
            },"403");

            unitAsyncTest('Campaign Email Preview [404]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"preview",'POST',
            {
                "session_id": SessionID,
                "preview_email": "john@gmail.com"
            },"404");
        });
    }

    unitAsyncTest('Campaign Email Spam Test','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"spam_test",'GET',
        {
            "session_id": SessionID,
        },null,"pro");

    if(AJAX_ERROR_REQUEST){
        unitAsyncTest('Campaign Email Spam Test [400]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"spam_test",'GET',
        {
            "sion_id": SessionID,
        },"400","pro");

        unitAsyncTest('Campaign Email Spam Test [401]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"spam_test",'GET',
        {
            "session_id": "SessionID",
        },"401","pro");

        unitAsyncTest('Campaign Email Spam Test [404]','campaign'+'/'+(campaign_id+1)+'/'+'email'+'/'+email_id+'/'+"spam_test",'GET',
        {
            "session_id": SessionID,
        },"404","pro");
    }

    if(AB_ENABLE){
        unitAsyncTest('Campaign Email Duplicate','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"duplicate",'POST',
            {
                "session_id": SessionID
            });

        if(AJAX_ERROR_REQUEST){
            QUnit.module("Campaign Error Test", function( hooks ) {
                unitAsyncTest('Campaign Email Duplicate [400]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"duplicate",'POST',
                {
                    "seson_id": SessionID
                },"400");

                unitAsyncTest('Campaign Email Duplicate [401]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"duplicate",'POST',
                {
                    "session_id": "SessionID"
                },"401");

                unitAsyncTest('Campaign Email Duplicate [404]','campaign'+'/'+campaign_id+'/'+'email'+'/'+(email_id+1)+'/'+"duplicate",'POST',
                {
                    "session_id": SessionID
                },"404");

                unitAsyncTestCurl('Campaign Email Delete [400]',
                    {
                        "seon_id": SessionID,
                        "method": 'DELETE',
                        "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id
                    },"400");

                unitAsyncTestCurl('Campaign Email Delete [401]',
                    {
                        "session_id": "SessionID",
                        "method": 'DELETE',
                        "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id
                    },"401");

                unitAsyncTestCurl('Campaign Email Delete [404]',
                    {
                        "session_id": SessionID,
                        "method": 'DELETE',
                        "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+(email_id+1)
                    },"404");
            });
        }

        unitAsyncTestCurl('Campaign Email Delete',
                {
                    "session_id": SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id
                });   
    } else {
        if(AJAX_ERROR_REQUEST){
            QUnit.module("Campaign Error Test", function( hooks ) {
                unitAsyncTest('Campaign Email Duplicate [403]','campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id+'/'+"duplicate",'POST',
                        {
                            "session_id": SessionID
                        },"403");

                unitAsyncTestCurl('Campaign Email Delete [403]',
                        {
                            "session_id": SessionID,
                            "method": 'DELETE',
                            "url": URL_API+'campaign'+'/'+campaign_id+'/'+'email'+'/'+email_id
                        },"403");
            });
        }
    }

    unitAsyncTest('Campaign Export Data','campaign'+'/'+campaign_id+'/'+'export','GET',
        {
            "session_id": SessionID
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Campaign Error Test", function( hooks ) {
            unitAsyncTest('Campaign Export Data [400]','campaign'+'/'+campaign_id+'/'+'export','GET',
            {
                "seson_id": SessionID
            },"400"); 

            unitAsyncTest('Campaign Export Data [401]','campaign'+'/'+campaign_id+'/'+'export','GET',
            {
                "session_id": "SessionID"
            },"401"); 

            unitAsyncTest('Campaign Export Data [404]','campaign'+'/'+(campaign_id+1)+'/'+'export','GET',
            {
                "session_id": SessionID
            },"404");
        });
    }

    unitAsyncTest('Campaign Export Recipient','campaign'+'/'+campaign_id+'/'+'recipients_export','GET',
        {
            "session_id": SessionID
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Campaign Error Test", function( hooks ) {
            unitAsyncTest('Campaign Export Recipient [400]','campaign'+'/'+campaign_id+'/'+'recipients_export','GET',
            {
                "seion_id": SessionID
            },"400"); 

            unitAsyncTest('Campaign Export Recipient [401]','campaign'+'/'+campaign_id+'/'+'recipients_export','GET',
            {
                "session_id": "SessionID"
            },"401"); 

            unitAsyncTest('Campaign Export Recipient [404]','campaign'+'/'+(campaign_id+1)+'/'+'recipients_export','GET',
            {
                "session_id": SessionID
            },"404");
        });
    }

    CampaignTestDelete(campaign_id);
}

function CampaignTestDelete(campaign_id){

    if(AJAX_ERROR_REQUEST){
        unitAsyncTestCurl('Campaign Delete [ 400 ]',
            {   
                "sion_id": SessionID,
                "method": 'DELETE',
                "url": URL_API+'campaign'+'/'+campaign_id
            },"400");

        unitAsyncTestCurl('Campaign Delete [ 401 ]',
            {   
                "session_id": "SessionID",
                "method": 'DELETE',
                "url": URL_API+'campaign'+'/'+campaign_id
            },"401");

        unitAsyncTestCurl('Campaign Delete [ 404 ]',
            {   
                "session_id": SessionID,
                "method": 'DELETE',
                "url": URL_API+'campaign'+'/'+(campaign_id+1)
            },"404");
    }

    unitAsyncTestCurl('Campaign Delete',
        {   
            "session_id": SessionID,
            "method": 'DELETE',
            "url": URL_API+'campaign'+'/'+campaign_id
        });
}

function ListUnitTest(list_id){

    if(LIST_STATE == 0){

        unitAsyncTest('List Overview','list'+'/'+list_id+'/overview','GET',
            {
                "session_id": SessionID
            });

        if(AJAX_ERROR_REQUEST){ 
            QUnit.module("List Error Test", function( hooks ) {
                unitAsyncTest('List Overview [ 404 ]','list'+'/'+(list_id+1)+'/overview','GET',
                    {
                        "session_id": SessionID
                    },"404");

                unitAsyncTest('List Overview [ 401 ]','list'+'/'+list_id+'/overview','GET',
                    {
                        "session_id": "XXXX"
                    },"401");

                unitAsyncTest('List Overview [ 400 ]','list'+'/'+list_id+'/overview','GET',
                    {
                        "sesn_id": SessionID
                    },"400");
            });
        }

        if(AJAX_ERROR_REQUEST){ 
            QUnit.module("List Error Test", function( hooks ) {

                unitAsyncTest('List AddWebService [ 400 ]','list'+'/'+list_id+'/web_service','POST',
                {
                   "sion_id": SessionID,
                    "event_type": "unsubscription",
                    "service_url": "https://my.webservice.com/callback_subscription"
                },"400");

                unitAsyncTest('List AddWebService [ 401 ]','list'+'/'+list_id+'/web_service','POST',
                {
                    "session_id": "SessionID",
                    "event_type": "unsubscription",
                    "service_url": "https://my.webservice.com/callback_subscription"
                },"401");

                unitAsyncTest('List AddWebService [ 404 ]','list'+'/'+(list_id+1)+'/web_service','POST',
                {
                    "session_id": SessionID,
                    "event_type": "unsubscription",
                    "service_url": "https://my.webservice.com/callback_subscription"
                },"404");
            });
        }

        QUnit.test("API v.2.0 : List AddWebService", function(assert){
            var done = assert.async();
            $.ajax({
                type: "POST",
                url: URL_API+'list'+'/'+list_id+'/web_service',
                data:{  
                        "session_id": SessionID,
                        "event_type": "unsubscription",
                        "service_url": "https://my.example.com/callback_service"
                },
                dataType:"json",
                error:function(e){
                    assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                    assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                    assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                    done();
                },
                success:function(res,status,e){
                    assert.equal(res['status'],'success',"ajax status : "+res['status']);
                    assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                    assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                    done();
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var service_id = data['data']['service_id'];
                    QUnit.module("List Test", function( hooks ) {
                       ListWebService(list_id,service_id);
                    });
                }
            });
        });
        
        unitAsyncTest('List Detail','list'+'/'+list_id,'GET',
            {
                "session_id": SessionID
            });

        if(AJAX_ERROR_REQUEST){
            QUnit.module("List Error Test", function( hooks ) {
                unitAsyncTest('List Detail [ 404 ]','list'+'/'+(list_id+1),'GET',
                    {
                        "session_id": SessionID
                    },"404");

                unitAsyncTest('List Detail [ 401 ]','list'+'/'+list_id,'GET',
                    {
                        "session_id": "XXXX"
                    },"401");
            });
        }

        unitAsyncTestCurl('List Update',
            {   
                "session_id": SessionID,
                "list_name": "List Update"+now,
                "method": 'PUT',
                "url": URL_API+'list'+'/'+list_id
            });

        if(AJAX_ERROR_REQUEST){
            QUnit.module("List Error Test", function( hooks ) {
                unitAsyncTestCurl('List Update [ 409 ]',
                    {   
                        "session_id": SessionID,
                        "list_name": LIST_NAME,
                        "method": 'PUT',
                        "url": URL_API+'list'+'/'+list_id
                    },"409");

                unitAsyncTestCurl('List Update [ 401 ]',
                    {   
                        "session_id": "XXXXX",
                        "list_name": "gggg",
                        "method": 'PUT',
                        "url": URL_API+'list'+'/'+list_id
                    },"401");

                unitAsyncTestCurl('List Update [ 400 ]',
                    {   
                        "session_id": SessionID,
                        "lisme": "gggg",
                        "method": 'PUT',
                        "url": URL_API+'list'+'/'+list_id
                    },"400");

                unitAsyncTest('Create CustomFields [ 400 ]','list'+'/'+list_id+'/custom_fields','POST',
                {
                    "session_id": SessionID,
                    "fieldme" : "CF"+rand_name,
                    "fi_key" : rand_name,  
                    "fld_type" : "Single line",
                    "validatiomethod" : "Disabled"
                },"400");

                unitAsyncTest('Create CustomFields [ 401 ]','list'+'/'+list_id+'/custom_fields','POST',
                {
                    "session_id": "SessionID",
                    "field_name" : "CF"+rand_name,
                    "field_key" : rand_name,  
                    "field_type" : "Single line",
                    "validation_method" : "Disabled"
                },"401");

                unitAsyncTest('Create CustomFields [ 404 ]','list'+'/'+(list_id+1)+'/custom_fields','POST',
                {
                    "session_id": SessionID,
                    "field_name" : "CF"+rand_name,
                    "field_key" : rand_name,  
                    "field_type" : "Single line",
                    "validation_method" : "Disabled"
                },"404");

                unitAsyncTest('Create CustomFields Fake Create','list'+'/'+list_id+'/custom_fields','POST',
                {
                    "session_id": SessionID,
                    "field_name" : "CF_XOOX",
                    "field_key" : "xoxoxoxox",  
                    "field_type" : "Single line",
                    "validation_method" : "Disabled"
                });

                unitAsyncTest('Create CustomFields [ 409 ]','list'+'/'+list_id+'/custom_fields','POST',
                {
                    "session_id": SessionID,
                    "field_name" : "CF_XOOX",
                    "field_key" : "xoxoxoxox",  
                    "field_type" : "Single line",
                    "validation_method" : "Disabled"
                },"409");
            });
        }
    }

    if(LIST_STATE == 1){

        unitAsyncTestCurl('List Save Create',
            {   
                "session_id": SessionID,
                "list_name": "List"+now,
                "method": 'PUT',
                "url": URL_API+'list'+'/'+list_id
            });

        QUnit.test("API v.2.0 : Create CustomFields", function(assert){
            var done = assert.async();
            $.ajax({
                type: "POST",
                url: URL_API+'list'+'/'+list_id+'/custom_fields',
                data:{  
                        "session_id": SessionID,
                        "field_name" : "CF"+rand_name,
                        "field_key" : rand_name,  
                        "field_type" : "Single line",
                        "validation_method" : "Disabled"
                },
                dataType:"json",
                error:function(e){
                    assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                    assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                    assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                    done();
                },
                success:function(res,status,e){
                    assert.equal(res['status'],'success',"ajax status : "+res['status']);
                    assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                    assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                    done();
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var custom_field_id = data['data']['custom_field_id'];
                    QUnit.module("List Test", function( hooks ) {
                       ListCustomField(list_id,custom_field_id);
                    });
                }
            });
        });
    }

    if(LIST_STATE == 2){

        unitAsyncTestCurl('List Save Create',
            {   
                "session_id": SessionID,
                "list_name": "List"+now,
                "method": 'PUT',
                "url": URL_API+'list'+'/'+list_id
            });

        QUnit.test("API v.2.0 : Subscriber Add", function(assert){
            var done = assert.async();
            $.ajax({
                type: "POST",
                url: URL_API_PRO+'list'+'/'+list_id+'/subscribers',
                data:{  
                        "session_id": SessionID,
                        "mode_import" : "copyandpaste",
                        "subscribers_data" : "john@example.com,john doe|:|adam@example.com,adam doe|:|josafh@example.com,josafh brown",  
                        "field_terminator" : ","
                },
                dataType:"json",
                error:function(e){
                    assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                    assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                    assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                    done();
                },
                success:function(res,status,e){
                    assert.equal(res['status'],'success',"ajax status : "+res['status']);
                    assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                    assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                    done();
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var key_import = data['data']['key_import'];
                    QUnit.module("List Test", function( hooks ) {
                       ListSubscriberAddCommit(list_id,key_import);
                    });
                }
            });
        });

        if(AJAX_ERROR_REQUEST){
            QUnit.module("Subscriber Error Test", function( hooks ) {
                unitAsyncTest('Subscriber Add [400]','list'+'/'+list_id+'/subscribers','POST',
                    {
                        "sen_id": SessionID,
                        "mode_import" : "copyandpaste",
                        "subscribers_data" : "john@example.com,john doe|:|adam@example.com,adam doe|:|josafh@example.com,josafh brown",  
                        "field_terminator" : ","
                    },"400","pro");

                unitAsyncTest('Subscriber Add [401]','list'+'/'+list_id+'/subscribers','POST',
                    {
                        "session_id": "SessionID",
                        "mode_import" : "copyandpaste",
                        "subscribers_data" : "john@example.com,john doe|:|adam@example.com,adam doe|:|josafh@example.com,josafh brown",  
                        "field_terminator" : ","
                    },"401","pro");

                unitAsyncTest('Subscriber Add [404]','list'+'/'+(list_id+1)+'/subscribers','POST',
                    {
                        "session_id": SessionID,
                        "mode_import" : "copyandpaste",
                        "subscribers_data" : "john@example.com,john doe|:|adam@example.com,adam doe|:|josafh@example.com,josafh brown",  
                        "field_terminator" : ","
                    },"404","pro");
            });
        }
    
    }

    if(LIST_STATE == 3){
        unitAsyncTestCurl('List Save Create',
            {   
                "session_id": SessionID,
                "list_name": "List"+now,
                "method": 'PUT',
                "url": URL_API+'list'+'/'+list_id
            });

        QUnit.test("API v.2.0 : Segment Create", function(assert){
            var done = assert.async();
            $.ajax({
                type: "POST",
                url: URL_API_PRO+'list'+'/'+list_id+'/segment',
                data:{  
                        "session_id": SessionID,
                        "segment_name" : "Customer Gmail or Hotmail",
                        "segment_operator" : "or",  
                        "segment_rules" : "[[EmailAddress]||[Contains]||[@gmail.com],,,[EmailAddress]||[Contains]||[@hotmail.com]]"
                },
                dataType:"json",
                error:function(e){
                    assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                    assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                    assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                    done();
                },
                success:function(res,status,e){
                    assert.equal(res['status'],'success',"ajax status : "+res['status']);
                    assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                    assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                    assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                    done();
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var segment_id = data['data']['segment_id'];
                    QUnit.module("List Test", function( hooks ) {
                       ListSegment(list_id,segment_id);
                    });
                }
            });
        });
    }
}

function ListSegment(list_id,segment_id){

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Segment Error Test", function( hooks ) {
            unitAsyncTest('Segment Create [400]','list'+'/'+list_id+'/segment','POST',
            {
                "sion_id": SessionID,
                "segment_name" : "",
                "segment_operator" : "or",  
                "segment_rules" : "[[EmailAddress]||[Contains]||[@gmail.com],,,[EmailAddress]||[Contains]||[@hotmail.com]]"
            },"400");

            unitAsyncTest('Segment Create [401]','list'+'/'+list_id+'/segment','POST',
            {
                "sion_id": "SessionID",
                "segment_name" : "Customer Gmail or Hotmail",
                "segment_operator" : "or",  
                "segment_rules" : "[[EmailAddress]||[Contains]||[@gmail.com],,,[EmailAddress]||[Contains]||[@hotmail.com]]"
            },"401");

            unitAsyncTest('Segment Create [404]','list'+'/'+(list_id+1)+'/segment','POST',
            {
                "sion_id": SessionID,
                "segment_name" : "Customer Gmail or Hotmail",
                "segment_operator" : "or",  
                "segment_rules" : "[[EmailAddress]||[Contains]||[@gmail.com],,,[EmailAddress]||[Contains]||[@hotmail.com]]"
            },"404");
        });
    }

    unitAsyncTest('Segment Get','list'+'/'+list_id+'/segment','GET',
        {
            "session_id": SessionID
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Segment Error Test", function( hooks ) {
            unitAsyncTest('Segment Get [400]','list'+'/'+list_id+'/segment','GET',
                {
                    "sion_id": SessionID
                },"400");

            unitAsyncTest('Segment Get [401]','list'+'/'+list_id+'/segment','GET',
                {
                    "session_id": "SessionID"
                },"401");

            unitAsyncTest('Segment Get [404]','list'+'/'+(list_id+1)+'/segment','GET',
                {
                    "session_id": SessionID
                },"404");
        });
    }

    unitAsyncTestCurl('Segment Update',
            {   
                "session_id": SessionID,
                "segment_name": "Customer Gmail or Hotmail or Yahoo"+now,
                "segment_operator": "or",
                "segment_rules": "[[EmailAddress]||[Contains]||[@gmail.com],,,[EmailAddress]||[Contains]||[@hotmail.com]],,,[EmailAddress]||[Contains]||[@yahoo.com]]",
                "method": 'PUT',
                "url": URL_API+'list'+'/'+list_id+'/segment/'+segment_id
            });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Segment Error Test", function( hooks ) {
            unitAsyncTestCurl('Segment Update [400]',
                {   
                    "session_id": SessionID,
                    "segment_name": "",
                    "segment_operator": "or",
                    "segment_rules": "[[EmailAddress]||[Contains]||[@gmail.com],,,[EmailAddress]||[Contains]||[@hotmail.com]],,,[EmailAddress]||[Contains]||[@yahoo.com]]",
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/segment/'+segment_id
                },"400");

            unitAsyncTestCurl('Segment Update [401]',
                {   
                    "session_id": "SessionID",
                    "segment_name": "Customer Gmail or Hotmail or Yahoo"+now,
                    "segment_operator": "or",
                    "segment_rules": "[[EmailAddress]||[Contains]||[@gmail.com],,,[EmailAddress]||[Contains]||[@hotmail.com]],,,[EmailAddress]||[Contains]||[@yahoo.com]]",
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/segment/'+segment_id
                },"401");

            unitAsyncTestCurl('Segment Update [404]',
                {   
                    "session_id": SessionID,
                    "segment_name": "Customer Gmail or Hotmail or Yahoo"+now,
                    "segment_operator": "or",
                    "segment_rules": "[[EmailAddress]||[Contains]||[@gmail.com],,,[EmailAddress]||[Contains]||[@hotmail.com]],,,[EmailAddress]||[Contains]||[@yahoo.com]]",
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/segment/'+(segment_id+1)
                },"404");

            unitAsyncTestCurl('Segment Delete [400]',
            {   
                "seon_id": SessionID,
                "method": 'DELETE',
                "url": URL_API+'list'+'/'+list_id+'/segment/'+segment_id
            },"400");

            unitAsyncTestCurl('Segment Delete [401]',
            {   
                "session_id": "SessionID",
                "method": 'DELETE',
                "url": URL_API+'list'+'/'+list_id+'/segment/'+segment_id
            },"401");

            unitAsyncTestCurl('Segment Delete [404]',
            {   
                "session_id": SessionID,
                "method": 'DELETE',
                "url": URL_API+'list'+'/'+list_id+'/segment/'+(segment_id+1)
            },"404");
        });
    }

    unitAsyncTestCurl('Segment Delete',
            {   
                "session_id": SessionID,
                "method": 'DELETE',
                "url": URL_API+'list'+'/'+list_id+'/segment/'+segment_id
            });

    ListDeleteTest(list_id);
}

function ListSubscriberAddCommit(list_id,key_import){

    QUnit.test("API v.2.0 : Subscriber Add Commit", function(assert){
        var done = assert.async();
        $.ajax({
            type: "POST",
            url: URL_API_PRO+'list'+'/'+list_id+'/subscribers/'+key_import+'/commit',
            data:{  
                    "session_id" : SessionID,
                    "mode_import" : "copyandpaste",
                    "matched_fields" : ["email"],
                    "update_duplicates" : true,
                    "not_send_optin_email" : true,
                    "add_to_suppression_list" : "none"
                },
            dataType:"json",
            error:function(e){
                assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                done();
            },
            success:function(res,status,e){
                assert.equal(res['status'],'success',"ajax status : "+res['status']);
                assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                done();
            },
            complete:function(e){
                var data = eval('('+e.responseText+')');
                var token = data['data']['token'];
                QUnit.module("List Test", function( hooks ) {
                   getstatusSubscriberCommit(list_id,key_import,token);
                });
            }
        });
    });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Subscriber Error Test", function( hooks ) {
            unitAsyncTest('Subscriber Add Commit [400]','list'+'/'+list_id+'/subscribers/'+key_import+'/commit','POST',
                {
                    "sesn_id" : SessionID,
                    "mode_import" : "copyandpaste",
                    "matched_fields" : ["email"],
                    "update_duplicates" : true,
                    "not_send_optin_email" : true,
                    "add_to_suppression_list" : "none"
                },"400","pro");

            unitAsyncTest('Subscriber Add Commit [401]','list'+'/'+list_id+'/subscribers/'+key_import+'/commit','POST',
                {
                    "session_id" : "SessionID",
                    "mode_import" : "copyandpaste",
                    "matched_fields" : ["email"],
                    "update_duplicates" : true,
                    "not_send_optin_email" : true,
                    "add_to_suppression_list" : "none"
                },"401","pro");

            unitAsyncTest('Subscriber Add Commit [404]','list'+'/'+(list_id+1)+'/subscribers/'+key_import+'/commit','POST',
                {
                    "session_id" : SessionID,
                    "mode_import" : "copyandpaste",
                    "matched_fields" : ["email"],
                    "update_duplicates" : true,
                    "not_send_optin_email" : true,
                    "add_to_suppression_list" : "none"
                },"404","pro");

            unitAsyncTest('Subscriber Add Commit [409]','list'+'/'+list_id+'/subscribers/'+key_import+'/commit','POST',
                {
                   "session_id" : SessionID,
                    "mode_import" : "copyandpaste",
                    "matched_fields" : ["email"],
                    "update_duplicates" : true,
                    "not_send_optin_email" : true,
                    "add_to_suppression_list" : "none"
                },"409","pro");

            // unitAsyncTest('Subscriber Get []','list'+'/'+list_id+'/subscribers/'+key_import+'/commit','POST',
            //     {
            //         "session_id" : SessionID,
            //         "mode_import" : "copyandpaste",
            //         "matched_fields" : ["email"],
            //         "update_duplicates" : true,
            //         "not_send_optin_email" : true,
            //         "add_to_suppression_list" : "none"
            //     },"400","pro");
        });
    }
}

function getstatusSubscriberCommit(list_id,key_import,token){

    QUnit.test("API v.2.0 : Subscriber Add Commit Detail", function(assert){
        var done = assert.async();
        $.ajax({
            type: "GET",
            url: URL_API_PRO+'list'+'/'+list_id+'/subscribers/'+key_import+'/commit/'+token,
            data:{  
                    "session_id" : SessionID,
                },
            dataType:"json",
            error:function(e){
                assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                done();
            },
            success:function(res,status,e){
                assert.equal(res['status'],'success',"ajax status : "+res['status']);
                assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                done();
            },
            complete:function(e){
                var data = eval('('+e.responseText+')');
                var imported_success = data['data']['imported_success'];
                if(imported_success > 0){
                    QUnit.module("List Test", function( hooks ) {
                       ListSubscriber(list_id);
                    });
                } else {
                    ListDeleteTest(list_id);
                }
            }
        });
    });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Subscriber ERROR Test", function( hooks ) {
            unitAsyncTest('Subscriber Add Commit Detail [400]','list'+'/'+list_id+'/subscribers/'+key_import+'/commit/'+token,'GET',
                {
                    "sen_id" : SessionID,
                },"400","pro");

            unitAsyncTest('Subscriber Add Commit Detail [401]','list'+'/'+list_id+'/subscribers/'+key_import+'/commit/'+token,'GET',
                {
                    "session_id" : "SessionID",
                },"401","pro");

            unitAsyncTest('Subscriber Add Commit Detail [404]','list'+'/'+(list_id+1)+'/subscribers/'+key_import+'/commit/'+token,'GET',
                {
                    "session_id" : SessionID,
                },"404","pro");
        });
    }
}

function ListSubscriber(list_id){

    var subscriber_id = "1";

    unitAsyncTest('Subscriber Get','list'+'/'+list_id+'/subscribers','GET',
        {
            "session_id": SessionID,
            "display_mode": "all",
            "order_field": "email",
            "order_type": "desc",
            "page": 1,
            "limit": 3,
            "keyword_search": ""
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Subscriber ERROR Test", function( hooks ) {
            unitAsyncTest('Subscriber Add Commit Detail [400]','list'+'/'+list_id+'/subscribers','GET',
                {
                    "sesn_id": SessionID,
                    "display_mode": "all",
                    "order_field": "email",
                    "order_type": "desc",
                    "page": 1,
                    "limit": 3,
                    "keyword_search": ""
                },"400");

            unitAsyncTest('Subscriber Add Commit Detail [401]','list'+'/'+list_id+'/subscribers','GET',
                {
                    "session_id": "SessionID",
                    "display_mode": "all",
                    "order_field": "email",
                    "order_type": "desc",
                    "page": 1,
                    "limit": 3,
                    "keyword_search": ""
                },"401");

            unitAsyncTest('Subscriber Add Commit Detail [404]','list'+'/'+(list_id+1)+'/subscribers','GET',
                {
                    "session_id": SessionID,
                    "display_mode": "all",
                    "order_field": "email",
                    "order_type": "desc",
                    "page": 1,
                    "limit": 3,
                    "keyword_search": ""
                },"404");
        });
    }

    unitAsyncTest('Subscriber Detail','list'+'/'+list_id+'/subscribers/'+subscriber_id,'GET',
        {
            "session_id" : SessionID,
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Subscriber ERROR Test", function( hooks ) {
            unitAsyncTest('Subscriber Detail [400]','list'+'/'+list_id+'/subscribers/'+subscriber_id,'GET',
                {
                    "se_id" : SessionID,
                },"400");

            unitAsyncTest('Subscriber Detail [401]','list'+'/'+list_id+'/subscribers/'+subscriber_id,'GET',
                {
                    "session_id" : "SessionID",
                },"401");

            unitAsyncTest('Subscriber Detail [404]','list'+'/'+list_id+'/subscribers/'+(subscriber_id+100000),'GET',
                {
                    "session_id" : SessionID,
                },"404");
        });
    }

    unitAsyncTestCurl('Subscriber Update',
                {
                    "session_id" : SessionID,
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/subscribers/'+subscriber_id,
                    "custom_field": {
                                        "CustomFieldFirstname":"Arrow",
                                        "CustomFieldLastname":"Smith"
                                    }
                });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Subscriber ERROR Test", function( hooks ) {
            unitAsyncTestCurl('List Subscriber Update [400]',
                {
                    "sesn_id" : SessionID,
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/subscribers/'+subscriber_id,
                    "custom_field": {
                                        "CustomFieldFirstname":"Arrow",
                                        "CustomFieldLastname":"Smith"
                                    }
                },"400");

            unitAsyncTestCurl('List Subscriber Update [401]',
                {
                    "session_id" : "SessionID",
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/subscribers/'+subscriber_id,
                    "custom_field": {
                                        "CustomFieldFirstname":"Arrow",
                                        "CustomFieldLastname":"Smith"
                                    }
                },"401");

            unitAsyncTestCurl('List Subscriber Update [404]',
                {
                    "session_id" : SessionID,
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/subscribers/'+(subscriber_id+100000),
                    "custom_field": {
                                        "CustomFieldFirstname":"Arrow",
                                        "CustomFieldLastname":"Smith"
                                    }
                },"404");
        });
    }

    unitAsyncTest('Subscriber Unsubscribe','list'+'/'+list_id+'/subscribers/'+'unsubscribe','POST',
        {
            "session_id" : SessionID,
            "email" : "john@example.com"
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("Subscriber ERROR Test", function( hooks ) {
            unitAsyncTest('Subscriber Unsubscribe [400]','list'+'/'+list_id+'/subscribers/'+'unsubscribe','POST',
                {
                    "session_id" : SessionID,
                    "emafdfdfil" : "john@example.com"
                },"400");

            unitAsyncTest('Subscriber Unsubscribe [401]','list'+'/'+list_id+'/subscribers/'+'unsubscribe','POST',
                {
                    "session_id" : "SessionID",
                    "email" : "john@example.com"
                },"401");

            unitAsyncTest('Subscriber Unsubscribe [404]','list'+'/'+list_id+'/subscribers/'+'unsubscribe','POST',
                {
                    "session_id" : SessionID,
                    "email" : "john222@example.com"
                },"404");
        });
    }

    QUnit.test("API v.2.0 : Subscriber Selection", function(assert){
        var done = assert.async();
        $.ajax({
            type: "POST",
            url: URL_API_PRO+'list'+'/'+list_id+'/subscribers/'+'selection',
            data:{  
                    "session_id" : SessionID,
                    "subscribers_id" : "1,2"
                },
            dataType:"json",
            error:function(e){
                assert.equal(e.responseJSON['status'],'success',"ajax status : "+e.responseJSON['status']);
                assert.equal(e.responseJSON['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(e.responseJSON['status'],'success',"Error Code : "+e.responseJSON['code']);
                assert.equal(e.responseJSON['status'],'success',"Error Messsage : "+e.responseJSON['error_message']);
                done();
            },
            success:function(res,status,e){
                assert.equal(res['status'],'success',"ajax status : "+res['status']);
                assert.equal(res['status'],'success',"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(res['status'],'success',"Respone Code : "+res['code']);
                assert.equal(res['status'],'success',"Respone : "+JSON.stringify(res['data']));
                done();
            },
            complete:function(e){
                var data = eval('('+e.responseText+')');
                var token = data['data']['token'];
                    QUnit.module("List Test", function( hooks ) {
                       SubscriberSelectionDelete(list_id,token);
                    });
            }
        });
    });

    if(AJAX_ERROR_REQUEST){
        unitAsyncTest('Subscriber Selection [400]','list'+'/'+list_id+'/subscribers/'+'selection','POST',
            {
                "session_id" : SessionID,
                "subss_id" : "1,2"
            },"400","pro");

        unitAsyncTest('Subscriber Selection [401]','list'+'/'+list_id+'/subscribers/'+'selection','POST',
            {
                "session_id" : "SessionID",
                "subss_id" : "1,2"
            },"401","pro");

        unitAsyncTest('Subscriber Selection [404]','list'+'/'+(list_id+1)+'/subscribers/'+'selection','POST',
            {
                "session_id" : SessionID,   
                "subss_id" : "1,2"
            },"404","pro");
    }
    
}

function SubscriberSelectionDelete(list_id,token){

    if(AJAX_ERROR_REQUEST){
        unitAsyncTestCurl('List Subscriber Selection Delete [400]',
            {
                "seon_id" : SessionID,
                "method": 'DELETE',
                "url": URL_API+'list'+'/'+list_id+'/subscribers/'+'selection/'+token,
            },"400");

        unitAsyncTestCurl('List Subscriber Selection Delete [401]',
            {
                "session_id" : "SessionID",
                "method": 'DELETE',
                "url": URL_API+'list'+'/'+list_id+'/subscribers/'+'selection/'+token,
            },"401");

        unitAsyncTestCurl('List Subscriber Selection Delete [404]',
            {
                "session_id" : SessionID,
                "method": 'DELETE',
                "url": URL_API+'list'+'/'+(list_id+1)+'/subscribers/'+'selection/'+token,
            },"404");
    }

    unitAsyncTestCurl('List Subscriber Selection Delete',
                {
                    "session_id" : SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id+'/subscribers/'+'selection/'+token
                });

    ListDeleteTest(list_id);
}

function ListCustomField(list_id,custom_field_id){
    unitAsyncTest('Get CustomFields','list'+'/'+list_id+'/custom_fields','GET',
        {
            "session_id" : SessionID,
            "order_field" : "custom_field_id",
            "order_type" : "desc"
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("List Error Test", function( hooks ) {
            unitAsyncTest('Get CustomFields [ 400 ]','list'+'/'+list_id+'/custom_fields','GET',
                {
                    "seson_id" : SessionID,
                    "orield" : "custom_field_id",
                    "order_type" : "desc"
                },"400");

            unitAsyncTest('Get CustomFields [ 401 ]','list'+'/'+list_id+'/custom_fields','GET',
                {
                    "session_id" : "SessionID",
                    "order_field" : "custom_field_id",
                    "order_type" : "desc"
                },"401");

            unitAsyncTest('Get CustomFields [ 404 ]','list'+'/'+(list_id+1)+'/custom_fields','GET',
                {
                    "session_id" : SessionID,
                    "order_field" : "custom_field_id",
                    "order_type" : "desc"
                },"404");
        });
    }

    unitAsyncTest('CustomFields Detail','list'+'/'+list_id+'/custom_fields/'+custom_field_id,'GET',
        {
            "session_id" : SessionID
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("List Error Test", function( hooks ) {

            unitAsyncTest('CustomFields Detail [ 400 ]','list'+'/'+list_id+'/custom_fields/'+custom_field_id,'GET',
                {
                    "sessn_id" : SessionID
                },"400");

            unitAsyncTest('CustomFields Detail [ 401 ]','list'+'/'+list_id+'/custom_fields/'+custom_field_id,'GET',
                {
                    "session_id" : "SessionID"
                },"401");

            unitAsyncTest('CustomFields Detail [ 404 ]','list'+'/'+(list_id+1)+'/custom_fields/'+"345345345345",'GET',
                {
                    "session_id" : SessionID
                },"404");
        });
    }

    unitAsyncTestCurl('List CustomFields Update',
                {
                    "session_id" : SessionID,
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+custom_field_id,
                    "field_name" : "CF"+(custom_field_id+50),
                    "field_key" : "fk"+(custom_field_id+50),
                    "field_type" : "Single line",
                    "validation_method" : "Disabled"
                });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("List Error Test", function( hooks ) {
            unitAsyncTestCurl('List CustomFields Update [400]',
                {
                    "session_id" : SessionID,
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+custom_field_id,
                    "field_name" : "CustomFields Update "+now,
                    "field_key" : "fk"+(custom_field_id+1),
                    "field_type" : "Single line",
                    "validn_method" : "Disabled"
                },"400");

            unitAsyncTestCurl('List CustomFields Update [401]',
                {
                    "session_id" : "SessionID",
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+custom_field_id,
                    "field_name" : "CustomFields Update "+now,
                    "field_key" : "fk"+(custom_field_id+1),
                    "field_type" : "Single line",
                    "validation_method" : "Disabled"
                },"401");

            unitAsyncTestCurl('List CustomFields Update [404]',
                {
                    "session_id" : SessionID,
                    "method": 'PUT',
                    "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+(custom_field_id+9),
                    "field_name" : "CustomFields Update "+now,
                    "field_key" : "fk"+(custom_field_id+1),
                    "field_type" : "Single line",
                    "validation_method" : "Disabled"
                },"404");

            // unitAsyncTestCurl('List CustomFields Update [409]',
            //     {
            //         "session_id" : SessionID,
            //         "method": 'PUT',
            //         "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+(custom_field_id),
            //         "field_name" : "CF"+(custom_field_id+50),
            //         "field_key" : "fk"+(custom_field_id+50),
            //         "field_type" : "Single line",
            //         "validation_method" : "Disabled"
            //     },"409");

            // unitAsyncTestCurl('List CustomFields Update [503]',
            //     {
            //         "session_id" : "SessionID",
            //         "method": 'PUT',
            //         "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+custom_field_id,
            //         "field_name" : "Email address"+now,
            //         "field_key" : "EmailAddress",
            //         "field_type" : "Single line",
            //         "validation_method" : "Disabled",
            //         "is_unique" : "T",
            //         "is_required" : "T"
            //     },"503");
            
        });
    }

    if(AJAX_ERROR_REQUEST){
        QUnit.module("List Error Test", function( hooks ) {
            unitAsyncTestCurl('List CustomFields Delete [400]',
                {
                    "sion_id" : SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+custom_field_id,
                },"400");

            unitAsyncTestCurl('List CustomFields Delete [401]',
                {
                    "session_id" : "SessionID",
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+custom_field_id,
                },"401");

            unitAsyncTestCurl('List CustomFields Delete [404]',
                {
                    "session_id" : SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+(custom_field_id+5),
                },"404");
        });
    }

    unitAsyncTestCurl('List CustomFields Delete',
                {
                    "session_id" : SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id+'/custom_fields/'+custom_field_id,
                });

    ListDeleteTest(list_id);
}

function ListWebService(list_id,service_id){

    unitAsyncTest('List GetWebService','list'+'/'+list_id+'/web_service','GET',
        {
            "session_id": SessionID
        });

    unitAsyncTestCurl('List RemoveWebService',
        {
            "session_id": SessionID,
            "method": 'DELETE',
            "url": URL_API+'list'+'/'+list_id+'/web_service/'+service_id
        });

    if(AJAX_ERROR_REQUEST){
        QUnit.module("List Error Test", function( hooks ) {

            unitAsyncTestCurl('List RemoveWebService [ 400 ]',
                {
                    "seon_id": SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id+'/web_service/'+service_id
                },"400");

            unitAsyncTestCurl('List RemoveWebService [ 401 ]',
                {
                    "session_id": "SessionID",
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id+'/web_service/'+service_id
                },"401");

            unitAsyncTestCurl('List RemoveWebService [ 404 ]',
                {
                    "session_id": SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id+'/web_service/'+(service_id+1)
                },"404");

            unitAsyncTestCurl('List Delete [ 400 ]',
                {   
                    "seion_id": SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id
                },"400");

            unitAsyncTestCurl('List Delete [ 401 ]',
                {   
                    "session_id": "SessionID",
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+list_id
                },"401");

            unitAsyncTestCurl('List Delete [ 404 ]',
                {   
                    "session_id": SessionID,
                    "method": 'DELETE',
                    "url": URL_API+'list'+'/'+(list_id+1)
                },"404");
        });
    }

    ListDeleteTest(list_id);
}

function ListDeleteTest(list_id){
    unitAsyncTestCurl('List Delete',
        {   
            "session_id": SessionID,
            "method": 'DELETE',
            "url": URL_API+'list'+'/'+list_id
        });
}

function unitAsyncTest(name,command,type,param,error_code,mode){

    var status_rule = "success";
    var url_api = URL_API;

    if(mode == 'pro'){
        url_api = URL_API_PRO;
    }

    QUnit.test("API v2.0 : "+name, function(assert){
        var done = assert.async();
        $.ajax({
            type: type,
            url: url_api+command,
            data: param,
            dataType:"json",
            error:function(e){
                if(error_code != undefined){
                    status_rule = "error";
                }
                assert.equal(e.responseJSON['status'],status_rule,"ajax status : "+e.responseJSON['status']);
                assert.equal(e.responseJSON['status'],status_rule,"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(e.responseJSON['status'],status_rule,"Error Code : "+e.responseJSON['code']);
                assert.equal(e.responseJSON['status'],status_rule,"Error Messsage : "+e.responseJSON['error_message']);
                done();  
            },
            success:function(res,status,e){
                assert.equal(res['status'],status_rule,"ajax status : "+res['status']);
                assert.equal(res['status'],status_rule,"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(res['status'],status_rule,"Respone Code : "+res['code']);
                assert.equal(res['status'],status_rule,"Respone Data : "+JSON.stringify(res['data']));
                done();
            }
        });
    });
}

function unitAsyncTestCurl(name,param,error_code){

    var status_rule = "success";
    var res_text = "Respone Data :";

    QUnit.test("API v2.0 : "+name, function(assert){
        var done = assert.async();
        $.ajax({
            type: "post",
            url: URL_CURL,
            data: param,
            dataType:"json",
            error:function(e){
                assert.equal(e.responseJSON['status'],status_rule,"ajax status : "+e.responseJSON['status']);
                assert.equal(e.responseJSON['status'],status_rule,"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(e.responseJSON['status'],status_rule,"Error Code : "+e.responseJSON['code']);
                assert.equal(e.responseJSON['status'],status_rule,"Error Messsage : "+e.responseJSON['error_message']);
                done();
            },
            success:function(res,status,e){
                var data = res['data'];
                if(error_code != undefined){
                    status_rule = "error";
                    res_text = "Error Messsage : ";
                    data = res['error_message'];
                }

                assert.equal(res['status'],status_rule,"ajax status : "+res['status']);
                assert.equal(res['status'],status_rule,"HTTP Code : "+e.status+" "+e.statusText);
                assert.equal(res['status'],status_rule,"Respone Code : "+res['code']);
                assert.equal(res['status'],status_rule,res_text+JSON.stringify(data));
                done();
            }
        });
    });
}