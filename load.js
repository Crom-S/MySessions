var background = browser.extension.getBackgroundPage();
var newSession;

function getMessage(code, obj)
{
    try
    {
        var value = browser.i18n.getMessage(code, obj);
        if (value)
        {
            return value;
        }
    }
    catch (fmt)
    {
        console.error(fmt);
    }
}


function init()
{
    document.title = getMessage("ImportTitle");
    $(ImporttextBox).html(getMessage("ImportSession"));
    
}





function changeDateFormat( baseName )
{
    var parts = baseName.split( "/" );
	var Y = parts[2].split("_");
	if(Y[1] == undefined)
	{
		Y[1] = "00:00";
	}
    switch ( localStorage.dateFormat )
    {
        case "1":
            baseName = parts[ 0 ] + "/" + parts[ 1 ] + "/" + Y[ 0 ] + "__" + Y[ 1 ];
            break;
        case "2":
            baseName = parts[ 1 ] + "/" + parts[ 0 ] + "/" + Y[ 0 ] + "__" + Y[ 1 ];
            break;
        case "3":
            baseName = Y[ 0 ] + "-" + parts[ 1 ] + "-" + parts[ 0 ] + "__" + Y[ 1 ];
            break;
    }
    return baseName;
}



function populateWin( data, id, dataAndEvents )
{
    var t = $( "#" + id );
    var li = $( "<div/>"
    , {
        "class": "winWrapper"
        , winId: data.id
        , id: id + "Wrapper" + data.id
    } );
    if ( dataAndEvents )
    {
        li.prependTo( t );
    }
    else
    {
        li.appendTo( t );
    }
    t = $( "<div/>"
        , {
            "class": "mswinline"
        } )
        .appendTo( li );
    var $input = $( "<input/>"
        , {
            id: id + "_win_" + data.id
            , "class": "mswincheck"
            , type: "checkbox"
            , checked: dataAndEvents
            , change: function()
            {
                if ( $( this )
                    .prop( "checked" ) == true )
                {
                    li.find( ".mscheck" )
                        .prop( "checked", true );
                }
                else
                {
                    li.find( ".mscheck" )
                        .prop( "checked", false );
                }
            }
        } )
        .appendTo( t );
		
    var wspan = $( "<span/>"
        , {
            "class": "msWinblabel"
            , text: data.label || ( dataAndEvents ? "Current Window" :
                "window(" + data.id + ")" )
        } )
        .appendTo( t );
	data = data.tabs;
	$( "<span/>"
        , {
            "class": "mswspan"
            , text:"("+data.length+" tabs)"
        } )
        .appendTo( wspan );
    
    t = 0;
    for ( ; t < data.length; t++ )
    {
        var e = data[ t ];
        var rightDiv = $( "<div/>"
            , {
                "class": "mstabline"
                , title: e.title == e.url ? e.title : e.title + " : " + e.url
            } )
            .appendTo( li );
        $( "<input/>"
            , {
                id: "tabcheck_" + e.id
                , "class": "mscheck"
                , type: "checkbox"
                , checked: dataAndEvents
                , change: function()
                {
                    if ( $( this )
                        .prop( "checked" ) == true )
                    {
                        $input.prop( "checked", true );
                    }
                }
            } )
            .appendTo( rightDiv )[ 0 ].tab = e;
        if ( id == "mslistoriginal" )
        {
            $( "<span/>"
                , {
                    "class": "mstablabel"
                    , text: e.title
                    , link: e.url
                    , click: function()
                    {
                        browser.tabs.create(
                        {
                            url: $( this )
                                .attr( "link" )
                        } );
                    }
                } )
                .appendTo( rightDiv );
        }
        else
        {
            $( "<span/>"
                , {
                    "class": "mstablabel"
                    , text: e.title
                } )
                .appendTo( rightDiv );
        }
    }
    $( '#mssavebase input[type="checkbox"]' )
        .change( function()
        {
            var copyProp = $( "#mssavebase .mscheck:checked" )
                .length == 0;
            $( "#mssavebutton" )
                .prop( "disabled", copyProp );
        } );
}

