const adaptiveCardsHostConfig = (function () {
  'use strict';

  const hostConfig = function () {
    return {
      "hostCapabilities": {
        "capabilities": null
      },
      "choiceSetInputValueSeparator": ",",
      "supportsInteractivity": true,
      "fontTypes": {
        "default": {
          "fontFamily": "Calibri, sans-serif",
          "fontSizes": {
            "small": 12,
            "default": 14,
            "medium": 17,
            "large": 21,
            "extraLarge": 26
          },
          "fontWeights": {
            "lighter": 200,
            "default": 400,
            "bolder": 600
          }
        },
        "monospace": {
          "fontFamily": "'Courier New', Courier, monospace",
          "fontSizes": {
            "small": 12,
            "default": 14,
            "medium": 17,
            "large": 21,
            "extraLarge": 26
          },
          "fontWeights": {
            "lighter": 200,
            "default": 400,
            "bolder": 600
          }
        }
      },
      "spacing": {
        "small": 3,
        "default": 8,
        "medium": 20,
        "large": 30,
        "extraLarge": 40,
        "padding": 10
      },
      "separator": {
        "lineThickness": 1,
        "lineColor": "#343A40"
      },
      "imageSizes": {
        "small": 40,
        "medium": 80,
        "large": 160
      },
      "containerStyles": {
        "default": {
          "foregroundColors": {
            "default": {
              "default": "#000000",
              "subtle": "#767676",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "dark": {
              "default": "#000000",
              "subtle": "#66000000",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "light": {
              "default": "#FFFFFF",
              "subtle": "#33000000",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "accent": {
              "default": "#0063B1",
              "subtle": "#0063B1",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "good": {
              "default": "#54a254",
              "subtle": "#DD54a254",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "warning": {
              "default": "#c3ab23",
              "subtle": "#DDc3ab23",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "attention": {
              "default": "#FF0000",
              "subtle": "#DDFF0000",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            }
          },
          "backgroundColor": "#FFFFFF"
        },
        "emphasis": {
          "foregroundColors": {
            "default": {
              "default": "#f9b700",
              "subtle": "#767676",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "dark": {
              "default": "#000000",
              "subtle": "#66000000",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "light": {
              "default": "#FFFFFF",
              "subtle": "#33000000",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "accent": {
              "default": "#2E89FC",
              "subtle": "#882E89FC",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "good": {
              "default": "#54a254",
              "subtle": "#DD54a254",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "warning": {
              "default": "#c3ab23",
              "subtle": "#DDc3ab23",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            },
            "attention": {
              "default": "#FF0000",
              "subtle": "#DDFF0000",
              "highlightColors": {
                "default": "#22000000",
                "subtle": "#11000000"
              }
            }
          },
          "backgroundColor": "#F0F0F0"
        }
      },
      "actions": {
        "maxActions": 100,
        "spacing": "Default",
        "buttonSpacing": 8,
        "showCard": {
          "actionMode": "Inline",
          "inlineTopMargin": 8,
          "style": "emphasis"
        },
        "preExpandSingleShowCardAction": false,
        "actionsOrientation": "horizontal",
        "actionAlignment": "Stretch",
        "allowTitleToWrap": false
      },
      "adaptiveCard": {
        "allowCustomStyle": true
      },
      "imageSet": {
        "maxImageHeight": 100
      },
      "media": {
        "allowInlinePlayback": true
      },
      "factSet": {
        "title": {
          "size": "Default",
          "color": "Default",
          "isSubtle": false,
          "weight": "Bolder",
          "wrap": true
        },
        "value": {
          "size": "Default",
          "color": "Default",
          "isSubtle": false,
          "weight": "Default",
          "wrap": true
        },
        "spacing": 8
      },
      "cssClassNamePrefix": null,
      "_legacyFontType": {
        "fontFamily": "Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif",
        "fontSizes": {
          "small": 12,
          "default": 14,
          "medium": 17,
          "large": 21,
          "extraLarge": 26
        },
        "fontWeights": {
          "lighter": 200,
          "default": 400,
          "bolder": 600
        }
      }
    };
  };
  
  return hostConfig;
})()