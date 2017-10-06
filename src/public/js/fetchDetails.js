function usecaseSelect(){
	var fld = document.getElementById('usecases' + dropDownFlag);
	var values = [];
	for (var i = 0; i < fld.options.length; i++) {
		if (fld.options[i].selected) {
			values.push(fld.options[i].value);
		}
	}
	$("#status_message").val(values);
	dropDownFlag++;
	$("#send")[0].click();
}

//Start:function to fetch the list of activites based on completed/delay/progress

function fetchactivities(status,post,flag,chatLang){
	//console.log('in fetch activity fucntion ChatLang is '+chatLang) ;
	var now = new Date(Date.now());
	var formatted5 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var status = status;
	var moreText="";
	var data ={};
	var FetchQuery = '';
		if(chatLang=="JP"){
			moreText="他に知りたいことありますでしょうか";
			if(status =='完了'){//complete
				FetchQuery ="SELECT CONCAT(CONCAT(USECASE,':') ,PHASE_DETAIL) USECASE FROM  MHPSJP4 where A_E_D is not null ";
			}else if(status =='遅れている'){//late
				FetchQuery ="SELECT CONCAT(CONCAT(USECASE,':') ,PHASE_DETAIL) USECASE FROM  MHPSJP4 where A_E_D is  null  and sysdate>P_E_D";
			}else{   //進行中  in progress
				FetchQuery ="SELECT CONCAT(CONCAT(USECASE,':') ,PHASE_DETAIL) USECASE FROM  MHPSJP4 where A_E_D is null and sysdate <=P_E_D and STATUS1 ='着手済' ";
			}
		}
		else{
			moreText="Do you have anything else you would like to know?";
			if(status =='完了'){//complete
					FetchQuery ="SELECT CONCAT(CONCAT(USECASE,':') ,PHASE_DETAIL) USECASE FROM  MHPSJP4 where A_E_D is not null ";
				}else if(status =='遅れている'){//late
					FetchQuery ="SELECT CONCAT(CONCAT(USECASE,':') ,PHASE_DETAIL) USECASE FROM  MHPSJP4 where A_E_D is  null  and sysdate>P_E_D";
				}else{   //進行中  in progress
					FetchQuery ="SELECT CONCAT(CONCAT(USECASE,':') ,PHASE_DETAIL) USECASE FROM  MHPSJP4 where A_E_D is null and sysdate <=P_E_D and STATUS1 ='started' ";
				}
		}
	data.fetchQuery =FetchQuery;

	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType:'json',
		url: url1 + 'fetchactivities',
		success: function(data) {
				var x ='<html><head><style> table, th, td { border: 1px solid black;}</style></head> <body><table>';
				for(var i=0;i<data.length ;i++){
					x += '<tr><td style="width:50%">'+ data[i].USECASE + '</td></tr>' ;
				}
				x+='</table></body></html>';
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div> <b>"+ x +".</b>.</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
				passtoken(post,moreText,chatLang);
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +moreText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
				var d = $('.popup-messages');
				d.scrollTop(d.prop("scrollHeight"));
		}
	});
}
//End:function to fetch the list of activites based on completed/delay/progress

//Start:function to fetch the list of Phases based on completed/delay/progress
function fetchphasedetail(u_flag,post,p_flag,chatLang){
	var now = new Date(Date.now());
	var formatted5 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var status = status;
	var data ={};
	var listText="";
	var statusText="";
	p_flag =p_flag ;   //design/developement
	var FetchQuery="";
	if(chatLang=='JP'){
		listText="以下は活動のリストです";
		statusText="どの作業のステータスを知りたいでしょうか。";
	}else{
		listText="The following is a list of activities";
		statusText="What status do you want to know?";
	}
	FetchQuery ="SELECT PHASE_DETAIL FROM  MHPSJP4 where USECASE = '" + u_flag +  "'and PHASE= '" + p_flag +"'" ;
	data.fetchQuery =FetchQuery;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType:'json',
		url: url1 + 'fetchphasedetail',
		success: function(data) {
			$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div> <b>"+ listText +".</b></div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			var x ="<select multiple id='usecases"+ dropDownFlag +"'>";
				for(var i=0;i<data.length ;i++){
					x += "<option value='" + data[i].PHASE_DETAIL + "'>" + data[i].PHASE_DETAIL  + " </option>";
				}
				x+="</select>  <button id='usecases_btn' onclick='usecaseSelect()' type='submit'  title='Type and enter'  name='usercase_btn' value='Submit'>Send</button>";
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div> <b>"+ x +".</b></div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			//Which activity status you want?
			setTimeout(function(){
				passtoken(post , statusText ,chatLang);
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +statusText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			},3000);
			var d = $('.popup-messages');
			d.scrollTop(d.prop("scrollHeight"));
		}

	});
}

