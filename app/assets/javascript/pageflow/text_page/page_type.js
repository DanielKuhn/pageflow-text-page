pageflow.react.registerPageTypeWithDefaultBackground('text_page', {

  prepareNextPageTimeout: 0,

  enhance: function(pageElement, configuration) {
    this.content = pageElement.find('.scroller');
    this.scrollingDiv = pageElement.find('.scroller > div');
    this.pageSpacerElement = pageElement.find('.page_spacer');
    this.contentArea = pageElement.find('.contentText');
    this.backgroundAsset = pageElement.find('.page_background_asset');
    this.inlineImage = pageElement.find('.inline_image');
    this.inlineImageInitialOffset = pageElement.find('.contentText h3').position().top + pageElement.find('.contentText h3').outerHeight();
    this.fullScreenLayer = pageElement.find('.image_fullscreen_view');

    if(configuration.text_position == "left" || configuration.text_position == "right") {
      this.titleArea = pageElement.find('.backgroundArea .fixed_header_area');
    }
    else {
      this.titleArea = pageElement.find('.contentInnerWrapper .page_header');
    }

    this.resizePageSpacer(pageElement, configuration);

    pageElement.data('invertIndicator', !configuration.invert_text);
    this.updateScrollEventListeners(pageElement, configuration);

    if(!pageflow.features.has('mobile platform')) {
      $(this.inlineImage).on('click', function(e) {
        if(!configuration.prevent_fullscreen){
          $('body').toggleClass('bigScreen');
          e.preventDefault();
        }
      });
      $(this.fullScreenLayer).on('click', function() {
        $('body').toggleClass('bigScreen');

      });
    }
  },

  updateScrollEventListeners: function(pageElement, configuration) {
    var pageType = this;
    pageType.storedConfiguration = configuration;

    if (!pageType.scrollEventHandlerAdded) {
      pageType.scrollEventHandlerAdded = true;

      pageType.content.scroller('onScroll', function() {
        pageType.applyBackgroundEffects(pageElement, pageType.storedConfiguration);
        pageType.applyInlineImageEffects(pageElement, pageType.storedConfiguration);
      });

      pageType.content.scroller('onScrollEnd', function() {
        pageType.applyBackgroundEffects(pageElement, pageType.storedConfiguration);
      });
    }
  },

  applyBackgroundEffects: function(pageElement, configuration) {
    var y = this.content.scroller('positionY'),
      earlyDimOffset = pageElement.height() / 20,
      titleOffset = configuration.text_position == "left" || configuration.text_position == "right" ? 0 : this.titleArea.height(),
      dimHeight = this.pageSpacerElement.height() - titleOffset - earlyDimOffset,
      dimHeightTitle = this.pageSpacerElement.height() - earlyDimOffset,
      spacerPageRatio = dimHeight / pageElement.height();

    pageElement.find('.backgroundArea .fixed_header_area').css('opacity', (0.6 * dimHeightTitle + y)/(dimHeightTitle * 0.6)); // Abblenden des Titels, immer*/

    if(configuration.topasset_dim) {
      this.backgroundAsset.css('opacity', 1 - (-y / dimHeight)); // Abblenden */
    }
    else {
      this.backgroundAsset.css('opacity', 1);
    }

    var parallaxPosition = y * 0.2;

    if(configuration.topasset_parallax) {
      this.backgroundAsset.css({"-webkit-transform":"translateY(" + parallaxPosition + "px)", "-moz-transform":"translateY(" + parallaxPosition + "px)", "-ms-transform":"translateY(" + parallaxPosition + "px)", "-o-transform":"translateY(" + parallaxPosition + "px)", "transform":"translateY(" + parallaxPosition + "px)"}); // Parallax
    }
    else {
      this.backgroundAsset.css({'-webkit-transform': 'translateY(0)','-o-transform': 'translateY(0)','-ms-transform': 'translateY(0)', '-moz-transform': 'translateY(0)', 'transform': 'translateY(0)'}); // Parallax
    }
  },

  applyInlineImageEffects: function(pageElement, configuration) {
    if(pageElement.width() >= 700) {
      if(configuration.sticky_inline_image) {
        var y = this.content.scroller('positionY'),
          calcMarginTop = this.inlineImage.outerHeight() < pageElement.height() ? (pageElement.height() - this.inlineImage.outerHeight()) / 2 : (pageElement.height() - this.inlineImage.outerHeight()),
          limitToReach = calcMarginTop - this.inlineImageInitialTop;

        if(y <= limitToReach) {
          this.inlineImage.css('top', ((-y - this.inlineImageInitialTop + this.inlineImageInitialOffset + calcMarginTop)) + 'px');
        }
        else {
          this.inlineImage.css('top', (this.inlineImageInitialOffset) + 'px');
        }
      }
      else {
        if(configuration.inline_text_position == "center") {
          this.inlineImage.css('top', '0px');
        }
        else {
          this.inlineImage.css('top', (this.inlineImageInitialOffset) + 'px');
        }
      }
    }
    else {
      this.inlineImage.css('top', '0px');
    }
  },

  resizePageSpacer: function(pageElement, configuration) {
    if(pageElement.find('.content_and_background').hasClass('no_background_asset')) {
      this.pageSpacerElement.css('height', this.titleArea.outerHeight() + 'px');
    }
    else {
      if (configuration.text_coverage == 'banner') {
        var bannerHeight = this.titleArea.outerHeight() > pageElement.height() / 3 ? this.titleArea.outerHeight() : pageElement.height() / 3;
        this.pageSpacerElement.css('height', bannerHeight + 'px');
      }
      else if (configuration.text_coverage == 'title_only') {
        this.pageSpacerElement.css('height', pageElement.height() + 'px');
      }
      else {
        if (pageElement.height() - 200 > 200) {
          this.pageSpacerElement.css('height', pageElement.height() - 200 + 'px');
        }
      }
    }

    this.backgroundAsset.css('height', this.pageSpacerElement.height() + 'px');

    this.contentArea.css('min-height', pageElement.height() + 'px'); //min-heights for white area/ text area for short text?
    this.content.scroller('refresh');
  },

  resize: function(pageElement, configuration) {
    var y = this.content.scroller('positionY');

    this.resizePageSpacer(pageElement, configuration);
    this.inlineImageInitialOffset = pageElement.find('.contentText h3').position().top;
    this.inlineImage.css('top', this.inlineImageInitialOffset + 'px');
    this.inlineImageInitialTop = this.inlineImage.offset().top - this.scrollingDiv.offset().top;
    this.applyInlineImageEffects(pageElement, configuration);
    this.applyBackgroundEffects(pageElement, configuration);
  },

  prepare: function(pageElement, configuration) {
  },

  activating: function(pageElement, configuration) {
    var y = this.content.scroller('positionY');

    this.resizePageSpacer(pageElement, configuration);
    this.inlineImageInitialOffset = pageElement.find('.contentText h3').position().top + pageElement.find('.contentText h3').outerHeight();
    this.inlineImage.css('top', this.inlineImageInitialOffset + 'px');
    this.inlineImageInitialTop = this.inlineImage.offset().top - this.scrollingDiv.offset().top;

    this.applyBackgroundEffects(pageElement, configuration);

    this.applyInlineImageEffects(pageElement, configuration);
  },

  activated: function(pageElement, configuration) {
  },

  deactivating: function(pageElement, configuration) {
    $('body').removeClass('bigScreen');
  },

  deactivated: function(pageElement, configuration) {},

  update: function(pageElement, configuration) {
    var y = this.content.scroller('positionY');

    pageElement.attr('data-template', 'text_page');
    pageElement.find('h2 .tagline').text(configuration.get('tagline') || '');
    pageElement.find('h2 .title').text(configuration.get('title') || '');
    pageElement.find('h2 .subtitle').text(configuration.get('subtitle') || '');
    pageElement.find('.contentText .text_title').text(configuration.get('text_title') || '');
    pageElement.find('.contentText p').html(configuration.get('text') || '');

    pageElement.find('.content_and_background').toggleClass('no_background_asset',
                                                            configuration.get('background_type') == 'video' ?
                                                            !configuration.getVideoFile('video_file_id') :
                                                            !configuration.getImageFile('background_image_id'));

    pageElement.find('.content_and_background').toggleClass('sticky_inline_image', !!configuration.get('sticky_inline_image'));

    if(configuration.get('text_position') == "left" || configuration.get('text_position') == "right") {
      this.titleArea = pageElement.find('.backgroundArea .fixed_header_area');
    }
    else {
      this.titleArea = pageElement.find('.contentInnerWrapper .page_header');
    }

    _.forEach(pageflow.textPage.titlePositions, function(position) {
      pageElement.toggleClass('text_position_' + position, configuration.get('text_position') === position);
    });

    _.forEach(pageflow.textPage.inlineTextPositions, function(position) {
      pageElement.find('.content').toggleClass('inline_text_position_' + position, configuration.get('inline_text_position') === position);
    });

    if(!configuration.get('inline_text_position')) {
      pageElement.find('.content').addClass('inline_text_position_left');
    }

    if(!configuration.get('prevent_fullscreen') && configuration.get('text_image_id')) {
      this.inlineImage.attr('href', configuration.getImageFileUrl('text_image_id'));
    }
    else {
      this.inlineImage.attr('href', '#');
    }
    this.inlineImage.toggleClass('allow_fullscreen', !configuration.get('prevent_fullscreen'));

    _.forEach(pageflow.textPage.textCoverageOptions, function(option) {
      pageElement.toggleClass(option, configuration.get('text_coverage') === option);
    });

    pageElement.find('.content_and_background').toggleClass('invert_text', !!configuration.get('invert_text'));
    pageElement.data('invertIndicator', !configuration.get('invert_text'));

    pageElement.find('.shadow, .header_background_layer').css({
      opacity: configuration.get('gradient_opacity') / 100
    });


    this.resizePageSpacer(pageElement, configuration.attributes);

    this.inlineImageInitialOffset = pageElement.find('.contentText h3').position().top + pageElement.find('.contentText h3').outerHeight();
    this.inlineImage.css('top', this.inlineImageInitialOffset + 'px');
    this.inlineImageInitialTop = this.inlineImage.offset().top - this.scrollingDiv.offset().top;
    this.applyInlineImageEffects(pageElement, configuration.attributes);
    this.applyBackgroundEffects(pageElement, configuration.attributes);
    this.updateScrollEventListeners(pageElement, configuration.attributes);
  },

  embeddedEditorViews: function() {
    return {
      '.inline_image': {
        view: pageflow.textPage.ContentImageEmbeddedView,
        options: {
          imagePropertyName: 'text_image_id',
          descriptionPropertyName: 'image_description'
        }
      },
      '.image_fullscreen_inner_wrapper': {
        view: pageflow.textPage.ContentImageEmbeddedView,
        options: {
          imagePropertyName: 'text_image_id',
          descriptionPropertyName: 'image_description'
        }
      }
    };
  }
});
