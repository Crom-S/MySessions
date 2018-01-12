var background = browser.extension.getBackgroundPage();
var sessions = [];
var editedSession;
var editedBlock;
var allWindows = [];
var S = {};

function getMessage( type, elems )
{
    try
    {
        var ret = browser.i18n.getMessage( type, elems );
        if ( ret )
        {
            return ret;
        }
    }
    catch ( d )
    {
		console.log(d);
	}
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
		var img = $("<img/>",
                {
					"class": "msicon",
                    src: "http://www.google.com/s2/favicons?domain_url=" + e.url
                }).appendTo( rightDiv );
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
            .appendTo( rightDiv )[ 0 ].tab = e;;
		
			
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
							active: false,
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


InitSettings().then(function () {
    //changeBackupSetting();
	console.log(S);
});



function InitSettings()
{
	return new Promise(function (resolve, reject) 
	{
			//var S = {};
			//Возвращаем ЛС
			try
			{
			browser.storage.local.get(['settings'], function (value) 
			{
				//console.log(settings);
				//if (value.sessions != undefined) S = value.sessions;
				//else S = {};
				S = value.settings;
				if (S == undefined) S = {};
				console.log(S);
				resolve();
			});
			}
			catch (e)
			{
				console.log(e);
			}
			
			console.log(S);
			//resolve();
		
	})
}


function init()
{
	InitSettings();
	console.log(localStorage);
    $( "#stringUpdatedMessage" )
        .html( getMessage( "updatedMessage" ) );
    $( "#stringSaveSession" )
        .html( getMessage( "saveSession" ) );
    $( "#savetitle" )
        .val( getMessage( "mySession" ) );
    $( "#mssavelist" )
        .attr( "title", getMessage( "msSaveList" ) );
    $( "#mssavetoggle" )
        .attr( "title", getMessage( "msSaveToggle" ) );
    $( "#mseditnewtoggle" )
        .attr( "title", getMessage( "msSaveToggle" ) );
    $( "#mseditsavedtoggle" )
        .attr( "title", getMessage( "msSaveToggle" ) );
    $( "#msrestorelabel" )
        .html( getMessage( "restoreSession" ) );
    $( "#msrestorelabel2" )
        .html( getMessage( "restoreSession2" ) );
    $( "#msheadingtitle" )
        .html( getMessage( "msHeadingTitle" ) );
    $( "#msheadingnew" )
        .html( getMessage( "msHeadingNew" ) );
	$( "#msselecttab" )
        .html( getMessage( "Add to current window." ) );
    $( "#msheadingnew" )
        .attr( "title", getMessage( "msHeadingNewTitle" ) );
    $( "#msheadingsaved" )
        .html( getMessage( "msHeadingSaved" ) );
    $( "#mseditsave" )
        .attr( "value", getMessage( "msEditSave" ) );
    $( "#mseditcancel" )
        .attr( "value", getMessage( "msEditCancel" ) );
    $( "#mseditremove" )
        .attr( "value", getMessage( "remove" ) );
    $( "#options" )
        .html( getMessage( "options" ) );
    $( "#sessionTextBoxCloseBtn" )
        .attr( "title", getMessage( "sessionTextBoxClose" ) );
    $( "#importSessionBtn" )
        .attr( "title", getMessage( "sessionTextBoxImport" ) );
	$( "#mssavebutton" )
        .attr( "title", getMessage( "save" ) );
	$( "#msrestoreicon2" )
        .attr( "title", getMessage( "options" ) );
    $( selectAll )
        .text( getMessage( "selectAll" ) );
    if ( localStorage.lastUsedSessionName )
    {
        $( "#savetitle" )
            .val( localStorage.lastUsedSessionName );
    }

    var a = false;
    browser.windows.getLastFocused( function( item )
    {
        browser.windows.getAll(
        {
            populate: true
        }, function( results )
        {
            results.forEach( function( act )
            {
                if ( item.id == act.id )
                {
                    a = true;
                }
                populateWin( act, "mssavelist", item.id ==
                    act.id );
            } );
            if ( results.length == 1 )
            {
                $( mssaveToggleH4 )
                    .hide();
            }
            if ( !a )
            {
                console.error(
                    "Cannot find last focused window" );
                $( "#mssavelistWrapper" + results[ 0 ].id +
                        " input[type=checkbox]" )
                    .prop( "checked", true );
            }
        } );
    } );
	console.log("233");
    background.initSession( function( dataAndEvents )
    {
		console.log("Список");
        sessions = dataAndEvents;
		console.log(sessions);
		
        createSessionList();
    } );
	console.log(sessions);
	console.log("243");
	
    var h = document.getElementById( "savetitle" );
    h.focus();
    h.select();
	
	
    h.addEventListener( "keypress", function( event )
    {
        if ( event.keyCode == 13 )
        {
            save();
        }
    } );
    if ( S.crashRestore == true )
    {
        $( msrestorecrash )
            .attr( "title", getMessage( "restorePreviousSession" ) );
        $( msrestorecrashoff )
            .hide();
    }
    else
    {
        $( msrestorecrash )
            .attr( "title", getMessage( "enableCrashRecovery" ) );
        $( msrestorecrashon )
            .hide();
    }
    h = localStorage.popupSize;
    if ( h < 1 )
    {
        $( "body" )
            .css( "zoom", h );
        $( "body" )
            .height( 480 * h );
        $( "html" )
    }
}

function crashRestore()
{
    if ( S.crashRestore == true )
    {
        browser.tabs.create(
        {
            url: "crashRestore.html"
        } );
    }
    else
    {
        browser.tabs.create(
        {
            url: "options.html"
        } );
    }
    window.close();
}

function createSessionList()
{
    var elem = $( "#msrestorelist" );
    if ( sessions.length == 0 )
    {
        var queue = $( "<div/>"
            , {
                "class": "nosessionsaved"
                , text: getMessage( "noSessionSaved" )
            } )
            .appendTo( elem )
    }
    else
    {
        var i = 0;
        for ( ; i < sessions.length; i++ )
        {
			var user = sessions[ i ];
			console.log(user);
			if (S.ShowAutoSave == false && user.title.indexOf("AutoSave_") == 0)
			{
				console.log("AS");
			}
			else
			{
				
				queue = $( "<div/>"
					, {
						id: "session_" + i
						, "class": "mssessionblock"
						, title: getMessage( "clickToRestore", [ user.title ] )
						, mousedown: stopDragEffect
					} )
					.appendTo( elem );
				queue[ 0 ].sessionId = i;
				//Добавляем меню к каждой сессии
				nav = $( "<div/>"
					, {
						id: "nav"+"session_" + i
						, "class": "nav"
						, style: "display:none;"
						, title: getMessage("Left click will open the tabs sequentially, middle click will open the tabs together.")
						//, mousedown: restoreSession
					} )
					.appendTo( elem );
				menu = $( "<div/>"
					, {
						id: i
						, "class": "msmenu"
						, text: getMessage("Open in a new window.")
						, mousedown : OpenNewWindow
					} )
					.appendTo( nav );
				$( "<div/>"
					, {
						id: i
						, "class": "msmenu"
						, text: getMessage("Open in current window.")
						, mousedown: OpenCurrentWindow
					} )
					.appendTo( nav );
				$( "<div/>"
					, {
						id: i
						, "class": "msmenu"
						, text: getMessage("Add to current window.")
						, mousedown: AddCurrentWindow
					} )
					.appendTo( nav );
				$( "<div/>"
					, {
						id: i
						, "class": "msmenu"
						, text: getMessage("Save the current session here.")
						, mousedown: SaveHere
					} )
					.appendTo( nav );
				$( "<div/>"
					, {
						id: i
						, "class": "msmenu"
						, text: getMessage("Select tabs to open.")
						, mousedown: SelectTabs
					} )
					.appendTo( nav );
				//Конец меню
				var q = $( "<div/>"
					, {
						"class": "mssessionlabel"
						, mousedown: restoreSession
					} )
					.appendTo( queue );
				$( "<div/>"
					, {
						"class": "mssessiontitle"
						, text: user.title
					} )
					.appendTo( q );
				$( "<div/>"
					, {
						"class": "mssessioncount"
						, text: getMessage( "tabsCount", [ user.tabsCount.toString() ] )
					} )
					.appendTo( q );
				$( "<div/>"
					, {
						"class": "mssessiontimelabel"
						, text: changeDateFormat( user.date )
						, mousedown: restoreSession
					} )
					.appendTo( queue );
				queue = $( "<div/>"
					, {
						"class": "controls"
					} )
					.appendTo( queue );
				$( "<div/>"
					, {
						"class": "control mssessionremove"
						, title: getMessage( "remove" )
						, click: remove
					} )
					.appendTo( queue );
				$( "<div/>"
					, {
						"class": "control mssessionedit"
						, title: getMessage( "edit" )
						, click: edit
					} )
					.appendTo( queue );
				$( "<div/>"
					, {
						"class": "control mssessionexport"
						, title: getMessage( "export" )
						, click: exportSession
					} )
					.appendTo( queue );
					
				//
				
			}
        }
    }
	$( "#savetitle" )
        .val( getMessage( "mySession" ) );
}

function changeDateFormat( baseName )
{
    var parts = baseName.split( "/" );
	var Y = parts[2].split("_");
	if(Y[1] == undefined)
	{
		Y[1] = "00:00";
	}
    switch ( S.dateFormat )
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

function save()
{
    if ( $( "#mssavebutton" )
        .prop( "disabled" ) )
    {
        console.log( "no tab selected" );
    }
    else
    {
        var name = $( "#savetitle" )
            .val() || "MySession";
        localStorage.lastUsedSessionName = name;
        browser.windows.getAll(
        {
            populate: true
        }, function( failures )
        {
            var now = new Date;
			now = now.getMinutes();
            //now = now.getDate() + "/" + ( now.getMonth() + 1 ) + "/" + ( now.getYear() + 1900 )+"_"+now.getHours()+":"+now.getMinutes();
			
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
            var that = new background.SessionData( name, now );
            failures.forEach( function( win )
            {
                win.tabs.forEach( function( tab )
                {
                    var inputsPlugin = $( "#tabcheck_" +
                        tab.id );
						console.log(tab);
                    if ( inputsPlugin )
                    {
                        if ( inputsPlugin.prop(
                                "checked" ) )
                        {
                            that.addTab(
                            {
                                url: tab.url
                                , title: tab.title
                                , win: win.id
								, pinned: tab.pinned
                            } );
                        }
                    }
                } );
            } );
            if ( that.getCount() == 0 )
            {
                alert( getMessage( "emptySession" ) );
            }
            else
            {
                if ( that.getCount() > 0 )
                {
                    that.save( function( dataAndEvents )
                    {
                        if ( !dataAndEvents )
                        {
                            alert( getMessage( "saveFail" ) );
                        }
                    } );
                }
            }
            window.close();
        } );
    }
}

async function closeAllTabs() 
{
    try 
	{
		//var tab0;
		let query = 
		{
            currentWindow: true
        };
        let tabs = await browser.tabs.query(query);
		
        browser.tabs.create({},function(tab)
			{
				console.log(tab.id);
				//localStorage.tab0 = tab.id;
				
			});
        
        for (let tab of tabs) {
            browser.tabs.remove(tab.id);
        }
		//console.log(tab0);
		
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

function OpenNewWindow(e)
{
	console.log(e.target.id);
	if (e.originalEvent.which == 2)
			{
				var w = 2;
			}
			else //Заглушка
			{
				var w = 0;
			}
	try
    {
        var docSession = sessions[ e.target.id ];
        if ( docSession )
        {
            loadSessionFromId( docSession.folderId, function( d )
            {
                    background.openDelayed( d, w );
                    window.close();
            } );
        }
    }
    catch ( fmt )
    {
        console.error( fmt );
    }
}

function OpenCurrentWindow(e)
{
	console.log(e.target.id);
	//var tab0;
	closeAllTabs();
	AddCurrentWindow(e);
	
	
}

function AddCurrentWindow(e)
{
	console.log(e.target.id);
	try
    {
        var docSession = sessions[ e.target.id ];
        if ( docSession )
        {
			if (e.originalEvent.which == 2)
			{
				var w = 3;
			}
			else
			{
				var w = 1;
			}
			console.log(w);
            loadSessionFromId( docSession.folderId, function( d )
            {
                if ( w == 1 && d.getWinCount() > 1 )
                {
                    if ( confirm( getMessage( "confirmClose" ) ) )
                    {
						console.log("Новые окна");
                        d.open( w );
                    }
                }
                else
                {
					console.log("Одно окно");
                    background.openDelayed( d, w );
					//setTimeout(browser.tabs.remove(parseInt(localStorage.tab0, 10)), 5000);
                    window.close();
                }
            } );
        }
		
    }
    catch ( fmt )
    {
        console.error( fmt );
    }
}

function SaveHere(e)
{
	console.log(e);
	console.log(e.target.parentNode.previousElementSibling);
	editedBlock = e.target.parentNode.previousElementSibling;
	editedSession = sessions[ e.target.id ];
	loadSessionFromId( editedSession.folderId, function( data )
    {
		console.log(data.title);
		$( "#savetitle" ).val(data.title);
		
		var udataCur = "Are you sure to replace this sessions?";
		//udataCur = getMessage( "confirmDeleteQuestion" );
		console.log("688");
		renderConfirmBox( udataCur, function( selfObj )
		{
			console.log(selfObj);
			if ( selfObj )
			{
				//var self = closest( e.target, "mssessionblock" );
				selfObj = sessions[ e.target.id ];
				$( "#msrestorelist .mssessionblock" )
					.remove();
				if ( selfObj )
				{
					selfObj.remove( function()
					{
						sessions.splice( self.sessionId, 1 );
						createSessionList();
					} );
				}
				save();
			}
		} );
		
	});
	
	
}

async function GetSess() 
{
    try 
	{
		var stored = await browser.sessions.getRecentlyClosed({});
		console.log(stored);
		
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

function SelectTabs(e)
{
	//console.log(e.target.id);
	//var tab0;
	// closeAllTabs();
	// AddCurrentWindow(e);
	//GetSess();
	//browser.sessions.restore("5");
	editedSession = sessions[ e.target.id ];
	$( "#mseditlist1" )
        .empty();
	
	$( "#mslistoriginal" )
        .empty();
	loadSessionFromId( editedSession.folderId, function( data )
    {
        $( "#mseditsave" )
            .prop( "index", data.index );
        var i;
        for ( i in data.windows )
        {
            populateWin(
            {
                id: i
                , tabs: data.windows[ i ]
                , label: data.labels[ i ]
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
		//Скрываем лишнее
		$( ".h4" )
            .hide();
		$( "#msheadingtitle" )
            .hide();
		$( "#mstitle" )
            .hide();
		$( "#msheadingsaved" )
            .hide();
		$( "#mseditsavedtoggle" )
            .hide();
		$( ".mseditHead" )
            .hide();
		$( "#mseditlist1" )
            .hide();
		$( "#mseditsave" )
            .hide();
		$( "#mseditremove" )
            .hide();
		//
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
    } );
	
	
}

function AddCurrentWindowSelect()
{
	console.log("AddCurrentWindowSelect");
	if ( !$( "#mseditsave" )
        .prop( "disabled" ) && $( "#mstitle" )
        .val() )
    {
		console.log("AddCurrentWindowSelect1");
        var now = new Date;
			now = now.getMinutes();
            // now = now.getDate() + "/" + ( now.getMonth() + 1 ) + "/" + ( now.getYear() + 1900 )+"_"+now.getHours()+":"+now.getMinutes();
			
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
            .val(), now, 0, editedSession.folderId );
        $.each( $( "#mseditsession .winWrapper" ), function( dataAndEvents
            , elem )
        {
			console.log(dataAndEvents, elem);
            var $elem = $( elem );
            var windows = $elem.attr( "winId" );
            $.each( $elem.find( ".mscheck" ), function( dataAndEvents
                , e )
            {
				console.log("111", e, elem, $elem);
                if ( e.checked )
                {
                    var tab = e.tab;
					console.log(tab);
                    if ( tab )
                    {
						console.log("2222", tab.title, tab.url);
						browser.tabs.create(
								{
									active: false,
									url: tab.url,
									pinned: tab.pinned ? true : false
								});
                        // self.addTab(
                        // {
                            // url: tab.url
                            // , title: tab.title
                            // , win: windows
							// , pinned: tab.pinned
                        // } );
                    }
                }
            } );
        } );
        
    }
}

function OpenNewWindowSelect()
{
	
}

function restoreSession( e )
{
	console.log(e);
	console.log(e.originalEvent.which);
	var w = e.button;
	var self = closest( e.target, "mssessionblock" );
	console.log(self);
	localStorage.EditBlock = self;
	console.log(localStorage.EditBlock);
	
	
  // if($('#nav'+self.id).css("display")=="block"){
				// $('#nav'+self.id).css("display", "none");
			// }
			// else{
				// $('#nav'+self.id).css("display", "block");
			// }
	if (e.originalEvent.which != 2)	//Если нажата не средняя кнопка
	{
		$('#nav'+self.id).toggle("fast");
		

		console.log($('.nav').length);	

		$('.nav').not('#nav'+self.id).css("display", "none");
		//$('#nav'+self.id).toggle("fast");
	}
	else
	{
    try
    {
        var self = closest( e.target, "mssessionblock" );
        var docSession = sessions[ self.sessionId ];
        if ( docSession )
        {
            var w = e.button;
			console.log(e.button);
            if ( e.ctrlKey || e.metaKey )
            {
                w = 1;
            }
			else //Заглушка
			{
				w = 0;
			}
			console.log(w);
            loadSessionFromId( docSession.folderId, function( d )
            {
                if ( w == 1 && d.getWinCount() > 1 )
                {
                    if ( confirm( getMessage( "confirmClose" ) ) )
                    {
                        d.open( w );
                    }
                }
                else
                {
                    background.openDelayed( d, w );
                    window.close();
                }
            } );
        }
    }
    catch ( fmt )
    {
        console.error( fmt );
    }
	}
}

function stopDragEffect( event )
{
    event.preventDefault();
    event.stopPropagation();
}

function showTooltip( e )
{
    var marginDiv = closest( e.target, "mssessionblock" )
        .querySelector( ".tooltip" );
    marginDiv.textContent = e.target.getAttribute( "title" );
    marginDiv.style.marginRight = e.target.parentNode.offsetWidth - e.target.offsetLeft -
        16 + "px";
}

function hideTooltip( e )
{
    closest( e.target, "mssessionblock" )
        .querySelector( ".tooltip" )
        .textContent = "";
}

function renameChange( deepDataAndEvents )
{
    if ( deepDataAndEvents.keyCode == 13 )
    {
        editSave( deepDataAndEvents );
    }
}

function loadSessionFromId( storageKey, getter )
{
    function save( obj, db, callback )
    {
        if ( obj.length == 0 )
        {
            callback();
        }
        else
        {
            var data = obj.shift();
            if ( data.url )
            {
                db.addTab(
                {
                    id: data.id
                    , url: data.url
                    , title: data.title
                    , win: "_win"
                } );
                save( obj, db, callback );
            }
            else
            {
                browser.bookmarks.getChildren( data.id, function( failures )
                {
                    db.addWinLabel( data.id, data.title );
                    failures.forEach( function( tab )
                    {
                        db.addTab(
                        {
                            id: tab.id
                            , url: tab.url
                            , title: tab.title
                            , win: data.id
							, pinned: tab.pinned
                        } );
                    } );
                    save( obj, db, callback );
                } );
            }
        }
    }
    browser.bookmarks.get( storageKey, function( results )
    {
        var tags = results[ 0 ].title.match(/^(.*)\((\d+\/\d+\/\d+\_\d+\:\d+)\)--(\d+)tabs$/i);
		if (tags == null)
		{
			tags = results[ 0 ].title.match(/^(.*)\((\d+\/\d+\/\d+)\)--(\d+)tabs$/i )
		}
        var data = new background.SessionData( tags[ 1 ].trim(), tags[
            2 ], tags[ 3 ], results[ 0 ].id );
        if ( S.editOrder == false )
        {
            data.index = results[ 0 ].index;
        }
        browser.bookmarks.getChildren( results[ 0 ].id, function(
            walkers )
        {
            save( walkers, data, function()
            {
                getter( data );
            } );
        } );
    } );
}

function edit( e )
{
	e = closest( e.target, "mssessionblock" );
    editedSession = sessions[ e.sessionId ];
    editedBlock = e;
    $( "#mseditlist1" )
        .empty();
	//Скрываем лишнее (возвращаем)
		$( ".h4" )
            .show();
		$( "#msheadingtitle" )
            .show();
		$( "#mstitle" )
            .show();
		$( "#msheadingsaved" )
            .show();
		$( "#mseditsavedtoggle" )
            .show();
		$( ".mseditHead" )
            .show();
		$( "#mseditlist1" )
            .show();
		$( "#mseditsave" )
            .show();
		$( "#mseditremove" )
            .show();
			
			
		//
    browser.windows.getLastFocused( function( item )
    {
        browser.windows.getAll(
        {
            populate: true
        }, function( failures )
        {
            failures.forEach( function( act )
            {
                populateWin( act, "mseditlist1", item.id ==
                    act.id );
            } );
            $( "#mseditlist1 input[type=checkbox]" )
                .prop( "checked", false );
        } );
    } );
    $( "#mslistoriginal" )
        .empty();
    loadSessionFromId( editedSession.folderId, function( data )
    {
        $( "#mseditsave" )
            .prop( "index", data.index );
        var i;
        for ( i in data.windows )
        {
            populateWin(
            {
                id: i
                , tabs: data.windows[ i ]
                , label: data.labels[ i ]
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
    } );
	$( "<div/>"
					, {
						// id: i
						 "class": "msmenu"
						, text: getMessage("Add to current window.")
						, mousedown: AddCurrentWindowSelect
					} ).hide();
}

function editSave()
{
    if ( !$( "#mseditsave" )
        .prop( "disabled" ) && $( "#mstitle" )
        .val() )
    {
        var now = new Date;
			now = now.getMinutes();
            //now = now.getDate() + "/" + ( now.getMonth() + 1 ) + "/" + ( now.getYear() + 1900 )+"_"+now.getHours()+":"+now.getMinutes();
			
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
            .val(), now, 0, editedSession.folderId );
        $.each( $( "#mseditsession .winWrapper" ), function( dataAndEvents
            , elem )
        {
			console.log("111", $, dataAndEvents, elem);
            var $elem = $( elem );
            var windows = $elem.attr( "winId" );
            $.each( $elem.find( ".mscheck" ), function( dataAndEvents
                , e )
            {
				console.log("222", $, dataAndEvents, e);
                if ( e.checked )
                {
                    var tab = e.tab;
					console.log(tab);
                    if ( tab )
                    {
                        self.addTab(
                        {
                            url: tab.url
                            , title: tab.title
                            , win: windows
							, pinned: tab.pinned
                        } );
                    }
                }
            } );
        } );
        var c = self.getCount();
        if ( c > 0 )
        {
            self.update( function( dataAndEvents )
                {
                    if ( dataAndEvents )
                    {
                        $( editedBlock )
                            .find( ".mssessiontitle" )
                            .text( self.title );
                        $( editedBlock )[ 0 ].sessionId = self.id;
                        $( editedBlock )
                            .find( ".mssessioncount" )
                            .text( getMessage( "tabsCount", [ c ] ) );
                        delete sessions[ editedSession.id ];
                        sessions[ self.sessionId ] = self;
                    }
                    else
                    {
                        alert( "Update faile, try again later." );
                    }
                }, $( "#mseditsave" )
                .prop( "index" ) );
        }
        else
        {
            remove(
            {
                target: editedBlock
            } );
        }
        editCancel();
        window.location.reload();
    }
}

function editCancel()
{
    $( "#mseditsession" )
        .animate(
        {
            left: "100%"
        }, 250, "swing", function()
        {
            $( "#mseditsession" )
                .hide();
            $( "#msrestorelist" )
                .show();
        } );
}

function editRemove()
{
    remove(
    {
        target: editedBlock
    } );
    editCancel();
}

function remove( e )
{
    var udataCur = "Are you sure to remove this sessions?";
    udataCur = getMessage( "confirmDeleteQuestion" );
    renderConfirmBox( udataCur, function( selfObj )
    {
        if ( selfObj )
        {
            var self = closest( e.target, "mssessionblock" );
            selfObj = sessions[ self.sessionId ];
            $( "#msrestorelist .mssessionblock" )
                .remove();
            if ( selfObj )
            {
                selfObj.remove( function()
                {
                    sessions.splice( self.sessionId, 1 );
                    createSessionList();
                } );
            }
        }
    } );
}

function renderConfirmBox( value, $sanitize )
{
    var container = $( "#msrestorebase" );
    var p = $( "<div>"
        , {
            "class": "confirmBox"
            , style: "display:none"
        } )
        .appendTo( container );
    p.fadeIn();
    container = $( "<div>"
    , {
        "class": "messageBox"
    } );
    container.html( value );
    container.appendTo( p );
    container = $( "<div>"
    , {
        "class": "confirmButton"
    } );
    container.html( getMessage( "confirm" ) );
    container.click( function()
    {
        $sanitize( true );
        p.remove();
    } );
    container.appendTo( p );
    container = $( "<div>"
    , {
        "class": "cancelButton"
    } );
    container.html( getMessage( "cancel" ) );
    container.click( function()
    {
        $sanitize( false );
        p.remove();
    } );
    container.appendTo( p );
}

function closest( el, type )
{
    for ( ; el && el.className.indexOf( type ) < 0; )
    {
        el = el.parentNode;
    }
    return el;
}

function saveToggle()
{
    var inputsPlugin = $( '#mssavelist input[type="checkbox"]' );
    if ( $( mssavetoggle )
        .prop( "checked" ) )
    {
        inputsPlugin.prop( "checked", true );
    }
    else
    {
        inputsPlugin.prop( "checked", false );
    }
    $( "#mssavebase .mscheck" )
        .change();
}

function exportSession( e )
{
    e = closest( e.target, "mssessionblock" );
    if ( e = sessions[ e.sessionId ] )
    {
        loadSessionFromId( e.folderId, function( deepDataAndEvents )
        {
            deepDataAndEvents = deepDataAndEvents.toJson();
            showExportedSessionAsText( deepDataAndEvents );
        } );
    }
}

function showExportedSessionAsText( deepDataAndEvents )
{
    $( "#sessionTextBoxTips" )
        .html( getMessage( "exportedSessionCopyTips" ) );
    $( "#importSessionBtn" )
        .hide();
    $( "#sessionTextBox" )
        .fadeIn();
    $( "#sessionTextBoxTextArea" )[ 0 ].value = deepDataAndEvents;
    $( "#sessionTextBoxTextArea" )[ 0 ].select();
}

function importSession()
{
    var s = $( "#sessionTextBoxTextArea" )
        .val();
    var model;
    try
    {
        var t = JSON.parse( s );
        model = new background.SessionData( t.title, t.date );
        t.tabs.forEach( function( scope )
        {
            model.addTab( scope );
        } );
    }
    catch ( d )
    {
        
		model = new background.SessionData;
        s = s.split( "\n" );
        t = new Date;
        
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
        var x = "";
        var u = "";
        var i = 0;
        for ( ; i < s.length; i++ )
        {
            if ( s[ i ].indexOf( "Name: " ) > -1 )
            {
                model.title = s[ i ].replace( "Name: ", "" ) ||
                    "imported session";
            }
            else
            {
                if ( s[ i ].indexOf( "Date: " ) > -1 )
                {
                    model.date = s[ i ].replace( "Date: ", "" ) || t;
                }
                else
                {
                    if ( s[ i ].indexOf( "Title: " ) > -1 )
                    {
                        x = s[ i ].replace( "Title: ", "" );
                    }
                    else
                    {
                        if ( s[ i ].indexOf( "Url: " ) > -1 )
                        {
                            u = s[ i ].replace( "Url: ", "" );
                        }
                    }
                }
            }
            if ( x != "" )
            {
                if ( u != "" )
                {
                    model.addTab(
                    {
                        url: u
                        , title: x
                        , win: "_win"
						
                    } );
                    x = u = "";
                }
            }
        }
    }
    model.save();
    $( "#sessionTextBox" )
        .fadeOut();
    window.close();
}

browser.storage.onChanged.addListener(InitSettings);

function showImportSessionBox()
{
    $( "#sessionTextBoxTips" )
        .html( getMessage( "importedSessionTips" ) );
    $( "#importSessionBtn" )
        .show();
    $( "#sessionTextBoxTextArea" )
        .val( "" );
    $( "#sessionTextBox" )
        .fadeIn();
    $( "#sessionTextBoxTextArea" )
        .focus();
}


$( document )
    .ready( function()
    {
        $( mssavebutton )
            .click( function()
            {
                save();
            } );
        $( mssavetoggle )
            .click( function()
            {
                saveToggle();
            } );
        $( mstitle )
            .keypress( function( deepDataAndEvents )
            {
                renameChange( deepDataAndEvents );
            } );
        $( mseditnewtoggle )
            .click( function()
            {
                var isChecked = $( this )
                    .prop( "checked" );
                $( '#mseditlist1 input[type="checkbox"]' )
                    .prop( "checked", isChecked );
                $( "#mseditsession .mscheck" )
                    .change();
            } );
        $( mseditsavedtoggle )
            .click( function()
            {
                var isChecked = $( this )
                    .prop( "checked" );
                $( '#mslistoriginal input[type="checkbox"]' )
                    .prop( "checked", isChecked );
                $( "#mseditsession .mscheck" )
                    .change();
            } );
        $( mseditsave )
            .click( function()
            {
                editSave();
            } );
        $( mseditcancel )
            .click( function()
            {
                editCancel();
            } );
        $( mseditremove )
            .click( function()
            {
                editRemove();
            } );
		$( msselecttab )
            .click( function()
            {
                AddCurrentWindowSelect();
            } );
        $( msrestoreicon2 )
            .click( function()
            {
                browser.tabs.create(
                {
                    url: "options.html"
                } );
				window.close();
            } );
        $( importBtn )
            .click( function()
            {
                showImportSessionBox();
            } );
        $( msrestorecrash )
            .click( function()
            {
                crashRestore();
            } );
        $( sessionTextBoxCloseBtn )
            .click( function()
            {
                $( sessionTextBox )
                    .fadeOut();
            } );
        $( importSessionBtn )
            .click( function()
            {
                importSession();
            } );
		$( importSessionBtnf )
            .click( function()
            {
				browser.tabs.create(
                {
                    url: "load.html"
                } );
				window.close();
            } );
        init();
    } );