//End:function to fetch the list of activites based on completed/delay/progress scenaio1 usecase6

function fetchstatusdetail(activity_flag ,usecase_flag,phase_flag,dbflag_1,post,chatLang)
{
	//console.log('in fetch activity fucntion') ;
	var now = new Date(Date.now());
	var formatted5 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var activity_flag =activity_flag;
	var usecase_flag=usecase_flag;
	var phase_flag =phase_flag;
	var data ={};
	var arr1 =activity_flag.split(",");  //split the multiple values which are seprated by ,
	var FetchQuery ="";
	var moreText="";
		if (arr1.length ==2){
			var val1 = arr1[0];
			var val2 = arr1[1];
			//console.log('values:: ',val1 ,val2);
				if(chatLang=="EN"){
					moreText="Do you have anything else you want to know?";
				}
				else{
					moreText="他に知りたいことありますでしょうか";
				}
				FetchQuery ="SELECT A_E_D ,SYSDATE C_D , P_E_D,P_S_D ,STATUS1 ,PHASE_DETAIL FROM  MHPSJP4 where PHASE ='"+phase_flag+ "'and USECASE ='" +usecase_flag +"'"  + " and (PHASE_DETAIL ='" +val1 +"' OR " + "PHASE_DETAIL ='" +val2 +"')" ;
		}
		else{
			if(chatLang=="EN"){
				moreText="Do you have anything else you want to know?";
			}else{
				moreText="他に知りたいことありますでしょうか";
			}
			FetchQuery ="SELECT A_E_D ,SYSDATE C_D , P_E_D,P_S_D ,STATUS1,PHASE_DETAIL FROM  MHPSJP4 where PHASE ='"+phase_flag+ "'and USECASE ='" +usecase_flag +"' and PHASE_DETAIL ='" +activity_flag +"'" ;
		}

	//console.log('started status field is' ,status);
	data.fetchQuery =FetchQuery;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType:'json',
		url: url1 + 'fetchactivities',
		success: function(data) {
			//console.log('db call success');
			//console.log(data[0]);
			//console.log(data[1]);
			var z ='';
			for (var i=0;i<data.length;i++)
			{
				var A_E_D =data[i].A_E_D;
					if(A_E_D){
						A_E_D =new Date(data[i].A_E_D );
					}
					else{
						A_E_D ='';
					}
				var P_E_D =new Date(data[i].P_E_D) ;
				var P_S_D =new Date(data[i].P_S_D);
				var status =data[i].STATUS1 ; //started
				var currentdate =new Date(data[i].C_D) ;
				var x ='';
				//logic to check the status for an activity
				if(A_E_D)  //already completed
				{
					var x="";
					if(P_E_D>=A_E_D)//end date is  > =actual date  ====completed on time
					{
						 x = '作業のステータス：遅れなく完了' //活動状況：時間通りに完了しました' 作業のステータス：遅れなく完了
					}
					else{
						 x =   '作業のステータス：完了済、遅れあり' //'活動ステータス：完了しましたが遅れました' //completed with delay
					}
				}
				else    ///if actual date is null
				{
					var x ="";
					if(status == '未着手')   //not started
					{
												if(P_S_D>=currentdate)
							 x =   '作業のステータス：未着手'     //not started
						else
							 x =    '作業のステータス：未着手、遅れあり'    //delayed not started
					}
					else   //if status is started
					{
						if(P_E_D >=currentdate)   //started and not completed.. bcos p_e_D is far
							 x = '作業のステータス：進行中'  //アクティビティのステータス：進行中' in progress
						else
							 x ='作業のステータス：進行中、遅れあり'  // progress with delay
					}
				}
				if(dbflag_1 == 'x6')
				{
					z+=  x;
				}
				else
				{
					z+= '<br>' + data[i].PHASE_DETAIL + '<br>'  + x
				}
				//console.log(z);
			}
			$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div> <b>"+ z +".</b>.</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			//is there anything correct else I can help you
			//startSpeaking('他に知りたいことありますでしょうか');
			passtoken(post ,moreText,chatLang);
			if(dbflag_1 =='x6'){
				if(chatLang=="EN"){
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +'Which activity status do you want to update?'+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
				}
				else {
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +'ステータスを何に変更しますか '+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
				}
			}
			else{
				if(chatLang=="EN"){
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +'Do you have anything else you would like to know?"'+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
				}
				else {
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +'他に知りたいことありますでしょうか'+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
				}
			}
			var d = $('.popup-messages');
			d.scrollTop(d.prop("scrollHeight"));
		}
	});
}