function editSave()
{
    if ( !$( "#mseditsave" )
        .prop( "disabled" ) && $( "#mstitle" )
        .val() )
    {
        var now = new Date;
			now = now.getMinutes();
			
			if (now < 10)
			{
				now = new Date;
				now = now.getDate() + "/" + (now.getMonth() + 1) + "/" + (now.getYear() + 1900)+"_"+now.getHours()+":" + "0" +now.getMinutes();
			}
			else
			{
				now = new Date;
				now = now.getDate() + "/" + ( now.getMonth() + 1 ) + "/" + ( now.getYear() + 1900 )+"_"+now.getHours()+":"+now.getMinutes();
			}
        var self = new background.SessionData( $( "#mstitle" )
            .val(), now);
        $.each( $( "#mseditsession .winWrapper" ), function( dataAndEvents
            , elem )
        {
            var $elem = $( elem );
            var windows = $elem.attr( "winId" );
            $.each( $elem.find( ".mscheck" ), function( dataAndEvents
                , e )
            {
                if ( e.checked )
                {
                    var tab = e.tab;
                    if ( tab )
                    {
                        self.addTab(
                        {
                            url: tab.url
                            , title: tab.title
                            , win: windows
                        } );
                    }
                }
            } );
        } );
        var c = self.getCount();
        if ( self.getCount() == 0 )
            {
                alert( getMessage( "emptySession" ) );
            }
            else
            {
                if ( self.getCount() > 0 )
                {
                    self.save( function( dataAndEvents )
                    {
                        if ( !dataAndEvents )
                        {
                            alert( getMessage( "saveFail" ) );
                        }
                    } );
                }
            }
        window.location.reload();
    }
}

function importSessionf(event)
{
	var file = event.target.files[0];
	console.log(file);
	var output = document.getElementById('output');
		var reader = new FileReader();
			reader.onload = function(e) {
				var text = e.target.result;
				var array = text.split('\n');
				var Stitle = array[1].substring(5);
				var t = new Date(Number(array[2].substring(10)));
			t = t.getMinutes();
			
			if (t < 10)
			{
				t = new Date;
				t = t.getDate() + "/" + (t.getMonth() + 1) + "/" + (t.getYear() + 1900)+"_"+t.getHours()+":" + "0" +t.getMinutes();
			}
			else
			{
				t = new Date;
				t = t.getDate() + "/" + ( t.getMonth() + 1 ) + "/" + ( t.getYear() + 1900 )+"_"+t.getHours()+":"+t.getMinutes();
			}
				var data = JSON.parse(array[4]);
				console.log(data.windows.length);
				$( "#mseditsave" )
				.prop( "index", data.index );
				var i = 0;
				var j = 0;
				data.title = Stitle;
			
				for ( ; i < data.windows.length; i++ )
					{
						for ( ; j < data.windows[i].tabs.length; j++ )
						{	
					
							data.windows[i].tabs[j] = data.windows[i].tabs[j].entries[data.windows[i].tabs[j].entries.length-1];
							data.windows[i].tabs[j].id = j;
			
						}
						j=0;
					}
					for ( i in data.windows )
					{
						populateWin(
						{
							id: i
							, tabs: data.windows[ i ].tabs
							, label: data.windows[ i ].name
						}, "mslistoriginal", true );
					}
					$( "#mslistoriginal input[type=checkbox]" )
						.prop( "checked", true );
					$( "#msrestorelist" )
						.hide();
					$( "#mseditsession" )
						.show()
						.animate(
					{
						left: "0%"
					}, 250, "swing", function()
					{
						$( "#mstitle" )
						.val( data.title )
						.focus()
						.select();
					} );
		
					$( '#mseditsession input[type="checkbox"]' )
						.change( function()
						{
							var copyProp = $( "#mseditsession .mscheck:checked" )
								.length == 0;
							$( "#mseditsave" )
								.prop( "disabled", copyProp );
						} );
					$( function()
					{
						$( "#mseditlist1, #mslistoriginal" )
							.sortable(
							{
								items: ".mstabline"
								, connectWith: ".mseditlist"
							} )
							.disableSelection();
					} );
			
			
		};
      
      reader.readAsText(file);

}



$( document )
    .ready( function()
    {
		$(file )
            .change( function(event)
            {
				importSessionf(event);
            } );
		$( mseditsave )
            .click( function()
            {
                editSave();
            } );
        init();
    } );