/**
 * Created by chief on 16/7/26.
 */


define('index',['./viewModel/pageSettingModel','./htmlformat'],function(model){
    var init = function (container){
        var template =  require('html!../../static/page/default.html');

        var HTMLFormat = require('./htmlformat.js');

        // 给body添加滚动条优化
        // $("body").mCustomScrollbar({theme:"minimal-dark"});



        $(".nav-toggle").on("click",function(){
            $(".nav-menu").toggleClass("toggle-show");
        })
        var i = 0;

        $(container).html(template);

        var layoutBox = $(container).find('.layoutBox');

        ko.applyBindings(model,layoutBox[0]);

        $(container).on('mouseover',function(event){
            var target = $(event.target);
            $(container).find('.widget-menubar').hide();
            var parent = target.closest('.u-drag')||target.closest('.widgetBox');
           
            if(parent.length>0){
                parent.find('>.widget-menubar').eq(0).show();
            }
            else {
                $(container).find('.widget-menubar').hide();
            }
        }).on('mouseleave',function(event){
            $(container).find('.widget-menubar').hide();
        })
        $('body').on('click',function(e){
            var target = $(e.target);

            if(target.hasClass('icon-cancel02')){
                target.closest('.widget-menubar').parent().remove();
            }
            if(target.hasClass('uf-pencil')){

                $(e.target).attr("count",function(){
                    var i = $(e.target).attr("count");
                    i++;
                    return i;
                });
                if($(e.target).attr("count") > 1){
                    return;
                }
                //layout
                if(target.closest('.u-drag').hasClass('u-row')){
                    if($(target).closest('.u-drag').find('.drag-overlay').length>0){
                        return false;
                    }
                    var layout =  require('html!../page/panel/layout.html');
                    var panelBox =  require('html!../page/panel/panel-container.html');
                    var container = $(target).closest('.u-drag');
                    container.append(panelBox);
                    container.find('.edit-panel-body').html(layout);

                    container.find(".edit-panel").draggable({containment:"#container-content"});

                    var layout =  require('./panel/layout');

                    layout.init(container);
                    return false;
                }

                //elements
                // if(target.closest('.u-drag').hasClass('u-elements')){
                //     if($(target).closest('.u-drag').find('.drag-overlay').length>0){
                //         return false;
                //     }
                //     var layout =  require('html!../page/panel/layout.html');
                //     var panelBox =  require('html!../page/panel/panel.html');
                //     var container = $(target).closest('.u-drag');
                //     container.append(panelBox);
                //     container.find('.edit-panel-body').html(layout);

                //     container.find(".edit-panel").draggable({containment:"#container-content"});

                //     var layout =  require('./panel/layout');

                //     layout.init(container);
                //     return false;
                // }
                //widget
                // if($(target).closest('.u-drag').find('.u-widget').length>0){

                //     return false;
                // }

                var panel = $(e.target).closest(".u-widget").attr("panelname") ||  $(e.target).closest(".u-elements").attr("panelname");


                if(typeof  panel=='undefined'){
                    return false;
                }
                var panelTemplate =  require('html!../page/panel/'+panel+'-panel.html');
                var panelBox =  require('html!../page/panel/panel.html');

                var container = $(target).closest('.u-drag');
                var index = container.find("[index]").attr("index");
                
                

                container.append(panelBox);
                container.find('.edit-panel-body').html(panelTemplate);

                container.find(".edit-panel").draggable({containment:"#container-content"});
     
                // 滚动条优化
                $(".edit-panel-body").mCustomScrollbar({theme:"minimal-dark"});

                //var widgetViewModel = require('./viewModel/'+panel+'Model.js');
                var widgetViewModel = $(e.target).closest(".u-widget").data("model") || $(e.target).closest(".u-elements").data("model");


                // console.log( $(e.target).parents(".widget-menubar").closest(".drag-overlay"));
                var editPanel = $(e.target).parents(".widget-menubar").siblings(".drag-overlay").find(".edit-panel")[0];
                // var editPanel = $(".edit-panel")[0];

                ko.applyBindings(widgetViewModel,editPanel);


                $(editPanel).find("[index]").not($(editPanel).find("[index]")[index]).hide();
                // $($(editPanel).find("[index]")[index]).addClass("active")
                u.compMgr.updateComp();

            }
            if($(target).hasClass("uf-close-c")){
                $(e.target).parents(".drag-overlay").siblings(".widget-menubar").find(".uf-pencil").attr("count","0");
                $(target).closest('.drag-overlay').remove();
            }
        });

        require.ensure(['./../trd/jquery-ui/jquery-ui'],function(ui){
            var ui = require('./../trd/jquery-ui/jquery-ui');

            function sortable(elements,p) {

                p = typeof p!="undefined"?p:'.layoutBox .widgetBox';

                $(elements).sortable({
                    placeholder: "ui-portlet-placeholder",
                    connectWith: p,
                    forcePlaceholderSize: true,
                    start:function(i,ui){
                 
                    },
                    stop: function (i,ui) {
                        var target = $(ui.item);

                        if(target.hasClass('u-widget')){
                            //sortable(target.find('.widgetBox'),'.layoutBox .widgetBox');
                        }
                        else {
                            sortable(target.find('.widgetBox'),'.widgetBox');
                        }
                        //$(ui.helper).removeAttr("style");
                    },
                    over: function () {

                    }
                }).disableSelection();
            };

            sortable(layoutBox);


            $('#preview').on('click',function(){
                $('.drag-overlay').addClass('hide');
                $('#container-content').find('[data-bind]').removeAttr('data-bind');
                var html = $('#container-content').html();
                $('.files').val(html);
                $('.previewFiles').submit();
            });

            $('#downLoad').on('click',function(){
                var html = $('#container-content').html()||$('.layoutBox').html();
                html = HTMLFormat(html);
                $('.files').val(html);
                $('.downloadFiles').submit();
            });

            //$(elements).sortable({
            //    placeholder: "ui-portlet-placeholder",
            //    connectWith: '.widgetBox',
            //    forcePlaceholderSize: true,
            //    start:function(i,ui){
            //        $(this).find('.widget-menubar').hide();
            //    },
            //    stop: function (i,ui) {
            //        var target = $(ui.item);
            //        target.find('.widgetBox').sortable({
            //            placeholder: "ui-portlet-placeholder",
            //            connectWith:  '.widgetBox',
            //            forcePlaceholderSize: true,
            //            start:function(i,ui){
            //                $(this).find('.widget-menubar').hide();
            //            },
            //            stop: function (i,ui) {
            //                var target = $(ui.item);
            //                target.find('.widgetBox').sortable({
            //                    placeholder: "ui-portlet-placeholder",
            //                    connectWith:  '.widgetBox',
            //                    forcePlaceholderSize: true,
            //                    start:function(i,ui){
            //                        $(this).find('.widget-menubar').hide();
            //                    },
            //                    stop: function (i,ui) {
            //                        //console.log(i);
            //                    },
            //                    over: function () {
            //
            //                    }
            //                }).disableSelection();
            //            },
            //            over: function () {
            //
            //            }
            //        }).disableSelection();
            //    },
            //    over: function () {
            //
            //    }
            //}).disableSelection();
        });
    };
    
   
    return {
        init:init
    }
});