function fetchstatusupdate(activity_flag ,usecase_flag,phase_flag,status_update,post,chatLang)  //to update the status
{
	//console.log('in update statusfucntion') ;
	var now = new Date(Date.now());
	var formatted5 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var activity_flag =activity_flag;
	var usecase_flag=usecase_flag;
	var phase_flag =phase_flag;
	var status = status_update ;
	var data ={};
	var FetchQuery='';
	var moreText="";
	if (status =='completed' || status == '完了') ///if user want to update the status as complete
	{
		if(chatLang=='EN'){
			moreText="Do you have anything else you would like to know?";
		}else{
			moreText="他に知りたいことありますでしょうか";
		}
				FetchQuery ="UPDATE MHPSJP4 SET A_E_D =SYSDATE ,STATUS1 ='完了' where PHASE ='"+phase_flag+ "' and USECASE ='" +usecase_flag +"' and PHASE_DETAIL ='" +activity_flag +"'" ;
	}
	else if(status =='着手済' || status =='in progress' || status == '着手済み' || status =='進行中')  //in progess/started if user want to update the status
	{
		if(chatLang=='EN'){
			moreText="Do you have anything else you would like to know?";
		}else{
			moreText="他に知りたいことありますでしょうか";
		}
		FetchQuery ="UPDATE MHPSJP4 SET STATUS1 = '着手済' where PHASE ='"+phase_flag+ "'and USECASE ='" +usecase_flag +"' and PHASE_DETAIL ='" +activity_flag +"'" ;
	}
	else
	{
		if(chatLang=='EN'){
			moreText="Do you have anything else you would like to know?";
		}else{
			moreText="他に知りたいことありますでしょうか";
		}
			FetchQuery ="UPDATE MHPSJP4 SET A_E_D =SYSDATE ,STATUS1 ='着手済' where PHASE ='"+phase_flag+ "' and USECASE ='" +usecase_flag +"' and PHASE_DETAIL ='" +activity_flag +"'" ;
	}
	//console.log('query is' ,FetchQuery);
	data.fetchQuery =FetchQuery;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType:'json',
		url: url1 + 'updatestatus',
		success: function(data) {
			//console.log('db call success');
			//console.log(data[0]);
			var z ='';
			z= data[0].text;
			//console.log(z);
			$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div> <b>"+ z +".</b>.</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			//is there anything correct else I can help you
			//setTimeout(function(){
			passtoken(post ,moreText,chatLang);
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +moreText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");

			//},3000);
			var d = $('.popup-messages');
			d.scrollTop(d.prop("scrollHeight"));
		}
	});
}

function fetchforx4()
{
	//console.log('in x4 function');
	var now = new Date(Date.now());
	var formatted1 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var data =[{'phase': '要件定義'} , {'phase': '基本と詳細設計'} ,{'phase': '開発'}];
	var x ="<select multiple id='usecases"+ dropDownFlag +"'>";
	for(var i=0;i<data.length ;i++)
	{
		x += "<option value='" + data[i].phase + "'>" + data[i].phase  + " </option>";
	}
	x+="</select>  <button id='usecases_btn' onclick='usecaseSelect()' type='submit'  title='Type and enter'  name='usercase_btn' value='Submit'>Send</button>";
	$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" + x+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
}

