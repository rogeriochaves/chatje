module Styles exposing (body)

import Element exposing (..)
import Element.Background as Background
import Element.Font as Font


body : List (Attr decorative msg)
body =
    [ Background.color (rgb 0.1 0.1 0.1)
    , Font.color (rgb 255 255 255)
    , Font.size 14
    ]
