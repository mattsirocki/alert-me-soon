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

AlertMeSoon.debug = false;
AlertMeSoon.current_id = 0;

AlertMeSoon.colors =
[
    new ValueName('purple',  'Purple'),
    new ValueName('#ffa5d2', 'Pink ("Baby Pink")'),
    new ValueName('#ff69b4', 'Pink ("Hot Pink")'),
    new ValueName('aqua',    'Aqua'),
    new ValueName('black',   'Black'),
    new ValueName('blue',    'Blue'),
    new ValueName('fuchsia', 'Fuchsia'),
    new ValueName('gray',    'Gray'),
    new ValueName('green',   'Green'),
    new ValueName('lime',    'Lime'),
    new ValueName('maroon',  'Maroon'),
    new ValueName('navy',    'Navy'),
    new ValueName('olive',   'Olive'),
    new ValueName('orange',  'Orange'),
    //new ValueName('red',     'Red'),
    new ValueName('silver',  'Silver'),
    new ValueName('teal',    'Teal'),
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
    this.add_settings_to_dom('repeat_beep',     true);
    this.add_settings_to_dom('flash',           true);
    this.add_settings_to_dom('beep',            true);

    //$(this.dom['settings-at']).change();
    $(this.dom['settings-binding']).change();
    $(this.dom['settings-color']).change();
    $(this.dom['settings-type']).change();
    $(this.dom['settings-name']).change();
    $(this.dom['settings-custom_duration']).change();
    $(this.dom['settings-repeat']).change();
    $(this.dom['settings-repeat_buffer']).change();
    $(this.dom['settings-repeat_for']).change();
    $(this.dom['settings-repeat_beep']).change();
    $(this.dom['settings-flash']).change();
    $(this.dom['settings-beep']).change();

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
        e.data.start();
        e.preventDefault();
    });
};

Alert.prototype.add_settings_to_dom = function(name, listen)
{
    this.dom['settings-' + name]            = document.getElementById(this.id + '-settings-' + name)
    this.dom['settings-' + name + '-field'] = document.getElementById(this.id + '-settings-' + name + '-field')

    if (listen)
        $(this.dom['settings-' + name]).on('change', null, this, function(e) {e.data['change_' + name](e);});
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
    if (!this.restarting && this.remaining <= 1 && this.flash)
        $(this.dom['alert']).css('backgroundColor', Math.floor((this.remaining / 0.33) % 2) == 0 ? 'red' : this.color);
    else if (this.restarting && this.flash)
        $(this.dom['alert']).css('backgroundColor', Math.floor((this.remaining / 0.10) % 2) == 0 ? 'red' : this.color);
    else if (!this.restarting && this.remaining <= 1)
        $(this.dom['alert']).css('backgroundColor', 'red');
    else if (this.restarting)
        $(this.dom['alert']).css('backgroundColor', 'gray');
    else
        $(this.dom['alert']).css('backgroundColor', this.dom['settings-color'].value);
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
    this.at = Number(this.dom['settings-at'].value);
    this.dom['settings-at'].value = "";

    if (isNaN(this.at))
        this.at = previous

    this.remaining = this.at;

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

    this.update_color();

    if (AlertMeSoon.debug)
        console.log(this.id, 'color', this.color);
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

Alert.prototype.change_beep = function(event)
{
    this.beep = this.dom['settings-beep'].checked;

    if (this.beep)
        this.dom['beep'].play();

    if (AlertMeSoon.debug)
        console.log(this.id, 'beep', this.beep);
};

})(jQuery, window, document);