////fetch all the Causes...

////function to fetch the list of activites based on completed/delay/progress
function fetchoccurance(p_name,equipment,post,chatLang){
	console.log('in fetch activity fucntion') ;
	var now = new Date(Date.now());
	var formatted5 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var data ={};
	var FetchQuery = '';
	var moreText="";
	if(p_name =='Proto-C')  //complete
	{
		if(chatLang=='EN'){
			moreText="Please tell me the cause of the problem you wanted to find.";
		}
		else{
			moreText="お探ししたい問題の発生原因を教えてください。";
		}
		FetchQuery ="SELECT DISTINCT  OCCURANCE FROM  MHPSJPUC31 where PENDING_ISSUE LIKE '%"+ equipment +"%' AND P_NAME ='" + p_name + "'  ";
		console.log(FetchQuery);
	}
	else if(p_name =='Proto-B') {//late
		//console.log('in proto B');
		if(chatLang=='EN'){
			moreText="Please tell me the cause of the problem you wanted to find.";
		}else{
		  moreText="お探ししたい問題の発生原因を教えてください。";
		}
		FetchQuery ="SELECT DISTINCT  OCCURANCE FROM  MHPSJPUC31 where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND P_NAME ='" + p_name + "'  ";
	}
	else if(p_name =='ALL'){
		//console.log('in all');
		if(chatLang=='EN'){
			moreText="Please tell me the cause of the problem you wanted to find.";
		}else{
			moreText="お探ししたい問題の発生原因を教えてください。";
		}
			console.log('in protoc in ALL' ,FetchQuery);
		FetchQuery ="SELECT  DISTINCT  OCCURANCE  FROM  MHPSJPUC31 where PENDING_ISSUE LIKE  '%"+ equipment +"%'"
			+  "  UNION  " + "SELECT DISTINCT  OCCURANCE  FROM  PROTOB where PENDING_ISSUE LIKE  '%"+ equipment +"%'"
			+	"  UNION  "  + "SELECT DISTINCT  OCCURANCE  FROM  PROTOA where PENDING_ISSUE LIKE  '%"+ equipment +"%'";
	}
	else{
		if(chatLang=='EN') {//check for datbase A
		moreText="Please tell me the cause of the problem you wanted to find.";
		}else{
			moreText="お探ししたい問題の発生原因を教えてください。";
		}
		FetchQuery ="SELECT DISTINCT  OCCURANCE FROM  MHPSJPUC31 where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND P_NAME ='" + p_name + "'  ";
	}
	data.fetchQuery =FetchQuery;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType:'json',
		url: url1 + 'fetchactivities',
		success: function(data) {
			//console.log('db call success for usecase31');
			//console.log(data[0]);
			var x ='<html><head><style> table, th, td { border: 1px solid black;}</style></head> <body><table>';
			for(var i=0;i<data.length ;i++){
				x += '<tr><td style="width:50%">'+ data[i].OCCURANCE + '</td></tr>' ;
				// console.log(x);
			}
			x+='</table></body></html>';
			//console.log(x);
			$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div> <b>"+ x +".</b>.</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			//Occurance due to which you would like to search
			//startSpeaking('他に知りたいことありますでしょうか');
			passtoken(post, moreText,chatLang);
			$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +moreText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			var d = $('.popup-messages');
			d.scrollTop(d.prop("scrollHeight"));
		}
	});
}

