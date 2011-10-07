
jQuery(function($){

    $.fn.listbuilder = function(settings){
        //add body role
        if( !$('body').is('[role]') ){ $('body').attr('role','application'); }
        //cache reference to textarea
        var el = $(this);

        //overrideable defaults
        var options = $.extend({
                delimChar: /[,\n]/, //character used to split textarea content into items
                width: el.width(), //width of listBuilder container. defaults to width of textarea
                height: el.height(), //height of listBuilder container. defaults to height of textarea
                completeChars: [188,13], //keyCodes for item completion
                userDirections: 'To add an item to this list, type a name and press enter or comma.', //directions that will tooltip on the input
                labelReplacement: false
        },settings);

        //create component container
        var listbuilder = $('<ul class="listbuilder"></ul>')
                                .width(options.width)
                                .height(options.height);

        //function to return a new listbuilder entry
        function listUnit( val ){
            return $('<li class="listbuilder-entry"><span class="listbuilder-entry-text">'+val+'</span><a href="#" class="listbuilder-entry-remove" title="Remove '+val+' from the list." role="button"></a></li>')
                .hover(
                    function(){ $(this).addClass('listbuilder-entry-hover'); },
                    function(){ $(this).removeClass('listbuilder-entry-hover'); }
                )
                .attr('unselectable', 'on')
                .css('MozUserSelect', 'none');
        }

        window.stripValue = function stripValue(val) {

            function isLetter(ch) {
                 return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
            }

        // Test for digits
           function isDigit(aChar){
              myCharCode = aChar.charCodeAt(0);

              if((myCharCode > 47) && (myCharCode <  58)){
                 return true;
              }

              return false;
           }

            var ret = '';
            for(var i=0,n=val.length;i<n;i++) {
                if(isLetter(val.charAt(i)) || isDigit(val.charAt(i)))
                    ret += val.charAt(i);
            }

            console.log('strippedValue('+val+')='+ret);
            return ret;
        }

        //function to populate listbuilder from textarea
        function populateList(){
            listbuilder.empty();
            $.each(el.val().split(options.delimChar), function(){
                if(this != ''){ listbuilder.append(listUnit(stripValue(this))); }
            });
            //append typeable component
            listbuilder.append('<li class="listbuilder-entry-add"><input type="text" value="" title="'+ options.userDirections +'" /></li>');
        }

        //run proxy on every keyup in textarea (for development)
        el.keyup(populateList);

        //function to populate textarea from current listbuilder
        function updateValue(){
            taval = [];
            listbuilder.find('span.listbuilder-entry-text').each(function(){
                taval.push(stripValue( $(this).text()) );
            });
            taval.push( stripValue( listbuilder.find('input').val() ) );
            el.val( taval.join(/*options.delimChar*/'\n') );
        };

        //populate initial listbuilderfrom textarea
        populateList();

        //add key behavior to input
        listbuilder.find('input')
            .keydown(function(ev){
                var input = $(this);

                //check if key was one of the completeChars, if so, create a new item and empty the field
                $.each(options.completeChars,function(){
                    if(ev.keyCode == this && input.val() != '' && input.val() != options.delimChar){
                        var val = input.val().split(options.delimChar)[0];
                        input.parent().before( listUnit(stripValue(val)) );
                        input.val('');
                    }
                    if(ev.keyCode == this){
                        ev.preventDefault();
                    }
                });

                var prevUnit = input.parent().prev();
                if(input.val() == '' && ev.keyCode == 8){
                    ev.stopPropagation();
                    if(prevUnit.is('.listbuilder-entry-selected')){
                        prevUnit.remove();
                    }
                    else {
                        prevUnit.addClass('listbuilder-entry-selected');
                    }
                }
                else {
                    prevUnit.removeClass('listbuilder-entry-selected');
                }


            })
            .keyup(function(){
                updateValue();
                //approx width for input
                var testWidth = $('<span style="visibility: hidden; position: absolute; left: -9999px;">'+ $(this).val() +'</span>').css('font-size', $(this).css('font-size')).appendTo('body');
                $(this).width( testWidth.width() + 20 );
                testWidth.remove();
            });

            //apply delete key event at document level
        $(document)
            .click(function(){
                listbuilder.find('.listbuilder-entry-selected').removeClass('listbuilder-entry-selected');
                listbuilder.removeClass('listbuilder-focus');
            })
            .keydown(function(ev){
                if(ev.keyCode == 8){
                    listbuilder.find('.listbuilder-entry-selected').remove();
                    updateValue();
                }
            });


        //click events for delete buttons and focus
        listbuilder.click(function(ev){
            $(this).addClass('listbuilder-focus');

            var clickedElement = $(ev.target);
            if( clickedElement.is('a.listbuilder-entry-remove') ){
                clickedElement.parent().remove();
                updateValue();
                return false;
            }
            else if( clickedElement.is('li.listbuilder-entry, span')){
                if(clickedElement.is('span')){
                    clickedElement = clickedElement.parent();
                }
                if( !ev.shiftKey && !ev.ctrlKey && !ev.metaKey){
                    listbuilder.find('.listbuilder-entry-selected').removeClass('listbuilder-entry-selected');
                }
                if( (ev.shiftKey || ev.ctrlKey || ev.metaKey) && clickedElement.is('.listbuilder-entry-selected') ){
                    clickedElement.removeClass('listbuilder-entry-selected');
                }
                else{
                    clickedElement.addClass('listbuilder-entry-selected');
                }
                return false;
            }
            else {
                $(this).find('.listbuilder-entry-selected').removeClass('listbuilder-entry-selected');
                listbuilder.find('input').eq(0).focus();
                return false;
            }

        });

        //set focus/blur states from input state and focus on input
        listbuilder.add('input')
            .focus(function(){
                $(this).addClass('listbuilder-input-focus');
                listbuilder.addClass('listbuilder-focus');
            })
            .blur(function(){
                $(this).removeClass('listbuilder-input-focus');
                listbuilder.removeClass('listbuilder-focus');
            });

        //insert listbuilder after textarea (and hide textarea)
        listbuilder.insertAfter( el );

        //set label to direct to new input
        var assocLabel = $('label[for='+ el.attr('id') +']');
        if(assocLabel.length && options.labelReplacement){
            var newLabel = $(options.labelReplacement);
            assocLabel.replaceWith(newLabel);
            newLabel.text(assocLabel.html());
        }

        //keep textarea chainable
        return this;
    };        
});