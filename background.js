var S = {};

browser.runtime.onInstalled.addListener(function () {
    browser.tabs.create({
        url: "logo.html"
    });
});

function SessionData(mstitle, msdate, mstabsCount, msfolderId)
{
    this.title = mstitle;
    this.date = msdate;
    this.urls = [];
    this.tabsCount = mstabsCount;
    this.folderId = msfolderId;
    this.windows = {};
    this.labels = {};
}
SessionData.prototype = {
    addTab: function(tab)
    {
        try
        {
            this.windows[tab.win] = this.windows[tab.win] || [];
			//console.log(tab);
			//Исправляю данные заголовка\адреса для совместимости LOS и TS
			tab = ITitleUrl(tab);
			console.log(tab);
			if (tab.pinned)
            {
                tab.title = tab.title+"&&"+"pinned";

            }
			//console.log(tab);
            var options = {
                title: tab.title,
                url: tab.url
            };
            if (tab.pinned)
            {
                options.pinned = true;

            }
            this.windows[tab.win].push(options);
            this.tabsCount++;
			//console.log(this.windows[tab.win]);
        }
        catch (fmt)
        {
            console.error(fmt);
        }
    },
    addWinLabel: function(k, val)
    {
        this.labels[k] = val;
    },
    getWinCount: function()
    {
        var getWinCount = 0;
        var windows;
        for (windows in this.windows)
        {
            getWinCount += 1;
        }
        return getWinCount;
    },
    getCount: function()
    {
        var sum = 0;
        var index;
        for (index in this.windows)
        {
            sum += this.windows[index].length;
            console.log("getCount" + sum);
        }
        return this.tabsCount = sum;
    },
    save: function(values, index)
    {
		var self = this;
        getSessionFolder(function(parentId)
        {
            console.log(self.title + " (" + self.date + ")--" + self.getCount() + "tabs");
			console.log("Создаем папку SAVE");
            browser.bookmarks.create(
            {
                parentId: parentId,
                index: index || 0,
                title: self.title + " (" + self.date + ")--" + self.getCount() + "tabs"
            }, function(resp)
            {
				console.log(resp);
                if (resp)
                {
                    self.folderId = resp.id;
                    resp = [];
                    var d;
                    for (d in self.windows)
                    {
                        resp.push(d);
                    }
                    self.saveWindow(resp, function()
                    {

                    });
                }
                else
                {
                    if (values)
                    {
                        values(false);
                    }
                }
            });
        });
    },
    saveWindow: function(args, fn)
    {
        if (args.length == 0)
        {
            fn();
        }
        else
        {
            var jQuery = this;
            var i = args.pop();
            browser.bookmarks.create(
            {
                parentId: this.folderId,
                index: 0,
                title: "window " + i
            }, function(err)
            {
                var nTokens = jQuery.windows[i].length;
                var ti = 1;
                for (; ti < nTokens + 1; ++ti)
                {
					//console.log(jQuery.windows[i]);
					console.log(jQuery.windows[i][nTokens - ti].title);
                    browser.bookmarks.create(
                    {
						//
                        parentId: err.id,
                        title: jQuery.windows[i][nTokens - ti].title,
                        url: jQuery.windows[i][nTokens - ti].url,
                    });
                }
                jQuery.saveWindow(args, fn);
                
            });
        }
    },
    update: function(atts, ms)
    {
        var self = this;
        browser.bookmarks.removeTree(this.folderId, function()
        {
            self.save(atts, S.editOrder == "false" ? ms : 0);
        });
    },
    remove: function(keepData)
    {
		browser.bookmarks.removeTree(this.folderId, keepData);
    },
    open: function(method)
    {
		
        if (this.getWinCount() == 1 && method == 1)
        {
            var j;
            for (j in this.windows)
            {
                var dep = this.windows[j];
                //j = 0;
			}
			console.log(dep);
			//Добавляю свойство прикрепления из заголовка
					var j = 0;
					for (; j < dep.length; j++)
					{
						arr = dep[j].title.split("&&")
						if (arr[1] == "pinned")
						{
							dep[j].pinned = true;
						}
						else
						{
							dep[j].pinned = false;
						}
					}
					//Сортирую вкладки
					var ret = [];
					var elems = [];
					dep.forEach(function(v)
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
					console.log(ret);
                    //var req = ret.shift();
					//console.log(req);
				loop(0, ret.length,100);
				function loop(i, l, interval) 
					{      
						setTimeout(
							function() 
							{  
								console.log(ret);
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
					};
					

            
        }
		else if (this.getWinCount() == 1 && method == 3)
        {
            var i;
            for (i in this.windows)
            {
                var dep = this.windows[i];
			}
			console.log(dep);
			//Добавляю свойство прикрепления из заголовка
					var j = 0;
					for (; j < dep.length; j++)
					{
						arr = dep[j].title.split("&&")
						if (arr[1] == "pinned")
						{
							dep[j].pinned = true;
						}
						else
						{
							dep[j].pinned = false;
						}
					}
					//Сортирую вкладки
					var ret = [];
					var elems = [];
					dep.forEach(function(v)
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
					console.log(ret);
                i = 0;
                for (; i < ret.length; i++)
                {
                    console.log(ret[i].url);
                    browser.tabs.create(
                    {
						active: false,
						url: ret[i].url,
						pinned: ret[i].pinned ? true : false
                    });
                    //setTimeout(console.log(dep[i].url), 1000);
                }
            
        }
        else
        {
            var replies = [];
            for (dep in this.windows)
            {
                replies.push(this.windows[dep]);
                console.log(replies[0][0]);
            }
            var save = function(replies, callback, value, errorCB)
            {
                if (replies.length == 0)
                {
                    errorCB();
                }
                else
                {
                    var fns = replies.shift();
					console.log(fns);
					
					//Добавляю свойство прикрепления из заголовка
					var i = 0;
					for (; i < fns.length; i++)
					{
						arr = fns[i].title.split("&&")
						if (arr[1] == "pinned")
						{
							fns[i].pinned = true;
						}
						else
						{
							fns[i].pinned = false;
						}
					}
					//Сортирую вкладки
					var ret = [];
					var elems = [];
					fns.forEach(function(v)
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
					console.log(ret);
                    var req = ret.shift();
					console.log(req);
                    try
                    {
                        if (req.url == "about:newtab" || (req.url == "about:config" || (req.url == "about:addons" || req.url == "about:debugging")))
                        {
                            req.url = null;
                        }
                        console.log(req.url);
                        browser.windows.create(
                        {
                            url: req.url,
                            state: callback,
                            type: value
                        }, function(tab)
                        {
							if ( method == 2)
							{
								ret.forEach(function(req)
								{
									browser.tabs.create(
									{
										active: false,
										windowId: tab.id,
										url: req.url,
										pinned: req.pinned ? true : false
									});
								});
							}
							else
							{

							loop(0, ret.length,100); 
         
							function loop(i, l, interval) 
							{      
								setTimeout(
									function() 
									{  
										console.log(fns);
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
							}
                            save(replies, callback, value, errorCB);
                        });
                    }
                    catch (m)
                    {
                        console.error("Fail to create window", m);
                    }
                }
            };
            browser.windows.getAll(
            {
                populate: false
            }, function(failures)
            {
                var modals = [];
                var value;
                var restoreScript;
                failures.forEach(function(attrs)
                {
                    if (attrs.focused)
                    {
						console.log(attrs);
                        value = attrs.type;
                        restoreScript = attrs.state;
                    }
                    modals.push(attrs.id);
                });
                save(replies, restoreScript, value, function()
                {
                    if (method == 1)
                    {
                        modals.forEach(function(key)
                        {
                            browser.windows.remove(key);
                        });
                    }
                });
            });
        }
		
    },
    toJson: function()
    {
        var data = {
            title: this.title,
            date: this.date,
            tabs: []
        };
        var index;
        for (index in this.windows)
        {
            this.windows[index].forEach(function(tab)
            {
                var options = {
                    title: tab.title,
                    url: tab.url,
                    win: index
                };
                if (tab.pinned)
                {
                    options.pinned = true;
                }
                data.tabs.push(options);
            });
        }
        data.created = (new Date).getTime();
        return JSON.stringify(data);
    }
};

function openDelayed(methods, method)
{
    setTimeout(function()
    {
        methods.open(method);
    }, 300);
}

function ITitleUrl(tab)
{
	//var tab1;
	if (tab.url == "about:blank")
	{
		tab.url = "http://" + tab.title;
	}
	if (tab.url.indexOf("/data/suspend/index.html?title") > -1)
	{
		var search = {};
			try {
				search = tab.url
					.substr(1)
					.split('&')
					.map(s => s.split('=')
						.map(s => decodeURIComponent(s)))
					.reduce((p, c) => {
						p[c[0]] = c[1];
						console.log(p);
						return p;
						
					}, {});
			} catch (e) 
			{
				console.log(e);
			}
			tab.title = search.title || tab.title;
			tab.url = search.url || '...';
    }
	if (tab.url.indexOf("/replaced/replaced.html?state=redirect") > -1)
	{
		console.log(tab.url);
		var search = {};
			try {
				search = tab.url
					.substr(1)
					.split('&')
					.map(s => s.split('=')
						.map(s => decodeURIComponent(s)))
					.reduce((p, c) => {
						p[c[0]] = c[1];
						console.log(p);
						return p;
						
					}, {});
			} catch (e) 
			{
				console.log(e);
			}
			console.log(tab);
			tab.title = search.title || tab.title;
			tab.url = search.url || '...';
    }
	return tab;
	
}


function init()
{
	//var Setting = {};
	//console.log(localStorage);
	//Setting = browser.storage.local.get();
	//console.log(Setting);
    try
    {
        if (localStorage.currentSession && localStorage.prevSession != localStorage.currentSession)
        {
            var param = 8;
            for (; param >= 0; param--)
            {
                var gdriveLastChangeId = localStorage["prevSession-" + param];
                console.log(localStorage.prevSession);
                if (gdriveLastChangeId)
                {
                    localStorage["prevSession-" + (param + 1)] = gdriveLastChangeId;
                }
            }
            if (localStorage.prevSession)
            {
                localStorage["prevSession-0"] = localStorage.prevSession;
            }
            var files = JSON.parse(localStorage.currentSession);
            localStorage.prevSession = JSON.stringify(files);
			console.log(localStorage.prevSession);
        }
    }
    catch (fmt)
    {
        console.error(fmt);
    }
    try
    {
        if (!localStorage.welcomeshown && !localStorage.updateread)
        {
            browser.bookmarks.getTree(function(el)
            {
                browser.bookmarks.getChildren(el[0].children[2].id, function(todos)
                {
                    var fmt;
                    var i = 0;
                    for (; i < todos.length; ++i)
                    {
                        if (todos[i].title == "MySessions")
                        {
                            fmt = todos[i].id;
                            console.log(fmt);
                            break;
                        }
                    }
                });
            });
        }
    }
    catch (e)
    {
		console.log(e);
	}
	InitSettings();
    //changeBackupSetting();
	console.log(S);
    if (param = localStorage.popupSize)
    {
        if (param.replace("%", "") > 1)
        {
            localStorage.popupSize = parseInt(param) / 100;
        }
    }
}

InitSettings().then(function () {
    changeBackupSetting();
	console.log(S);
});

function SetDef()
{
	var S = {};
	S.backupPeriod = 5;
	S.AutoSavePeriod = 15;
	S.AutoSaveNumber = 10;
	S.crashRestore = true;
	S.ShowAutoSave = true;
	S.AutoSave = true;
	S.dateFormat = "1";
	S.editOrder = true;
	console.log(S);
		browser.storage.local.set(
		{
		'settings':S
		});
	return S;
}

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
				if (S == undefined) S = SetDef();
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


var backupTimerId;
var AutoSaveTimerId;


function changeBackupSetting()
{
	
	//S = InitSettings(S);
	console.log(S);
	console.log("S.crashRestore",S.crashRestore);
    if (S.crashRestore == undefined)
    {
        S.crashRestore = true;
    }
	if (S.ShowAutoSave == undefined)
    {
        S.ShowAutoSave = true;
    }
    if (S.crashRestore == true)
    {
        window.clearInterval(backupTimerId);
        var secs = parseInt(S.backupPeriod);
        if (isNaN(secs) || (secs < 1 || secs > 1E3))
        {
            secs = 5;
        }
        backupTimerId = window.setInterval(saveBackupSession, 6E4 * secs);
    }
    else
    {
		console.log("S.crashRestore",S.crashRestore);
        try
        {
            delete localStorage.currentSession;
            window.clearInterval(backupTimerId);
        }
        catch (fmt)
        {
            console.error(fmt);
        }
    }
	if (S.AutoSave == true)
    {
		console.log("S.AutoSave", S.AutoSave, S.AutoSavePeriod);
        window.clearInterval(AutoSaveTimerId);
        var secs1 = parseInt(S.AutoSavePeriod);
        if (isNaN(secs1) || (secs1 < 1 || secs1 > 1E3))
        {
            secs1 = 15;
        }
        AutoSaveTimerId = window.setInterval(asave, 6E4 * secs1);
    }
    else
    {
		console.log("S.AutoSave",S.AutoSave);
        try
        {
            delete localStorage.currentSession;
            window.clearInterval(AutoSaveTimerId);
        }
        catch (fmt)
        {
            console.error(fmt);
        }
    }
}


function initSession(next)
{
    getSessionFolder(function(rootElement)
    {
        browser.bookmarks.getChildren(rootElement, function(tabs)
        {
            var responseObject = [];
            var i = 0;
            for (; i < tabs.length; i++)
            {
                var tags = tabs[i].title.match(/^(.*)\((\d+\/\d+\/\d+\_\d+\:\d+)\)--(\d+)tabs$/i);
				if (tags == null)
				{
					tags = tabs[i].title.match(/^(.*)\((\d+\/\d+\/\d+)\)--(\d+)tabs$/i )
				}
				//console.log(tags);
                if (tabs[i].url != null)
                {
                    //console.log("Error: Not a sessions folder:" + tabs[i].title);
                }
                else
                {
                    try
                    {
                        sessionData = new SessionData(tags[1].trim(), tags[2], tags[3], tabs[i].id);
                        responseObject.push(sessionData);
                    }
                    catch (l)
                    {
                        console.log("Error: wrong session format:" + tabs[i].title);
                    }
                }
            }
			console.log("Инит Сесс");
            next(responseObject);
        });
    });
}

function getSession(item, cb)
{
    browser.bookmarks.get(item, function(results)
    {
        //var d = results[0].title.match(/^(.*) \((\d+\/\d+\/\d+)\)--(\d+)tabs$/i);
		var d = results[0].title.match(/^(.*)\((\d+\/\d+\/\d+\_\d+\:\d+)\)--(\d+)tabs$/i);
				if (d == null)
				{
					d = results[0].title.match(/^(.*)\((\d+\/\d+\/\d+)\)--(\d+)tabs$/i )
				}
        sessionData = new SessionData(d[1], d[2], d[3], results[0].id);
        browser.bookmarks.getChildren(item, function(tabs)
        {
            var i = 0;
            for (; i < tabs.length; i++)
            {
                if (tabs[i].url)
                {
                    sessionData.urls.push(
                    {
                        id: tabs[i].id,
                        url: tabs[i].url,
                        title: tabs[i].title
                    });
                }
            }
            cb(sessionData);
        });
    });
}

function restoreSession(rootElement, dataAndEvents)
{
    browser.bookmarks.getChildren(rootElement, function(codeSegments)
    {
        var resultItems = [];
        var i = 0;
        for (; i < codeSegments.length; i++)
        {
            if (codeSegments[i].url)
            {
                resultItems.push(codeSegments[i].url);
            }
        }
        if (dataAndEvents == 0)
        {
            browser.windows.getLastFocused(function(opts)
            {
				console.log(opts);
                browser.windows.create(
                {
                    url: resultItems[0],
                    state: opts.state,
                    type: opts.type
                }, function(tab)
                {
                    var i = 1;
                    for (; i < resultItems.length; i++)
                    {
                        browser.tabs.create(
                        {
							active: false,
                            windowId: tab.id,
                            url: resultItems[i]
                        });
                    }
                });
            });
        }
        else
        {
            if (dataAndEvents == 1)
            {
                i = 0;
                for (; i < resultItems.length; i++)
                {
                    browser.tabs.create(
                    {
						active: false,
                        url: resultItems[i]
                    });
                }
            }
        }
    });
}

function bookmarkPositionWorkaround()
{
    setTimeout(function()
    {
        var otherBookmarksID = 0;
			chrome.bookmarks.getTree(function(tree){
			otherBookmarksID = tree[0].children[2].id;
			console.log(tree);
		}); 
		browser.bookmarks.getChildren('unfiled_____', function(fmt)
        {
            console.log(fmt);
            browser.bookmarks.create(
            {
                parentId: fmt[0].id,
                url: "http://www.example.com"
            }, function(cmp)
            {
                console.log("Reposition default folder");
                browser.bookmarks.remove(cmp.id);
				console.log(cmp.id);
            });
        });
    }, 2E3);
}

function updateSession(data, cb)
{
    browser.bookmarks.getChildren(data.folderId, function(employees)
    {
        browser.bookmarks.update(data.folderId,
        {
            title: data.title + " (" + data.date + ")--" + data.urls.length + "tabs"
        });
        var i = 0;
        for (; i < employees.length; ++i)
        {
            browser.bookmarks.remove(employees[i].id);
        }
        i = 0;
        for (; i < data.urls.length; ++i)
        {
            browser.bookmarks.create(
            {
                parentId: data.folderId,
                title: data.urls[i].title,
                url: data.urls[i].url
            });
        }
        cb();
    });
}

function getSessionFolder($sanitize)
{
    var modId;
    var id;
        browser.bookmarks.getChildren('unfiled_____', function(todos)
        {
            var i = 0;
            for (; i < todos.length; i++)
            {
				console.log(modId,i,todos[i].title);
                if (todos[i].title == "MySessions")
                {
                    modId = todos[i].id;
					console.log(modId,i,todos[i].title);
                    break;
                }
            }
            if (modId == null)
            {
				console.log("Создали папку Сессии");
                browser.bookmarks.create(
                {
                    parentId: id,
                    title: "MySessions"
                }, function(map)
                {
                    modId = map.id;
                    $sanitize(modId);
                });
            }
            else
            {
                $sanitize(modId);
            }
        });

}

function saveBackupSession()
{
	console.log("Сохраняем бэк");
	console.log(S);
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
    var model = new SessionData("currentSession", now);
    browser.windows.getAll(
    {
        populate: true
    }, function(failures)
    {
        failures.forEach(function(win)
        {
            win.tabs.forEach(function(tab)
            {
                model.addTab(
                {
                    url: tab.url,
                    title: tab.title,
                    win: win.id,
                    pinned: tab.pinned
                });
            });
        });
        if (model.getCount() > 0)
        {
            localStorage.currentSession = model.toJson();
        }
    });
	//changeBackupSetting();
}

function listSession()
{
	var modId;
    var id;
        browser.bookmarks.getChildren('unfiled_____', function(todos)
        {
            var i = 0;
            for (; i < todos.length; i++)
            {
				console.log(modId,i,todos[i].title);
                if (todos[i].title == "MySessions")
                {
                    modId = todos[i].id;
					console.log(modId,i,todos[i].title);
                    break;
                }
            }
			console.log(modId);
        browser.bookmarks.getChildren(modId, function(tabs)
        {
            var responseObject = [];
			var del = [];
            var i = 0;
            for (; i < tabs.length; i++)
            {
                //var tags = tabs[i].title.match(/^(.*)\((\d+\/\d+\/\d+)\)--(\d+)tabs$/i);
				var tags = tabs[i].title.match(/^(.*)\((\d+\/\d+\/\d+\_\d+\:\d+)\)--(\d+)tabs$/i);
				if (tags == null)
				{
					tags = tabs[i].title.match(/^(.*)\((\d+\/\d+\/\d+)\)--(\d+)tabs$/i )
				}
                if (tabs[i].url != null)
                {
                    console.log("Error: Not a sessions folder:" + tabs[i].title);
                }
                else
                {
                    try
                    {
                        sessionData = new SessionData(tags[1].trim(), tags[2], tags[3], tabs[i].id);
                        responseObject.push(sessionData);
						if (~tags[1].indexOf("AutoSave_"))
						{
							del.push(tabs[i].id);
						}
                    }
                    catch (l)
                    {
                        console.log("Error: wrong session format:" + tabs[i].title);
                    }
                }
            }
			console.log(responseObject);
			console.log(del[1]);
			console.log(del.length);
			console.log(S.AutoSaveNumber);
			if (del.length > S.AutoSaveNumber)
			{
				i = 1;
				for (;i < (del.length-S.AutoSaveNumber+2); i++)
				{
					browser.bookmarks.removeTree(del[del.length-i]);
				}
			}
        });
		});
    
	//getSessionFolder(function(rootElement)
    //{
		
    //});
	
    //return responseObject;
}

function fsave()
{
	qsave("Quick save");
	
}
//Автосохранение
function asave()
{
	var sessions = [];
	var now = new Date;
    now = now.getHours() + ":" +  now.getMinutes();
	qsave("AutoSave"+"_"+now);
	
	listSession();

	
}


function qsave(name)
{
    
        var name = name;
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
            var that = new SessionData( name, now );
            failures.forEach( function( win )
            {
                win.tabs.forEach( function( tab )
                {

                    that.addTab(
                        {
                            url: tab.url
                                , title: tab.title
                                , win: win.id
								, pinned: tab.pinned
                            } );
                        
                    
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
						cons.log(dataAndEvents);
                        if ( !dataAndEvents )
                        {
                            alert( getMessage( "saveFail" ) );
                        }
                    } );
                }
            }
            
        } );
		
    
}


function CloseTab()
{
	console.log(localStorage.tab0);
	setTimeout(browser.tabs.remove(parseInt(localStorage.tab0, 10)), 5000);
}

//Убрал иконку из адресной строки
// function initializePageAction(tab) {

    // browser.pageAction.setIcon({tabId: tab.id, path: "img/icon16.png"});
    // browser.pageAction.setTitle({tabId: tab.id, title: "MySessions"});
    // browser.pageAction.show(tab.id);

// }


// var gettingAllTabs = browser.tabs.query({});
// gettingAllTabs.then((tabs) => {
  // for (let tab of tabs) {
    // initializePageAction(tab);
  // }
// });



// browser.pageAction.onClicked.addListener(fsave);
// browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  // initializePageAction(tab);
// });

browser.storage.onChanged.addListener(InitSettings);

window.addEventListener('storage', function(e) {  
 console.log('Woohoo, someone changed my localstorage va another tab/window!');
});


init();