////function to fetch the list of activites based on completed/delay/progress
function fetchpendingissue(p_name,equipment,issue_name,post,chatLang){
	//console.log('in fetch activity fucntion') ;
	var now = new Date(Date.now());
	var formatted5 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var data ={};
	var FetchQuery = '';
	var issue ='';
	var FetchQuery='';
	if(p_name =='Proto-C'){ //complete
		if(chatLang=='EN'){
			moreText="Please select the nonconformity you want to see.";
	 	}else{
			moreText="ご覧になりたい不適合を選択してください。";
		}
		 FetchQuery ="SELECT   PENDING_ISSUE ,PENDING_ISSUE_DETAIL  FROM  MHPSJPUC311 where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND  OCCURANCE ='"+ issue_name+"'";
	}
	else if(p_name =='Proto-B') { //late
		if(chatLang=='EN'){
			moreText="Please select the nonconformity you want to see.";
		}
		else{
			moreText="ご覧になりたい不適合を選択してください。";
		}
		FetchQuery ="SELECT PENDING_ISSUE ,PENDING_ISSUE_DETAIL  FROM  PROTOB where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND  OCCURANCE ='"+ issue_name+"'";
	}
	else if(p_name =='Proto-A'){
		if(chatLang=='EN'){
			moreText="Please select the nonconformity you want to see.";
		}
		 else{
			moreText="ご覧になりたい不適合を選択してください。";
			}//check for datbase A
			FetchQuery ="SELECT PENDING_ISSUE ,PENDING_ISSUE_DETAIL  FROM  PROTOA where PENDING_ISSUE LIKE  ' %"+ equipment +"%' AND OCCURANCE = '"+ issue_name+"'";
	}
	else if(p_name =='ALL'){
		if(chatLang=='EN'){
			moreText="Please select the nonconformity you want to see.";
		}else{
			moreText="ご覧になりたい不適合を選択してください。";
		}
			FetchQuery ="SELECT  PENDING_ISSUE ,PENDING_ISSUE_DETAIL  FROM   MHPSJPUC31 where PENDING_ISSUE LIKE  '%"+ equipment +"%'  AND OCCURANCE = '"+ issue_name+"'"
		+  "  UNION  " + "SELECT PENDING_ISSUE ,PENDING_ISSUE_DETAIL  FROM  PROTOB where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND   OCCURANCE = '"+ issue_name+"'"
		+	"  UNION  "  + "SELECT PENDING_ISSUE ,PENDING_ISSUE_DETAIL  FROM  PROTOA where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND   OCCURANCE = '"+ issue_name+"'";
		//console.log('query is',FetchQuery);
	}
	else{
		if(chatLang=='EN'){
			moreText="Please select the nonconformity you want to see.";
		}else{
			moreText="ご覧になりたい不適合を選択してください。";
		}
		FetchQuery ="SELECT PENDING_ISSUE ,PENDING_ISSUE_DETAIL  FROM  MHPSJPUC33 where PENDING_ISSUE LIKE  ' %"+ equipment +"%' AND  P_NAME = '" + p_name + "' AND OCCURANCE = '"+ issue_name+"'";
	}
	data.fetchQuery =FetchQuery;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType:'json',
		url: url1 + 'fetchactivities',
		success: function(data) {
			if(data.length ==0)
			{
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +'申し訳ございません。この原因による懸案項目は見つかりませんでした。他の発生原因をお尋ねください。'+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			}
			else{
				//var x ='<html><head><style> table, th, td { border: 1px solid black;}</style></head> <body><table>';
				var x ="<select multiple id='usecases"+ dropDownFlag +"'>";
				for(var i=0;i<data.length ;i++){
					x += "<option value='" + data[i].PENDING_ISSUE+ "'>" + data[i].PENDING_ISSUE + " </option>";
				}
				x+="</select>  <button id='usecases_btn' onclick='usecaseSelect()' type='submit'  title='Type and enter'  name='usercase_btn' value='Submit'>Send</button>";
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div> <b>"+ x +".</b>.</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
				passtoken(post,moreText,chatLang);
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +moreText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			}
			var d = $('.popup-messages');
			d.scrollTop(d.prop("scrollHeight"));
		}
	});
}
////usecase3 scenario1 with y3

