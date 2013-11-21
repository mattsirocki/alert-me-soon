;(function ( $, window, document, undefined ) {

window.AlertMeSoon = AlertMeSoon = {};
$.get('resources/template.html', function(data) {AlertMeSoon.template = Handlebars.compile(data);});

AlertMeSoon.default_color = 'purple';

AlertMeSoon.current_id = 0;

ValueName = function(value, name)
{
    this.value = value;
    this.name  = name;
}

AlertMeSoon.colors = [
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

AlertMeSoon.types = [
    new ValueName('custom',  'Custom'),
];

AlertMeSoon.add_type = function(value, name, duration, buffer)
{
    AlertMeSoon.types.push(new ValueName(value, name));
    AlertMeSoon.type_durations[value] = [duration, buffer];
};

AlertMeSoon.type_durations = {
    'custom':  [10, 1],
};

Alert = function()
{
    this.number = AlertMeSoon.current_id++;
    this.id = 'alert-' + this.number;

    this.seconds = 0;

    this.interval   = undefined;
    this.count      = 0;
    this.repeat     = false;
    this.restarting = false;
    this.duration   = 0;
    this.name       = "";
    this.type       = undefined;
    this.buffer     = 0;
    this.beep       = false;
    this.flash      = false;
    this.dom        = {};
}

Alert.prototype.initialize = function Alert_initialize_dom() {
    this.dom['alert']                = document.getElementById(this.id);
    this.dom['alert-beep']           = document.getElementById(this.id + '-beep');
    this.dom['alert-beepbeep']       = document.getElementById(this.id + '-beepbeep');
    this.dom['alert-form']           = document.getElementById(this.id + '-form');
    this.dom['alert-settings']       = document.getElementById(this.id + '-settings');
    this.dom['alert-countdown']      = document.getElementById(this.id + '-countdown');
    this.dom['alert-countdown-name'] = document.getElementById(this.id + '-countdown-name');
    this.dom['alert-countdown-time'] = document.getElementById(this.id + '-countdown-time');
    this.dom['alert-countdown-restarting'] = $('#' + this.id + '-countdown .countdown-restarting');

    $(this.dom['alert-countdown']).hide();

    this._add_settings_to_dom('color',           true);
    this._add_settings_to_dom('type',            true);
    this._add_settings_to_dom('fixed-duration',  false);
    this._add_settings_to_dom('custom_duration', true);
    this._add_settings_to_dom('name',            true);
    this._add_settings_to_dom('repeat',          true);
    this._add_settings_to_dom('buffer',          true);
    this._add_settings_to_dom('flash',           true);
    this._add_settings_to_dom('beep',            true);

    this.dom['alert-countdown-restarting'].hide();

    this.dom['alert-settings-color'].value = AlertMeSoon.default_color;

    this.set_color();
    this.set_type();
    this.set_name();
    this.set_repeat();
    this.set_custom_duration();
    this.set_buffer();
    this.set_flash();
    this.set_beep();

    // Attach some event listeners for starting the countdown.
    $(this.dom['alert']).on('click', null, this, function(e) {e.data.toggle();});

    $(window).on('keypress', null, this, function(e) {
        var tagName     = document.activeElement.tagName.toLowerCase();
        var not_editing = ['input', 'textarea', 'button', 'select', 'option', 'optgroup', 'fieldset', 'label'].indexOf(tagName) == -1;

        if (not_editing && e.keyCode == (e.data.number + 48))
            e.data.toggle();
    });

    $(this.dom['alert-form']).on('submit', null, this, function(e) {
        e.data.toggle();
        e.preventDefault();
    });
};

Alert.prototype._add_settings_to_dom = function(name, listen)
{
    this.dom['alert-settings-' + name]            = document.getElementById(this.id + '-settings-' + name)
    this.dom['alert-settings-' + name + '-field'] = document.getElementById(this.id + '-settings-' + name + '-field')

    if (listen)
        $(this.dom['alert-settings-' + name]).on('change', null, this, function(e) {e.data['set_' + name]();});
};

Alert.prototype.toggle = function()
{
    var start = $(this.dom['alert-settings']).is(':visible');

    if (start && this.duration == 0)
        return;

    if (start) {
        this.finish   = new Date().getTime() + (this.duration * 1000);

        var self      = this;
        this.interval = setInterval(function() {self.countdown();}, 10);
    } else {
        clearInterval(this.interval);
        this.remaining = undefined;
        this.finish    = undefined;
        this.restarting = false;
        this.update_color();
        this.update_restarting();
    }

    $(this.dom['alert-settings']).toggle();
    $(this.dom['alert-countdown']).toggle();
};

Alert.prototype.update_countdown = function()
{
    this.dom['alert-countdown-time'].innerHTML = this.remaining.toFixed(2);
};

Alert.prototype.countdown = function()
{
    this.remaining = (this.finish - new Date().getTime()) / 1000;
    //console.log(true);

    if (this.remaining <= 0)
        this.remaining = 0;

    this.update_color();
    this.update_countdown();
    this.update_beep();

    if (this.remaining == 0)
    {
        if (!this.repeat)
            this.toggle();
        else
        {
            this.restarting = this.buffer > 0 && !this.restarting;
            this.finish = new Date().getTime() + ((this.restarting ? this.buffer : this.duration) * 1000);
            this.update_restarting();
        }
    }
};

Alert.prototype.update_restarting = function()
{
    this.dom['alert-countdown-restarting'][this.restarting ? 'show' : 'hide']();
};

Alert.prototype.update_beep = function()
{
    if (this.beep && this.remaining == 0)
    {
        if (this.restarting)
            this.dom['alert-beepbeep'].play();
        else
            this.dom['alert-beep'].play();
    }

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
        $(this.dom['alert']).css('backgroundColor', this.dom['alert-settings-color'].value);
};





Alert.prototype.set_color = function()
{
    this.color = this.dom['alert-settings-color'].value;
    $(this.dom['alert']).css('backgroundColor', this.color);
    //console.log('set color to ' + this.color);
};

Alert.prototype.update_name = function()
{
    var index = this.dom['alert-settings-type'].selectedIndex;
    var name  = this.dom['alert-settings-type'].options[index].text;
    this.dom['alert-settings-name'].value = name;
    this.set_name();
};

Alert.prototype.set_type = function()
{
    this.type     = this.dom['alert-settings-type'].value;
    //console.log('set type to ' + this.type);

    var times     = AlertMeSoon.type_durations[this.type];
    var is_custom = this.type == 'custom';

    if (times !== undefined)
    {
        if (times[0]) {
            this.dom['alert-settings-custom_duration'].value    = times[0];
            this.dom['alert-settings-fixed-duration'].innerHTML = times[0];
            this.duration = times[0];
        }

        if (times[1]) {
            this.dom['alert-settings-buffer'].value             = times[1];
            this.buffer   = times[1];
        }
    }

    this.update_name();
    $(this.dom['alert-settings-name-field'])[is_custom ? 'show' : 'hide']();
    $(this.dom['alert-settings-custom_duration-field'])[is_custom ? 'show' : 'hide']();
    $(this.dom['alert-settings-fixed-duration-field'])[is_custom ? 'hide' : 'show']();
};

Alert.prototype.set_name = function()
{
    this.name = this.dom['alert-settings-name'].value;
    //console.log('set name to ' + this.name);

    this.dom['alert-countdown-name'].innerHTML = this.name;
};

Alert.prototype.set_repeat = function()
{
    this.repeat = this.dom['alert-settings-repeat'].checked;
    //console.log('set repeat to ' + this.repeat);

    // If the 'repeat' box is checked, show the buffer input field.
    $(this.dom['alert-settings-buffer-field'])[this.repeat ? 'show' : 'hide']();
};

Alert.prototype.set_custom_duration = function(id)
{
    this.duration = Number(this.dom['alert-settings-custom_duration'].value);
    //console.log('set duration to ' + this.duration);
}

Alert.prototype.set_buffer = function(id)
{
    this.buffer = Number(this.dom['alert-settings-buffer'].value);
    //console.log('set buffer to ' + this.buffer);
}

Alert.prototype.set_flash = function(id)
{
    this.flash = this.dom['alert-settings-flash'].checked;
    //console.log('set flash to ' + this.flash);
}

Alert.prototype.set_beep = function(id)
{
    this.beep = this.dom['alert-settings-beep'].checked;
    //console.log('set beep to ' + this.beep);
}

AlertMeSoon.add = function(template)
{
    var a = new Alert();

    $('body').append(template({alert: a, colors: this.colors, types: this.types}));

    a.initialize();
}

$(document).ready(function()
{
    $('#add-alert').on('click', function(e) {AlertMeSoon.add(AlertMeSoon.template);});
});

})(jQuery, window, document);