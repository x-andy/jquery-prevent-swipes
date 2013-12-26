describe('#preventSwipes', function() {
  var eventSpy;
  
  it('works', function() {
    $('body').preventSwipes();
  });

  describe('when there are no scrollable elements', function() {
    beforeEach(function() {
      setFixtures('<div class="layer1"></div>');
      eventSpy = spyOnEvent('.layer1', 'mousewheel');
      $('.layer1').preventSwipes();
    });

    scrolling('.layer1', {deltaX:  1}, isPrevented);
    scrolling('.layer1', {deltaX: -1}, isPrevented);
    scrolling('.layer1', {deltaY:  1}, isPrevented);
    scrolling('.layer1', {deltaY: -1}, isPrevented);
  });

  describe('when there is a horizontally scrollable element', function() {
    beforeEach(function() {
      setFixtures('\
        <div class="layer1">\
          <div class="layer2"></div>\
        </div>\
      ');
      eventSpy = spyOnEvent('.layer1', 'mousewheel');
      $('.layer1').preventSwipes();
    });

    describe('scrolled to the left', function() {
      scrolling('.layer2', {deltaX:  1}, isAllowed);
      scrolling('.layer2', {deltaX: -1}, isPrevented);
      scrolling('.layer2', {deltaY:  1}, isPrevented);
      scrolling('.layer2', {deltaY: -1}, isPrevented);
    });

    describe('scrolled to the right', function() {
      beforeEach(function() {
        $('.layer1').scrollLeft(9999);
      });

      scrolling('.layer2', {deltaX:  1}, isPrevented);
      scrolling('.layer2', {deltaX: -1}, isAllowed);
      scrolling('.layer2', {deltaY:  1}, isPrevented);
      scrolling('.layer2', {deltaY: -1}, isPrevented);
    });

  });

  describe('when there is a vertically scrollable element', function() {
    beforeEach(function() {
      setFixtures('\
        <div class="panel">\
          <div class="content"></div>\
        </div>\
      ');
      eventSpy = spyOnEvent('.panel', 'mousewheel');
      $('.panel').preventSwipes();
    });

    describe('scrolled to the top', function() {
      scrolling('.content', {deltaX:  1}, isPrevented);
      scrolling('.content', {deltaX: -1}, isPrevented);
      scrolling('.content', {deltaY:  1}, isPrevented);
      scrolling('.content', {deltaY: -1}, isAllowed);
    });

    describe('scrolled to the bottom', function() {
      beforeEach(function() {
        $('.panel').scrollTop(9999);
      });

      scrolling('.content', {deltaX:  1}, isPrevented);
      scrolling('.content', {deltaX: -1}, isPrevented);
      scrolling('.content', {deltaY:  1}, isAllowed);
      scrolling('.content', {deltaY: -1}, isPrevented);
    });
  });

  function scrolling(selector, options, expecation) {
    describe('scrolling ' + JSON.stringify(options), function() {
      beforeEach(function() {
        $(selector).trigger(mousewheel(options));
      });
      expecation();
    })
  }

  function isAllowed() {
    it('is allowed', function() {
      expect(eventSpy).not.toHaveBeenPrevented();
    });
  }

  function isPrevented() {
    it('is prevented', function() {
      expect(eventSpy).toHaveBeenPrevented();
    });
  }

  function mousewheel(options) {
    return $.extend({
      type: 'mousewheel',
      deltaX: 0,
      deltaY: 0
    }, options);
  }
});