function fetchpendingissue2(p_name,equipment,issue_name,pending_issue,post,chatLang){
	//console.log('in fetch activity fucntion') ;
	var now = new Date(Date.now());
	var formatted5 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var data ={};
	var FetchQuery = '';
	var issue ='';
	var moreText="";
	var clickText="";
	if(p_name =='ALL')
	{
		if(chatLang=='JP'){
			 moreText="他に知りたいことありますでしょうか";
			 clickText="詳細をご覧になるには各項目をクリックしてください";
		}else{
			moreText="Do you have anything else you would like to know?";
			clickText="Please click each item to see the details";
		}
		FetchQuery ="SELECT  'Proto-C' P_NAME ,PENDING_ISSUE,PENDING_ISSUE_DETAIL, PROCESSING_STATUS,DATE_OF_OCCURANCE,PROCESSING_DEADLINE,PROCESSING_STATUS1,COMPLETION_DATE,CAUSE_OF_OCCURANCE,PENDING_ISSUE_STATUS,ACTUAL_VALUE,COST_RESPONSIBILITY_DEVISION,COST_RANGE,COST_CATEGORY,COST_FOLLOW_UP,PROBABILITY_OF_OCCURNACE ,SCHEDULE_IMPACT ,COMPLAINT_HANDLING FROM  MHPSJPUC311 where PENDING_ISSUE LIKE  '%"+ equipment +"%'  AND OCCURANCE ='"+ issue_name+"' AND PENDING_ISSUE = '"+ pending_issue + "'"
		+ " UNION "  + "SELECT  'Proto-B' P_NAME ,PENDING_ISSUE,PENDING_ISSUE_DETAIL, PROCESSING_STATUS,DATE_OF_OCCURANCE,PROCESSING_DEADLINE,PROCESSING_STATUS1,COMPLETION_DATE,CAUSE_OF_OCCURANCE,PENDING_ISSUE_STATUS,ACTUAL_VALUE,COST_RESPONSIBILITY_DEVISION,COST_RANGE,COST_CATEGORY,COST_FOLLOW_UP,PROBABILITY_OF_OCCURNACE ,SCHEDULE_IMPACT ,COMPLAINT_HANDLING FROM  PROTOB where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND  OCCURANCE ='"+ issue_name+"' AND PENDING_ISSUE = '"+ pending_issue + "'"
		+ " UNION " + "SELECT  'Proto-A' P_NAME ,PENDING_ISSUE,PENDING_ISSUE_DETAIL, PROCESSING_STATUS,DATE_OF_OCCURANCE,PROCESSING_DEADLINE,PROCESSING_STATUS1,COMPLETION_DATE,CAUSE_OF_OCCURANCE,PENDING_ISSUE_STATUS,ACTUAL_VALUE,COST_RESPONSIBILITY_DEVISION,COST_RANGE,COST_CATEGORY,COST_FOLLOW_UP,PROBABILITY_OF_OCCURNACE ,SCHEDULE_IMPACT ,COMPLAINT_HANDLING FROM  PROTOA where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND  OCCURANCE ='"+ issue_name+"' AND PENDING_ISSUE = '"+ pending_issue + "'";
	}
	else{
		if(chatLang=='EN'){
			moreText="Do you have anything else you would like to know?";
			clickText="Please click each item to see the details";

		}else{
		 moreText="他に知りたいことありますでしょうか";
		 clickText="詳細をご覧になるには各項目をクリックしてください";
		}
		FetchQuery ="SELECT  P_NAME ,PENDING_ISSUE,PENDING_ISSUE_DETAIL, PROCESSING_STATUS,DATE_OF_OCCURANCE,PROCESSING_DEADLINE,PROCESSING_STATUS1,COMPLETION_DATE,CAUSE_OF_OCCURANCE,PENDING_ISSUE_STATUS,ACTUAL_VALUE,COST_RESPONSIBILITY_DEVISION,COST_RANGE,COST_CATEGORY,COST_FOLLOW_UP,PROBABILITY_OF_OCCURNACE ,SCHEDULE_IMPACT ,COMPLAINT_HANDLING FROM  MHPSJPUC311 where PENDING_ISSUE LIKE  '%"+ equipment +"%' AND P_NAME ='" + p_name + "' AND OCCURANCE ='"+ issue_name+"' AND PENDING_ISSUE = '"+ pending_issue + "'";
	}
	data.fetchQuery =FetchQuery;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType:'json',
		url: url1 + 'fetchactivities',

		success: function(data) {

			var x ='<html><head><style> table, th, td { border: 1px solid black;}</style></head> <body>';
			for(var i=0;i<data.length;i++)
			{
				x+='<details><summary>'+data[i].P_NAME +'</summary>'
				x+='<details> <summary>プロジェクト名</summary> <p>' +  data[i].P_NAME + '</p></details>'
				+'<details> <summary>懸案項目</summary> <p>' + data[i].PENDING_ISSUE + '</p></details>'
				+'<details> <summary>懸案内容</summary> <p>' +  data[i].PENDING_ISSUE_DETAIL + '</p></details>'
				+'<details> <summary>処理状況</summary> <p>' + data[i].PROCESSING_STATUS + '</p></details>'
				+'<details> <summary>懸案 発生日</summary> <p>' +  data[i].DATE_OF_OCCURANCE + '</p></details>'
				+'<details> <summary>処理期限</summary> <p>' + data[i].PROCESSING_DEADLINE+ '</p></details>'
				+'<details> <summary>処理完了</summary> <p>' +  data[i].PROCESSING_STATUS1 + '</p></details>'
				+'<details> <summary>完了日</summary> <p>' + data[i].COMPLETION_DATE + '</p></details>'
				+'<details> <summary>発生原因</summary> <p>' +  data[i].CAUSE_OF_OCCURANCE + '</p></details>'
				+'<details> <summary>懸案 状況</summary> <p>' + data[i].PENDING_ISSUE_STATUS + '</p></details>'
				+'<details> <summary>実額</summary> <p>' +  data[i].ACTUAL_VALUE + '</p></details>'
				+'<details> <summary>ｺｽﾄ責任課</summary> <p>' + data[i].COST_RESPONSIBILITY_DEVISION + '</p></details>'
				+'<details> <summary>ｺｽﾄﾚﾝｼﾞ</summary> <p>' +  data[i].COST_RANGE + '</p></details>'
				+'<details> <summary>ｶﾃｺﾞﾘ</summary> <p>' + data[i].COST_CATEGORY + '</p></details>'
				+'<details> <summary>ｺｽﾄﾌｫﾛｰ</summary> <p>' +  data[i].COST_FOLLOW_UP + '</p></details>'
				+'<details> <summary>発生</summary> <p>' + data[i].PROBABILITY_OF_OCCURNACE + '</p></details>'
				+'<details> <summary>ｽｹｼﾞｭｰﾙ</summary> <p>' +  data[i].SCHEDULE_IMPACT + '</p></details>'
				+'<details> <summary>ｸﾚｰﾑ対象</summary> <p>' + data[i].COMPLAINT_HANDLING + '</p></details>'
				+'</details>'
			}

			x+='</body></html>';
			$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div> <b>"+ x +".</b>.</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			passtoken(post,clickText,chatLang);//Please click each item to see the details
			$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +clickText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			setTimeout(function(){
				passtoken(post,moreText,chatLang);//Do you have anything else you would like to know?
				$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +moreText+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted5+ "</span></div></div>");
			},9000);
			var d = $('.popup-messages');
			d.scrollTop(d.prop("scrollHeight"));
		}

	});
}

