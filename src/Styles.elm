module Styles exposing (authorName, body, button, fieldInput, messageBox, messageBoxInput, selfName, unreadThread)

import Element exposing (..)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Html.Attributes


body : List (Attr () msg)
body =
    [ Background.color (rgb255 32 32 32)
    , Font.color (rgb255 255 255 255)
    , Font.size 13
    , Font.family
        [ Font.typeface "Lucida Grande"
        , Font.sansSerif
        ]
    , htmlAttribute (Html.Attributes.style "word-wrap" "break-word")
    ]


authorName : List (Attribute msg)
authorName =
    [ Font.alignRight
    , Font.bold
    , Font.color (rgb255 196 175 117)
    ]


selfName : List (Attribute msg)
selfName =
    authorName
        ++ [ Font.color (rgb255 157 180 198)
           ]


messageBox : List (Attribute msg)
messageBox =
    [ Border.color (rgb255 255 255 255)
    , Border.widthEach { top = 5, right = 0, bottom = 0, left = 0 }
    ]


messageBoxInput : List (Attribute msg)
messageBoxInput =
    [ Background.color (rgb255 32 32 32)
    , Border.width 0
    ]


fieldInput : List (Attribute msg)
fieldInput =
    [ Font.color (rgb255 0 0 0)
    ]


button : List (Attribute msg)
button =
    [ Border.color (rgb255 255 255 255)
    ]


unreadThread : List (Attribute msg)
unreadThread =
    [ Font.color (rgb255 196 175 117)
    ]
