
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
    
    $("#newyear1").html(getMessage("newyear1"));
    
}

$(document)
    .ready(function() {
        init();
        
    });