// with y3

function fetchall(){  ////usecase3 scenario2
	var now = new Date(Date.now());
	var formatted1 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var data =[{'phase': '客先要求'} , {'phase': '基本計画不備'} ,{'phase': '合理化、ｺｽﾄ低減提案'},{'phase': 'デビエーション'} , {'phase': '設計不適合(ﾐｽ、ﾙｰﾙ未反映、他)'} ,{'phase': '遅延(出図、引合、発注、納期、他)'},{'phase': '検査・品質・性能不適合 H:製作時不適合'} , {'phase': '設計連絡不備'} ,{'phase': 'ＤＯＲ不備(含ｻﾌﾞｺﾝ、客先、他)'},
		{'phase': '見積不備(含見積落ち) '},{'phase': '不適合水平展開'} , {'phase': '契約不備(含ｻﾌﾞｺﾝ、他) '}];
	var x ="<select multiple id='usecases"+ dropDownFlag +"'>";
	for(var i=0;i<data.length ;i++){
		x += "<option value='" + data[i].phase + "'>" + data[i].phase  + " </option>";
	}
	x+="</select>  <button id='usecases_btn' onclick='usecaseSelect()' type='submit'  title='Type and enter'  name='usercase_btn' value='Submit'>Send</button>";
	$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" + x+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
	$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" + 'どの発生原因による不適合をお探しですか？'+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted1+ "</span></div></div>");
}

