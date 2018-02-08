function getMessage(a, b) {
    try {
        var c = browser.i18n.getMessage(a, b);
        if (c) return c
    } catch (d) {}
}

var S = {};

function save_options() {
    var a = $("#backupPeriod"),
        b = parseInt(a.val());
    isNaN(b) && (a.val(5), b = 5);
	var c = $("#AutoSavePeriod"),
        d = parseInt(c.val());
    isNaN(d) && (c.val(15), d = 15);
	var i = $("#AutoSaveNumber"),
        f = parseInt(i.val());
    isNaN(f) && (i.val(10), f = 10);
    (b < 1 || b > 999) && (d < 1 || d > 999) && (f < 1 || f > 999)? alert(getMessage("optionsBackupPeriodOutOfRange")) : (S.backupPeriod = b,
		S.AutoSavePeriod = d, S.AutoSaveNumber = f, S.crashRestore = $("#crashRestore")
        .prop("checked"), S.ShowAutoSave = $("#ShowAutoSave")
        .prop("checked"), S.AutoSave = $("#AutoSave")
        .prop("checked"), browser.extension.getBackgroundPage()
        .InitSettings(), $("#options-saved")
        .show(), S.dateFormat = $("#dateFormatSelect option:selected")
        .val(), a = $("input[name=popupSizeSelect]:checked")
        .val(), a == "1" ? delete localStorage.popupSize : localStorage.popupSize =
        a == "0.9" ? "0.9" : $("#customPopupSize")
        .val() / 100, S.editOrder = $(editOrder)
        .prop("checked"));
		
		console.log(S);
		browser.storage.local.set(
		{
		'settings':S
		});
		browser.extension.getBackgroundPage()
        .InitSettings();
		browser.extension.getBackgroundPage()
        .changeBackupSetting();
		console.log(S);
}

InitSettings().then(function () {
    restoreSetting();
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
				browser.extension.getBackgroundPage()
					.changeBackupSetting();
				console.log(S);
				resolve();
			});
			}
			catch (e)
			{
				console.log(e);
			}
			
			//console.log(S);
			//resolve();
		
	})
}

function restoreSetting() {
    S.crashRestore == true ? ($("#crashRestore")
        .prop("checked", !0), $("#backupPeriod")
        .prop("disabled", !1)) : ($("#crashRestore")
        .prop("checked", !1), $("#backupPeriod")
        .prop("disabled", !0));
	S.ShowAutoSave == true ? ($("#ShowAutoSave")
        .prop("checked", !0)) : ($("#ShowAutoSave")
        .prop("checked", !1));
	S.AutoSave == true ? ($("#AutoSave")
        .prop("checked", !0), $("#AutoSavePeriod")
        .prop("disabled", !1), $("#AutoSaveNumber")
		.prop("disabled", !1)): ($("#AutoSave")
        .prop("checked", !1), $("#AutoSavePeriod")
		.prop("disabled", !0), $("#AutoSaveNumber")
        .prop("disabled", !0));
    S.editOrder == false && $(editOrder)
        .prop("checked", !1);
    $("#backupPeriod")
        .val(S.backupPeriod ? S.backupPeriod : 5);
	$("#AutoSavePeriod")
        .val(S.AutoSavePeriod ? S.AutoSavePeriod : 15);
	$("#AutoSaveNumber")
        .val(S.AutoSaveNumber ? S.AutoSaveNumber : 10);
    $("#dateFormatSelect")
        .val(S.dateFormat || 1);
    if (localStorage.popupSize) {
        var a = localStorage.popupSize;
        a == "1" || a == "0.9" ? ($('input[name="popupSizeSelect"][value="' +
                a + '"]')
            .prop("checked", !0), $("#customPopupSize")
            .attr("disabled", "disabled")) : ($('input[name="popupSizeSelect"][value="custom"]')
            .prop("checked", !0), $("#customPopupSize")
            .val(a * 100))
    };
	// console.log(localStorage);
	// Settings = localStorage;
	// console.log(Settings);
	// browser.storage.local.set({AutoSavePeriod:localStorage.AutoSavePeriod});
}

function init() {
	//var Setting = {};
	//localStorage = browser.storage.local.get({Settings:localStorage});
    if (getMessage("optionsPageTitle")) document.title = getMessage("optionsPageTitle"), $("#pagetitle")
        .html(getMessage("optionsPageTitle")), $("#optionsEnableCrashRecovery")
        .html(getMessage("optionsEnableCrashRecovery")), $("#optionsBackupPeriod")
        .html(getMessage("optionsBackupPeriod")), $("#optionsDateFormat")
        .html(getMessage("optionsDateFormat")), $("#stringSave")
        .html(getMessage("save")), $("#options-saved")
        .html(getMessage("optionsSaved")), $("#supportUs")
        .html(getMessage("supportUs")), $("#stringMinutes")
        .html(getMessage("minutes")),
        $("#optionsNewUserTips")
        .html(getMessage("optionsNewUserTips")), $("#optionsPopupSize")
        .html(getMessage("popupSizeLabel")), $("#sizeWarning")
        .html(getMessage("sizeWarning")), $(optionsReorder)
        .html(getMessage("optionsReorder"));
	
    $("#crashRestore")
        .change(function() {
            $(this)
                .prop("checked") ? $("#backupPeriod")
                .prop("disabled", !1) : $("#backupPeriod")
                .prop("disabled", !0)
        });
	$("#AutoSave")
        .change(function() {
            $(this)
                .prop("checked") ? ($("#AutoSavePeriod")
                .prop("disabled", !1), $("#AutoSaveNumber")
				.prop("disabled", !1)) : ($("#AutoSavePeriod")
				.prop("disabled", !0), $("#AutoSaveNumber")
                .prop("disabled", !0))
        });
    $("input[name=popupSizeSelect]")
        .change(function() {
            var a = $('input[name="popupSizeSelect"]:checked')
                .val();
            a == "0.9" || a == "1" ? $("#customPopupSize")
                .prop("disabled", !0) : $("#customPopupSize")
                .prop("disabled", !1)
        });
	$( "#optionsEnableAutoSave" )
        .html( getMessage( "optionsEnableAutoSave" ) );
	$( "#stringMinutesAutoSave" )
        .html( getMessage( "stringMinutesAutoSave" ) );
	$( "#optionsShowAutoSave" )
        .html( getMessage( "optionsShowAutoSave" ) );
}

browser.storage.onChanged.addListener(InitSettings);

$(document)
    .ready(function() {
        init();
        InitSettings();
		console.log(localStorage);
        $(saveBtn)
            .click(function() {
                save_options()
            })
    });
