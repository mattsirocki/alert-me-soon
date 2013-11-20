;(function ( $, window, document, undefined ) {

window.AlertMeSoon = AlertMeSoon = {};

AlertMeSoon.current_id = 0;
AlertMeSoon.alerts = {};

ValueName = function(value, name)
{
    this.value = value;
    this.name  = name;
}

AlertMeSoon.colors = [
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
    new ValueName('purple',  'Purple'),
    new ValueName('red',     'Red'),
    new ValueName('silver',  'Silver'),
    new ValueName('teal',    'Teal'),
];

AlertMeSoon.types = [
    new ValueName('asv',     'ASV'),
    new ValueName('rage',    'Rage'),
    new ValueName('inspire', 'Inspire'),
    new ValueName('invoke',  'Invoke'),
    new ValueName('custom',  'Custom'),
];

AlertMeSoon.type_durations = {
	'asv':     [150, 10],
	'rage':    [150,  1],
	'inspire': [40,   2],
    'invoke':  [20,   1],
    'custom':  [null, null],
};

Alert = function()
{
	this.id = 'alert-' + (AlertMeSoon.current_id++);

    this.interval   = undefined;
    this.count      = 0;
    this.repeat     = false;
    this.restarting = false;
    this.duration   = undefined;
    this.name       = "";
    this.type       = undefined;
    this.buffer     = undefined;
    this.beep       = false;
    this.flash      = false;
    this.dom        = {};
}

Alert.prototype.initialize = function Alert_initialize_dom() {
    this.dom['alert']                = document.getElementById(this.id);
    this.dom['alert-form']           = document.getElementById(this.id + '-form');
    this.dom['alert-settings']       = document.getElementById(this.id + '-settings');
    this.dom['alert-countdown']      = document.getElementById(this.id + '-countdown');
    this.dom['alert-countdown-name'] = document.getElementById(this.id + '-countdown-name');
    this.dom['alert-countdown-time'] = document.getElementById(this.id + '-countdown-time');
    this.dom['alert-countdown-restarting'] = $('#' + this.id + '-countdown .countdown-restarting');

    this._add_settings_to_dom('color');
    this._add_settings_to_dom('type');
    this._add_settings_to_dom('fixed-duration');
    this._add_settings_to_dom('custom-duration');
    this._add_settings_to_dom('name');
    this._add_settings_to_dom('repeat');
    this._add_settings_to_dom('buffer');
    this._add_settings_to_dom('flash');
    this._add_settings_to_dom('beep');

    this.dom['alert-countdown-restarting'].hide();

    $(this.dom['alert-countdown']).hide();
    this.dom['alert-settings-color'].value = 'purple';
    AlertMeSoon.color(this.id);
    AlertMeSoon.type(this.id);
    AlertMeSoon.repeat(this.id);

    // Attach some event listeners for starting the countdown.
    $(this.dom['alert']).on('click', null, this, function(e) {e.data.toggle();});
    $(this.dom['alert-form']).on('submit', null, this, function(e) {e.data.toggle();});

    $(this.dom['alert-settings-name']).on('change', null, this, function(e) {
        this.set_name(e.target.value);
    });

    $(this.dom['alert-settings-type']).on('change', null, this, function(e) {
        e.data.set_name(e.target.options[e.target.selectedIndex].text);

        $(e.data.dom['alert-settings-name-field'])[e.target.value == 'custom' ? 'show' : 'hide']();
    });


    $(this.dom['alert']).toggle();
};

Alert.prototype.set_name = function(value) {
    this.name = value;
    this.dom['alert-settings-name'].value = this.name;
    $(this.dom['alert-countdown-name']).html(this.name);
};

Alert.prototype._add_settings_to_dom = function(name) {
    this.dom['alert-settings-' + name]            = document.getElementById(this.id + '-settings-' + name)
    this.dom['alert-settings-' + name + '-field'] = document.getElementById(this.id + '-settings-' + name + '-field')
};

Alert.prototype.toggle = function() {
    var start = $(this.dom['alert-settings']).is(':visible');

    AlertMeSoon.color(this.id);

    $(this.dom['alert-settings']).toggle();
    $(this.dom['alert-countdown']).toggle();

    if (start) {
        var self      = this;
        this.count    = this.duration;
        this.interval = setInterval(function() {self.countdown();}, 10);
    }
    else
        clearInterval(this.interval);
};

Alert.prototype.countdown = function() {
    if (this.count <= 0)
        this.count = 0;

    this.dom['alert-countdown-time'].innerHTML = this.count.toFixed(2);

    if (!this.restarting && this.count < 1)
        $(this.dom['alert']).css('backgroundColor', 'red');
    if (this.restarting && this.flash)
        $(this.dom['alert']).css('backgroundColor', (this.count / 0.1).toFixed(0) % 2 == 0 ? 'red' : 'black');
    else if (this.restarting)
        $(this.dom['alert']).css('backgroundColor', 'gray');


    if (this.count == 0) {
        if (this.repeat) {
            this.restarting = !this.restarting;
            this.count = this.restarting ? this.buffer : this.duration;
            if (this.restarting)
                this.dom['alert-countdown-restarting'].show();
            else {
                this.dom['alert-countdown-restarting'].hide();
                AlertMeSoon.color(this.id);
                $(this.dom['alert-countdown-name']).html(this.name);
            }
        }
        else
            this.toggle();
    } else
        this.count -= 0.01;
};















AlertMeSoon.color = function(id)
{
	var a = AlertMeSoon.alerts[id];

	a.dom['alert'].style.backgroundColor = a.dom['alert-settings-color'].value;
}

AlertMeSoon.type = function(id)
{
	var a      = AlertMeSoon.alerts[id];
	var type   = a.dom['alert-settings-type'].value;
	var times  = AlertMeSoon.type_durations[type];
    var custom = a.dom['alert-settings-type'].value == 'custom';

	if (times !== undefined)
	{
        if (times[0]) {
            a.dom['alert-settings-custom-duration'].value    = times[0];
            a.dom['alert-settings-fixed-duration'].innerHTML = times[0];
            a.duration = times[0];
        }

        if (times[1]) {
            a.dom['alert-settings-buffer'].value             = times[1];
            a.buffer   = times[1];
        }
	}

    $(a.dom['alert-settings-custom-duration-field'])[custom ? 'show' : 'hide']();
    $(a.dom['alert-settings-fixed-duration-field'])[custom ? 'hide' : 'show']();
}

AlertMeSoon.repeat = function(id) {
	var a = AlertMeSoon.alerts[id];
    a.repeat = a.dom['alert-settings-repeat'].checked;
	$(a.dom['alert-settings-buffer-field'])[a.repeat ? 'show' : 'hide']();
}

AlertMeSoon.duration = function(id) {
    var a = AlertMeSoon.alerts[id];
    a.duration = Number(a.dom['alert-settings-custom-duration'].value);
}

AlertMeSoon.buffer = function(id) {
    var a = AlertMeSoon.alerts[id];
    a.buffer = Number(a.dom['alert-settings-buffer'].value);
}

AlertMeSoon.flash = function(id) {
    var a = AlertMeSoon.alerts[id];
    a.flash = a.dom['alert-settings-flash'].checked;
}

AlertMeSoon.beep = function(id) {
    var a = AlertMeSoon.alerts[id];
    a.beep = a.dom['alert-settings-beep'].checked;
}


AlertMeSoon.add = function(template)
{
	var a = new Alert();

	AlertMeSoon.alerts[a.id] = a;

    $('body').append(template({alert: a, colors: this.colors, types: this.types}));

    a.initialize();
}

})(jQuery, window, document);