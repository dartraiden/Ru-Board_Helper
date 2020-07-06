// ==UserScript==
// @name          Ru-Board Helper
// @version       2.7 (11Feb10 06:01:07)
// @icon          http://forum.ru-board.com/favicon.ico
// @include       http*://forum.ru-board.com/*
// @require       https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.registerMenuCommand
// @grant         GM_registerMenuCommand
// ==/UserScript==

(function() {

  GM_config.init(
  {
    'id': 'RuBoardHelperConfig',
    'title': 'Ru-Board Helper',
    'fields':
    {
      'UseLocalStorage':
      {
        'label': 'Use Local Storage',
        'type': 'checkbox',
        'default': false
      },
      'UseSeparators':
      {
        'label': 'Use separators',
        'type': 'checkbox',
        'default': true
      }
    }
  });
  
  GM_registerMenuCommand('Options',()=>GM_config.open());

  var IgnName   = 'Ignore';
  var FrndsName = 'Friends';
  var StatName  = 'Nick-';
  var NickSrchName = 'NickSearch';
  var TextSrchName = 'TextSearch';
  var Delim1    = ',';
  var IgnCnt    = -1;
  var SrchInPth = 'topic.cgi';
  var SrchForum = 'forum.cgi';
  var FrmsName  = 'Forums';
  var IgnM      = new Array();
  var UseNickSearch = true; // false;
  var UseTextSearch = true; // false;
  var UseQuote      = true; // false;
  var LastNickFind  = '';
  var UseFriends    = true; // false;
  var FriendsColor  = '#cfffcf';
  var TblText1s = '<table align="center" bgcolor="#999999" border="0" cellpadding="3" cellspacing="1" width="95%">';
  var TblText1e = '</table>';
  var AddForumS = 'AddForum';
  var IsAddForums = true; // false;
  var UseHideLink = true;
  var UseIgnore   = true;
  var isUseAddPages = true; // false
  var isUseStatus   = true; // false
  var isUseVeche    = true; // false;
  var FrmLoadListS  = '';
  var FrmLoaded     = '';
  var CookDate1     = new Date("1 May 2100 11:00");
  var UseLocalStorage = GM_config.get('UseLocalStorage');
  
  function HideText(NickName, TrTag) {
    if (NickName == '' || NickName == ' ') return false;
    DivTag = TrTag.getElementsByTagName('div');
    if (!((DivTag.length > 0) && (DivTag[0].id.indexOf('Ignor') == 0))) {
      if (TrTag.name == undefined) {
        IgnCnt       = IgnCnt +1;
        IgnM[IgnCnt] = TrTag.innerHTML;
        TrTag.name   = IgnCnt;
      } else {
        IgnCnt       = TrTag.name;
      }
      Ind1 = IgnCnt;
      TrTag.innerHTML = ''
       +'<td>'
       +'<div ID=Ignor' +Ind1 
       +' Align=left><font class=tit>&nbsp;\u0424\u043e\u0440\u0443\u043c\u0438\u0441\u0442 <b>' +NickName +'</b>'
        +'<font style="FONT-SIZE:10pt;COLOR:#333333;" class="StatusBlock2" ' 
        +'title="' +NickName +'" ' +'></font>'       
       +' \u0438\u0433\u043d\u043e\u0440\u0438\u0440\u0443\u0435\u0442\u0441\u044f\u002e '
       +'<a Name=' +Ind1 +' ID=AIgnor' +Ind1 
       +' href=javascript:UnIgn("Ignor' +Ind1 
       +'")><u>\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c\u0020\u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435</u></a></font>'
       +'</div>'
       +'</td>'
       ;
      document.getElementById('AIgnor' +Ind1).addEventListener("click", 
        function() {UnIgn(this.name)}, false);
      var TbTag1 = TrTag.parentNode.parentNode;
      if (TbTag1 != null) {TbTag1.cellPadding = "0"}
    }
  }

  function main(IgnS, isAddLinks, Reverse, FriendsList, SearchText) {
    var isSearchText = ((SearchText != undefined) && (SearchText != ''));
    if (isSearchText) {Wrlds1 = splitSrch(SearchText);}
    if (IgnS == undefined) {IgnS = ''}
    var Ign    = IgnS.split(Delim1);
    var TrT    = document.getElementsByTagName('tr');
    for (var i = 0; i < TrT.length ; i++) { 
      var Btag = TrT[i].getElementsByTagName('b');
      if (Btag.length == 0) continue;
      if (isAddLinks) {
        var TdTag    = TrT[i].getElementsByTagName('td');
        if (TdTag.length >= 3) {
          if (TdTag[2].className=="tpc") {
            var s2 = '';
            if (UseHideLink) {
              s2 = s2 
               +'<a class="tpc" title="Hide this block' +'"'
               +' name="' +Btag[0].innerHTML +'"'
               +' ID=AHideLink' +i
               +' href=javascript:HidePost1("' +Btag[0].innerHTML +'")'
               +'>[-]</a> '
             ;
            }
            if (UseIgnore) {
              s2 = s2
               +'<a class="tpc" title="\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c\u0020\u0438\u043b\u0438\u0020\u0443\u0434\u0430\u043b\u0438\u0442\u044c ' +"'" +Btag[0].innerHTML
               +"'" +' \u0438\u0437\u0020\u0438\u0433\u043d\u043e\u0440\u0430" name="' +Btag[0].innerHTML +'"'
               +' ID=IgnorLink' +i
               +' href=javascript:AddDelIgn("IgnorLink' +i +'")>\u0418\u0433\u043d\u043e\u0440'
               +'</a> | ';
            }
            if (UseFriends) {
              s2 = s2 
               +'<a class="tpc" title="\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c\u0020\u0438\u043b\u0438\u0020\u0443\u0434\u0430\u043b\u0438\u0442\u044c ' +"'" +Btag[0].innerHTML
               +"'" +' \u0438\u0437\u0020\u0441\u043f\u0438\u0441\u043a\u0430\u0020\u0434\u0440\u0443\u0437\u0435\u0439" name="' +Btag[0].innerHTML +'"'
               +' ID=FriendsLink' +i
               +' href=javascript:AddDelFrnd("FriendsLink' +i +'")>\u0414\u0440\u0443\u0433'
               +'</a> | ';
            }
            if (UseNickSearch) {
              s2 = s2 
               +'<a class="tpc" title="\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c\u0020\u0438\u043b\u0438\u0020\u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c\u0020\u0432\u0441\u0435\u0020\u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f\u0020\u043e\u0442 '  
               +"'" +Btag[0].innerHTML
               +"'" +'" name="' +Btag[0].innerHTML +'"'
               +' ID=ANickSrch' +i
               +' href=javascript:NickSrch("' +Btag[0].innerHTML +'")'
               +'>\u041f\u043e\u0438\u0441\u043a</a>' 
               +' | ';
            }
            if (isUseStatus) {
              s2 = s2 
               +'<a class="tpc" title="\u041f\u0440\u0438\u0441\u0432\u043e\u0438\u0442\u044c\u0020\u0441\u0442\u0430\u0442\u0443\u0441\u0020\u0444\u043e\u0440\u0443\u043c\u0438\u0441\u0442\u0443 '  
               +"'" +Btag[0].innerHTML
               +"'" +'" name="' +Btag[0].innerHTML +'"'
               +' ID=ACustStat' +i
               +' href=javascript:EditCustStat("' +Btag[0].innerHTML +'")'
               +'>\u0421\u0442\u0430\u0442\u0443\u0441</a>' 
               +' | ';
            }
            if (UseQuote) {
             s2 = s2 
             +'<a class="tpc" title="\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c\u0020\u0446\u0438\u0442\u0430\u0442\u0443\u0020\u0432\u0020\u043e\u0442\u0432\u0435\u0442\u0020\u0443\u043a\u0430\u0437\u0430\u0432\u0020\u0441\u0441\u044b\u043b\u043a\u0443\u0020\u043d\u0430\u0020\u044d\u0442\u043e\u0442\u0020\u043f\u043e\u0441\u0442\u0438\u043d\u0433\u0020\u0438\u0020\u0435\u0433\u043e\u0020\u0430\u0432\u0442\u043e\u0440\u0430\u002e"'
             +' ID=AInsSel' +i
             +' href=javascript:InsertSel1()>\u0426\u0438\u0442\u0430\u0442\u0430'
             +'</a> | ';
            }
            TdTag[2].innerHTML = ''
             +s2
             +TdTag[2].innerHTML;
            if (UseIgnore) {
              document.getElementById('IgnorLink' +i).addEventListener("click", 
               function() {AddDelIgn(this.id)}, false)}
            if (UseFriends) {
              document.getElementById('FriendsLink' +i).addEventListener("click", 
               function() {AddDelFrnd(this.id)}, false)}
            if (UseNickSearch) {
              document.getElementById('ANickSrch' +i).addEventListener("click", 
               function() {NickSrch(this.name)}, false)}
            if (UseHideLink) {
              document.getElementById('AHideLink' +i).addEventListener("click", 
                function() {HidePost1(this.id)}, false)}
            if (isUseStatus) {
              document.getElementById('ACustStat' +i).addEventListener("click", 
                function() {EditCustStat(this.name)}, false)}
            if (isUseStatus) {
              FntTgs1 = TdTag[1].getElementsByTagName('font');
              if (FntTgs1.length==0) {
                FTg1 = document.createElement('font');
                FTg1.className = 'StatusBlock'; 
                FTg1.title     = Btag[0].innerHTML 
                FTg1.innerHTML = '';
                TdTag[1].appendChild(FTg1);
              }
            }
            if (UseQuote) {
              document.getElementById('AInsSel' +i).addEventListener("click", 
                function() {InsertSel1()}, false);
            }
          }
        }
      }

      if (isSearchText) {
        var HrT = TrT[i].getElementsByTagName('hr');
        if (HrT.length > 1) {
          var Find1 = false;
          var k1    = 0;
          var SpnT = TrT[i].getElementsByTagName('span');
          if (SpnT.length > 0) {
            var s     = SpnT[0].textContent;
            for (var j = Wrlds1.length -1; j >= 0; j--) {
              if (s.toLowerCase().indexOf(Wrlds1[j].toLowerCase()) > 0) {
                Find1 = true;
                break;
              }
            }
            if (!Find1) 
            {                                                
              HideText(Btag[0].innerHTML, TrT[i])
            }  
          } 
        }
      } else 
      {
        if (Reverse) {
          var HrT = TrT[i].getElementsByTagName('hr');
          if (HrT.length <= 1) continue; 
          var Find1 = false;
          var k1    = 0;
          for (var j = Ign.length -1; j >= 0; j--) {
            if (Btag[0].innerHTML == Ign[j]) {
              Find1 = true;
              break;
            }
          }
          if (!Find1) {HideText(Btag[0].innerHTML, TrT[i])} 
        } else {
          for (var j = Ign.length -1; j >= 0; j--) {
            if (Btag[0].innerHTML == Ign[j]) {
              HideText(Ign[j], TrT[i]); 
            break;
            }
          }
        }
      }
    }

    if (isSearchText) {
      for (var i = IgnCnt; i >= 0; i--){
        var DivTag1 = document.getElementById('Ignor' +i);
        if (DivTag1 == null) continue;
        var BTag2 = DivTag1.getElementsByTagName('b');
        if (BTag2.length <= 0) continue;
        var DTag2    = document.createElement("div");
        DTag2.innerHTML = IgnM[i];
        var SpnT2 = DTag2.getElementsByTagName('span');
        if (SpnT2.length > 0) {
          var s = SpnT2[0].textContent;   
          for (var j = Wrlds1.length -1; j >= 0; j--) {
            if (s.toLowerCase().indexOf(Wrlds1[j].toLowerCase()) >= 0) {
              UnIgn(i);
              break;
            }
          }  
        }
      }
    } else 
    {
      if (Reverse) {
        for (var i = IgnCnt; i >= 0; i--){
          var DivTag1 = document.getElementById('Ignor' +i);
          if (DivTag1 == null) continue;
          var BTag2 = DivTag1.getElementsByTagName('b');
          if (BTag2.length <= 0) continue;
          for (var j = 0; j < Ign.length; j++) {  
            if (BTag2[0].innerHTML == Ign[j]) {
              UnIgn(i);
              break;
            }
          }
        }
      } else {
        for (var i = IgnCnt; i >= 0; i--){
          var DivTag1 = document.getElementById('Ignor' +i);
          if (DivTag1 == null) continue;
          var BTag2 = DivTag1.getElementsByTagName('b');
          if (BTag2.length <= 0) continue;
          var Find1 = 0;
          for (var j = 0; j < Ign.length; j++) {  
            if (BTag2[0].innerHTML == Ign[j]) {
              Find1 = 1;
              break;
            }
          }
          if (Find1==0) {UnIgn(i)}
        }
      }
    }
    IgnLinkColor();
    if (UseFriends) {SetFriendsColor(getCookie(FrndsName));}
    SetStauses();
  }

  if (document.location.pathname.indexOf(SrchInPth) > -1) {
    main(getCookie(IgnName), true, false);}

  function SetStauses() {
    var FntTg1    = document.getElementsByTagName('font');
    for (var i = 0; i < FntTg1.length ; i++) { 
      if (FntTg1[i].className.indexOf('StatusBlock')!=0) continue;
      var sCook1 = getCookie(StatName +FntTg1[i].title);
      if (sCook1 == undefined) {sCook1=''} else {
        if (sCook1=='') {
          deleteCookie(StatName +FntTg1[i].title);
          sCook1='';
        } else {
          if (FntTg1[i].className.indexOf('StatusBlock2')==0) {
            sCook1 = ' ( ' +sCook1 + ' ) '
          } else {
            sCook1='<br>'+sCook1
          }
        }
      }
      FntTg1[i].innerHTML = sCook1;
    }
  }

  function SetFriendsColor(FriendsList) {
    if ((FriendsList != undefined) && (UseFriends)) {
      var TrT  = document.getElementsByTagName('tr');
      var Frnd = FriendsList.split(Delim1);
      for (var i = 0; i < TrT.length ; i++) { 
        var Btag = TrT[i].getElementsByTagName('b');
        if (Btag.length == 0) continue;
        var TdTag    = TrT[i].getElementsByTagName('td');
        if (TdTag.length >= 3) {
          if (TdTag[2].className=="tpc") {
            if ((FriendsList != undefined) && (UseFriends)) {
               var Find2 = false;
               for (var j = 0; j < Frnd.length ; j++) { 
                 if (Btag[0].innerHTML == Frnd[j]) {
                   Find2 = true;
                   break;
                 }
               }
               if (Find2) {
                 TdTag[1].bgColor = FriendsColor;
               } else {
                 TdTag[1].bgColor = TdTag[2].bgColor;
               }
            }
          }
        }
      }
    }
  }

  function IgnLinkColor(){
    var TrT  = document.getElementsByTagName('tr');
    var Ign2 = getCookie(IgnName);
    if (Ign2 == undefined) {Ign2 = ''}
    for (var i = 0; i < TrT.length ; i++) { 
      var ATag = document.getElementById('IgnorLink' +i);
      if (ATag==null) continue;
      if (IsTextInStr(ATag.name, Ign2, Delim1)) {
        ATag.innerHTML = '<font Color=#FF0000>\u0418\u0433\u043d\u043e\u0440</font>'
      } else {
        ATag.innerHTML = '\u0418\u0433\u043d\u043e\u0440'
      }
    }
  }

  function UnIgn(IgnCnt){
    var PrTag1 = document.getElementById('Ignor' +IgnCnt).parentNode.parentNode;
    PrTag1.innerHTML = IgnM[IgnCnt];
    IgnLinkColor();
    if (UseFriends) {SetFriendsColor(getCookie(FrndsName));}
    var Tgs1 = PrTag1.getElementsByTagName('a');
    if (UseIgnore) {
      for (var i = 0; i < Tgs1.length ; i++) { 
        if (Tgs1[i].id.indexOf('IgnorLink') == 0) {
          Tgs1[i].addEventListener("click", function() {AddDelIgn(this.id)}, false);
          break;
        }
      }
    }
    if (UseFriends) { 
      for (var i = 0; i < Tgs1.length ; i++) { 
        if (Tgs1[i].id.indexOf('FriendsLink') == 0) {
          Tgs1[i].addEventListener("click", function() {AddDelFrnd(this.id)}, false);
          break;
        }
      }
    }
    if (UseNickSearch) {
      for (var i = 0; i < Tgs1.length ; i++) { 
        if (Tgs1[i].id.indexOf('ANickSrch') == 0) {
          Tgs1[i].addEventListener("click", function() {NickSrch(this.name)}, false);
          break;
        }
      }
    }
    if (UseHideLink) {
      for (var i = 0; i < Tgs1.length ; i++) { 
        if (Tgs1[i].id.indexOf('AHideLink') == 0) {
          Tgs1[i].addEventListener("click", function() {HidePost1(this.id)}, false);
          break;
        }
      }
    }
    if (isUseStatus) {
      for (var i = 0; i < Tgs1.length ; i++) { 
        if (Tgs1[i].id.indexOf('ACustStat') == 0) {
          Tgs1[i].addEventListener("click", function() {EditCustStat(this.name)}, false);
          break;
        }
      }
    }
    if (UseQuote) {
      for (var i = 0; i < Tgs1.length ; i++) { 
        if (Tgs1[i].id.indexOf('AInsSel') == 0) {
          Tgs1[i].addEventListener("click", function() {InsertSel1()}, false);
          break;
        }
      }
    }
    var TbTag1 = PrTag1.parentNode.parentNode;
    if (TbTag1 != null) {TbTag1.cellPadding = "5"}
    SetStauses();
  }

  function EditIgn() {
    var s = getCookie(IgnName);
    if (s == undefined) {s = ''}
    if (s==null) {s='';}
    s = prompt('\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0020\u0438\u0433\u043d\u043e\u0440\u0430\u002e\u0020\u0417\u0430\u043f\u0438\u0448\u0438\u0442\u0435\u0020\u0432\u0440\u0430\u0433\u043e\u0432\u0020\u0447\u0435\u0440\u0435\u0437\u0020\u0437\u0430\u043f\u044f\u0442\u0443\u044e\u002e\u0020\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440\u003a\u0020\u0046\u0072\u0065\u0061\u006b\u002c\u0020\u0054\u0072\u006f\u006c\u006c', s.replace(/^,/g,""));
    if(s!=null){
      setCookie(IgnName,PrsUsersList(s),{expires:CookDate1});
      main(getCookie(IgnName), false);
    }
  };
  function EditFrnds() {
    var s = getCookie(FrndsName);
    if (s == undefined) {s = ''}
    if (s==null) {s='';}
    s = prompt('\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0020\u0434\u0440\u0443\u0437\u0435\u0439\u002e\u0020\u0417\u0430\u043f\u0438\u0448\u0438\u0442\u0435\u0020\u0434\u0440\u0443\u0437\u0435\u0439\u0020\u0447\u0435\u0440\u0435\u0437\u0020\u0437\u0430\u043f\u044f\u0442\u0443\u044e\u002e\u0020\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440\u003a\u0020\u004d\u0065\u002c\u0020\u004d\u0069\u006e\u0065\u002c\u0020\u004d\u0079\u0073\u0065\u006c\u0066', s.replace(/^,/g,""));
    if(s!=null){
      setCookie(FrndsName,PrsUsersList(s),{expires:CookDate1});
      SetFriendsColor(getCookie(FrndsName));
    }
  };
  function EditCustStat(aName) {
    var s = getCookie(StatName +aName);
    if (s == undefined) {s = ''}
    if (s==null) {s='';}
    s = prompt('\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0020\u0441\u0442\u0430\u0442\u0443\u0441\u0430\u002e\u0020\u0417\u0430\u043f\u0438\u0448\u0438\u0442\u0435\u0020\u0441\u0432\u043e\u0451\u0020\u043c\u043d\u0435\u043d\u0438\u0435\u0020\u043e ' 
     +"'"  +aName +"'" +' \u0437\u0434\u0435\u0441\u044c\u002e', s);
    if(s!=null){
      setCookie(StatName +aName,s,{expires:CookDate1});
      SetStauses();
    }
  };

  if (document.location.pathname.indexOf(SrchInPth) > -1) {
    var Td2T    = document.getElementsByTagName('td');
    for (var i = 0; i < Td2T.length ; i++) { 
      if ((Td2T[i].className=="dats") && (Td2T[i].align=="right")){ 
        var s1 = '';
        if (UseTextSearch) {
          var s2 = getCookie(TextSrchName);
          if (s2==undefined) {s2=''} else {s2 = s2.replace(/'/g,'')}
          s1 = s1 +''
           +'<div Title="\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440\u003a ' +"'" +'Metallica, &quot;Iron Maiden&quot;' 
           +"'" +'. \u041f\u0443\u0441\u0442\u0430\u044f\u0020\u0441\u0442\u0440\u043e\u043a\u0430\u0020\u002d\u0020\u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c\u0020\u0432\u0441\u0435\u0020\u043f\u043e\u0441\u0442\u044b">\u041f\u043e\u0438\u0441\u043a\u0020\u0442\u0435\u043a\u0441\u0442\u0430 '
           +'<input Type=text ID=TextSrEdit'
           +" value='" +s2 +"'"
           +' onkeydown="javascript:if(event.keyCode==13)'
           +'document.getElementById('  +"'TextSrBtn'" +').click();"'
           +'>'
           +'<button Type=button Name=TextSrBtn ID=TextSrBtn OnClick=javascript:TextSrch()>&gt;</button></div>'
           ;
        }
        if (UseNickSearch) {
          var s2 = getCookie(NickSrchName);
          if (s2==undefined) {s2=''} else {s2 = s2.replace(/"/g,'')}
          s1 = s1 +''
           +'<div Title="\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440\u003a ' +"'" +'MyNick, Friend, Etc' 
           +"'" +'. \u041f\u0443\u0441\u0442\u0430\u044f\u0020\u0441\u0442\u0440\u043e\u043a\u0430\u0020\u002d\u0020\u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c\u0020\u043f\u043e\u0438\u0441\u043a\u002e">\u041f\u043e\u0438\u0441\u043a\u0020\u043d\u0438\u043a\u0430 '
           +'<input Type=text ID=NickEdit '
           +' value="' +s2 +'"'
           +' onkeydown="javascript:if(event.keyCode==13)'
           +'document.getElementById('  +"'NickBtn'" +').click();"'
           +'>'
           +'<button Type=button Name=NickBtn ID=NickBtn OnClick=javascript:NickSrch()>&gt;</button></div>'
           ;
        }
        if (UseIgnore) {
          s1 = s1 +''
           +'&nbsp;<a ID=IgnEditor title="\u041e\u0442\u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0020\u0441\u043f\u0438\u0441\u043e\u043a\u0020\u0438\u0433\u043d\u043e\u0440\u0438\u0440\u0443\u0435\u043c\u044b\u0445" '
           +'href=javascript:EditIgn()>\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0020\u0438\u0433\u043d\u043e\u0440\u0430</a> &#149; '
        }
        if (UseFriends) {
          s1 = s1 +''
           +'<a ID=IgnFriends title="\u041e\u0442\u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0020\u0441\u043f\u0438\u0441\u043e\u043a\u0020\u0434\u0440\u0443\u0437\u0435\u0439" '
           +'href=javascript:EditFrnds()>\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0020\u0434\u0440\u0443\u0437\u0435\u0439</a> &#149; '
        }
        if (isUseVeche) {
          s1 = s1 +''
           +'<a ID=AVoteLink title="\u041f\u043e\u0441\u0447\u0438\u0442\u0430\u0442\u044c\u0020\u0432\u0020\u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0451\u043d\u043d\u044b\u0445\u0020\u043f\u043e\u0441\u0442\u0438\u043d\u0433\u0430\u0445\u0020\u043a\u0442\u043e\u0020\u043a\u0430\u043a\u0020\u043f\u0440\u043e\u0433\u043e\u043b\u043e\u0441\u043e\u0432\u0430\u043b" '
           +'href=javascript:CalcVeche("")>\u0413\u043e\u043b\u043e\u0441\u043e\u0432\u0430\u043d\u0438\u0435</a> &#149; '
        }
        Td2T[i].innerHTML = s1 +Td2T[i].innerHTML;
        if (UseIgnore) {
          document.getElementById('IgnEditor').addEventListener("click", 
            function() {EditIgn()}, false);
        }
        if (UseNickSearch) {
          document.getElementById('NickBtn').addEventListener("click", 
            function() {NickSrch()}, false);
        }
        if (UseTextSearch) {
          document.getElementById('TextSrBtn').addEventListener("click", 
            function() {TextSrch()}, false);
        }
        if (UseFriends) {
          document.getElementById('IgnFriends').addEventListener("click", 
            function() {EditFrnds()}, false);
        }
        if (isUseVeche) {
          document.getElementById('AVoteLink').addEventListener("click", 
            function() {CalcVeche("")}, false);
        }
        break;
      }
    }
  }

  function HidePost1(anID) {
    var aHideLink = document.getElementById(anID);
    if (aHideLink != null) {
      var aTr = aHideLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
      if (aTr != null) {HideText(aHideLink.name, aTr)}
    }
   SetStauses();
  }

  function NickSrch(aName) {
    if (aName == undefined) {
      var s = PrsUsersList(document.getElementById('NickEdit').value);
      setCookie(NickSrchName,s,{expires:CookDate1});     
    } else {
      if (IsTextInStr(aName, LastNickFind, Delim1)) {
        var s = RemoveTextFromStr(aName, LastNickFind, Delim1);
      } else {
        var s = PrsUsersList(LastNickFind +Delim1 +aName);
      }
    }
    LastNickFind = s;
    if (s==null) {
      main(getCookie(IgnName), false)
    } else {
      if (s=='') {  
        main(getCookie(IgnName), false);
      } else {
        main(s, false, true);
      }
    }
  };

  function TextSrch() {
    var s = document.getElementById('TextSrEdit').value;
    setCookie(TextSrchName,s,{expires:CookDate1});
    if ((s==null) 
       ) {
      main(getCookie(IgnName), false)
    } else {
      main('', false, false, '', s);
    }
  };

  function IsTextInStr(Name, List, Delimetr) {
    if (List==undefined) {return false} else {
      var s = List.split(Delimetr);
      var Find1 = false;
      for (var j = s.length -1; j >= 0; j--) {
        if (s[j] == Name) {
          Find1 = true;
          s.splice(j, 1);
          break;
        }
      }
      return Find1;
    }
  }

  function RemoveTextFromStr(Name, List, Delimetr)
  {
    var sl1 = List.split(Delimetr);
    var Find1 = false;
    for (var j = sl1.length -1; j >= 0; j--) {
      if (sl1[j] == Name) {
        sl1.splice(j, 1);
        Find1 = true;
      }
    }
    return Find1 ? sl1.join(Delimetr) : List;
  }

  function AddDelIgn(IgnTagName){
    var aTag   = document.getElementById(IgnTagName);
    var sName1 = aTag.name;
    var s1 = getCookie(IgnName);
    if (s1 == undefined) {s1 = ''}
    if (IsTextInStr(sName1, s1, Delim1)) {
      if (confirm('(-) \u0412\u044b\u043f\u0443\u0441\u0442\u0438\u0442\u044c "' +sName1 + '" \u0438\u0437\u0020\u0438\u0433\u043d\u043e\u0440\u0430\u003f')) {
        var s2 = RemoveTextFromStr(sName1, s1, Delim1);
        if (s2 != s1) {
          setCookie(IgnName, s2,{expires:CookDate1});
          main(s2, false);
        }
      }
    } else {
      if (confirm('(+) \u041f\u043e\u043c\u0435\u0441\u0442\u0438\u0442\u044c "' +sName1 + '" \u0432\u0020\u0438\u0433\u043d\u043e\u0440\u003f')) {
        s1 = s1 +Delim1 +sName1;
        setCookie(IgnName, s1,{expires:CookDate1});
        main(s1, false);
      }
    }
  }

  function AddDelFrnd(FrndTagName){
    var aTag   = document.getElementById(FrndTagName);
    var sName1 = aTag.name;
    var s1     = getCookie(FrndsName);
    if (s1 == undefined) {s1 = ''}
    if (IsTextInStr(sName1, s1, Delim1)) {
      if (confirm('(-) \u0423\u0434\u0430\u043b\u0438\u0442\u044c "' +sName1 + '" \u0438\u0437\u0020\u0434\u0440\u0443\u0437\u0435\u0439\u003f')) {
        var s2 = RemoveTextFromStr(sName1, s1, Delim1);
        if (s2 != s1) {
          setCookie(FrndsName, s2,{expires:CookDate1});
          if (UseFriends) {SetFriendsColor(getCookie(FrndsName));}
        }
      }
    } else {
      if (confirm('(+) \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c "' +sName1 + '" \u0432\u0020\u0434\u0440\u0443\u0437\u044c\u044f\u003f')) {
        s1 = s1 +Delim1 +sName1;
        setCookie(FrndsName, s1,{expires:CookDate1});
        if (UseFriends) {SetFriendsColor(getCookie(FrndsName));}
      }
    }
  }

  if ((isUseAddPages) && (document.location.pathname.indexOf(SrchInPth) > -1)) {
    function AddPageLinks1(aTag) {
      if ((aTag.className == 'small') 
         && (aTag.colSpan == 2)
         && (aTag.align == 'left')
        ) {
        if (aTag.getElementsByTagName('div').length >0) return false;
        if (aTag.getElementsByTagName('table').length >0) return false;
        if (aTag.getElementsByTagName('form').length >0) return false;
        if (aTag.getElementsByTagName('input').length >0) return false;
        var s1 = document.location.href;
        var UseSeparators = GM_config.get('UseSeparators');
        if (UseSeparators == true) {
         var separator = ' | ';
        } else {
         var separator = '';
        }
        s = ''
         +separator
         +' <a title="\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c\u0020\u0432\u0441\u0435\u0020\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b" href=' 
         +SetUrlTxt(s1, 'all').replace(/glp&/, '') +'>\u0412\u0441\u0435</a> ' 
         +separator
         +' <a title="\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c\u0020\u0432\u0441\u0435\u0020\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b\u0020\u043e\u0442\u0020\u0442\u0435\u043a\u0443\u0449\u0435\u0439\u0020\u0438\u0020\u0434\u043e\u0020\u043a\u043e\u043d\u0446\u0430" href=' 
         +SetUrlTxt(s1, 'limit=1000').replace(/all&/,'').replace(/glp&/,'') 
         +'>\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435</a> '
         +separator
         +' <a title="\u0421\u0441\u044b\u043b\u043a\u0430\u0020\u0432\u0435\u0434\u0451\u0442\u0020\u0412\u0421\u0415\u0413\u0414\u0410\u0020\u043d\u0430\u0020\u043f\u043e\u0441\u043b\u0435\u0434\u043d\u044e\u044e\u0020\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443\u0020\u0442\u0435\u043c\u044b\u002e\u0020\u0423\u0434\u043e\u0431\u043d\u0430\u0020\u0434\u043b\u044f\u0020\u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u044f\u0020\u0432\u0020\u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435\u002e" href=' 
         +SetUrlTxt(s1, 'glp').replace(/all&/,'') +'>\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u044f\u044f</a> '
        ;
        aTag.innerHTML = aTag.innerHTML +s;
        return true;
      } else {return false}
    }

    var TdTg1 = document.getElementsByTagName('td');
    for (var i = 0; i<TdTg1.length; i++) {
      if (AddPageLinks1(TdTg1[i])) break}
    for (var i = TdTg1.length -1; i>=0; i--) {
      if (AddPageLinks1(TdTg1[i])) break}

  }

  function getCookie(name) {
    if ((UseLocalStorage) && (window.localStorage)) {
      var s1 = window.localStorage.getItem(name) || '';
      if (s1 != '') return s1;
    }
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined 
  }
  function setCookie(name, value, props) {
    if ((UseLocalStorage) && (window.localStorage)) {
      window.localStorage.setItem(name, value);
    } else 
    {
      props = props || {}
      var exp = props.expires
      if (typeof exp == "number" && exp) {
          var d = new Date()
          d.setTime(d.getTime() + exp*1000)
          exp = props.expires = d
      }
      if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }
   
      value = encodeURIComponent(value)
      var updatedCookie = name + "=" + value
      for(var propName in props){
          updatedCookie += "; " + propName
          var propValue = props[propName]
          if(propValue !== true){ updatedCookie += "=" + propValue }
      }
      document.cookie = updatedCookie
    }
  }
  function deleteCookie(name) {
    if ((UseLocalStorage) && (window.localStorage)) {
      window.localStorage.removeItem(name);
      setCookie(name, null, { expires: -1 })
    } else
    setCookie(name, null, { expires: -1 })
  }

  String.prototype.get = function(p){
    return (match = this.match(new RegExp("[?|&]?" + p + "=([^&]*)"))) ? match[1] : false;}

  function insertAfter(parent, node, referenceNode) {
    parent.insertBefore(node, referenceNode.nextSibling); }

  function splitSrch(s){
    a = [];
    s.replace(/"([^"]*)"|[\S]+/g, function(w, p) {a.push(p||w)});
    return a;
  }

  function PrsUsersList(aUserNicks) {
    var s = aUserNicks.replace(/,+/g,",");
    s = s.replace(/\s+/g," ");
    s = s.replace(/[, ]$/g,"").replace(/^,/g,"");
    s = s.replace(/,\s/g,",");
    return s;
  }

  function SetUrlTxt(u, s) {
    return ((u.indexOf('&' +s) < 0) && (u.indexOf('?' +s) < 0)) ?
      u.replace(/[?](.*)/g, function(a, b) {return '?' +s +'&'+b}) : u;}


  var isPAdding = false; 
  var CurFLoad = -1;
  var CurForumNbm = window.location.search.get('forum');
  if (IsAddForums) {
    if ( (document.location.pathname.indexOf(SrchForum) > -1) 
    ) {
      var TrTag3 = document.getElementsByClassName('tit')
      DTag1    = document.createElement("div");
      DTag1.id = 'Div100';
      var LoadList2 = getCookie(FrmsName +CurForumNbm);
      if (LoadList2 == undefined) {LoadList2 = ''}
      var FrmLoadList  = PrsUsersList(LoadList2).split(Delim1);
      DTag1.innerHTML = ''
        +'<center>'
        +'<div id="vote_status1"><br></div>'
        +'\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435\u0020\u0444\u043e\u0440\u0443\u043c\u044b: <font id=FForums>' +LoadList2 +'</font>'
        +' &nbsp; <input id=btnv1 value="Edit"'
        +' onclick="EdFrmsLst()" type="button" />'
        +'&nbsp; <font id="vote_status2">\u041c\u0435\u0441\u0442\u043e\u0020\u043e\u0442\u0432\u0435\u0442\u0430\u0020\u0441\u0435\u0440\u0432\u0435\u0440\u0430</font>'
        +'</center>';
      insertAfter(TrTag3[TrTag3.length -1].parentNode.parentNode.parentNode.parentNode, DTag1, TrTag3[TrTag3.length -1].parentNode.parentNode.parentNode);
      document.getElementById('btnv1').addEventListener("click", 
       function() {EdFrmsLst()}, false);
    }
  }

  function EdFrmsLst() {
    var s = getCookie(FrmsName +CurForumNbm);
    if (s == undefined) {s = ''}
    if (s==null) {s='';}
    s = prompt('\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440\u0020\u0434\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445\u0020\u0437\u0430\u0433\u0440\u0443\u0437\u043e\u043a\u002e\u0020\u0417\u0430\u043f\u0438\u0448\u0438\u0442\u0435\u0020\u043d\u043e\u043c\u0435\u0440\u0430\u0020\u0444\u043e\u0440\u0443\u043c\u043e\u0432\u002e\u0020\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440\u003a\u0020\u0031\u0033\u002c\u0020\u0037\u0032\u002c\u0020\u0037\u0035', s.replace(/^,/g,""));
    if(s!=null){
      FrmLoadListS = PrsUsersList(s);
      setCookie(FrmsName +CurForumNbm, FrmLoadListS,{expires:CookDate1});
      var FrmLoadList  = PrsUsersList(FrmLoadListS).split(Delim1);
      document.getElementById('FForums').innerHTML = s;
      var FrmLoadedList = PrsUsersList(FrmLoaded).split(Delim1);
      for (var j = 0; j < FrmLoadedList.length; j++) {
        if (FrmLoadedList[j] == '') continue;
        var Find1 = false;
        for (var i = 0; i < FrmLoadList.length; i++) {
          if (FrmLoadedList[j] == FrmLoadList[i]) {
            Find1 = true;
            break;
          }
        }
        var FrTag1 = document.getElementById(AddForumS +FrmLoadedList[j]);
        if (FrTag1 == null) continue;
        if (Find1) {
          FrTag1.style.display = "inline";
        } else {
          FrTag1.style.display = "none";
        }
      }
      AddPage1();
    }
  };

  function AddPage1() {
    if (CurFLoad != -1) {return false}
    var statusElem1 = document.getElementById('vote_status1');
    var statusElem2 = document.getElementById('vote_status2');
    if ((statusElem1 == null) || (statusElem2 == null)) return false;
    Find1 = 0;
    s = getCookie(FrmsName +CurForumNbm);
    if (s == undefined) {s = ''}
    var FrmLoadList  = PrsUsersList(s).split(Delim1);
    for (var j = 0; j < FrmLoadList.length; j++) {
      if (FrmLoadList[j] == '') continue;
      var tmp3 = document.getElementById(AddForumS +FrmLoadList[j]);
      if (tmp3 == null) {
        CurFLoad = FrmLoadList[j];
        Find1 = 1;
        break;
      }      
    }

    if (Find1 == 1) {
      var req = getXmlHttp()  
      req.onreadystatechange = function() {  
        if (req.readyState == 4) { 
          statusElem2.innerHTML = req.statusText
            +' \u0424\u043e\u0440\u0443\u043c\u003a' +CurFLoad;
          if(req.status == 200) { 
            if (document.getElementById(AddForumS +CurFLoad) != null) {
              CurFLoad = -1;
              return false;
            }
            var temp = document.createElement('div');
            temp.innerHTML = req.responseText;
            var TdTags1 = temp.getElementsByClassName("tit");
            var NodeNew1 = document.createElement('div');
            NodeNew1.id = AddForumS +CurFLoad;
            FrmLoaded = FrmLoaded +',' +CurFLoad;
            if (TdTags1.length >= 2) {
              var TblTag1 = TdTags1[0].parentNode.parentNode.parentNode;
              var TblTag2 = TdTags1[1].parentNode.parentNode.parentNode;
              var TblTag3 = TdTags1[TdTags1.length-1].parentNode.parentNode.parentNode;
              s1 = '' +'<br>'
               +TblText1s +TblTag1.innerHTML +TblText1e
               +TblText1s +TblTag2.innerHTML +TblText1e
               +TblText1s +TblTag3.innerHTML +TblText1e ;
              NodeNew1.innerHTML = s1;
            } else {
              NodeNew1.innerHTML = '' +'<br>' +
                '\u041e\u0448\u0438\u0431\u043a\u0430\u0021\u0020\u0424\u043e\u0440\u0443\u043c ' +CurFLoad +' \u043f\u0443\u0441\u0442';
            }
            statusElem1.parentNode.insertBefore(NodeNew1, statusElem1);
            var tmp3 = document.getElementById(AddForumS +CurFLoad);
            CurFLoad = -1;
            AddPage1();
          } else {
            var NodeNew1 = document.createElement('div');
            NodeNew1.id  = AddForumS +CurFLoad;
            NodeNew1.innerHTML = '' +'<br>' +
              '\u041e\u0448\u0438\u0431\u043a\u0430\u0021\u0020\u041d\u0435\u0442\u0020\u043e\u0442\u0432\u0435\u0442\u0430\u0020\u043e\u0442\u0020\u0444\u043e\u0440\u0443\u043c\u0430\u0020 ' +CurFLoad +'.';
            statusElem1.parentNode.insertBefore(NodeNew1, statusElem1);
            var tmp3 = document.getElementById(AddForumS +CurFLoad);
            CurFLoad = -1;
            AddPage1();
          }
        }
      }      
      req.open('GET', '/forum.cgi?forum=' +CurFLoad, true);
      req.send(null);
      statusElem2.innerHTML = 'Loading' 
       +' \u0444\u043e\u0440\u0443\u043c:' +CurFLoad;
    } else {
      statusElem2.innerHTML = '\u0412\u0441\u0435\u0020\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b\u0020\u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u044b.';
    }
  }

  function getXmlHttp(){
    var xmlhttp;
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (E) {
        xmlhttp = false;
      }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
      xmlhttp = new XMLHttpRequest();
      xmlhttp.overrideMimeType('text/html');
    }
    return xmlhttp;
  }

  if (IsAddForums) {AddPage1()};

  var Veche1 = new Array(); 

  function CalcVeche(IgnS) {

    function FindOrAdd1(aNick, aText) {
      var Pt1 = -1;
      for (var i = 0; i < Veche1.length ; i++) { 
        Ln1 = Veche1[i];
        if (aText.toLowerCase() == Ln1[0].toLowerCase()) {
          Pt1 = i;
          break;
        }
      }
      if (Pt1 == -1) {
        var Line1 = new Array();
        Line1[0] = aText;
        Line1[1] = aNick;
        Veche1[Veche1.length] = Line1;
      } else {
        var Line1 = Veche1[Pt1];
        var Find1 = false;
        for (var j = 1; j < Line1.length ; j++) { 
          if (Line1[j] == aNick) {
            Find1 = true;
            break;
          }
        }
        if (!Find1) {
          Line1[Line1.length] = aNick;
          Veche1[Pt1] = Line1;
        }
      }
    }

    PTag1 = document.getElementById('P1Vote');
    if ((PTag1 != null) && (PTag1.innerHTML != '')) {
      PTag1.innerHTML = '';
    } else {

      Veche1 = [];
      if (IgnS == undefined) {IgnS = ''}
      var Ign    = IgnS.split(Delim1);

      var TbTag  = document.getElementsByTagName('table');
      for (var i = 0; i < TbTag.length ; i++) { 
        if (TbTag[i].className == "tb") {
          var TrT = TbTag[i].getElementsByTagName('tr');
          if (TrT.length == 0) continue;
          var BTag = TbTag[i].getElementsByTagName('b');
          if (BTag.length == 0) continue;
          LiTag =  TbTag[i].getElementsByTagName('li');
          for (var j = 0; j < LiTag.length; j++) { 
            B2Tag = LiTag[j].getElementsByTagName('b');
            if (B2Tag.length == 0) continue;
            if (B2Tag[0] == '') continue;
            FindOrAdd1(BTag[0].innerHTML, B2Tag[0].innerHTML);
          }
        }
      }
      if (Veche1.length == 0) {
        alert('\u041f\u0440\u043e\u0433\u043e\u043b\u043e\u0441\u043e\u0432\u0430\u0432\u0448\u0438\u0445\u0020\u043d\u0435\u0442\u002e');
      } else {
        for (var k = 0; k < Veche1.length; k++) { 
          for (var i = 0; i < Veche1.length; i++) { 
            var Find1 = false;
            for (var j = 0; j < Veche1.length; j++) { 
              if (i == j) continue;
              if (Veche1[i][0]<Veche1[j][0]) {
                var Line1 = Veche1[i];
                Veche1[i] = Veche1[j];
                Veche1[j] = Line1;
                Find1 = true;
              }
            }
            if (!Find1) break;
          }
          if (!Find1) break;
        }
         VoteCnt1 = 0;
         for (var j = 1; j < Veche1.length; j++) { 
           if (VoteCnt1 < Veche1[j].length -1) {VoteCnt1 = Veche1[j].length -1}}

         s2 = '';
         for (var i = 0; i < Veche1.length ; i++) { 
           var s3 = '';
           var s4 = '';
           for (var j = 1; j < Veche1[i].length; j++) { 
             s4 = s4 +'&nbsp;';
             s3 = s3 +Veche1[i][j];
             if (j != Veche1[i].length-1) {s3 = s3 +', '}
           }
           s2 = s2 +'<tr bgcolor=#ffffff><td width=70%>' +Veche1[i][0]
            +' ( ' +s3 +' ) ' +'</td>';
           s2 = s2 +'<td nowrap=nowrap width=5% align=center>' 
             +(Veche1[i].length -1) +'</td>';
           s2 = s2 +'<td nowrap=nowrap width=100><font Color=blue '
            +'style="background-color:blue;">' +s4 +'</font></td>';
           s2 = s2 +'</tr>'
         }

        var s1 = ''
          +'<table class="dats" align=center bgcolor=#A0A0A0 border=0 cellpadding=3'
          +' cellspacing=1 width=95%><tbody><tr align=center bgcolor=#dddddd>'
          +'<td width=70%><b>\u0412\u043e\u043f\u0440\u043e\u0441\u0020\u0438\u0020\u043e\u0442\u0432\u0435\u0442\u0020\u0028\u0020\u0433\u043e\u043b\u043e\u0441\u043e\u0432\u0430\u0432\u0448\u0438\u0435\u0020\u0029</b></td>'
          +'<td nowrap=nowrap width=5%><b>\u0413\u043e\u043b\u043e\u0441\u043e\u0432</b></td>'
          +'<td nowrap=nowrap width=100><b>\u0428\u043a\u0430\u043b\u0430</b></td>'
          +'</tr>'
          +s2
          +'</tbody></table>'
          +''
          ;

        if (PTag1 == null) {
          var TbTag1 = document.getElementsByTagName('table');
          for (var j = 0; j < TbTag1.length; j++) { 
            if (TbTag1[j].className == 'tb') {
              PTag1 = document.createElement('p');
              PTag1.id = 'P1Vote';
              break;
            }
          }
          PTag1.innerHTML = s1;
          TbTag1[j].parentNode.insertBefore(PTag1, TbTag1[j]);
        } else {
          PTag1.innerHTML = s1;
        }
      }
    }
  }

  if (isUseVeche) {
    BTag1 = document.getElementsByTagName('b');
    for (var i = BTag1.length -1; i >= 0; i--) { 
      if (BTag1[i].innerHTML == '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435') {
        FntTg1 = document.createElement("font");
        FntTg1.innerHTML = '<a id=VoteLink1 href=javascript:AddVote1()'
         +' title="\u0412\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442\u0020\u0432\u0020\u0444\u043e\u0440\u043c\u0443\u0020\u043e\u0442\u0432\u0435\u0442\u0430\u0020\u0431\u043b\u043e\u043a\u0020\u0441\u0020\u0432\u0430\u0448\u0438\u0020\u0433\u043e\u043b\u043e\u0441\u043e\u043c\u0020\u0437\u0430\u0020\u0447\u0442\u043e\u002d\u043b\u0438\u0431\u043e\u002e"'
         +'>\u0413\u043e\u043b\u043e\u0441\u043e\u0432\u0430\u0442\u044c</a>';
        BTag1[i].parentNode.appendChild(FntTg1);
        document.getElementById('VoteLink1').addEventListener("click", 
         function() {AddVote1()}, false);
        break;
      }
    }
  }
  function AddVote1() {
    TATag1 = document.getElementById('post');
    if (TATag1 == null) {
      TATag1 = document.getElementsByName('post')
      TATag1 = TATag1[0];
    }
    if (TATag1 == null) { alert('\u0424\u043e\u0440\u043c\u0430\u0020\u043e\u0442\u0432\u0435\u0442\u0430\u0020\u043d\u0435\u0020\u043d\u0430\u0439\u0434\u0435\u043d\u0430\u002e') 
    } else {
      var s = '';
      s = prompt('\u0412\u0432\u0435\u0434\u0438\u0442\u0435\u0020\u0432\u043e\u043f\u0440\u043e\u0441\u0020\u0438\u0020\u043e\u0442\u0432\u0435\u0442\u0020\u0437\u0430\u0020\u043a\u043e\u0442\u043e\u0440\u044b\u0439\u0020\u0432\u044b\u0020\u0445\u043e\u0442\u0438\u0442\u0435\u0020\u043f\u0440\u043e\u0433\u043e\u043b\u043e\u0441\u043e\u0432\u0430\u0442\u044c:'
        +'\n\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440\u003a\u0020\u041c\u043e\u0451\u0020\u043b\u044e\u0431\u0438\u043c\u043e\u0435\u0020\u0436\u0438\u0432\u043e\u0442\u043d\u043e\u0435\u0020\u002d\u0020\u043a\u043e\u0448\u043a\u0430', s);
      if(s!=null){
        TATag1.value = TATag1.value.substr(0,TATag1.selectionStart) +'\n' 
         +'[color=#A0A0A0][*][b]' +s +'[/b][/color]'
         +'\n\n' +TATag1.value.substr(TATag1.selectionEnd);
      }
    }
  }

  function InsertSel1() {
    var LastFindUserName = '';
    function FindPrnt1(aNode) {
      var PrNd1 = aNode.parentNode;
      if (PrNd1.tagName == undefined) {
        return PrNd1;
      }
      if (PrNd1.tagName.toLowerCase() == 'table') {
        if (PrNd1.className == "tb") {
          var TrT = PrNd1.getElementsByTagName('tr');
          if (TrT.length != 0) {
            var BTag = PrNd1.getElementsByTagName('b');
            if (BTag.length != 0) {
              LastFindUserName = BTag[0].innerHTML;
              return PrNd1;
            }
          }
        }
      }
      return FindPrnt1(PrNd1);      
    }

    function FindRef1(TrNode) {
      var ATg1 = TrNode.getElementsByTagName('a');
      for (var i = ATg1.length -1; i>=0; i--){
        if (ATg1[i].href.indexOf('topic.cgi') >= 0) {
          var s1 = '';
          if ((LastFindUserName != '') && (ATg1[i].href != '') 
              && (ATg1[i +1].innerHTML != '')) 
          {
            s1 = ''
              +'[b]' +LastFindUserName +'[/b] '
              +'([url='  +ATg1[i].href +']'
              +ATg1[i +1].innerHTML
              +'[/url])'
            ;
            return s1;
          }
        }
      }
      return '';
    }

    var Nd = FindPrnt1(window.getSelection().getRangeAt(0).startContainer.parentNode);
    if (Nd.tagName == undefined) { alert('\u0422\u0435\u0433\u0020\u043d\u0435\u0020\u043d\u0430\u0439\u0434\u0435\u043d\u002e') 
    } else {
      var s1 = FindRef1(Nd);
      if (s1 == '') { alert('\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u0020\u043d\u0435\u0020\u043d\u0430\u0439\u0434\u0435\u043d\u002e') 
      } else {
        var s2 = window.getSelection().toString();
        if (s2 == '') { alert('\u041d\u0438\u0447\u0435\u0433\u043e\u0020\u043d\u0435\u0020\u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043e\u002e\u0020\u0412\u044b\u0434\u0435\u043b\u0438\u0442\u0435\u0020\u0442\u0435\u043a\u0441\u0442\u0020\u0438\u0020\u043d\u0430\u0436\u043c\u0438\u0442\u0435\u0020\u0435\u0449\u0451\u0020\u0440\u0430\u0437\u002e') 
        } else {
          var s2 = '[quote]' +s2 +'[/quote]';
          TATag1 = document.getElementById('post');
          if (TATag1 == null) { alert('\u0424\u043e\u0440\u043c\u0430\u0020\u043e\u0442\u0432\u0435\u0442\u0430\u0020\u043d\u0435\u0020\u043d\u0430\u0439\u0434\u0435\u043d\u0430\u002e') 
          } else {
            TATag1.value = TATag1.value.substr(0,TATag1.selectionStart) 
              +'\n' +s1 +s2 +'\n\n'
              +TATag1.value.substr(TATag1.selectionEnd);
         }
        }
      }
    }

  }

})();
