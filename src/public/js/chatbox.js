
/* Declaration of global variables */
var contentbox = "";

var chatText="";
var speechText="";
var responseContext="";
var claimPolicy ="";
var VEHICLE_REGISTRATION_NO ="";
var CLIENT_CONTACT_NUMBERS ="";
var check_policy_flg="";
var chkExitFlg =0;
var chkResponseExtFlg = 0;
var chatLang = "";
var id ='usecases';
var dropDownFlag = 0;
//var url1 ='http://localhost:6002/';
//var url1 ='https://mhpsemail.mybluemix.net/';
var url1 ='http://nodechatapp03.azurewebsites.net/';

gettoken(function(post){   ///get the token
	console.log('token is' , post);

//	Function to validate the policy number //

function fetchBluemixResponse(chatText,call,chatLang){

		var data = {};
		//Ajax call to bluemix service to send the text. Response is fetched and is shown in chat box by appeneding in the dialog box as HTML. //
		data.title = chatText;
		data.chatLang=chatLang;
		data.responseContext = responseContext;
		console.log('db flag is',responseContext.db_flag);
		//Ajax call
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType:'json',
			url: url1 + 'classify',
			success: function(data) {
				responseContext = data.context;
				// to disable the mic button when ask for project name
				if(responseContext.project_flag == 'x1' )
				{
					console.log('in mic oof '+responseContext.project_flag);
					$("#speech").css("pointer-events", "none");
					$('#speech').removeClass('chatIcon').addClass('chatIcon1');
					responseContext.project_flag ='';
				}
				else
				{
					$("#speech").css("pointer-events", "auto");
					$('#speech').removeClass('chatIcon1').addClass('chatIcon');
				}
				responseContext.project_flag ='';
				var now = new Date(Date.now());
				var formatted1 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

				if(responseContext.db_flag =='x2') //completed
				{
					console.log('in x2');

					passtoken(post , data.output.text[0],chatLang);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img  src='images/Capture.png' style='margin-left: -58px;width: 54px;border-radius: 55%;' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					var status= responseContext.status_flag;     //'開始した';  //started
					console.log("status::"+status);
					var flag = 'actualdate' ;// date for compare
					fetchactivities(status,post,flag,chatLang) ;
					responseContext.db_flag ='' ;
				}
				else if(responseContext.dbflag_1 =='x5') //fetching detail from db
				{
					var usecase_flag = responseContext.usecase_flag;//name of use case6
					var phase_flag = responseContext.phase_flag;//design,development @PHASE
					console.log(usecase_flag,phase_flag);
					passtoken(post , data.output.text[0],chatLang);//please wait
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img src='images/Capture.png' style='margin-left: -58px;width: 54px;border-radius: 55%;' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchphasedetail(usecase_flag ,post,phase_flag,chatLang) ; //calling function to get the phase_details
					responseContext.dbflag_1 ='' ;
				}
				else if(responseContext.dbflag_1 =='x6') //getting the status based on three values
				{
					var activity_flag = responseContext.activity_flag;//name of use case  //its comma separated value.
					var usecase_flag = responseContext.usecase_flag;//name of use case6
					var phase_flag = responseContext.phase_flag;//design,development @PHASE_DETAIL
					passtoken(post , data.output.text[0],chatLang);//please wait
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchstatusdetail(activity_flag ,usecase_flag,phase_flag,responseContext.dbflag_1,post,chatLang) ;
					responseContext.dbflag_1 ='' ;
				}
				else if(responseContext.dbflag_1 =='x7') //updating the status
				{
					var activity_flag = responseContext.activity_flag;//name of use case  //its comma separated value.
					var usecase_flag = responseContext.usecase_flag;//name of use case6
					var phase_flag = responseContext.phase_flag;//design,development @PHASE_DETAIL
					var update_flag = responseContext.status_3;  ///flag which need to be updated
					console.log(activity_flag ,usecase_flag,phase_flag,update_flag );
					passtoken(post , data.output.text[0],chatLang);//please wait
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchstatusupdate(activity_flag ,usecase_flag,phase_flag,update_flag,post,chatLang) ;
					responseContext.dbflag_1 ='' ;
				}
				else if (responseContext.dbflag_1 =='x4')
				{
					console.log('in x4');
					passtoken(post , data.output.text[0],chatLang);
					if(chatLang=="JP"){
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" + '段階を選択してください。:'+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
				  }
					else {
						$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" + 'Please select a stage. :'+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					}
					fetchforx4();
					responseContext.dbflag_1 ='' ;
				}
				else if(responseContext.dbflag_1 =='x1') //fetching detail from db
				{
					var usecase_flag = responseContext.usecase_flag;//name of use case
					var phase_flag = responseContext.phase_flag;//design,development @PHASE_DETAIL
					console.log(usecase_flag , phase_flag);
					passtoken(post ,data.output.text[0],chatLang );
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchphasedetail(usecase_flag ,post, phase_flag,chatLang) ;
					responseContext.dbflag_1 ='' ;
				}
				else if(responseContext.dbflag_1 =='x3') //fetching detail from db
				{
					var activity_flag = responseContext.activity_flag;//name of use case  //its comma separated value.
					var usecase_flag = responseContext.usecase_flag;//name of use case6
					var phase_flag = responseContext.phase_flag;//design,development @PHASE_DETAIL
					console.log(activity_flag ,usecase_flag,phase_flag);
					passtoken(post , data.output.text[0]);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchstatusdetail(activity_flag ,usecase_flag,phase_flag,post,chatLang) ;
					responseContext.dbflag_1 ='' ;
				}
				//usecase3
				else if(responseContext.dbflag_1 =='y1') //fetching detail from db
				{
					var equipment = responseContext.Equipment;//boiler..turbine
					var p_name = responseContext.P_NAME;//name of the project
					console.log(equipment,p_name);
					passtoken(post , data.output.text[0],chatLang);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchoccurance(p_name,equipment,post,chatLang) ;
					responseContext.dbflag_1 ='' ;
				}
				else if(responseContext.dbflag_1 =='y2') //fetching detail from db
				{
					var equipment = responseContext.Equipment;//boiler..turbine
					var p_name = responseContext.P_NAME;//name of the project
					var issue_name = responseContext.ISSUE_NAME;//name of the project
					console.log(p_name,equipment,issue_name);
					passtoken(post , data.output.text[0]);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchpendingissue(p_name,equipment,issue_name,post) ;
					responseContext.dbflag_1 ='' ;
				}
				///usecase3 scenario2
				else if(responseContext.dbflag_1 =='y3') //fetching detail from db
				{
					console.log('in y3');
					var equipment = responseContext.Equipment;//boiler..turbine
					var issue_name = responseContext.ISSUE_NAME;//occurance .. horizon deployment
					var pending_issue = responseContext.PENDING_ISSUE;//pending issue it will be input text from drop down list
					passtoken(post , data.output.text[0],chatLang);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchpendingissue2(p_name,equipment,issue_name,pending_issue,post) ;
					responseContext.dbflag_1 ='' ;
					responseContext.P_NAME ='' ;
					console.log('pname is',responseContext.P_NAME);
				}
				///usecase3 scenario2  y4
				else if(responseContext.dbflag_1 =='y4') //fetching detail from db
				{
					passtoken(post , data.output.text[0],chatLang);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchall() ;
					responseContext.dbflag_1 ='' ;
				}
				else if(responseContext.dbflag_1 == 'y5') //fetching detail from db
				{
					console.log('in y5');
					var equipment = responseContext.Equipment;//boiler..turbine
					var occurance = responseContext.ISSUE_NAME;//occurnace
					console.log(equipment,occurance);
					passtoken(post , data.output.text[0],chatLang);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchpendingissue('ALL',equipment,occurance,post,chatLang) ;
					responseContext.dbflag_1 ='' ;
				}
				else if(responseContext.dbflag_1 =='y6') //fetching detail from db
				{
					console.log('in y6');
					var equipment = responseContext.Equipment;//boiler..turbine
					passtoken(post , data.output.text[0]);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					fetchoccurance('ALL',equipment,post,chatLang) ;
					responseContext.dbflag_1 ='' ;
				}
				else if (responseContext.dbflag_1 =='d7') //discovery
				{
					console.log('in d7');
					var discovery = data.output.text[0];
					passtoken(post , data.output.text[0],chatLang);//please wait
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					Discovery(data,post) ;
					responseContext.dbflag_1 ='' ;
				}
				else if (responseContext.dbflag_1 =='d8') //translate
				{
					console.log('in d8');
					var discovery = data.output.text[0];
					passtoken(post , data.output.text[0],chatLang);//please wait
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					translate(data,post) ;
					responseContext.dbflag_1 ='' ;
				}
				else if (responseContext.dbflag_1 =='e1') //discovery
				{
					var discovery = data.output.text[0];
					console.log("hi email wala part"+discovery);
					passtoken(post , data.output.text[0],chatLang);//please wait
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
					Discovery1(data,post) ;
					responseContext.dbflag_1 ='' ;
				}
				else
				{
					passtoken(post , data.output.text[0],chatLang);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.output.text[0]+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
				}
				var d = $('.popup-messages');
				d.scrollTop(d.prop("scrollHeight"));
			},
			error: function(error) {
				console.log("some error in fetching the notifications");
			}
		});
	}
////	function --No change

function commaSeparateNumber(val){
		while (/(\d+)(\d{1})/.test(val.toString())){
			val = val.toString().replace(/(\d+)(\d{1})/, '$1'+','+'$2');
		}
		return val;
	}

function xyz(text){
		var text =text ;
		var now = new Date(Date.now());
		var formatted2 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
		$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-text' style='background-color:blanchedalmond'>" +text+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>"  +formatted2+ "</span></div></div>");
		var call =0;
		fetchBluemixResponse(text,call,chatLang) ;
	}

function toTitleCase(str){
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

$(function(){
		$("#progress").hide();
			$('body').on('click', '#speech', function(){
				startListening(chatLang,function() {
				speechText = $("#status_message").val();
				var now = new Date(Date.now());
				var formatted1 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
				$("#progress").show();
				if(speechText.length > 0){

				}
				else
				{
					alert("Please speak something");

				}

				$("#status_message").val("");
				var d = $('.popup-messages');
				d.scrollTop(d.prop("scrollHeight"));
				var call = 1;
				fetchBluemixResponse(speechText,call,chatLang);
			});
		});

		$('body').on('click', '#send', function(){
			chatText = $("#status_message").val();
			$("#status_message").attr("value", "");
			var now = new Date(Date.now());
			var formatted1 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
				if(chatText.length > 0){
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-text' style='background-color:blanchedalmond'>" +chatText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
				}
				else{
					alert("Please enter some text");
				}
			$("#status_message").val("");
			var d = $('.popup-messages');
			d.scrollTop(d.prop("scrollHeight"));
			var call = 0;
			fetchBluemixResponse(chatText,call,chatLang);
		})

		$('body').on('keypress', '#status_message', function(e){
			if(e.keyCode == 13 && !e.shiftKey) {
				e.preventDefault();
				chatText = $("#status_message").val();
				$("#status_message").attr("value", "");
				var now = new Date(Date.now());
				var formatted1 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
				var buttontext = 'checking button';
				if(chatText.length > 0)
				{
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-text' style='background-color:blanchedalmond'>" +chatText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
				}
				else
				{
					alert("Please enter some text");
				}
				$("#status_message").val("");
				var d = $('.popup-messages');
				d.scrollTop(d.prop("scrollHeight"));
				var call = 0;
				fetchBluemixResponse(chatText,call,chatLang);
			}
		})

		$('#lang-selector').change(function(e){
			chatLang = $("#lang-selector option:selected" ).val();
			$('#myModal').modal('hide');
			if(chatLang=="JP"){
				document.getElementById("popupHeading").innerHTML = "ライブチャット";
				document.getElementById("pageTitle").innerHTML = "プロジェクトマネージャのクエリダッシュボード";
				document.getElementById("clickToChat").innerHTML = "チャット";
				document.getElementById("supportDesk").innerHTML = "サポート窓口";
			}
			else{
				document.getElementById("popupHeading").innerHTML = "Live Chat";
				document.getElementById("pageTitle").innerHTML = "Project Manager Query Dashboard";
				document.getElementById("clickToChat").innerHTML = "Chat";
				document.getElementById("supportDesk").innerHTML = "Support Desk";

			}
			$('#livechat_charms')[0].click();
			$('#lang-selector option').prop('selected', function() {
				return this.defaultSelected;
			});

		});
		// To open chat box on click of claims icon //

		$('body').on('click', '#livechat_charms', function(){
    		var today = new Date()
			var curHr = today.getHours()
			var greeting ="";
				if (curHr < 12)
				{
				  greeting= (chatLang == "JP" ? 'おはようございます！ いらっしゃいませ。ご用件を入力してください。': "Good Morning!How Can I help You");
				}
				else if (curHr < 18)
				{
				greeting=(chatLang == "JP" ? 'こんにちは！ いらっしゃいませ。ご用件を入力してください。': "Hello Afternoon!How Can I help You");
				}
				else
				{
				greeting=(chatLang == "JP" ? 'こんばんは！いらっしゃいませ。ご用件を入力してください。': "Good Evening!How Can I help You");
				}
			passtoken(post , greeting,chatLang);
			$('#qnimate').addClass('popup-box-on');
			var text1 = greeting  ;
			$("#greetings").html(text1);
			contentbox = $('#qnimate').html();
			var now = new Date(Date.now());
			var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
			$("#time").html(formatted);
			var data = {};
			data.title = "";
			data.responseContext = responseContext;
			data.chatLang=chatLang;

//			Ajax call to bluemix service to send the text. Response is fetched and is shown in chat box by appeneding in the dialog box as HTML. //
			$.ajax({
				type: 'POST',
				data: JSON.stringify(data),
				contentType: "application/json",
				dataType:'json',
				url: url1 + 'classify',
				success: function(data) {
					responseContext = data.context;
				}
			});
		});

		$('body').on('click', '#removeClass', function(){
			$('#qnimate').removeClass('popup-box-on');
			$('#qnimate').html(contentbox);
			$('#qnimate').replaceAll($('#qnimate'));
			responseContext="";
		});

	})
});
