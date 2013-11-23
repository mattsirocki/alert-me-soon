;(function ($, window, document, undefined) {

// Helper Class for Handlebars Template
var ValueName = function(value, name)
{
    this.value = value;
    this.name  = name;
}

// Set AlertMeSoon in Global Namespace
var AlertMeSoon = window.AlertMeSoon = {};

// Load Template via AJAX
$.get('resources/template.html', function(data) {AlertMeSoon.template = Handlebars.compile(data);});

AlertMeSoon.debug = true;
AlertMeSoon.current_id = 0;

AlertMeSoon.colors =
[
    //new ValueName('purple',  'Purple'),
    new ValueName('',        'Random'),
    new ValueName('#EFDECD', 'Almond'),
    new ValueName('#CD9575', 'Antique Brass'),
    new ValueName('#FDD9B5', 'Apricot'),
    new ValueName('#78DBE2', 'Aquamarine'),
    new ValueName('#87A96B', 'Asparagus'),
    new ValueName('#FFA474', 'Atomic Tangerine'),
    new ValueName('#FAE7B5', 'Banana Mania'),
    new ValueName('#9F8170', 'Beaver'),
    new ValueName('#FD7C6E', 'Bittersweet'),
    new ValueName('#000000', 'Black'),
    new ValueName('#ACE5EE', 'Blizzard Blue'),
    new ValueName('#1F75FE', 'Blue'),
    new ValueName('#A2A2D0', 'Blue Bell'),
    new ValueName('#6699CC', 'Blue Gray'),
    new ValueName('#0D98BA', 'Blue Green'),
    new ValueName('#7366BD', 'Blue Violet'),
    new ValueName('#DE5D83', 'Blush'),
    new ValueName('#CB4154', 'Brick Red'),
    new ValueName('#B4674D', 'Brown'),
    new ValueName('#FF7F49', 'Burnt Orange'),
    new ValueName('#EA7E5D', 'Burnt Sienna'),
    new ValueName('#B0B7C6', 'Cadet Blue'),
    new ValueName('#FFFF99', 'Canary'),
    new ValueName('#00CC99', 'Caribbean Green'),
    new ValueName('#FFAACC', 'Carnation Pink'),
    new ValueName('#DD4492', 'Cerise'),
    new ValueName('#1DACD6', 'Cerulean'),
    new ValueName('#BC5D58', 'Chestnut'),
    new ValueName('#DD9475', 'Copper'),
    new ValueName('#9ACEEB', 'Cornflower'),
    new ValueName('#FFBCD9', 'Cotton Candy'),
    new ValueName('#FDDB6D', 'Dandelion'),
    new ValueName('#2B6CC4', 'Denim'),
    new ValueName('#EFCDB8', 'Desert Sand'),
    new ValueName('#6E5160', 'Eggplant'),
    new ValueName('#CEFF1D', 'Electric Lime'),
    new ValueName('#71BC78', 'Fern'),
    new ValueName('#6DAE81', 'Forest Green'),
    new ValueName('#C364C5', 'Fuchsia'),
    new ValueName('#CC6666', 'Fuzzy Wuzzy'),
    new ValueName('#E7C697', 'Gold'),
    new ValueName('#FCD975', 'Goldenrod'),
    new ValueName('#A8E4A0', 'Granny Smith Apple'),
    new ValueName('#95918C', 'Gray'),
    new ValueName('#1CAC78', 'Green'),
    new ValueName('#1164B4', 'Green Blue'),
    new ValueName('#F0E891', 'Green Yellow'),
    new ValueName('#FF1DCE', 'Hot Magenta'),
    new ValueName('#B2EC5D', 'Inchworm'),
    new ValueName('#5D76CB', 'Indigo'),
    new ValueName('#CA3767', 'Jazzberry Jam'),
    new ValueName('#3BB08F', 'Jungle Green'),
    new ValueName('#FEFE22', 'Laser Lemon'),
    new ValueName('#FCB4D5', 'Lavender'),
    new ValueName('#FFF44F', 'Lemon Yellow'),
    new ValueName('#FFBD88', 'Macaroni and Cheese'),
    new ValueName('#F664AF', 'Magenta'),
    new ValueName('#AAF0D1', 'Magic Mint'),
    new ValueName('#CD4A4C', 'Mahogany'),
    new ValueName('#EDD19C', 'Maize'),
    new ValueName('#979AAA', 'Manatee'),
    new ValueName('#FF8243', 'Mango Tango'),
    new ValueName('#C8385A', 'Maroon'),
    new ValueName('#EF98AA', 'Mauvelous'),
    new ValueName('#FDBCB4', 'Melon'),
    new ValueName('#1A4876', 'Midnight Blue'),
    new ValueName('#30BA8F', 'Mountain Meadow'),
    new ValueName('#C54B8C', 'Mulberry'),
    new ValueName('#1974D2', 'Navy Blue'),
    new ValueName('#FFA343', 'Neon Carrot'),
    new ValueName('#BAB86C', 'Olive Green'),
    new ValueName('#FF7538', 'Orange'),
    new ValueName('#FF2B2B', 'Orange Red'),
    new ValueName('#F8D568', 'Orange Yellow'),
    new ValueName('#E6A8D7', 'Orchid'),
    new ValueName('#414A4C', 'Outer Space'),
    new ValueName('#FF6E4A', 'Outrageous Orange'),
    new ValueName('#1CA9C9', 'Pacific Blue'),
    new ValueName('#FFCFAB', 'Peach'),
    new ValueName('#C5D0E6', 'Periwinkle'),
    new ValueName('#FDDDE6', 'Piggy Pink'),
    new ValueName('#158078', 'Pine Green'),
    new ValueName('#FC74FD', 'Pink Flamingo'),
    new ValueName('#F78FA7', 'Pink Sherbert'),
    new ValueName('#8E4585', 'Plum'),
    new ValueName('#7442C8', 'Purple Heart'),
    new ValueName('#9D81BA', 'Purple Mountain’s Majesty'),
    new ValueName('#FE4EDA', 'Purple Pizzazz'),
    new ValueName('#FF496C', 'Radical Red'),
    new ValueName('#D68A59', 'Raw Sienna'),
    new ValueName('#714B23', 'Raw Umber'),
    new ValueName('#FF48D0', 'Razzle Dazzle Rose'),
    new ValueName('#E3256B', 'Razzmatazz'),
    new ValueName('#EE204D', 'Red'),
    new ValueName('#FF5349', 'Red Orange'),
    new ValueName('#C0448F', 'Red Violet'),
    new ValueName('#1FCECB', 'Robin’s Egg Blue'),
    new ValueName('#7851A9', 'Royal Purple'),
    new ValueName('#FF9BAA', 'Salmon'),
    new ValueName('#FC2847', 'Scarlet'),
    new ValueName('#76FF7A', 'Screamin’ Green'),
    new ValueName('#93DFB8', 'Sea Green'),
    new ValueName('#A5694F', 'Sepia'),
    new ValueName('#8A795D', 'Shadow'),
    new ValueName('#45CEA2', 'Shamrock'),
    new ValueName('#FB7EFD', 'Shocking Pink'),
    new ValueName('#CDC5C2', 'Silver'),
    new ValueName('#80DAEB', 'Sky Blue'),
    new ValueName('#ECEABE', 'Spring Green'),
    new ValueName('#FFCF48', 'Sunglow'),
    new ValueName('#FD5E53', 'Sunset Orange'),
    new ValueName('#FAA76C', 'Tan'),
    new ValueName('#18A7B5', 'Teal Blue'),
    new ValueName('#EBC7DF', 'Thistle'),
    new ValueName('#FC89AC', 'Tickle Me Pink'),
    new ValueName('#DBD7D2', 'Timberwolf'),
    new ValueName('#17806D', 'Tropical Rain Forest'),
    new ValueName('#DEAA88', 'Tumbleweed'),
    new ValueName('#77DDE7', 'Turquoise Blue'),
    new ValueName('#FFFF66', 'Unmellow Yellow'),
    new ValueName('#926EAE', 'Violet (Purple'),
    new ValueName('#324AB2', 'Violet Blue'),
    new ValueName('#F75394', 'Violet Red'),
    new ValueName('#FFA089', 'Vivid Tangerine'),
    new ValueName('#8F509D', 'Vivid Violet'),
    //new ValueName('#FFFFFF', 'White'),
    new ValueName('#A2ADD0', 'Wild Blue Yonder'),
    new ValueName('#FF43A4', 'Wild Strawberry'),
    new ValueName('#FC6C85', 'Wild Watermelon'),
    new ValueName('#CDA4DE', 'Wisteria'),
    new ValueName('#FCE883', 'Yellow'),
    new ValueName('#C5E384', 'Yellow Green'),
    new ValueName('#FFAE42', 'Yellow Orange'),
];

AlertMeSoon.types =
[
    'Custom',
];

AlertMeSoon.type_durations =
{
    'Custom':  [10, 1, -1],
};

//
// Global API
//

AlertMeSoon.add = function(template)
{
    var a = new Alert();

    $('body').append(template({alert: a, colors: this.colors, types: this.types}));

    a.initialize();
}

AlertMeSoon.add_type = function(name, duration, repeat_buffer, repeat_for)
{
    AlertMeSoon.types.push(name);
    AlertMeSoon.type_durations[name] = [duration, repeat_buffer, repeat_for];
};

//
// Attach Automatic Add Listener
//

$(document).ready(function()
{
    $('#add-alert').on('click', function(e) {AlertMeSoon.add(AlertMeSoon.template);});
});

//
// Alert Class
//

var Alert = function()
{
    this.id = 'alert-' + AlertMeSoon.current_id++;

    // Timer
    this.interval     = undefined; // setInterval Return
    this.finish       = undefined; // Finish Target
    this.remaining    = undefined; // Seconds Remaining
    this.repeat_count = undefined; // # of Repeats Started
    this.restarting   = undefined;

    // Settings (from User)
    this.binding       = undefined;
    this.color         = undefined;
    this.type          = undefined;
    this.name          = undefined;
    this.duration      = undefined;
    this.repeat        = undefined;
    this.repeat_buffer = undefined;
    this.repeat_for    = undefined;
    this.flash         = undefined;
    this.beep          = undefined;

    // Alert DOM Cache
    this.dom = {};
}

Alert.prototype.initialize = function()
{
    this.dom['alert']          = document.getElementById(this.id);
    this.dom['start-reset']    = document.getElementById(this.id + '-start-reset');
    this.dom['beep']           = document.getElementById(this.id + '-beep');
    this.dom['beepbeep']       = document.getElementById(this.id + '-beepbeep');
    this.dom['form']           = document.getElementById(this.id + '-form');
    this.dom['settings']       = document.getElementById(this.id + '-settings');
    this.dom['countdown']      = document.getElementById(this.id + '-countdown');
    this.dom['countdown-name'] = document.getElementById(this.id + '-countdown-name');
    this.dom['countdown-time'] = document.getElementById(this.id + '-countdown-time');

    this.add_settings_to_dom('at',              true);
    this.add_settings_to_dom('binding',         true);
    this.add_settings_to_dom('color',           true);
    this.add_settings_to_dom('type',            true);
    this.add_settings_to_dom('name',            true);
    this.add_settings_to_dom('fixed_duration',  false);
    this.add_settings_to_dom('custom_duration', true);
    this.add_settings_to_dom('repeat',          true);
    this.add_settings_to_dom('repeat_buffer',   true);
    this.add_settings_to_dom('repeat_for',      true);
    this.add_settings_to_dom('flash',           true);
    this.add_settings_to_dom('repeat_flash',    true);
    this.add_settings_to_dom('beep',            true);
    this.add_settings_to_dom('repeat_beep',     true);

    //$(this.dom['settings-at']).change();
    $(this.dom['settings-binding']).change();
    $(this.dom['settings-color']).change();
    $(this.dom['settings-type']).change();
    $(this.dom['settings-name']).change();
    $(this.dom['settings-custom_duration']).change();
    $(this.dom['settings-repeat']).change();
    $(this.dom['settings-repeat_buffer']).change();
    $(this.dom['settings-repeat_for']).change();
    $(this.dom['settings-flash']).change();
    $(this.dom['settings-repeat_flash']).change();
    $(this.dom['settings-beep']).change();
    $(this.dom['settings-repeat_beep']).change();

    // Attach listener to click events on the alert box. If the user clicks
    // outside of the settings, the alert will toggle settings. Start/Reset
    // button starts or resets the timer.
    $(this.dom['alert']).on('click', null, this, function(e) {e.data.toggle_settings();});
    $(this.dom['start-reset']).on('click', null, this, function(e) {e.data.start();});

    // Add optional key binding for starting the alert. The user selects a
    // binding key with a select box. This listener just checks keypresses
    // against the selected value.
    $(window).on('keypress', null, this, function(e)
    {
        var tagName     = document.activeElement.tagName.toLowerCase();
        var not_editing = ['input', 'textarea', 'button', 'select', 'option', 'optgroup', 'fieldset', 'label'].indexOf(tagName) == -1;

        if (not_editing && e.keyCode == (e.data.binding + 48))
            e.data.start();
    });

    // Submitting the form (by pressing enter) should also start the alert
    // timer. The template is responsible for ensuring the form can be
    // submitted in nice ways.
    $(this.dom['form']).on('submit', null, this, function(e)
    {
        //e.data.start();
        e.preventDefault();
    });
};

Alert.prototype.add_settings_to_dom = function(name, listen)
{
    this.dom['settings-' + name]            = document.getElementById(this.id + '-settings-' + name)
    this.dom['settings-' + name + '-field'] = document.getElementById(this.id + '-settings-' + name + '-field')

    if (listen)
    {
        $(this.dom['settings-' + name]).on('change', null, this, function(e) {e.data['change_' + name](e);});
        $(this.dom['settings-' + name]).on('keypress', null, this, function(e)
        {
            if (e.keyCode == 13)
                $(e.data.dom['settings-' + name]).change();
        });
    }
};

Alert.prototype.start = function()
{
    var start = this.finish === undefined;

    if (start && this.duration == 0)
        return;

    if (start)
    {
        this.repeat_count = 0
        this.finish       = new Date().getTime() + (this.duration * 1000);

        var self      = this;
        this.interval = setInterval(function() {self.countdown();}, 10);
    }
    else
    {
        clearInterval(this.interval);
        this.finish       = undefined;
        this.remaining    = undefined;
        this.repeat_count = 0;
        this.restarting   = false;
        this.update_color();
        this.update_duration();
    }
};

Alert.prototype.toggle_settings = function()
{
    $(this.dom['settings']).toggle();
};

Alert.prototype.countdown = function()
{
    if (this.at !== undefined)
    {
        this.finish = new Date().getTime() + (this.at * 1000);
        this.at     = undefined;
    }

    this.remaining = (this.finish - new Date().getTime()) / 1000;

    if (this.remaining <= 0)
        this.remaining = 0;

    this.update_countdown();
    this.update_color();
    this.update_beep();

    if (this.remaining == 0)
    {
        if (!this.restarting && this.repeat_for > -1)
        {
            this.repeat_count++;

            if (AlertMeSoon.debug)
                console.log(this.id, 'count', this.repeat_count);
        }

        if (!this.repeat || this.repeat_count == this.repeat_for)
            this.start();
        else
        {
            this.restarting = this.repeat_buffer > 0 && !this.restarting;
            this.finish = new Date().getTime() + ((this.restarting ? this.repeat_buffer : this.duration) * 1000);
        }
    }
};

//
// Update Graphical Things
//

Alert.prototype.update_countdown = function()
{
    this.dom['countdown-time'].innerHTML = this.remaining.toFixed(2);
};

Alert.prototype.update_color = function()
{
    if (!this.restarting && this.flash && this.remaining <= 1)
        this.dom['alert'].style.backgroundColor = Math.floor((this.remaining / 0.20) % 2) == 0 ? this.color_inverted : this.color;
    else if (this.restarting && this.repeat_flash)
        this.dom['alert'].style.backgroundColor = Math.floor((this.remaining / 0.10) % 2) == 0 ? this.color_inverted : this.color;
    else if (this.restarting)
        this.dom['alert'].style.backgroundColor = 'gray';
    else if (this.dom['alert'].style.backgroundColor !== this.color)
        this.dom['alert'].style.backgroundColor = this.color;
};

Alert.prototype.update_name = function()
{
    var is_custom = (this.type == 'Custom');

    $(this.dom['settings-name-field'])[is_custom ? 'show' : 'hide']();

    this.dom['countdown-name'].innerHTML = this.name;
    this.dom['settings-name'].value = this.name;
};

Alert.prototype.update_duration = function()
{
    var is_custom = (this.type == 'Custom');

    $(this.dom['settings-custom_duration-field']) [is_custom ? 'show' : 'hide']();
    $(this.dom['settings-fixed_duration-field'])  [is_custom ? 'hide' : 'show']();

    this.dom['settings-custom_duration'].value = this.duration;
    this.dom['settings-fixed_duration'].innerHTML = this.duration;

    // Only update the countdown if the timer is not running.
    if (this.finish === undefined)
    {
        this.remaining = this.duration;
        this.update_countdown();
    }
};

Alert.prototype.update_repeat_buffer = function()
{
    $(this.dom['settings-repeat_buffer-field'])[this.repeat ? 'show' : 'hide']();

    this.dom['settings-repeat_buffer'].value = this.repeat_buffer;
};

Alert.prototype.update_repeat_for = function()
{
    $(this.dom['settings-repeat_for-field'])[this.repeat ? 'show' : 'hide']();

    this.dom['settings-repeat_for'].value = this.repeat_for;
};

Alert.prototype.update_repeat_beep = function()
{
    $(this.dom['settings-repeat_beep-field'])[this.repeat ? 'show' : 'hide']();
};

Alert.prototype.update_repeat_flash = function()
{
    $(this.dom['settings-repeat_flash-field'])[this.repeat ? 'show' : 'hide']();
};


Alert.prototype.update_beep = function()
{
    if (this.remaining == 0)
    {
        if (this.restarting && this.repeat_beep)
            this.dom['beepbeep'].play();
        else if (!this.restarting && this.beep)
            this.dom['beep'].play();
    }
};

//
// Change Listeners
//

Alert.prototype.change_at = function(event)
{
    var previous = this.remaining;
    var value    = this.dom['settings-at'].value;

    if (isNaN(Number(value)) || value === "")
        return;

    this.remaining = this.at = Number(value);
    this.update_countdown();

    if (AlertMeSoon.debug)
        console.log(this.id, 'at', this.at);
};

Alert.prototype.change_binding = function(event)
{
    this.binding = Number(this.dom['settings-binding'].value);

    if (AlertMeSoon.debug)
        console.log(this.id, 'binding', this.binding);
};

Alert.prototype.change_color = function(event)
{
    this.color = this.dom['settings-color'].value;

    if (this.color === "")
        this.color = this.dom['settings-color'].value =
            AlertMeSoon.colors[Math.floor(Math.random()*AlertMeSoon.colors.length)].value;

    this.color_inverted = invert_hex_string(this.color);

    this.update_color();

    if (AlertMeSoon.debug)
    {
        console.log(this.id, 'color', this.color);
        console.log(this.id, 'color inverted', this.color_inverted);
    }
};

Alert.prototype.change_type = function(event)
{
    var index = this.dom['settings-type'].selectedIndex;
    var name  = this.dom['settings-type'].options[index].text;
    this.type = name;
    this.name = name;

    var durations = AlertMeSoon.type_durations[this.type];

    this.duration      = durations[0];
    this.repeat_buffer = durations[1];
    this.repeat_for    = durations[2];

    this.update_name();
    this.update_duration();
    this.update_repeat_buffer();
    this.update_repeat_for();

    if (AlertMeSoon.debug)
        console.log(this.id, 'type', this.type);
};

Alert.prototype.change_name = function(event)
{
    this.name = (this.type == 'Custom') ? this.dom['settings-name'].value : this.type;

    this.update_name();

    if (AlertMeSoon.debug)
        console.log(this.id, 'name', this.name);
};

Alert.prototype.change_custom_duration = function(event)
{
    var previous  = this.duration;
    this.duration = Number(this.dom['settings-custom_duration'].value);

    if (isNaN(this.duration))
        this.duration = previous;

    this.update_duration();

    if (AlertMeSoon.debug)
        console.log(this.id, 'duration', this.duration);
};

Alert.prototype.change_repeat = function(event)
{
    this.repeat = this.dom['settings-repeat'].checked;

    this.update_repeat_buffer();
    this.update_repeat_for();
    this.update_repeat_beep();
    this.update_repeat_flash();

    if (AlertMeSoon.debug)
        console.log(this.id, 'repeat', this.repeat);
};

Alert.prototype.change_repeat_buffer = function(event)
{
    this.repeat_buffer = Number(this.dom['settings-repeat_buffer'].value);

    if (AlertMeSoon.debug)
        console.log(this.id, 'repeat buffer', this.repeat_buffer);
};

Alert.prototype.change_repeat_for = function(event)
{
    this.repeat_for = Number(this.dom['settings-repeat_for'].value);

    if (AlertMeSoon.debug)
        console.log(this.id, 'repeat for', this.repeat_for);
};

Alert.prototype.change_beep = function(event)
{
    this.beep = this.dom['settings-beep'].checked;

    if (this.beep)
        this.dom['beep'].play();

    if (AlertMeSoon.debug)
        console.log(this.id, 'beep', this.beep);
};

Alert.prototype.change_repeat_beep = function(event)
{
    this.repeat_beep = this.dom['settings-repeat_beep'].checked;

    if (this.repeat_beep)
        this.dom['beepbeep'].play();

    if (AlertMeSoon.debug)
        console.log(this.id, 'repeat beep', this.repeat_beep);
};

Alert.prototype.change_flash = function(event)
{
    this.flash = this.dom['settings-flash'].checked;

    if (AlertMeSoon.debug)
        console.log(this.id, 'flash', this.flash);
};

Alert.prototype.change_repeat_flash = function(event)
{
    this.repeat_flash = this.dom['settings-repeat_flash'].checked;

    if (AlertMeSoon.debug)
        console.log(this.id, 'repeat flash', this.repeat_flash);
};





lpad = function(str, padString, length)
{
    while (str.length < length)
        str = padString + str;
    return str;
}

function invert_hex_string(hex)
{
    return '#' + lpad((16777215 - parseInt(hex.slice(1), 16)).toString(16).toUpperCase(), '0', 6);
}

})(jQuery, window, document);