// var URL_API = "https://203.151.165.162/api.php";
var URL_API_DEV = "http://taximail2015.orisma.alpha/service/call_api.php";
var URL_API = "http://taxiapp3.orisma.alpha/api.php";
var SessionID;
var AJAX_MODE_REQUEST = 0;
var AJAX_OPTION_REQUEST;
var AB_MODE = false;
var now = new Date();
var rand_name = Math.floor((Math.random() * 100000) + 1);

createOption('mode',{ list:'List' ,campaign:'Campaign' ,transactional:'Transactional' },'Select Mode','Select test case mode.');

function createOption(id,param,label,tooltip){
    QUnit.config.urlConfig.push({
        id: id,
        value:  param,
        label: label,
        tooltip: tooltip
    });
}

var params = document.location.search.substr(1).split('&');

$.each(params,function(i,val){
    if(val === "mode=list"){
        AJAX_MODE_REQUEST = 1;
    } else if (val === "mode=campaign"){
        AJAX_MODE_REQUEST = 2;
    } else if (val === "mode=transactional"){
        AJAX_MODE_REQUEST = 3;
    }
});

if(AJAX_MODE_REQUEST == 1){
    var id2 = 'list_opttion';
    var param2 = { customfields:'CustomFields' ,segment:'Segment' ,subscriber:'Subscriber'};
    var label2 = 'List Option';
    var tooltip2 = 'select option mode';
}else if(AJAX_MODE_REQUEST == 2){
    createOption('ab_mode','true','A/B Testing','Swith to A/B testing');
    var id2 = 'campaign_opttion';
    var param2 = { email:'Email' };
    var label2 = 'Campaign Option';
    var tooltip2 = 'select option mode';
}

if(AJAX_MODE_REQUEST == 1 || AJAX_MODE_REQUEST == 2){
    createOption(id2,param2,label2,tooltip2);
}


var params2 = document.location.search.substr(1).split('&');

$.each(params2,function(i,val){
    if(AJAX_MODE_REQUEST == 1){
        if(val === "list_opttion=customfields"){
            AJAX_OPTION_REQUEST = 1;
        } else if (val === "list_opttion=segment"){
            AJAX_OPTION_REQUEST = 2;
        } else if (val === "list_opttion=subscriber"){
            AJAX_OPTION_REQUEST = 3;
        } else {
            AJAX_OPTION_REQUEST = 0;
        }
    } else if (AJAX_MODE_REQUEST == 2){
        if (val === "campaign_opttion=email"){
            AJAX_OPTION_REQUEST = 4;
        } else if (val === "ab_mode=true"){
            AB_MODE = true;
        } else {
            AJAX_OPTION_REQUEST = 0;
        }
    }
});

////////////////////// Start Progress ////////////////////////////////

