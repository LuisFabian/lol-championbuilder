/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

  var storage = null;
  var urlService = "http://lol.uinik.com/champions";


  function callbackExecute(callback){
    if (typeof callback === "function") {
         callback();
    }
  }

  function isMatch(s,exp){
     var re = new RegExp(exp, "i");
     var r = s.match(re);
     return(r);
  }

  function getServiceWeb(callback){
    $.ajax({
       url:urlService,
       dataType:"json",
       beforeSend:function(){  showLoad(); },
       success:function(d) {
         hideLoad();
         window.localStorage.setItem("champions",JSON.stringify(d));
         callbackExecute(callback({"champions":d}));
       }
    });
  }

  function getInfoChampions(callback){
    var data = "";
    storage = window.localStorage.getItem("champions");
    if(storage === null||storage===undefined){
       getServiceWeb(callback);
    }else{
      hideLoad();
      callbackExecute(callback({"champions":JSON.parse(storage)}));
    }
  }

  function showLoad(){
    $('.load-data').show();
  }

  function hideLoad(){
    $('.load-data').hide();
  }

  function fillListCampions(html,d){
    var d = _.sortBy(d.champions,'name');
    var compilado = _.template(html);
    return compilado({"champions":d});
  }

  var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        window.addEventListener('load', function() {
          app.onDeviceReady();
          app.onClickBntSelectChamp();
          app.autoCompleteSelectChamp();
        }, false);
    },

    onDeviceReady: function(){
      $.support.cors = true;
      getInfoChampions(function(d){
        var html = $('#champions_list').html();
        var temp = fillListCampions(html,d);
        $('.champions-list-conten').show().html(temp);
      });
    },

    onClickBntSelectChamp: function(){
      var e = document.getElementById('btnSelChmp1');
      e.addEventListener('touchend', function(event) {

      }, false);
    },

    autoCompleteSelectChamp(){
        document.querySelector('#inputSearchChamp1').addEventListener('keyup', function(e) {

          var v = this.value;
          var d = JSON.parse(window.localStorage.getItem("champions"));
          var f = "";
          var t = "";

          if(d!==null||d!==undefined){
            var html = $('#champions_list').html();
            $('#listSearchChamp1').empty();
            f = _.sortBy(_.filter(d,function(c){ if(isMatch(c.name,v)!==null){ return (c); } }),'name');
            t = fillListCampions(html,{"champions":f});
            $('#listSearchChamp1').html(t);

          }else{ console.log(':D'); }
        }, false);
    }


  };