///// Discovery function
function Discovery(data,post){
	var z='';
	var now = new Date(Date.now());
	var formatted6 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	$.ajax({
			 type: 'POST',
			 data: JSON.stringify(data),
			 contentType: "application/json",
			 dataType:'json',
			 url: url1+'discovery',
		    success: function(data) {
		    	setTimeout(function(){
					var textForDisplay="";
					for(var i=0;i<data.results.length;i++){
						var first = data.results[i].text.indexOf("\n");
				 		var second = data.results[i].text.indexOf("\n",(first + 1));
				 		textForDisplay=data.results[i].text.substring(second + 1);
						$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +textForDisplay+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted6+ "</span></div></div>");
				}},4000);
				setTimeout(function(){
					passtoken(post,'Do you have anything else you would like to know?',chatLang);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>Do you have anything else you would like to know? </div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted6+ "</span></div></div>");
					},9000);
				var d = $('.popup-messages');
					d.scrollTop(d.prop("scrollHeight"));
			}
	});
}

function Discovery1(data,post){
	var now = new Date(Date.now());
	var formatted6 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	//console.log('in discovery function') ;
	$.ajax({
			 type: 'POST',
			 data: JSON.stringify(data),
			 contentType: "application/json",
			 dataType:'json',
			 url: url1+'discovery1',
		    success: function(data) {
				var z=  data[0].text;
				passtoken(post, data[0].text,chatLang);
				setTimeout(function(){
					passtoken(post, z,chatLang);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +z+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted6+ "</span></div></div>");
					},9000);
			}
	 });
}
function translate(data,post){
	var now = new Date(Date.now());
	var formatted7 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	console.log('in translate function') ;
	$.ajax({
			 type: 'POST',
			 data: JSON.stringify(data),
			 contentType: "application/json",
			 dataType:'json',
			 url: url1+'translate',
				success: function(data) {
					console.log('db call success'+data);
					console.log(data.results.length);
					for(var i=0;i<data.results.length;i++){
					console.log(data.results[i].text);
					var x=data.results[i].text;
					console.log('Ths is x'+x);
					ajaxcall2(x,post);
					}
				}
	});
}
function ajaxcall2(x,post){
	console.log('********************in ajaxcall2');
	var now = new Date(Date.now());
	var formatted6 = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var data ={};
	data.reply=x;
	 	$.ajax({
	 			 type: 'POST',
	 			 data: JSON.stringify(data),
	 			 contentType: "application/json",
	 			 dataType:'json',
	 			 url: url1+'translate1',
	 				success: function(data) {
						console.log("Success")
	 				console.log('translate success'+data.translations[0].translation);
					$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>" +data.translations[0].translation+ "</div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted6+ "</span></div></div>");
					setTimeout(function(){
						passtoken(post,'他に知りたいことありますでしょうか',chatLang);
						$("#timeStamp").append("<div class='direct-chat-msg doted-border'><div class='direct-chat-info clearfix'><span class='direct-chat-name pull-left'><img style='margin-left: -58px;width: 54px;border-radius: 55%;' src='images/Capture.png' alt='User Avatar' class='img-circle' /></span></div><div style='margin-top: -40px' class='direct-chat-text'>他に知りたいことありますでしょうか </div><div id='timeStamp' class='direct-chat-info clearfix'><span id='time' class='direct-chat-timestamp pull-right'>" +formatted6+ "</span></div></div>");
					},4000);
					var d = $('.popup-messages');
					d.scrollTop(d.prop("scrollHeight"));
	 	}
	});
}
