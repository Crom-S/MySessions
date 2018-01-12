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

function renderList(key)
{
    var camelKey = loadPreviousSession(key);
    showCrashWindow(camelKey);
    $(".sessionLabel").css("color", "grey");
    $("#" + key).css("color", "green");
}

function init()
{
    document.title = getMessage("crashRestoreTitle");
    $(textBox).html(getMessage("restorePreviousSession"));
    var s = loadPreviousSession("prevSession");
    showCrashWindow(s);
    if (s)
    {
        if (s = getMessage("snapshotHint"))
        {
            $(snapshotHint).html(s);
        }
        s = $(sessionList);
        var i = 0;
        for (; i <= 10; i++)
        {
            if (localStorage["prevSession-" + i])
            {
                $("<span/>",
                {
                    "class": "sessionLabel",
                    text: " | Snapshot #" + (i + 1),
                    id: "prevSession-" + i,
                    click: function()
                    {
                        renderList(this.id);
                    }
                }).css("color", "grey").appendTo(s);
            }
        }
        $(".sessionLabel").css("color", "grey");
        $("#prevSession").click(function()
        {
            renderList(this.id);
        }).css("color", "green");
    }
    else
    {
        $(sessionList).hide();
        $(snapshotHint).hide();
    }
}

function loadPreviousSession(data)
{
    var self;
    var query = localStorage[data];
    if (!data || !query)
    {
        return null;
    }
    data = JSON.parse(query);
    var date = new Date;
    query = date.getMonth() + 1;
    var url = date.getDate();
    date = date.getFullYear();
    query = url + "/" + query + "/" + date;
    if (data.tabs)
    {
        self = new background.SessionData(data.title, query);
        data.tabs.forEach(function(added)
        {
            self.addTab(added);
        });
    }
    else
    {
        self = new background.SessionData(getMessage("restoreSessionOn"), query);
        $.each(data, function(subwin, data)
        {
            data.urls.forEach(function(post)
            {
                self.addTab(
                {
                    url: post.url,
                    title: post.title,
                    win: subwin
                });
            });
        });
    }
    self.created = data.created;
    return self;
}
var selectedSession;

function showCrashWindow(data)
{
    try
    {
        if ($(crashWindowBox).empty(), !data || data.getWinCount() <= 0)
        {
            $("<div/>",
            {
                html: getMessage("noSessionToRestore")
            }).appendTo($("#crashWindowBox"));
        }
        else
        {
            selectedSession = data;
            var radio = $("#crashWindowBox");
            var name = 1;
            var id;
            for (id in data.windows)
            {
                var element = $("<div/>",
                {
                    "class": "crashSessionDiv"
                }).appendTo(radio);
                var outer = $("<div/>",
                {
                    "class": "titleDiv"
                }).appendTo(element);
                $("<div/>",
                {
                    id: "window_" + name,
                    "class": "crashWindow",
                    html: getMessage("savedWindow", ["" + name])
                }).appendTo(outer);
                var inner = $("<div/>",
                {
                    "class": "buttonContainer"
                }).appendTo(outer);
                $("<div/>",
                {
                    id: "restoreSession_" + name,
                    html: getMessage("restoreSessionButton"),
                    "class": "sessionbutton",
                    winId: id,
                    title: getMessage("restoreSessionButtonDescription"),
                    click: function(e)
                    {
						console.log(e.button);
                        restoreCrashSession($(this).attr("winId"), e.button);
                    }
                }).appendTo(inner);
                var codeSegments = data.windows[id];
                var i = 0;
                for (; i < codeSegments.length; i++)
                {
                    try
                    {
                        var options = codeSegments[i];
                        var $element = $("<a/>",
                        {
                            "class": "tabbox",
                            href: options.url,
                            title: options.url,
                            target: "_blank"
                        }).appendTo(element);
                        $("<img/>",
                        {
                            src: "http://www.google.com/s2/favicons?domain_url=" + options.url
                        }).appendTo($element);
                        $("<span/>",
                        {
                            text: options.title ? options.title : options.url
                        }).appendTo($element);
                        if (options.pinned)
                        {
                            $("<img/>",
                            {
                                src: "/img/pin.png"
                            }).appendTo($element);
                        }
                    }
                    catch (m)
                    {
                        console.error("restore page render error", m);
                    }
                }
                $("<br/>").appendTo(radio);
                name++;
            }
            var d = data.date;
            if (data.created)
            {
                var now = new Date(parseInt(data.created));
                $("<div>",
                {
                    "class": "note",
                    text: "Snapshot taken at " + now.toLocaleString()
                }).appendTo(radio);
                d = now.getDate() + "/" + (now.getMonth() + 1) + "/" + (now.getYear() + 1900);
            }
            $("<div/>",
            {
                html: getMessage("saveSessionButton"),
                title: getMessage("saveSessionButtonDescription"),
                "class": "sessionbutton",
                click: function()
                {
                    var title = prompt(getMessage("enterSessionName"), getMessage("restoreSessionOn") + changeDateFormat(d));
                    if (title != null)
                    {
                        data.title = title;
                        data.save(function()
                        {
                            var pauseText = getMessage("sessionCreated", title) || 'Session "' + title + '" is created';
                            $(message).text(pauseText);
                        });
                    }
                }
            }).appendTo(radio);
            $("<span>",
            {
                id: "message"
            }).appendTo(radio);
        }
    }
    catch (bin)
    {
        console.error("showCrashWindow", bin);
        $("<div/>",
        {
            html: getMessage("noSessionToRestore")
        }).appendTo($("#crashWindowBox"));
    }
}