if(SessionID == "" || SessionID == null || SessionID == undefined ){
 
    QUnit.test("API v1.5 : User.Login", function( assert ){
        var done = assert.async();
        $.ajax({
            type: "post",
            url: URL_API,
            data:{
                "Command" : "User.Login",
                "Username": "wongsakorn@orisma.com",
                "Password": "111111",
                "remember": "T"
            },
            dataType:"json",
            error:function(e){
                equal(e.status,'success',e.statusText);
            },
            success:function(data,status,e){

                if(data['Success']){
                    SessionID = data['data']['SessionID'];
                    assert.equal(data['Success'],true,"ajax status : "+status);
                    assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                    done();
                } else {
                    assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                    assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                    done();
                }
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

            QUnit.test("API v1.5 : List Create", function(assert){
                var done = assert.async();
                $.ajax({
                    type: "post",
                    url: URL_API,
                    data:{  "Command" : "List.Create",
                            "SessionID": SessionID,
                            "CreateMode" : "Draft"
                    },
                    dataType:"json",
                    error:function(e){
                        equal(e.status,'success',e.statusText);
                    },
                    success:function(data,status,e){

                        if(data['Success']){
                            assert.equal(data['Success'],true,"ajax status : "+status);
                            assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                            done();
                        } else {
                            assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                            assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                            done();
                        }
                    },
                    complete:function(e){
                        var data = eval('('+e.responseText+')');
                        list_id = data['data']['ListID'];
                        QUnit.module("List Test", function( hooks ) {
                           ListUnitTest(list_id);
                        });
                    }
                });
            });
        });  
    }

    if(AJAX_MODE_REQUEST == "2" && !AB_MODE){
        QUnit.module("Campaigns Test", function( hooks ) {

            QUnit.test("API v1.5 : Campaign Create", function(assert){
                var done = assert.async();
                $.ajax({
                    type: "post",
                    url: URL_API,
                    data:{  "Command" : "Campaign.Create",
                            "SessionID": SessionID,
                            "SplitTesting" : "Disabled",
                            "RecipientListsAndSegments" : "259:0",
                            "CampaignName" : "unit test create campaign"
                    },
                    dataType:"json",
                    error:function(e){
                        equal(e.status,'success',e.statusText);
                    },
                    success:function(data,status,e){

                        if(data['Success']){
                            assert.equal(data['Success'],true,"ajax status : "+status);
                            assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                            done();
                        } else {
                            assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                            assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                            done();
                        }
                    },
                    complete:function(e){
                        var data = eval('('+e.responseText+')');
                        var campaign_id = data['data']['CampaignID'];
                        var content_id = data['data']['ContentID'];
                        QUnit.module("Campaigns Test", function( hooks ) {
                            CampaignUnitTest(campaign_id,content_id);
                        });
                    }
                });
            });
        });
    }

    if(AJAX_MODE_REQUEST == "2" && AB_MODE){
        QUnit.module("Campaigns Test", function( hooks ) {

            QUnit.test("API v1.5 : Campaign Create A/B Testing", function(assert){
                var done = assert.async();
                $.ajax({
                    type: "post",
                    url: URL_API,
                    data:{  "Command" : "Campaign.Create",
                            "SessionID": SessionID,
                            "SplitTesting": "Enabled",
                            "RecipientListsAndSegments": "259:0",
                            "CampaignName" : "unit test create campaign",
                            "CreateMode" : "Draft"
                    },
                    dataType:"json",
                    error:function(e){
                        equal(e.status,'success',e.statusText);
                    },
                    success:function(data,status,e){

                        if(data['Success']){
                            assert.equal(data['Success'],true,"ajax status : "+status);
                            assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                            done();
                        } else {
                            assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                            assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                            done();
                        }
                    },
                    complete:function(e){
                        var data = eval('('+e.responseText+')');
                        var campaign_id = data['data']['CampaignID'];
                        var content_id = data['data']['ContentID'];
                        QUnit.module("Campaigns Test", function( hooks ) {
                            CampaignUnitTest(campaign_id,content_id);
                        });
                    }
                });
            });
        });
    }

    if(AJAX_MODE_REQUEST == "3"){
        QUnit.module("Transactional Test", function( hooks ) {

            unitAsyncTest('Transactional Overview',
                {   "Command" : "Transactional.Overview",
                    "SessionID": SessionID
            },"DEV");

            QUnit.test("API v1.5 : Transactional SendTransactionEmail", function(assert){
                var done = assert.async();
                $.ajax({
                    type: "post",
                    url: URL_API_DEV,
                    data:{  "Command" : "Transactional.SendTransactionEmail",
                            "SessionID": SessionID,
                            "Priority": "0",
                            "FromName": "Customer Support",
                            "FromEmail" : "support@example.com",
                            "ToName" : "John Smith",
                            "ToEmail" : "kritsada@orisma.com",
                            "Subject" : "New Member Welcome",
                            "ContentHtml" : "",
                            "ContentPlain" : "",
                            "TemplateKey" : "16567a52906fb2a",
                            "GroupHeader" : "Welcome",
                            "MessageID" : "msg"+SessionID,
                            "ReportType" : "Full",
                    },
                    dataType:"json",
                    error:function(e){
                        equal(e.status,'success',e.statusText);
                    },
                    success:function(data,status,e){

                        if(data['Success']){
                            assert.equal(data['Success'],true,"ajax status : "+status);
                            assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                            done();
                        } else {
                            assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                            assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                            done();
                        }
                    },
                    complete:function(e){
                        var data = eval('('+e.responseText+')');
                        var message_id = data['data']['message_id'];
                        QUnit.module("Transactional Test", function( hooks ) {
                            unitAsyncTest('Transactional GetStatMessage',
                                {   "Command" : "Transactional.GetStatMessage",
                                    "SessionID": SessionID,
                                    "RefMessageID": "msg"+SessionID
                                },"DEV");
                        });
                    }
                });
            });
        });
    }
}

function ListUnitTest(list_id){

    if(AJAX_OPTION_REQUEST == 0){

        unitAsyncTest('Lists Get',
            {   "Command" : "Lists.Get",
                "SessionID": SessionID,
                "PerPage": "1",
                "PerLimit" : "15",
                "OrderField": "create_date",
                "OrderType": "desc",
        });

        unitAsyncTest('Lists Overview',
            {   "Command" : "Lists.Overview",
                "SessionID": SessionID,
                "ListID" : list_id
        });

        QUnit.test("API v1.5 : Lists Add Webservice", function(assert){
            var done = assert.async();
            $.ajax({
                type: "post",
                url: URL_API,
                data:{  "Command" : "Lists.AddWebService",
                        "SessionID": SessionID,
                        "ListID": list_id,
                        "EventType": "subscription",
                        "ServiceURL" : "https://my.testtesttest.com/callback_webservice"
                },
                dataType:"json",
                error:function(e){
                    equal(e.status,'success',e.statusText);
                },
                success:function(data,status,e){
                    if(data['Success']){
                        assert.equal(data['Success'],true,"ajax status : "+status);
                        assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                        done();
                    } else {
                        assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                        assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                        done();
                    }
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var service_id = data['data']['WebServiceID'];
                    QUnit.module("List Test", function( hooks ) {
                        ListWebService(list_id,service_id);
                    });
                }
            });
        });
    }

    unitAsyncTest('List Setting List (List Before Update)',
        {   "Command" : "List.GetSetting",
            "SessionID": SessionID,
            "ListID" : list_id
    });

    unitAsyncTest('List Save Setting List (List Update)',
        {   "Command" : "List.SaveSettingList",
            "SessionID": SessionID,
            "ListID" : list_id,
            "DataParam" : { "list_name":"List Update "+now,
                            "sub_trigger": {
                                "enable_status" : "T",
                                "trigger_url" : "https://my.service.com/callback_webservice",
                                "format" : "json"
                            },
                            "unsub_trigger" :{
                                "enable_status" : "T",
                                "trigger_url" : "https://my.service.com/callback_webservice_unsub",
                                "format" : "json"
                            }

                    }
    });

    unitAsyncTest('List Setting List (List After Update)',
        {   "Command" : "List.GetSetting",
            "SessionID": SessionID,
            "ListID" : list_id
    });

    if(AJAX_OPTION_REQUEST == 1){

        unitAsyncTest('List.CustomFields.Get',
            {   "Command" : "CustomFields.Get",
                "SessionID": SessionID,
                "ListID" : list_id,
                "SelectMode":"get_list"
        });

        QUnit.test("API v1.5 : CustomFields Create", function(assert){
            var done = assert.async();
            $.ajax({
                type: "post",
                url: URL_API,
                data:{  "Command" : "CustomFields.Create",
                        "SessionID": SessionID,
                        "ListID" : list_id,
                        "FieldKeyName" : rand_name,
                        "FieldName" : "CF"+rand_name,
                        "FieldType" : "Single line",
                        "ValidationMethod" : "Disabled"
                },
                dataType:"json",
                error:function(e){
                    equal(e.status,'success',e.statusText);
                },
                success:function(data,status,e){
                    if(data['Success']){
                        assert.equal(data['Success'],true,"ajax status : "+status);
                        assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                        done();
                    } else {
                        assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                        assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                        done();
                    }
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var custom_field_id = data['data']['CustomFieldID'];
                    QUnit.module("List Test", function( hooks ) {
                        ListCustomField(list_id,custom_field_id);
                    });
                }
            });
        });
    }else if (AJAX_OPTION_REQUEST == 2){

        unitAsyncTest('Segment Get',
                    {   "Command" : "Segment.Get",
                        "SessionID": SessionID,
                        "Permission" : "List",
                        "ListID" : "202",
                        "SelectMode"  : "get_list",
                        "OrderField" : "NAME",
                        "OrderType": "asc"
                    });

        QUnit.test("API v1.5 : Segment.Create", function(assert){
            var done = assert.async();
            $.ajax({
                type: "post",
                url: URL_API,
                data:{  "Command" : "Segment.Create",
                        "SessionID": SessionID,
                        "ListID" : list_id,
                        "SegmentRules" : "[[SubscriberID]||[Is smaller than]||[111]]",
                        "SegmentName" : "TEST SEGMENT",
                        "SegmentOperator" : "and"
                },
                dataType:"json",
                error:function(e){
                    equal(e.status,'success',e.statusText);
                },
                success:function(data,status,e){
                    if(data['Success']){
                        assert.equal(data['Success'],true,"ajax status : "+status);
                        assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                        done();
                    } else {
                        assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                        assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                        done();
                    }
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var segment_id = data['data']['SegmentID'];
                    QUnit.module("List Test", function( hooks ) {
                        segmentUnitTest(list_id,segment_id);
                    });
                }
            });
        });
    }else if(AJAX_OPTION_REQUEST == 3) {

        QUnit.test("API v1.5 : Subscribers Add", function(assert){
            var done = assert.async();
            $.ajax({
                type: "post",
                url: URL_API_DEV,
                data:{  "Command" : "Subscribers.Add",
                        "SessionID": SessionID,
                        "ListID": list_id,
                        "ModeImport" : "copyandpaste",
                        "SubscribersData" : "Test1@test.com,john doe|:|Test2@test.com,john2 doe",
                        "FieldTerminator" : ",",
                        "FieldEncloser" : ""
                    },
                dataType:"json",
                error:function(e){
                    equal(e.status,'success',e.statusText);
                },
                success:function(data,status,e){
                    if(data['Success']){
                        assert.equal(data['Success'],true,"ajax status : "+status);
                        assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                        done();
                    } else {
                        assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                        assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                        done();
                    }
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var key_import = data['data']['KeyImport'];
                    QUnit.module("List Test", function( hooks ) {
                        subscriberAddCommit(list_id,key_import);
                    });
                }
            });
        });
    }
}

function subscriberAddCommit(list_id,key_import){
    QUnit.test("API v1.5 : Subscribers AddCommit", function(assert){
        var done = assert.async();
        $.ajax({
            type: "post",
            url: URL_API_DEV,
            data:{  "Command" : "Subscribers.AddCommit",
                    "SessionID": SessionID,
                    "ListID": list_id,
                    "MatchedFields" : ["email"],
                    "KeyImport" : key_import,
                    "ModeImport" : "copyandpaste",
                    "AddToSuppressionList" : "none",
                    "DoNotSendOptInConfirmationEmail" : true
                },
            dataType:"json",
            error:function(e){
                equal(e.status,'success',e.statusText);
            },
            success:function(data,status,e){
                if(data['Success']){
                    assert.equal(data['Success'],true,"ajax status : "+status);
                    assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                    done();
                } else {
                    assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                    assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                    done();
                }
            },
            complete:function(e){
                var data = eval('('+e.responseText+')');
                var token = data['data']['Token'];
                QUnit.module("List Test", function( hooks ) {
                    getStatusAddCommit(list_id,token);
                });
            }
        });
    });
}

function getStatusAddCommit(list_id,token){
    QUnit.test("API v1.5 :Subscribers GetStatus", function(assert){
        var done = assert.async();
        $.ajax({
            type: "post",
            url: URL_API_DEV,
            data:{  "Command" : "Subscribers.GetStatus",
                    "SessionID": SessionID,
                    "Token": token,
                },
            dataType:"json",
            error:function(e){
                equal(e.status,'success',e.statusText);
            },
            success:function(data,status,e){
                if(data['Success']){
                    assert.equal(data['Success'],true,"ajax status : "+status);
                    assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                    done();
                } else {
                    assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                    assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                    done();
                }
            },
            complete:function(e){
                var data = eval('('+e.responseText+')');
                var total_success = data['data']['ImportedSuccess'];

                if(total_success > 0){
                    QUnit.module("List Test", function( hooks ) {
                        subscriberUnitTest(list_id);
                    });
                } else {
                    deleteList(list_id);
                }
            }
        });
    });
}

function subscriberUnitTest(list_id){

    unitAsyncTest('Subscribers.GetList',
        {   "Command" : "Subscribers.GetList",
            "SessionID": SessionID,
            "ListID": list_id,
            "OrderField" : "ID",
            "DisplayMode" : "all",
            "OrderType" : "DESC",
            "PerPage" : 1,
            "PerLimit" : 5
        });

    unitAsyncTest('Subscriber.GetStatusInfo',
        {   "Command" : "Subscriber.GetStatusInfo",
            "SessionID": SessionID,
            "ListID": list_id,
            "EmailAddress" : "Test1@test.com"
        });

    unitAsyncTest('Subscriber.GetInfo',
        {   "Command" : "Subscriber.GetInfo",
            "SessionID": SessionID,
            "ListID": list_id,
            "EmailAddress" : "Test1@test.com"
        });

    unitAsyncTest('Subscriber.Update',
        {   "Command" : "Subscriber.Update",
            "SessionID": SessionID,
            "ListID": list_id,
            "SubscribersID" : "1",
            "EmailAddress" : "Test1@test.com",
            "FormValue_Fields": {   "CustomFieldFirstname": "NAMETEST",
                                    "CustomFieldLastname" : "LASTTEST"
                                }
        });

    unitAsyncTest('Subscriber.Unsubscribe',
        {   "Command" : "Subscriber.Unsubscribe",
            "SessionID": SessionID,
            "ListID": list_id,
            "EmailAddress" : "Test1@test.com"
        });

    unitAsyncTest('Subscribers.Delete',
        {   "Command" : "Subscribers.Delete",
            "SessionID": SessionID,
            "ListID": list_id,
            "Subscribers" : [2]
        });

    deleteList(list_id);
}

function segmentUnitTest(list_id,segment_id){
    unitAsyncTest('Segment Update',
        {   "Command" : "Segment.Update",
            "SessionID": SessionID,
            "ListID": list_id,
            "SegmentID" : segment_id,
            "SegmentRules" : "[[SubscriberID]||[Is smaller than]||[111]]",
            "SegmentName" : "Segment Update "+now,
            "SegmentOperator" : "and"
        });

    unitAsyncTest('Segment Delete',
        {   "Command" : "Segment.Delete",
            "SessionID": SessionID,
            "ListID": list_id,
            "SelectedSegments[]" : segment_id
        });

    deleteList(list_id);
}

function ListCustomField(list_id,custom_field_id){

    unitAsyncTest('CustomFields Get',
        {   "Command" : "CustomFields.Get",
            "SessionID": SessionID,
            "ListID": list_id,
            "OrderField" : "ID",
            "OrderType":"ASC",
            "SelectMode":"get_list"
        });

    // CustomFields.GetDetail => List.GetSetting
    unitAsyncTest('CustomFields GetDetail',
        {   "Command" : "List.GetSetting",
            "SessionID": SessionID,
            "ListID": list_id,
            "CustomFieldID" : custom_field_id
        });

    unitAsyncTest('CustomFields Update',
        {   "Command" : "List.GetSetting",
            "SessionID": SessionID,
            "ListID": list_id,
            "CustomFieldID" : custom_field_id
        });

    unitAsyncTest('CustomFields Delete',
        {   "Command" : "CustomFields.Delete",
            "SessionID": SessionID,
            "ListID": list_id,
            "CustomFields" : custom_field_id
        });

    deleteList(list_id);
}

function deleteList(list_id){
    unitAsyncTest('Lists Delete',
        {   "Command" : "Lists.Delete",
            "SessionID" : SessionID,
            "Lists[]" : list_id
    });
}

function ListWebService(list_id,service_id){

    unitAsyncTest('List Get WebService',
        {   "Command" : "Lists.GetWebService",
            "SessionID": SessionID,
            "ListID": list_id,
            "EventType" : "subscription"
    });

    unitAsyncTest('Lists Remove WebService',
        {   "Command" : "Lists.RemoveWebService",
            "SessionID": SessionID,
            "UrlID": service_id
    });

    deleteList(list_id);
}

function CampaignUnitTest(campaign_id,content_id){

    if(AJAX_OPTION_REQUEST == 0){
        unitAsyncTest('Campaign Getlist',
            {   "Command" : "Campaign.Getlist",
                "SessionID": SessionID,
                "PerPage": "1",
                "PerLimit" : "15",
                "OrderField": "CreatedDate",
                "OrderType": "DESC",
                "CampaignMode" : "Draft"
        });

        unitAsyncTest('Campaign Update',
            {   "Command" : "Campaign.Update",
                "SessionID" : SessionID,
                "CampaignID" : campaign_id,
                "CampaignName" : "Campaigns Update"+now,
                "RecipientListsAndSegments" : "259:0",
                "CampaignStatus" : "Draft",
        });

        unitAsyncTest('Campaign GetDetail',
            {   "Command" : "Campaign.GetDetail",
                "SessionID" : SessionID,
                "CampaignID" : campaign_id,
                "SelectMode" : "Edit"
        });

        unitAsyncTest('Campaign ExportData',
            {   "Command" : "Campaign.ExportData",
                "SessionID": SessionID,
                "CampaignID" : campaign_id
        });

        unitAsyncTest('Campaign ExportRecipients',
            {   "Command" : "Campaign.ExportRecipients",
                "SessionID": SessionID,
                "CampaignID" : campaign_id
        });

        campaignDelete(campaign_id);
    }

    unitAsyncTest('Email Spam Test',
                        {   "Command" : "Email.SpamTest",
                            "SessionID" : SessionID,
                            "EmailID" : content_id,
                            "NeedUpdate" : "T",
                            "EmailContent" : JSON.stringify({  
                                                    "from_name": "test_test",
                                                    "from_email": "test_test@test.com",
                                                    "content_subject": "test_test",
                                                    "same_email": "T",
                                                    "reply_name": "",
                                                    "reply_email": "",
                                                })
                    },'DEV');

    if(AJAX_OPTION_REQUEST == 4){
        if(!AB_MODE){
            unitAsyncTest('Campaign Update (with Email)',
                        {   "Command" : "Campaign.Update",
                            "SessionID" : SessionID,
                            "CampaignID" : campaign_id,
                            "CampaignName" : "Campaigns Update "+now,
                            "RecipientListsAndSegments" : "259:0",
                            "CampaignStatus" : "Draft",
                            "EmailContentData" : JSON.stringify([{  
                                                    "content_id" : content_id,
                                                    "ab_split_id": -1,
                                                    "sender_name_value": "test",
                                                    "sender_email_value": "test@test.com",
                                                    "sender_subject_value": "test",
                                                    "same_name_email_value": "T",
                                                    "reply_name_value": "",
                                                    "reply_email_value": "",
                                                    "email_name": "B",
                                                    "status_found_template": "not_found",
                                                    "status_content": "F"
                                                }])
                    });
                
            campaignDelete(campaign_id);

        } else {

            QUnit.test("API v1.5 : Add New Email", function(assert){
            var done = assert.async();
            $.ajax({
                type: "post",
                url: URL_API,
                data:{  "Command" : "Campaign.AddNewEmail",
                        "SessionID": SessionID,
                        "CampaignID" : campaign_id,
                        "EmailContentStatus" : "draft"
                },
                dataType:"json",
                error:function(e){
                    equal(e.status,'success',e.statusText);
                },
                success:function(data,status,e){
                    if(data['Success']){
                        assert.equal(data['Success'],true,"ajax status : "+status);
                        assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                        done();
                    } else {
                        assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                        assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                        done();
                    }
                },
                complete:function(e){
                    var data = eval('('+e.responseText+')');
                    var content_id = data['data']['content_id'];
                    var ab_split_id = data['data']['ab_split_id'];
                    QUnit.module("Campaigns Test", function( hooks ) {
                        campaignEmail(content_id,ab_split_id,campaign_id);
                    });
                }
            });
        });
        }
    }
}

function campaignEmail(content_id,ab_split_id,campaign_id){

    unitAsyncTest('Duplicate Email',
            {   "Command" : "Campaign.DuplicateEmail",
                "SessionID" : SessionID,
                "EmailContentStatus" : "draft",
                "SplitID" : ab_split_id
        });

    unitAsyncTest('Email Update',
        {   "Command" : "Campaign.Update",
            "SessionID" : SessionID,
            "CampaignID" : campaign_id,
            "CampaignName" : "Campaigns Update"+now,
            "RecipientListsAndSegments" : "259:0",
            "CampaignStatus" : "Draft",
            "EmailContentData" : JSON.stringify([{  "content_id": content_id-2,
                                    "ab_split_id": ab_split_id-2,
                                    "sender_name_value": "asd1",
                                    "sender_email_value": "asd1@asd.com",
                                    "sender_subject_value": "asd1",
                                    "same_name_email_value": "T",
                                    "reply_name_value": "",
                                    "reply_email_value": "",
                                    "email_name": "B",
                                    "status_found_template": "not_found",
                                    "status_content": "F"
                                },{
                                    "content_id": content_id-1,
                                    "ab_split_id": ab_split_id-1,
                                    "sender_name_value": "asd2",
                                    "sender_email_value": "asd2@asd.com",
                                    "sender_subject_value": "asd2",
                                    "same_name_email_value": "T",
                                    "reply_name_value": "",
                                    "reply_email_value": "",
                                    "email_name": "B",
                                    "status_found_template": "not_found",
                                    "status_content": "F"
                                },{
                                    "content_id": content_id,
                                    "ab_split_id": ab_split_id,
                                    "sender_name_value": "asd3",
                                    "sender_email_value": "asd3@asd.com",
                                    "sender_subject_value": "asd3",
                                    "same_name_email_value": "T",
                                    "reply_name_value": "",
                                    "reply_email_value": "",
                                    "email_name": "B",
                                    "status_found_template": "not_found",
                                    "status_content": "F"
                                }])
    });

    unitAsyncTest('Remove Email',
        {   "Command" : "Campaign.RemoveEmail",
            "SessionID": SessionID,
            "CampaignID" : campaign_id,
            "SplitID": ab_split_id
    });

    campaignDelete(campaign_id);
}

function campaignDelete(campaign_id){

    unitAsyncTest('Campaign DeleteCampaign',
            {   "Command" : "Campaign.DeleteCampaign",
                "SessionID": SessionID,
                "SelectedCampaigns[]" : campaign_id
        });
}

function unitAsyncTest(name,param,mode){

    var url = URL_API;
    if(mode == 'DEV'){
        var url = URL_API_DEV;
    }

    QUnit.test("API v1.5 : "+name, function(assert){
        var done = assert.async();
        $.ajax({
            type: "POST",
            url: url,
            data: param,
            dataType:"json",
            error:function(e){
                equal(e.status,'success',e.statusText);
            },
            success:function(data,status,e){
                if(data['Success']){
                    assert.equal(data['Success'],true,"ajax status : "+status);
                    assert.equal(data['Success'],true, "Respone : " + JSON.stringify(data['data']));
                    done();
                } else {
                    assert.equal(data['Success'],true," ErrorCode : " + data['ErrorCode']);
                    assert.equal(data['Success'],true," ErrorMessage : " + data['ErrorMessage']);
                    done();
                }
            }
        });
    });
}