function changeDateFormat(step)
{
    var parts = step.split("/");
    switch (localStorage.dateFormat)
    {
        case "1":
            step = parts[0] + "/" + parts[1] + "/" + parts[2];
            break;
        case "2":
            step = parts[1] + "/" + parts[0] + "/" + parts[2];
            break;
        case "3":
            step = parts[2] + "-" + parts[1] + "-" + parts[0];
            break;
    }
    return step;
}

function restoreCrashSession(fmt, err)
{
    console.log(fmt, err);
    if (selectedSession)
    {
        try
        {
            var i = selectedSession.windows[fmt];
            if (i)
            {
                var ret = [];
                var elems = [];
                i.forEach(function(v)
                {
                    if (v.pinned)
                    {
                        elems.push(v);
                    }
                    else
                    {
                        ret.push(v);
                    }
                });
                if (elems.length > 0)
                {
                    ret = ret.concat(elems);
                }
                if (err == 0)
                {
                    browser.windows.getLastFocused(function(opts)
                    {
                        browser.windows.create(
                        {
                            url: ret[0].url,
                            width: opts.width,
                            height: opts.height
                        }, function(tab)
                        {
							loop(1, ret.length,100); 
         
							function loop(i, l, interval) 
							{      
								setTimeout(
									function() 
									{  
										browser.tabs.create(
										{
											active: false,
											windowId: tab.id,
											url: ret[i].url,
											pinned: ret[i].pinned ? true : false
										});   
										i = i + 1; //     
										if (i < l) { // 
											loop(i, l, interval);
										}
									}, interval);
							}
                            // var i = 1;
                            // for (; i < ret.length; i++)
                            // {
                                // browser.tabs.create(
                                // {
									// active: false,
                                    // windowId: tab.id,
                                    // url: ret[i].url,
                                    // pinned: ret[i].pinned ? true : false
                                // });
                            // }
                        });
                    });
                }
                else
                {
                    if (err == 1)
                    {
						loop(0, ret.length,100); 
         
							function loop(i, l, interval) 
							{      
								setTimeout(
									function() 
									{  
										browser.tabs.create(
										{
											active: false,
											url: ret[i].url,
											pinned: ret[i].pinned ? true : false
										});   
										i = i + 1; //     
										if (i < l) { // 
											loop(i, l, interval);
										}
									}, interval);
							}
                        // i = 0;
                        // for (; i < ret.length; i++)
                        // {
                            // browser.tabs.create(
                            // {
								// active: false,
                                // url: ret[i].url,
                                // pinned: ret[i].pinned ? true : false
                            // });
                        // }
                    }
                }
            }
        }
        catch (consoleText)
        {
            console.error(consoleText);
        }
    }
}
$(document).ready(function()
{
    init();
});